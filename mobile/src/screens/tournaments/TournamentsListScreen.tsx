/**
 * Tournaments List Screen
 * Display all tournaments with filters
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { colors } from '../../theme';
import { tournamentsService, Tournament } from '../../services/tournaments.service';

type FilterType = 'all' | 'upcoming' | 'ongoing' | 'completed';

export function TournamentsListScreen() {
  const navigation = useNavigation();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadTournaments();
  }, [filter]);

  const loadTournaments = async () => {
    try {
      let data: Tournament[];
      
      switch (filter) {
        case 'upcoming':
          data = await tournamentsService.getUpcomingTournaments();
          break;
        case 'ongoing':
          data = await tournamentsService.getOngoingTournaments();
          break;
        case 'completed':
          data = await tournamentsService.getCompletedTournaments();
          break;
        default:
          data = await tournamentsService.getAllTournaments();
      }
      
      setTournaments(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadTournaments();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return colors.info;
      case 'ongoing':
        return colors.success;
      case 'completed':
        return colors.neutral.textDark;
      default:
        return colors.neutral.textLight;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '📅';
      case 'ongoing':
        return '🔴';
      case 'completed':
        return '✅';
      default:
        return '📋';
    }
  };

  const renderTournamentCard = ({ item }: { item: Tournament }) => (
    <TouchableOpacity
      style={styles.tournamentCard}
      onPress={() => navigation.navigate('TournamentDetail', { tournamentId: item.id })}
    >
      <View style={styles.tournamentHeader}>
        <View style={styles.tournamentIcon}>
          <Text style={styles.tournamentEmoji}>🏆</Text>
        </View>
        
        <View style={styles.tournamentInfo}>
          <Text style={styles.tournamentName}>{item.name}</Text>
          <Text style={styles.tournamentType}>{item.tournament_type}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      {item.description && (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      <View style={styles.tournamentDetails}>
        {item.start_date && (
          <View style={styles.detailItem}>
            <Feather name="calendar" size={14} color={colors.neutral.textLight} />
            <Text style={styles.detailText}>
              {new Date(item.start_date).toLocaleDateString()}
            </Text>
          </View>
        )}
        
        {item.prize_pool && (
          <View style={styles.detailItem}>
            <Feather name="dollar-sign" size={14} color={colors.primary[500]} />
            <Text style={styles.prizeText}>
              ${item.prize_pool.toLocaleString()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (filterType: FilterType, label: string) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === filterType && styles.filterButtonActive]}
      onPress={() => setFilter(filterType)}
    >
      <Text style={[styles.filterText, filter === filterType && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>Loading tournaments...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('upcoming', 'Upcoming')}
        {renderFilterButton('ongoing', 'Live')}
        {renderFilterButton('completed', 'Completed')}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tournaments</Text>
        <Text style={styles.headerCount}>{tournaments.length} found</Text>
      </View>

      {/* Tournaments List */}
      <FlatList
        data={tournaments}
        renderItem={renderTournamentCard}
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
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={styles.emptyTitle}>No tournaments found</Text>
            <Text style={styles.emptyText}>
              {filter !== 'all'
                ? `No ${filter} tournaments at the moment`
                : 'Be the first to create a tournament!'}
            </Text>
          </View>
        }
      />

      {/* Create Tournament FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateTournament')}
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
    color: colors.neutral.textLight,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.neutral.surface,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral.text,
  },
  filterTextActive: {
    color: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.neutral.text,
  },
  headerCount: {
    fontSize: 14,
    color: colors.neutral.textLight,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  tournamentCard: {
    backgroundColor: colors.neutral.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  tournamentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tournamentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tournamentEmoji: {
    fontSize: 24,
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral.text,
    marginBottom: 4,
  },
  tournamentType: {
    fontSize: 12,
    color: colors.neutral.textLight,
    textTransform: 'capitalize',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusIcon: {
    fontSize: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: colors.neutral.textLight,
    marginBottom: 12,
    lineHeight: 20,
  },
  tournamentDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: colors.neutral.textLight,
  },
  prizeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary[500],
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
    color: colors.neutral.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.neutral.textLight,
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
