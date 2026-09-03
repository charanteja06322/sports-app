import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import apiService from '../../services/api.service';

const PAGE_SIZE = 40;

export default function TeamsBrowseScreen({ navigation }: any) {
  const [teams, setTeams] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTeams(0);
  }, []);

  const loadTeams = async (pageNum: number) => {
    if (pageNum === 0) setLoading(true);

    try {
      const res = await apiService.getTeams({
        skip: pageNum * PAGE_SIZE,
        limit: PAGE_SIZE,
        search: searchQuery.trim(),
      });

      if (res?.success) {
        const fetchedTeams = res.teams || [];
        if (pageNum === 0) {
          setTeams(fetchedTeams);
        } else {
          setTeams((prev) => [...prev, ...fetchedTeams]);
        }
        setPage(pageNum);
        setHasMore(fetchedTeams.length === PAGE_SIZE);
        setError(null);
      }
    } catch (err: any) {
      console.error('Error loading teams:', err);
      setError(err.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTeams(0);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadTeams(page + 1);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);
    loadTeams(0);
  };

  const handleTeamPress = (teamId: string) => {
    navigation.navigate('TeamDetail', { teamId });
  };

  const handleJoinTeam = (teamId: string) => {
    Alert.alert('Join Team', 'Team joining is coming soon.');
  };

  const renderTeamCard = ({ item: team }: { item: any }) => (
    <TouchableOpacity
      style={styles.teamCard}
      onPress={() => handleTeamPress(team.id)}
      activeOpacity={0.7}
    >
      <View style={styles.teamHeader}>
        <View style={styles.teamBadge}>
          <Text style={styles.teamInitial}>{team.short_name?.substring(0, 2) || 'T'}</Text>
        </View>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Text style={styles.teamCity}>{team.city || 'City TBA'}</Text>
        </View>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => handleJoinTeam(team.id)}
        >
          <Feather name="plus" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.teamStats}>
        <View style={styles.statItem}>
          <Feather name="users" size={16} color={colors.textSecondary} />
          <Text style={styles.statLabel}>{team.player_count || 0} Players</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="cricket" size={16} color={colors.textSecondary} />
          <Text style={styles.statLabel}>{team.match_count || 0} Matches</Text>
        </View>
        <View style={styles.statItem}>
          <Feather name="award" size={16} color={colors.textSecondary} />
          <Text style={styles.statLabel}>{team.wins || 0} Wins</Text>
        </View>
      </View>

      {team.description && (
        <Text style={styles.teamDescription} numberOfLines={2}>
          {team.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="account-group" size={48} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No teams found' : 'No teams available'}
      </Text>
      <Text style={styles.emptyCopy}>
        {searchQuery
          ? 'Try a different search'
          : 'Browse and discover teams to join'}
      </Text>
      {searchQuery && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => handleSearch('')}
        >
          <Text style={styles.clearButtonText}>Clear Search</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!loading || page === 0) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  if (loading && page === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading teams...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Teams</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateTeam')}
        >
          <Feather name="plus" size={20} color={colors.background} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color={colors.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search teams..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Feather name="x" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Feather name="alert-circle" size={16} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={teams}
        renderItem={renderTeamCard}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      />
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
    paddingHorizontal: 4,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe5e5',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: '#c92a2a',
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  teamCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamBadge: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  teamInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.background,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  teamCity: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  joinButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}10`,
  },
  teamStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  teamDescription: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 6,
  },
  emptyCopy: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginTop: 10,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
