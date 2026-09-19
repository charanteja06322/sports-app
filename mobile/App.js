import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import Feather from "@expo/vector-icons/Feather";

// 7 Authentic EZKORA Sports Lenses (Football color #ce7045 strictly preserved)
const SPORTS = [
  { name: "Football", emoji: "⚽", accent: "#ce7045", wash: "#f3e3d8", deep: "#87442e", desc: "The beautiful game" },
  { name: "Basketball", emoji: "🏀", accent: "#d47336", wash: "#f5e6d5", deep: "#91461f", desc: "The next possession" },
  { name: "Tennis", emoji: "🎾", accent: "#b89b2e", wash: "#f2edd1", deep: "#756215", desc: "Find your rhythm" },
  { name: "Cricket", emoji: "🏏", accent: "#5e9a70", wash: "#e1eee2", deep: "#356b4b", desc: "The long game" },
  { name: "Running", emoji: "🏃", accent: "#4c9b81", wash: "#dcece5", deep: "#2c6e5a", desc: "One more kilometre" },
  { name: "Cycling", emoji: "🚴", accent: "#557fa9", wash: "#e0e9f0", deep: "#345b80", desc: "Keep the wheels turning" },
  { name: "Volleyball", emoji: "🏐", accent: "#9d6ab0", wash: "#ede3f1", deep: "#704781", desc: "Own the next point" },
];

// Local network API endpoint (connects with Vite backend & Neon DB)
const API_BASE = "http://10.10.0.216:5173/api";

// Guest fallback when no athlete registered yet
const GUEST_ATHLETE = {
  id: "guest",
  publicId: "PL-000000",
  displayName: "Guest Athlete",
  avatarUrl: "",
  primarySport: "Football",
  bio: "Welcome to EZKORA. Register your athlete profile to post and join games.",
};

// Clean Avatar component: renders image if uploaded, or initials fallback
function AthleteAvatar({ url, name, size = 40, accent = "#ce7045", style }) {
  const cleanName = (name || "Athlete").trim();
  const initials = cleanName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  if (url && typeof url === "string" && url.trim().length > 0) {
    return (
      <Image
        source={{ uri: url.trim() }}
        style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
      />
    );
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: accent,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <Text
        style={{
          color: "#ffffff",
          fontSize: Math.max(10, Math.floor(size * 0.38)),
          fontWeight: "bold",
        }}
      >
        {initials || "A"}
      </Text>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts(Feather.font);

  const [activeSport, setActiveSport] = useState("Football");
  const [activeTab, setActiveTab] = useState("feed"); // feed, players, games, scores, profile
  const [me, setMe] = useState(GUEST_ATHLETE);
  const [allAthletes, setAllAthletes] = useState([]);

  // Live data state
  const [posts, setPosts] = useState([]);
  const [games, setGames] = useState([]);

  // Modals state
  const [composerOpen, setComposerOpen] = useState(false);
  const [postCaption, setPostCaption] = useState("");
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [newGameTitle, setNewGameTitle] = useState("");
  const [newGameVenue, setNewGameVenue] = useState("");
  const [searchPlayer, setSearchPlayer] = useState("");

  // Avatar upload & Register modals
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatarInputUrl, setAvatarInputUrl] = useState("");
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [regName, setRegName] = useState("");
  const [regSport, setRegSport] = useState("Football");
  const [regBio, setRegBio] = useState("");

  // Scoring demo state (Clean 0 start)
  const [cricketRuns, setCricketRuns] = useState(0);
  const [cricketWickets, setCricketWickets] = useState(0);
  const [footballHome, setFootballHome] = useState(0);
  const [footballAway, setFootballAway] = useState(0);

  const sportConfig = SPORTS.find((s) => s.name === activeSport) || SPORTS[0];

  // Fetch live data from backend server (Neon PostgreSQL)
  const fetchLiveData = async () => {
    try {
      const res = await fetch(API_BASE + "/feed");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.posts)) setPosts(data.posts);
        if (Array.isArray(data.games)) setGames(data.games);
        if (Array.isArray(data.players) && data.players.length > 0) {
          setAllAthletes(data.players);
          setMe((currentMe) => {
            if (currentMe) {
              return data.players.find((p) => String(p.id) === String(currentMe.id)) || currentMe;
            }
            return data.players[0];
          });
        }
      }
    } catch {
      // offline fallback - gracefully retains current state
    }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Post Submission
  const handlePublishPost = async () => {
    if (!postCaption.trim() || !me) return;
    const newPost = {
      sport: activeSport,
      author: me,
      caption: postCaption.trim(),
      imagePath: null,
    };

    try {
      await fetch(API_BASE + "/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      fetchLiveData();
    } catch {
      // local fallback
      setPosts((p) => [
        {
          id: "p-" + Date.now(),
          ...newPost,
          likeCount: 0,
          likedBy: [],
          comments: [],
          createdAt: new Date().toISOString(),
        },
        ...p,
      ]);
    }

    setPostCaption("");
    setComposerOpen(false);
  };

  // Like Toggle
  const handleToggleLike = async (postId) => {
    if (!me) return;
    try {
      await fetch(API_BASE + "/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId: me.id }),
      });
      fetchLiveData();
    } catch {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          const liked = Array.isArray(p.likedBy) && p.likedBy.includes(String(me.id));
          return {
            ...p,
            likedBy: liked ? p.likedBy.filter((id) => id !== String(me.id)) : [...(p.likedBy || []), String(me.id)],
            likeCount: liked ? Math.max(0, (p.likeCount || 1) - 1) : (p.likeCount || 0) + 1,
          };
        })
      );
    }
  };

  // Game Creation
  const handleCreateGame = async () => {
    if (!newGameTitle.trim() || !me) return;
    const payload = {
      sport: activeSport,
      title: newGameTitle.trim(),
      location: newGameVenue.trim() || "Local Sports Ground",
      scheduledAt: new Date().toISOString(),
      host: me,
    };

    try {
      await fetch(API_BASE + "/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      fetchLiveData();
    } catch {
      setGames((prev) => [
        {
          id: Date.now(),
          ...payload,
          status: "open",
          players: [{ player: me, status: "confirmed" }],
        },
        ...prev,
      ]);
    }

    setNewGameTitle("");
    setNewGameVenue("");
    setGameModalOpen(false);
  };

  // Profile Photo Upload / Update
  const handleSaveAvatar = async () => {
    if (!avatarInputUrl.trim() || !me) {
      Alert.alert("Missing URL", "Please enter a valid image URL for your profile photo.");
      return;
    }

    const cleanUrl = avatarInputUrl.trim();
    try {
      const res = await fetch(API_BASE + "/players/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: me.id, avatarUrl: cleanUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        const updated = data.player || { ...me, avatarUrl: cleanUrl };
        setMe(updated);
        setAllAthletes((prev) => prev.map((a) => (a.id === me.id ? updated : a)));
        Alert.alert("Success", "Profile photo updated successfully!");
      }
    } catch {
      const updated = { ...me, avatarUrl: cleanUrl };
      setMe(updated);
      setAllAthletes((prev) => prev.map((a) => (a.id === me.id ? updated : a)));
    }

    setAvatarModalOpen(false);
    setAvatarInputUrl("");
  };

  // Register New Athlete Account
  const handleRegisterAthlete = async () => {
    if (!regName.trim()) {
      Alert.alert("Name Required", "Please enter your display name.");
      return;
    }

    try {
      const res = await fetch(API_BASE + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: regName.trim(),
          primarySport: regSport,
          bio: regBio.trim(),
          avatarUrl: "", // Start with no photo until user uploads one
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.player) {
          setMe(data.player);
          setAllAthletes((prev) => [...prev, data.player]);
          setActiveSport(data.player.primarySport);
          Alert.alert("Welcome!", `Account created for ${data.player.displayName}`);
        }
      }
    } catch {
      const fallback = {
        id: "usr-" + Date.now(),
        publicId: "PL-" + Math.floor(100000 + Math.random() * 900000),
        displayName: regName.trim(),
        primarySport: regSport,
        bio: regBio.trim(),
        avatarUrl: "",
      };
      setMe(fallback);
      setAllAthletes((prev) => [...prev, fallback]);
    }

    setRegName("");
    setRegBio("");
    setRegisterModalOpen(false);
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#ce7045" />
      </View>
    );
  }

  const filteredPosts = posts.filter((p) => p.sport === activeSport);
  const filteredGames = games.filter((g) => g.sport === activeSport);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />

        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={[styles.logoIcon, { backgroundColor: sportConfig.accent }]}>
              <Text style={styles.logoSymbol}>E</Text>
            </View>
            <View>
              <Text style={styles.brandTitle}>EZKORA</Text>
              <Text style={[styles.brandSubtitle, { color: sportConfig.accent }]}>
                {sportConfig.desc}
              </Text>
            </View>
          </View>

          {me && (
            <TouchableOpacity
              onPress={() => setActiveTab("profile")}
              style={styles.athleteHeaderBadge}
            >
              <AthleteAvatar
                url={me.avatarUrl}
                name={me.displayName}
                size={32}
                accent={sportConfig.accent}
              />
              <Text style={styles.athleteHeaderName}>
                {(me.displayName || "Athlete").split(" ")[0]}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sport Lens Horizontal Strip */}
        <View style={styles.stripContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stripScroll}>
            {SPORTS.map((s) => {
              const isSelected = s.name === activeSport;
              return (
                <TouchableOpacity
                  key={s.name}
                  onPress={() => setActiveSport(s.name)}
                  style={[
                    styles.sportPill,
                    isSelected && { backgroundColor: s.accent, borderColor: s.accent },
                  ]}
                >
                  <Text style={[styles.sportPillText, isSelected && styles.sportPillTextActive]}>
                    {s.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Main Tab Content */}
        <View style={styles.mainContent}>
          {/* 1. FEED TAB */}
          {activeTab === "feed" && (
            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
              {/* Share a moment CTA */}
              <View style={styles.composerCard}>
                <View style={styles.composerRow}>
                  <AthleteAvatar
                    url={me?.avatarUrl}
                    name={me?.displayName}
                    size={38}
                    accent={sportConfig.accent}
                  />
                  <TouchableOpacity
                    onPress={() => setComposerOpen(true)}
                    style={styles.composerInputButton}
                  >
                    <Text style={styles.composerPlaceholder}>
                      Share a {activeSport} highlight or score...
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Feed Posts */}
              {filteredPosts.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>No {activeSport} Posts Yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Be the first athlete to publish a post in this lens!
                  </Text>
                  <TouchableOpacity
                    style={[styles.smallActionBtn, { backgroundColor: sportConfig.accent }]}
                    onPress={() => setComposerOpen(true)}
                  >
                    <Text style={styles.actionBtnText}>+ Publish Post</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                filteredPosts.map((post) => {
                  const isLiked = me && Array.isArray(post.likedBy) && post.likedBy.includes(String(me.id));
                  const commentCount = Array.isArray(post.comments) ? post.comments.length : (post.commentCount || 0);

                  return (
                    <View key={post.id} style={styles.postCard}>
                      <View style={styles.postHeader}>
                        <AthleteAvatar
                          url={post.author?.avatarUrl}
                          name={post.author?.displayName}
                          size={38}
                          accent={sportConfig.accent}
                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.postAuthorName}>
                            {post.author?.displayName || post.author?.publicId || "Athlete"}
                          </Text>
                          <Text style={styles.postAuthorId}>
                            {post.author?.publicId || "Verified"} · {post.sport}
                          </Text>
                        </View>
                        <View style={[styles.sportTag, { backgroundColor: sportConfig.wash }]}>
                          <Text style={[styles.sportTagText, { color: sportConfig.deep }]}>
                            {post.sport}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.postCaption}>{post.caption}</Text>

                      <View style={styles.postActions}>
                        <TouchableOpacity
                          onPress={() => handleToggleLike(post.id)}
                          style={styles.likeBtn}
                        >
                          <Feather
                            name="heart"
                            size={16}
                            color={isLiked ? "#bd5549" : "#71807d"}
                          />
                          <Text style={[styles.likeCountText, isLiked && { color: "#bd5549" }]}>
                            {post.likeCount || 0}
                          </Text>
                        </TouchableOpacity>

                        <View style={styles.commentBtn}>
                          <Feather name="message-square" size={15} color="#71807d" />
                          <Text style={styles.commentBtnText}>{commentCount}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          )}

          {/* 2. PLAYERS TAB */}
          {activeTab === "players" && (
            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
              <View style={styles.searchBar}>
                <Feather name="search" size={16} color="#71807d" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search athletes or PL-XXXXXX ID..."
                  value={searchPlayer}
                  onChangeText={setSearchPlayer}
                />
              </View>

              <Text style={styles.sectionHeaderTitle}>Verified Athletes</Text>
              {allAthletes
                .filter((a) => !me || String(a.id) !== String(me.id))
                .filter((a) => !searchPlayer || (a.displayName && a.displayName.toLowerCase().includes(searchPlayer.toLowerCase())) || (a.publicId && a.publicId.toLowerCase().includes(searchPlayer.toLowerCase())))
                .map((ath) => (
                  <View key={ath.id} style={styles.playerCard}>
                    <AthleteAvatar
                      url={ath.avatarUrl}
                      name={ath.displayName}
                      size={44}
                      accent={sportConfig.accent}
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.playerCardName}>{ath.displayName}</Text>
                      <Text style={styles.playerCardId}>{ath.publicId} · {ath.primarySport}</Text>
                      <Text style={styles.playerCardBio} numberOfLines={1}>{ath.bio || "Active sports member"}</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.connectBtn, { backgroundColor: sportConfig.accent }]}
                      onPress={() => Alert.alert("Connected", `Connection request sent to ${ath.displayName}`)}
                    >
                      <Text style={styles.connectBtnText}>+ Connect</Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </ScrollView>
          )}

          {/* 3. GAMES TAB */}
          {activeTab === "games" && (
            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
              <View style={styles.gamesHeroCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.gamesHeroTitle}>Match Fixtures</Text>
                  <Text style={styles.gamesHeroSub}>Organize or join community matches</Text>
                </View>
                <TouchableOpacity
                  style={[styles.smallActionBtn, { backgroundColor: sportConfig.accent }]}
                  onPress={() => setGameModalOpen(true)}
                >
                  <Text style={styles.actionBtnText}>+ Host Game</Text>
                </TouchableOpacity>
              </View>

              {filteredGames.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>No {activeSport} Games Scheduled</Text>
                  <Text style={styles.emptySubtitle}>Host a session and invite local athletes!</Text>
                </View>
              ) : (
                filteredGames.map((game) => (
                  <View key={game.id} style={styles.gameCard}>
                    <View style={styles.gameCardHeader}>
                      <Text style={styles.gameCardTitle}>{game.title}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: sportConfig.wash }]}>
                        <Text style={[styles.statusBadgeText, { color: sportConfig.deep }]}>
                          {(game.status || "open").toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.metaRow}>
                      <Feather name="map-pin" size={12} color="#71807d" />
                      <Text style={styles.gameCardMeta}>{game.location || "Main Stadium"}</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Feather name="clock" size={12} color="#71807d" />
                      <Text style={styles.gameCardMeta}>
                        {game.scheduledAt ? new Date(game.scheduledAt).toDateString() : "Scheduled"}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.joinGameBtn, { backgroundColor: sportConfig.accent }]}
                      onPress={() => Alert.alert("RSVP", `You are confirmed for ${game.title}`)}
                    >
                      <Text style={styles.actionBtnText}>RSVP / Attend</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>
          )}

          {/* 4. SCORES TAB */}
          {activeTab === "scores" && (
            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
              <View style={styles.scoresHero}>
                <Text style={styles.scoresTitle}>Live Scoring Console</Text>
                <Text style={styles.scoresSub}>Real-time score keeping for match officials</Text>
              </View>

              {activeSport === "Cricket" ? (
                <View style={styles.scoreBoardCard}>
                  <Text style={styles.scoreBoardHeader}>Innings 1 · Match Active</Text>
                  <Text style={styles.cricketRunsDisplay}>
                    {cricketRuns} / {cricketWickets}
                  </Text>
                  <View style={styles.scoreBtnRow}>
                    <TouchableOpacity
                      style={[styles.scoreActionBtn, { backgroundColor: sportConfig.accent }]}
                      onPress={() => setCricketRuns((r) => r + 1)}
                    >
                      <Text style={styles.actionBtnText}>+1 Run</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.scoreActionBtn, { backgroundColor: sportConfig.accent }]}
                      onPress={() => setCricketRuns((r) => r + 4)}
                    >
                      <Text style={styles.actionBtnText}>+4 Boundary</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.scoreActionBtn, { backgroundColor: sportConfig.deep }]}
                      onPress={() => setCricketWickets((w) => w + 1)}
                    >
                      <Text style={styles.actionBtnText}>Wicket</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.scoreBoardCard}>
                  <Text style={styles.scoreBoardHeader}>{activeSport} Scoreboard</Text>
                  <View style={styles.matchScoreRow}>
                    <View style={styles.teamScoreBox}>
                      <Text style={styles.teamName}>City FC</Text>
                      <Text style={styles.teamScoreText}>{footballHome}</Text>
                    </View>
                    <Text style={styles.vsText}>VS</Text>
                    <View style={styles.teamScoreBox}>
                      <Text style={styles.teamName}>United</Text>
                      <Text style={styles.teamScoreText}>{footballAway}</Text>
                    </View>
                  </View>

                  <View style={styles.scoreBtnRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: sportConfig.accent, flex: 1, marginRight: 6 }]}
                      onPress={() => setFootballHome((h) => h + 1)}
                    >
                      <Text style={styles.actionBtnText}>Goal City</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: sportConfig.deep, flex: 1, marginLeft: 6 }]}
                      onPress={() => setFootballAway((a) => a + 1)}
                    >
                      <Text style={styles.actionBtnText}>Goal United</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          )}

          {/* 5. PROFILE TAB */}
          {activeTab === "profile" && (
            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
              {me && (
                <View style={styles.profileHero}>
                  <AthleteAvatar
                    url={me.avatarUrl}
                    name={me.displayName}
                    size={84}
                    accent={sportConfig.accent}
                  />
                  <Text style={styles.profileName}>{me.displayName}</Text>
                  <Text style={styles.profileIdBadge}>{me.publicId} · {me.primarySport}</Text>
                  <Text style={styles.profileBio}>{me.bio || "Sports enthusiast and active competitor."}</Text>

                  {/* Upload Profile Photo Button */}
                  <TouchableOpacity
                    style={[styles.uploadPhotoBtn, { borderColor: sportConfig.accent, backgroundColor: sportConfig.wash }]}
                    onPress={() => setAvatarModalOpen(true)}
                  >
                    <Feather name="camera" size={14} color={sportConfig.deep} />
                    <Text style={[styles.uploadPhotoBtnText, { color: sportConfig.deep }]}>
                      {me.avatarUrl ? "Change Profile Photo" : "Upload Profile Photo"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Athlete Switcher (Multi-User Experience) */}
              <View style={styles.switchHeaderRow}>
                <Text style={styles.sectionHeaderTitle}>Switch Active Athlete</Text>
                <TouchableOpacity onPress={() => setRegisterModalOpen(true)}>
                  <Text style={{ color: sportConfig.accent, fontWeight: "700", fontSize: 13 }}>+ New</Text>
                </TouchableOpacity>
              </View>

              {allAthletes.map((ath) => {
                const isSelected = me && String(ath.id) === String(me.id);
                return (
                  <TouchableOpacity
                    key={ath.id}
                    style={[styles.athleteSwitchCard, isSelected && { borderColor: sportConfig.accent, borderWidth: 2 }]}
                    onPress={() => {
                      setMe(ath);
                      setActiveSport(ath.primarySport || "Football");
                    }}
                  >
                    <AthleteAvatar
                      url={ath.avatarUrl}
                      name={ath.displayName}
                      size={40}
                      accent={sportConfig.accent}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.athleteSwitchName}>{ath.displayName}</Text>
                      <Text style={styles.athleteSwitchSub}>{ath.publicId} · {ath.primarySport}</Text>
                    </View>
                    {isSelected && (
                      <Feather name="check-circle" size={18} color={sportConfig.accent} />
                    )}
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: sportConfig.accent, marginTop: 16 }]}
                onPress={() => setRegisterModalOpen(true)}
              >
                <Text style={styles.actionBtnText}>+ Register New Athlete</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>

        {/* Bottom Tab Navigation Bar - ZERO EMOJIS, 100% FEATHER VECTOR ICONS */}
        <View style={styles.bottomNav}>
          {[
            { key: "feed", label: "Feed", iconName: "home" },
            { key: "players", label: "Players", iconName: "users" },
            { key: "games", label: "Games", iconName: "calendar" },
            { key: "scores", label: "Scores", iconName: "award" },
            { key: "profile", label: "Profile", iconName: "user" },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            const iconColor = isActive ? sportConfig.accent : "#71807d";

            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={styles.navItem}
              >
                <Feather name={tab.iconName} size={22} color={iconColor} />
                <Text
                  style={[
                    styles.navLabel,
                    isActive && { color: sportConfig.accent, fontWeight: "700" },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Upload Profile Photo Modal */}
        <Modal visible={avatarModalOpen} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Upload Profile Photo</Text>
                <TouchableOpacity onPress={() => setAvatarModalOpen(false)}>
                  <Feather name="x" size={20} color="#253638" />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalDescription}>
                Enter the direct image URL of your photo to set your real profile avatar.
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholder="https://example.com/your-photo.jpg"
                value={avatarInputUrl}
                onChangeText={setAvatarInputUrl}
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: sportConfig.accent, marginTop: 15 }]}
                onPress={handleSaveAvatar}
              >
                <Text style={styles.actionBtnText}>Save Profile Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Register New Athlete Modal */}
        <Modal visible={registerModalOpen} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Register Athlete</Text>
                <TouchableOpacity onPress={() => setRegisterModalOpen(false)}>
                  <Feather name="x" size={20} color="#253638" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.modalInput}
                placeholder="Full Name (e.g. Alex Rivera)"
                value={regName}
                onChangeText={setRegName}
              />

              <TextInput
                style={[styles.modalInput, { marginTop: 10 }]}
                placeholder="Primary Sport (Football, Basketball, Cricket...)"
                value={regSport}
                onChangeText={setRegSport}
              />

              <TextInput
                style={[styles.modalInput, { marginTop: 10 }]}
                placeholder="Short Bio (e.g. Midfield playmaker)"
                value={regBio}
                onChangeText={setRegBio}
              />

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: sportConfig.accent, marginTop: 16 }]}
                onPress={handleRegisterAthlete}
              >
                <Text style={styles.actionBtnText}>Create Athlete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Post Composer Modal */}
        <Modal visible={composerOpen} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Share with {activeSport}</Text>
                <TouchableOpacity onPress={() => setComposerOpen(false)}>
                  <Feather name="x" size={20} color="#253638" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.modalTextInput}
                multiline
                numberOfLines={4}
                placeholder={`What happened in ${activeSport.toLowerCase()} today?`}
                value={postCaption}
                onChangeText={setPostCaption}
              />

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: sportConfig.accent, marginTop: 15 }]}
                onPress={handlePublishPost}
              >
                <Text style={styles.actionBtnText}>Publish Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Host Game Modal */}
        <Modal visible={gameModalOpen} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Host {activeSport} Game</Text>
                <TouchableOpacity onPress={() => setGameModalOpen(false)}>
                  <Feather name="x" size={20} color="#253638" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.modalInput}
                placeholder="Match Title (e.g. Sunday 5-a-side)"
                value={newGameTitle}
                onChangeText={setNewGameTitle}
              />

              <TextInput
                style={[styles.modalInput, { marginTop: 10 }]}
                placeholder="Venue / Ground name"
                value={newGameVenue}
                onChangeText={setNewGameVenue}
              />

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: sportConfig.accent, marginTop: 16 }]}
                onPress={handleCreateGame}
              >
                <Text style={styles.actionBtnText}>Create Fixture</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EAE4D7",
    backgroundColor: "#FAF7F2",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  logoSymbol: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#1c2e30",
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: "700",
  },
  athleteHeaderBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAE4D7",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  athleteHeaderName: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 6,
    color: "#253638",
  },
  stripContainer: {
    backgroundColor: "#FAF7F2",
    borderBottomWidth: 1,
    borderBottomColor: "#EAE4D7",
    paddingVertical: 10,
  },
  stripScroll: {
    paddingHorizontal: 14,
  },
  sportPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DDD6C8",
    marginRight: 8,
  },
  sportPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4a5a58",
  },
  sportPillTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  mainContent: {
    flex: 1,
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 30,
  },
  composerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EAE4D7",
  },
  composerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  composerInputButton: {
    flex: 1,
    backgroundColor: "#FAF7F2",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 10,
  },
  composerPlaceholder: {
    fontSize: 13,
    color: "#71807d",
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EAE4D7",
    marginVertical: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1c2e30",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#71807d",
    textAlign: "center",
    marginBottom: 16,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EAE4D7",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  postAuthorName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1c2e30",
  },
  postAuthorId: {
    fontSize: 11,
    color: "#71807d",
    marginTop: 1,
  },
  sportTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sportTagText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  postCaption: {
    fontSize: 14,
    lineHeight: 20,
    color: "#253638",
    marginBottom: 14,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#FAF7F2",
    paddingTop: 10,
  },
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  likeCountText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4a5a58",
    marginLeft: 6,
  },
  commentBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4a5a58",
    marginLeft: 6,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#DDD6C8",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1c2e30",
    marginBottom: 12,
  },
  switchHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EAE4D7",
  },
  playerCardName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1c2e30",
  },
  playerCardId: {
    fontSize: 11,
    color: "#71807d",
    marginTop: 2,
  },
  playerCardBio: {
    fontSize: 12,
    color: "#4a5a58",
    marginTop: 2,
  },
  connectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  connectBtnText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  gamesHeroCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAE4D7",
    marginBottom: 16,
  },
  gamesHeroTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1c2e30",
  },
  gamesHeroSub: {
    fontSize: 11,
    color: "#71807d",
    marginTop: 2,
  },
  gameCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EAE4D7",
  },
  gameCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  gameCardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1c2e30",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: "bold",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  gameCardMeta: {
    fontSize: 12,
    color: "#4a5a58",
    marginLeft: 6,
  },
  joinGameBtn: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  scoresHero: {
    marginBottom: 16,
  },
  scoresTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1c2e30",
  },
  scoresSub: {
    fontSize: 12,
    color: "#71807d",
    marginTop: 2,
  },
  scoreBoardCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAE4D7",
    alignItems: "center",
  },
  scoreBoardHeader: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#71807d",
    textTransform: "uppercase",
    marginBottom: 14,
  },
  cricketRunsDisplay: {
    fontSize: 48,
    fontWeight: "900",
    color: "#1c2e30",
    marginBottom: 20,
  },
  scoreBtnRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  scoreActionBtn: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 10,
    alignItems: "center",
  },
  matchScoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 16,
  },
  teamScoreBox: {
    alignItems: "center",
  },
  teamName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4a5a58",
    marginBottom: 4,
  },
  teamScoreText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#1c2e30",
  },
  vsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9AA4A7",
  },
  profileHero: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EAE4D7",
    marginBottom: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1c2e30",
    marginTop: 10,
  },
  profileIdBadge: {
    fontSize: 12,
    color: "#71807d",
    marginTop: 2,
  },
  profileBio: {
    fontSize: 13,
    color: "#4a5a58",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  uploadPhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 12,
  },
  uploadPhotoBtnText: {
    fontSize: 11,
    fontWeight: "bold",
    marginLeft: 6,
  },
  athleteSwitchCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EAE4D7",
  },
  athleteSwitchName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1c2e30",
  },
  athleteSwitchSub: {
    fontSize: 11,
    color: "#71807d",
    marginTop: 1,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FAF7F2",
    borderTopWidth: 1,
    borderTopColor: "#DDD6C8",
    paddingVertical: 8,
    paddingBottom: Platform.OS === "ios" ? 18 : 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    fontSize: 10,
    marginTop: 3,
    fontWeight: "600",
    color: "#71807d",
  },
  actionBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  smallActionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1c2e30",
  },
  modalDescription: {
    fontSize: 12,
    color: "#71807d",
    marginBottom: 12,
    lineHeight: 16,
  },
  modalInput: {
    backgroundColor: "#FAF7F2",
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    borderWidth: 1,
    borderColor: "#DDD6C8",
  },
  modalTextInput: {
    backgroundColor: "#FAF7F2",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 90,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#DDD6C8",
  },
});
