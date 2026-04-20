
import { AppButton } from "@/src/components/AppButton";
import { Colors, Fonts } from "@/src/constants/theme";
import { useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function PublicHome() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Section Hero : Logo et Slogan */}
      <View style={styles.heroSection}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logoImage}
            
          />
        </View>

        <Text style={[styles.brandName, { color: theme.text, fontFamily: Fonts.sans }]}>
          FamilyFlow
        </Text>

        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          Centralise la gestion de ton foyer : repas, tâches, budget et calendrier.
        </Text>
      </View>

      {/* Section Actions : Boutons */}
      <View style={styles.footer}>

        <AppButton
          title="Se connecter"
          variant="primary"
          onPress={() => router.push("/(auth)/login")}
        />

        <AppButton
          title="Créer un compte"
          variant="outline"
          onPress={() => router.push("/(auth)/register")}
        />
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingTop: 100,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center",
    width: "100%",
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5,
    backgroundColor: Colors.light.card,
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  brandName: {
    fontSize: 40,
    fontWeight: "800",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    textAlign: "center",
    lineHeight: 26,
    maxWidth: width * 0.8,
    opacity: 0.8,
  },
  footer: {
    width: "100%",
    gap: 2,
    marginBottom: 30
  },
});