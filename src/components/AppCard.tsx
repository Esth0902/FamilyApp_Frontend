import { Colors } from "@/src/constants/theme";
import React from "react";
import { StyleProp, StyleSheet, useColorScheme, View, ViewStyle } from "react-native";

type AppCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: "default" | "flat" | "outline";
};

export function AppCard({ children, style, variant = "default" }: AppCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View 
      style={[
        styles.card, 
        { backgroundColor: theme.card },
        variant === "outline" && { borderWidth: 1, borderColor: theme.icon + "20", elevation: 0, shadowOpacity: 0 },
        variant === "flat" && { elevation: 0, shadowOpacity: 0, backgroundColor: theme.background },
        style
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
});