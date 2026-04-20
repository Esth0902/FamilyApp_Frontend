import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const RECIPE_TYPE_FILTERS = [
  { label: "Toutes", value: "all", icon: "silverware-fork-knife" },
  { label: "Petit-déjeuner", value: "breakfast", icon: "coffee-outline" },
  { label: "Entrées", value: "starter", icon: "food-apple-outline" },
  { label: "Plats", value: "main", icon: "food" },
  { label: "Desserts", value: "dessert", icon: "cupcake" },
  { label: "Collations", value: "snack", icon: "cookie-outline" },
  { label: "Boissons", value: "drink", icon: "cup-water" },
  { label: "Autres", value: "other", icon: "shape-outline" },
];

type RecipeTypeFiltersProps = {
  selectedTypeFilter: string;
  onChangeTypeFilter: (value: string) => void;
  theme: {
    text: string;
    textSecondary: string;
    tint: string;
    icon: string;
  };
  isDarkMode: boolean;
};

export function RecipeTypeFilters({
  selectedTypeFilter,
  onChangeTypeFilter,
  theme,
  isDarkMode,
}: RecipeTypeFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: isDarkMode ? "#171717" : "#F4F6F8",
          borderColor: isDarkMode ? "#2A2A2A" : "#DCE1E8",
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft} onPress={toggleOpen} activeOpacity={0.8}>
          <MaterialCommunityIcons name="tune-variant" size={18} color={theme.icon} />
          <Text style={[styles.headerTitle, { color: theme.text }]}>Filtrer par type</Text>
          <MaterialCommunityIcons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color={theme.icon}
          />
        </TouchableOpacity>

        {selectedTypeFilter !== "all" ? (
          <TouchableOpacity onPress={() => onChangeTypeFilter("all")}>
            <Text style={[styles.resetText, { color: theme.tint }]}>Réinitialiser</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {isOpen ? (
        <View style={styles.filtersWrap}>
          {RECIPE_TYPE_FILTERS.map((filter) => {
            const selected = selectedTypeFilter === filter.value;

            return (
              <TouchableOpacity
                key={filter.value}
                onPress={() => onChangeTypeFilter(filter.value)}
                style={[
                  styles.chip,
                  {
                    borderColor: selected ? theme.tint : theme.icon,
                    backgroundColor: selected ? `${theme.tint}18` : "transparent",
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={filter.icon as any}
                  size={16}
                  color={selected ? theme.tint : theme.icon}
                />
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: selected ? theme.tint : theme.text,
                      fontWeight: selected ? "700" : "600",
                    },
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginHorizontal: 24,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  headerTitle: {
    fontWeight: "700",
  },
  resetText: {
    fontWeight: "600",
  },
  filtersWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 13,
  },
});