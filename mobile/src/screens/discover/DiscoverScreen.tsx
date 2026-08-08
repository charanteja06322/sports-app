import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const CATEGORIES = [
  { id: 1, title: 'Teams', icon: 'users', accent: '#00FF00' },
  { id: 2, title: 'Players', icon: 'activity', accent: '#60E986' },
  { id: 3, title: 'Tournaments', icon: 'award', accent: '#5DA6FF' },
  { id: 4, title: 'Matches', icon: 'zap', accent: '#FFB800' },
  { id: 5, title: 'Grounds', icon: 'map', accent: '#FF6B6B' },
  { id: 6, title: 'News', icon: 'file-text', accent: '#A78BFA' },
];

const TRENDING = [
  { id: 't1', title: "Kohli's century powers India to victory", icon: 'star', time: '2h ago', views: '12K views' },
  { id: 't2', title: 'Mumbai win the T20 Championship 2025', icon: 'trophy', time: '5h ago', views: '18K views' },
  { id: 't3', title: 'Top 5 finishes of the IPL 2025', icon: 'flame', time: '1d ago', views: '25K views' },
];

const RECOMMENDED = [
  { id: 'r1', name: 'Sunrisers Hyderabad', type: 'T20 Franchise', tag: 'Strong squad for this season.', followers: '28K', initials: 'SH' },
  { id: 'r2', name: 'Royal Challengers', type: 'T20 Franchise', tag: 'Star-studded lineup.', followers: '32K', initials: 'RC' },
];

export default function DiscoverScreen({ navigation }: any) {
  const [query, setQuery] = useState('');

  const showAction = (title: string, msg: string) => Alert.alert(title, msg);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>P</Text>
          </View>
          <Text style={styles.brandName}>Discover</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => showAction('Notifications', 'Not connected yet.')}>
            <Feather name="bell" size={20} color={colors.textPrimary} />
            <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => showAction('Messages', 'Not connected yet.')}>
            <Feather name="message-circle" size={20} color={colors.textPrimary} />
            <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.profileInitial}>RK</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Feather name="search" size={18} color={colors.textSecondary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
              placeholder="Search players, teams, matches..."
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={() => showAction('Filters', 'Coming soon.')}>
            <Feather name="sliders" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <View style={styles.catGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.catCard}
                onPress={() => showAction(cat.title, `${cat.title} browse coming soon.`)}
              >
                <View style={[styles.catIcon, { borderColor: cat.accent }]}>
                  <Feather name={cat.icon as any} size={26} color={cat.accent} />
                </View>
                <Text style={styles.catTitle}>{cat.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Feather name="trending-up" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Trending in Cricket</Text>
            </View>
            <TouchableOpacity onPress={() => showAction('Trending', 'Full trending view coming soon.')}>
              <Text style={styles.linkText}>View all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendRail}>
            {TRENDING.map((item) => (
              <TouchableOpacity key={item.id} style={styles.trendCard} activeOpacity={0.85} onPress={() => showAction('Video', 'Video player coming soon.')}>
                <View style={styles.trendThumb}>
                  <Feather name="play" size={32} color="rgba(255,255,255,0.6)" />
                </View>
                <Text style={styles.trendTitle}>{item.title}</Text>
                <Text style={styles.trendMeta}>{item.time} • {item.views}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recommended Teams */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="star" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Recommended Teams</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.linkText}>View all</Text>
            </TouchableOpacity>
          </View>
          {RECOMMENDED.map((team) => (
            <View key={team.id} style={styles.recCard}>
              <View style={styles.recLogo}>
                <Text style={styles.recLogoText}>{team.initials}</Text>
              </View>
              <View style={styles.recInfo}>
                <Text style={styles.recName}>{team.name}</Text>
                <Text style={styles.recType}>{team.type}</Text>
                <Text style={styles.recTag}>{team.tag}</Text>
                <Text style={styles.recFollowers}>{team.followers} Followers</Text>
              </View>
              <TouchableOpacity style={styles.recFollowBtn}>
                <Text style={styles.recFollowText}>Follow</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Rankings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons name="trophy-outline" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Rankings</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.linkText}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons name="chart-bar" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>Rankings coming soon</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#04090F' },
  header: {
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  logoCircle: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
    backgroundColor: 'rgba(0,255,0,0.06)',
  },
  logoText: { color: colors.primary, fontSize: 18, fontWeight: '800' },
  brandName: { color: colors.textPrimary, fontSize: 22, fontWeight: '800', letterSpacing: 0.4 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  badge: {
    position: 'absolute', top: 2, right: 3, minWidth: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingHorizontal: 4,
  },
  badgeText: { color: '#041008', fontSize: 10, fontWeight: '700' },
  profileBtn: {
    width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: colors.primary, backgroundColor: colors.backgroundCard,
  },
  profileInitial: { color: colors.textPrimary, fontSize: 13, fontWeight: '700' },
  content: { flex: 1 },
  searchRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 14, gap: 10 },
  searchBox: {
    flex: 1, height: 48, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', flexDirection: 'row',
    alignItems: 'center', paddingHorizontal: 14, gap: 10,
  },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 14 },
  filterBtn: {
    width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  section: { paddingHorizontal: 16, marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  linkText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  catCard: {
    width: '31%', aspectRatio: 1, backgroundColor: colors.backgroundCard, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', padding: 14,
  },
  catIcon: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  catTitle: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },
  trendRail: { paddingRight: 16 },
  trendCard: {
    width: 240, marginRight: 12, backgroundColor: colors.backgroundCard, borderRadius: 18, overflow: 'hidden',
  },
  trendThumb: {
    width: '100%', height: 140, backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center', justifyContent: 'center',
  },
  trendTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6, lineHeight: 20 },
  trendMeta: { fontSize: 11, color: colors.textMuted, paddingHorizontal: 14, paddingBottom: 14 },
  recCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundCard,
    borderRadius: 18, padding: 16, marginBottom: 10,
  },
  recLogo: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  recLogoText: { fontSize: 16, fontWeight: '800', color: colors.primary },
  recInfo: { flex: 1 },
  recName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  recType: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  recTag: { fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  recFollowers: { fontSize: 11, color: colors.textMuted },
  recFollowBtn: {
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12,
    backgroundColor: colors.primary,
  },
  recFollowText: { fontSize: 13, fontWeight: '700', color: '#000000' },
  emptyCard: {
    backgroundColor: colors.backgroundCard, borderRadius: 18, padding: 40, alignItems: 'center',
  },
  emptyText: { fontSize: 14, color: colors.textSecondary, marginTop: 10 },
});
