import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RecipesTabValue = "mine" | "all";

type RecipesTabsProps = {
  selectedTab: RecipesTabValue;
  onChangeTab: (tab: RecipesTabValue) => void;
  theme: {
    text: string;
    tint: string;
    icon: string;
  };
};

const TABS: { label: string; value: RecipesTabValue }[] = [
  { label: "Mes recettes", value: "mine" },
  { label: "Toutes les recettes", value: "all" },
];

export function RecipesTabs({
  selectedTab,
  onChangeTab,
  theme,
}: RecipesTabsProps) {
  return (
    <View style={styles.tabsRow}>
      {TABS.map((tab) => {
        const isSelected = selectedTab === tab.value;

        return (
          <TouchableOpacity
            key={tab.value}
            onPress={() => onChangeTab(tab.value)}
            style={[
              styles.tabButton,
              {
                borderColor: isSelected ? theme.tint : theme.icon,
                backgroundColor: isSelected ? `${theme.tint}22` : "transparent",
              },
            ]}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                { color: isSelected ? theme.tint : theme.text },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    minHeight: 42,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});