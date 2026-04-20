import { Colors } from '@/src/constants/theme'; // Ajustez si besoin en fonction de votre thème
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function AppLayout() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.text,
                tabBarInactiveTintColor: theme.textSecondary,
                tabBarStyle: {
                backgroundColor: theme.background,

            },
            headerStyle: {
                backgroundColor: theme.background,
            },
            headerTintColor: theme.text,
            }}
        >
        {/* Onglet Accueil */}
        <Tabs.Screen
            name="home"
            options={{
                title: 'Accueil',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons
                        name={focused ? "home" : "home-outline"}
                        size={24}
                        color={color}
                    />
                ),
            }}
        />

        {/* Onglet Repas */}
        <Tabs.Screen
            name="meals"
            options={{
                title: 'Repas',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons
                        name="silverware-fork-knife"
                        size={24}
                        color={color}
                        />
                    ),
            }}
        />
        {/* Onglet tâches */}
        <Tabs.Screen
            name="tasks"
            options={{
                title: 'Tâches',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons
                        name={focused ? "checkbox" : "checkbox-outline"}
                        size={24}
                        color={color}
                    />
                ),
            }}
        />

        {/* Onglet budget */}
        <Tabs.Screen
            name="budget"
            options={{
                title: "Budget",
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons
                        name="piggy-bank-outline"
                        size={24}
                        color={color}
                    />
                ),
            }}
        />

        {/* Onglet calendrier */}
        <Tabs.Screen
            name="calendar"
            options={{
                title: "Calendrier",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "calendar" : "calendar-outline"}
                            size={24}
                            color={color}
                        />
                    ),
            }}
        />

        {/* Autres vues non affichées dans la barre de navigation */}






    </Tabs>
  );
}