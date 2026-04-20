import { AppButton } from "@/src/components/AppButton";
import { AppCard } from "@/src/components/AppCard";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { Colors, Fonts } from "@/src/constants/theme";
import { logout, toAuthServiceError } from "@/src/services/authService";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View, useColorScheme } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const user = useAuthStore((state) => state.user);
  const userName =
    typeof user?.name === "string" && user.name.trim().length > 0
      ? user.name.trim()
      : "Utilisateur";

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (error) {
      const authError = toAuthServiceError(error, "Deconnexion impossible.");
      Alert.alert("Erreur", authError.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <ScreenHeader
        title={`Bonjour ${userName}`}
        safeTop
        showBorder
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* TODO Dashboard V2: remplacer les valeurs statiques par les donnees API (repas du jour, budget, taches). */}
        <AppCard>
          <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>A MANGER CE SOIR</Text>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Lasagnes a la bolognaise</Text>
        </AppCard>

        <AppCard>
          <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>CAGNOTTE COMMUNE</Text>
          <Text style={[styles.cardTitle, { color: theme.text }]}>145,50 EUR</Text>
        </AppCard>

        {/* TODO Dashboard V2: ajouter des widgets reutilisables (repas, budget, taches) connectes a React Query. */}
        <AppCard style={{ borderColor: theme.accentCool, borderLeftWidth: 5 }}>
          <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>A FAIRE</Text>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Sortir les poubelles (Tri)</Text>
        </AppCard>
                <View style={styles.actions}>
          <AppButton title="Se deconnecter" variant="outline" onPress={handleLogout} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  actions: {
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Fonts.sans,
  },
});
