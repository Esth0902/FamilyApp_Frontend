import { Colors } from "@/src/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
    ViewStyle,
} from "react-native";

type AppCardProps = {
  style?: StyleProp<ViewStyle>;
  variant?: "default" | "flat" | "outline";
  
  // Props spécifiques au design de votre menu
  title?: string;
  description?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor?: string;
  accentColor?: string; // La petite barre de couleur à gauche
  href?: Href;
  onPress?: () => void;
  
  // Toujours possible de passer un contenu 100% customisé
  children?: React.ReactNode; 
};

export function AppCard({
  children,
  style,
  variant = "default",
  title,
  description,
  icon,
  iconColor,
  accentColor,
  href,
  onPress,
}: AppCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  // Gestion du clic (lien ou fonction)
  const handlePress = () => {
    if (href) {
      router.push(href);
    } else if (onPress) {
      onPress();
    }
  };

  const defaultIconColor = iconColor || theme.text;
  const isPressable = !!href || !!onPress;

  // Si on passe une action, on rend la carte cliquable, sinon c'est une simple View
  const CardWrapper = isPressable ? TouchableOpacity : View;
  const wrapperProps = isPressable ? { onPress: handlePress, activeOpacity: 0.7 } : {};

  return (
    <CardWrapper
      style={[
        styles.card,
        { backgroundColor: theme.card },
        variant === "outline" && { borderWidth: 1, borderColor: theme.icon + "20", elevation: 0, shadowOpacity: 0 },
        variant === "flat" && { elevation: 0, shadowOpacity: 0, backgroundColor: theme.background },
        style,
      ]}
      {...wrapperProps}
    >
      {/* 1. La barre de couleur verticale à gauche */}
      {accentColor && (
        <View style={[styles.cardAccent, { backgroundColor: accentColor }]} />
      )}

      <View style={styles.cardContent}>
        {/* 2. L'icône avec son fond transparent */}
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: defaultIconColor + "15" }]}>
            <MaterialCommunityIcons name={icon} size={24} color={defaultIconColor} />
          </View>
        )}

        {/* 3. Le texte (Titre + Description) ou contenu personnalisé */}
        <View style={styles.textContainer}>
          {title && (
            <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>
              {title}
            </Text>
          )}
          {description && (
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]} numberOfLines={2}>
              {description}
            </Text>
          )}
          {children}
        </View>

        {/* 4. Le chevron, visible uniquement si la carte est cliquable */}
        {isPressable && (
          <MaterialCommunityIcons name="chevron-right" size={24} color={theme.textSecondary} />
        )}
      </View>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: "row", // Permet d'aligner l'accent et le contenu
    overflow: "hidden", // Indispensable pour que la barre d'accent suive l'arrondi de la carte
  },
  cardAccent: {
    width: 6, // Épaisseur de la barre de couleur
    height: "auto",
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12, // Un arrondi un peu plus carré pour l'icône, typique de ce style
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1, // Prend tout l'espace disponible entre l'icône et le chevron
    justifyContent: "center",
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});