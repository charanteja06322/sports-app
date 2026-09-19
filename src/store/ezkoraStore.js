import { create } from "zustand";

export const SPORTS = [
  {
    name: "Football",
    descriptor: "The beautiful game",
    accent: "#000000",
    wash: "#ffffff",
    deep: "#09090b",
    phrase: "the next fixture",
    iconKey: "football",
  },
  {
    name: "Basketball",
    descriptor: "The next possession",
    accent: "#d47336",
    wash: "#f5e6d5",
    deep: "#91461f",
    phrase: "the next run",
    iconKey: "basketball",
  },
  {
    name: "Tennis",
    descriptor: "Find your rhythm",
    accent: "#b89b2e",
    wash: "#f2edd1",
    deep: "#756215",
    phrase: "the next rally",
    iconKey: "tennis",
  },
  {
    name: "Cricket",
    descriptor: "The long game",
    accent: "#5e9a70",
    wash: "#e1eee2",
    deep: "#356b4b",
    phrase: "the next innings",
    iconKey: "cricket",
  },
  {
    name: "Running",
    descriptor: "One more kilometre",
    accent: "#4c9b81",
    wash: "#dcece5",
    deep: "#2c6e5a",
    phrase: "the next kilometre",
    iconKey: "running",
  },
  {
    name: "Cycling",
    descriptor: "Keep the wheels turning",
    accent: "#557fa9",
    wash: "#e0e9f0",
    deep: "#345b80",
    phrase: "the next ride",
    iconKey: "cycling",
  },
  {
    name: "Volleyball",
    descriptor: "Own the next point",
    accent: "#9d6ab0",
    wash: "#ede3f1",
    deep: "#704781",
    phrase: "the next point",
    iconKey: "volleyball",
  },
];

const DEFAULT_ATHLETES = [];

let broadcastChannel = null;
if (typeof window !== "undefined" && window.BroadcastChannel) {
  try {
    broadcastChannel = new BroadcastChannel("ezkora_live_channel");
  } catch {
    // fallback
  }
}

export const useEzkoraStore = create((set, get) => ({
  activeSport: "Football",
  me: null,
  allAthletes: [],
  posts: [],
  games: [],
  players: [],
  friends: [],
  isLoading: false,
  lastSynced: null,

  setSport: (sportName) => {
    const found = SPORTS.find((s) => s.name === sportName);
    if (!found) return;
    set({ activeSport: sportName });
  },

  switchAthlete: (athlete) => {
    set({ me: athlete, activeSport: athlete.primarySport || get().activeSport });
    if (typeof window !== "undefined") {
      localStorage.setItem("ezkora_active_user_id", String(athlete.id));
    }
  },

  loginWithGoogle: async ({ email, displayName, avatarUrl, googleId }) => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, displayName, avatarUrl, googleId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.player) {
          set((state) => ({
            me: data.player,
            allAthletes: state.allAthletes.some((a) => a.id === data.player.id)
              ? state.allAthletes
              : [...state.allAthletes, data.player],
            players: state.players.some((p) => p.id === data.player.id)
              ? state.players
              : [...state.players, data.player],
            activeSport: data.player.primarySport || get().activeSport,
          }));
          if (typeof window !== "undefined") {
            localStorage.setItem("ezkora_active_user_id", String(data.player.id));
          }
          get().notifyChange();
          return { success: true, player: data.player };
        }
      }
      return { success: false, error: "Google authentication failed" };
    } catch (e) {
      console.error("Google login error:", e);
      return { success: false, error: e.message };
    }
  },

  loginWithEmailOrId: async ({ identifier, password }) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.player) {
          set((state) => ({
            me: data.player,
            allAthletes: state.allAthletes.some((a) => a.id === data.player.id)
              ? state.allAthletes
              : [...state.allAthletes, data.player],
            players: state.players.some((p) => p.id === data.player.id)
              ? state.players
              : [...state.players, data.player],
            activeSport: data.player.primarySport || get().activeSport,
          }));
          if (typeof window !== "undefined") {
            localStorage.setItem("ezkora_active_user_id", String(data.player.id));
          }
          get().notifyChange();
          return { success: true, player: data.player };
        }
      }
      return { success: false, error: "Invalid athlete ID or email" };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  logout: () => {
    set({ me: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("ezkora_active_user_id");
    }
    get().notifyChange();
  },

  createAthlete: async ({ displayName, bio, avatarUrl, primarySport }) => {
    const newAthlete = {
      id: Date.now(),
      publicId: "PL-" + Math.floor(100000 + Math.random() * 900000),
      displayName: displayName.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl ? avatarUrl.trim() : "",
      primarySport: primarySport || "Football",
    };

    try {
      await fetch("/api/players/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAthlete),
      });
    } catch (e) {
      console.error(e);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("ezkora_active_user_id", String(newAthlete.id));
    }

    set((state) => ({
      me: newAthlete,
      allAthletes: [...state.allAthletes, newAthlete],
      players: [...state.players, newAthlete],
      activeSport: newAthlete.primarySport,
    }));
    get().notifyChange();
    return newAthlete;
  },

  updateProfile: async (updates) => {
    const me = get().me;
    const updated = { ...me, ...updates };

    set((state) => ({
      me: updated,
      allAthletes: state.allAthletes.map((a) => (a.id === me.id ? updated : a)),
      players: state.players.map((p) => (p.id === me.id ? updated : p)),
    }));

    try {
      await fetch("/api/players/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error(e);
    }
    get().notifyChange();
  },

  addPost: async ({ sport, caption, imagePath }) => {
    const me = get().me;
    const postPayload = {
      sport: sport || get().activeSport,
      author: {
        id: me.id,
        publicId: me.publicId,
        displayName: me.displayName,
        avatarUrl: me.avatarUrl,
      },
      caption,
      imagePath: imagePath || null,
    };

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postPayload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.db) {
          set({
            posts: data.db.posts || [],
            games: data.db.games || [],
            players: data.db.players || [],
          });
        }
      }
    } catch (e) {
      console.error("Failed to post:", e);
    }

    get().notifyChange();
  },

  toggleLikePost: async (postId) => {
    const me = get().me;
    try {
      const res = await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId: me.id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.db) {
          set({ posts: data.db.posts || [] });
        }
      }
    } catch (e) {
      console.error("Failed to like:", e);
    }
    get().notifyChange();
  },

  addComment: async (postId, body) => {
    const me = get().me;
    try {
      const res = await fetch("/api/posts/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          author: {
            id: me.id,
            publicId: me.publicId,
            displayName: me.displayName,
            avatarUrl: me.avatarUrl,
          },
          body,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.db) {
          set({ posts: data.db.posts || [] });
        }
      }
    } catch (e) {
      console.error("Failed to comment:", e);
    }
    get().notifyChange();
  },

  addGame: async ({ sport, title, scheduledAt, location }) => {
    const me = get().me;
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport: sport || get().activeSport,
          title,
          scheduledAt,
          location,
          host: {
            id: me.id,
            publicId: me.publicId,
            displayName: me.displayName,
            avatarUrl: me.avatarUrl,
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.db) {
          set({ games: data.db.games || [] });
        }
      }
    } catch (e) {
      console.error("Failed to create game:", e);
    }
    get().notifyChange();
  },

  joinGame: async (gameId) => {
    const me = get().me;
    try {
      const res = await fetch("/api/games/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          player: {
            id: me.id,
            publicId: me.publicId,
            displayName: me.displayName,
            avatarUrl: me.avatarUrl,
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.db) {
          set({ games: data.db.games || [] });
        }
      }
    } catch (e) {
      console.error("Failed to join game:", e);
    }
    get().notifyChange();
  },

  updateRosterStatus: async (gameId, playerId, status) => {
    try {
      const res = await fetch("/api/games/roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, playerId, status }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.db) {
          set({ games: data.db.games || [] });
        }
      }
    } catch (e) {
      console.error("Failed to update roster:", e);
    }
    get().notifyChange();
  },

  sendFriendRequest: async (playerId) => {
    const me = get().me;
    try {
      const res = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromPlayer: me, toPlayerId: playerId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.db) {
          set({ friends: data.db.friends || [] });
        }
      }
    } catch (e) {
      console.error("Failed to send request:", e);
    }
    get().notifyChange();
  },

  respondFriendRequest: async (connectionId, status) => {
    try {
      const res = await fetch("/api/friends/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId, status }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.db) {
          set({ friends: data.db.friends || [] });
        }
      }
    } catch (e) {
      console.error("Failed to respond to request:", e);
    }
    get().notifyChange();
  },

  clearAllData: async () => {
    try {
      const res = await fetch("/api/reset", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        set({
          posts: [],
          games: [],
          friends: [],
          players: data.db?.players || DEFAULT_ATHLETES,
        });
      }
    } catch (e) {
      console.error(e);
    }
    get().notifyChange();
  },

  notifyChange: () => {
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({ type: "SYNC_EVENT", time: Date.now() });
      } catch {
        // ignore
      }
    }
  },

  uploadAvatar: async (avatarUrl) => {
    const me = get().me;
    if (!me) return;
    try {
      const res = await fetch("/api/players/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: me.id, avatarUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        const updated = data.player || { ...me, avatarUrl };
        set((state) => ({
          me: updated,
          allAthletes: state.allAthletes.map((a) => (a.id === me.id ? updated : a)),
          players: state.players.map((p) => (p.id === me.id ? updated : p)),
        }));
        get().notifyChange();
      }
    } catch (e) {
      console.error("Failed to upload avatar:", e);
    }
  },

  fetchLiveData: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 4000) : null;
      const res = await fetch("/api/feed", controller ? { signal: controller.signal } : {});
      if (timeoutId) clearTimeout(timeoutId);
      if (res.ok) {
        const db = await res.json();
        const me = get().me;
        const athletes = db.players && db.players.length > 0 ? db.players : [];
        const savedId = typeof window !== "undefined" ? localStorage.getItem("ezkora_active_user_id") : null;
        const currentMe = me 
          ? (athletes.find((a) => a.id === me.id) || me)
          : (savedId ? (athletes.find((a) => String(a.id) === String(savedId)) || null) : null);

        set({
          posts: db.posts || [],
          games: db.games || [],
          players: athletes,
          allAthletes: athletes,
          friends: db.friends || [],
          me: currentMe,
          lastSynced: new Date().toISOString(),
        });
      }
    } catch (e) {
      // ignore network abort
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Setup Live Sync & Broadcast Listener
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("ezkora_state_v1");
  } catch {}

  // Listen to broadcast from other tabs
  if (broadcastChannel) {
    broadcastChannel.onmessage = () => {
      useEzkoraStore.getState().fetchLiveData();
    };
  }

  // Initial fetch
  useEzkoraStore.getState().fetchLiveData();

  // Background polling every 4 seconds when tab is active
  setInterval(() => {
    if (typeof document !== "undefined" && document.hidden) return;
    useEzkoraStore.getState().fetchLiveData();
  }, 4000);
}

export const useAervoStore = useEzkoraStore;
