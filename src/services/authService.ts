import {
    apiFetch,
    isApiClientError,
    isApiUnauthorizedError,
    type ApiClientError,
} from "@/src/lib/api-client";
import {
    logoutAuth,
    persistAuthSession,
    type AuthUser,
} from "@/src/store/useAuthStore";

type AuthApiResponse = {
  access_token?: unknown;
  token?: unknown;
  user?: unknown;
  errors?: unknown;
  message?: unknown;
};

export type AuthErrorKind =
  | "validation"
  | "network"
  | "unauthorized"
  | "server"
  | "invalid_response"
  | "unknown";

export type AuthFieldErrors = Record<string, string>;

export class AuthServiceError extends Error {
  kind: AuthErrorKind;
  status: number;
  fieldErrors: AuthFieldErrors | null;
  cause: unknown;

  constructor(input: {
    message: string;
    kind: AuthErrorKind;
    status?: number;
    fieldErrors?: AuthFieldErrors | null;
    cause?: unknown;
  }) {
    super(input.message);
    this.name = "AuthServiceError";
    this.kind = input.kind;
    this.status = Number.isFinite(input.status) ? Math.trunc(Number(input.status)) : 0;
    this.fieldErrors = input.fieldErrors ?? null;
    this.cause = input.cause;
  }
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResult = {
  token: string;
  user: AuthUser | null;
  mustChangePassword: boolean;
};

const extractFieldErrors = (error: ApiClientError): AuthFieldErrors | null => {
  const rawErrors = (error.data as { errors?: unknown } | null)?.errors;
  if (!rawErrors || typeof rawErrors !== "object") {
    return null;
  }

  const normalized: AuthFieldErrors = {};

  for (const [field, value] of Object.entries(rawErrors as Record<string, unknown>)) {
    if (Array.isArray(value) && value.length > 0) {
      const message = String(value[0] ?? "").trim();
      if (message) normalized[field] = message;
      continue;
    }

    const message = String(value ?? "").trim();
    if (message) normalized[field] = message;
  }

  return Object.keys(normalized).length > 0 ? normalized : null;
};

export const toAuthServiceError = (
  error: unknown,
  fallbackMessage = "Une erreur est survenue."
): AuthServiceError => {
  if (error instanceof AuthServiceError) {
    return error;
  }

  if (isApiClientError(error)) {
    if (isApiUnauthorizedError(error)) {
      return new AuthServiceError({
        message: error.message || "Session expirée.",
        kind: "unauthorized",
        status: error.status,
        cause: error,
      });
    }

    if (error.code === "VALIDATION" || error.status === 400 || error.status === 422) {
      return new AuthServiceError({
        message: error.message || "Données invalides.",
        kind: "validation",
        status: error.status,
        fieldErrors: extractFieldErrors(error),
        cause: error,
      });
    }

    if (error.code === "NETWORK" || error.code === "CONFIG" || error.status === 0) {
      return new AuthServiceError({
        message: error.message || "Impossible de contacter le serveur.",
        kind: "network",
        status: error.status,
        cause: error,
      });
    }

    if (error.status >= 500) {
      return new AuthServiceError({
        message: error.message || "Serveur indisponible.",
        kind: "server",
        status: error.status,
        cause: error,
      });
    }

    return new AuthServiceError({
      message: error.message || fallbackMessage,
      kind: "unknown",
      status: error.status,
      cause: error,
    });
  }

  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message?: unknown }).message ?? "").trim();
    return new AuthServiceError({
      message: message || fallbackMessage,
      kind: "unknown",
      cause: error,
    });
  }

  return new AuthServiceError({
    message: fallbackMessage,
    kind: "unknown",
    cause: error,
  });
};

const extractAccessToken = (response: AuthApiResponse): string => {
  const accessToken =
    typeof response.access_token === "string" && response.access_token.trim().length > 0
      ? response.access_token
      : typeof response.token === "string" && response.token.trim().length > 0
        ? response.token
        : null;

  if (!accessToken) {
    throw new AuthServiceError({
      message: "Réponse d'authentification invalide (token manquant).",
      kind: "invalid_response",
    });
  }

  return accessToken;
};

const normalizeUser = (rawUser: unknown): AuthUser | null => {
  if (!rawUser || typeof rawUser !== "object") {
    return null;
  }

  return rawUser as AuthUser;
};

const hasHouseholdContext = (user: AuthUser | null): boolean => {
  if (!user) return false;
  if (typeof user.household_id !== "undefined") return true;
  return Array.isArray(user.households);
};

export const fetchMe = async (): Promise<AuthUser | null> => {
  try {
    const response = (await apiFetch("/me")) as AuthApiResponse | null;
    return normalizeUser(response?.user);
  } catch (error) {
    throw toAuthServiceError(error, "Impossible de récupérer le profil.");
  }
};

const syncUserFromMeOrFallback = async (fallbackUser: AuthUser | null): Promise<AuthUser | null> => {
  if (fallbackUser && hasHouseholdContext(fallbackUser)) {
    return fallbackUser;
  }

  try {
    const meUser = await fetchMe();
    return meUser ?? fallbackUser;
  } catch {
    return fallbackUser;
  }
};

const buildAuthResult = async (response: AuthApiResponse): Promise<AuthResult> => {
  const token = extractAccessToken(response);
  const fallbackUser = normalizeUser(response.user);
  const resolvedUser = await syncUserFromMeOrFallback(fallbackUser);

  await persistAuthSession({
    token,
    user: resolvedUser,
  });

  return {
    token,
    user: resolvedUser,
    mustChangePassword: Boolean(resolvedUser?.must_change_password),
  };
};

export const login = async (payload: LoginPayload): Promise<AuthResult> => {
  try {
    const response = (await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    })) as AuthApiResponse | null;

    return await buildAuthResult(response ?? {});
  } catch (error) {
    throw toAuthServiceError(error, "Identifiants incorrects.");
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiFetch("/logout", {
      method: "POST",
    });
  } catch (error) {
    const authError = toAuthServiceError(error, "Impossible de fermer la session côté serveur.");
    if (authError.kind !== "unauthorized") {
      console.warn("Logout backend error:", authError);
    }
  } finally {
    await logoutAuth();
  }
};