import React, { useMemo, useState } from 'react';
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

const LIVE_MATCHES = [
  {
    id: 'live-1',
    badge: 'LIVE',
    overs: '32.3 Ov',
    home: 'Falcons CC',
    away: 'Warriors XI',
    homeShort: 'FC',
    awayShort: 'WX',
    homeScore: '186/7',
    awayScore: '152/4',
    status: 'Falcons CC elected to bat',
  },
  {
    id: 'live-2',
    badge: 'LIVE',
    overs: '18.2 Ov',
    home: 'Titans XI',
    away: 'Kings CC',
    homeShort: 'TX',
    awayShort: 'KC',
    homeScore: '124/3',
    awayScore: '-/-',
    status: 'Kings CC yet to bat',
  },
];

const FEED_POSTS = [
  {
    id: 'post-1',
    author: 'Arjun Reddy',
    handle: '@arjunreddy07',
    team: 'Falcons CC',
    time: '2h',
    category: 'Cricket',
    body: 'Match day! Nothing feels better than doing what you love.',
    accent: '#60E986',
    stats: { likes: 128, comments: 24 },
  },
  {
    id: 'post-2',
    author: 'Sneha Iyer',
    handle: '@snehaiver11',
    team: 'Bengaluru, India',
    time: '4h',
    category: 'Football',
    body: 'Training hard today for a stronger tomorrow. One step at a time.',
    accent: '#5DA6FF',
    stats: { likes: 96, comments: 18 },
  },
];

const FOR_YOU_BLOCKS = [
  {
    id: 'player',
    title: 'Player to Watch',
    name: 'Shubman Gill',
    subtitle: 'Top Order Batter • Team India',
    detail: 'In exceptional form this season.',
    stats: ['12 Matches', '842 Runs', '70.16 Avg', '94.3 SR'],
    action: 'View Profile',
  },
  {
    id: 'performance',
    title: 'Recent Performance',
    name: '112 (98)',
    subtitle: 'vs Australia • ODI Series • 2d ago',
    detail: 'Team India won by 36 runs',
    stats: ['Player of the Match'],
    action: 'View all',
  },
  {
    id: 'team',
    title: 'Recommended Team',
    name: 'Sunrisers Hyderabad',
    subtitle: 'T20 Franchise',
    detail: 'Strong squad for this season.',
    stats: ['28K Followers'],
    action: 'Follow',
  },
];

const TOP_TABS = ['FEED', 'FOR YOU'] as const;

export default function HomeScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<(typeof TOP_TABS)[number]>('FEED');
  const [location] = useState('Hyderabad');
  const [query, setQuery] = useState('');
  const [followedTeam, setFollowedTeam] = useState(false);

  const filteredPosts = useMemo(
    () =>
      FEED_POSTS.filter((post) => {
        if (!query.trim()) {
          return true;
        }

        const normalizedQuery = query.toLowerCase();
        return (
          post.author.toLowerCase().includes(normalizedQuery) ||
          post.category.toLowerCase().includes(normalizedQuery) ||
          post.body.toLowerCase().includes(normalizedQuery)
        );
      }),
    [query]
  );

  const showAction = (title: string, message: string) => {
    Alert.alert(title, message);
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
            onPress={() => showAction('Location', 'Location switcher will be connected next.')}
          >
            <Feather name="map-pin" size={15} color={colors.primary} />
            <Text style={styles.locationText}>{location}</Text>
            <Feather name="chevron-down" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => showAction('Notifications', 'Notifications panel is not connected yet.')}
          >
            <Feather name="bell" size={20} color={colors.textPrimary} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => showAction('Messages', 'Chat inbox is not connected yet.')}
          >
            <Feather name="message-circle" size={20} color={colors.textPrimary} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.profileInitial}>RK</Text>
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
            placeholder="Search players, teams, matches..."
            placeholderTextColor={colors.textMuted}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => showAction('Filters', 'Advanced search filters are coming soon.')}
        >
          <Feather name="sliders" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Live Now</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Matches')}>
            <Text style={styles.linkText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.liveRail}>
          {LIVE_MATCHES.map((match) => (
            <TouchableOpacity
              key={match.id}
              style={styles.liveCard}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Matches')}
            >
              <View style={styles.liveMeta}>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>{match.badge}</Text>
                </View>
                <Text style={styles.liveOvers}>{match.overs}</Text>
              </View>

              <View style={styles.scoreRow}>
                <View style={styles.teamBlock}>
                  <View style={styles.teamBadge}>
                    <Text style={styles.teamBadgeText}>{match.homeShort}</Text>
                  </View>
                  <View>
                    <Text style={styles.teamName}>{match.home}</Text>
                    <Text style={styles.teamScore}>{match.homeScore}</Text>
                  </View>
                </View>

                <Text style={styles.vsLabel}>vs</Text>

                <View style={styles.teamBlock}>
                  <View style={styles.teamBadge}>
                    <Text style={styles.teamBadgeText}>{match.awayShort}</Text>
                  </View>
                  <View>
                    <Text style={styles.teamName}>{match.away}</Text>
                    <Text style={styles.teamScore}>{match.awayScore}</Text>
                  </View>
                </View>

                <Feather name="chevron-right" size={20} color={colors.textSecondary} />
              </View>

              <Text style={styles.liveStatus}>{match.status}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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

        {activeTab === 'FEED' ? (
          <View style={styles.feedList}>
            {filteredPosts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={[styles.postAvatar, { borderColor: post.accent }]}>
                    <Text style={styles.postAvatarText}>
                      {post.author
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)}
                    </Text>
                  </View>
                  <View style={styles.postAuthorBlock}>
                    <View style={styles.postAuthorRow}>
                      <Text style={styles.postAuthor}>{post.author}</Text>
                      <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                    </View>
                    <Text style={styles.postMeta}>
                      {post.handle} • {post.category}
                    </Text>
                    <Text style={styles.postMetaSecondary}>
                      <Feather name="map-pin" size={11} color={colors.textSecondary} /> {post.team} • {post.time}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => showAction('Post Menu', `More actions for ${post.author} coming soon.`)}
                  >
                    <Feather name="more-vertical" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={[styles.heroCard, { borderColor: `${post.accent}55` }]}>
                  <View style={[styles.heroArtwork, { backgroundColor: `${post.accent}12` }]}>
                    <MaterialCommunityIcons
                      name={post.id === 'post-1' ? 'cricket' : 'soccer'}
                      size={44}
                      color={post.accent}
                    />
                  </View>
                  <View style={styles.heroCopy}>
                    <Text style={styles.postBody}>{post.body}</Text>
                    <Text style={styles.heroSubText}>Built from the startup design feed layout.</Text>
                  </View>
                </View>

                <View style={styles.postActions}>
                  <TouchableOpacity
                    style={styles.postAction}
                    onPress={() => showAction('Liked', `You liked ${post.author}'s post.`)}
                  >
                    <Feather name="heart" size={18} color={colors.textPrimary} />
                    <Text style={styles.postActionText}>{post.stats.likes}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.postAction}
                    onPress={() => showAction('Comments', 'Comments are not connected yet.')}
                  >
                    <Feather name="message-circle" size={18} color={colors.textPrimary} />
                    <Text style={styles.postActionText}>{post.stats.comments}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.postAction}
                    onPress={() => showAction('Share', 'Native share is not connected yet.')}
                  >
                    <Feather name="share" size={18} color={colors.textPrimary} />
                    <Text style={styles.postActionText}>Share</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.postAction}
                    onPress={() => showAction('Saved', 'Post saved to your collection.')}
                  >
                    <Feather name="bookmark" size={18} color={colors.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {!filteredPosts.length && (
              <View style={styles.emptyState}>
                <Feather name="search" size={30} color={colors.textSecondary} />
                <Text style={styles.emptyTitle}>No feed items match your search</Text>
                <Text style={styles.emptyCopy}>Try a player name, team, or sport keyword.</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.discoveryList}>
            <View style={styles.discoveryHeader}>
              <View>
                <Text style={styles.discoveryTitle}>For You • Cricket</Text>
                <Text style={styles.discoverySubtitle}>Personalized content based on the startup design.</Text>
              </View>
              <TouchableOpacity
                style={styles.customizeButton}
                onPress={() => showAction('Customize', 'Personalization controls are coming soon.')}
              >
                <Feather name="sliders" size={15} color={colors.primary} />
                <Text style={styles.customizeText}>Customize</Text>
              </TouchableOpacity>
            </View>

            {FOR_YOU_BLOCKS.map((block) => (
              <View key={block.id} style={styles.discoveryCard}>
                <Text style={styles.discoveryCardTitle}>{block.title}</Text>
                <Text style={styles.discoveryName}>{block.name}</Text>
                <Text style={styles.discoveryMeta}>{block.subtitle}</Text>
                <Text style={styles.discoveryDetail}>{block.detail}</Text>
                <View style={styles.discoveryStatsRow}>
                  {block.stats.map((stat) => (
                    <Text key={stat} style={styles.discoveryStat}>
                      {stat}
                    </Text>
                  ))}
                </View>
                <TouchableOpacity
                  style={[
                    styles.discoveryAction,
                    block.action === 'Follow' && followedTeam && styles.discoveryActionActive,
                  ]}
                  onPress={() => {
                    if (block.action === 'View Profile') {
                      navigation.navigate('Profile');
                      return;
                    }

                    if (block.action === 'Follow') {
                      setFollowedTeam((current) => !current);
                      return;
                    }

                    showAction(block.action, `${block.title} details are not connected yet.`);
                  }}
                >
                  <Text
                    style={[
                      styles.discoveryActionText,
                      block.action === 'Follow' && followedTeam && styles.discoveryActionTextActive,
                    ]}
                  >
                    {block.action === 'Follow' && followedTeam ? 'Following' : block.action}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
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
    backgroundColor: 'rgba(0, 255, 0, 0.06)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
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
    color: '#041008',
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
    backgroundColor: colors.backgroundCard,
  },
  profileInitial: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
  linkText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  liveRail: {
    paddingLeft: 16,
    paddingRight: 6,
  },
  liveCard: {
    width: 360,
    marginRight: 12,
    borderRadius: 22,
    padding: 18,
    backgroundColor: '#0A121A',
    borderWidth: 1,
    borderColor: 'rgba(117, 255, 159, 0.12)',
  },
  liveMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  liveBadge: {
    backgroundColor: 'rgba(0, 255, 0, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 10,
  },
  liveBadgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  liveOvers: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teamBadge: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamBadgeText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  teamName: {
    color: colors.textPrimary,
    fontSize: 15,
    marginBottom: 4,
  },
  teamScore: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  vsLabel: {
    color: colors.textMuted,
    fontSize: 16,
    marginHorizontal: 12,
  },
  liveStatus: {
    color: colors.primary,
    fontSize: 14,
    textAlign: 'center',
  },
  tabsBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: 18,
  },
  topTab: {
    marginRight: 24,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  topTabActive: {
    borderBottomColor: colors.primary,
  },
  topTabText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  topTabTextActive: {
    color: colors.primary,
  },
  feedList: {
    padding: 16,
    gap: 14,
  },
  postCard: {
    backgroundColor: '#091119',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  postAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  postAvatarText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  postAuthorBlock: {
    flex: 1,
  },
  postAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  postAuthor: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  postMeta: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 2,
  },
  postMetaSecondary: {
    color: colors.textMuted,
    fontSize: 12,
  },
  heroCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 14,
  },
  heroArtwork: {
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: {
    padding: 16,
  },
  postBody: {
    color: colors.textPrimary,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600',
    marginBottom: 8,
  },
  heroSubText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postActionText: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  discoveryList: {
    padding: 16,
    gap: 14,
  },
  discoveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  discoveryTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  discoverySubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    maxWidth: 230,
  },
  customizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(117, 255, 159, 0.18)',
    backgroundColor: 'rgba(0, 255, 0, 0.06)',
  },
  customizeText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  discoveryCard: {
    backgroundColor: '#091119',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(117, 255, 159, 0.08)',
  },
  discoveryCardTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  discoveryName: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  discoveryMeta: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 6,
  },
  discoveryDetail: {
    color: colors.textPrimary,
    fontSize: 15,
    marginBottom: 12,
  },
  discoveryStatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  discoveryStat: {
    color: colors.textPrimary,
    fontSize: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  discoveryAction: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  discoveryActionActive: {
    backgroundColor: 'rgba(0, 255, 0, 0.14)',
  },
  discoveryActionText: {
    color: '#07100A',
    fontSize: 14,
    fontWeight: '700',
  },
  discoveryActionTextActive: {
    color: colors.primary,
  },
  emptyState: {
    backgroundColor: '#091119',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
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
  emptyCopy: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
