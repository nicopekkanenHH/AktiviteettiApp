// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BUTTON_STYLE,
  BUTTON_TEXT_STYLE,
  BUTTON_SECONDARY_STYLE,
  BUTTON_SECONDARY_TEXT_STYLE,
  CARD_STYLE,
} from 'components/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/RootNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Hero - yläosa */}
      <View style={styles.hero}>
        <Text style={styles.badge}>AKTIVITEETTIAPP</Text>
        <Text style={styles.title}>Löydä ja luo aktiviteetteja helposti</Text>
        <Text style={styles.subtitle}>
          Näe mitä ympärillä tapahtuu, luo omia tapahtumia ja osallistu kavereiden menoon.
        </Text>

        <View style={styles.heroButtons}>
          <TouchableOpacity
            style={[BUTTON_STYLE, { flex: 1 }]}
            onPress={() => navigation.navigate('ActivitiesList')}
          >
            <Text style={BUTTON_TEXT_STYLE}>Selaa aktiviteetteja</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[BUTTON_SECONDARY_STYLE, { flex: 1, marginLeft: SPACING.sm }]}
            onPress={() => navigation.navigate('CreateActivity')}
          >
            <Text style={BUTTON_SECONDARY_TEXT_STYLE}>Luo aktiviteetti</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Päänavigointikortit */}
      <View style={styles.cardsRow}>
        <View style={[CARD_STYLE, styles.card]}>
          <Text style={styles.cardTitle}>Karttanäkymä</Text>
          <Text style={styles.cardText}>
            Näe lähelläsi olevat aktiviteetit kartalla ja löydä uutta tekemistä.
          </Text>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => navigation.navigate('ActivitiesMap')}
          >
            <Text style={styles.cardButtonText}>Avaa kartta →</Text>
          </TouchableOpacity>
        </View>

        <View style={[CARD_STYLE, styles.card]}>
          <Text style={styles.cardTitle}>Oma profiili</Text>
          <Text style={styles.cardText}>
            Tarkastele luomiasi aktiviteetteja ja hallinnoi niitä.
          </Text>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => navigation.navigate('MyProfile')}
          >
            <Text style={styles.cardButtonText}>Näytä profiili →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Info-osio */}
      <View style={[CARD_STYLE, styles.infoCard]}>
        <Text style={styles.infoTitle}>Miten tämä toimii?</Text>
        <Text style={styles.infoText}>1. Luo aktiviteetti haluamaasi paikkaan ja aikaan.</Text>
        <Text style={styles.infoText}>2. Jaa sijainti ja kuvaus, jotta muut löytävät sen.</Text>
        <Text style={styles.infoText}>3. Osallistujat voivat ilmoittautua ja nähdä tarkemmat tiedot.</Text>
      </View>
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
    paddingBottom: SPACING.xxl,
  },
  hero: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: 24,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 999,
    backgroundColor: COLORS.backgroundAlt,
    color: COLORS.primaryDark,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  heroButtons: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  cardsRow: {
    flexDirection: 'column',
    gap: SPACING.lg as any,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  cardText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  cardButton: {
    paddingVertical: SPACING.xs,
  },
  cardButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primaryDark,
    fontWeight: FONT_WEIGHTS.medium,
  },
  infoCard: {
    marginTop: SPACING.xl,
  },
  infoTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
});

export default HomeScreen;
