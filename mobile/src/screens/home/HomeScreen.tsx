import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api.service';

const TOP_TABS = ['FEED', 'FOR YOU'] as const;
const PAGE_SIZE = 40;

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<(typeof TOP_TABS)[number]>('FEED');
  const [location, setLocation] = useState('All Locations');
  const [query, setQuery] = useState('');
  
  // FEED tab state
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [feedPage, setFeedPage] = useState(0);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedHasMore, setFeedHasMore] = useState(true);
  
  // FOR YOU tab state
  const [forYouPosts, setForYouPosts] = useState<any[]>([]);
  const [forYouPage, setForYouPage] = useState(0);
  const [forYouLoading, setForYouLoading] = useState(false);
  const [forYouHasMore, setForYouHasMore] = useState(true);
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    loadFeedPage(0);
    loadForYouPage(0);
  }, [user]);

  const loadFeedPage = async (page: number) => {
    if (page === 0) setFeedLoading(true);
    
    try {
      const res = await apiService.getMatches({ skip: page * PAGE_SIZE, limit: PAGE_SIZE });
      
      if (res?.success) {
        const matches = res.matches || [];
        const formatted = matches.map((match: any) => ({
          id: match.id,
          type: 'match',
          title: `${match.team1?.name || 'Team A'} vs ${match.team2?.name || 'Team B'}`,
          subtitle: match.match_type || 'Cricket',
          status: match.status,
          date: match.match_date,
          data: match,
        }));
        
        if (page === 0) {
          setFeedPosts(formatted);
        } else {
          setFeedPosts(prev => [...prev, ...formatted]);
        }
        
        setFeedPage(page);
        setFeedHasMore(matches.length === PAGE_SIZE);
      }
    } catch (err: any) {
      console.error('Error loading feed:', err);
      setError(err.message || 'Failed to load feed');
    } finally {
      if (page === 0) setFeedLoading(false);
    }
  };

  const loadForYouPage = async (page: number) => {
    if (page === 0) setForYouLoading(true);
    
    try {
      const res = await apiService.getMatches({ skip: page * PAGE_SIZE, limit: PAGE_SIZE });
      
      if (res?.success) {
        const matches = res.matches || [];
        // TODO: Filter by user's favorite sports
        const formatted = matches.map((match: any) => ({
          id: match.id,
          type: 'match',
          title: `${match.team1?.name || 'Team A'} vs ${match.team2?.name || 'Team B'}`,
          subtitle: match.match_type || 'Cricket',
          status: match.status,
          date: match.match_date,
          data: match,
        }));
        
        if (page === 0) {
          setForYouPosts(formatted);
        } else {
          setForYouPosts(prev => [...prev, ...formatted]);
        }
        
        setForYouPage(page);
        setForYouHasMore(matches.length === PAGE_SIZE);
      }
    } catch (err: any) {
      console.error('Error loading for you:', err);
    } finally {
      if (page === 0) setForYouLoading(false);
    }
  };

  useEffect(() => {
    setInitialLoading(false);
  }, [feedPosts, forYouPosts]);

  const handleFeedLoadMore = () => {
    if (!feedLoading && feedHasMore) {
      loadFeedPage(feedPage + 1);
    }
  };

  const handleForYouLoadMore = () => {
    if (!forYouLoading && forYouHasMore) {
      loadForYouPage(forYouPage + 1);
    }
  };

  const filteredPosts = useMemo(() => {
    const posts = activeTab === 'FEED' ? feedPosts : forYouPosts;
    if (!query.trim()) {
      return posts;
    }

    const normalizedQuery = query.toLowerCase();
    return posts.filter((post) => {
      return (
        post.title?.toLowerCase().includes(normalizedQuery) ||
        post.subtitle?.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query, activeTab, feedPosts, forYouPosts]);

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading content...</Text>
        </View>
      </View>
    );
  }

  const renderMatchCard = ({ item: post }: { item: any }) => (
    <TouchableOpacity
      style={styles.matchCard}
      onPress={() => {
        if (post.type === 'match' && post.data?.id) {
          navigation.navigate('MatchDetail', { matchId: post.data.id });
        }
      }}
      activeOpacity={0.7}
    >
      <View style={styles.matchHeader}>
        <View>
          <Text style={styles.matchTitle}>{post.title}</Text>
          <Text style={styles.matchSubtitle}>{post.subtitle}</Text>
          <Text style={styles.matchDate}>
            <Feather name="clock" size={12} color={colors.textSecondary} /> {post.status}
          </Text>
        </View>
        <View style={styles.matchBadge}>
          <Text style={styles.matchBadgeText}>{post.status === 'live' ? 'LIVE' : 'SCHEDULED'}</Text>
        </View>
      </View>

      <View style={styles.matchContent}>
        <View style={[styles.statusIndicator, { backgroundColor: post.status === 'live' ? '#ff6b6b' : colors.primary }]} />
        <Text style={styles.matchContentText}>{post.subtitle} Match</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="cricket" size={40} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No matches found</Text>
      <Text style={styles.emptyCopy}>Check back soon for upcoming matches</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => {
          navigation.popToTop();
          navigation.navigate('MainTabs', { screen: 'Create' });
        }}
      >
        <Feather name="plus" size={18} color={colors.background} />
        <Text style={styles.createButtonText}>Create Match</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = (isLoading: boolean) => {
    if (!isLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>P</Text>
          </View>
          <Text style={styles.brandName}>PLAYFIELD</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.locationChip}
            onPress={() => Alert.alert('Location Switcher', 'Location switcher will be connected next.')}
          >
            <Feather name="map-pin" size={15} color={colors.primary} />
            <Text style={styles.locationText}>{location}</Text>
            <Feather name="chevron-down" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => Alert.alert('Notifications', 'Notifications panel is not connected yet.')}
          >
            <Feather name="bell" size={20} color={colors.textPrimary} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => Alert.alert('Messages', 'Chat inbox is not connected yet.')}
          >
            <Feather name="message-circle" size={20} color={colors.textPrimary} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.profileInitial}>{user?.user_metadata?.full_name?.substring(0, 2) || 'U'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color={colors.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            placeholder="Search matches, teams..."
            placeholderTextColor={colors.textMuted}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => Alert.alert('Filters', 'Advanced search filters are coming soon.')}
        >
          <Feather name="sliders" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsBar}>
        {TOP_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.topTab, activeTab === tab && styles.topTabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.topTabText, activeTab === tab && styles.topTabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Feather name="alert-circle" size={16} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {activeTab === 'FEED' ? (
        <FlatList
          data={filteredPosts}
          renderItem={renderMatchCard}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={() => renderFooter(feedLoading)}
          onEndReached={handleFeedLoadMore}
          onEndReachedThreshold={0.3}
          contentContainerStyle={styles.flatListContent}
          scrollEnabled={false}
        />
      ) : (
        <FlatList
          data={filteredPosts}
          renderItem={renderMatchCard}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="heart" size={40} color={colors.textSecondary} />
              <Text style={styles.emptyTitle}>No personalized content yet</Text>
              <Text style={styles.emptyCopy}>Update your sport preferences to get personalized matches</Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => {
                  navigation.popToTop();
                  navigation.navigate('MainTabs', { screen: 'Create' });
                }}
              >
                <Feather name="plus" size={18} color={colors.background} />
                <Text style={styles.createButtonText}>Create Match</Text>
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={() => renderFooter(forYouLoading)}
          onEndReached={handleForYouLoadMore}
          onEndReachedThreshold={0.3}
          contentContainerStyle={styles.flatListContent}
          scrollEnabled={false}
        />
      )}
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
    paddingHorizontal: 16,
    paddingTop: 14,
    backgroundColor: colors.background,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: `${colors.primary}10`,
  },
  logoText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  brandName: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 10,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.backgroundCard,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: '700',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  profileInitial: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: colors.background,
  },
  searchBox: {
    flex: 1,
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
  filterButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe5e5',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: '#c92a2a',
    fontSize: 12,
    fontWeight: '500',
  },
  tabsBar: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
  },
  topTab: {
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  topTabActive: {
    borderBottomColor: colors.primary,
  },
  topTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  topTabTextActive: {
    color: colors.primary,
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  matchCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  matchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  matchSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  matchDate: {
    fontSize: 11,
    color: colors.textMuted,
  },
  matchBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: `${colors.primary}20`,
    borderRadius: 6,
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  matchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  matchContentText: {
    fontSize: 12,
    color: colors.textSecondary,
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
