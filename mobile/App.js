import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Primary Theme Colors matching user designs
const COLORS = {
  bg: "#091117",
  card: "#121D26",
  cardBorder: "#1B2B38",
  cardActive: "#162532",
  primary: "#00E676", // Vibrant neon sports green
  primaryLight: "rgba(0, 230, 118, 0.12)",
  text: "#FFFFFF",
  textMuted: "#8599A6",
  textSub: "#A0B2C0",
  danger: "#EF4444",
  orange: "#FF9800",
  blue: "#2196F3",
  teal: "#00B4D8",
};

export default function App() {
  // Navigation: "home" | "matches" | "discover" | "profile"
  const [currentTab, setCurrentTab] = useState("home");

  // Create Modal ("Build, organize, and play.")
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Home Screen Sub-tab: "feed" | "for_you"
  const [homeSubTab, setHomeSubTab] = useState("feed");

  // Matches Screen Sub-tab: "live" | "upcoming" | "following" | "completed" | "my_matches"
  const [matchesSubTab, setMatchesSubTab] = useState("live");

  // Profile Screen Sub-tab: "overview" | "stats" | "matches" | "posts"
  const [profileSubTab, setProfileSubTab] = useState("overview");
  const [profileMatchesFilter, setProfileMatchesFilter] = useState("all");
  const [profilePostsFilter, setProfilePostsFilter] = useState("all");

  // Search in Discover
  const [searchQuery, setSearchQuery] = useState("");
  const [followingMatches, setFollowingMatches] = useState(["m1", "m3"]);

  const toggleFollowMatch = (id) => {
    setFollowingMatches((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  // --- RENDER HEADER ---
  const renderTopHeader = (title = "EZKORA", showLocation = true) => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>E</Text>
        </View>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      {showLocation && (
        <TouchableOpacity style={styles.locationPill}>
          <Ionicons name="location-sharp" size={13} color={COLORS.primary} />
          <Text style={styles.locationText}>Hyderabad</Text>
          <Ionicons name="chevron-down" size={13} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}

      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeCountText}>3</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={COLORS.text} />
          <View style={[styles.notificationBadge, { backgroundColor: "#00E676" }]}>
            <Text style={styles.badgeCountText}>2</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentTab("profile")}
          style={styles.avatarMini}
        >
          <Text style={styles.avatarMiniText}>RK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- 1. HOME SCREEN ---
  const renderHomeScreen = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Live Now Card Banner */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Live Now</Text>
        <TouchableOpacity onPress={() => { setCurrentTab("matches"); setMatchesSubTab("live"); }}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => { setCurrentTab("matches"); setMatchesSubTab("live"); }}
        style={styles.liveBannerCard}
      >
        <View style={styles.liveCardTop}>
          <View style={styles.liveTag}>
            <Text style={styles.liveTagText}>LIVE</Text>
          </View>
          <Text style={styles.overCountText}>32.3 Ov</Text>
        </View>

        <View style={styles.teamsScoreRow}>
          <View style={styles.teamScoreCol}>
            <View style={styles.teamBadgeCircle}>
              <Text style={styles.teamBadgeText}>FC</Text>
            </View>
            <Text style={styles.teamNameText}>Falcons CC</Text>
            <Text style={styles.scoreText}>186/7</Text>
          </View>

          <Text style={styles.vsText}>VS</Text>

          <View style={styles.teamScoreCol}>
            <View style={[styles.teamBadgeCircle, { backgroundColor: "#182C38" }]}>
              <Text style={[styles.teamBadgeText, { color: COLORS.primary }]}>WX</Text>
            </View>
            <Text style={styles.teamNameText}>Warriors XI</Text>
            <Text style={styles.scoreText}>152/4</Text>
          </View>
        </View>

        <Text style={styles.tossInfoText}>Falcons CC elected to bat</Text>
      </TouchableOpacity>

      {/* FEED / FOR YOU TABS */}
      <View style={styles.subTabBar}>
        <TouchableOpacity
          onPress={() => setHomeSubTab("feed")}
          style={[styles.subTabItem, homeSubTab === "feed" && styles.subTabItemActive]}
        >
          <Text style={[styles.subTabText, homeSubTab === "feed" && styles.subTabTextActive]}>
            FEED
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setHomeSubTab("for_you")}
          style={[styles.subTabItem, homeSubTab === "for_you" && styles.subTabItemActive]}
        >
          <Text style={[styles.subTabText, homeSubTab === "for_you" && styles.subTabTextActive]}>
            FOR YOU
          </Text>
        </TouchableOpacity>
      </View>

      {/* POST CARD 1 */}
      <View style={styles.postCard}>
        <View style={styles.postAuthorRow}>
          <View style={styles.postAvatarCircle}>
            <Text style={styles.postAvatarText}>AR</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Text style={styles.postAuthorName}>Arjun Reddy</Text>
              <Ionicons name="checkmark-circle" size={14} color={COLORS.primary} />
            </View>
            <Text style={styles.postAuthorMeta}>@arjunreddy07 • Cricket</Text>
            <Text style={styles.postVenueMeta}>📍 Falcons CC • 2h</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Media Graphic */}
        <View style={styles.postMediaBox}>
          <MaterialCommunityIcons name="cricket" size={48} color={COLORS.primary} />
        </View>

        <Text style={styles.postCaptionText}>
          Match day! Nothing feels better than doing what you love.
        </Text>

        {/* Action Counters */}
        <View style={styles.postActionsRow}>
          <View style={styles.postActionGroup}>
            <Ionicons name="heart" size={16} color="#FF5252" />
            <Text style={styles.postActionCount}>128</Text>
          </View>
          <View style={styles.postActionGroup}>
            <Ionicons name="chatbubble-outline" size={16} color={COLORS.textMuted} />
            <Text style={styles.postActionCount}>24</Text>
          </View>
          <View style={styles.postActionGroup}>
            <Ionicons name="repeat" size={16} color={COLORS.orange} />
            <Text style={styles.postActionCount}>12</Text>
          </View>
          <View style={styles.postActionGroup}>
            <Ionicons name="pin" size={16} color="#FF5252" />
          </View>
        </View>
      </View>

      {/* POST CARD 2 */}
      <View style={styles.postCard}>
        <View style={styles.postAuthorRow}>
          <View style={styles.postAvatarCircle}>
            <Text style={styles.postAvatarText}>RK</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Text style={styles.postAuthorName}>Rahul Kumar</Text>
              <Ionicons name="checkmark-circle" size={14} color={COLORS.primary} />
            </View>
            <Text style={styles.postAuthorMeta}>@rahulkumar • Cricket</Text>
            <Text style={styles.postVenueMeta}>📍 Rajiv Cricket Ground • 1d</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={styles.postCaptionText}>
          Happy to contribute to the team's win today. 👏 Good team effort all around! 🌟
        </Text>

        {/* Highlight badge box */}
        <View style={styles.highlightBadgeBox}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <Ionicons name="star" size={14} color={COLORS.orange} />
            <Text style={styles.highlightTitle}>Player of the Match</Text>
          </View>
          <Text style={styles.highlightScore}>86* (52) — 7 Fours • 3 Sixes</Text>
          <Text style={styles.highlightDetails}>vs Royal Strikers • Won by 6 wickets • T20 League</Text>
        </View>

        <View style={styles.postActionsRow}>
          <View style={styles.postActionGroup}>
            <Ionicons name="heart" size={16} color="#FF5252" />
            <Text style={styles.postActionCount}>96</Text>
          </View>
          <View style={styles.postActionGroup}>
            <Ionicons name="chatbubble-outline" size={16} color={COLORS.textMuted} />
            <Text style={styles.postActionCount}>18</Text>
          </View>
          <View style={styles.postActionGroup}>
            <Ionicons name="repeat" size={16} color={COLORS.orange} />
            <Text style={styles.postActionCount}>8</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  // --- 2. MATCHES SCREEN ---
  const renderMatchesScreen = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Sub Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScrollContainer}>
        {["live", "upcoming", "following", "completed", "my_matches"].map((tabKey) => {
          const label = tabKey === "my_matches" ? "MY MATCHES" : tabKey.toUpperCase();
          const isActive = matchesSubTab === tabKey;
          return (
            <TouchableOpacity
              key={tabKey}
              onPress={() => setMatchesSubTab(tabKey)}
              style={[styles.matchesSubTabItem, isActive && styles.matchesSubTabItemActive]}
            >
              <Text style={[styles.matchesSubTabText, isActive && styles.matchesSubTabTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* LIVE SUB-TAB */}
      {matchesSubTab === "live" && (
        <View style={{ marginTop: 12 }}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={styles.greenDot} />
              <Text style={styles.sectionTitle}>LIVE MATCHES</Text>
            </View>
            <TouchableOpacity><Text style={styles.seeAllText}>View all</Text></TouchableOpacity>
          </View>

          {/* Match 1 */}
          <View style={styles.matchCard}>
            <View style={styles.matchCardHeader}>
              <View style={styles.liveTag}><Text style={styles.liveTagText}>LIVE</Text></View>
              <Text style={styles.leagueNameText}>KURUKSHETRA LEAGUE • T20</Text>
            </View>

            <View style={styles.matchScoreRow}>
              <View style={styles.teamCol}>
                <View style={styles.teamCircle}><Text style={styles.teamCircleText}>FC</Text></View>
                <Text style={styles.matchTeamTitle}>Falcons CC</Text>
                <Text style={styles.matchScoreBig}>186/7</Text>
                <Text style={styles.matchOverText}>32.3 Ov</Text>
              </View>

              <View style={styles.matchMiddleCol}>
                <Text style={styles.vsSmall}>VS</Text>
                <Text style={styles.tossDecisionText}>Falcons CC{"\n"}elected to bat</Text>
              </View>

              <View style={styles.teamCol}>
                <View style={[styles.teamCircle, { backgroundColor: "#152E2B" }]}>
                  <Text style={[styles.teamCircleText, { color: COLORS.primary }]}>WX</Text>
                </View>
                <Text style={styles.matchTeamTitle}>Warriors XI</Text>
                <Text style={styles.matchScoreBig}>152/4</Text>
                <Text style={styles.matchOverText}>30.1 Ov</Text>
              </View>
            </View>

            <View style={styles.matchFooter}>
              <Text style={styles.venueLocationText}>📍 Rajiv Cricket Ground, Hyderabad</Text>
              <TouchableOpacity
                onPress={() => toggleFollowMatch("m1")}
                style={[
                  styles.followBtn,
                  followingMatches.includes("m1") && styles.followingBtnActive,
                ]}
              >
                <Text style={[styles.followBtnText, followingMatches.includes("m1") && styles.followingBtnTextActive]}>
                  {followingMatches.includes("m1") ? "Following" : "+ Follow"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Match 2 */}
          <View style={styles.matchCard}>
            <View style={styles.matchCardHeader}>
              <View style={styles.liveTag}><Text style={styles.liveTagText}>LIVE</Text></View>
              <Text style={styles.leagueNameText}>CITY PREMIER LEAGUE • T20</Text>
            </View>

            <View style={styles.matchScoreRow}>
              <View style={styles.teamCol}>
                <View style={styles.teamCircle}><Text style={styles.teamCircleText}>TX</Text></View>
                <Text style={styles.matchTeamTitle}>Tigers XI</Text>
                <Text style={styles.matchScoreBig}>98/2</Text>
                <Text style={styles.matchOverText}>11.4 Ov</Text>
              </View>

              <View style={styles.matchMiddleCol}>
                <Text style={styles.vsSmall}>VS</Text>
                <Text style={styles.tossDecisionText}>Tigers XI{"\n"}elected to bat</Text>
              </View>

              <View style={styles.teamCol}>
                <View style={[styles.teamCircle, { backgroundColor: "#1C2433" }]}>
                  <Text style={[styles.teamCircleText, { color: COLORS.teal }]}>KC</Text>
                </View>
                <Text style={styles.matchTeamTitle}>Kings CC</Text>
                <Text style={styles.matchScoreBig}>-/-</Text>
                <Text style={styles.matchOverText}>Yet to bat</Text>
              </View>
            </View>

            <View style={styles.matchFooter}>
              <Text style={styles.venueLocationText}>📍 Greenfield Stadium, Bengaluru</Text>
              <TouchableOpacity
                onPress={() => toggleFollowMatch("m2")}
                style={[
                  styles.followBtn,
                  followingMatches.includes("m2") && styles.followingBtnActive,
                ]}
              >
                <Text style={[styles.followBtnText, followingMatches.includes("m2") && styles.followingBtnTextActive]}>
                  {followingMatches.includes("m2") ? "Following" : "+ Follow"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* UPCOMING SUB-TAB */}
      {matchesSubTab === "upcoming" && (
        <View style={{ marginTop: 12 }}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>UPCOMING MATCHES</Text>
            </View>
            <TouchableOpacity><Text style={styles.seeAllText}>View all</Text></TouchableOpacity>
          </View>

          {/* Upcoming 1 */}
          <View style={styles.matchCard}>
            <View style={styles.fixtureHeaderRow}>
              <View>
                <Text style={styles.fixtureDateHighlight}>Tomorrow</Text>
                <Text style={styles.fixtureTimeBig}>4:00 PM</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                <View style={{ alignItems: "center" }}>
                  <View style={styles.teamCircle}><Text style={styles.teamCircleText}>FC</Text></View>
                  <Text style={styles.fixtureTeamName}>Falcons CC</Text>
                </View>
                <Text style={styles.vsText}>VS</Text>
                <View style={{ alignItems: "center" }}>
                  <View style={styles.teamCircle}><Text style={styles.teamCircleText}>TX</Text></View>
                  <Text style={styles.fixtureTeamName}>Titans XI</Text>
                </View>
              </View>
            </View>
            <Text style={styles.fixtureVenueText}>📍 Rajiv Cricket Ground, Hyderabad</Text>
            <Text style={styles.fixtureLeagueText}>🏆 Kurukshetra League • T20</Text>
            <TouchableOpacity style={styles.fullWidthFollowBtn}>
              <Text style={styles.fullWidthFollowText}>+ Follow</Text>
            </TouchableOpacity>
          </View>

          {/* Upcoming 2 */}
          <View style={styles.matchCard}>
            <View style={styles.fixtureHeaderRow}>
              <View>
                <Text style={styles.fixtureDateHighlight}>May 18, 2025</Text>
                <Text style={styles.fixtureTimeBig}>6:00 PM</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                <View style={{ alignItems: "center" }}>
                  <View style={styles.teamCircle}><Text style={styles.teamCircleText}>TX</Text></View>
                  <Text style={styles.fixtureTeamName}>Tigers XI</Text>
                </View>
                <Text style={styles.vsText}>VS</Text>
                <View style={{ alignItems: "center" }}>
                  <View style={styles.teamCircle}><Text style={styles.teamCircleText}>KC</Text></View>
                  <Text style={styles.fixtureTeamName}>Kings CC</Text>
                </View>
              </View>
            </View>
            <Text style={styles.fixtureVenueText}>📍 Greenfield Stadium, Bengaluru</Text>
            <Text style={styles.fixtureLeagueText}>🏆 City Premier League • T20</Text>
            <TouchableOpacity style={styles.fullWidthFollowBtn}>
              <Text style={styles.fullWidthFollowText}>+ Follow</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* COMPLETED SUB-TAB */}
      {matchesSubTab === "completed" && (
        <View style={{ marginTop: 12 }}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="trophy-outline" size={16} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>COMPLETED MATCHES</Text>
            </View>
            <TouchableOpacity><Text style={styles.seeAllText}>View all</Text></TouchableOpacity>
          </View>

          {/* Completed Match 1 */}
          <View style={styles.matchCard}>
            <View style={styles.matchCardHeader}>
              <Text style={styles.leagueNameText}>KURUKSHETRA LEAGUE • T20</Text>
              <Text style={styles.completedDateText}>Yesterday</Text>
            </View>

            <View style={styles.matchScoreRow}>
              <View style={styles.teamCol}>
                <View style={styles.teamCircle}><Text style={styles.teamCircleText}>FC</Text></View>
                <Text style={styles.matchTeamTitle}>Falcons CC</Text>
                <Text style={styles.matchScoreBig}>186/7</Text>
                <Text style={styles.matchOverText}>20.0 Ov</Text>
              </View>

              <View style={styles.matchMiddleCol}>
                <Text style={[styles.winnerSummaryText, { color: COLORS.primary }]}>
                  Falcons CC won{"\n"}by 34 runs
                </Text>
              </View>

              <View style={styles.teamCol}>
                <View style={[styles.teamCircle, { backgroundColor: "#1C2433" }]}>
                  <Text style={[styles.teamCircleText, { color: COLORS.teal }]}>WX</Text>
                </View>
                <Text style={styles.matchTeamTitle}>Warriors XI</Text>
                <Text style={styles.matchScoreBig}>152/9</Text>
                <Text style={styles.matchOverText}>20.0 Ov</Text>
              </View>
            </View>

            <View style={styles.matchFooter}>
              <Text style={styles.venueLocationText}>📍 Rajiv Cricket Ground, Hyderabad</Text>
              <TouchableOpacity style={styles.scorecardBtn}>
                <Text style={styles.scorecardBtnText}>Scorecard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* MY MATCHES SUB-TAB */}
      {matchesSubTab === "my_matches" && (
        <View style={{ marginTop: 12 }}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>👤 MY MATCHES</Text>
              <Text style={styles.sectionSubText}>Matches you are part of or managing</Text>
            </View>
            <TouchableOpacity><Text style={styles.seeAllText}>Filter</Text></TouchableOpacity>
          </View>

          <View style={styles.matchCard}>
            <View style={styles.matchCardHeader}>
              <View style={styles.liveTag}><Text style={styles.liveTagText}>LIVE NOW</Text></View>
              <Text style={styles.leagueNameText}>KURUKSHETRA LEAGUE • T20</Text>
            </View>

            <View style={styles.matchScoreRow}>
              <View style={styles.teamCol}>
                <Text style={styles.matchTeamTitle}>Falcons CC</Text>
                <Text style={styles.matchScoreBig}>186/7</Text>
              </View>
              <Text style={styles.vsSmall}>VS</Text>
              <View style={styles.teamCol}>
                <Text style={styles.matchTeamTitle}>Warriors XI</Text>
                <Text style={styles.matchScoreBig}>152/4</Text>
              </View>
            </View>

            <View style={styles.myRoleRow}>
              <View>
                <Text style={styles.venueLocationText}>📍 Rajiv Cricket Ground, Hyderabad</Text>
                <Text style={styles.myRoleBadge}>Top Order Batsman • #17</Text>
              </View>
              <TouchableOpacity style={styles.viewRoleBtn}>
                <Text style={styles.viewRoleBtnText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );

  // --- 3. DISCOVER SCREEN ---
  const renderDiscoverScreen = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Search Input */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search players, teams, matches..."
          placeholderTextColor={COLORS.textMuted}
          style={styles.searchInput}
        />
        <TouchableOpacity>
          <Ionicons name="options-outline" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Browse by Category 6 Grid */}
      <Text style={[styles.sectionTitle, { marginTop: 16, marginBottom: 12 }]}>
        Browse by Category
      </Text>
      <View style={styles.categoryGrid}>
        {[
          { name: "Teams", icon: "people", color: "#00E676" },
          { name: "Players", icon: "pulse", color: "#00B4D8" },
          { name: "Tournaments", icon: "ribbon", color: "#4361EE" },
          { name: "Matches", icon: "flash", color: "#FFB703" },
          { name: "Grounds", icon: "map", color: "#FB8500" },
          { name: "News", icon: "newspaper", color: "#9D4EDD" },
        ].map((cat) => (
          <TouchableOpacity key={cat.name} style={styles.categoryTile}>
            <View style={[styles.categoryIconCircle, { borderColor: cat.color }]}>
              <Ionicons name={cat.icon} size={22} color={cat.color} />
            </View>
            <Text style={styles.categoryTileText}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Trending in Cricket */}
      <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="trending-up" size={18} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Trending in Cricket</Text>
        </View>
        <TouchableOpacity><Text style={styles.seeAllText}>View all</Text></TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, paddingHorizontal: 16 }}>
        <View style={styles.trendingCard}>
          <View style={styles.trendingVideoThumb}>
            <Ionicons name="play" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.trendingTitleText}>Kohli's century powers India to victory</Text>
          <Text style={styles.trendingMetaText}>2h ago • 12K views</Text>
        </View>

        <View style={styles.trendingCard}>
          <View style={styles.trendingVideoThumb}>
            <Ionicons name="play" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.trendingTitleText}>Mumbai win the T20 Championship 2025</Text>
          <Text style={styles.trendingMetaText}>5h ago • 18K views</Text>
        </View>
      </ScrollView>

      {/* Recommended Teams */}
      <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="star" size={16} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Recommended Teams</Text>
        </View>
        <TouchableOpacity><Text style={styles.seeAllText}>View all</Text></TouchableOpacity>
      </View>

      <View style={styles.recommendedTeamCard}>
        <View style={styles.recTeamBadge}><Text style={styles.recTeamText}>SH</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.recTeamName}>Sunrisers Hyderabad</Text>
          <Text style={styles.recTeamRole}>T20 Franchise • 28K Followers</Text>
        </View>
        <TouchableOpacity style={styles.followPillBtn}>
          <Text style={styles.followPillText}>Follow</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // --- 4. PROFILE SCREEN ---
  const renderProfileScreen = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Profile Header Card */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.profileAvatarOuterRing}>
          <Text style={styles.profileAvatarLargeText}>F</Text>
          <View style={styles.verifiedCheckBadge}>
            <Ionicons name="checkmark" size={12} color="#000000" />
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 }}>
          <Text style={styles.profileNameText}>Rahul Kumar</Text>
          <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
        </View>
        <Text style={styles.profileHandleText}>@rahulkumar</Text>
        <Text style={styles.profileLocationText}>📍 Hyderabad, India</Text>

        {/* Roles Tags */}
        <View style={styles.roleTagPill}>
          <Text style={styles.roleTagText}>All-Rounder</Text>
        </View>

        <View style={styles.skillsRow}>
          <Text style={styles.skillItem}>🏏 Right-Handed Batter</Text>
          <Text style={styles.skillItem}>⚾ Right-Arm Medium</Text>
        </View>

        {/* Buttons Row */}
        <View style={styles.profileButtonsRow}>
          <TouchableOpacity style={styles.messageBtn}>
            <Ionicons name="chatbubble" size={16} color="#000000" />
            <Text style={styles.messageBtnText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareProfileBtn}>
            <Ionicons name="share-outline" size={16} color={COLORS.text} />
            <Text style={styles.shareProfileBtnText}>Share Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Counters Box */}
        <View style={styles.countersBox}>
          <View style={styles.counterItem}>
            <Ionicons name="people" size={16} color={COLORS.teal} />
            <Text style={styles.counterBig}>2.4K</Text>
            <Text style={styles.counterLabel}>Followers</Text>
          </View>
          <View style={styles.counterDivider} />
          <View style={styles.counterItem}>
            <Ionicons name="person" size={16} color={COLORS.teal} />
            <Text style={styles.counterBig}>386</Text>
            <Text style={styles.counterLabel}>Following</Text>
          </View>
          <View style={styles.counterDivider} />
          <View style={styles.counterItem}>
            <Ionicons name="document-text" size={16} color={COLORS.orange} />
            <Text style={styles.counterBig}>42</Text>
            <Text style={styles.counterLabel}>Posts</Text>
          </View>
        </View>
      </View>

      {/* Profile Sub Tabs */}
      <View style={styles.profileSubTabsBar}>
        {["overview", "stats", "matches", "posts"].map((tab) => {
          const isActive = profileSubTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setProfileSubTab(tab)}
              style={[styles.profileSubTabItem, isActive && styles.profileSubTabItemActive]}
            >
              <Text style={[styles.profileSubTabText, isActive && styles.profileSubTabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* OVERVIEW TAB */}
      {profileSubTab === "overview" && (
        <View style={{ marginTop: 14 }}>
          <Text style={styles.sectionTitle}>Recent Performance</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, paddingHorizontal: 16, marginTop: 10 }}>
            <View style={styles.perfStatCard}>
              <Text style={styles.perfScoreHighlight}>86* <Text style={{ fontSize: 13, color: COLORS.textMuted }}>(52) 🏏</Text></Text>
              <Text style={styles.perfDetailText}>7 Fours • 3 Sixes</Text>
              <Text style={styles.perfOpponentText}>vs Royal Strikers</Text>
              <Text style={styles.perfDateText}>Yesterday</Text>
            </View>

            <View style={styles.perfStatCard}>
              <Text style={styles.perfScoreHighlight}>42 <Text style={{ fontSize: 13, color: COLORS.textMuted }}>(31) 🏏</Text></Text>
              <Text style={styles.perfDetailText}>5 Fours • 1 Six</Text>
              <Text style={styles.perfOpponentText}>vs Warriors XI</Text>
              <Text style={styles.perfDateText}>3 days ago</Text>
            </View>

            <View style={styles.perfStatCard}>
              <Text style={styles.perfScoreHighlight}>3/24 <Text style={{ fontSize: 13, color: COLORS.textMuted }}>(4) ⚾</Text></Text>
              <Text style={styles.perfDetailText}>4 Overs • 2 Maidens</Text>
              <Text style={styles.perfOpponentText}>vs Titans CC</Text>
              <Text style={styles.perfDateText}>5 days ago</Text>
            </View>
          </ScrollView>

          {/* Form Last 5 Matches */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Form (Last 5 Matches)</Text>
          <View style={styles.formRow}>
            {[
              { score: "84", res: "W" },
              { score: "42", res: "W" },
              { score: "31", res: "L" },
              { score: "18", res: "W" },
              { score: "74", res: "L" },
            ].map((f, i) => (
              <View key={i} style={styles.formCol}>
                <View style={[styles.formBar, { height: Number(f.score) * 0.8 }]}>
                  <Text style={styles.formBarScoreText}>{f.score}</Text>
                </View>
                <View style={[styles.formBadge, { backgroundColor: f.res === "W" ? "rgba(0,230,118,0.2)" : "rgba(239,68,68,0.2)" }]}>
                  <Text style={[styles.formBadgeText, { color: f.res === "W" ? COLORS.primary : COLORS.danger }]}>{f.res}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* STATS TAB */}
      {profileSubTab === "stats" && (
        <View style={{ marginTop: 14 }}>
          {/* Batting Card */}
          <View style={styles.statsCategoryCard}>
            <View style={styles.statsCardHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ fontSize: 18 }}>🏏</Text>
                <Text style={styles.statsCardTitle}>Batting</Text>
              </View>
              <Text style={styles.formatPillText}>All Formats ⌵</Text>
            </View>

            <View style={styles.statsGridRow}>
              <View style={styles.statCell}>
                <Text style={styles.statCellLabel}>Matches</Text>
                <Text style={styles.statCellVal}>42</Text>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.statCellLabel}>Runs</Text>
                <Text style={styles.statCellVal}>1,286</Text>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.statCellLabel}>Average</Text>
                <Text style={[styles.statCellVal, { color: COLORS.primary }]}>38.7</Text>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.statCellLabel}>Strike Rate</Text>
                <Text style={[styles.statCellVal, { color: COLORS.primary }]}>142.4</Text>
              </View>
            </View>

            <View style={[styles.statsGridRow, { borderTopWidth: 1, borderColor: COLORS.cardBorder, paddingTop: 10 }]}>
              <View style={styles.statCellMini}><Text style={styles.statMiniLabel}>HS</Text><Text style={styles.statMiniVal}>86*</Text></View>
              <View style={styles.statCellMini}><Text style={styles.statMiniLabel}>50s</Text><Text style={styles.statMiniVal}>12</Text></View>
              <View style={styles.statCellMini}><Text style={styles.statMiniLabel}>100s</Text><Text style={styles.statMiniVal}>2</Text></View>
              <View style={styles.statCellMini}><Text style={styles.statMiniLabel}>4s</Text><Text style={styles.statMiniVal}>134</Text></View>
              <View style={styles.statCellMini}><Text style={styles.statMiniLabel}>6s</Text><Text style={styles.statMiniVal}>58</Text></View>
            </View>
          </View>

          {/* Bowling Card */}
          <View style={styles.statsCategoryCard}>
            <View style={styles.statsCardHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ fontSize: 18 }}>⚾</Text>
                <Text style={styles.statsCardTitle}>Bowling</Text>
              </View>
              <Text style={styles.formatPillText}>All Formats ⌵</Text>
            </View>

            <View style={styles.statsGridRow}>
              <View style={styles.statCell}>
                <Text style={styles.statCellLabel}>Matches</Text>
                <Text style={styles.statCellVal}>42</Text>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.statCellLabel}>Overs</Text>
                <Text style={styles.statCellVal}>126.4</Text>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.statCellLabel}>Wickets</Text>
                <Text style={[styles.statCellVal, { color: COLORS.primary }]}>58</Text>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.statCellLabel}>Economy</Text>
                <Text style={[styles.statCellVal, { color: COLORS.primary }]}>7.2</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* MATCHES TAB */}
      {profileSubTab === "matches" && (
        <View style={{ marginTop: 14 }}>
          <View style={styles.statsCategoryCard}>
            <Text style={styles.statsCardTitle}>Match Summary</Text>
            <View style={[styles.statsGridRow, { marginTop: 12 }]}>
              <View style={styles.statCell}><Text style={styles.statCellVal}>42</Text><Text style={styles.statCellLabel}>Matches</Text></View>
              <View style={styles.statCell}><Text style={styles.statCellVal}>26</Text><Text style={styles.statCellLabel}>Won</Text></View>
              <View style={styles.statCell}><Text style={[styles.statCellVal, { color: COLORS.primary }]}>61.9%</Text><Text style={styles.statCellLabel}>Win %</Text></View>
              <View style={styles.statCell}><Text style={styles.statCellVal}>8</Text><Text style={styles.statCellLabel}>POTM</Text></View>
            </View>
          </View>
        </View>
      )}

      {/* POSTS TAB */}
      {profileSubTab === "posts" && (
        <View style={{ marginTop: 14 }}>
          <View style={styles.filterPillsRow}>
            {["all", "photos", "videos", "performances"].map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setProfilePostsFilter(filter)}
                style={[
                  styles.filterPill,
                  profilePostsFilter === filter && styles.filterPillActive,
                ]}
              >
                <Text style={[styles.filterPillText, profilePostsFilter === filter && styles.filterPillTextActive]}>
                  {filter === "all" ? "All Posts" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Top Header */}
      {renderTopHeader(
        currentTab === "profile" ? "Profile" : currentTab === "matches" ? "Matches" : currentTab === "discover" ? "Discover" : "EZKORA",
        currentTab === "home"
      )}

      {/* Active Tab Screen */}
      <View style={{ flex: 1 }}>
        {currentTab === "home" && renderHomeScreen()}
        {currentTab === "matches" && renderMatchesScreen()}
        {currentTab === "discover" && renderDiscoverScreen()}
        {currentTab === "profile" && renderProfileScreen()}
      </View>

      {/* BOTTOM NAVIGATION BAR */}
      <View style={styles.bottomNav}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          onPress={() => setCurrentTab("home")}
          style={styles.bottomNavItem}
        >
          <Ionicons
            name={currentTab === "home" ? "home" : "home-outline"}
            size={22}
            color={currentTab === "home" ? COLORS.primary : COLORS.textMuted}
          />
          <Text style={[styles.bottomNavLabel, currentTab === "home" && styles.bottomNavLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Matches */}
        <TouchableOpacity
          onPress={() => setCurrentTab("matches")}
          style={styles.bottomNavItem}
        >
          <MaterialCommunityIcons
            name="cricket"
            size={22}
            color={currentTab === "matches" ? COLORS.primary : COLORS.textMuted}
          />
          <Text style={[styles.bottomNavLabel, currentTab === "matches" && styles.bottomNavLabelActive]}>
            Matches
          </Text>
        </TouchableOpacity>

        {/* Center Floating + Button */}
        <TouchableOpacity
          onPress={() => setCreateModalOpen(true)}
          style={styles.floatingCenterBtn}
        >
          <Ionicons name="add" size={32} color="#000000" />
        </TouchableOpacity>

        {/* Tab 4: Discover */}
        <TouchableOpacity
          onPress={() => setCurrentTab("discover")}
          style={styles.bottomNavItem}
        >
          <Ionicons
            name={currentTab === "discover" ? "search" : "search-outline"}
            size={22}
            color={currentTab === "discover" ? COLORS.primary : COLORS.textMuted}
          />
          <Text style={[styles.bottomNavLabel, currentTab === "discover" && styles.bottomNavLabelActive]}>
            Discover
          </Text>
        </TouchableOpacity>

        {/* Tab 5: Profile */}
        <TouchableOpacity
          onPress={() => setCurrentTab("profile")}
          style={styles.bottomNavItem}
        >
          <View style={[styles.profileNavCircle, currentTab === "profile" && { borderColor: COLORS.primary }]}>
            <Text style={styles.profileNavText}>U</Text>
          </View>
          <Text style={[styles.bottomNavLabel, currentTab === "profile" && styles.bottomNavLabelActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* CREATE MODAL ("Build, organize, and play.") */}
      <Modal visible={createModalOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.createModalCard}>
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={styles.logoBadge}><Text style={styles.logoBadgeText}>E</Text></View>
                <Text style={styles.modalTitle}>Create</Text>
              </View>
              <TouchableOpacity onPress={() => setCreateModalOpen(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Build, organize, and play.</Text>

            {/* Action List */}
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 16 }}>
              {[
                { title: "Create Match", desc: "Set up a cricket match", icon: "cricket", type: "mc" },
                { title: "Create Team", desc: "Build your own team", icon: "people", type: "io" },
                { title: "Create Tournament", desc: "Organize a tournament", icon: "trophy", type: "io" },
                { title: "Create Event", desc: "Plan an event", icon: "calendar", type: "io" },
                { title: "Create Post", desc: "Share moments with community", icon: "document-text", type: "io" },
                { title: "Play Now", desc: "Find or join a game quickly", icon: "flash", type: "io", highlight: true },
              ].map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setCreateModalOpen(false)}
                  style={[
                    styles.createActionRow,
                    item.highlight && styles.createActionHighlight,
                  ]}
                >
                  <View style={[styles.actionIconCircle, item.highlight && { backgroundColor: "rgba(0,230,118,0.2)" }]}>
                    {item.type === "mc" ? (
                      <MaterialCommunityIcons name="cricket" size={20} color={COLORS.orange} />
                    ) : (
                      <Ionicons name={item.icon} size={20} color={item.highlight ? COLORS.primary : COLORS.teal} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.actionRowTitle}>{item.title}</Text>
                    <Text style={styles.actionRowDesc}>{item.desc}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoBadge: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoBadgeText: {
    color: "#000000",
    fontWeight: "900",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  locationText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    width: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeCountText: {
    color: "#000000",
    fontSize: 9,
    fontWeight: "900",
  },
  avatarMini: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarMiniText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "700",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  sectionSubText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
  liveBannerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  liveCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  liveTag: {
    backgroundColor: "rgba(0, 230, 118, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  liveTagText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  overCountText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  teamsScoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  teamScoreCol: {
    alignItems: "center",
    width: 100,
  },
  teamBadgeCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.cardActive,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  teamBadgeText: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 14,
  },
  teamNameText: {
    color: COLORS.textSub,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  scoreText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
  },
  vsText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: "700",
  },
  tossInfoText: {
    color: COLORS.primary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
    fontWeight: "500",
  },
  subTabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    marginTop: 18,
    marginBottom: 12,
  },
  subTabItem: {
    paddingVertical: 10,
    marginRight: 24,
  },
  subTabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  subTabText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  subTabTextActive: {
    color: COLORS.primary,
  },
  postCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 14,
  },
  postAuthorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  postAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBorder,
    justifyContent: "center",
    alignItems: "center",
  },
  postAvatarText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },
  postAuthorName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },
  postAuthorMeta: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  postVenueMeta: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  postMediaBox: {
    height: 140,
    borderRadius: 12,
    backgroundColor: "#0F1E1B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  postCaptionText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  highlightBadgeBox: {
    backgroundColor: "rgba(0, 230, 118, 0.08)",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  highlightTitle: {
    color: COLORS.orange,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  highlightScore: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
  },
  highlightDetails: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  postActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  postActionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  postActionCount: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  tabScrollContainer: {
    flexDirection: "row",
    marginTop: 6,
    marginBottom: 6,
  },
  matchesSubTabItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
  },
  matchesSubTabItemActive: {
    backgroundColor: COLORS.primary,
  },
  matchesSubTabText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  matchesSubTabTextActive: {
    color: "#000000",
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  matchCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 12,
  },
  matchCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  leagueNameText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  matchScoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  teamCol: {
    alignItems: "center",
    width: 90,
  },
  teamCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.cardBorder,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  teamCircleText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
  },
  matchTeamTitle: {
    color: COLORS.textSub,
    fontSize: 12,
    fontWeight: "600",
  },
  matchScoreBig: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 2,
  },
  matchOverText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 1,
  },
  matchMiddleCol: {
    alignItems: "center",
  },
  vsSmall: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  tossDecisionText: {
    color: COLORS.primary,
    fontSize: 10,
    textAlign: "center",
    fontWeight: "600",
    marginTop: 4,
  },
  matchFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  venueLocationText: {
    color: COLORS.textMuted,
    fontSize: 11,
    flex: 1,
  },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  followingBtnActive: {
    backgroundColor: "rgba(0,230,118,0.15)",
  },
  followBtnText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  followingBtnTextActive: {
    color: COLORS.primary,
  },
  scorecardBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scorecardBtnText: {
    color: "#000000",
    fontSize: 11,
    fontWeight: "800",
  },
  completedDateText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  winnerSummaryText: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  fixtureHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  fixtureDateHighlight: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  fixtureTimeBig: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
  },
  fixtureTeamName: {
    color: COLORS.textSub,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  fixtureVenueText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  fixtureLeagueText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
    marginBottom: 10,
  },
  fullWidthFollowBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  fullWidthFollowText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  myRoleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  myRoleBadge: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  viewRoleBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  viewRoleBtnText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginTop: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  categoryTile: {
    width: (width - 48) / 3,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryTileText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
  },
  trendingCard: {
    width: 200,
    marginRight: 12,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  trendingVideoThumb: {
    height: 100,
    backgroundColor: "#162532",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  trendingTitleText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },
  trendingMetaText: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 4,
  },
  recommendedTeamCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 12,
  },
  recTeamBadge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.cardBorder,
    justifyContent: "center",
    alignItems: "center",
  },
  recTeamText: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 15,
  },
  recTeamName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },
  recTeamRole: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  followPillBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  followPillText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "700",
  },
  profileHeaderCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  profileAvatarOuterRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  profileAvatarLargeText: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: "900",
  },
  verifiedCheckBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: COLORS.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  profileNameText: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
  },
  profileHandleText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  profileLocationText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  roleTagPill: {
    backgroundColor: "rgba(0,230,118,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
  },
  roleTagText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  skillsRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 10,
  },
  skillItem: {
    color: COLORS.textSub,
    fontSize: 11,
    fontWeight: "600",
  },
  profileButtonsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 18,
  },
  messageBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 12,
  },
  messageBtnText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "700",
  },
  shareProfileBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.cardBorder,
    paddingVertical: 10,
    borderRadius: 12,
  },
  shareProfileBtnText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
  },
  countersBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: COLORS.bg,
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 18,
  },
  counterItem: {
    alignItems: "center",
    flex: 1,
  },
  counterBig: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 2,
  },
  counterLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  counterDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.cardBorder,
  },
  profileSubTabsBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    marginTop: 18,
  },
  profileSubTabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  profileSubTabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  profileSubTabText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  profileSubTabTextActive: {
    color: COLORS.primary,
  },
  perfStatCard: {
    width: 150,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  perfScoreHighlight: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "900",
  },
  perfDetailText: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 4,
  },
  perfOpponentText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
  },
  perfDateText: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  formCol: {
    alignItems: "center",
    gap: 8,
  },
  formBar: {
    width: 36,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 4,
  },
  formBarScoreText: {
    color: "#000000",
    fontSize: 10,
    fontWeight: "800",
  },
  formBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  formBadgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  statsCategoryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 12,
  },
  statsCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statsCardTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
  formatPillText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
  statsGridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statCell: {
    alignItems: "center",
    flex: 1,
  },
  statCellLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  statCellVal: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 2,
  },
  statCellMini: {
    alignItems: "center",
    flex: 1,
  },
  statMiniLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
  },
  statMiniVal: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  filterPillsRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.card,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
  },
  filterPillText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },
  filterPillTextActive: {
    color: "#000000",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: COLORS.bg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingHorizontal: 8,
  },
  bottomNavItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
  },
  bottomNavLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  bottomNavLabelActive: {
    color: COLORS.primary,
  },
  floatingCenterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    bottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  profileNavCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.cardBorder,
    borderWidth: 1.5,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  profileNavText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "800",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  createModalCard: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  modalSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  createActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: COLORS.bg,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  createActionHighlight: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(0, 230, 118, 0.05)",
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBorder,
    justifyContent: "center",
    alignItems: "center",
  },
  actionRowTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },
  actionRowDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
});
