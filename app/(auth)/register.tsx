import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";

import { AppButton } from "@/src/components/AppButton";
import { AppTextInput } from "@/src/components/AppTextInput";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { Colors } from "@/src/constants/theme";

export default function Register() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  // États du formulaire
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  /*const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (result) => {
      // Redirection vers le setup ou home (Vérifie bien le chemin V2)
      router.replace(result.mustChangePassword ? "/change-credentials" : "/(app)/home");
    },
    onError: (error: any) => {
      const authError = toAuthServiceError(error, "Inscription impossible.");
      // Si ton backend renvoie des erreurs de validation (ex: Laravel 422)
      if (error?.status === 422 && error?.data?.errors) {
        setFieldErrors(error.data.errors);
      } else {
        Alert.alert("Erreur", authError.message);
      }
    },
  });

  const onRegister = () => {
    setFieldErrors({});
    if (!name.trim() || !email.trim() || !password || !passwordConfirm) {
      Alert.alert("Oups", "Merci de remplir tous les champs.");
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert("Oups", "Les mots de passe ne correspondent pas.");
      return;
    }

    registerMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      password,
      passwordConfirmation: passwordConfirm,
    });
  };
*/
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* --- SECTION HAUT --- */}
        <View>
          <ScreenHeader
            title="Créer un compte"
            subtitle="Rejoins FamilyFlow pour organiser ta vie de famille."
            withBackButton
          />

          <View style={styles.form}>
            <AppTextInput
              label="Nom complet"
              placeholder="Ex: Sophie"
              value={name}
              onChangeText={setName}
              error={fieldErrors.name}
            />

            <AppTextInput
              label="E-mail"
              placeholder="Ex: parent@famille.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              error={fieldErrors.email}
            />

            <AppTextInput
              label="Mot de passe"
              placeholder="Min 8 caractères"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              error={fieldErrors.password}
              rightSlot={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              }
            />

            <AppTextInput
              label="Confirmation"
              placeholder="Répétez le mot de passe"
              secureTextEntry={!showPasswordConfirm}
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              error={fieldErrors.password_confirmation}
              rightSlot={
                <TouchableOpacity onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                  <MaterialCommunityIcons
                    name={showPasswordConfirm ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              }
            />
          </View>
        </View>

        {/* --- SECTION BAS --- */}
        <View style={styles.footer}>
          <AppButton
            title="Créer mon compte"
            variant="primary"
            //loading={registerMutation.isPending}
            //onPress={onRegister}
          />

          <AppButton
            title="Déjà un compte ? Se connecter"
            variant="outline"
            onPress={() => router.push("/(auth)/login")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1, // Crucial pour que le justifyContent: space-between fonctionne
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  form: {
    paddingHorizontal: 24,
    marginTop: 10,
  },
  footer: {
    paddingHorizontal: 24,
    marginTop: 20,
    gap: 2,
    marginBottom: 20,
  },
});