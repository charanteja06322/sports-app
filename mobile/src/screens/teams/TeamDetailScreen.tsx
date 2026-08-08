/**
 * Team Detail Screen
 * View team details, members, and actions
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors } from '../../theme';
import { teamsService } from '../../services/teams.service';

export function TeamDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { teamId } = route.params as { teamId: string };

  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    loadTeamDetails();
  }, [teamId]);

  const loadTeamDetails = async () => {
    try {
      const data = await teamsService.getTeamById(teamId);
      setTeam(data);
      
      // Check if current user is a member
      const myTeams = await teamsService.getMyTeams();
      const isMemberCheck = myTeams.some((t: any) => t.id === teamId);
      setIsMember(isMemberCheck);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    Alert.alert(
      'Join Team',
      `Do you want to join ${team.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Join',
          onPress: async () => {
            try {
              setJoining(true);
              await teamsService.joinTeam(teamId);
              Alert.alert('Success', 'You have joined the team!');
              loadTeamDetails();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            } finally {
              setJoining(false);
            }
          },
        },
      ]
    );
  };

  const handleLeaveTeam = async () => {
    Alert.alert(
      'Leave Team',
      `Are you sure you want to leave ${team.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              setJoining(true);
              await teamsService.leaveTeam(teamId);
              Alert.alert('Success', 'You have left the team');
              loadTeamDetails();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            } finally {
              setJoining(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      </ScreenContainer>
    );
  }

  if (!team) {
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Team not found</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.teamIcon}>
          <Text style={styles.teamInitial}>
            {team.short_name?.[0] || team.name[0]}
          </Text>
        </View>
        
        <Text style={styles.teamName}>{team.name}</Text>
        {team.short_name && (
          <Text style={styles.teamShortName}>{team.short_name}</Text>
        )}

        {team.description && (
          <Text style={styles.description}>{team.description}</Text>
        )}
      </View>

      {/* Team Info */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Team Information</Text>

        {team.home_ground && (
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={20} color={colors.primary[600]} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Home Ground</Text>
              <Text style={styles.infoValue}>{team.home_ground}</Text>
            </View>
          </View>
        )}

        {team.founded_year && (
          <View style={styles.infoRow}>
            <Feather name="calendar" size={20} color={colors.primary[600]} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Founded</Text>
              <Text style={styles.infoValue}>{team.founded_year}</Text>
            </View>
          </View>
        )}

        <View style={styles.infoRow}>
          <Feather name="users" size={20} color={colors.primary[600]} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Members</Text>
            <Text style={styles.infoValue}>
              {team.team_members?.length || 0} players
            </Text>
          </View>
        </View>
      </View>

      {/* Team Members */}
      {team.team_members && team.team_members.length > 0 && (
        <View style={styles.membersCard}>
          <Text style={styles.sectionTitle}>Team Members</Text>

          {team.team_members.map((member: any, index: number) => (
            <View key={member.id} style={styles.memberRow}>
              <View style={styles.memberAvatar}>
                <Text style={styles.memberInitial}>
                  {member.profiles?.full_name?.[0] || '?'}
                </Text>
              </View>

              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>
                  {member.profiles?.full_name || 'Unknown'}
                </Text>
                <Text style={styles.memberRole}>{member.role}</Text>
              </View>

              {member.jersey_number && (
                <View style={styles.jerseyBadge}>
                  <Text style={styles.jerseyNumber}>#{member.jersey_number}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Action Button */}
      <View style={styles.actionContainer}>
        {isMember ? (
          <TouchableOpacity
            style={styles.leaveButton}
            onPress={handleLeaveTeam}
            disabled={joining}
          >
            <Feather name="log-out" size={20} color={colors.danger[600]} />
            <Text style={styles.leaveButtonText}>Leave Team</Text>
          </TouchableOpacity>
        ) : (
          <PrimaryButton
            label="Join Team"
            onPress={handleJoinTeam}
            loading={joining}
            disabled={joining}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.secondary[500],
  },
  headerCard: {
    backgroundColor: colors.neutral.white,
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  teamIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamInitial: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary[600],
  },
  teamName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.secondary[900],
    marginBottom: 4,
  },
  teamShortName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary[600],
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.secondary[600],
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: colors.neutral.white,
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.secondary[900],
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.secondary[500],
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.secondary[900],
  },
  membersCard: {
    backgroundColor: colors.neutral.white,
    padding: 20,
    marginTop: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary[700],
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.secondary[900],
  },
  memberRole: {
    fontSize: 12,
    color: colors.secondary[500],
    textTransform: 'capitalize',
  },
  jerseyBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  jerseyNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[600],
  },
  actionContainer: {
    padding: 20,
    marginTop: 12,
    marginBottom: 32,
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger[50],
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.danger[200],
  },
  leaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger[600],
    marginLeft: 8,
  },
});
