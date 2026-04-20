import { AppCard } from "@/src/components/AppCard";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { Colors, Fonts } from "@/src/constants/theme";
import { useAuthStore } from "@/src/store/useAuthStore";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);

  return (
    <View style={styles.container}>
      <ScreenHeader 
        title={`Hello, ${user?.name || "Toi"} !`}
        subtitle="Voici ce qu'il se passe dans ton foyer."
        safeTop
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Exemple de carte : Repas */}
        <AppCard>
          <Text style={styles.cardLabel}>À MANGER CE SOIR</Text>
          <Text style={styles.cardTitle}>Lasagnes à la bolognaise 🍝</Text>
        </AppCard>

        {/* Exemple de carte : Budget */}
        <AppCard>
          <Text style={styles.cardLabel}>CAGNOTTE COMMUNE</Text>
          <Text style={styles.cardTitle}>145,50 €</Text>
        </AppCard>

        {/* Exemple de carte : Tâche */}
        <AppCard style={{ borderColor: Colors.light.accentCool, borderLeftWidth: 5 }}>
          <Text style={styles.cardLabel}>À FAIRE</Text>
          <Text style={styles.cardTitle}>Sortir les poubelles (Tri)</Text>
        </AppCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F7",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5D6D7E",
    marginBottom: 4,
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Fonts.sans,
  },
});