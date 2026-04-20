// app/_layout.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { isApiClientError, subscribeToApiUnauthorized } from "@/src/lib/api-client";
import { useAuthStore } from "@/src/store/useAuthStore";

//On empêche l'écran de chargement de disparaître tant qu'on a pas vérifié la session
SplashScreen.preventAutoHideAsync().catch(() => {});

//Configuration de React Query
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

  //Hydratation initiale de la session (lecture du SecureStore)
  useEffect(() => {
    hydrate().catch(console.error);
  }, [hydrate]);

  //Intercepteur global : Si l'API renvoie 401 (Session expirée), on déconnecte l'utilisateur
  useEffect(() => {
    const unsubscribe = subscribeToApiUnauthorized(() => {
      console.warn("Session expirée (401) - Déconnexion automatique");
      logout().catch(console.error);
      queryClient.clear();
    });
    return unsubscribe;
  }, [logout, queryClient]);

  //Le "Route Guard" : Redirection automatique selon l'état de connexion
  useEffect(() => {
    if (!hydrated) return; // On attend que le SecureStore ait fini de charger

    const inAuthGroup = segments[0] === "(auth)" || !segments[0]; // On considère la route racine comme faisant partie de l'authentification
    const isAuthenticated = !!token;

    if (!isAuthenticated && !inAuthGroup) {
      // Utilisateur NON connecté qui essaie d'aller dans l'app -> Redirection vers Login
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Utilisateur CONNECTÉ qui est sur la page de Login -> Redirection vers l'App
      router.replace("/(app)/home");
    }

    //On cache le Splash Screen
    SplashScreen.hideAsync().catch(() => {});
  }, [hydrated, token, segments, router]);

  // Tant que l'hydratation n'est pas finie, on n'affiche rien (le Splash Screen reste visible)
  if (!hydrated) {
    return null; 
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Définition de nos deux grands groupes de navigation */}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}