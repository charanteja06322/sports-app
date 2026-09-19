import http from "node:http";
import { handleEzkoraApi } from "./apiHandler.js";

const PORT = 5173;

const server = http.createServer((req, res) => {
  const handled = handleEzkoraApi(req, res);
  if (!handled) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(JSON.stringify({ status: "ok", message: "EZKORA Supabase Backend API Server" }));
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[EZKORA Backend] Listening on http://0.0.0.0:${PORT} (Connected to Supabase)`);
});
