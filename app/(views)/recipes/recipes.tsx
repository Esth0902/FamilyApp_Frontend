import { RecipesTabs } from "@/src/components/recipescreen/RecipeTabs";
import { RecipeTypeFilters } from "@/src/components/recipescreen/RecipeTypeFilters";
import { RecipesSearchBar } from "@/src/components/recipescreen/SearchBar";
import { ScreenHeader } from "@/src/components/ScreenHeader";

import { Colors } from "@/src/constants/theme";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

const RECIPES_MOCK = [
  { id: 1, title: "Lasagnes", type: "main", scope: "mine" },
  { id: 2, title: "Tiramisu", type: "dessert", scope: "all" },
  { id: 3, title: "Salade de fruits", type: "starter", scope: "mine" },
  { id: 4, title: "Smoothie banane", type: "drink", scope: "all" },
];


export default function RecettesScreen() {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === "dark";
    const theme = Colors[colorScheme ?? "light"];
    const router = useRouter();

    const [selectedTypeFilter, setSelectedTypeFilter] = useState("all");
    const [search, setSearch] = useState("");

    const [selectedTab, setSelectedTab] = useState<"mine" | "all">("mine");

    const filteredRecipes = useMemo(() => {
        return RECIPES_MOCK.filter((recipe) => {
            const matchesTab =
            selectedTab === "all" ? true : recipe.scope === "mine";

            const matchesType =
            selectedTypeFilter === "all" || recipe.type === selectedTypeFilter;

            const matchesSearch = recipe.title
            .toLowerCase()
            .includes(search.trim().toLowerCase());

            return matchesTab && matchesType && matchesSearch;
        });
    }, [search, selectedTab, selectedTypeFilter]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScreenHeader
            title="Gestion des recettes"
            withBackButton
            onBackPress={() => router.back()}
            showBorder
        />

        <RecipesTabs
            selectedTab={selectedTab}
            onChangeTab={setSelectedTab}
            theme={theme}
        />

      <RecipeTypeFilters
        selectedTypeFilter={selectedTypeFilter}
        onChangeTypeFilter={setSelectedTypeFilter}
        theme={theme}
        isDarkMode={isDarkMode}
      />

        <RecipesSearchBar
            value={search}
            onChangeText={setSearch}
            theme={theme}
            isDarkMode={isDarkMode}
        />

      <View style={styles.content}>
        {filteredRecipes.length === 0 ? (
          <Text style={{ color: theme.textSecondary }}>
            Aucune recette ne correspond au filtre.
          </Text>
        ) : (
          filteredRecipes.map((recipe) => (
            <Text key={recipe.id} style={[styles.recipeItem, { color: theme.text }]}>
              {recipe.title}
            </Text>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 10,
  },
  recipeItem: {
    fontSize: 16,
    fontWeight: "600",
  },
});