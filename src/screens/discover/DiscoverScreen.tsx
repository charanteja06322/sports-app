/**
 * DiscoverScreen — Premium Dark Sports UI
 * Data-driven — no hardcoded mock content.
 */
import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const CATEGORIES = [
  { id: 'teams', title: 'Teams', icon: 'users' as const, screen: 'TeamsList' },
  { id: 'players', title: 'Players', icon: 'activity' as const },
  { id: 'tournaments', title: 'Tourneys', icon: 'award' as const, screen: 'TournamentsList' },
  { id: 'matches', title: 'Matches', icon: 'zap' as const, screen: 'Matches' },
  { id: 'grounds', title: 'Grounds', icon: 'map-pin' as const },
  { id: 'news', title: 'News', icon: 'file-text' as const },
];

export default function DiscoverScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { const timer = setTimeout(() => setLoading(false), 600); return () => clearTimeout(timer); }, []);

  const showComingSoon = (feature: string) => Alert.alert('Coming Soon', `${feature} will be available in an upcoming update.`);

  const handleCategory = (cat: typeof CATEGORIES[number]) => {
    if (cat.screen) navigation.navigate(cat.screen); else showComingSoon(cat.title);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandRow}><View style={styles.logoCircle}><Feather name="compass" size={18} color={colors.primary} /></View><Text style={styles.brandName}>Discover</Text></View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => showComingSoon('Notifications')}><Feather name="bell" size={20} color={colors.textPrimary} /></TouchableOpacity>
          <TouchableOpacity style={styles.avatarBtn} onPress={() => navigation.navigate('Profile')}><Feather name="user" size={16} color={colors.textPrimary} /></TouchableOpacity>
        </View>
      </View>

      {loading ? (<View style={styles.loadingWrap}><ActivityIndicator size="large" color={colors.primary} /></View>) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.searchRow}><View style={styles.searchBox}><Feather name="search" size={17} color={colors.textMuted} /><TextInput value={query} onChangeText={setQuery} style={styles.searchInput} placeholder="Search players, teams, matches..." placeholderTextColor={colors.textMuted} />{query.length > 0 && (<TouchableOpacity onPress={() => setQuery('')}><Feather name="x" size={16} color={colors.textSecondary} /></TouchableOpacity>)}</View></View>
          <View style={styles.section}><View style={styles.sectionTitleRow}><Feather name="grid" size={16} color={colors.primary} /><Text style={styles.sectionTitle}>Browse</Text></View><View style={styles.catGrid}>{CATEGORIES.map((cat) => (<TouchableOpacity key={cat.id} style={styles.catCard} onPress={() => handleCategory(cat)} activeOpacity={0.75}><View style={styles.catIcon}><Feather name={cat.icon} size={24} color={colors.primary} /></View><Text style={styles.catTitle}>{cat.title}</Text></TouchableOpacity>))}</View></View>
          <View style={styles.section}><View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><Feather name="trending-up" size={16} color={colors.primary} /><Text style={styles.sectionTitle}>Trending in Cricket</Text></View></View><View style={styles.emptyCard}><Feather name="zap" size={32} color={colors.textMuted} /><Text style={styles.emptyText}>Trending content will appear here</Text><Text style={styles.emptySub}>Stay tuned for the latest cricket highlights and news.</Text></View></View>
          <View style={styles.section}><View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><Ionicons name="star" size={16} color={colors.primary} /><Text style={styles.sectionTitle}>Recommended Teams</Text></View><TouchableOpacity onPress={() => navigation.navigate('TeamsList')}><Text style={styles.linkText}>Browse</Text></TouchableOpacity></View><View style={styles.emptyCard}><Feather name="users" size={32} color={colors.textMuted} /><Text style={styles.emptyText}>No recommendations yet</Text><Text style={styles.emptySub}>Join or create teams to get personalized team recommendations.</Text></View></View>
          <View style={styles.section}><View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><MaterialCommunityIcons name="trophy-outline" size={16} color={colors.primary} /><Text style={styles.sectionTitle}>Rankings</Text></View></View><View style={styles.emptyCard}><MaterialCommunityIcons name="chart-bar" size={32} color={colors.textMuted} /><Text style={styles.emptyText}>Rankings coming soon</Text><Text style={styles.emptySub}>Player and team rankings will be available here.</Text></View></View>
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background }, loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 16, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  logoCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 10, backgroundColor: colors.primaryMuted },
  brandName: { color: colors.textPrimary, fontSize: 20, fontWeight: '800', letterSpacing: 0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  avatarBtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 1.5, borderColor: colors.primary, backgroundColor: colors.backgroundCard, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 }, searchRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12, gap: 10 },
  searchBox: { flex: 1, height: 44, backgroundColor: colors.backgroundCard, borderRadius: 13, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 14 },
  section: { paddingHorizontal: 16, marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary }, linkText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catCard: { width: '31%', aspectRatio: 0.95, backgroundColor: colors.backgroundCard, borderRadius: 16, alignItems: 'center', justifyContent: 'center', padding: 12, borderWidth: 1, borderColor: colors.border },
  catIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,102,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  catTitle: { fontSize: 12, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },
  emptyCard: { backgroundColor: colors.backgroundCard, borderRadius: 16, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: colors.border, gap: 8 },
  emptyText: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  emptySub: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
});