import "./polyfill";
import { registerRootComponent } from "expo";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Web-aligned Refined Dark Palette (No Green Fonts)
const THEME = {
  bg: "#0B1115",
  headerBg: "#0E151A",
  card: "#121A20",
  cardHover: "#16222A",
  border: "#1E2B35",
  borderLight: "#283946",
  text: "#FFFFFF",
  textMuted: "#94A3B8",
  textSub: "#64748B",
  white: "#FFFFFF",
  liveDot: "#EF4444",
  badgeBg: "rgba(255, 255, 255, 0.08)",
  danger: "#EF4444",
};

// Sports Lenses (Matching Web App ezkoraStore.js)
const SPORTS = [
  { id: "Football", name: "Football", icon: "soccer", descriptor: "The beautiful game" },
  { id: "Cricket", name: "Cricket", icon: "cricket", descriptor: "The long game" },
  { id: "Basketball", name: "Basketball", icon: "basketball", descriptor: "The next possession" },
  { id: "Tennis", name: "Tennis", icon: "tennis", descriptor: "Find your rhythm" },
  { id: "Running", name: "Running", icon: "run", descriptor: "One more kilometre" },
  { id: "Cycling", name: "Cycling", icon: "bike", descriptor: "Keep the wheels turning" },
];

export default function App() {
  // Navigation: "home" | "players" | "games" | "scores" | "profile"
  const [currentTab, setCurrentTab] = useState("home");

  // Active Sport Lens (default to Football matching web app)
  const [activeSport, setActiveSport] = useState("Football");

  // Post composer modal
  const [composerOpen, setComposerOpen] = useState(false);
  const [postText, setPostText] = useState("");

  // Games tab filter: "all" | "live" | "upcoming" | "completed"
  const [gameFilter, setGameFilter] = useState("all");

  // Interactive Live Scoring State
  const [homeScore, setHomeScore] = useState(2);
  const [awayScore, setAwayScore] = useState(1);
  const [matchMinute, setMatchMinute] = useState(78);

  // Cricket Scoring State
  const [cricketRuns, setCricketRuns] = useState(186);
  const [cricketWickets, setCricketWickets] = useState(4);
  const [cricketOvers, setCricketOvers] = useState("18.4");
  const [cricketBalls, setCricketBalls] = useState(["1", "4", "W", "6", "0", "2"]);

  // Player search
  const [playerSearch, setPlayerSearch] = useState("");

  // Sample data contextual to active sport
  const currentSport = SPORTS.find((s) => s.id === activeSport) || SPORTS[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1115" translucent />

      {/* TOPBAR — Pushed down with safe top spacing */}
      <View style={styles.topbar}>
        <View style={styles.topbarLeft}>
          <View style={styles.brandRow}>
            <Text style={styles.brandTitle}>EZKORA</Text>
            <View style={styles.proBadge}>
              <Text style={styles.proText}>PRO</Text>
            </View>
          </View>
          <View style={styles.lensIndicator}>
            <MaterialCommunityIcons name={currentSport.icon} size={13} color={THEME.textMuted} />
            <Text style={styles.lensText}>{currentSport.name}</Text>
            <Text style={styles.lensSub}>· {currentSport.descriptor}</Text>
          </View>
        </View>

        <View style={styles.topbarRight}>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={() => setComposerOpen(true)}
          >
            <Ionicons name="add" size={20} color={THEME.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.avatarButton}
            activeOpacity={0.7}
            onPress={() => setCurrentTab("profile")}
          >
            <Text style={styles.avatarText}>CT</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SPORT STRIP — Smooth horizontal sport lens switcher */}
      <View style={styles.sportStripContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sportStrip}
        >
          {SPORTS.map((sport) => {
            const isSelected = sport.id === activeSport;
            return (
              <TouchableOpacity
                key={sport.id}
                style={[styles.sportPill, isSelected && styles.sportPillActive]}
                onPress={() => setActiveSport(sport.id)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={sport.icon}
                  size={15}
                  color={isSelected ? "#000000" : THEME.textMuted}
                />
                <Text style={[styles.sportPillText, isSelected && styles.sportPillTextActive]}>
                  {sport.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* MAIN CONTENT AREA */}
      <View style={styles.content}>
        {currentTab === "home" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* HERO OVERVIEW CARD */}
            <View style={styles.heroCard}>
              <View style={styles.heroHeader}>
                <View style={styles.liveIndicator}>
                  <View style={styles.livePulse} />
                  <Text style={styles.liveText}>FEATURED FIXTURE</Text>
                </View>
                <Text style={styles.heroSportTag}>{currentSport.name}</Text>
              </View>

              {activeSport === "Cricket" ? (
                <View style={styles.scoreboardSection}>
                  <View style={styles.matchTeamRow}>
                    <Text style={styles.teamName}>Falcons CC</Text>
                    <Text style={styles.teamScore}>
                      {cricketRuns}/{cricketWickets}{" "}
                      <Text style={styles.oversText}>({cricketOvers})</Text>
                    </Text>
                  </View>
                  <View style={styles.matchTeamRow}>
                    <Text style={styles.teamName}>Warriors XI</Text>
                    <Text style={styles.teamScoreMuted}>152/8 (20.0)</Text>
                  </View>
                  <View style={styles.ballRow}>
                    <Text style={styles.ballRowLabel}>This Over:</Text>
                    {cricketBalls.map((b, i) => (
                      <View
                        key={i}
                        style={[
                          styles.ballPill,
                          b === "W" && styles.ballWicket,
                          (b === "4" || b === "6") && styles.ballBoundary,
                        ]}
                      >
                        <Text style={styles.ballPillText}>{b}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.scoreboardSection}>
                  <View style={styles.matchTeamsDisplay}>
                    <View style={styles.teamBlock}>
                      <View style={styles.teamCrest}>
                        <Text style={styles.teamCrestText}>MAD</Text>
                      </View>
                      <Text style={styles.teamLabel}>Real Madrid</Text>
                    </View>
                    <View style={styles.scoreBlock}>
                      <Text style={styles.scoreText}>
                        {homeScore} - {awayScore}
                      </Text>
                      <Text style={styles.matchTimeText}>{matchMinute}' LIVE</Text>
                    </View>
                    <View style={styles.teamBlock}>
                      <View style={styles.teamCrest}>
                        <Text style={styles.teamCrestText}>MCI</Text>
                      </View>
                      <Text style={styles.teamLabel}>Man City</Text>
                    </View>
                  </View>
                </View>
              )}

              <View style={styles.heroFooter}>
                <TouchableOpacity
                  style={styles.heroActionBtn}
                  onPress={() => setCurrentTab("scores")}
                >
                  <Text style={styles.heroActionBtnText}>Open Score Console</Text>
                  <Ionicons name="arrow-forward" size={14} color="#000000" />
                </TouchableOpacity>
              </View>
            </View>

            {/* QUICK ACTIONS BAR */}
            <View style={styles.quickActionsRow}>
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => setCurrentTab("games")}
              >
                <Ionicons name="calendar-outline" size={18} color={THEME.text} />
                <Text style={styles.quickActionTitle}>Fixtures</Text>
                <Text style={styles.quickActionSub}>Upcoming games</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => setCurrentTab("players")}
              >
                <Ionicons name="people-outline" size={18} color={THEME.text} />
                <Text style={styles.quickActionTitle}>Athletes</Text>
                <Text style={styles.quickActionSub}>Rosters & stats</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => setComposerOpen(true)}
              >
                <Ionicons name="create-outline" size={18} color={THEME.text} />
                <Text style={styles.quickActionTitle}>Share</Text>
                <Text style={styles.quickActionSub}>Post highlight</Text>
              </TouchableOpacity>
            </View>

            {/* SECTION HEADER */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>COMMUNITY FEED</Text>
                <Text style={styles.sectionTitle}>From the field</Text>
              </View>
              <TouchableOpacity onPress={() => setCurrentTab("players")}>
                <Text style={styles.sectionLink}>Find athletes →</Text>
              </TouchableOpacity>
            </View>

            {/* POST CARD 1 */}
            <View style={styles.postCard}>
              <View style={styles.postAuthorRow}>
                <View style={styles.postAvatar}>
                  <Text style={styles.postAvatarText}>RK</Text>
                </View>
                <View style={styles.postAuthorMeta}>
                  <Text style={styles.postAuthorName}>Rahul Kumar</Text>
                  <Text style={styles.postTime}>2 hours ago · {currentSport.name}</Text>
                </View>
                <View style={styles.postSportBadge}>
                  <Text style={styles.postSportBadgeText}>MATCH HIGHLIGHT</Text>
                </View>
              </View>
              <Text style={styles.postBody}>
                Hard fought victory under the lights tonight! Team delivered under pressure in the
                final 10 minutes. On to the semi-finals next weekend.
              </Text>
              <View style={styles.postInteractionRow}>
                <TouchableOpacity style={styles.postStatBtn}>
                  <Ionicons name="heart-outline" size={16} color={THEME.textMuted} />
                  <Text style={styles.postStatText}>48</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postStatBtn}>
                  <Ionicons name="chatbubble-outline" size={15} color={THEME.textMuted} />
                  <Text style={styles.postStatText}>12</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postStatBtn}>
                  <Ionicons name="share-social-outline" size={15} color={THEME.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            {/* POST CARD 2 */}
            <View style={styles.postCard}>
              <View style={styles.postAuthorRow}>
                <View style={styles.postAvatar}>
                  <Text style={styles.postAvatarText}>AS</Text>
                </View>
                <View style={styles.postAuthorMeta}>
                  <Text style={styles.postAuthorName}>Ananya Sharma</Text>
                  <Text style={styles.postTime}>5 hours ago · Training</Text>
                </View>
                <View style={styles.postSportBadge}>
                  <Text style={styles.postSportBadgeText}>SESSION LOG</Text>
                </View>
              </View>
              <Text style={styles.postBody}>
                Early morning drill focused on agility and possession retention. 8.4 km clocked,
                average heart rate 152 bpm. Staying consistent.
              </Text>
              <View style={styles.postInteractionRow}>
                <TouchableOpacity style={styles.postStatBtn}>
                  <Ionicons name="heart-outline" size={16} color={THEME.textMuted} />
                  <Text style={styles.postStatText}>31</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postStatBtn}>
                  <Ionicons name="chatbubble-outline" size={15} color={THEME.textMuted} />
                  <Text style={styles.postStatText}>6</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postStatBtn}>
                  <Ionicons name="share-social-outline" size={15} color={THEME.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

        {/* PLAYERS TAB */}
        {currentTab === "players" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.tabHeader}>
              <Text style={styles.sectionEyebrow}>{currentSport.name} / ATHLETES</Text>
              <Text style={styles.sectionTitle}>Player Directory</Text>
              <Text style={styles.tabSubtitle}>
                Verified athletes registered in the {currentSport.name.toLowerCase()} community.
              </Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={16} color={THEME.textSub} />
              <TextInput
                placeholder="Search athlete by name or role..."
                placeholderTextColor={THEME.textSub}
                value={playerSearch}
                onChangeText={setPlayerSearch}
                style={styles.searchInput}
              />
            </View>

            {/* Athlete Cards */}
            <View style={styles.playerCard}>
              <View style={styles.playerAvatarLarge}>
                <Text style={styles.playerAvatarLargeText}>RK</Text>
              </View>
              <View style={styles.playerInfo}>
                <View style={styles.playerNameRow}>
                  <Text style={styles.playerName}>Rahul Kumar</Text>
                  <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.playerRole}>Top Order / Striker · #17</Text>
                <Text style={styles.playerMeta}>Falcons Club · 42 Matches · 61.9% Win Rate</Text>
              </View>
              <TouchableOpacity style={styles.connectBtn}>
                <Text style={styles.connectBtnText}>Follow</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.playerCard}>
              <View style={styles.playerAvatarLarge}>
                <Text style={styles.playerAvatarLargeText}>AS</Text>
              </View>
              <View style={styles.playerInfo}>
                <View style={styles.playerNameRow}>
                  <Text style={styles.playerName}>Ananya Sharma</Text>
                  <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.playerRole}>Midfield Playmaker · #10</Text>
                <Text style={styles.playerMeta}>Phoenix SC · 38 Matches · 68.4% Win Rate</Text>
              </View>
              <TouchableOpacity style={styles.connectBtn}>
                <Text style={styles.connectBtnText}>Follow</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.playerCard}>
              <View style={styles.playerAvatarLarge}>
                <Text style={styles.playerAvatarLargeText}>DK</Text>
              </View>
              <View style={styles.playerInfo}>
                <View style={styles.playerNameRow}>
                  <Text style={styles.playerName}>Dinesh Karthik</Text>
                  <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.playerRole}>Wicketkeeper / Defender · #21</Text>
                <Text style={styles.playerMeta}>Warriors XI · 56 Matches · 58.2% Win Rate</Text>
              </View>
              <TouchableOpacity style={styles.connectBtn}>
                <Text style={styles.connectBtnText}>Follow</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* GAMES TAB */}
        {currentTab === "games" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.tabHeader}>
              <Text style={styles.sectionEyebrow}>{currentSport.name} / FIXTURES</Text>
              <Text style={styles.sectionTitle}>Official Matches</Text>
              <Text style={styles.tabSubtitle}>
                Scheduled league games, friendly matches, and tournament brackets.
              </Text>
            </View>

            {/* Filter Pills */}
            <View style={styles.filterPillsRow}>
              {["all", "live", "upcoming", "completed"].map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterPill, gameFilter === f && styles.filterPillActive]}
                  onPress={() => setGameFilter(f)}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      gameFilter === f && styles.filterPillTextActive,
                    ]}
                  >
                    {f.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Game Card 1 */}
            <View style={styles.gameCard}>
              <View style={styles.gameCardHeader}>
                <View style={styles.liveIndicator}>
                  <View style={styles.livePulse} />
                  <Text style={styles.liveText}>LIVE NOW</Text>
                </View>
                <Text style={styles.gameVenue}>Gachibowli Stadium, Hyderabad</Text>
              </View>
              <View style={styles.gameMatchup}>
                <View style={styles.gameTeamBlock}>
                  <Text style={styles.gameTeamName}>Falcons CC</Text>
                  <Text style={styles.gameTeamScore}>186/4 (18.4)</Text>
                </View>
                <Text style={styles.vsText}>VS</Text>
                <View style={styles.gameTeamBlock}>
                  <Text style={styles.gameTeamName}>Warriors XI</Text>
                  <Text style={styles.gameTeamScore}>152/8 (20.0)</Text>
                </View>
              </View>
              <View style={styles.gameCardFooter}>
                <Text style={styles.gameRequirement}>Target: 187 runs · 8 balls left</Text>
                <TouchableOpacity
                  style={styles.gameScoreBtn}
                  onPress={() => setCurrentTab("scores")}
                >
                  <Text style={styles.gameScoreBtnText}>Live Score</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Game Card 2 */}
            <View style={styles.gameCard}>
              <View style={styles.gameCardHeader}>
                <View style={styles.upcomingBadge}>
                  <Text style={styles.upcomingBadgeText}>UPCOMING</Text>
                </View>
                <Text style={styles.gameVenue}>Tomorrow · 07:00 PM</Text>
              </View>
              <View style={styles.gameMatchup}>
                <View style={styles.gameTeamBlock}>
                  <Text style={styles.gameTeamName}>Hyderabad Stars</Text>
                  <Text style={styles.gameTeamSub}>Confirmed (11/11)</Text>
                </View>
                <Text style={styles.vsText}>VS</Text>
                <View style={styles.gameTeamBlock}>
                  <Text style={styles.gameTeamName}>Secunderabad United</Text>
                  <Text style={styles.gameTeamSub}>Confirmed (11/11)</Text>
                </View>
              </View>
              <View style={styles.gameCardFooter}>
                <Text style={styles.gameRequirement}>Official Premier League · Round 4</Text>
                <TouchableOpacity style={styles.gameReminderBtn}>
                  <Ionicons name="notifications-outline" size={14} color={THEME.text} />
                  <Text style={styles.gameReminderBtnText}>Remind</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

        {/* SCORES TAB */}
        {currentTab === "scores" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.tabHeader}>
              <Text style={styles.sectionEyebrow}>{currentSport.name} / OFFICIAL SCORING</Text>
              <Text style={styles.sectionTitle}>Stadium Scoreboard</Text>
              <Text style={styles.tabSubtitle}>
                Live ball-by-ball, possession tracking, and verified results.
              </Text>
            </View>

            {/* Interactive Stadium Scoreboard Console */}
            <View style={styles.consoleCard}>
              <View style={styles.consoleHeader}>
                <View style={styles.liveIndicator}>
                  <View style={styles.livePulse} />
                  <Text style={styles.liveText}>CONSOLE ACTIVE</Text>
                </View>
                <Text style={styles.matchCodeText}>Match ID: EZ-8941</Text>
              </View>

              {activeSport === "Cricket" ? (
                <View style={styles.cricketConsole}>
                  <Text style={styles.cricketMainScore}>
                    {cricketRuns} - {cricketWickets}
                  </Text>
                  <Text style={styles.cricketOversDisplay}>Overs: {cricketOvers} / 20.0</Text>

                  <View style={styles.scoreButtonsGrid}>
                    {["0", "1", "2", "3", "4", "6"].map((run) => (
                      <TouchableOpacity
                        key={run}
                        style={styles.scoreActionBtn}
                        onPress={() => {
                          const n = parseInt(run);
                          setCricketRuns((r) => r + n);
                          setCricketBalls((b) => [...b.slice(1), run]);
                        }}
                      >
                        <Text style={styles.scoreActionBtnText}>+{run}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={[styles.scoreActionBtn, styles.scoreActionWicket]}
                      onPress={() => {
                        setCricketWickets((w) => Math.min(10, w + 1));
                        setCricketBalls((b) => [...b.slice(1), "W"]);
                      }}
                    >
                      <Text style={[styles.scoreActionBtnText, { color: "#FFFFFF" }]}>OUT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.scoreActionBtn, styles.scoreActionReset]}
                      onPress={() => {
                        setCricketRuns(186);
                        setCricketWickets(4);
                      }}
                    >
                      <Text style={styles.scoreActionResetText}>Reset</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.footballConsole}>
                  <View style={styles.footballScoreRow}>
                    <View style={styles.footballTeamCol}>
                      <Text style={styles.footballTeamName}>Real Madrid</Text>
                      <Text style={styles.footballScoreDigit}>{homeScore}</Text>
                      <View style={styles.scoreAdjustRow}>
                        <TouchableOpacity
                          style={styles.adjustBtn}
                          onPress={() => setHomeScore((s) => Math.max(0, s - 1))}
                        >
                          <Text style={styles.adjustBtnText}>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.adjustBtn}
                          onPress={() => setHomeScore((s) => s + 1)}
                        >
                          <Text style={styles.adjustBtnText}>+1</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.footballCenterCol}>
                      <Text style={styles.footballColon}>:</Text>
                      <Text style={styles.footballMinute}>{matchMinute}'</Text>
                    </View>

                    <View style={styles.footballTeamCol}>
                      <Text style={styles.footballTeamName}>Man City</Text>
                      <Text style={styles.footballScoreDigit}>{awayScore}</Text>
                      <View style={styles.scoreAdjustRow}>
                        <TouchableOpacity
                          style={styles.adjustBtn}
                          onPress={() => setAwayScore((s) => Math.max(0, s - 1))}
                        >
                          <Text style={styles.adjustBtnText}>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.adjustBtn}
                          onPress={() => setAwayScore((s) => s + 1)}
                        >
                          <Text style={styles.adjustBtnText}>+1</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Historical Match Records */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>HISTORICAL RESULTS</Text>
                <Text style={styles.sectionTitle}>Completed Fixtures</Text>
              </View>
            </View>

            <View style={styles.historyCard}>
              <View style={styles.historyMetaRow}>
                <Text style={styles.historySport}>{currentSport.name} Championship</Text>
                <Text style={styles.historyDate}>Sep 18, 2026</Text>
              </View>
              <Text style={styles.historyTeams}>Falcons CC 194/6 def. Titans 182/9</Text>
              <Text style={styles.historyResult}>Won by 12 runs · Player of the Match: Rahul Kumar (86*)</Text>
            </View>
          </ScrollView>
        )}

        {/* PROFILE TAB */}
        {currentTab === "profile" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.profileCard}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>CT</Text>
              </View>
              <Text style={styles.profileName}>Charan Teja</Text>
              <Text style={styles.profileHandle}>@charanteja · Athlete ID: PL-512391</Text>
              <View style={styles.profileBadge}>
                <Ionicons name="shield-checkmark" size={13} color="#FFFFFF" />
                <Text style={styles.profileBadgeText}>VERIFIED ATHLETE</Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>42</Text>
                  <Text style={styles.statLabel}>Matches</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>61.9%</Text>
                  <Text style={styles.statLabel}>Win Rate</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>8</Text>
                  <Text style={styles.statLabel}>POTM</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>142.6</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
              </View>
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.settingsHeader}>PREFERENCES & ACCOUNT</Text>
              <View style={styles.settingsItem}>
                <Ionicons name="football-outline" size={18} color={THEME.text} />
                <Text style={styles.settingsItemTitle}>Primary Sport Lens: {activeSport}</Text>
              </View>
              <View style={styles.settingsItem}>
                <Ionicons name="notifications-outline" size={18} color={THEME.text} />
                <Text style={styles.settingsItemTitle}>Match Alerts & Notifications</Text>
              </View>
              <View style={styles.settingsItem}>
                <Ionicons name="cloud-done-outline" size={18} color={THEME.text} />
                <Text style={styles.settingsItemTitle}>EZKORA Cloud Sync: Active</Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* BOTTOM NAVIGATION — Clean, web-aligned 5-tab bar */}
      <View style={styles.bottomNav}>
        {[
          { key: "home", label: "Home", icon: "home" },
          { key: "players", label: "Players", icon: "people" },
          { key: "games", label: "Games", icon: "trophy" },
          { key: "scores", label: "Scores", icon: "timer" },
          { key: "profile", label: "Profile", icon: "person" },
        ].map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.navItem}
              onPress={() => setCurrentTab(tab.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? tab.icon : `${tab.icon}-outline`}
                size={22}
                color={isActive ? THEME.white : THEME.textSub}
              />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* POST COMPOSER MODAL */}
      <Modal visible={composerOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share a moment</Text>
              <TouchableOpacity onPress={() => setComposerOpen(false)}>
                <Ionicons name="close" size={22} color={THEME.textMuted} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder={`What's happening on the ${currentSport.name.toLowerCase()} field?`}
              placeholderTextColor={THEME.textSub}
              multiline
              numberOfLines={4}
              value={postText}
              onChangeText={setPostText}
            />
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setComposerOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={() => {
                  setComposerOpen(false);
                  setPostText("");
                }}
              >
                <Text style={styles.modalSubmitText}>Post to Feed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },

  // TOPBAR — Pushed down with generous safe area spacing
  topbar: {
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 16 : 52,
    paddingBottom: 14,
    paddingHorizontal: 20,
    backgroundColor: THEME.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topbarLeft: {
    flexDirection: "column",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: THEME.white,
    letterSpacing: 0.5,
  },
  proBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  proText: {
    color: THEME.white,
    fontSize: 9,
    fontWeight: "800",
  },
  lensIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  lensText: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  lensSub: {
    color: THEME.textSub,
    fontSize: 11,
  },
  topbarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: THEME.white,
    fontSize: 12,
    fontWeight: "800",
  },

  // SPORT STRIP
  sportStripContainer: {
    backgroundColor: THEME.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    paddingVertical: 8,
  },
  sportStrip: {
    paddingHorizontal: 16,
    gap: 8,
  },
  sportPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  sportPillActive: {
    backgroundColor: THEME.white,
    borderColor: THEME.white,
  },
  sportPillText: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  sportPillTextActive: {
    color: "#000000",
    fontWeight: "800",
  },

  // CONTENT
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 16,
  },

  // HERO CARD
  heroCard: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 16,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  livePulse: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: THEME.liveDot,
  },
  liveText: {
    color: THEME.text,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  heroSportTag: {
    color: THEME.textSub,
    fontSize: 11,
    fontWeight: "600",
  },
  scoreboardSection: {
    paddingVertical: 8,
  },
  matchTeamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  teamName: {
    color: THEME.white,
    fontSize: 16,
    fontWeight: "700",
  },
  teamScore: {
    color: THEME.white,
    fontSize: 17,
    fontWeight: "800",
  },
  teamScoreMuted: {
    color: THEME.textMuted,
    fontSize: 15,
    fontWeight: "600",
  },
  oversText: {
    color: THEME.textSub,
    fontSize: 12,
    fontWeight: "500",
  },
  ballRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  ballRowLabel: {
    color: THEME.textSub,
    fontSize: 11,
    marginRight: 4,
  },
  ballPill: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME.border,
    alignItems: "center",
    justifyContent: "center",
  },
  ballBoundary: {
    backgroundColor: "#FFFFFF",
  },
  ballWicket: {
    backgroundColor: THEME.danger,
  },
  ballPillText: {
    color: THEME.white,
    fontSize: 11,
    fontWeight: "700",
  },
  matchTeamsDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 6,
  },
  teamBlock: {
    alignItems: "center",
    gap: 6,
  },
  teamCrest: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.border,
    alignItems: "center",
    justifyContent: "center",
  },
  teamCrestText: {
    color: THEME.white,
    fontSize: 13,
    fontWeight: "800",
  },
  teamLabel: {
    color: THEME.white,
    fontSize: 13,
    fontWeight: "600",
  },
  scoreBlock: {
    alignItems: "center",
  },
  scoreText: {
    color: THEME.white,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 2,
  },
  matchTimeText: {
    color: THEME.danger,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  heroFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },
  heroActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: THEME.white,
    borderRadius: 10,
    paddingVertical: 10,
  },
  heroActionBtnText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "800",
  },

  // QUICK ACTIONS ROW
  quickActionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: THEME.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 12,
    gap: 2,
  },
  quickActionTitle: {
    color: THEME.white,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
  },
  quickActionSub: {
    color: THEME.textSub,
    fontSize: 10,
  },

  // SECTION HEADER
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 6,
  },
  sectionEyebrow: {
    color: THEME.textSub,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  sectionTitle: {
    color: THEME.white,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },
  sectionLink: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },

  // POST CARD
  postCard: {
    backgroundColor: THEME.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 16,
    gap: 10,
  },
  postAuthorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.borderLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  postAvatarText: {
    color: THEME.white,
    fontSize: 12,
    fontWeight: "700",
  },
  postAuthorMeta: {
    flex: 1,
  },
  postAuthorName: {
    color: THEME.white,
    fontSize: 14,
    fontWeight: "700",
  },
  postTime: {
    color: THEME.textSub,
    fontSize: 11,
  },
  postSportBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: THEME.badgeBg,
    borderRadius: 6,
  },
  postSportBadgeText: {
    color: THEME.textMuted,
    fontSize: 9,
    fontWeight: "800",
  },
  postBody: {
    color: THEME.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  postInteractionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },
  postStatBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  postStatText: {
    color: THEME.textSub,
    fontSize: 12,
  },

  // PLAYERS TAB
  tabHeader: {
    gap: 2,
  },
  tabSubtitle: {
    color: THEME.textSub,
    fontSize: 12,
    marginTop: 2,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: THEME.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    color: THEME.white,
    fontSize: 13,
    padding: 0,
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 14,
    gap: 12,
  },
  playerAvatarLarge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  playerAvatarLargeText: {
    color: THEME.white,
    fontSize: 15,
    fontWeight: "800",
  },
  playerInfo: {
    flex: 1,
  },
  playerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  playerName: {
    color: THEME.white,
    fontSize: 15,
    fontWeight: "700",
  },
  playerRole: {
    color: THEME.textMuted,
    fontSize: 12,
    marginTop: 1,
  },
  playerMeta: {
    color: THEME.textSub,
    fontSize: 11,
    marginTop: 2,
  },
  connectBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.borderLight,
    backgroundColor: THEME.badgeBg,
  },
  connectBtnText: {
    color: THEME.white,
    fontSize: 12,
    fontWeight: "700",
  },

  // GAMES TAB
  filterPillsRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  filterPillActive: {
    backgroundColor: THEME.white,
    borderColor: THEME.white,
  },
  filterPillText: {
    color: THEME.textSub,
    fontSize: 11,
    fontWeight: "700",
  },
  filterPillTextActive: {
    color: "#000000",
    fontWeight: "800",
  },
  gameCard: {
    backgroundColor: THEME.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 16,
    gap: 12,
  },
  gameCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gameVenue: {
    color: THEME.textSub,
    fontSize: 11,
  },
  upcomingBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: THEME.badgeBg,
    borderRadius: 4,
  },
  upcomingBadgeText: {
    color: THEME.white,
    fontSize: 10,
    fontWeight: "800",
  },
  gameMatchup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  gameTeamBlock: {
    flex: 1,
  },
  gameTeamName: {
    color: THEME.white,
    fontSize: 15,
    fontWeight: "700",
  },
  gameTeamScore: {
    color: THEME.white,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 2,
  },
  gameTeamSub: {
    color: THEME.textSub,
    fontSize: 11,
    marginTop: 2,
  },
  vsText: {
    color: THEME.textSub,
    fontSize: 12,
    fontWeight: "800",
    marginHorizontal: 12,
  },
  gameCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },
  gameRequirement: {
    color: THEME.textSub,
    fontSize: 11,
    flex: 1,
  },
  gameScoreBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: THEME.white,
    borderRadius: 6,
  },
  gameScoreBtnText: {
    color: "#000000",
    fontSize: 11,
    fontWeight: "800",
  },
  gameReminderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: THEME.badgeBg,
    borderRadius: 6,
  },
  gameReminderBtnText: {
    color: THEME.white,
    fontSize: 11,
    fontWeight: "600",
  },

  // SCORES TAB / CONSOLE
  consoleCard: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 16,
    gap: 14,
  },
  consoleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  matchCodeText: {
    color: THEME.textSub,
    fontSize: 11,
    fontWeight: "600",
  },
  cricketConsole: {
    alignItems: "center",
    paddingVertical: 8,
    gap: 6,
  },
  cricketMainScore: {
    color: THEME.white,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 1,
  },
  cricketOversDisplay: {
    color: THEME.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  scoreButtonsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  scoreActionBtn: {
    width: 52,
    height: 42,
    borderRadius: 8,
    backgroundColor: THEME.border,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreActionBtnText: {
    color: THEME.white,
    fontSize: 15,
    fontWeight: "800",
  },
  scoreActionWicket: {
    backgroundColor: THEME.danger,
  },
  scoreActionReset: {
    width: 60,
    backgroundColor: THEME.badgeBg,
  },
  scoreActionResetText: {
    color: THEME.textSub,
    fontSize: 12,
    fontWeight: "700",
  },
  footballConsole: {
    paddingVertical: 8,
  },
  footballScoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  footballTeamCol: {
    alignItems: "center",
    gap: 6,
  },
  footballTeamName: {
    color: THEME.white,
    fontSize: 14,
    fontWeight: "700",
  },
  footballScoreDigit: {
    color: THEME.white,
    fontSize: 36,
    fontWeight: "900",
  },
  scoreAdjustRow: {
    flexDirection: "row",
    gap: 6,
  },
  adjustBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: THEME.border,
    borderRadius: 6,
  },
  adjustBtnText: {
    color: THEME.white,
    fontSize: 13,
    fontWeight: "800",
  },
  footballCenterCol: {
    alignItems: "center",
  },
  footballColon: {
    color: THEME.textSub,
    fontSize: 28,
    fontWeight: "800",
  },
  footballMinute: {
    color: THEME.danger,
    fontSize: 11,
    fontWeight: "700",
  },
  historyCard: {
    backgroundColor: THEME.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 14,
    gap: 4,
  },
  historyMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historySport: {
    color: THEME.textSub,
    fontSize: 11,
    fontWeight: "700",
  },
  historyDate: {
    color: THEME.textSub,
    fontSize: 11,
  },
  historyTeams: {
    color: THEME.white,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
  },
  historyResult: {
    color: THEME.textMuted,
    fontSize: 12,
    marginTop: 2,
  },

  // PROFILE TAB
  profileCard: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 20,
    alignItems: "center",
    gap: 6,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME.borderLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  profileAvatarText: {
    color: THEME.white,
    fontSize: 20,
    fontWeight: "800",
  },
  profileName: {
    color: THEME.white,
    fontSize: 18,
    fontWeight: "800",
  },
  profileHandle: {
    color: THEME.textSub,
    fontSize: 12,
  },
  profileBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: THEME.badgeBg,
    borderRadius: 12,
    marginTop: 4,
  },
  profileBadgeText: {
    color: THEME.white,
    fontSize: 10,
    fontWeight: "800",
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    color: THEME.white,
    fontSize: 16,
    fontWeight: "800",
  },
  statLabel: {
    color: THEME.textSub,
    fontSize: 10,
    marginTop: 2,
  },
  settingsSection: {
    backgroundColor: THEME.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 16,
    gap: 12,
  },
  settingsHeader: {
    color: THEME.textSub,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 2,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  settingsItemTitle: {
    color: THEME.white,
    fontSize: 13,
    fontWeight: "600",
  },

  // BOTTOM NAVIGATION
  bottomNav: {
    flexDirection: "row",
    backgroundColor: THEME.headerBg,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    height: Platform.OS === "ios" ? 82 : 64,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  navLabel: {
    color: THEME.textSub,
    fontSize: 10,
    fontWeight: "600",
  },
  navLabelActive: {
    color: THEME.white,
    fontWeight: "800",
  },

  // MODAL
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: THEME.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 20,
    gap: 14,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    color: THEME.white,
    fontSize: 17,
    fontWeight: "800",
  },
  modalInput: {
    backgroundColor: THEME.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    color: THEME.white,
    fontSize: 13,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalCancelText: {
    color: THEME.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  modalSubmitBtn: {
    backgroundColor: THEME.white,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalSubmitText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "800",
  },
});

registerRootComponent(App);
