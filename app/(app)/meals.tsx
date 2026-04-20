import { AppCard } from "@/src/components/AppCard";
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { Colors } from '@/src/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

export default function RepasScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            
            {/* En-tête de la page */}
            <ScreenHeader 
                title="Repas & Cuisine" 
                subtitle="Gère l'alimentation de ton foyer." 
                withBackButton
                showBorder
            />

            {/* Contenu avec défilement */}
            <ScrollView contentContainerStyle={styles.content}>
                
                {/* Carte Recettes */}
                <AppCard
                    title="Gestion des recettes"
                    description="Bibliothèque culinaire et création par IA"
                    icon="food-variant"
                    iconColor="#F97316" // Orange
                    accentColor="#F97316"
                    onPress={() => router.push("/(views)/recipes/recipes")}
                />

                {/* Carte Sondage */}
                <AppCard
                    title="Sondage de la semaine"
                    description="Vote pour les prochains repas du foyer"
                    icon="calendar-month-outline"
                    iconColor="#10B981" // Vert
                    accentColor="#10B981"
                    onPress={() => console.log("Redirection vers le planning")}
                />

                {/* Carte Liste de courses */}
                <AppCard
                    title="Liste de courses"
                    description="Génère la liste selon les menus choisis"
                    icon="cart-outline"
                    iconColor="#3B82F6"
                    accentColor="#3B82F6"
                    onPress={() => console.log("Redirection vers les courses")}
                />

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20, // Ajoute de l'espace autour des cartes
    }
});