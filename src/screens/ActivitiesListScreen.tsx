// src/screens/ActivitiesListScreen.tsx

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  PanResponder,
  Pressable,
  TextInput,
} from 'react-native';

import { Activity } from 'models/Activity';
import {
  fetchActivities,
  addFavorite,
  removeFavorite,
} from 'services/activityService';

import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  CARD_STYLE,
  SHADOWS,
} from 'components/theme';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/RootNavigator';

const CATEGORY_COLORS: Record<string, { backgroundColor: string }> = {
  liikunta: { backgroundColor: '#DCFCE7' },
  kulttuuri: { backgroundColor: '#FEF3C7' },
  yhteisö: { backgroundColor: '#DBEAFE' },
};

type Props = NativeStackScreenProps<RootStackParamList, 'ActivitiesList'>;

const ActivitiesListScreen: React.FC<Props> = ({ navigation }) => {
  const [activities, setActivities] = useState<(Activity & { isFavorite?: boolean })[]>([]);
  const [filtered, setFiltered] = useState<(Activity & { isFavorite?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);

  // SEARCH
  const [searchQuery, setSearchQuery] = useState('');

  // FILTERS
  const [category, setCategory] = useState<string>('all');
  const [distance, setDistance] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortMode, setSortMode] = useState<string>('newest');
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);

  // BOTTOM SHEET
  const sheetY = useRef(new Animated.Value(500)).current;
  const SCREEN_HEIGHT = 500;
  const [sheetOpen, setSheetOpen] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) sheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 150) closeSheet();
        else openSheet();
      },
    })
  ).current;

  const openSheet = () => {
    setSheetOpen(true);
    Animated.timing(sheetY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(sheetY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: false,
    }).start(() => setSheetOpen(false));
  };

  // LOAD
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchActivities();
        setActivities(data as any);
        setFiltered(data as any);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // APPLY FILTERS + SEARCH
  const applyFilters = () => {
    let list = [...activities];

    // Search by name + description
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    // Favorites only
    if (favoritesOnly) {
      list = list.filter((a) => a.isFavorite);
    }

    // Filter by category
    if (category !== 'all') {
      list = list.filter((a) => a.category === category);
    }

    // Filter by date
    const now = new Date();
    if (dateFilter !== 'all') {
      list = list.filter((a) => {
        const t = new Date(a.time);
        if (dateFilter === 'today')
          return t.toDateString() === now.toDateString();
        if (dateFilter === 'week') {
          const diff = (t.getTime() - now.getTime()) / (1000 * 3600 * 24);
          return diff >= 0 && diff <= 7;
        }
        return true;
      });
    }

    // distance filter left as placeholder

    // Sorting
    if (sortMode === 'newest') {
      list.sort((a, b) => +new Date(b.time) - +new Date(a.time));
    } else if (sortMode === 'oldest') {
      list.sort((a, b) => +new Date(a.time) - +new Date(b.time));
    } else if (sortMode === 'az') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFiltered(list);
  };

  useEffect(applyFilters, [
    searchQuery,
    favoritesOnly,
    category,
    distance,
    dateFilter,
    sortMode,
    activities,
  ]);

  const toggleFavorite = async (activityId: string) => {
    const current = activities.find((a) => a.id === activityId);
    if (!current) return;

    const newFav = !current.isFavorite;

    // Optimistinen päivitys UI:hin
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId ? { ...a, isFavorite: newFav } : a
      )
    );

    try {
      if (newFav) {
        await addFavorite(activityId);
      } else {
        await removeFavorite(activityId);
      }
    } catch (e) {
      // rollback virhetilanteessa
      setActivities((prev) =>
        prev.map((a) =>
          a.id === activityId ? { ...a, isFavorite: !newFav } : a
        )
      );
    }
  };

  const renderItem = ({ item }: { item: Activity & { isFavorite?: boolean } }) => {
    const dateLabel = new Date(item.time).toLocaleString();
    const isFav = !!item.isFavorite;

    return (
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() =>
          navigation.navigate('ActivityDetails', { activityId: item.id })
        }
        activeOpacity={0.9}
      >
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flex: 1, marginRight: SPACING.sm }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
            </View>

            <View
              style={[
                styles.categoryTag,
                CATEGORY_COLORS[item.category] || CATEGORY_COLORS['yhteisö'],
              ]}
            >
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>

            <TouchableOpacity
              onPress={() => toggleFavorite(item.id)}
              style={styles.favoriteIconWrapper}
            >
              <Text style={[styles.favoriteIcon, isFav && styles.favoriteIconActive]}>
                {isFav ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.cardFooterRow}>
            <Text style={styles.cardFooterText}>{dateLabel}</Text>
            <Text style={[styles.cardFooterText, { color: COLORS.primaryDark }]}>
              Näytä tiedot →
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.centerText}>Ladataan aktiviteetteja...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* SEARCH BAR */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Hae nimellä tai kuvauksella..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* FILTER BUTTON */}
      <TouchableOpacity style={styles.filterButton} onPress={openSheet}>
        <Text style={styles.filterButtonText}>⚙ Suodattimet & lajittelu</Text>
      </TouchableOpacity>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateActivity')}
        activeOpacity={0.9}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* OVERLAY */}
      {sheetOpen && (
        <Pressable style={styles.overlay} onPress={closeSheet} />
      )}

      {/* BOTTOM SHEET */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}
      >
        <View {...panResponder.panHandlers} style={styles.sheetHandle} />

        <Text style={styles.sheetTitle}>Filtteröinti & Lajittelu</Text>

        {/* FAVORITES ONLY */}
        <Text style={styles.sectionTitle}>Suosikit</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.chip,
              favoritesOnly && styles.chipActive,
            ]}
            onPress={() => setFavoritesOnly(!favoritesOnly)}
          >
            <Text
              style={[
                styles.chipText,
                favoritesOnly && styles.chipTextActive,
              ]}
            >
              Näytä vain suosikit
            </Text>
          </TouchableOpacity>
        </View>

        {/* CATEGORY */}
        <Text style={styles.sectionTitle}>Kategoria</Text>
        <View style={styles.row}>
          {['all', 'liikunta', 'kulttuuri', 'yhteisö'].map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.chip,
                category === c && styles.chipActive,
              ]}
              onPress={() => setCategory(c)}
            >
              <Text
                style={[
                  styles.chipText,
                  category === c && styles.chipTextActive,
                ]}
              >
                {c === 'all' ? 'Kaikki' : c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* DATE */}
        <Text style={styles.sectionTitle}>Ajankohta</Text>
        <View style={styles.row}>
          {[
            ['all', 'Kaikki'],
            ['today', 'Tänään'],
            ['week', 'Tämä viikko'],
          ].map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.chip,
                dateFilter === key && styles.chipActive,
              ]}
              onPress={() => setDateFilter(key)}
            >
              <Text
                style={[
                  styles.chipText,
                  dateFilter === key && styles.chipTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SORT */}
        <Text style={styles.sectionTitle}>Lajittelu</Text>
        <View style={styles.row}>
          {[
            ['newest', 'Uusin'],
            ['oldest', 'Vanhin'],
            ['az', 'A–Ö'],
          ].map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.chip,
                sortMode === key && styles.chipActive,
              ]}
              onPress={() => setSortMode(key)}
            >
              <Text
                style={[
                  styles.chipText,
                  sortMode === key && styles.chipTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={closeSheet} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Sulje</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  centerText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  searchWrapper: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  searchInput: {
    backgroundColor: COLORS.backgroundAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.sm,
  },

  cardWrapper: {
    marginBottom: SPACING.md,
  },
  card: {
    ...CARD_STYLE,
    padding: SPACING.lg,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  cardDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardFooterText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  categoryTag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 999,
    marginRight: SPACING.sm,
  },
  categoryText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    textTransform: 'capitalize',
    color: COLORS.text,
  },
  favoriteIconWrapper: {
    padding: SPACING.xs,
  },
  favoriteIcon: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textMuted,
  },
  favoriteIconActive: {
    color: COLORS.accent,
  },

  filterButton: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  filterButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primaryDark,
    fontWeight: FONT_WEIGHTS.semibold,
  },

  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: -2,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 500,
    backgroundColor: COLORS.backgroundAlt,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  sheetHandle: {
    width: 50,
    height: 5,
    borderRadius: 999,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  sheetTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primaryDark,
  },
  chipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  chipTextActive: {
    color: COLORS.primaryDark,
    fontWeight: FONT_WEIGHTS.medium,
  },
  closeButton: {
    marginTop: SPACING.xl,
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
});

export default ActivitiesListScreen;
