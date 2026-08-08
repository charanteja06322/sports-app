/**
 * Teams List Screen
 * Display all teams with search and filter
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { colors } from '../../theme';
import { teamsService, Team } from '../../services/teams.service';

export function TeamsListScreen() {
  const navigation = useNavigation();
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    filterTeams();
  }, [searchQuery, teams]);

  const loadTeams = async () => {
    try {
      const data = await teamsService.getAllTeams();
      setTeams(data);
      setFilteredTeams(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterTeams = () => {
    if (!searchQuery.trim()) {
      setFilteredTeams(teams);
      return;
    }

    const filtered = teams.filter(
      (team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.short_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTeams(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadTeams();
  };

  const renderTeamCard = ({ item }: { item: Team }) => (
    <TouchableOpacity
      style={styles.teamCard}
      onPress={() => navigation.navigate('TeamDetail', { teamId: item.id })}
    >
      <View style={styles.teamIcon}>
        {item.logo_url ? (
          <Text style={styles.teamLogo}>🏏</Text>
        ) : (
          <Text style={styles.teamInitial}>
            {item.short_name?.[0] || item.name[0]}
          </Text>
        )}
      </View>

      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{item.name}</Text>
        {item.short_name && (
          <Text style={styles.teamShortName}>{item.short_name}</Text>
        )}
        {item.home_ground && (
          <View style={styles.groundContainer}>
            <Feather name="map-pin" size={12} color={colors.secondary[400]} />
            <Text style={styles.groundText}>{item.home_ground}</Text>
          </View>
        )}
      </View>

      <Feather name="chevron-right" size={24} color={colors.secondary[400]} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>Loading teams...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color={colors.secondary[400]}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search teams..."
          placeholderTextColor={colors.secondary[400]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Teams</Text>
        <Text style={styles.headerCount}>{filteredTeams.length} teams</Text>
      </View>

      {/* Teams List */}
      <FlatList
        data={filteredTeams}
        renderItem={renderTeamCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary[500]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏏</Text>
            <Text style={styles.emptyTitle}>No teams found</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Try a different search term'
                : 'Be the first to create a team!'}
            </Text>
          </View>
        }
      />

      {/* Create Team FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateTeam')}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.secondary[500],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.secondary[900],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.secondary[900],
  },
  headerCount: {
    fontSize: 14,
    color: colors.secondary[500],
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  teamIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  teamLogo: {
    fontSize: 24,
  },
  teamInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary[600],
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.secondary[900],
    marginBottom: 4,
  },
  teamShortName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary[600],
    marginBottom: 4,
  },
  groundContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  groundText: {
    fontSize: 12,
    color: colors.secondary[500],
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.secondary[900],
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.secondary[500],
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
