// src/screens/ActivityDetailsScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { Activity } from 'models/Activity';
import {
  getActivityById,
  fetchParticipants,
  joinActivity,
  leaveActivity,
  deleteActivity,
  isFavorite,
  addFavorite,
  removeFavorite,
} from 'services/activityService';

import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
} from 'components/theme';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ActivityDetails'>;

const ActivityDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { activityId } = route.params;

  const [activity, setActivity] = useState<Activity | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [favorite, setFavorite] = useState<boolean>(false);

  const load = async () => {
    try {
      const act = await getActivityById(activityId);
      if (!act) {
        Alert.alert('Virhe', 'Aktiviteettia ei löytynyt.');
        navigation.goBack();
        return;
      }
      setActivity(act);

      const [parts, fav] = await Promise.all([
        fetchParticipants(activityId),
        isFavorite(activityId),
      ]);

      setParticipants(parts);
      setFavorite(fav);
    } catch (e) {
      console.error(e);
      Alert.alert('Virhe', 'Tietojen lataus epäonnistui.');
    }
  };

  useEffect(() => {
    load();
  }, [activityId]);

  const toggleFavorite = async () => {
    try {
      if (favorite) {
        await removeFavorite(activityId);
        setFavorite(false);
      } else {
        await addFavorite(activityId);
        setFavorite(true);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Virhe', 'Suosikin vaihtaminen epäonnistui.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Poista aktiviteetti',
      'Haluatko varmasti poistaa aktiviteetin?',
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteActivity(activityId);
              navigation.navigate('ActivitiesList');
            } catch (e) {
              console.error(e);
              Alert.alert(
                'Virhe',
                'Aktiviteetin poistaminen epäonnistui.'
              );
            }
          },
        },
      ]
    );
  };

  const handleJoin = async () => {
    Alert.alert(
      'Osallistuminen',
      'Toteutus osallistujan nimen kysymiselle voidaan lisätä myöhemmin.'
    );
  };

  if (!activity) {
    return (
      <View style={styles.center}>
        <Text>Ladataan...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen}>
      {/* HERO HEADER */}
      <View style={styles.hero}>
        <View style={styles.heroHeaderRow}>
          <Text style={styles.badge}>{activity.category}</Text>

          <TouchableOpacity onPress={toggleFavorite}>
            <Text
              style={[
                styles.favoriteBig,
                favorite && styles.favoriteBigActive,
              ]}
            >
              {favorite ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heroTitle}>{activity.name}</Text>
        <Text style={styles.heroSubtitle}>
          {new Date(activity.time).toLocaleString()}
        </Text>
      </View>

      {/* INFO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kuvaus</Text>
        <Text style={styles.text}>{activity.description}</Text>

        <Text style={styles.sectionTitle}>Sijainti</Text>
        <Text style={styles.text}>
          {activity.location.latitude}, {activity.location.longitude}
        </Text>
      </View>

      {/* ACTIONS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Toiminnot</Text>
        <View style={styles.actionsRow}>
          <View style={styles.actionButton}>
            <Button title="Muokkaa" onPress={() => navigation.navigate('CreateActivity', { activityId })} />
          </View>
          <View style={styles.actionButton}>
            <Button title="Poista" color={COLORS.danger} onPress={handleDelete} />
          </View>
        </View>
      </View>

      {/* PARTICIPANTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Osallistujat</Text>
        {participants.length === 0 ? (
          <Text style={styles.text}>Ei osallistujia vielä.</Text>
        ) : (
          participants.map((p) => (
            <Text key={p} style={styles.text}>
              • {p}
            </Text>
          ))
        )}

        {/* placeholder-painike */}
        <View style={{ marginTop: SPACING.md }}>
          <Button title="Osallistu" onPress={handleJoin} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  hero: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  favoriteBig: {
    fontSize: 35,
    color: 'white',
    opacity: 0.7,
  },
  favoriteBigActive: {
    color: 'white',
    opacity: 1,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginTop: SPACING.md,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: 'white',
    opacity: 0.9,
    marginTop: SPACING.xs,
  },

  section: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  text: {
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm as any,
  },
  actionButton: {
    flex: 1,
  },
});

export default ActivityDetailsScreen;
