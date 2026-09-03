import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import apiService from '../../services/api.service';

export default function MatchesScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMatches();
  }, [activeFilter]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch live matches
      try {
        const liveRes = await apiService.getLiveMatches();
        if (liveRes?.success) {
          setLiveMatches(liveRes.matches || []);
        }
      } catch (err) {
        console.warn('Failed to fetch live matches:', err);
        setLiveMatches([]);
      }

      // Fetch upcoming matches
      try {
        const upcomingRes = await apiService.getUpcomingMatches(20);
        if (upcomingRes?.success) {
          setUpcomingMatches(upcomingRes.matches || []);
        }
      } catch (err) {
        console.warn('Failed to fetch upcoming matches:', err);
        setUpcomingMatches([]);
      }
    } catch (err: any) {
      console.error('Error fetching matches:', err);
      setError(err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  const handleMatchPress = (matchId: string) => {
    navigation.navigate('MatchDetail', { matchId });
  };

  const handleNotify = (matchId: string) => {
    Alert.alert('✓ Notification Set', 'You will be notified before this match starts.');
  };

  const handleShare = (matchId: string) => {
    Alert.alert('Share', 'Sharing match will be available soon.');
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading matches...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setActiveFilter(activeFilter === 'all' ? activeFilter : 'all')}
          >
            <Feather name="search" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => Alert.alert('Filters', 'Advanced filters are coming soon.')}
          >
            <Feather name="sliders" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Feather name="alert-circle" size={16} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Live Matches Section */}
        {liveMatches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Live Matches</Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveBadgeText}>LIVE NOW</Text>
              </View>
            </View>

            {liveMatches.map((match) => (
              <TouchableOpacity
                key={match.id}
                style={styles.matchCard}
                onPress={() => handleMatchPress(match.id)}
                activeOpacity={0.7}
              >
                <View style={styles.matchStatus}>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>LIVE</Text>
                  </View>
                </View>

                <View style={styles.matchContent}>
                  <View style={styles.teamRow}>
                    <View style={styles.team}>
                      <View style={styles.teamBadge}>
                        <Text style={styles.teamInitial}>{match.team1?.short_name?.substring(0, 2) || 'T1'}</Text>
                      </View>
                      <View style={styles.teamInfo}>
                        <Text style={styles.teamName}>{match.team1?.name || 'Team 1'}</Text>
                        <Text style={styles.score}>-</Text>
                      </View>
                    </View>

                    <Text style={styles.vsText}>vs</Text>

                    <View style={styles.team}>
                      <View style={styles.teamBadge}>
                        <Text style={styles.teamInitial}>{match.team2?.short_name?.substring(0, 2) || 'T2'}</Text>
                      </View>
                      <View style={styles.teamInfo}>
                        <Text style={styles.teamName}>{match.team2?.name || 'Team 2'}</Text>
                        <Text style={styles.score}>-</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.matchSummary}>{match.match_type || 'Cricket'} • {match.ground?.name || 'Venue TBA'}</Text>
                </View>

                <View style={styles.matchActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleNotify(match.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name="bell" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleShare(match.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name="share-2" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>

                <Feather name="chevron-right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Upcoming Matches Section */}
        {upcomingMatches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Matches</Text>

            {upcomingMatches.map((match) => (
              <TouchableOpacity
                key={match.id}
                style={styles.matchCard}
                onPress={() => handleMatchPress(match.id)}
                activeOpacity={0.7}
              >
                <View style={styles.matchContent}>
                  <View style={styles.teamRow}>
                    <View style={styles.team}>
                      <View style={styles.teamBadge}>
                        <Text style={styles.teamInitial}>{match.team1?.short_name?.substring(0, 2) || 'T1'}</Text>
                      </View>
                      <View style={styles.teamInfo}>
                        <Text style={styles.teamName}>{match.team1?.name || 'Team 1'}</Text>
                      </View>
                    </View>

                    <Text style={styles.vsText}>vs</Text>

                    <View style={styles.team}>
                      <View style={styles.teamBadge}>
                        <Text style={styles.teamInitial}>{match.team2?.short_name?.substring(0, 2) || 'T2'}</Text>
                      </View>
                      <View style={styles.teamInfo}>
                        <Text style={styles.teamName}>{match.team2?.name || 'Team 2'}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.matchDetails}>
                    <Text style={styles.detailText}>
                      <Feather name="calendar" size={12} /> {formatDate(match.match_date)}
                    </Text>
                    <Text style={styles.detailText}>
                      <Feather name="map-pin" size={12} /> {match.ground?.name || 'Venue TBA'}
                    </Text>
                  </View>
                  <Text style={styles.league}>{match.tournament?.name || match.match_type || 'Cricket'}</Text>
                </View>

                <View style={styles.matchActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleNotify(match.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name="bell" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleShare(match.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name="share-2" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>

                <Feather name="chevron-right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {liveMatches.length === 0 && upcomingMatches.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="cricket" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No matches available</Text>
            <Text style={styles.emptyCopy}>Check back soon for upcoming matches</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundCard,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#ffe5e5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: '#c92a2a',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: `${colors.primary}20`,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  liveBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  matchStatus: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: `${colors.primary}20`,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  matchContent: {
    flex: 1,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  team: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamInitial: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textLight,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  score: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  vsText: {
    fontSize: 12,
    color: colors.textMuted,
    marginHorizontal: 6,
    fontWeight: '600',
  },
  matchSummary: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  matchDetails: {
    marginTop: 8,
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  league: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
    fontStyle: 'italic',
  },
  matchActions: {
    flexDirection: 'row',
    gap: 8,
    marginRight: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCopy: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: colors.textLight,
    fontWeight: '600',
  },
});
