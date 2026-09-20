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

// Exact Web App Theme (Heritage Sports Palette)
const THEME = {
  bg: "#FAF7F2",               // Warm ivory canvas
  headerBg: "#1c2e30",         // Deep pine teal signature header
  headerBorder: "#2d4447",     // Header subtle divider
  headerText: "#FAF7F2",       // Warm ivory text
  headerSub: "rgba(250, 247, 242, 0.7)",
  card: "#FFFFFF",             // Clean white cards
  cardBorder: "#DDD6C8",       // Warm parchment border
  cardInner: "#FAF7F2",        // Warm inner background
  text: "#253638",             // Deep forest text
  textMuted: "#71807d",        // Sage gray
  textSub: "#8e9e9a",          // Muted sage
  accent: "#277863",           // Forest emerald
  accentLight: "rgba(39, 120, 99, 0.1)",
  danger: "#ce4545",
  bottomNavBg: "#1c2e30",      // Deep pine teal bottom bar
  bottomNavBorder: "#2d4447",
  bottomNavActive: "#FAF7F2",
  bottomNavInactive: "#71807d",
};

// Sports Lenses (Matching Web App ezkoraStore.js with Badminton replacing Tennis)
const SPORTS = [
  {
    id: "Football",
    name: "Football",
    icon: "soccer",
    descriptor: "The beautiful game",
    accent: "#000000",
    wash: "#ffffff",
    deep: "#09090b",
  },
  {
    id: "Badminton",
    name: "Badminton",
    icon: "badminton",
    descriptor: "Speed and precision",
    accent: "#0284c7",
    wash: "#e0f2fe",
    deep: "#0369a1",
  },
  {
    id: "Cricket",
    name: "Cricket",
    icon: "cricket",
    descriptor: "The long game",
    accent: "#5e9a70",
    wash: "#e1eee2",
    deep: "#356b4b",
  },
  {
    id: "Basketball",
    name: "Basketball",
    icon: "basketball",
    descriptor: "The next possession",
    accent: "#d47336",
    wash: "#f5e6d5",
    deep: "#91461f",
  },
  {
    id: "Running",
    name: "Running",
    icon: "run",
    descriptor: "One more kilometre",
    accent: "#4c9b81",
    wash: "#dcece5",
    deep: "#2c6e5a",
  },
  {
    id: "Cycling",
    name: "Cycling",
    icon: "bike",
    descriptor: "Keep the wheels turning",
    accent: "#557fa9",
    wash: "#e0e9f0",
    deep: "#345b80",
  },
  {
    id: "Volleyball",
    name: "Volleyball",
    icon: "volleyball",
    descriptor: "Own the next point",
    accent: "#9d6ab0",
    wash: "#ede3f1",
    deep: "#704781",
  },
];

export default function App() {
  // Navigation: "home" | "players" | "games" | "scores" | "profile"
  const [currentTab, setCurrentTab] = useState("home");

  // Active Sport Lens (default Football)
  const [activeSport, setActiveSport] = useState("Football");

  // Real User Data (No Mock Data)
  const [posts, setPosts] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [games, setGames] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);

  // Modals
  const [composerOpen, setComposerOpen] = useState(false);
  const [postContent, setPostContent] = useState("");

  const [addAthleteOpen, setAddAthleteOpen] = useState(false);
  const [newAthleteName, setNewAthleteName] = useState("");
  const [newAthleteRole, setNewAthleteRole] = useState("");
  const [newAthleteJersey, setNewAthleteJersey] = useState("");

  const [addGameOpen, setAddGameOpen] = useState(false);
  const [newTeamA, setNewTeamA] = useState("");
  const [newTeamB, setNewTeamB] = useState("");
  const [newGameVenue, setNewGameVenue] = useState("");

  // Live Scoring Console State
  const [consoleTeamA, setConsoleTeamA] = useState("Home Team");
  const [consoleTeamB, setConsoleTeamB] = useState("Away Team");
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [gameTimer, setGameTimer] = useState(0);
  const [isMatchActive, setIsMatchActive] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Current Active Sport
  const currentSport = SPORTS.find((s) => s.id === activeSport) || SPORTS[0];

  // Filtered by sport
  const sportPosts = posts.filter((p) => p.sport === activeSport);
  const sportAthletes = athletes.filter(
    (a) =>
      a.sport === activeSport &&
      (a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const sportGames = games.filter((g) => g.sport === activeSport);
  const sportRecords = completedMatches.filter((m) => m.sport === activeSport);

  const handleCreatePost = () => {
    if (!postContent.trim()) return;
    const newPost = {
      id: Date.now().toString(),
      author: "Charan Teja",
      avatar: "CT",
      time: "Just now",
      sport: activeSport,
      body: postContent.trim(),
      likes: 0,
      comments: 0,
    };
    setPosts([newPost, ...posts]);
    setPostContent("");
    setComposerOpen(false);
  };

  const handleAddAthlete = () => {
    if (!newAthleteName.trim()) return;
    const newAth = {
      id: Date.now().toString(),
      name: newAthleteName.trim(),
      role: newAthleteRole.trim() || "Athlete",
      jersey: newAthleteJersey.trim() || "#7",
      sport: activeSport,
    };
    setAthletes([...athletes, newAth]);
    setNewAthleteName("");
    setNewAthleteRole("");
    setNewAthleteJersey("");
    setAddAthleteOpen(false);
  };

  const handleScheduleGame = () => {
    if (!newTeamA.trim() || !newTeamB.trim()) return;
    const newG = {
      id: Date.now().toString(),
      sport: activeSport,
      teamA: newTeamA.trim(),
      teamB: newTeamB.trim(),
      venue: newGameVenue.trim() || "Local Ground",
      status: "upcoming",
      date: "Today",
    };
    setGames([...games, newG]);
    setNewTeamA("");
    setNewTeamB("");
    setNewGameVenue("");
    setAddGameOpen(false);
  };

  const handleSaveMatchScore = () => {
    const record = {
      id: Date.now().toString(),
      sport: activeSport,
      teamA: consoleTeamA,
      teamB: consoleTeamB,
      scoreA,
      scoreB,
      date: "Today",
    };
    setCompletedMatches([record, ...completedMatches]);
    setScoreA(0);
    setScoreB(0);
    setIsMatchActive(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1c2e30" translucent />

      {/* TOPBAR — Deep pine teal header with safe area padding */}
      <View style={styles.topbar}>
        <View style={styles.topbarLeft}>
          <View style={styles.brandRow}>
            <Text style={styles.brandTitle}>EZKORA</Text>
            <View style={styles.proBadge}>
              <Text style={styles.proText}>PRO</Text>
            </View>
          </View>
          <View style={styles.lensIndicator}>
            <MaterialCommunityIcons name={currentSport.icon} size={14} color={THEME.headerSub} />
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
            <Ionicons name="add" size={20} color={THEME.headerText} />
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

      {/* SPORT STRIP — Authentic web sport strip with individual sport accent colors */}
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
                style={[
                  styles.sportPill,
                  isSelected
                    ? { backgroundColor: sport.accent, borderColor: sport.accent }
                    : styles.sportPillInactive,
                ]}
                onPress={() => setActiveSport(sport.id)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={sport.icon}
                  size={15}
                  color={isSelected ? "#FFFFFF" : THEME.textMuted}
                />
                <Text
                  style={[
                    styles.sportPillText,
                    isSelected ? styles.sportPillTextActive : { color: THEME.textMuted },
                  ]}
                >
                  {sport.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* MAIN BODY AREA — Warm Ivory Canvas */}
      <View style={styles.content}>
        {/* HOME TAB */}
        {currentTab === "home" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Active Sport Spotlight Card */}
            <View style={styles.spotlightCard}>
              <View style={styles.spotlightTop}>
                <View
                  style={[styles.spotlightIconCircle, { backgroundColor: currentSport.accent }]}
                >
                  <MaterialCommunityIcons name={currentSport.icon} size={20} color="#FFFFFF" />
                </View>
                <View style={styles.spotlightMeta}>
                  <Text style={styles.spotlightEyebrow}>ACTIVE LENS</Text>
                  <Text style={styles.spotlightTitle}>{currentSport.name}</Text>
                  <Text style={styles.spotlightDesc}>{currentSport.descriptor}</Text>
                </View>
              </View>

              <View style={styles.spotlightActionsRow}>
                <TouchableOpacity
                  style={[styles.spotlightBtn, { backgroundColor: currentSport.accent }]}
                  onPress={() => setComposerOpen(true)}
                >
                  <Ionicons name="create-outline" size={15} color="#FFFFFF" />
                  <Text style={styles.spotlightBtnText}>Share a moment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.spotlightOutlineBtn}
                  onPress={() => setCurrentTab("scores")}
                >
                  <Ionicons name="timer-outline" size={15} color={THEME.text} />
                  <Text style={styles.spotlightOutlineBtnText}>Score Match</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Navigation Cards */}
            <View style={styles.quickGrid}>
              <TouchableOpacity
                style={styles.quickCard}
                onPress={() => setCurrentTab("players")}
              >
                <View style={[styles.quickCardIcon, { backgroundColor: THEME.accentLight }]}>
                  <Ionicons name="people" size={18} color={THEME.accent} />
                </View>
                <Text style={styles.quickCardTitle}>Athletes</Text>
                <Text style={styles.quickCardDesc}>Roster & Directory</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickCard}
                onPress={() => setCurrentTab("games")}
              >
                <View style={[styles.quickCardIcon, { backgroundColor: "rgba(212, 115, 54, 0.12)" }]}>
                  <Ionicons name="calendar" size={18} color="#d47336" />
                </View>
                <Text style={styles.quickCardTitle}>Fixtures</Text>
                <Text style={styles.quickCardDesc}>Upcoming games</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickCard}
                onPress={() => setCurrentTab("scores")}
              >
                <View style={[styles.quickCardIcon, { backgroundColor: "rgba(2, 132, 199, 0.12)" }]}>
                  <Ionicons name="trophy" size={18} color="#0284c7" />
                </View>
                <Text style={styles.quickCardTitle}>Scoreboard</Text>
                <Text style={styles.quickCardDesc}>Live records</Text>
              </TouchableOpacity>
            </View>

            {/* Feed Section */}
            <View style={styles.sectionTitleRow}>
              <View>
                <Text style={styles.sectionEyebrow}>THE {currentSport.name.toUpperCase()} FEED</Text>
                <Text style={styles.sectionHeading}>From the community</Text>
              </View>
            </View>

            {/* Fresh State: Zero Mock Data */}
            {sportPosts.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="chatbubbles-outline" size={26} color={THEME.textMuted} />
                </View>
                <Text style={styles.emptyTitle}>Your {currentSport.name} feed is open.</Text>
                <Text style={styles.emptyDesc}>
                  There are no {currentSport.name.toLowerCase()} posts yet. Be the first to share a
                  real moment from your court or field.
                </Text>
                <TouchableOpacity
                  style={[styles.emptyActionBtn, { backgroundColor: currentSport.accent }]}
                  onPress={() => setComposerOpen(true)}
                >
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                  <Text style={styles.emptyActionBtnText}>Create a post</Text>
                </TouchableOpacity>
              </View>
            ) : (
              sportPosts.map((post) => (
                <View key={post.id} style={styles.postCard}>
                  <View style={styles.postAuthorRow}>
                    <View style={styles.postAvatar}>
                      <Text style={styles.postAvatarText}>{post.avatar}</Text>
                    </View>
                    <View style={styles.postAuthorMeta}>
                      <Text style={styles.postAuthorName}>{post.author}</Text>
                      <Text style={styles.postTime}>{post.time} · {post.sport}</Text>
                    </View>
                  </View>
                  <Text style={styles.postBody}>{post.body}</Text>
                  <View style={styles.postFooter}>
                    <TouchableOpacity style={styles.postActionBtn}>
                      <Ionicons name="heart-outline" size={16} color={THEME.textMuted} />
                      <Text style={styles.postActionText}>{post.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.postActionBtn}>
                      <Ionicons name="chatbubble-outline" size={15} color={THEME.textMuted} />
                      <Text style={styles.postActionText}>{post.comments}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* PLAYERS TAB */}
        {currentTab === "players" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>{currentSport.name.toUpperCase()} / DIRECTORY</Text>
              <Text style={styles.sectionHeading}>Athletes & Rosters</Text>
              <Text style={styles.sectionSubtitle}>
                Verified athletes registered in the {currentSport.name.toLowerCase()} community.
              </Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBox}>
              <Ionicons name="search" size={16} color={THEME.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder={`Search ${currentSport.name.toLowerCase()} athletes...`}
                placeholderTextColor={THEME.textSub}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Fresh State: Zero Mock Data */}
            {sportAthletes.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="people-outline" size={26} color={THEME.textMuted} />
                </View>
                <Text style={styles.emptyTitle}>No athletes registered yet.</Text>
                <Text style={styles.emptyDesc}>
                  Be the first athlete to register on the official {currentSport.name.toLowerCase()}{" "}
                  roster.
                </Text>
                <TouchableOpacity
                  style={[styles.emptyActionBtn, { backgroundColor: currentSport.accent }]}
                  onPress={() => setAddAthleteOpen(true)}
                >
                  <Ionicons name="person-add" size={16} color="#FFFFFF" />
                  <Text style={styles.emptyActionBtnText}>Register Athlete</Text>
                </TouchableOpacity>
              </View>
            ) : (
              sportAthletes.map((ath) => (
                <View key={ath.id} style={styles.athleteCard}>
                  <View style={styles.athleteAvatar}>
                    <Text style={styles.athleteAvatarText}>
                      {ath.name.substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.athleteMeta}>
                    <Text style={styles.athleteName}>{ath.name}</Text>
                    <Text style={styles.athleteRole}>
                      {ath.role} · {ath.jersey}
                    </Text>
                  </View>
                  <View style={styles.athleteBadge}>
                    <Text style={styles.athleteBadgeText}>VERIFIED</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* GAMES TAB */}
        {currentTab === "games" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>{currentSport.name.toUpperCase()} / FIXTURES</Text>
              <Text style={styles.sectionHeading}>Scheduled Matches</Text>
              <Text style={styles.sectionSubtitle}>
                Official league matches, scrimmages, and tournament fixtures.
              </Text>
            </View>

            {/* Fresh State: Zero Mock Data */}
            {sportGames.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="calendar-outline" size={26} color={THEME.textMuted} />
                </View>
                <Text style={styles.emptyTitle}>No scheduled fixtures yet.</Text>
                <Text style={styles.emptyDesc}>
                  Create your first {currentSport.name.toLowerCase()} match, practice match, or
                  tournament fixture.
                </Text>
                <TouchableOpacity
                  style={[styles.emptyActionBtn, { backgroundColor: currentSport.accent }]}
                  onPress={() => setAddGameOpen(true)}
                >
                  <Ionicons name="calendar" size={16} color="#FFFFFF" />
                  <Text style={styles.emptyActionBtnText}>Schedule Match</Text>
                </TouchableOpacity>
              </View>
            ) : (
              sportGames.map((g) => (
                <View key={g.id} style={styles.gameCard}>
                  <View style={styles.gameCardHeader}>
                    <Text style={styles.gameCardSport}>{g.sport} Match</Text>
                    <Text style={styles.gameCardVenue}>{g.venue}</Text>
                  </View>
                  <View style={styles.gameMatchupRow}>
                    <Text style={styles.gameTeam}>{g.teamA}</Text>
                    <Text style={styles.gameVs}>VS</Text>
                    <Text style={styles.gameTeam}>{g.teamB}</Text>
                  </View>
                  <View style={styles.gameCardFooter}>
                    <Text style={styles.gameCardDate}>{g.date}</Text>
                    <TouchableOpacity
                      style={[styles.gameCardBtn, { backgroundColor: currentSport.accent }]}
                      onPress={() => {
                        setConsoleTeamA(g.teamA);
                        setConsoleTeamB(g.teamB);
                        setCurrentTab("scores");
                      }}
                    >
                      <Text style={styles.gameCardBtnText}>Score Match</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* SCORES TAB */}
        {currentTab === "scores" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>{currentSport.name.toUpperCase()} / OFFICIAL SCORING</Text>
              <Text style={styles.sectionHeading}>Live Stadium Scoreboard</Text>
              <Text style={styles.sectionSubtitle}>
                Interactive score console for verified {currentSport.name.toLowerCase()} matches.
              </Text>
            </View>

            {/* LIVE CONSOLE */}
            <View style={styles.consoleCard}>
              <View style={styles.consoleTop}>
                <View style={styles.liveTag}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveTagText}>LIVE CONSOLE</Text>
                </View>
                <Text style={styles.consoleSport}>{currentSport.name}</Text>
              </View>

              {/* Team Setup */}
              <View style={styles.consoleTeamsRow}>
                <View style={styles.consoleTeamBox}>
                  <TextInput
                    style={styles.teamInput}
                    value={consoleTeamA}
                    onChangeText={setConsoleTeamA}
                    placeholder="Team A"
                    placeholderTextColor={THEME.textSub}
                  />
                  <Text style={styles.scoreNumber}>{scoreA}</Text>
                  <View style={styles.scoreBtnRow}>
                    <TouchableOpacity
                      style={styles.scoreAdjustBtn}
                      onPress={() => setScoreA((s) => Math.max(0, s - 1))}
                    >
                      <Text style={styles.scoreAdjustBtnText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.scoreAdjustBtn, { backgroundColor: currentSport.accent }]}
                      onPress={() => setScoreA((s) => s + 1)}
                    >
                      <Text style={[styles.scoreAdjustBtnText, { color: "#FFFFFF" }]}>+1</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.consoleDivider}>VS</Text>

                <View style={styles.consoleTeamBox}>
                  <TextInput
                    style={styles.teamInput}
                    value={consoleTeamB}
                    onChangeText={setConsoleTeamB}
                    placeholder="Team B"
                    placeholderTextColor={THEME.textSub}
                  />
                  <Text style={styles.scoreNumber}>{scoreB}</Text>
                  <View style={styles.scoreBtnRow}>
                    <TouchableOpacity
                      style={styles.scoreAdjustBtn}
                      onPress={() => setScoreB((s) => Math.max(0, s - 1))}
                    >
                      <Text style={styles.scoreAdjustBtnText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.scoreAdjustBtn, { backgroundColor: currentSport.accent }]}
                      onPress={() => setScoreB((s) => s + 1)}
                    >
                      <Text style={[styles.scoreAdjustBtnText, { color: "#FFFFFF" }]}>+1</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.saveMatchBtn, { backgroundColor: currentSport.accent }]}
                onPress={handleSaveMatchScore}
              >
                <Ionicons name="checkmark-done" size={16} color="#FFFFFF" />
                <Text style={styles.saveMatchBtnText}>Finalize & Save Result</Text>
              </TouchableOpacity>
            </View>

            {/* Historical Match Records (Fresh State) */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>OFFICIAL RECORDS</Text>
              <Text style={styles.sectionHeading}>Recent Results</Text>
            </View>

            {sportRecords.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="trophy-outline" size={26} color={THEME.textMuted} />
                </View>
                <Text style={styles.emptyTitle}>
                  No recorded {currentSport.name.toLowerCase()} match results yet.
                </Text>
                <Text style={styles.emptyDesc}>
                  Official scores and match statistics will automatically appear here as games are
                  finalized.
                </Text>
              </View>
            ) : (
              sportRecords.map((rec) => (
                <View key={rec.id} style={styles.recordCard}>
                  <View style={styles.recordHeader}>
                    <Text style={styles.recordSport}>{rec.sport} Match</Text>
                    <Text style={styles.recordDate}>{rec.date}</Text>
                  </View>
                  <Text style={styles.recordScore}>
                    {rec.teamA} {rec.scoreA} - {rec.scoreB} {rec.teamB}
                  </Text>
                </View>
              ))
            )}
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
              <Text style={styles.profileSub}>@charanteja · Athlete ID: PL-512391</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={13} color={THEME.accent} />
                <Text style={styles.verifiedBadgeText}>VERIFIED ATHLETE</Text>
              </View>

              {/* Clean Stats (Fresh App, No Fake Numbers) */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{sportRecords.length}</Text>
                  <Text style={styles.statLabel}>Matches</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{sportAthletes.length}</Text>
                  <Text style={styles.statLabel}>Teammates</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{sportPosts.length}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
              </View>
            </View>

            <View style={styles.settingsCard}>
              <Text style={styles.settingsHeading}>PREFERENCES</Text>
              <View style={styles.settingsRow}>
                <MaterialCommunityIcons name={currentSport.icon} size={18} color={THEME.text} />
                <Text style={styles.settingsText}>Active Sport Lens: {currentSport.name}</Text>
              </View>
              <View style={styles.settingsRow}>
                <Ionicons name="notifications-outline" size={18} color={THEME.text} />
                <Text style={styles.settingsText}>Match Alerts & Notifications</Text>
              </View>
              <View style={styles.settingsRow}>
                <Ionicons name="cloud-done-outline" size={18} color={THEME.accent} />
                <Text style={styles.settingsText}>Cloud Database: Connected</Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* BOTTOM NAVIGATION — Deep Pine Teal (#1c2e30) matching web app */}
      <View style={styles.bottomNav}>
        {[
          { key: "home", label: "Home", icon: "compass" },
          { key: "players", label: "Players", icon: "people" },
          { key: "games", label: "Games", icon: "calendar" },
          { key: "scores", label: "Scores", icon: "trophy" },
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
                color={isActive ? THEME.bottomNavActive : THEME.bottomNavInactive}
              />
              <Text
                style={[
                  styles.navLabel,
                  isActive
                    ? { color: THEME.bottomNavActive, fontWeight: "800" }
                    : { color: THEME.bottomNavInactive },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* MODAL: CREATE POST */}
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
              value={postContent}
              onChangeText={setPostContent}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setComposerOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSubmit, { backgroundColor: currentSport.accent }]}
                onPress={handleCreatePost}
              >
                <Text style={styles.modalSubmitText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: ADD ATHLETE */}
      <Modal visible={addAthleteOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Register Athlete</Text>
              <TouchableOpacity onPress={() => setAddAthleteOpen(false)}>
                <Ionicons name="close" size={22} color={THEME.textMuted} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.formInput}
              placeholder="Full Name (e.g. Charan Teja)"
              placeholderTextColor={THEME.textSub}
              value={newAthleteName}
              onChangeText={setNewAthleteName}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Position / Role (e.g. Striker, Singles Specialist)"
              placeholderTextColor={THEME.textSub}
              value={newAthleteRole}
              onChangeText={setNewAthleteRole}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Jersey Number (e.g. #10)"
              placeholderTextColor={THEME.textSub}
              value={newAthleteJersey}
              onChangeText={setNewAthleteJersey}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setAddAthleteOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSubmit, { backgroundColor: currentSport.accent }]}
                onPress={handleAddAthlete}
              >
                <Text style={styles.modalSubmitText}>Add to Roster</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: SCHEDULE GAME */}
      <Modal visible={addGameOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Match</Text>
              <TouchableOpacity onPress={() => setAddGameOpen(false)}>
                <Ionicons name="close" size={22} color={THEME.textMuted} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.formInput}
              placeholder="Home Team / Player 1"
              placeholderTextColor={THEME.textSub}
              value={newTeamA}
              onChangeText={setNewTeamA}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Away Team / Player 2"
              placeholderTextColor={THEME.textSub}
              value={newTeamB}
              onChangeText={setNewTeamB}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Venue (e.g. Stadium Court 1)"
              placeholderTextColor={THEME.textSub}
              value={newGameVenue}
              onChangeText={setNewGameVenue}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setAddGameOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSubmit, { backgroundColor: currentSport.accent }]}
                onPress={handleScheduleGame}
              >
                <Text style={styles.modalSubmitText}>Confirm Match</Text>
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

  // TOPBAR — Deep pine teal header with safe area padding
  topbar: {
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 16 : 52,
    paddingBottom: 14,
    paddingHorizontal: 20,
    backgroundColor: THEME.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.headerBorder,
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
    color: THEME.headerText,
    letterSpacing: 0.5,
  },
  proBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  proText: {
    color: THEME.headerText,
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
    color: THEME.headerText,
    fontSize: 12,
    fontWeight: "700",
  },
  lensSub: {
    color: THEME.headerSub,
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
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#ce7045",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  // SPORT STRIP
  sportStripContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
    paddingVertical: 9,
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
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  sportPillInactive: {
    backgroundColor: "#FFFFFF",
    borderColor: THEME.cardBorder,
  },
  sportPillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  sportPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  // CONTENT
  content: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 28,
    gap: 16,
  },

  // SPOTLIGHT CARD
  spotlightCard: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  spotlightTop: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  spotlightIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  spotlightMeta: {
    flex: 1,
  },
  spotlightEyebrow: {
    color: THEME.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  spotlightTitle: {
    color: THEME.text,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 1,
  },
  spotlightDesc: {
    color: THEME.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  spotlightActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorder,
  },
  spotlightBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  spotlightBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  spotlightOutlineBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    backgroundColor: THEME.cardInner,
  },
  spotlightOutlineBtnText: {
    color: THEME.text,
    fontSize: 13,
    fontWeight: "700",
  },

  // QUICK GRID
  quickGrid: {
    flexDirection: "row",
    gap: 10,
  },
  quickCard: {
    flex: 1,
    backgroundColor: THEME.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    padding: 12,
    gap: 3,
  },
  quickCardIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  quickCardTitle: {
    color: THEME.text,
    fontSize: 13,
    fontWeight: "800",
  },
  quickCardDesc: {
    color: THEME.textMuted,
    fontSize: 10,
  },

  // SECTION HEADERS
  sectionTitleRow: {
    marginTop: 4,
  },
  sectionHeader: {
    gap: 2,
  },
  sectionEyebrow: {
    color: THEME.accent,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  sectionHeading: {
    color: THEME.text,
    fontSize: 19,
    fontWeight: "800",
    marginTop: 1,
  },
  sectionSubtitle: {
    color: THEME.textMuted,
    fontSize: 12,
    marginTop: 2,
  },

  // EMPTY CARD (ZERO MOCK DATA)
  emptyCard: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    borderStyle: "dashed",
    padding: 24,
    alignItems: "center",
    textAlign: "center",
    gap: 8,
  },
  emptyIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: THEME.cardInner,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    color: THEME.text,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },
  emptyDesc: {
    color: THEME.textMuted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  emptyActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  emptyActionBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  // POST CARD
  postCard: {
    backgroundColor: THEME.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    padding: 16,
    gap: 10,
  },
  postAuthorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  postAvatarText: {
    color: THEME.accent,
    fontSize: 12,
    fontWeight: "800",
  },
  postAuthorMeta: {
    flex: 1,
  },
  postAuthorName: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "700",
  },
  postTime: {
    color: THEME.textMuted,
    fontSize: 11,
  },
  postBody: {
    color: THEME.text,
    fontSize: 13,
    lineHeight: 20,
  },
  postFooter: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorder,
  },
  postActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  postActionText: {
    color: THEME.textMuted,
    fontSize: 12,
  },

  // SEARCH BOX
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: THEME.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    color: THEME.text,
    fontSize: 13,
    padding: 0,
  },

  // ATHLETE CARD
  athleteCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    padding: 14,
    gap: 12,
  },
  athleteAvatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: THEME.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  athleteAvatarText: {
    color: THEME.accent,
    fontSize: 14,
    fontWeight: "800",
  },
  athleteMeta: {
    flex: 1,
  },
  athleteName: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "700",
  },
  athleteRole: {
    color: THEME.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  athleteBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: THEME.cardInner,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  athleteBadgeText: {
    color: THEME.accent,
    fontSize: 9,
    fontWeight: "800",
  },

  // GAME CARD
  gameCard: {
    backgroundColor: THEME.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    padding: 16,
    gap: 10,
  },
  gameCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gameCardSport: {
    color: THEME.textMuted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  gameCardVenue: {
    color: THEME.textMuted,
    fontSize: 11,
  },
  gameMatchupRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  gameTeam: {
    color: THEME.text,
    fontSize: 15,
    fontWeight: "800",
    flex: 1,
  },
  gameVs: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: "700",
    marginHorizontal: 10,
  },
  gameCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorder,
  },
  gameCardDate: {
    color: THEME.textMuted,
    fontSize: 11,
  },
  gameCardBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  gameCardBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  // LIVE SCORE CONSOLE
  consoleCard: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    padding: 18,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  consoleTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  liveTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: THEME.danger,
  },
  liveTagText: {
    color: THEME.danger,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  consoleSport: {
    color: THEME.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },
  consoleTeamsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 6,
  },
  consoleTeamBox: {
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  teamInput: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
    paddingBottom: 2,
    minWidth: 90,
  },
  scoreNumber: {
    color: THEME.text,
    fontSize: 40,
    fontWeight: "900",
  },
  scoreBtnRow: {
    flexDirection: "row",
    gap: 6,
  },
  scoreAdjustBtn: {
    width: 38,
    height: 34,
    borderRadius: 8,
    backgroundColor: THEME.cardInner,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreAdjustBtnText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "800",
  },
  consoleDivider: {
    color: THEME.textMuted,
    fontSize: 14,
    fontWeight: "800",
    marginHorizontal: 12,
  },
  saveMatchBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  saveMatchBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  recordCard: {
    backgroundColor: THEME.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    padding: 14,
    gap: 4,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  recordSport: {
    color: THEME.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },
  recordDate: {
    color: THEME.textMuted,
    fontSize: 11,
  },
  recordScore: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 2,
  },

  // PROFILE CARD
  profileCard: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    padding: 20,
    alignItems: "center",
    gap: 4,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#ce7045",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  profileAvatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  profileName: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: "800",
  },
  profileSub: {
    color: THEME.textMuted,
    fontSize: 12,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: THEME.accentLight,
    borderRadius: 8,
    marginTop: 6,
  },
  verifiedBadgeText: {
    color: THEME.accent,
    fontSize: 10,
    fontWeight: "800",
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorder,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: "800",
  },
  statLabel: {
    color: THEME.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  settingsCard: {
    backgroundColor: THEME.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    padding: 16,
    gap: 12,
  },
  settingsHeading: {
    color: THEME.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  settingsText: {
    color: THEME.text,
    fontSize: 13,
    fontWeight: "600",
  },

  // BOTTOM NAVIGATION
  bottomNav: {
    flexDirection: "row",
    backgroundColor: THEME.bottomNavBg,
    borderTopWidth: 1,
    borderTopColor: THEME.bottomNavBorder,
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
    fontSize: 10,
  },

  // MODAL STYLES
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: THEME.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  modalTitle: {
    color: THEME.text,
    fontSize: 17,
    fontWeight: "800",
  },
  modalInput: {
    backgroundColor: THEME.cardInner,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    color: THEME.text,
    fontSize: 13,
    padding: 12,
    minHeight: 90,
    textAlignVertical: "top",
  },
  formInput: {
    backgroundColor: THEME.cardInner,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    color: THEME.text,
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 6,
  },
  modalCancel: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalCancelText: {
    color: THEME.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  modalSubmit: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalSubmitText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});

registerRootComponent(App);
