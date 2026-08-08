import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const TABS = ['LIVE', 'UPCOMING', 'FOLLOWING', 'COMPLETED', 'MY MATCHES'] as const;

const LIVE_MATCHES = [
  {
    id: 'live-1',
    status: 'LIVE',
    league: 'Kurukshetra League • T20',
    teamA: 'Falcons CC',
    teamB: 'Warriors XI',
    teamAShort: 'FC',
    teamBShort: 'WX',
    scoreA: '186/7',
    scoreB: '152/4',
    oversA: '32.3 Ov',
    oversB: '30.1 Ov',
    note: 'Falcons CC elected to bat',
    venue: 'Rajiv Cricket Ground, Hyderabad',
  },
  {
    id: 'live-2',
    status: 'LIVE',
    league: 'City Premier League • T20',
    teamA: 'Tigers XI',
    teamB: 'Kings CC',
    teamAShort: 'TX',
    teamBShort: 'KC',
    scoreA: '98/2',
    scoreB: '-/-',
    oversA: '11.4 Ov',
    oversB: 'Yet to bat',
    note: 'Tigers XI elected to bat',
    venue: 'Greenfield Stadium, Bengaluru',
  },
];

const UPCOMING_MATCHES = [
  {
    id: 'upcoming-1',
    date: 'Tomorrow',
    time: '4:00 PM',
    teamA: 'Falcons CC',
    teamB: 'Titans XI',
    teamAShort: 'FC',
    teamBShort: 'TX',
    venue: 'Rajiv Cricket Ground, Hyderabad',
    league: 'Kurukshetra League • T20',
  },
  {
    id: 'upcoming-2',
    date: 'May 18, 2025',
    time: '6:00 PM',
    teamA: 'Tigers XI',
    teamB: 'Kings CC',
    teamAShort: 'TX',
    teamBShort: 'KC',
    venue: 'Greenfield Stadium, Bengaluru',
    league: 'City Premier League • T20',
  },
  {
    id: 'upcoming-3',
    date: 'May 20, 2025',
    time: '10:30 AM',
    teamA: 'Royals CC',
    teamB: 'Strikers XI',
    teamAShort: 'RC',
    teamBShort: 'SX',
    venue: 'M Chinnaswamy Stadium, Bengaluru',
    league: 'City Premier League • T20',
  },
];

const COMPLETED_MATCHES = [
  {
    id: 'completed-1',
    league: 'Kurukshetra League • T20',
    date: 'Yesterday',
    teamA: 'Falcons CC',
    teamB: 'Warriors XI',
    teamAShort: 'FC',
    teamBShort: 'WX',
    scoreA: '186/7',
    scoreB: '152/9',
    oversA: '20.0 Ov',
    oversB: '20.0 Ov',
    result: 'Falcons CC won by 34 runs',
    venue: 'Rajiv Cricket Ground, Hyderabad',
  },
  {
    id: 'completed-2',
    league: 'City Premier League • T20',
    date: 'May 23, 2025',
    teamA: 'Tigers XI',
    teamB: 'Kings CC',
    teamAShort: 'TX',
    teamBShort: 'KC',
    scoreA: '198/6',
    scoreB: '195/8',
    oversA: '20.0 Ov',
    oversB: '20.0 Ov',
    result: 'Tigers XI won by 6 wickets',
    venue: 'Greenfield Stadium, Bengaluru',
  },
];

const MY_MATCHES = [
  {
    id: 'my-1',
    stage: 'LIVE NOW',
    league: 'Kurukshetra League • T20',
    teamA: 'Falcons CC',
    teamB: 'Warriors XI',
    scoreA: '186/7',
    scoreB: '152/4',
    venue: 'Rajiv Cricket Ground, Hyderabad',
    detail: 'Top Order Batsman • #17',
    result: 'Falcons CC elected to bat',
    action: 'View',
  },
  {
    id: 'my-2',
    stage: 'UPCOMING',
    league: 'City Premier League • T20',
    teamA: 'Tigers XI',
    teamB: 'Titans XI',
    scoreA: 'May 26, 2025',
    scoreB: '4:00 PM',
    venue: 'Greenfield Stadium, Bengaluru',
    detail: 'Middle Order Batsman • #8',
    result: 'Player role',
    action: 'Follow',
  },
];

export default function MatchesScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('LIVE');
  const [followedMatches, setFollowedMatches] = useState<string[]>(['live-1']);

  const showAction = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const toggleFollow = (matchId: string) => {
    setFollowedMatches((current) =>
      current.includes(matchId) ? current.filter((id) => id !== matchId) : [...current, matchId]
    );
  };

  const followingMatches = useMemo(() => {
    const allMatches = [...LIVE_MATCHES, ...UPCOMING_MATCHES, ...COMPLETED_MATCHES];
    return allMatches.filter((match) => followedMatches.includes(match.id));
  }, [followedMatches]);

  const renderMatchBadge = (label: string, color = colors.primary) => (
    <View style={[styles.statusBadge, { backgroundColor: `${color}18` }]}>
      <Text style={[styles.statusBadgeText, { color }]}>{label}</Text>
    </View>
  );

  const renderLiveTab = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.dot} />
          <Text style={styles.sectionTitle}>LIVE MATCHES</Text>
        </View>
        <TouchableOpacity onPress={() => showAction('Live Matches', 'Viewing all live matches soon.')}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>

      {LIVE_MATCHES.map((match) => (
        <TouchableOpacity
          key={match.id}
          style={styles.matchCard}
          activeOpacity={0.9}
          onPress={() => showAction(match.league, 'Match details screen is not connected yet.')}
        >
          <View style={styles.cardTopRow}>
            {renderMatchBadge(match.status)}
            <Text style={styles.leagueText}>{match.league}</Text>
          </View>

          <View style={styles.matchRow}>
            <View style={styles.teamColumn}>
              <View style={styles.teamLogo}>
                <Text style={styles.teamLogoText}>{match.teamAShort}</Text>
              </View>
              <Text style={styles.teamTitle}>{match.teamA}</Text>
              <Text style={styles.scoreValue}>{match.scoreA}</Text>
              <Text style={styles.scoreSub}>{match.oversA}</Text>
            </View>

            <View style={styles.centerColumn}>
              <Text style={styles.versus}>VS</Text>
              <Text style={styles.matchNote}>{match.note}</Text>
            </View>

            <View style={styles.teamColumn}>
              <View style={styles.teamLogo}>
                <Text style={styles.teamLogoText}>{match.teamBShort}</Text>
              </View>
              <Text style={styles.teamTitle}>{match.teamB}</Text>
              <Text style={styles.scoreValue}>{match.scoreB}</Text>
              <Text style={styles.scoreSub}>{match.oversB}</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.footerMeta}>
              <Feather name="map-pin" size={13} color={colors.primary} />
              <Text style={styles.footerMetaText}>{match.venue}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFollow(match.id)} style={styles.followChip}>
              <Text style={styles.followChipText}>
                {followedMatches.includes(match.id) ? 'Following' : '+ Follow'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderUpcomingTab = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Feather name="calendar" size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>UPCOMING MATCHES</Text>
        </View>
        <TouchableOpacity onPress={() => showAction('Upcoming Matches', 'Fixture list expansion coming soon.')}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>

      {UPCOMING_MATCHES.map((match) => (
        <View key={match.id} style={styles.matchCard}>
          <View style={styles.upcomingRow}>
            <View style={styles.upcomingDateBlock}>
              <Text style={styles.upcomingDate}>{match.date}</Text>
              <Text style={styles.upcomingTime}>{match.time}</Text>
            </View>

            <View style={styles.upcomingTeams}>
              <View style={styles.upcomingTeam}>
                <View style={styles.teamLogo}>
                  <Text style={styles.teamLogoText}>{match.teamAShort}</Text>
                </View>
                <Text style={styles.teamTitle}>{match.teamA}</Text>
              </View>

              <Text style={styles.versus}>VS</Text>

              <View style={styles.upcomingTeam}>
                <View style={styles.teamLogo}>
                  <Text style={styles.teamLogoText}>{match.teamBShort}</Text>
                </View>
                <Text style={styles.teamTitle}>{match.teamB}</Text>
              </View>
            </View>
          </View>

          <View style={styles.metaStack}>
            <View style={styles.footerMeta}>
              <Feather name="map-pin" size={13} color={colors.primary} />
              <Text style={styles.footerMetaText}>{match.venue}</Text>
            </View>
            <View style={styles.footerMeta}>
              <MaterialCommunityIcons name="trophy-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.footerMetaText}>{match.league}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryOutlineButton}
            onPress={() => toggleFollow(match.id)}
          >
            <Text style={styles.primaryOutlineButtonText}>
              {followedMatches.includes(match.id) ? 'Following' : '+ Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderFollowingTab = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="star" size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>FOLLOWING MATCHES</Text>
        </View>
        <TouchableOpacity onPress={() => showAction('Following', 'All followed matches are shown below.')}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>

      {followingMatches.length ? (
        followingMatches.map((match: any) => (
          <View key={match.id} style={styles.matchCard}>
            <View style={styles.cardTopRow}>
              {renderMatchBadge(match.status || 'FOLLOWING', match.status ? colors.primary : '#55B7FF')}
              <Text style={styles.leagueText}>{match.league}</Text>
            </View>

            <View style={styles.followingTeamsRow}>
              <View style={styles.teamMini}>
                <View style={styles.teamLogo}>
                  <Text style={styles.teamLogoText}>{match.teamAShort}</Text>
                </View>
                <Text style={styles.teamTitle}>{match.teamA}</Text>
              </View>
              <Text style={styles.followingCenterText}>
                {'scoreA' in match ? `${match.scoreA} vs ${match.scoreB}` : `${match.date} • ${match.time}`}
              </Text>
              <View style={styles.teamMini}>
                <View style={styles.teamLogo}>
                  <Text style={styles.teamLogoText}>{match.teamBShort}</Text>
                </View>
                <Text style={styles.teamTitle}>{match.teamB}</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.footerMeta}>
                <Feather name="map-pin" size={13} color={colors.primary} />
                <Text style={styles.footerMetaText}>{match.venue}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleFollow(match.id)} style={styles.followChip}>
                <Text style={styles.followChipText}>Following</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="star-outline" size={34} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No followed matches yet</Text>
          <Text style={styles.emptyText}>Follow a match from Live or Upcoming to see it here.</Text>
        </View>
      )}
    </View>
  );

  const renderCompletedTab = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <MaterialCommunityIcons name="trophy-outline" size={18} color={colors.primary} />
          <Text style={styles.sectionTitle}>COMPLETED MATCHES</Text>
        </View>
        <TouchableOpacity onPress={() => showAction('Completed Matches', 'Archive view is coming soon.')}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>

      {COMPLETED_MATCHES.map((match) => (
        <View key={match.id} style={styles.matchCard}>
          <View style={styles.cardTopRow}>
            <Text style={styles.leagueText}>{match.league}</Text>
            <Text style={styles.dateText}>{match.date}</Text>
          </View>

          <View style={styles.matchRow}>
            <View style={styles.teamColumn}>
              <View style={styles.teamLogo}>
                <Text style={styles.teamLogoText}>{match.teamAShort}</Text>
              </View>
              <Text style={styles.teamTitle}>{match.teamA}</Text>
              <Text style={styles.scoreValue}>{match.scoreA}</Text>
              <Text style={styles.scoreSub}>{match.oversA}</Text>
            </View>

            <View style={styles.centerColumn}>
              <Text style={styles.resultText}>{match.result}</Text>
            </View>

            <View style={styles.teamColumn}>
              <View style={styles.teamLogo}>
                <Text style={styles.teamLogoText}>{match.teamBShort}</Text>
              </View>
              <Text style={styles.teamTitle}>{match.teamB}</Text>
              <Text style={styles.scoreValue}>{match.scoreB}</Text>
              <Text style={styles.scoreSub}>{match.oversB}</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.footerMeta}>
              <Feather name="map-pin" size={13} color={colors.primary} />
              <Text style={styles.footerMetaText}>{match.venue}</Text>
            </View>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => showAction('Scorecard', `Scorecard for ${match.teamA} vs ${match.teamB} is not connected yet.`)}
            >
              <Text style={styles.secondaryButtonText}>Scorecard</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderMyMatchesTab = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="person" size={16} color={colors.primary} />
            <Text style={styles.sectionTitle}>MY MATCHES</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Matches you are part of or managing</Text>
        </View>
        <TouchableOpacity onPress={() => showAction('Filter', 'Role filters are not connected yet.')}>
          <Text style={styles.viewAll}>Filter</Text>
        </TouchableOpacity>
      </View>

      {MY_MATCHES.map((match) => (
        <View key={match.id} style={styles.matchCard}>
          <View style={styles.cardTopRow}>
            {renderMatchBadge(match.stage, match.stage === 'LIVE NOW' ? colors.primary : '#55B7FF')}
            <Text style={styles.leagueText}>{match.league}</Text>
          </View>

          <View style={styles.matchRow}>
            <View style={styles.teamColumn}>
              <Text style={styles.teamTitle}>{match.teamA}</Text>
              <Text style={styles.scoreValue}>{match.scoreA}</Text>
            </View>

            <View style={styles.centerColumn}>
              <Text style={styles.versus}>VS</Text>
              <Text style={styles.matchNote}>{match.result}</Text>
            </View>

            <View style={styles.teamColumn}>
              <Text style={styles.teamTitle}>{match.teamB}</Text>
              <Text style={styles.scoreValue}>{match.scoreB}</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.footerMetaText}>{match.venue}</Text>
              <Text style={styles.roleText}>{match.detail}</Text>
            </View>
            <TouchableOpacity
              style={styles.primaryOutlineButton}
              onPress={() =>
                match.action === 'View'
                  ? showAction('My Match', 'Detailed participation view is not connected yet.')
                  : toggleFollow(match.id)
              }
            >
              <Text style={styles.primaryOutlineButtonText}>
                {match.action === 'Follow' && followedMatches.includes(match.id) ? 'Following' : match.action}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <Text style={styles.logo}>P</Text>
          <Text style={styles.headerTitle}>Matches</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => showAction('Notifications', 'Notifications panel is not connected yet.')}
          >
            <Feather name="bell" size={20} color={colors.textPrimary} />
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>3</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => showAction('Messages', 'Chat inbox is not connected yet.')}
          >
            <Feather name="message-circle" size={20} color={colors.textPrimary} />
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>2</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.profilePic} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.profileInitial}>RK</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'LIVE' && renderLiveTab()}
        {activeTab === 'UPCOMING' && renderUpcomingTab()}
        {activeTab === 'FOLLOWING' && renderFollowingTab()}
        {activeTab === 'COMPLETED' && renderCompletedTab()}
        {activeTab === 'MY MATCHES' && renderMyMatchesTab()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#04090F',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: '800',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerBadge: {
    position: 'absolute',
    top: -2,
    right: -1,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  headerBadgeText: {
    color: '#07100A',
    fontSize: 10,
    fontWeight: '700',
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundCard,
  },
  profileInitial: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.primary,
  },
  content: {
    flex: 1,
    marginTop: 6,
  },
  section: {
    paddingBottom: 28,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  viewAll: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  matchCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#0A121A',
    borderWidth: 1,
    borderColor: 'rgba(117, 255, 159, 0.10)',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  leagueText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  dateText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  teamLogo: {
    width: 54,
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginBottom: 4,
  },
  teamLogoText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  teamTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  scoreValue: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  scoreSub: {
    color: colors.primary,
    fontSize: 13,
  },
  centerColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  versus: {
    color: colors.textMuted,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  matchNote: {
    color: colors.primary,
    fontSize: 13,
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  footerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  footerMetaText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  followChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(117, 255, 159, 0.18)',
    backgroundColor: 'rgba(0, 255, 0, 0.08)',
  },
  followChipText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  upcomingRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 14,
  },
  upcomingDateBlock: {
    width: 90,
  },
  upcomingDate: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  upcomingTime: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  upcomingTeams: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upcomingTeam: {
    alignItems: 'center',
    flex: 1,
  },
  metaStack: {
    gap: 8,
    marginBottom: 14,
  },
  primaryOutlineButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 11,
    alignItems: 'center',
  },
  primaryOutlineButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  followingTeamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14,
  },
  teamMini: {
    alignItems: 'center',
    flex: 1,
  },
  followingCenterText: {
    flex: 1.1,
    color: colors.textPrimary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  resultText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  secondaryButtonText: {
    color: '#07100A',
    fontWeight: '700',
    fontSize: 13,
  },
  roleText: {
    color: colors.primary,
    fontSize: 12,
    marginTop: 4,
  },
  emptyState: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#0A121A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
