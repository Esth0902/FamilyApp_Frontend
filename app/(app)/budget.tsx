import { ScreenHeader } from '@/src/components/ScreenHeader';
import { Colors } from '@/src/constants/theme';
import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';

export default function RepasScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Vous pouvez utiliser votre ScreenHeader existant ou laisser le header natif des Tabs */}
      <ScreenHeader 
        title="Argent de poche" 
        subtitle="Accès aux demandes, ajustements et paiements." 
      />
      
      <View style={styles.content}>
        <Text style={{ color: theme.text }}>
          C'est ici que s'affichera la liste des repas !
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  }
});