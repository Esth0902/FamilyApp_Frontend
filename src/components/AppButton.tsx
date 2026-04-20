// src/components/ui/AppButton.tsx
import { Colors } from "@/src/constants/theme";
import React from "react";
import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    useColorScheme
} from "react-native";

type AppButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";

type AppButtonProps = TouchableOpacityProps & {
    title?: string;
    loading?: boolean;
    variant?: AppButtonVariant;
    textStyle?: StyleProp<TextStyle>;
};

const resolveVariantStyles = (variant: AppButtonVariant, theme: any) => {
    const variants = {
        primary: {
            container: { backgroundColor: theme.tint, borderWidth: 0 },
            text: { color: "#FFFFFF" },
            spinner: "#FFFFFF",
            hasShadow: true,
        },
        secondary: {
            container: { backgroundColor: theme.accentCool, borderWidth: 0 },
            text: { color: "#FFFFFF" },
            spinner: "#FFFFFF",
            hasShadow: true,
        },
        outline: {
            container: { backgroundColor: "transparent", borderColor: theme.tint, borderWidth: 1 },
            text: { color: theme.tint },
            spinner: theme.tint,
            hasShadow: false,
        },
        ghost: {
            container: { backgroundColor: "transparent", borderWidth: 0 },
            text: { color: theme.tint },
            spinner: theme.tint,
            hasShadow: false,
        },
        danger: {
            container: { backgroundColor: theme.card, borderColor: theme.accentWarm, borderWidth: 1 },
            text: { color: theme.accentWarm },
            spinner: theme.accentWarm,
            hasShadow: false,
        },
    };
    return variants[variant] || variants.primary;
};

export function AppButton({
    title,
    loading = false,
    variant = "primary",
    textStyle,
    style,
    disabled,
    children,
    ...props
}: AppButtonProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    const v = resolveVariantStyles(variant, theme);
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            {...props}
            disabled={isDisabled}
            activeOpacity={0.7}
            style={[
                styles.base,
                v.container,
                v.hasShadow && styles.shadow,
                style,
                isDisabled && { opacity: 0.5 }
            ]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={v.spinner} />
            ) : title ? (
                <Text style={[styles.text, v.text, textStyle]}>{title}</Text>
            ) : (
                children
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        height: 56, 
        borderRadius: 28, 
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        marginVertical: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
});