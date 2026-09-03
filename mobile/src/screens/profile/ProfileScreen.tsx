import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

const TABS = ['Stats', 'Teams', 'History'] as const;

const PLAYER_STATS = {
  name: 'Rohit Khanna',
  role: 'Opening Batter',
  team: 'Falcons CC',
  matchesPlayed: 24,
  runsScored: 1042,
  average: 43.42,
  strikeRate: 128.5,
  highest: 87,
};

const TEAMS = [
  { id: '1', name: 'Falcons CC', role: 'Captain', joinedDate: 'Jan 2024' },
  { id: '2', name: 'City Premier Team', role: 'Player', joinedDate: 'Mar 2024' },
  { id: '3', name: 'Hyderabad Regional XI', role: 'Vice-Captain', joinedDate: 'Jun 2024' },
];

const MATCH_HISTORY = [
  { id: '1', vs: 'Warriors XI', runs: 67, balls: 52, date: '2 days ago' },
  { id: '2', vs: 'Tigers CC', runs: 34, balls: 28, date: '5 days ago' },
  { id: '3', vs: 'Kings XI', runs: 82, balls: 61, date: '8 days ago' },
  { id: '4', vs: 'Eagles CC', runs: 45, balls: 38, date: '12 days ago' },
];

export default function ProfileScreen({ navigation }: any) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Stats');

  const showAction = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileCard}>
            <View style={styles.avatarSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {PLAYER_STATS.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => showAction('Edit', 'Profile editing is coming soon.')}
              >
                <Feather name="edit-2" size={14} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.playerName}>{PLAYER_STATS.name}</Text>
              <Text style={styles.playerRole}>{PLAYER_STATS.role}</Text>
              <Text style={styles.playerTeam}>
                <MaterialCommunityIcons name="shield" size={12} /> {PLAYER_STATS.team}
              </Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{PLAYER_STATS.matchesPlayed}</Text>
                <Text style={styles.statLabel}>Matches</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{PLAYER_STATS.runsScored}</Text>
                <Text style={styles.statLabel}>Runs</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{PLAYER_STATS.average}</Text>
                <Text style={styles.statLabel}>Average</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => showAction('Edit Profile', 'Profile editing is coming soon.')}
              >
                <Feather name="edit" size={16} color={colors.textLight} />
                <Text style={styles.primaryButtonText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => showAction('Share', 'Sharing profile is coming soon.')}
              >
                <Feather name="share-2" size={16} color={colors.primary} />
                <Text style={styles.secondaryButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'Stats' && (
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statCardLabel}>Highest Score</Text>
                <Text style={styles.statCardValue}>{PLAYER_STATS.highest}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statCardLabel}>Strike Rate</Text>
                <Text style={styles.statCardValue}>{PLAYER_STATS.strikeRate}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statCardLabel}>Matches</Text>
                <Text style={styles.statCardValue}>{PLAYER_STATS.matchesPlayed}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statCardLabel}>Total Runs</Text>
                <Text style={styles.statCardValue}>{PLAYER_STATS.runsScored}</Text>
              </View>
            </View>
          )}

          {activeTab === 'Teams' && (
            <View>
              {TEAMS.map((team) => (
                <TouchableOpacity
                  key={team.id}
                  style={styles.teamItem}
                  onPress={() => showAction('Team', `${team.name} details are coming soon.`)}
                >
                  <View style={styles.teamBadge}>
                    <Text style={styles.teamBadgeText}>
                      {team.name.split(' ')[0][0]}
                    </Text>
                  </View>
                  <View style={styles.teamItemInfo}>
                    <Text style={styles.teamItemName}>{team.name}</Text>
                    <Text style={styles.teamItemRole}>
                      {team.role} • Joined {team.joinedDate}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'History' && (
            <View>
              {MATCH_HISTORY.map((match) => (
                <View key={match.id} style={styles.historyItem}>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyVs}>vs {match.vs}</Text>
                    <Text style={styles.historyDate}>{match.date}</Text>
                  </View>
                  <View style={styles.historyScore}>
                    <Text style={styles.score}>{match.runs}</Text>
                    <Text style={styles.balls}>({match.balls} balls)</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  profileCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarSection: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textLight,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  playerName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  playerRole: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  playerTeam: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textLight,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statCardLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  teamBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  teamBadgeText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textLight,
  },
  teamItemInfo: {
    flex: 1,
  },
  teamItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  teamItemRole: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyInfo: {
    flex: 1,
  },
  historyVs: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  historyScore: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  balls: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
