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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors, Fonts } from "@/src/constants/theme";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  withBackButton?: boolean;
  onBackPress?: () => void;
  backHref?: Href;
  rightSlot?: React.ReactNode;
  safeTop?: boolean;
  showBorder?: boolean;
  bottomSpacing?: number;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function ScreenHeader({
  title,
  subtitle,
  withBackButton = false,
  onBackPress,
  backHref,
  rightSlot,
  safeTop = true,
  showBorder = false,
  bottomSpacing = 24, 
  containerStyle,
  contentStyle,
}: ScreenHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const handleBack = () => {
    if (onBackPress) return onBackPress();
    if (backHref) return router.push(backHref);
    if (router.canGoBack()) return router.back();
    router.replace("/(app)/home");
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: safeTop ? insets.top + 16 : 16,
          marginBottom: bottomSpacing,
          borderBottomWidth: showBorder ? 1 : 0,
          borderBottomColor: theme.icon,
          paddingBottom: showBorder ? 12 : 0,
        },
        containerStyle,
      ]}
    >
      <View style={[styles.row, contentStyle]}>
        {withBackButton && (
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.backBtn, { backgroundColor: theme.card }]}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="chevron-left" size={28} color={theme.tint} />
          </TouchableOpacity>
        )}

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.sans }]}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 20,
    opacity: 0.8,
  },
  rightSlot: {
    marginLeft: 8,
  },
});