import { AppButton } from "@/src/components/AppButton";
import { AppTextInput } from "@/src/components/AppTextInput";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { Colors } from "@/src/constants/theme";
import {
    login,
    toAuthServiceError,
    type LoginPayload,
} from "@/src/services/authService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
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

export default function Login() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const trimmedEmail = useMemo(() => email.trim(), [email]);

  const navigateAfterAuthSuccess = (mustChangePassword: boolean) => {
    if (mustChangePassword) {
      // router.replace("/change-credentials");
      return;
    }

    router.replace("/(app)/home");
  };

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (result) => {
      navigateAfterAuthSuccess(result.mustChangePassword);
    },
    onError: (error: unknown) => {
      const authError = toAuthServiceError(error, "Connexion impossible.");
      Alert.alert("Erreur", authError.message);
    },
  });

  const onLogin = () => {
    if (!trimmedEmail || !password) {
      Alert.alert("Oups", "Merci de remplir tous les champs.");
      return;
    }

    loginMutation.mutate({
      email: trimmedEmail,
      password,
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
                title="Bon retour !"
                subtitle="Connecte-toi pour accéder à ton foyer."
                withBackButton
                onBackPress={() => router.replace("/")}
            />
          

            <View style={styles.form}>
                <AppTextInput
                    label="E-mail"
                    placeholder="Ex: parent@famille.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                />

            <AppTextInput
              label="Mot de passe"
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              rightSlot={
                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              }
            />

            <AppButton
              title="Mot de passe oublié ?"
              variant="ghost"
              style={styles.forgotPassword}
              textStyle={styles.forgotPasswordText}
              onPress={() => router.push("/(auth)/forgot_password")}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <AppButton
            title="Se connecter"
            variant="primary"
            loading={loginMutation.isPending}
            onPress={onLogin}
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
    marginBottom: 20,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    height: 30,
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
  },
});