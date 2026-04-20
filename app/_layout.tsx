import { API_BASE_URL, isApiClientError, subscribeToApiUnauthorized } from "@/src/lib/api-client";
import { useAuthStore } from "@/src/store/useAuthStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// On empêche l'écran de chargement de disparaître tant qu'on n'a pas vérifié la session
SplashScreen.preventAutoHideAsync().catch(() => {});

// Configuration de React Query
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (isApiClientError(error)) {
            // Ne pas réessayer si l'erreur est liée à l'autorisation (401, 403) ou introuvable (404)
            if ([401, 403, 404].includes(error.status)) return false;
            if (!error.retryable) return false;
          }
          return failureCount < 2;
        },
        retryDelay: (attempt) => Math.min(750 * 2 ** attempt, 4000),
      },
    },
  });

export default function RootLayout() {
  const [queryClient] = useState(createQueryClient);

  // On récupère les fonctions et l'état depuis le store Zustand
  const hydrate = useAuthStore((state) => state.hydrate);
  const hydrated = useAuthStore((state) => state.hydrated);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const segments = useSegments();
  const router = useRouter();

  // Si la config API est absente, on cache le splash et on affiche un écran explicite
  useEffect(() => {
    if (!API_BASE_URL) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, []);

  // Hydratation initiale de la session (lecture du SecureStore)
  useEffect(() => {
    if (!API_BASE_URL) return;
    hydrate().catch(console.error);
  }, [hydrate]);

  // Intercepteur global : si l'API renvoie 401, on déconnecte l'utilisateur
  useEffect(() => {
    if (!API_BASE_URL) return;

    const unsubscribe = subscribeToApiUnauthorized(() => {
      console.warn("Session expirée (401) - Déconnexion automatique");
      logout().catch(console.error);
      queryClient.clear();
    });

    return unsubscribe;
  }, [logout, queryClient]);

  // Route Guard : redirection automatique selon l'état de connexion
  useEffect(() => {
    if (!API_BASE_URL) return;
    if (!hydrated) return; // On attend que le SecureStore ait fini de charger

    const inAuthGroup = segments[0] === "(auth)" || !segments[0];
    const isAuthenticated = !!token;

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(app)/home");
    }

    // On cache le Splash Screen
    SplashScreen.hideAsync().catch(() => {});
  }, [hydrated, token, segments, router]);

  if (!API_BASE_URL) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 24,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Configuration API manquante
            </Text>
            <Text
              style={{
                textAlign: "center",
                opacity: 0.8,
              }}
            >
              Vérifie EXPO_PUBLIC_API_URL, EXPO_PUBLIC_API_URL_LOCAL ou EXPO_PUBLIC_API_URL_ONLINE.
            </Text>
          </View>
        </QueryClientProvider>
      </GestureHandlerRootView>
    );
  }

  // Tant que l'hydratation n'est pas finie, on n'affiche rien
  if (!hydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}