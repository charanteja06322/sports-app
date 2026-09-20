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
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Exact Web App Signature Colors
const THEME = {
  bg: "#FAF7F2",               // Warm ivory paper canvas
  headerBg: "#1c2e30",         // Deep pine teal header
  headerBorder: "#2d4447",     // Header border
  headerText: "#FAF7F2",       // Warm ivory text
  headerSub: "rgba(250, 247, 242, 0.75)",
  card: "#FFFFFF",             // Clean white cards
  cardBorder: "#DDD6C8",       // Warm parchment border
  cardInner: "#FAF7F2",        // Inner background
  text: "#253638",             // Deep forest charcoal
  textMuted: "#71807d",        // Sage gray
  textSub: "#8e9e9a",          // Light sage
  accent: "#277863",           // Forest emerald
  accentLight: "rgba(39, 120, 99, 0.12)",
  danger: "#ce4545",
  dangerLight: "rgba(206, 69, 69, 0.1)",
  warning: "#d47336",
  bottomNavBg: "#1c2e30",
  bottomNavBorder: "#2d4447",
  bottomNavActive: "#FAF7F2",
  bottomNavInactive: "#71807d",
};

// Sports Lenses (Badminton updated to Vibrant Crimson #e11d48 - No blue!)
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
    accent: "#e11d48", // Vibrant Crimson (No blue)
    wash: "#ffe4e6",
    deep: "#9f1239",
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

  // Active Sport Lens
  const [activeSport, setActiveSport] = useState("Football");
  const currentSport = SPORTS.find((s) => s.id === activeSport) || SPORTS[0];

  // User Identity
  const currentUser = {
    name: "Charan Teja",
    handle: "@charanteja",
    playerId: "PL-512391",
    avatar: "CT",
  };

  // --- PLAYERS & FRIENDS STATE (Clean slate, zero mock data) ---
  const [playerSubTab, setPlayerSubTab] = useState("friends"); // "friends" | "invites"
  const [friends, setFriends] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);

  // Modals for Friends
  const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);
  const [inputFriendId, setInputFriendId] = useState("");
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [scanQrOpen, setScanQrOpen] = useState(false);
  const [scannedCode, setScannedCode] = useState("");

  // Chat Modal State
  const [activeChatFriend, setActiveChatFriend] = useState(null);
  const [chatInputText, setChatInputText] = useState("");

  // --- POSTS (FEED) STATE ---
  const [posts, setPosts] = useState([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [postText, setPostText] = useState("");

  // --- GAMES STATE ---
  const [games, setGames] = useState([]);
  const [gameFilter, setGameFilter] = useState("all");
  const [addGameOpen, setAddGameOpen] = useState(false);
  const [newTeamA, setNewTeamA] = useState("");
  const [newTeamB, setNewTeamB] = useState("");
  const [newVenue, setNewVenue] = useState("");

  // --- EASY SCORING CONSOLE STATE (Inspired by WhatsApp Designs) ---
  // Cricket Scoring
  const [cricketRuns, setCricketRuns] = useState(0);
  const [cricketWickets, setCricketWickets] = useState(0);
  const [cricketBallsInOver, setCricketBallsInOver] = useState(0);
  const [cricketOverCount, setCricketOverCount] = useState(0);
  const [overTimeline, setOverTimeline] = useState([]);
  const [strikerName, setStrikerName] = useState("Player 1");
  const [strikerRuns, setStrikerRuns] = useState(0);
  const [strikerBalls, setStrikerBalls] = useState(0);
  const [nonStrikerName, setNonStrikerName] = useState("Player 2");
  const [nonStrikerRuns, setNonStrikerRuns] = useState(0);
  const [nonStrikerBalls, setNonStrikerBalls] = useState(0);
  const [bowlerName, setBowlerName] = useState("Bowler");
  const [bowlerOvers, setBowlerOvers] = useState("0.0");
  const [bowlerRunsGiven, setBowlerRunsGiven] = useState(0);
  const [bowlerWickets, setBowlerWickets] = useState(0);

  // Badminton Scoring (No Blue, Speed & Precision)
  const [badmintonP1, setBadmintonP1] = useState("Player 1");
  const [badmintonP2, setBadmintonP2] = useState("Player 2");
  const [badmintonScore1, setBadmintonScore1] = useState(0);
  const [badmintonScore2, setBadmintonScore2] = useState(0);
  const [badmintonSet, setBadmintonSet] = useState(1);
  const [badmintonServer, setBadmintonServer] = useState(1);
  const [badmintonCourt, setBadmintonCourt] = useState("Right Court (Even)");

  // Football Scoring
  const [footballTeamA, setFootballTeamA] = useState("Home FC");
  const [footballTeamB, setFootballTeamB] = useState("Away FC");
  const [footballScoreA, setFootballScoreA] = useState(0);
  const [footballScoreB, setFootballScoreB] = useState(0);
  const [footballMinute, setFootballMinute] = useState(0);
  const [footballEvents, setFootballEvents] = useState([]);

  // Running Telemetry State (Steps, Distance, Target, Trend - Clean slate)
  const [runDistance, setRunDistance] = useState(0.0);
  const [runSteps, setRunSteps] = useState(0);
  const [runTarget, setRunTarget] = useState(10.0);
  const [runPace, setRunPace] = useState("0'00\"");
  const [runCalories, setRunCalories] = useState(0);

  // Cycling Telemetry State (Distance, Target, Elevation, Speed - Clean slate)
  const [cycleDistance, setCycleDistance] = useState(0.0);
  const [cycleTarget, setCycleTarget] = useState(35.0);
  const [cycleSpeed, setCycleSpeed] = useState(0.0);
  const [cycleElevation, setCycleElevation] = useState(0);
  const [cycleCalories, setCycleCalories] = useState(0);

  // Basketball Scoring
  const [bballTeamA, setBballTeamA] = useState("Warriors");
  const [bballTeamB, setBballTeamB] = useState("Lakers");
  const [bballScoreA, setBballScoreA] = useState(0);
  const [bballScoreB, setBballScoreB] = useState(0);
  const [bballQuarter, setBballQuarter] = useState(1);

  // Volleyball Scoring
  const [vballTeamA, setVballTeamA] = useState("Spikers");
  const [vballTeamB, setVballTeamB] = useState("Blockers");
  const [vballScoreA, setVballScoreA] = useState(0);
  const [vballScoreB, setVballScoreB] = useState(0);
  const [vballSet, setVballSet] = useState(1);

  // Completed Match Records
  const [matchRecords, setMatchRecords] = useState([]);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------

  // Add Friend by Player ID
  const handleAddFriendById = () => {
    const trimmed = inputFriendId.trim().toUpperCase();
    if (!trimmed) return;
    if (friends.some((f) => f.playerId === trimmed)) {
      Alert.alert("Already Friends", "This athlete is already in your friends list.");
      return;
    }
    const newFriend = {
      id: Date.now().toString(),
      name: `Athlete (${trimmed})`,
      playerId: trimmed,
      role: `${activeSport} Player`,
      sport: activeSport,
      online: true,
      messages: [
        { sender: "them", text: "Connected! Let's organize a game sometime.", time: "Just now" },
      ],
    };
    setFriends([newFriend, ...friends]);
    setInputFriendId("");
    setAddFriendModalOpen(false);
    Alert.alert("Friend Added!", `Connected with ${trimmed}. You can now chat directly.`);
  };

  // Add friend via QR Code scan
  const handleAddScannedFriend = () => {
    const code = scannedCode.trim() || "PL-992014";
    const newFriend = {
      id: Date.now().toString(),
      name: "Scanned Athlete",
      playerId: code,
      role: `${activeSport} Player`,
      sport: activeSport,
      online: true,
      messages: [
        { sender: "them", text: "Hey! Scanned your QR code at the stadium.", time: "Just now" },
      ],
    };
    setFriends([newFriend, ...friends]);
    setScannedCode("");
    setScanQrOpen(false);
    Alert.alert("QR Code Verified", `Successfully added ${code} to your friends.`);
  };

  // Accept Invite
  const handleAcceptInvite = (invite) => {
    setPendingInvites(pendingInvites.filter((inv) => inv.id !== invite.id));
    const newFriend = {
      id: Date.now().toString(),
      name: invite.name,
      playerId: invite.playerId,
      role: invite.role,
      sport: invite.sport,
      online: true,
      messages: [{ sender: "them", text: "Thanks for accepting! When are we playing?", time: "Just now" }],
    };
    setFriends([newFriend, ...friends]);
  };

  // Chat Send
  const handleSendMessage = () => {
    if (!chatInputText.trim() || !activeChatFriend) return;
    const newMsg = {
      sender: "me",
      text: chatInputText.trim(),
      time: "Just now",
    };
    const updated = friends.map((f) => {
      if (f.id === activeChatFriend.id) {
        return { ...f, messages: [...f.messages, newMsg] };
      }
      return f;
    });
    setFriends(updated);
    setActiveChatFriend({
      ...activeChatFriend,
      messages: [...activeChatFriend.messages, newMsg],
    });
    setChatInputText("");
  };

  // Send Match Challenge in Chat
  const handleSendMatchChallenge = () => {
    if (!activeChatFriend) return;
    const challengeMsg = {
      sender: "me",
      text: `🏆 MATCH CHALLENGE: Let's play a ${activeSport} fixture! Tap to accept and set venue.`,
      time: "Just now",
      isChallenge: true,
    };
    const updated = friends.map((f) => {
      if (f.id === activeChatFriend.id) {
        return { ...f, messages: [...f.messages, challengeMsg] };
      }
      return f;
    });
    setFriends(updated);
    setActiveChatFriend({
      ...activeChatFriend,
      messages: [...activeChatFriend.messages, challengeMsg],
    });
  };

  // Cricket Scoring Logic
  const handleCricketBall = (type) => {
    let runs = 0;
    let ballLabel = type;

    if (type === "W") {
      setCricketWickets((w) => Math.min(10, w + 1));
      setBowlerWickets((bw) => bw + 1);
      setStrikerBalls((b) => b + 1);
    } else if (type === "WD" || type === "NB") {
      setCricketRuns((r) => r + 1);
      setBowlerRunsGiven((br) => br + 1);
      // Extras do not count as a legal ball in over
      setOverTimeline([...overTimeline, type]);
      return;
    } else {
      runs = parseInt(type, 10) || 0;
      setCricketRuns((r) => r + runs);
      setStrikerRuns((sr) => sr + runs);
      setStrikerBalls((sb) => sb + 1);
      setBowlerRunsGiven((br) => br + runs);

      // Strike rotation on odd runs
      if (runs % 2 !== 0) {
        swapCricketStrike();
      }
    }

    const nextBallsInOver = cricketBallsInOver + 1;
    setOverTimeline([...overTimeline, ballLabel]);

    if (nextBallsInOver >= 6) {
      setCricketOverCount((o) => o + 1);
      setCricketBallsInOver(0);
      setBowlerOvers(`${cricketOverCount + 1}.0`);
      setOverTimeline([]);
      swapCricketStrike(); // Automatic strike rotation at end of over
    } else {
      setCricketBallsInOver(nextBallsInOver);
      setBowlerOvers(`${cricketOverCount}.${nextBallsInOver}`);
    }
  };

  const swapCricketStrike = () => {
    const tempName = strikerName;
    const tempRuns = strikerRuns;
    const tempBalls = strikerBalls;

    setStrikerName(nonStrikerName);
    setStrikerRuns(nonStrikerRuns);
    setStrikerBalls(nonStrikerBalls);

    setNonStrikerName(tempName);
    setNonStrikerRuns(tempRuns);
    setNonStrikerBalls(tempBalls);
  };

  const undoCricketBall = () => {
    if (overTimeline.length === 0) return;
    const last = overTimeline[overTimeline.length - 1];
    setOverTimeline(overTimeline.slice(0, -1));
    if (last === "W") {
      setCricketWickets((w) => Math.max(0, w - 1));
    } else if (last === "WD" || last === "NB") {
      setCricketRuns((r) => Math.max(0, r - 1));
    } else {
      const r = parseInt(last, 10) || 0;
      setCricketRuns((prev) => Math.max(0, prev - r));
      setStrikerRuns((sr) => Math.max(0, sr - r));
    }
    setCricketBallsInOver((b) => Math.max(0, b - 1));
  };

  // Badminton Point Logic
  const handleBadmintonPoint = (playerNum) => {
    if (playerNum === 1) {
      const nextScore = badmintonScore1 + 1;
      setBadmintonScore1(nextScore);
      setBadmintonServer(1);
      setBadmintonCourt(nextScore % 2 === 0 ? "Right Court (Even)" : "Left Court (Odd)");
    } else {
      const nextScore = badmintonScore2 + 1;
      setBadmintonScore2(nextScore);
      setBadmintonServer(2);
      setBadmintonCourt(nextScore % 2 === 0 ? "Right Court (Even)" : "Left Court (Odd)");
    }
  };

  // Finalize Match or Log Session and Save to Records
  const handleFinalizeMatch = () => {
    let summary = "";
    if (activeSport === "Cricket") {
      summary = `${cricketRuns}/${cricketWickets} in ${cricketOverCount}.${cricketBallsInOver} overs`;
    } else if (activeSport === "Badminton") {
      summary = `${badmintonP1} ${badmintonScore1} - ${badmintonScore2} ${badmintonP2} (Set ${badmintonSet})`;
    } else if (activeSport === "Running") {
      summary = `${runDistance.toFixed(2)} km covered · ${runSteps.toLocaleString()} steps · Pace: ${runPace} · ${runCalories} kcal`;
    } else if (activeSport === "Cycling") {
      summary = `${cycleDistance.toFixed(1)} km ride · +${cycleElevation}m elev · Speed: ${cycleSpeed} km/h · ${cycleCalories} kcal`;
    } else if (activeSport === "Basketball") {
      summary = `${bballTeamA} ${bballScoreA} - ${bballScoreB} ${bballTeamB} (Q${bballQuarter})`;
    } else if (activeSport === "Volleyball") {
      summary = `${vballTeamA} ${vballScoreA} - ${vballScoreB} ${vballTeamB} (Set ${vballSet})`;
    } else {
      summary = `${footballTeamA} ${footballScoreA} - ${footballScoreB} ${footballTeamB}`;
    }

    const isEndurance = activeSport === "Running" || activeSport === "Cycling";

    const record = {
      id: Date.now().toString(),
      sport: activeSport,
      summary,
      date: "Today",
      finalizedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMatchRecords([record, ...matchRecords]);
    Alert.alert(
      isEndurance ? "Activity Logged!" : "Match Finalized!",
      isEndurance
        ? `Session logged and added to your official ${activeSport} activity records.`
        : `Official score record saved to ${activeSport} archives.`
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1c2e30" translucent />

      {/* TOPBAR — Deep pine teal (#1c2e30) with safe area margin */}
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
            onPress={() => setQrModalOpen(true)}
          >
            <Ionicons name="qr-code-outline" size={19} color={THEME.headerText} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={() => setAddFriendModalOpen(true)}
          >
            <Ionicons name="person-add-outline" size={18} color={THEME.headerText} />
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

      {/* SPORT STRIP — Web-aligned selector with distinct sport colors (Badminton #e11d48) */}
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

      {/* MAIN SCREEN BODY */}
      <View style={styles.content}>
        {/* ==================================================== */}
        {/* TAB 1: HOME */}
        {/* ==================================================== */}
        {currentTab === "home" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Live Easy Scoring Spotlight Banner */}
            <View style={styles.spotlightCard}>
              <View style={styles.spotlightTop}>
                <View
                  style={[styles.spotlightIconCircle, { backgroundColor: currentSport.accent }]}
                >
                  <MaterialCommunityIcons name={currentSport.icon} size={20} color="#FFFFFF" />
                </View>
                <View style={styles.spotlightMeta}>
                  <Text style={styles.spotlightEyebrow}>
                    {activeSport === "Running"
                      ? "ENDURANCE & PEDOMETER"
                      : activeSport === "Cycling"
                      ? "VELO TELEMETRY & ELEVATION"
                      : "EASY SCORING READY"}
                  </Text>
                  <Text style={styles.spotlightTitle}>
                    {activeSport === "Running"
                      ? "Running & Step Tracker"
                      : activeSport === "Cycling"
                      ? "Cycling & Elevation Tracker"
                      : `${currentSport.name} Match Console`}
                  </Text>
                  <Text style={styles.spotlightDesc}>
                    {activeSport === "Running"
                      ? `${runDistance.toFixed(2)} km covered · ${runSteps.toLocaleString()} steps · Target: ${runTarget.toFixed(1)} km (${Math.min(100, Math.round((runDistance / runTarget) * 100))}%)`
                      : activeSport === "Cycling"
                      ? `${cycleDistance.toFixed(1)} km ride · +${cycleElevation}m elev · Target: ${cycleTarget.toFixed(0)} km (${Math.min(100, Math.round((cycleDistance / cycleTarget) * 100))}%)`
                      : "Ball-by-ball, point tracking, and live striker stats."}
                  </Text>
                </View>
              </View>

              <View style={styles.spotlightActionsRow}>
                <TouchableOpacity
                  style={[styles.spotlightBtn, { backgroundColor: currentSport.accent }]}
                  onPress={() => setCurrentTab("scores")}
                >
                  <Ionicons
                    name={activeSport === "Running" || activeSport === "Cycling" ? "stats-chart" : "game-controller"}
                    size={15}
                    color="#FFFFFF"
                  />
                  <Text style={styles.spotlightBtnText}>
                    {activeSport === "Running"
                      ? "Open Telemetry & Trends"
                      : activeSport === "Cycling"
                      ? "Open Ride Dashboard"
                      : "Open Easy Scoring"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.spotlightOutlineBtn}
                  onPress={() => setComposerOpen(true)}
                >
                  <Ionicons name="create-outline" size={15} color={THEME.text} />
                  <Text style={styles.spotlightOutlineBtnText}>Share Post</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Action Tiles */}
            <View style={styles.quickGrid}>
              <TouchableOpacity
                style={styles.quickCard}
                onPress={() => setCurrentTab("players")}
              >
                <View style={[styles.quickCardIcon, { backgroundColor: THEME.accentLight }]}>
                  <Ionicons name="chatbubbles" size={17} color={THEME.accent} />
                </View>
                <Text style={styles.quickCardTitle}>Friends & Chat</Text>
                <Text style={styles.quickCardDesc}>{friends.length} athletes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickCard}
                onPress={() => setAddFriendModalOpen(true)}
              >
                <View style={[styles.quickCardIcon, { backgroundColor: "rgba(212, 115, 54, 0.12)" }]}>
                  <Ionicons name="qr-code" size={17} color="#d47336" />
                </View>
                <Text style={styles.quickCardTitle}>Invite by ID</Text>
                <Text style={styles.quickCardDesc}>QR or Player Code</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickCard}
                onPress={() => setCurrentTab("games")}
              >
                <View style={[styles.quickCardIcon, { backgroundColor: "rgba(225, 29, 72, 0.12)" }]}>
                  <Ionicons name="calendar" size={17} color="#e11d48" />
                </View>
                <Text style={styles.quickCardTitle}>Fixtures</Text>
                <Text style={styles.quickCardDesc}>Schedule match</Text>
              </TouchableOpacity>
            </View>

            {/* Feed Header */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionEyebrow}>COMMUNITY FEED</Text>
                <Text style={styles.sectionHeading}>From the field</Text>
              </View>
              <TouchableOpacity onPress={() => setComposerOpen(true)}>
                <Text style={styles.sectionLink}>+ Create post</Text>
              </TouchableOpacity>
            </View>

            {/* Zero Mock Data Feed */}
            {posts.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="chatbubbles-outline" size={26} color={THEME.textMuted} />
                </View>
                <Text style={styles.emptyTitle}>Your {currentSport.name} feed is open.</Text>
                <Text style={styles.emptyDesc}>
                  No posts yet. Share match highlights, training milestones, or challenge a friend.
                </Text>
                <TouchableOpacity
                  style={[styles.emptyActionBtn, { backgroundColor: currentSport.accent }]}
                  onPress={() => setComposerOpen(true)}
                >
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                  <Text style={styles.emptyActionBtnText}>Share a moment</Text>
                </TouchableOpacity>
              </View>
            ) : (
              posts.map((p) => (
                <View key={p.id} style={styles.postCard}>
                  <View style={styles.postAuthorRow}>
                    <View style={styles.postAvatar}>
                      <Text style={styles.postAvatarText}>{p.avatar}</Text>
                    </View>
                    <View style={styles.postAuthorMeta}>
                      <Text style={styles.postAuthorName}>{p.author}</Text>
                      <Text style={styles.postTime}>{p.time} · {p.sport}</Text>
                    </View>
                  </View>
                  <Text style={styles.postBody}>{p.body}</Text>
                  <View style={styles.postFooter}>
                    <TouchableOpacity style={styles.postActionBtn}>
                      <Ionicons name="heart-outline" size={16} color={THEME.textMuted} />
                      <Text style={styles.postActionText}>{p.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.postActionBtn}>
                      <Ionicons name="chatbubble-outline" size={15} color={THEME.textMuted} />
                      <Text style={styles.postActionText}>{p.comments}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* ==================================================== */}
        {/* TAB 2: PLAYERS & FRIENDS (Full Social Hub) */}
        {/* ==================================================== */}
        {currentTab === "players" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header with Add & QR Buttons */}
            <View style={styles.playersTopHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>ATHLETES & CONNECTIONS</Text>
                <Text style={styles.sectionHeading}>Players Hub</Text>
              </View>
              <View style={styles.playersActionButtons}>
                <TouchableOpacity
                  style={styles.pillActionBtn}
                  onPress={() => setQrModalOpen(true)}
                >
                  <Ionicons name="qr-code" size={14} color={THEME.text} />
                  <Text style={styles.pillActionBtnText}>My QR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.pillActionBtn, { backgroundColor: currentSport.accent }]}
                  onPress={() => setAddFriendModalOpen(true)}
                >
                  <Ionicons name="person-add" size={14} color="#FFFFFF" />
                  <Text style={[styles.pillActionBtnText, { color: "#FFFFFF" }]}>Add Friend</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sub-Tabs: Friends | Invites */}
            <View style={styles.segmentedTabs}>
              <TouchableOpacity
                style={[styles.segmentBtn, playerSubTab === "friends" && styles.segmentBtnActive]}
                onPress={() => setPlayerSubTab("friends")}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    playerSubTab === "friends" && styles.segmentBtnTextActive,
                  ]}
                >
                  Friends ({friends.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segmentBtn, playerSubTab === "invites" && styles.segmentBtnActive]}
                onPress={() => setPlayerSubTab("invites")}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    playerSubTab === "invites" && styles.segmentBtnTextActive,
                  ]}
                >
                  Invites ({pendingInvites.length})
                </Text>
              </TouchableOpacity>
            </View>

            {/* FRIENDS LIST */}
            {playerSubTab === "friends" && (
              <View style={styles.friendsListContainer}>
                {friends.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Ionicons name="people-outline" size={26} color={THEME.textMuted} />
                    <Text style={styles.emptyTitle}>No friends added yet</Text>
                    <Text style={styles.emptyDesc}>
                      Add friends using their unique Player ID or scan their QR code to chat and
                      challenge them to matches.
                    </Text>
                    <TouchableOpacity
                      style={[styles.emptyActionBtn, { backgroundColor: currentSport.accent }]}
                      onPress={() => setAddFriendModalOpen(true)}
                    >
                      <Ionicons name="person-add" size={15} color="#FFFFFF" />
                      <Text style={styles.emptyActionBtnText}>Add Friend by ID</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  friends.map((f) => (
                    <View key={f.id} style={styles.friendCard}>
                      <View style={styles.friendAvatarBox}>
                        <Text style={styles.friendAvatarText}>
                          {f.name.substring(0, 2).toUpperCase()}
                        </Text>
                        {f.online && <View style={styles.onlineDot} />}
                      </View>

                      <View style={styles.friendInfo}>
                        <View style={styles.friendNameRow}>
                          <Text style={styles.friendName}>{f.name}</Text>
                          <View style={styles.friendIdBadge}>
                            <Text style={styles.friendIdText}>{f.playerId}</Text>
                          </View>
                        </View>
                        <Text style={styles.friendRole}>
                          {f.role} · {f.sport}
                        </Text>
                      </View>

                      <View style={styles.friendActions}>
                        <TouchableOpacity
                          style={styles.chatButton}
                          onPress={() => setActiveChatFriend(f)}
                        >
                          <Ionicons name="chatbubble-ellipses" size={16} color={THEME.text} />
                          <Text style={styles.chatButtonText}>Chat</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}

            {/* PENDING INVITES */}
            {playerSubTab === "invites" && (
              <View style={styles.invitesListContainer}>
                {pendingInvites.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Ionicons name="mail-open-outline" size={26} color={THEME.textMuted} />
                    <Text style={styles.emptyTitle}>No pending invites</Text>
                    <Text style={styles.emptyDesc}>
                      Friend requests and tournament invitations will appear here.
                    </Text>
                  </View>
                ) : (
                  pendingInvites.map((inv) => (
                    <View key={inv.id} style={styles.inviteCard}>
                      <View style={styles.inviteMeta}>
                        <Text style={styles.inviteName}>{inv.name}</Text>
                        <Text style={styles.inviteSub}>
                          {inv.playerId} · {inv.role} ({inv.sport})
                        </Text>
                      </View>
                      <View style={styles.inviteActions}>
                        <TouchableOpacity
                          style={[styles.inviteAcceptBtn, { backgroundColor: currentSport.accent }]}
                          onPress={() => handleAcceptInvite(inv)}
                        >
                          <Text style={styles.inviteAcceptText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.inviteDeclineBtn}
                          onPress={() =>
                            setPendingInvites(pendingInvites.filter((i) => i.id !== inv.id))
                          }
                        >
                          <Ionicons name="close" size={16} color={THEME.textMuted} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
          </ScrollView>
        )}

        {/* ==================================================== */}
        {/* TAB 3: GAMES & FIXTURES */}
        {/* ==================================================== */}
        {currentTab === "games" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.playersTopHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>{currentSport.name.toUpperCase()} / FIXTURES</Text>
                <Text style={styles.sectionHeading}>Scheduled Games</Text>
              </View>
              <TouchableOpacity
                style={[styles.pillActionBtn, { backgroundColor: currentSport.accent }]}
                onPress={() => setAddGameOpen(true)}
              >
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text style={[styles.pillActionBtnText, { color: "#FFFFFF" }]}>Schedule Match</Text>
              </TouchableOpacity>
            </View>

            {/* Zero Mock Data: Clean Fixtures */}
            {games.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="calendar-outline" size={28} color={THEME.textMuted} />
                <Text style={styles.emptyTitle}>No scheduled fixtures yet.</Text>
                <Text style={styles.emptyDesc}>
                  Schedule your first {currentSport.name.toLowerCase()} match, friendly scrimmage,
                  or invite a friend to play.
                </Text>
                <TouchableOpacity
                  style={[styles.emptyActionBtn, { backgroundColor: currentSport.accent }]}
                  onPress={() => setAddGameOpen(true)}
                >
                  <Ionicons name="add-circle" size={16} color="#FFFFFF" />
                  <Text style={styles.emptyActionBtnText}>Schedule First Game</Text>
                </TouchableOpacity>
              </View>
            ) : (
              games.map((g) => (
                <View key={g.id} style={styles.gameCard}>
                  <View style={styles.gameCardHeader}>
                    <Text style={styles.gameCardSport}>{g.sport} Fixture</Text>
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
                      style={[styles.gameScoreBtn, { backgroundColor: currentSport.accent }]}
                      onPress={() => {
                        if (activeSport === "Badminton") {
                          setBadmintonP1(g.teamA);
                          setBadmintonP2(g.teamB);
                        } else if (activeSport === "Football") {
                          setFootballTeamA(g.teamA);
                          setFootballTeamB(g.teamB);
                        } else {
                          setStrikerName(g.teamA);
                          setNonStrikerName(g.teamB);
                        }
                        setCurrentTab("scores");
                      }}
                    >
                      <Text style={styles.gameScoreBtnText}>Open Easy Scoring</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* ==================================================== */}
        {/* TAB 4: EASY SCORING CONSOLE (Interactive & Cool) */}
        {/* ==================================================== */}
        {currentTab === "scores" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.playersTopHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>
                  {activeSport === "Running"
                    ? "RUNNING / TELEMETRY & TRENDS"
                    : activeSport === "Cycling"
                    ? "CYCLING / TELEMETRY & ELEVATION"
                    : `${currentSport.name.toUpperCase()} / EASY SCORING`}
                </Text>
                <Text style={styles.sectionHeading}>
                  {activeSport === "Running"
                    ? "Endurance Tracker"
                    : activeSport === "Cycling"
                    ? "Velo Ride Tracker"
                    : "Stadium Console"}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.pillActionBtn, { backgroundColor: currentSport.accent }]}
                onPress={handleFinalizeMatch}
              >
                <Ionicons
                  name={activeSport === "Running" || activeSport === "Cycling" ? "checkmark-circle" : "checkmark-done"}
                  size={14}
                  color="#FFFFFF"
                />
                <Text style={[styles.pillActionBtnText, { color: "#FFFFFF" }]}>
                  {activeSport === "Running"
                    ? "Log Run Session"
                    : activeSport === "Cycling"
                    ? "Log Ride Session"
                    : "Finalize Match"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* SPORT SPECIFIC EASY SCORING UI */}

            {/* --- 1. CRICKET EASY SCORING --- */}
            {activeSport === "Cricket" && (
              <View style={styles.consoleCard}>
                {/* Scoreboard Header */}
                <View style={styles.cricketScoreHeader}>
                  <View>
                    <Text style={styles.cricketScoreBig}>
                      {cricketRuns}/{cricketWickets}
                    </Text>
                    <Text style={styles.cricketOversText}>
                      Overs: {cricketOverCount}.{cricketBallsInOver} / 20.0
                    </Text>
                  </View>
                  <View style={styles.runRateBadge}>
                    <Text style={styles.runRateLabel}>CRR</Text>
                    <Text style={styles.runRateValue}>
                      {cricketOverCount > 0 || cricketBallsInOver > 0
                        ? (
                            (cricketRuns /
                              (cricketOverCount + cricketBallsInOver / 6)) ||
                            0
                          ).toFixed(2)
                        : "0.00"}
                    </Text>
                  </View>
                </View>

                {/* Batsmen Table */}
                <View style={styles.batsmenTable}>
                  <View style={styles.tableRowHeader}>
                    <Text style={[styles.tableCol, { flex: 2 }]}>BATSMAN</Text>
                    <Text style={styles.tableCol}>R</Text>
                    <Text style={styles.tableCol}>B</Text>
                    <Text style={styles.tableCol}>SR</Text>
                  </View>
                  <View style={[styles.tableRow, styles.strikerHighlight]}>
                    <Text style={[styles.tableColText, { flex: 2, fontWeight: "800" }]}>
                      {strikerName} *
                    </Text>
                    <Text style={styles.tableColText}>{strikerRuns}</Text>
                    <Text style={styles.tableColText}>{strikerBalls}</Text>
                    <Text style={styles.tableColText}>
                      {strikerBalls > 0
                        ? ((strikerRuns / strikerBalls) * 100).toFixed(1)
                        : "0.0"}
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableColText, { flex: 2 }]}>{nonStrikerName}</Text>
                    <Text style={styles.tableColText}>{nonStrikerRuns}</Text>
                    <Text style={styles.tableColText}>{nonStrikerBalls}</Text>
                    <Text style={styles.tableColText}>
                      {nonStrikerBalls > 0
                        ? ((nonStrikerRuns / nonStrikerBalls) * 100).toFixed(1)
                        : "0.0"}
                    </Text>
                  </View>
                </View>

                {/* Bowler Bar */}
                <View style={styles.bowlerRow}>
                  <Text style={styles.bowlerNameText}>Bowler: {bowlerName}</Text>
                  <Text style={styles.bowlerStatsText}>
                    {bowlerOvers} ov · {bowlerRunsGiven} r · {bowlerWickets} w
                  </Text>
                </View>

                {/* Over Timeline */}
                <View style={styles.overTimelineRow}>
                  <Text style={styles.thisOverLabel}>This Over:</Text>
                  {overTimeline.length === 0 ? (
                    <Text style={styles.noBallsYet}>Waiting for first delivery...</Text>
                  ) : (
                    overTimeline.map((b, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.ballDot,
                          b === "W" && styles.ballWicket,
                          (b === "4" || b === "6") && { backgroundColor: currentSport.accent },
                        ]}
                      >
                        <Text style={styles.ballDotText}>{b}</Text>
                      </View>
                    ))
                  )}
                </View>

                {/* Easy Scoring Keypad */}
                <View style={styles.keypadGrid}>
                  {["0", "1", "2", "3", "4", "6"].map((val) => (
                    <TouchableOpacity
                      key={val}
                      style={[
                        styles.keypadBtn,
                        (val === "4" || val === "6") && { borderColor: currentSport.accent },
                      ]}
                      onPress={() => handleCricketBall(val)}
                    >
                      <Text style={styles.keypadBtnText}>+{val}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={[styles.keypadBtn, styles.keypadSpecialBtn]}
                    onPress={() => handleCricketBall("WD")}
                  >
                    <Text style={styles.keypadSpecialText}>WD</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keypadBtn, styles.keypadSpecialBtn]}
                    onPress={() => handleCricketBall("NB")}
                  >
                    <Text style={styles.keypadSpecialText}>NB</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keypadBtn, styles.keypadWicketBtn]}
                    onPress={() => handleCricketBall("W")}
                  >
                    <Text style={styles.keypadWicketText}>WICKET</Text>
                  </TouchableOpacity>
                </View>

                {/* Action Controls */}
                <View style={styles.scoringBottomControls}>
                  <TouchableOpacity style={styles.controlBtn} onPress={swapCricketStrike}>
                    <Ionicons name="swap-horizontal" size={16} color={THEME.text} />
                    <Text style={styles.controlBtnText}>Swap Strike</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.controlBtn} onPress={undoCricketBall}>
                    <Ionicons name="arrow-undo" size={16} color={THEME.text} />
                    <Text style={styles.controlBtnText}>Undo Ball</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* --- 2. BADMINTON EASY SCORING (Speed & Precision, Crimson Theme #e11d48) --- */}
            {activeSport === "Badminton" && (
              <View style={styles.consoleCard}>
                <View style={styles.badmintonTopBadge}>
                  <MaterialCommunityIcons name="badminton" size={18} color="#e11d48" />
                  <Text style={[styles.badmintonTitle, { color: "#e11d48" }]}>
                    SET {badmintonSet} · MATCH POINT 21
                  </Text>
                </View>

                {/* Big Score Board */}
                <View style={styles.badmintonScoreBoard}>
                  <View style={styles.playerScoreCol}>
                    <TextInput
                      style={styles.badmintonPlayerInput}
                      value={badmintonP1}
                      onChangeText={setBadmintonP1}
                    />
                    <Text style={styles.bigScoreDigit}>{badmintonScore1}</Text>
                    {badmintonServer === 1 && (
                      <View style={[styles.serverPill, { backgroundColor: "#e11d48" }]}>
                        <Text style={styles.serverPillText}>SERVING</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={[styles.pointAddBtn, { backgroundColor: "#e11d48" }]}
                      onPress={() => handleBadmintonPoint(1)}
                    >
                      <Text style={styles.pointAddBtnText}>+1 Point</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.badmintonDivider}>
                    <Text style={styles.badmintonDividerText}>VS</Text>
                  </View>

                  <View style={styles.playerScoreCol}>
                    <TextInput
                      style={styles.badmintonPlayerInput}
                      value={badmintonP2}
                      onChangeText={setBadmintonP2}
                    />
                    <Text style={styles.bigScoreDigit}>{badmintonScore2}</Text>
                    {badmintonServer === 2 && (
                      <View style={[styles.serverPill, { backgroundColor: "#e11d48" }]}>
                        <Text style={styles.serverPillText}>SERVING</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={[styles.pointAddBtn, { backgroundColor: "#e11d48" }]}
                      onPress={() => handleBadmintonPoint(2)}
                    >
                      <Text style={styles.pointAddBtnText}>+1 Point</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Court & Server Info */}
                <View style={styles.courtInfoCard}>
                  <Text style={styles.courtInfoText}>
                    🏸 Current Service Court: <Text style={{ fontWeight: "800" }}>{badmintonCourt}</Text>
                  </Text>
                </View>

                {/* Badminton Controls */}
                <View style={styles.scoringBottomControls}>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => {
                      setBadmintonScore1((s) => Math.max(0, s - 1));
                    }}
                  >
                    <Ionicons name="arrow-undo" size={15} color={THEME.text} />
                    <Text style={styles.controlBtnText}>Undo P1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => {
                      setBadmintonScore2((s) => Math.max(0, s - 1));
                    }}
                  >
                    <Ionicons name="arrow-undo" size={15} color={THEME.text} />
                    <Text style={styles.controlBtnText}>Undo P2</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.controlBtn, { backgroundColor: "#ffe4e6" }]}
                    onPress={() => {
                      setBadmintonSet((s) => s + 1);
                      setBadmintonScore1(0);
                      setBadmintonScore2(0);
                    }}
                  >
                    <Ionicons name="refresh" size={15} color="#e11d48" />
                    <Text style={[styles.controlBtnText, { color: "#e11d48" }]}>Next Set</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* --- 3. FOOTBALL EASY SCORING --- */}
            {activeSport === "Football" && (
              <View style={styles.consoleCard}>
                <View style={styles.footballMatchHeader}>
                  <TextInput
                    style={styles.footballTeamInput}
                    value={footballTeamA}
                    onChangeText={setFootballTeamA}
                  />
                  <View style={styles.footballScoreBox}>
                    <Text style={styles.footballScoreBig}>
                      {footballScoreA} - {footballScoreB}
                    </Text>
                    <Text style={styles.footballTimeText}>{footballMinute}'</Text>
                  </View>
                  <TextInput
                    style={styles.footballTeamInput}
                    value={footballTeamB}
                    onChangeText={setFootballTeamB}
                  />
                </View>

                <View style={styles.footballActionRow}>
                  <TouchableOpacity
                    style={styles.footballGoalBtn}
                    onPress={() => setFootballScoreA((s) => s + 1)}
                  >
                    <Ionicons name="football" size={16} color="#000000" />
                    <Text style={styles.footballGoalBtnText}>Goal Team A</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.footballGoalBtn}
                    onPress={() => setFootballScoreB((s) => s + 1)}
                  >
                    <Ionicons name="football" size={16} color="#000000" />
                    <Text style={styles.footballGoalBtnText}>Goal Team B</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.scoringBottomControls}>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => setFootballMinute((m) => m + 5)}
                  >
                    <Ionicons name="timer-outline" size={15} color={THEME.text} />
                    <Text style={styles.controlBtnText}>+5 Min</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => {
                      setFootballScoreA(0);
                      setFootballScoreB(0);
                      setFootballMinute(0);
                    }}
                  >
                    <Ionicons name="refresh" size={15} color={THEME.text} />
                    <Text style={styles.controlBtnText}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* --- 4. RUNNING TELEMETRY & TREND CHECK --- */}
            {activeSport === "Running" && (
              <View style={styles.consoleCard}>
                {/* Top Metrics Row */}
                <View style={styles.telemetryHero}>
                  <View>
                    <Text style={[styles.telemetryTag, { color: "#4c9b81" }]}>DISTANCE COVERED</Text>
                    <View style={styles.telemetryNumberRow}>
                      <Text style={styles.telemetryBigNum}>{runDistance.toFixed(2)}</Text>
                      <Text style={styles.telemetryUnit}>km</Text>
                    </View>
                  </View>
                  <View style={styles.telemetryHeroRight}>
                    <Text style={styles.telemetryTag}>PEDOMETER</Text>
                    <View style={styles.telemetryNumberRow}>
                      <Text style={styles.telemetryMidNum}>{runSteps.toLocaleString()}</Text>
                      <Text style={styles.telemetryUnitSmall}>steps</Text>
                    </View>
                  </View>
                </View>

                {/* Target Progress Bar */}
                <View style={styles.telemetryTargetBox}>
                  <View style={styles.telemetryTargetMeta}>
                    <Text style={styles.telemetryTargetLabel}>Target: {runTarget.toFixed(1)} km</Text>
                    <Text style={[styles.telemetryTargetPercent, { color: "#4c9b81" }]}>
                      {Math.min(100, Math.round((runDistance / runTarget) * 100))}% Completed
                    </Text>
                  </View>
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          backgroundColor: "#4c9b81",
                          width: `${Math.min(100, Math.round((runDistance / runTarget) * 100))}%`,
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* 4 Telemetry Metrics Grid */}
                <View style={styles.telemetryGrid}>
                  <View style={styles.telemetryMetricItem}>
                    <Text style={styles.telemetryMetricLabel}>AVG PACE</Text>
                    <Text style={styles.telemetryMetricVal}>
                      {runDistance > 0 ? `${runPace} /km` : "0'00\" /km"}
                    </Text>
                  </View>
                  <View style={styles.telemetryMetricItem}>
                    <Text style={styles.telemetryMetricLabel}>ACTIVE CAL</Text>
                    <Text style={styles.telemetryMetricVal}>{runCalories} kcal</Text>
                  </View>
                  <View style={styles.telemetryMetricItem}>
                    <Text style={styles.telemetryMetricLabel}>ELAPSED TIME</Text>
                    <Text style={styles.telemetryMetricVal}>
                      {runDistance > 0 ? "34m 12s" : "00m 00s"}
                    </Text>
                  </View>
                  <View style={styles.telemetryMetricItem}>
                    <Text style={styles.telemetryMetricLabel}>AVG CADENCE</Text>
                    <Text style={styles.telemetryMetricVal}>
                      {runDistance > 0 ? "168 spm" : "0 spm"}
                    </Text>
                  </View>
                </View>

                {/* 7-Day Running Trend Chart (Zero mock data, tracks real live logs) */}
                <View style={styles.trendContainer}>
                  <View style={styles.trendHeader}>
                    <View>
                      <Text style={[styles.trendTag, { color: "#4c9b81" }]}>WEEKLY RUNNING TREND</Text>
                      <Text style={styles.trendTitle}>Last 7 Days Mileage</Text>
                    </View>
                    <View style={styles.trendTotalBox}>
                      <Text style={styles.trendTotalKm}>{runDistance.toFixed(1)} km</Text>
                      <Text style={[styles.trendGrowth, { color: "#4c9b81" }]}>Live Session</Text>
                    </View>
                  </View>

                  {/* Visual Bar Chart */}
                  <View style={styles.trendBarsRow}>
                    {[
                      { day: "Mon", km: 0.0, active: false },
                      { day: "Tue", km: 0.0, active: false },
                      { day: "Wed", km: 0.0, active: false },
                      { day: "Thu", km: 0.0, active: false },
                      { day: "Fri", km: 0.0, active: false },
                      { day: "Sat", km: 0.0, active: false },
                      { day: "Today", km: runDistance, active: true },
                    ].map((bar) => {
                      const pct = bar.km === 0 ? 4 : Math.min(100, (bar.km / Math.max(runTarget, 10)) * 100);
                      return (
                        <View key={bar.day} style={styles.trendBarCol}>
                          <Text style={styles.trendBarKmLabel}>
                            {bar.km === 0 ? "-" : `${bar.km.toFixed(1)}k`}
                          </Text>
                          <View style={styles.trendBarSlot}>
                            <View
                              style={[
                                styles.trendBarPill,
                                {
                                  height: `${pct}%`,
                                  backgroundColor: bar.active ? "#4c9b81" : "rgba(76, 155, 129, 0.4)",
                                },
                              ]}
                            />
                          </View>
                          <Text
                            style={[
                              styles.trendBarDayLabel,
                              bar.active && { color: "#4c9b81", fontWeight: "900" },
                            ]}
                          >
                            {bar.day}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Quick Telemetry Actions */}
                <View style={styles.telemetryActions}>
                  <TouchableOpacity
                    style={[styles.telemetryActionBtn, { backgroundColor: "#4c9b81" }]}
                    onPress={() => {
                      setRunDistance((d) => Number((d + 0.5).toFixed(2)));
                      setRunSteps((s) => s + 650);
                      setRunCalories((c) => c + 35);
                      setRunPace("5'18\"");
                    }}
                  >
                    <Ionicons name="add" size={16} color="#FFFFFF" />
                    <Text style={styles.telemetryActionBtnText}>+0.5 km</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.telemetryActionOutline}
                    onPress={() => {
                      setRunSteps((s) => s + 500);
                      setRunDistance((d) => Number((d + 0.38).toFixed(2)));
                      setRunCalories((c) => c + 25);
                      setRunPace("5'18\"");
                    }}
                  >
                    <MaterialCommunityIcons name="shoe-print" size={15} color={THEME.text} />
                    <Text style={styles.telemetryActionOutlineText}>+500 Steps</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.telemetryActionOutline}
                    onPress={() => {
                      if (runTarget === 10) setRunTarget(21.1);
                      else if (runTarget === 21.1) setRunTarget(42.2);
                      else setRunTarget(10);
                    }}
                  >
                    <Ionicons name="flag-outline" size={15} color={THEME.text} />
                    <Text style={styles.telemetryActionOutlineText}>
                      Target: {runTarget === 10 ? "10K" : runTarget === 21.1 ? "21.1K" : "42.2K"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.telemetryActionReset}
                    onPress={() => {
                      setRunDistance(0);
                      setRunSteps(0);
                      setRunCalories(0);
                      setRunPace("0'00\"");
                    }}
                  >
                    <Ionicons name="refresh" size={15} color={THEME.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* --- 5. CYCLING TELEMETRY & TREND CHECK --- */}
            {activeSport === "Cycling" && (
              <View style={styles.consoleCard}>
                {/* Top Metrics Row */}
                <View style={styles.telemetryHero}>
                  <View>
                    <Text style={[styles.telemetryTag, { color: "#557fa9" }]}>RIDE DISTANCE</Text>
                    <View style={styles.telemetryNumberRow}>
                      <Text style={styles.telemetryBigNum}>{cycleDistance.toFixed(1)}</Text>
                      <Text style={styles.telemetryUnit}>km</Text>
                    </View>
                  </View>
                  <View style={styles.telemetryHeroRight}>
                    <Text style={styles.telemetryTag}>ELEVATION GAIN</Text>
                    <View style={styles.telemetryNumberRow}>
                      <Text style={styles.telemetryMidNum}>+{cycleElevation}</Text>
                      <Text style={styles.telemetryUnitSmall}>m</Text>
                    </View>
                  </View>
                </View>

                {/* Target Progress Bar */}
                <View style={styles.telemetryTargetBox}>
                  <View style={styles.telemetryTargetMeta}>
                    <Text style={styles.telemetryTargetLabel}>Ride Target: {cycleTarget.toFixed(0)} km</Text>
                    <Text style={[styles.telemetryTargetPercent, { color: "#557fa9" }]}>
                      {Math.min(100, Math.round((cycleDistance / cycleTarget) * 100))}% Completed
                    </Text>
                  </View>
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          backgroundColor: "#557fa9",
                          width: `${Math.min(100, Math.round((cycleDistance / cycleTarget) * 100))}%`,
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* 4 Telemetry Metrics Grid */}
                <View style={styles.telemetryGrid}>
                  <View style={styles.telemetryMetricItem}>
                    <Text style={styles.telemetryMetricLabel}>AVG SPEED</Text>
                    <Text style={styles.telemetryMetricVal}>{cycleSpeed} km/h</Text>
                  </View>
                  <View style={styles.telemetryMetricItem}>
                    <Text style={styles.telemetryMetricLabel}>ACTIVE CAL</Text>
                    <Text style={styles.telemetryMetricVal}>{cycleCalories} kcal</Text>
                  </View>
                  <View style={styles.telemetryMetricItem}>
                    <Text style={styles.telemetryMetricLabel}>ELAPSED TIME</Text>
                    <Text style={styles.telemetryMetricVal}>
                      {cycleDistance > 0 ? "56m 20s" : "00m 00s"}
                    </Text>
                  </View>
                  <View style={styles.telemetryMetricItem}>
                    <Text style={styles.telemetryMetricLabel}>AVG POWER</Text>
                    <Text style={styles.telemetryMetricVal}>
                      {cycleDistance > 0 ? "185 W" : "0 W"}
                    </Text>
                  </View>
                </View>

                {/* 7-Day Cycling Trend Chart (Zero mock data, tracks real live logs) */}
                <View style={styles.trendContainer}>
                  <View style={styles.trendHeader}>
                    <View>
                      <Text style={[styles.trendTag, { color: "#557fa9" }]}>WEEKLY CYCLING TREND</Text>
                      <Text style={styles.trendTitle}>Last 7 Days Mileage</Text>
                    </View>
                    <View style={styles.trendTotalBox}>
                      <Text style={styles.trendTotalKm}>{cycleDistance.toFixed(1)} km</Text>
                      <Text style={[styles.trendGrowth, { color: "#557fa9" }]}>Live Session</Text>
                    </View>
                  </View>

                  {/* Visual Bar Chart */}
                  <View style={styles.trendBarsRow}>
                    {[
                      { day: "Mon", km: 0.0, active: false },
                      { day: "Tue", km: 0.0, active: false },
                      { day: "Wed", km: 0.0, active: false },
                      { day: "Thu", km: 0.0, active: false },
                      { day: "Fri", km: 0.0, active: false },
                      { day: "Sat", km: 0.0, active: false },
                      { day: "Today", km: cycleDistance, active: true },
                    ].map((bar) => {
                      const pct = bar.km === 0 ? 4 : Math.min(100, (bar.km / Math.max(cycleTarget, 35)) * 100);
                      return (
                        <View key={bar.day} style={styles.trendBarCol}>
                          <Text style={styles.trendBarKmLabel}>
                            {bar.km === 0 ? "-" : `${bar.km.toFixed(0)}k`}
                          </Text>
                          <View style={styles.trendBarSlot}>
                            <View
                              style={[
                                styles.trendBarPill,
                                {
                                  height: `${pct}%`,
                                  backgroundColor: bar.active ? "#557fa9" : "rgba(85, 127, 169, 0.4)",
                                },
                              ]}
                            />
                          </View>
                          <Text
                            style={[
                              styles.trendBarDayLabel,
                              bar.active && { color: "#557fa9", fontWeight: "900" },
                            ]}
                          >
                            {bar.day}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Quick Telemetry Actions */}
                <View style={styles.telemetryActions}>
                  <TouchableOpacity
                    style={[styles.telemetryActionBtn, { backgroundColor: "#557fa9" }]}
                    onPress={() => {
                      setCycleDistance((d) => Number((d + 2.0).toFixed(1)));
                      setCycleElevation((e) => e + 25);
                      setCycleCalories((c) => c + 55);
                      setCycleSpeed(26.4);
                    }}
                  >
                    <Ionicons name="add" size={16} color="#FFFFFF" />
                    <Text style={styles.telemetryActionBtnText}>+2.0 km</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.telemetryActionOutline}
                    onPress={() => {
                      setCycleElevation((e) => e + 50);
                      setCycleCalories((c) => c + 40);
                      setCycleSpeed(26.4);
                    }}
                  >
                    <MaterialCommunityIcons name="elevation-rise" size={15} color={THEME.text} />
                    <Text style={styles.telemetryActionOutlineText}>+50m Elev</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.telemetryActionOutline}
                    onPress={() => {
                      if (cycleTarget === 35) setCycleTarget(60);
                      else if (cycleTarget === 60) setCycleTarget(100);
                      else setCycleTarget(35);
                    }}
                  >
                    <Ionicons name="flag-outline" size={15} color={THEME.text} />
                    <Text style={styles.telemetryActionOutlineText}>
                      Target: {cycleTarget === 35 ? "35K" : cycleTarget === 60 ? "60K" : "100K"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.telemetryActionReset}
                    onPress={() => {
                      setCycleDistance(0);
                      setCycleElevation(0);
                      setCycleCalories(0);
                      setCycleSpeed(0);
                    }}
                  >
                    <Ionicons name="refresh" size={15} color={THEME.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* --- 6. BASKETBALL EASY SCORING --- */}
            {activeSport === "Basketball" && (
              <View style={styles.consoleCard}>
                <View style={[styles.badmintonTopBadge, { backgroundColor: "#f5e6d5" }]}>
                  <MaterialCommunityIcons name="basketball" size={18} color="#d47336" />
                  <Text style={[styles.badmintonTitle, { color: "#d47336" }]}>
                    QUARTER {bballQuarter} · HARDWOOD CONSOLE
                  </Text>
                </View>

                <View style={styles.badmintonScoreBoard}>
                  <View style={styles.playerScoreCol}>
                    <TextInput
                      style={styles.badmintonPlayerInput}
                      value={bballTeamA}
                      onChangeText={setBballTeamA}
                    />
                    <Text style={styles.bigScoreDigit}>{bballScoreA}</Text>
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      <TouchableOpacity
                        style={[styles.pointAddBtn, { backgroundColor: "#d47336", paddingHorizontal: 10 }]}
                        onPress={() => setBballScoreA((s) => s + 1)}
                      >
                        <Text style={styles.pointAddBtnText}>+1</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.pointAddBtn, { backgroundColor: "#d47336", paddingHorizontal: 10 }]}
                        onPress={() => setBballScoreA((s) => s + 2)}
                      >
                        <Text style={styles.pointAddBtnText}>+2</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.pointAddBtn, { backgroundColor: "#d47336", paddingHorizontal: 10 }]}
                        onPress={() => setBballScoreA((s) => s + 3)}
                      >
                        <Text style={styles.pointAddBtnText}>+3</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.badmintonDivider}>
                    <Text style={styles.badmintonDividerText}>VS</Text>
                  </View>

                  <View style={styles.playerScoreCol}>
                    <TextInput
                      style={styles.badmintonPlayerInput}
                      value={bballTeamB}
                      onChangeText={setBballTeamB}
                    />
                    <Text style={styles.bigScoreDigit}>{bballScoreB}</Text>
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      <TouchableOpacity
                        style={[styles.pointAddBtn, { backgroundColor: "#d47336", paddingHorizontal: 10 }]}
                        onPress={() => setBballScoreB((s) => s + 1)}
                      >
                        <Text style={styles.pointAddBtnText}>+1</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.pointAddBtn, { backgroundColor: "#d47336", paddingHorizontal: 10 }]}
                        onPress={() => setBballScoreB((s) => s + 2)}
                      >
                        <Text style={styles.pointAddBtnText}>+2</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.pointAddBtn, { backgroundColor: "#d47336", paddingHorizontal: 10 }]}
                        onPress={() => setBballScoreB((s) => s + 3)}
                      >
                        <Text style={styles.pointAddBtnText}>+3</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.scoringBottomControls}>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => setBballQuarter((q) => (q < 4 ? q + 1 : 1))}
                  >
                    <Ionicons name="time-outline" size={15} color={THEME.text} />
                    <Text style={styles.controlBtnText}>Next Quarter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => {
                      setBballScoreA(0);
                      setBballScoreB(0);
                      setBballQuarter(1);
                    }}
                  >
                    <Ionicons name="refresh" size={15} color={THEME.text} />
                    <Text style={styles.controlBtnText}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* --- 7. VOLLEYBALL EASY SCORING --- */}
            {activeSport === "Volleyball" && (
              <View style={styles.consoleCard}>
                <View style={[styles.badmintonTopBadge, { backgroundColor: "#ede3f1" }]}>
                  <MaterialCommunityIcons name="volleyball" size={18} color="#9d6ab0" />
                  <Text style={[styles.badmintonTitle, { color: "#9d6ab0" }]}>
                    SET {vballSet} · RALLY POINT SYSTEM
                  </Text>
                </View>

                <View style={styles.badmintonScoreBoard}>
                  <View style={styles.playerScoreCol}>
                    <TextInput
                      style={styles.badmintonPlayerInput}
                      value={vballTeamA}
                      onChangeText={setVballTeamA}
                    />
                    <Text style={styles.bigScoreDigit}>{vballScoreA}</Text>
                    <TouchableOpacity
                      style={[styles.pointAddBtn, { backgroundColor: "#9d6ab0" }]}
                      onPress={() => setVballScoreA((s) => s + 1)}
                    >
                      <Text style={styles.pointAddBtnText}>+1 Point</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.badmintonDivider}>
                    <Text style={styles.badmintonDividerText}>VS</Text>
                  </View>

                  <View style={styles.playerScoreCol}>
                    <TextInput
                      style={styles.badmintonPlayerInput}
                      value={vballTeamB}
                      onChangeText={setVballTeamB}
                    />
                    <Text style={styles.bigScoreDigit}>{vballScoreB}</Text>
                    <TouchableOpacity
                      style={[styles.pointAddBtn, { backgroundColor: "#9d6ab0" }]}
                      onPress={() => setVballScoreB((s) => s + 1)}
                    >
                      <Text style={styles.pointAddBtnText}>+1 Point</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.scoringBottomControls}>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => {
                      setVballSet((s) => s + 1);
                      setVballScoreA(0);
                      setVballScoreB(0);
                    }}
                  >
                    <Ionicons name="refresh" size={15} color="#9d6ab0" />
                    <Text style={[styles.controlBtnText, { color: "#9d6ab0" }]}>Next Set</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => {
                      setVballScoreA(0);
                      setVballScoreB(0);
                      setVballSet(1);
                    }}
                  >
                    <Ionicons name="refresh" size={15} color={THEME.text} />
                    <Text style={styles.controlBtnText}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* FINALIZED MATCH & ACTIVITY ARCHIVES */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionEyebrow}>OFFICIAL ARCHIVE</Text>
                <Text style={styles.sectionHeading}>Session & Match Records</Text>
              </View>
            </View>

            {matchRecords.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="trophy-outline" size={24} color={THEME.textMuted} />
                <Text style={styles.emptyTitle}>No finalized sessions yet.</Text>
                <Text style={styles.emptyDesc}>
                  Once you finish easy scoring a game or log a running/cycling session, tap "Log Session" or "Finalize Match" to save official records here.
                </Text>
              </View>
            ) : (
              matchRecords.map((rec) => (
                <View key={rec.id} style={styles.recordCard}>
                  <View style={styles.recordHeader}>
                    <Text style={styles.recordSport}>
                      {rec.sport === "Running" || rec.sport === "Cycling"
                        ? `${rec.sport} Activity Log`
                        : `${rec.sport} Official Result`}
                    </Text>
                    <Text style={styles.recordDate}>{rec.date} · {rec.finalizedAt}</Text>
                  </View>
                  <Text style={styles.recordSummary}>{rec.summary}</Text>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* ==================================================== */}
        {/* TAB 5: PROFILE & IDENTITY */}
        {/* ==================================================== */}
        {currentTab === "profile" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.profileCard}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>CT</Text>
              </View>
              <Text style={styles.profileName}>{currentUser.name}</Text>
              <Text style={styles.profileSub}>
                {currentUser.handle} · Player ID: {currentUser.playerId}
              </Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={13} color={THEME.accent} />
                <Text style={styles.verifiedBadgeText}>VERIFIED ATHLETE</Text>
              </View>

              <TouchableOpacity
                style={styles.showQrBtn}
                onPress={() => setQrModalOpen(true)}
              >
                <Ionicons name="qr-code" size={15} color={THEME.text} />
                <Text style={styles.showQrBtnText}>Show My Player QR</Text>
              </TouchableOpacity>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{friends.length}</Text>
                  <Text style={styles.statLabel}>Friends</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{matchRecords.length}</Text>
                  <Text style={styles.statLabel}>Matches</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{posts.length}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
              </View>
            </View>

            <View style={styles.settingsCard}>
              <Text style={styles.settingsHeading}>ACCOUNT & SYNC</Text>
              <View style={styles.settingsRow}>
                <MaterialCommunityIcons name={currentSport.icon} size={18} color={THEME.text} />
                <Text style={styles.settingsText}>Active Sport Lens: {currentSport.name}</Text>
              </View>
              <View style={styles.settingsRow}>
                <Ionicons name="people-outline" size={18} color={THEME.text} />
                <Text style={styles.settingsText}>Player ID: {currentUser.playerId}</Text>
              </View>
              <View style={styles.settingsRow}>
                <Ionicons name="cloud-done-outline" size={18} color={THEME.accent} />
                <Text style={styles.settingsText}>EZKORA Cloud Database: Connected</Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* ==================================================== */}
      {/* BOTTOM NAVIGATION — Deep Pine Teal (#1c2e30) */}
      {/* ==================================================== */}
      <View style={styles.bottomNav}>
        {[
          { key: "home", label: "Home", icon: "compass" },
          { key: "players", label: "Players", icon: "people" },
          { key: "games", label: "Games", icon: "calendar" },
          { key: "scores", label: "Scores", icon: "game-controller" },
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

      {/* ==================================================== */}
      {/* MODAL 1: DIRECT CHAT WITH FRIEND */}
      {/* ==================================================== */}
      <Modal visible={!!activeChatFriend} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.chatModalCard}>
            {/* Chat Header */}
            <View style={styles.chatHeader}>
              <View style={styles.chatHeaderLeft}>
                <View style={styles.chatAvatar}>
                  <Text style={styles.chatAvatarText}>
                    {activeChatFriend?.name.substring(0, 2).toUpperCase()}
                  </Text>
                  {activeChatFriend?.online && <View style={styles.onlineDot} />}
                </View>
                <View>
                  <Text style={styles.chatName}>{activeChatFriend?.name}</Text>
                  <Text style={styles.chatStatus}>
                    {activeChatFriend?.online ? "Active Now" : "Offline"} · {activeChatFriend?.playerId}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setActiveChatFriend(null)}>
                <Ionicons name="close" size={24} color={THEME.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Quick Match Challenge Pill */}
            <View style={styles.challengeBar}>
              <Text style={styles.challengeBarText}>Ready to play?</Text>
              <TouchableOpacity
                style={[styles.challengeActionBtn, { backgroundColor: currentSport.accent }]}
                onPress={handleSendMatchChallenge}
              >
                <Ionicons name="trophy" size={13} color="#FFFFFF" />
                <Text style={styles.challengeActionBtnText}>Challenge to Match</Text>
              </TouchableOpacity>
            </View>

            {/* Message Thread */}
            <ScrollView
              style={styles.chatMessagesScroll}
              contentContainerStyle={styles.chatMessagesContent}
            >
              {activeChatFriend?.messages.length === 0 ? (
                <View style={styles.chatEmpty}>
                  <Text style={styles.chatEmptyText}>
                    No messages yet. Say hello or challenge {activeChatFriend?.name} to a game!
                  </Text>
                </View>
              ) : (
                activeChatFriend?.messages.map((m, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.chatBubble,
                      m.sender === "me" ? styles.bubbleMe : styles.bubbleThem,
                      m.isChallenge && styles.bubbleChallenge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        m.sender === "me" ? styles.bubbleTextMe : styles.bubbleTextThem,
                      ]}
                    >
                      {m.text}
                    </Text>
                    <Text
                      style={[
                        styles.bubbleTime,
                        m.sender === "me" ? { color: "rgba(255,255,255,0.7)" } : { color: THEME.textSub },
                      ]}
                    >
                      {m.time}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>

            {/* Chat Input Bar */}
            <View style={styles.chatInputBar}>
              <TextInput
                style={styles.chatTextInput}
                placeholder={`Message ${activeChatFriend?.name.split(" ")[0]}...`}
                placeholderTextColor={THEME.textSub}
                value={chatInputText}
                onChangeText={setChatInputText}
              />
              <TouchableOpacity
                style={[styles.chatSendBtn, { backgroundColor: currentSport.accent }]}
                onPress={handleSendMessage}
              >
                <Ionicons name="send" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ==================================================== */}
      {/* MODAL 2: ADD FRIEND VIA PLAYER ID */}
      {/* ==================================================== */}
      <Modal visible={addFriendModalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Athlete / Friend</Text>
              <TouchableOpacity onPress={() => setAddFriendModalOpen(false)}>
                <Ionicons name="close" size={22} color={THEME.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubText}>
              Enter any verified athlete's Player ID (e.g. PL-842109) to connect and start chatting.
            </Text>
            <TextInput
              style={styles.formInput}
              placeholder="Player ID (e.g. PL-842109)"
              placeholderTextColor={THEME.textSub}
              autoCapitalize="characters"
              value={inputFriendId}
              onChangeText={setInputFriendId}
            />

            <View style={styles.modalActionButtons}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => {
                  setAddFriendModalOpen(false);
                  setScanQrOpen(true);
                }}
              >
                <Ionicons name="camera-outline" size={16} color={THEME.text} />
                <Text style={styles.modalSecondaryBtnText}>Scan QR Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalPrimaryBtn, { backgroundColor: currentSport.accent }]}
                onPress={handleAddFriendById}
              >
                <Text style={styles.modalPrimaryBtnText}>Send Connection</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ==================================================== */}
      {/* MODAL 3: SHOW MY PLAYER QR CODE */}
      {/* ==================================================== */}
      <Modal visible={qrModalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.qrCard}>
            <TouchableOpacity
              style={styles.qrCloseBtn}
              onPress={() => setQrModalOpen(false)}
            >
              <Ionicons name="close" size={22} color={THEME.textMuted} />
            </TouchableOpacity>

            <View style={styles.qrProfileHeader}>
              <View style={styles.qrAvatar}>
                <Text style={styles.qrAvatarText}>CT</Text>
              </View>
              <Text style={styles.qrName}>{currentUser.name}</Text>
              <Text style={styles.qrIdBadge}>{currentUser.playerId}</Text>
            </View>

            {/* High Contrast Visual QR Matrix Representation */}
            <View style={styles.qrDisplayBox}>
              <View style={styles.qrInnerPattern}>
                <Ionicons name="qr-code" size={160} color="#1c2e30" />
              </View>
            </View>
            <Text style={styles.qrInstruction}>
              Scan this code with another phone to add Charan Teja instantly as a friend.
            </Text>

            <TouchableOpacity
              style={[styles.qrShareBtn, { backgroundColor: currentSport.accent }]}
              onPress={() => {
                Alert.alert("Invite Copied!", `ezkora.sports/invite/${currentUser.playerId}`);
              }}
            >
              <Ionicons name="share-social" size={16} color="#FFFFFF" />
              <Text style={styles.qrShareBtnText}>Share Invite Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ==================================================== */}
      {/* MODAL 4: SCAN FRIEND QR CODE */}
      {/* ==================================================== */}
      <Modal visible={scanQrOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Scan Athlete QR</Text>
              <TouchableOpacity onPress={() => setScanQrOpen(false)}>
                <Ionicons name="close" size={22} color={THEME.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubText}>
              Point camera or enter the scanned code to verify and connect.
            </Text>
            <TextInput
              style={styles.formInput}
              placeholder="Scanned Code (e.g. PL-992014)"
              placeholderTextColor={THEME.textSub}
              autoCapitalize="characters"
              value={scannedCode}
              onChangeText={setScannedCode}
            />
            <View style={styles.modalActionButtons}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => setScanQrOpen(false)}
              >
                <Text style={styles.modalSecondaryBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalPrimaryBtn, { backgroundColor: currentSport.accent }]}
                onPress={handleAddScannedFriend}
              >
                <Text style={styles.modalPrimaryBtnText}>Verify & Connect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ==================================================== */}
      {/* MODAL 5: POST COMPOSER */}
      {/* ==================================================== */}
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
              value={postText}
              onChangeText={setPostText}
            />
            <View style={styles.modalActionButtons}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => setComposerOpen(false)}
              >
                <Text style={styles.modalSecondaryBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalPrimaryBtn, { backgroundColor: currentSport.accent }]}
                onPress={() => {
                  if (!postText.trim()) return;
                  const newP = {
                    id: Date.now().toString(),
                    author: currentUser.name,
                    avatar: currentUser.avatar,
                    time: "Just now",
                    sport: activeSport,
                    body: postText.trim(),
                    likes: 0,
                    comments: 0,
                  };
                  setPosts([newP, ...posts]);
                  setPostText("");
                  setComposerOpen(false);
                }}
              >
                <Text style={styles.modalPrimaryBtnText}>Post to Feed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ==================================================== */}
      {/* MODAL 6: SCHEDULE MATCH */}
      {/* ==================================================== */}
      <Modal visible={addGameOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule {currentSport.name} Match</Text>
              <TouchableOpacity onPress={() => setAddGameOpen(false)}>
                <Ionicons name="close" size={22} color={THEME.textMuted} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.formInput}
              placeholder="Team A / Player 1"
              placeholderTextColor={THEME.textSub}
              value={newTeamA}
              onChangeText={setNewTeamA}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Team B / Player 2"
              placeholderTextColor={THEME.textSub}
              value={newTeamB}
              onChangeText={setNewTeamB}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Venue (e.g. Indoor Stadium Court 2)"
              placeholderTextColor={THEME.textSub}
              value={newVenue}
              onChangeText={setNewVenue}
            />
            <View style={styles.modalActionButtons}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => setAddGameOpen(false)}
              >
                <Text style={styles.modalSecondaryBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalPrimaryBtn, { backgroundColor: currentSport.accent }]}
                onPress={() => {
                  if (!newTeamA.trim() || !newTeamB.trim()) return;
                  const newG = {
                    id: Date.now().toString(),
                    sport: activeSport,
                    teamA: newTeamA.trim(),
                    teamB: newTeamB.trim(),
                    venue: newVenue.trim() || "Main Court",
                    date: "Today",
                  };
                  setGames([newG, ...games]);
                  setNewTeamA("");
                  setNewTeamB("");
                  setNewVenue("");
                  setAddGameOpen(false);
                }}
              >
                <Text style={styles.modalPrimaryBtnText}>Schedule Game</Text>
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

  // TOPBAR — Deep pine teal header with safe status bar spacing
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
    gap: 8,
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
    fontSize: 19,
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
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 4,
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
  sectionLink: {
    color: THEME.accent,
    fontSize: 12,
    fontWeight: "700",
  },

  // PLAYERS HUB HEADER
  playersTopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playersActionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  pillActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    backgroundColor: THEME.card,
  },
  pillActionBtnText: {
    color: THEME.text,
    fontSize: 12,
    fontWeight: "700",
  },
  segmentedTabs: {
    flexDirection: "row",
    backgroundColor: "#EFEBE3",
    borderRadius: 10,
    padding: 3,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  segmentBtnText: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  segmentBtnTextActive: {
    color: THEME.text,
    fontWeight: "800",
  },

  // FRIENDS LIST
  friendsListContainer: {
    gap: 10,
  },
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    padding: 14,
    gap: 12,
  },
  friendAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: THEME.accentLight,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  friendAvatarText: {
    color: THEME.accent,
    fontSize: 14,
    fontWeight: "800",
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10b981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    position: "absolute",
    bottom: -1,
    right: -1,
  },
  friendInfo: {
    flex: 1,
  },
  friendNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  friendName: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "700",
  },
  friendIdBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    backgroundColor: THEME.cardInner,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  friendIdText: {
    color: THEME.textMuted,
    fontSize: 9,
    fontWeight: "700",
  },
  friendRole: {
    color: THEME.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  friendActions: {
    flexDirection: "row",
    gap: 6,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: THEME.cardInner,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  chatButtonText: {
    color: THEME.text,
    fontSize: 12,
    fontWeight: "700",
  },

  // INVITES LIST
  invitesListContainer: {
    gap: 10,
  },
  inviteCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    padding: 14,
  },
  inviteMeta: {
    flex: 1,
  },
  inviteName: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "700",
  },
  inviteSub: {
    color: THEME.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  inviteActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inviteAcceptBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  inviteAcceptText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  inviteDeclineBtn: {
    padding: 6,
  },

  // CHAT MODAL
  chatModalCard: {
    flex: 1,
    backgroundColor: THEME.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 60,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
  },
  chatHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  chatAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: THEME.accentLight,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  chatAvatarText: {
    color: THEME.accent,
    fontSize: 13,
    fontWeight: "800",
  },
  chatName: {
    color: THEME.text,
    fontSize: 15,
    fontWeight: "800",
  },
  chatStatus: {
    color: THEME.textMuted,
    fontSize: 11,
  },
  challengeBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME.cardInner,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
  },
  challengeBarText: {
    color: THEME.text,
    fontSize: 12,
    fontWeight: "600",
  },
  challengeActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  challengeActionBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  chatMessagesScroll: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  chatMessagesContent: {
    padding: 16,
    gap: 10,
  },
  chatEmpty: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  chatEmptyText: {
    color: THEME.textMuted,
    fontSize: 13,
    textAlign: "center",
  },
  chatBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 14,
  },
  bubbleMe: {
    alignSelf: "flex-end",
    backgroundColor: THEME.headerBg,
    borderBottomRightRadius: 2,
  },
  bubbleThem: {
    alignSelf: "flex-start",
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    borderBottomLeftRadius: 2,
  },
  bubbleChallenge: {
    borderWidth: 1.5,
    borderColor: "#d47336",
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 18,
  },
  bubbleTextMe: {
    color: "#FFFFFF",
  },
  bubbleTextThem: {
    color: THEME.text,
  },
  bubbleTime: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  chatInputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorder,
    backgroundColor: THEME.card,
    gap: 10,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: THEME.cardInner,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: THEME.text,
    fontSize: 13,
  },
  chatSendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  // EASY SCORING CONSOLE CARD
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

  // CRICKET STYLES
  cricketScoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
  },
  cricketScoreBig: {
    color: THEME.text,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  cricketOversText: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  runRateBadge: {
    backgroundColor: THEME.cardInner,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  runRateLabel: {
    color: THEME.textMuted,
    fontSize: 9,
    fontWeight: "800",
  },
  runRateValue: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: "900",
  },
  batsmenTable: {
    backgroundColor: THEME.cardInner,
    borderRadius: 12,
    padding: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  tableRowHeader: {
    flexDirection: "row",
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  strikerHighlight: {
    backgroundColor: "rgba(39, 120, 99, 0.06)",
    borderRadius: 6,
    paddingHorizontal: 4,
  },
  tableCol: {
    flex: 1,
    color: THEME.textMuted,
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
  },
  tableColText: {
    flex: 1,
    color: THEME.text,
    fontSize: 12,
    textAlign: "center",
  },
  bowlerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  bowlerNameText: {
    color: THEME.text,
    fontSize: 13,
    fontWeight: "700",
  },
  bowlerStatsText: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  overTimelineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  thisOverLabel: {
    color: THEME.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },
  noBallsYet: {
    color: THEME.textSub,
    fontSize: 11,
    fontStyle: "italic",
  },
  ballDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: THEME.cardInner,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  ballWicket: {
    backgroundColor: THEME.danger,
    borderColor: THEME.danger,
  },
  ballDotText: {
    color: THEME.text,
    fontSize: 11,
    fontWeight: "800",
  },
  keypadGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
  },
  keypadBtn: {
    width: "30%",
    height: 48,
    borderRadius: 10,
    backgroundColor: THEME.cardInner,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  keypadBtnText: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: "900",
  },
  keypadSpecialBtn: {
    backgroundColor: "rgba(212, 115, 54, 0.1)",
    borderColor: "rgba(212, 115, 54, 0.3)",
  },
  keypadSpecialText: {
    color: "#d47336",
    fontSize: 13,
    fontWeight: "800",
  },
  keypadWicketBtn: {
    backgroundColor: THEME.dangerLight,
    borderColor: THEME.danger,
  },
  keypadWicketText: {
    color: THEME.danger,
    fontSize: 12,
    fontWeight: "900",
  },
  scoringBottomControls: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  controlBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: THEME.cardInner,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  controlBtnText: {
    color: THEME.text,
    fontSize: 12,
    fontWeight: "700",
  },

  // BADMINTON EASY SCORING (Crimson Theme #e11d48)
  badmintonTopBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ffe4e6",
    borderRadius: 8,
    paddingVertical: 6,
  },
  badmintonTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  badmintonScoreBoard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  playerScoreCol: {
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  badmintonPlayerInput: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
    paddingBottom: 2,
    minWidth: 90,
  },
  bigScoreDigit: {
    color: THEME.text,
    fontSize: 44,
    fontWeight: "900",
  },
  serverPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  serverPillText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  pointAddBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  pointAddBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  badmintonDivider: {
    paddingHorizontal: 10,
  },
  badmintonDividerText: {
    color: THEME.textMuted,
    fontSize: 16,
    fontWeight: "900",
  },
  courtInfoCard: {
    backgroundColor: THEME.cardInner,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    alignItems: "center",
  },
  courtInfoText: {
    color: THEME.textMuted,
    fontSize: 12,
  },

  // FOOTBALL EASY SCORING
  footballMatchHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  footballTeamInput: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
    paddingBottom: 2,
  },
  footballScoreBox: {
    alignItems: "center",
    marginHorizontal: 12,
  },
  footballScoreBig: {
    color: THEME.text,
    fontSize: 34,
    fontWeight: "900",
  },
  footballTimeText: {
    color: THEME.danger,
    fontSize: 11,
    fontWeight: "700",
  },
  footballActionRow: {
    flexDirection: "row",
    gap: 10,
  },
  footballGoalBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: THEME.cardInner,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    paddingVertical: 12,
  },
  footballGoalBtnText: {
    color: THEME.text,
    fontSize: 13,
    fontWeight: "800",
  },

  // RECORD CARDS
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
  recordSummary: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 2,
  },

  // PROFILE STYLES
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
  showQrBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: THEME.cardInner,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 10,
  },
  showQrBtnText: {
    color: THEME.text,
    fontSize: 12,
    fontWeight: "700",
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

  // QR CARD MODAL
  qrCard: {
    backgroundColor: THEME.card,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: width * 0.88,
    gap: 14,
  },
  qrCloseBtn: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  qrProfileHeader: {
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  qrAvatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#ce7045",
    alignItems: "center",
    justifyContent: "center",
  },
  qrAvatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  qrName: {
    color: THEME.text,
    fontSize: 17,
    fontWeight: "800",
  },
  qrIdBadge: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  qrDisplayBox: {
    width: 190,
    height: 190,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: THEME.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  qrInnerPattern: {
    alignItems: "center",
    justifyContent: "center",
  },
  qrInstruction: {
    color: THEME.textMuted,
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  qrShareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
  },
  qrShareBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  // COMMON EMPTY CARD
  emptyCard: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    borderStyle: "dashed",
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    paddingHorizontal: 10,
  },
  emptyActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    marginTop: 6,
  },
  emptyActionBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
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
    borderRadius: 12,
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
  gameScoreBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  gameScoreBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: THEME.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 12,
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  modalTitle: {
    color: THEME.text,
    fontSize: 17,
    fontWeight: "800",
  },
  modalSubText: {
    color: THEME.textMuted,
    fontSize: 12,
    lineHeight: 18,
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
  modalActionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 6,
  },
  modalSecondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  modalSecondaryBtnText: {
    color: THEME.text,
    fontSize: 12,
    fontWeight: "700",
  },
  modalPrimaryBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalPrimaryBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  // TELEMETRY & TREND STYLES (Running & Cycling)
  telemetryHero: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
  },
  telemetryHeroRight: {
    alignItems: "flex-end",
  },
  telemetryTag: {
    color: THEME.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  telemetryNumberRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginTop: 2,
  },
  telemetryBigNum: {
    color: THEME.text,
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  telemetryMidNum: {
    color: THEME.text,
    fontSize: 26,
    fontWeight: "900",
  },
  telemetryUnit: {
    color: THEME.textMuted,
    fontSize: 16,
    fontWeight: "700",
  },
  telemetryUnitSmall: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  telemetryTargetBox: {
    gap: 6,
    paddingVertical: 4,
  },
  telemetryTargetMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  telemetryTargetLabel: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  telemetryTargetPercent: {
    fontSize: 12,
    fontWeight: "800",
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: "#EAE4D7",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  telemetryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorder,
  },
  telemetryMetricItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: THEME.cardInner,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  telemetryMetricLabel: {
    color: THEME.textMuted,
    fontSize: 9,
    fontWeight: "800",
  },
  telemetryMetricVal: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "900",
    marginTop: 2,
  },
  trendContainer: {
    backgroundColor: THEME.cardInner,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    gap: 10,
  },
  trendHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
  },
  trendTag: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  trendTitle: {
    color: THEME.text,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 1,
  },
  trendTotalBox: {
    alignItems: "flex-end",
  },
  trendTotalKm: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "900",
  },
  trendGrowth: {
    fontSize: 10,
    fontWeight: "800",
  },
  trendBarsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    paddingTop: 6,
  },
  trendBarCol: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  trendBarKmLabel: {
    color: THEME.textMuted,
    fontSize: 9,
    fontWeight: "700",
  },
  trendBarSlot: {
    flex: 1,
    width: 22,
    backgroundColor: "#FAF7F2",
    borderRadius: 6,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 2,
  },
  trendBarPill: {
    width: "100%",
    borderRadius: 4,
    minHeight: 4,
  },
  trendBarDayLabel: {
    color: THEME.textMuted,
    fontSize: 10,
    fontWeight: "700",
  },
  telemetryActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  telemetryActionBtn: {
    flex: 1,
    minWidth: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  telemetryActionBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  telemetryActionOutline: {
    flex: 1,
    minWidth: 95,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: THEME.cardInner,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  telemetryActionOutlineText: {
    color: THEME.text,
    fontSize: 11,
    fontWeight: "700",
  },
  telemetryActionReset: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: THEME.cardInner,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
});

registerRootComponent(App);
