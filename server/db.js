import pg from "pg";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DB_PATH = path.resolve(__dirname, "../data/aervo_db.json");

let pool = null;
let isCloudConnected = false;

if (process.env.DATABASE_URL) {
  try {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
    });
  } catch (err) {
    console.warn("[Aervo DB] Failed to instantiate pg Pool:", err.message);
  }
}

// Fallback JSON DB functions
function readLocalDb() {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      const init = { version: 1, posts: [], games: [], players: [], friends: [] };
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(init, null, 2), "utf8");
      return init;
    }
    const raw = fs.readFileSync(LOCAL_DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return { version: 1, posts: [], games: [], players: [], friends: [] };
  }
}

function writeLocalDb(data) {
  try {
    data.version = (data.version || 0) + 1;
    data.updatedAt = new Date().toISOString();
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf8");
    return data;
  } catch (e) {
    console.error("[Aervo DB] Local write error:", e);
    return data;
  }
}

// Ensure schema in Supabase is up to date
export async function initDatabase() {
  if (!pool) {
    console.log("[Aervo DB] No DATABASE_URL, using local JSON database.");
    return false;
  }

  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE,
          password_hash TEXT,
          full_name TEXT NOT NULL,
          phone TEXT,
          avatar_url TEXT,
          bio TEXT DEFAULT '',
          primary_sport VARCHAR(50) DEFAULT 'Football',
          player_id TEXT UNIQUE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        ALTER TABLE users ADD COLUMN IF NOT EXISTS primary_sport VARCHAR(50) DEFAULT 'Football';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

        CREATE TABLE IF NOT EXISTS posts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          match_id UUID,
          sport VARCHAR(50) DEFAULT 'Football',
          content TEXT NOT NULL,
          image_url TEXT,
          likes_count INT DEFAULT 0,
          comments_count INT DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        ALTER TABLE posts ADD COLUMN IF NOT EXISTS sport VARCHAR(50) DEFAULT 'Football';

        CREATE TABLE IF NOT EXISTS post_likes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(post_id, user_id)
        );

        CREATE TABLE IF NOT EXISTS post_comments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS matches (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          sport VARCHAR(50) DEFAULT 'Football',
          match_code TEXT,
          match_date TIMESTAMPTZ DEFAULT NOW(),
          status VARCHAR(50) DEFAULT 'scheduled',
          team1_name TEXT,
          team2_name TEXT,
          created_by UUID REFERENCES users(id) ON DELETE SET NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      isCloudConnected = true;
      console.log("[Aervo DB] Connected to Supabase / PostgreSQL and verified schema successfully.");
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("[Aervo DB] Error connecting to cloud database, falling back to local JSON:", err.message);
    isCloudConnected = false;
    return false;
  }
}

// Format player object consistently (Zero fake mock avatars)
function formatPlayer(u) {
  if (!u) return null;
  return {
    id: u.id,
    publicId: u.player_id || "PL-" + String(u.id).substring(0, 6),
    displayName: u.full_name || u.displayName || "Athlete",
    email: u.email || "",
    bio: u.bio || "",
    avatarUrl: u.avatar_url || u.avatarUrl || "", // Only populated if user explicitly uploaded
    primarySport: u.primary_sport || u.primarySport || "Football",
    createdAt: u.created_at || u.createdAt,
  };
}

// 1. Get Feed
export async function dbGetFeed() {
  if (isCloudConnected && pool) {
    try {
      const [usersRes, postsRes, likesRes, commentsRes, matchesRes] = await Promise.all([
        pool.query(`SELECT * FROM users ORDER BY created_at ASC`),
        pool.query(`SELECT * FROM posts ORDER BY created_at DESC`),
        pool.query(`SELECT post_id, user_id FROM post_likes`),
        pool.query(`
          SELECT pc.*, u.full_name, u.avatar_url, u.player_id, u.primary_sport
          FROM post_comments pc
          LEFT JOIN users u ON pc.user_id = u.id
          ORDER BY pc.created_at ASC
        `),
        pool.query(`SELECT * FROM matches ORDER BY match_date ASC`),
      ]);

      const players = usersRes.rows.map(formatPlayer);
      const playersMap = {};
      players.forEach((p) => {
        playersMap[p.id] = p;
      });

      const likesByPost = {};
      likesRes.rows.forEach((l) => {
        if (!likesByPost[l.post_id]) likesByPost[l.post_id] = [];
        likesByPost[l.post_id].push(String(l.user_id));
      });

      const commentsByPost = {};
      commentsRes.rows.forEach((c) => {
        if (!commentsByPost[c.post_id]) commentsByPost[c.post_id] = [];
        commentsByPost[c.post_id].push({
          id: c.id,
          body: c.content,
          author: formatPlayer({
            id: c.user_id,
            full_name: c.full_name,
            avatar_url: c.avatar_url,
            player_id: c.player_id,
            primary_sport: c.primary_sport,
          }),
          createdAt: c.created_at,
        });
      });

      const posts = postsRes.rows.map((p) => {
        const author = playersMap[p.user_id] || {
          id: p.user_id,
          displayName: "Athlete",
          avatarUrl: "",
          primarySport: p.sport || "Football",
        };
        const likedBy = likesByPost[p.id] || [];
        const comments = commentsByPost[p.id] || [];

        return {
          id: p.id,
          sport: p.sport || "Football",
          author,
          caption: p.content,
          imagePath: p.image_url,
          likeCount: likedBy.length || p.likes_count || 0,
          likedBy,
          comments,
          commentCount: comments.length || p.comments_count || 0,
          createdAt: p.created_at,
        };
      });

      const games = matchesRes.rows.map((m) => ({
        id: m.id,
        sport: m.sport || "Football",
        title: m.team1_name && m.team2_name ? `${m.team1_name} vs ${m.team2_name}` : m.match_code ? `Match ${m.match_code}` : "Game Fixture",
        location: "Main Ground",
        scheduledAt: m.match_date,
        status: m.status || "open",
        host: playersMap[m.created_by] || players[0] || null,
        players: [],
        createdAt: m.created_at,
      }));

      return { posts, games, players, friends: [] };
    } catch (e) {
      console.error("[Aervo DB] Feed fetch error Supabase:", e.message);
    }
  }

  // Local fallback
  return readLocalDb();
}

// 2. Register Player
export async function dbRegisterPlayer({ displayName, email, password, primarySport, bio, avatarUrl }) {
  const publicId = "PL-" + Math.floor(100000 + Math.random() * 900000);
  const cleanName = (displayName || "Athlete").trim();
  const cleanSport = primarySport || "Football";
  const cleanBio = bio || "";
  const cleanAvatar = avatarUrl || null;
  const cleanEmail = email ? email.toLowerCase().trim() : `${cleanName.toLowerCase().replace(/\s+/g, "")}${Math.floor(100 + Math.random()*900)}@sports.com`;

  if (isCloudConnected && pool) {
    try {
      const res = await pool.query(
        `INSERT INTO users (full_name, email, password_hash, primary_sport, bio, avatar_url, player_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [cleanName, cleanEmail, password || null, cleanSport, cleanBio, cleanAvatar, publicId]
      );
      return formatPlayer(res.rows[0]);
    } catch (e) {
      console.error("[Aervo DB] Register error Supabase:", e.message);
      throw e;
    }
  }

  const local = readLocalDb();
  const newPlayer = {
    id: crypto.randomUUID ? crypto.randomUUID() : "usr-" + Date.now(),
    publicId,
    displayName: cleanName,
    email: cleanEmail,
    bio: cleanBio,
    avatarUrl: cleanAvatar || "",
    primarySport: cleanSport,
    createdAt: new Date().toISOString(),
  };
  if (!local.players) local.players = [];
  local.players.push(newPlayer);
  writeLocalDb(local);
  return newPlayer;
}

// 3. Login Player
export async function dbLoginPlayer({ email, password }) {
  const cleanEmail = (email || "").toLowerCase().trim();

  if (isCloudConnected && pool) {
    try {
      const res = await pool.query(
        `SELECT * FROM users
         WHERE LOWER(email) = $1 OR LOWER(full_name) = $1 OR player_id = $2
         LIMIT 1`,
        [cleanEmail, email.trim()]
      );
      if (res.rows.length === 0) return null;
      return formatPlayer(res.rows[0]);
    } catch (e) {
      console.error("[Aervo DB] Login error Supabase:", e.message);
    }
  }

  const local = readLocalDb();
  const user = (local.players || []).find(
    (p) => (p.email && p.email.toLowerCase() === cleanEmail) || p.displayName.toLowerCase() === cleanEmail || p.publicId === email
  );
  return user ? formatPlayer(user) : null;
}

// 4. Update Profile
export async function dbUpdateProfile({ id, displayName, bio, primarySport, avatarUrl }) {
  if (isCloudConnected && pool) {
    try {
      const fields = [];
      const values = [];
      let idx = 1;

      if (displayName !== undefined) {
        fields.push(`full_name = $${idx++}`);
        values.push(displayName.trim());
      }
      if (bio !== undefined) {
        fields.push(`bio = $${idx++}`);
        values.push(bio.trim());
      }
      if (primarySport !== undefined) {
        fields.push(`primary_sport = $${idx++}`);
        values.push(primarySport);
      }
      if (avatarUrl !== undefined) {
        fields.push(`avatar_url = $${idx++}`);
        values.push(avatarUrl);
      }

      if (fields.length > 0) {
        values.push(id);
        const res = await pool.query(
          `UPDATE users SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${idx}
           RETURNING *`,
          values
        );
        return formatPlayer(res.rows[0]);
      }
    } catch (e) {
      console.error("[Aervo DB] Update profile error Supabase:", e.message);
    }
  }

  const local = readLocalDb();
  const player = (local.players || []).find((p) => p.id === id);
  if (player) {
    if (displayName !== undefined) player.displayName = displayName.trim();
    if (bio !== undefined) player.bio = bio.trim();
    if (primarySport !== undefined) player.primarySport = primarySport;
    if (avatarUrl !== undefined) player.avatarUrl = avatarUrl;
    writeLocalDb(local);
    return player;
  }
  return null;
}

// 5. Update Avatar Photo
export async function dbUpdateAvatar(playerId, avatarUrl) {
  return dbUpdateProfile({ id: playerId, avatarUrl });
}

// 6. Create Post
export async function dbCreatePost({ sport, author, caption, imagePath }) {
  const cleanSport = sport || "Football";
  const cleanCaption = (caption || "").trim();

  if (isCloudConnected && pool) {
    try {
      const res = await pool.query(
        `INSERT INTO posts (user_id, sport, content, image_url, likes_count, comments_count)
         VALUES ($1, $2, $3, $4, 0, 0)
         RETURNING *`,
        [author?.id, cleanSport, cleanCaption, imagePath || null]
      );
      const row = res.rows[0];
      return {
        id: row.id,
        sport: row.sport || cleanSport,
        author: formatPlayer(author),
        caption: row.content,
        imagePath: row.image_url,
        likeCount: 0,
        likedBy: [],
        comments: [],
        commentCount: 0,
        createdAt: row.created_at,
      };
    } catch (e) {
      console.error("[Aervo DB] Create post error Supabase:", e.message);
    }
  }

  const local = readLocalDb();
  const newPost = {
    id: crypto.randomUUID ? crypto.randomUUID() : "post-" + Date.now(),
    sport: cleanSport,
    author: formatPlayer(author),
    caption: cleanCaption,
    imagePath: imagePath || null,
    likeCount: 0,
    likedBy: [],
    comments: [],
    commentCount: 0,
    createdAt: new Date().toISOString(),
  };
  if (!local.posts) local.posts = [];
  local.posts.unshift(newPost);
  writeLocalDb(local);
  return newPost;
}

// 7. Toggle Like
export async function dbToggleLike(postId, userId) {
  const uidStr = String(userId);

  if (isCloudConnected && pool) {
    try {
      const check = await pool.query(
        `SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2`,
        [postId, userId]
      );

      if (check.rows.length > 0) {
        await pool.query(`DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2`, [postId, userId]);
        await pool.query(`UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = $1`, [postId]);
      } else {
        await pool.query(`INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [postId, userId]);
        await pool.query(`UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1`, [postId]);
      }

      const countRes = await pool.query(`SELECT count(*) FROM post_likes WHERE post_id = $1`, [postId]);
      const newCount = parseInt(countRes.rows[0].count, 10);
      return { postId, hasLiked: check.rows.length === 0, likeCount: newCount };
    } catch (e) {
      console.error("[Aervo DB] Toggle like error Supabase:", e.message);
    }
  }

  const local = readLocalDb();
  const post = (local.posts || []).find((p) => p.id === postId);
  if (post) {
    if (!post.likedBy) post.likedBy = [];
    const hasLiked = post.likedBy.includes(uidStr);
    if (hasLiked) {
      post.likedBy = post.likedBy.filter((id) => id !== uidStr);
      post.likeCount = Math.max(0, (post.likeCount || 1) - 1);
    } else {
      post.likedBy.push(uidStr);
      post.likeCount = (post.likeCount || 0) + 1;
    }
    writeLocalDb(local);
    return { postId, likedBy: post.likedBy, likeCount: post.likeCount };
  }
  return null;
}

// 8. Add Comment
export async function dbAddComment(postId, author, body) {
  const cleanBody = (body || "").trim();

  if (isCloudConnected && pool) {
    try {
      const res = await pool.query(
        `INSERT INTO post_comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *`,
        [postId, author?.id, cleanBody]
      );
      await pool.query(`UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1`, [postId]);
      const row = res.rows[0];
      return {
        id: row.id,
        postId,
        author: formatPlayer(author),
        body: cleanBody,
        createdAt: row.created_at,
      };
    } catch (e) {
      console.error("[Aervo DB] Add comment error Supabase:", e.message);
    }
  }

  const local = readLocalDb();
  const post = (local.posts || []).find((p) => p.id === postId);
  if (post) {
    if (!post.comments) post.comments = [];
    const newComment = {
      id: "c-" + Date.now(),
      author: formatPlayer(author),
      body: cleanBody,
      createdAt: new Date().toISOString(),
    };
    post.comments.push(newComment);
    post.commentCount = post.comments.length;
    writeLocalDb(local);
    return newComment;
  }
  return null;
}

// 9. Create Game / Match
export async function dbCreateGame({ sport, title, location, scheduledAt, host }) {
  const cleanSport = sport || "Football";
  const cleanTitle = (title || "").trim();
  const scheduled = scheduledAt || new Date().toISOString();

  if (isCloudConnected && pool) {
    try {
      const res = await pool.query(
        `INSERT INTO matches (sport, match_code, match_date, status, team1_name, created_by)
         VALUES ($1, $2, $3, 'scheduled', $4, $5)
         RETURNING *`,
        [cleanSport, "M-" + Math.floor(1000 + Math.random() * 9000), scheduled, cleanTitle, host?.id]
      );
      const row = res.rows[0];
      return {
        id: row.id,
        sport: cleanSport,
        title: cleanTitle,
        location: location || "Main Stadium",
        scheduledAt: scheduled,
        status: "open",
        host: formatPlayer(host),
        players: [{ player: formatPlayer(host), status: "confirmed" }],
        createdAt: row.created_at,
      };
    } catch (e) {
      console.error("[Aervo DB] Create match error Supabase:", e.message);
    }
  }

  const local = readLocalDb();
  const newGame = {
    id: Date.now(),
    sport: cleanSport,
    title: cleanTitle,
    location: location || "Venue to be shared",
    scheduledAt: scheduled,
    status: "open",
    host: formatPlayer(host),
    players: [{ player: formatPlayer(host), status: "confirmed" }],
    createdAt: new Date().toISOString(),
  };
  if (!local.games) local.games = [];
  local.games.unshift(newGame);
  writeLocalDb(local);
  return newGame;
}

// 10. Join Game
export async function dbJoinGame(gameId, player) {
  return { success: true };
}

// 11. Clear all data for clean slate
export async function dbResetAll() {
  if (isCloudConnected && pool) {
    try {
      await pool.query(`TRUNCATE TABLE matches, post_comments, post_likes, posts, users CASCADE;`);
      console.log("[Aervo DB] Supabase database wiped to 100% clean state.");
    } catch (err) {
      console.error("[Aervo DB] Error wiping Supabase tables:", err.message);
    }
  }
  const clean = { version: 1, posts: [], games: [], players: [], friends: [], updatedAt: new Date().toISOString() };
  writeLocalDb(clean);
  return clean;
}
