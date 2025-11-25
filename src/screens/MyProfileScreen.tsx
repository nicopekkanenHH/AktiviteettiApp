// src/screens/MyProfileScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

import {
  fetchUserActivities,
  fetchFavoriteActivities,
} from 'services/activityService';
import { Activity } from 'models/Activity';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
} from 'components/theme';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'MyProfile'>;

const MyProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [tab, setTab] = useState<'own' | 'favorites'>('own');
  const [own, setOwn] = useState<Activity[]>([]);
  const [favorites, setFavorites] = useState<Activity[]>([]);

  const load = async () => {
    try {
      const [ownActs, favActs] = await Promise.all([
        fetchUserActivities(),
        fetchFavoriteActivities(),
      ]);
      setOwn(ownActs);
      setFavorites(favActs);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  const renderItem = ({ item }: { item: Activity }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('ActivityDetails', { activityId: item.id })
      }
    >
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemSubtitle}>
        {new Date(item.time).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  const data = tab === 'own' ? own : favorites;

  return (
    <View style={styles.screen}>
      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab('own')}>
          <Text style={[styles.tab, tab === 'own' && styles.tabActive]}>
            Omat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTab('favorites')}>
          <Text style={[styles.tab, tab === 'favorites' && styles.tabActive]}>
            Suosikit
          </Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {tab === 'own'
                ? 'Et ole vielä luonut aktiviteetteja.'
                : 'Et ole lisännyt suosikkiaktiviteetteja.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.backgroundAlt,
  },
  tab: {
    fontSize: FONT_SIZES.lg,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    color: COLORS.textMuted,
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },

  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  item: {
    padding: SPACING.lg,
    backgroundColor: COLORS.backgroundAlt,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  itemTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  itemSubtitle: {
    color: COLORS.textMuted,
    marginTop: 4,
    fontSize: FONT_SIZES.sm,
  },

  empty: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
});

export default MyProfileScreen;
