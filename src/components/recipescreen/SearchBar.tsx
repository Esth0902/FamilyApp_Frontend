import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

type RecipesSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  theme: {
    icon: string;
    text: string;
  };
  isDarkMode: boolean;
};

export function RecipesSearchBar({
  value,
  onChangeText,
  theme,
  isDarkMode,
}: RecipesSearchBarProps) {
  return (
    <View
      style={[
        styles.searchContainer,
        { backgroundColor: "#e4e0e0b4" },
      ]}
    >
      <MaterialCommunityIcons name="magnify" size={20} color={theme.icon} />
      <TextInput
        style={[styles.searchInput, { color: theme.text }]}
        placeholder="Rechercher une recette..."
        placeholderTextColor={theme.icon}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 24,
    marginBottom: 3,
    gap: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
});