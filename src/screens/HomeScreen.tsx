// HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BUTTON_STYLE, BUTTON_TEXT_STYLE } from 'components/theme';

type Props = {
  navigation: any;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Tervetuloa AktiviteettiAppiin!</Text>
      <Text style={styles.subtitle}>
        Valitse alta mitä haluat tehdä:
      </Text>

      <TouchableOpacity
        style={BUTTON_STYLE}
        onPress={() => navigation.navigate('ActivitiesList')}
      >
        <Text style={BUTTON_TEXT_STYLE}>Näytä aktiviteetit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[BUTTON_STYLE, styles.secondaryButton]}
        onPress={() => navigation.navigate('CreateActivity')}
      >
        <Text style={[BUTTON_TEXT_STYLE, { color: COLORS.primary } ]}>Luo aktiviteetti</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={BUTTON_STYLE}
        onPress={() => navigation.navigate('ActivitiesMap')}
      >
        <Text style={BUTTON_TEXT_STYLE}>Näytä kartalla</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={BUTTON_STYLE}
        onPress={() => navigation.navigate('MyProfile')}
      >
        <Text style={BUTTON_TEXT_STYLE}>Oma profiili</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
});

export default HomeScreen;
