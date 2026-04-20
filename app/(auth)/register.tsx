import { AppButton } from "@/src/components/AppButton";
import { AppTextInput } from "@/src/components/AppTextInput";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { Colors } from "@/src/constants/theme";
import {
    register,
    toAuthServiceError,
    type RegisterPayload,
} from "@/src/services/authService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";

export default function Register() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (result) => {
      router.replace(/*result.mustChangePassword ? "/change-credentials" : */"/(app)/home");
    },
    onError: (error: unknown) => {
      const authError = toAuthServiceError(error, "Inscription impossible.");

      if (authError.kind === "validation" && authError.fieldErrors) {
        setFieldErrors(authError.fieldErrors);
        return;
      }

      Alert.alert("Erreur", authError.message);
    },
  });

  const onRegister = () => {
    setFieldErrors({});

    if (!name.trim() || !email.trim() || !password || !passwordConfirm) {
      Alert.alert("Oups", "Merci de remplir tous les champs.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Oups", "Le mot de passe doit contenir au moins 8 caractères.");
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
                <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
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
              error={fieldErrors.passwordConfirmation ?? fieldErrors.password_confirmation}
              rightSlot={
                <TouchableOpacity onPress={() => setShowPasswordConfirm((prev) => !prev)}>
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

        <View style={styles.footer}>
          <AppButton
            title="Créer mon compte"
            variant="primary"
            loading={registerMutation.isPending}
            onPress={onRegister}
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
    flexGrow: 1,
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