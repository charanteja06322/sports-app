import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import apiService from '../../services/api.service';

export default function MatchDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { matchId } = route.params as { matchId: string };

  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatchDetails();
  }, [matchId]);

  const loadMatchDetails = async () => {
    try {
      setLoading(true);
      const res = await apiService.getMatch(matchId);
      if (res?.success) {
        setMatch(res.match);
      }
    } catch (err: any) {
      console.error('Error loading match:', err);
      Alert.alert('Error', 'Failed to load match details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!match) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Match not found</Text>
        </View>
      </View>
    );
  }

  const isLive = match.status === 'live';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Match Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Live Badge */}
        {isLive && (
          <View style={styles.liveBanner}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE NOW</Text>
          </View>
        )}

        {/* Teams Card */}
        <View style={styles.teamsCard}>
          <View style={styles.teamRow}>
            <View style={styles.team}>
              <View style={styles.teamLogo}>
                <Text style={styles.teamInitial}>
                  {match.team1?.short_name?.[0] || 'A'}
                </Text>
              </View>
              <Text style={styles.teamName}>{match.team1?.name || 'Team A'}</Text>
            </View>

            <Text style={styles.vs}>vs</Text>

            <View style={styles.team}>
              <View style={styles.teamLogo}>
                <Text style={styles.teamInitial}>
                  {match.team2?.short_name?.[0] || 'B'}
                </Text>
              </View>
              <Text style={styles.teamName}>{match.team2?.name || 'Team B'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Match Type Badge */}
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Feather name="award" size={16} color={colors.primary} />
              <Text style={styles.badgeText}>{match.match_type || 'T20'}</Text>
            </View>
            <View style={styles.badge}>
              <Feather name="users" size={16} color={colors.primary} />
              <Text style={styles.badgeText}>{match.overs || '20'} Overs</Text>
            </View>
            <View style={styles.badge}>
              <Feather name={isLive ? 'play-circle' : 'clock'} size={16} color={colors.primary} />
              <Text style={styles.badgeText}>{match.status}</Text>
            </View>
          </View>
        </View>

        {/* Match Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Match Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Feather name="calendar" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Date & Time</Text>
              <Text style={styles.infoValue}>
                {new Date(match.match_date).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Feather name="map-pin" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Venue</Text>
              <Text style={styles.infoValue}>{match.ground?.name || 'TBA'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Feather name="flag" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Tournament</Text>
              <Text style={styles.infoValue}>{match.tournament?.name || 'Friendly'}</Text>
            </View>
          </View>
        </View>

        {/* Toss Info (if available) */}
        {match.toss_winner && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Toss Information</Text>
            <View style={styles.tossInfo}>
              <Text style={styles.tossText}>
                <Text style={styles.tossBold}>{match.toss_winner}</Text> won the toss and elected to{' '}
                <Text style={styles.tossBold}>{match.toss_decision}</Text>
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Notify', 'Notifications coming soon')}
          >
            <Feather name="bell" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Set Reminder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Share', 'Share feature coming soon')}
          >
            <Feather name="share-2" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Share Match</Text>
          </TouchableOpacity>

          {isLive && (
            <TouchableOpacity
              style={[styles.actionButton, styles.liveButton]}
              onPress={() => Alert.alert('Live Score', 'Live score tracking coming soon')}
            >
              <Feather name="play" size={20} color={colors.background} />
              <Text style={[styles.actionButtonText, { color: colors.background }]}>
                Watch Live
              </Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  liveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffe5e5',
    paddingVertical: 10,
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff6b6b',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ff6b6b',
  },
  teamsCard: {
    backgroundColor: colors.backgroundCard,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  team: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  teamInitial: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  teamName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  vs: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
    marginHorizontal: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${colors.primary}10`,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  tossInfo: {
    backgroundColor: `${colors.primary}10`,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  tossText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  tossBold: {
    fontWeight: '700',
    color: colors.primary,
  },
  actionSection: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.backgroundCard,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  liveButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
