import {
  initDatabase,
  dbGetFeed,
  dbRegisterPlayer,
  dbLoginPlayer,
  dbUpdateProfile,
  dbUpdateAvatar,
  dbCreatePost,
  dbToggleLike,
  dbAddComment,
  dbCreateGame,
  dbJoinGame,
  dbInviteToGame,
  dbRecordScore,
  dbResetAll,
  dbGoogleLogin,
} from "./db.js";

// Initialize Supabase database on startup
let initPromise = initDatabase();

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

export function handleEzkoraApi(req, res, next) {
  const url = req.url ? req.url.split("?")[0] : "";

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.end();
    return true;
  }

  if (!url.startsWith("/api/")) {
    if (typeof next === "function") {
      next();
    }
    return false;
  }

  (async () => {
    await initPromise;

    try {
      // 1. GET /api/feed
      if (req.method === "GET" && url === "/api/feed") {
        const feed = await dbGetFeed();
        return sendJson(res, 200, feed);
      }

      // 2. POST /api/players/profile
      if (req.method === "POST" && url === "/api/players/profile") {
        const body = await parseBody(req);
        if (body.id) {
          const updated = await dbUpdateProfile(body);
          return sendJson(res, 200, { success: true, player: updated });
        } else {
          const created = await dbRegisterPlayer(body);
          return sendJson(res, 200, { success: true, player: created });
        }
      }

      // 3. POST /api/players/avatar
      if (req.method === "POST" && url === "/api/players/avatar") {
        const body = await parseBody(req);
        const updated = await dbUpdateAvatar(body.playerId, body.avatarUrl);
        return sendJson(res, 200, { success: true, player: updated });
      }

      // 4. POST /api/auth/register
      if (req.method === "POST" && url === "/api/auth/register") {
        const body = await parseBody(req);
        const player = await dbRegisterPlayer(body);
        return sendJson(res, 200, { success: true, player });
      }

      // 5. POST /api/auth/login
      if (req.method === "POST" && url === "/api/auth/login") {
        const body = await parseBody(req);
        const player = await dbLoginPlayer(body);
        if (player) {
          return sendJson(res, 200, { success: true, player });
        } else {
          return sendJson(res, 401, { success: false, error: "Invalid credentials" });
        }
      }

      // 5b. POST /api/auth/google
      if (req.method === "POST" && url === "/api/auth/google") {
        const body = await parseBody(req);
        const player = await dbGoogleLogin(body);
        return sendJson(res, 200, { success: true, player });
      }

      // 6. POST /api/posts
      if (req.method === "POST" && url === "/api/posts") {
        const body = await parseBody(req);
        const post = await dbCreatePost(body);
        const db = await dbGetFeed();
        return sendJson(res, 200, { success: true, post, db });
      }

      // 7. POST /api/posts/like
      if (req.method === "POST" && url === "/api/posts/like") {
        const body = await parseBody(req);
        const result = await dbToggleLike(body.postId, body.userId);
        const db = await dbGetFeed();
        return sendJson(res, 200, { success: true, ...result, db });
      }

      // 8. POST /api/posts/comment
      if (req.method === "POST" && url === "/api/posts/comment") {
        const body = await parseBody(req);
        const comment = await dbAddComment(body.postId, body.author, body.body);
        const db = await dbGetFeed();
        return sendJson(res, 200, { success: true, comment, db });
      }

      // 9. POST /api/games
      if (req.method === "POST" && url === "/api/games") {
        const body = await parseBody(req);
        const game = await dbCreateGame(body);
        const db = await dbGetFeed();
        return sendJson(res, 200, { success: true, game, db });
      }

      // 10. POST /api/games/join
      if (req.method === "POST" && url === "/api/games/join") {
        const body = await parseBody(req);
        const result = await dbJoinGame(body.gameId, body.player);
        const db = await dbGetFeed();
        return sendJson(res, 200, { success: true, ...result, db });
      }

      // 10b. POST /api/games/invite
      if (req.method === "POST" && url === "/api/games/invite") {
        const body = await parseBody(req);
        const result = await dbInviteToGame(body.gameId, body.player);
        const db = await dbGetFeed();
        return sendJson(res, 200, { success: true, ...result, db });
      }

      // 10c. POST /api/games/score
      if (req.method === "POST" && url === "/api/games/score") {
        const body = await parseBody(req);
        const result = await dbRecordScore(body);
        const db = await dbGetFeed();
        return sendJson(res, 200, { success: true, ...result, db });
      }

      // 11. POST /api/reset
      if (req.method === "POST" && url === "/api/reset") {
        const cleanDb = await dbResetAll();
        return sendJson(res, 200, { success: true, db: cleanDb });
      }

      return sendJson(res, 404, { error: "API route not found" });
    } catch (err) {
      console.error("[EZKORA API Error]", err);
      return sendJson(res, 500, { error: err.message });
    }
  })();

  return true;
}
