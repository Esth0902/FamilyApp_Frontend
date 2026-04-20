import { Colors, Fonts } from "@/src/constants/theme";
import React, { useState } from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    useColorScheme,
    View,
    ViewStyle,
} from "react-native";

type AppTextInputProps = TextInputProps & {
    label?: string;
    error?: string;
    rightSlot?: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    errorStyle?: StyleProp<TextStyle>;
    inputStyle?: StyleProp<TextStyle>;
};

export function AppTextInput({
    label,
    error,
    rightSlot,
    containerStyle,
    labelStyle,
    errorStyle,
    inputStyle,
    style,
    placeholderTextColor,
    onFocus,
    onBlur,
    ...props
}: AppTextInputProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    const [isFocused, setIsFocused] = useState(false);

    // Gestion du focus pour l'UI
    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const getBorderColor = () => {
        if (error) return theme.accentWarm;
        if (isFocused) return theme.tint;
        return theme.icon + "40"; 
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label ? (
                <Text style={[styles.label, { color: theme.text, fontFamily: Fonts.sans }, labelStyle]}>
                    {label}
                </Text>
            ) : null}

            <View 
                style={[
                    styles.inputWrapper,
                    {
                        backgroundColor: theme.card,
                        borderColor: getBorderColor(),
                        borderWidth: isFocused || error ? 1.5 : 1,
                    },
                ]}
            >
                <TextInput
                    {...props}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={[
                        styles.input,
                        { color: theme.text, fontFamily: Fonts.sans },
                        style,
                        inputStyle,
                    ]}
                    placeholderTextColor={placeholderTextColor ?? theme.textSecondary}
                />

                {rightSlot ? (
                    <View style={styles.rightSlotContainer}>
                        {rightSlot}
                    </View>
                ) : null}
            </View>

            {error ? (
                <Text style={[styles.error, { color: theme.accentWarm, fontFamily: Fonts.sans }, errorStyle]}>
                    {error}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 56,
        borderRadius: 16,
        paddingHorizontal: 4,
    },
    input: {
        flex: 1,
        height: "100%",
        paddingHorizontal: 16,
        fontSize: 16,
    },
    rightSlotContainer: {
        paddingRight: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    error: {
        fontSize: 12,
        marginTop: 6,
        marginLeft: 8,
    },
});