import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

console.log("\x1b[36m%s\x1b[0m", "[Aervo Electron] Starting Vite server & Supabase API...");

// 1. Start Vite Server
const vite = spawn("npx", ["vite", "--host", "0.0.0.0", "--port", "5173"], {
  cwd: ROOT_DIR,
  stdio: "inherit",
  shell: true,
});

function checkViteReady(timeout = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      http.get("http://127.0.0.1:5173", (res) => {
        if (res.statusCode >= 200 && res.statusCode < 500) {
          clearInterval(interval);
          resolve(true);
        }
      }).on("error", () => {
        if (Date.now() - start > timeout) {
          clearInterval(interval);
          reject(new Error("Timeout waiting for Vite to start"));
        }
      });
    }, 250);
  });
}

async function run() {
  try {
    await checkViteReady();
    console.log("\x1b[32m%s\x1b[0m", "[Aervo Electron] Vite is ready! Launching Electron desktop window...");

    const electron = spawn("npx", ["electron", "."], {
      cwd: ROOT_DIR,
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        VITE_DEV_SERVER_URL: "http://localhost:5173",
      },
    });

    electron.on("close", (code) => {
      console.log(`[Aervo Electron] App closed with code ${code}`);
      vite.kill();
      process.exit(code || 0);
    });

    process.on("SIGINT", () => {
      vite.kill();
      electron.kill();
      process.exit(0);
    });
  } catch (err) {
    console.error("[Aervo Electron] Failed to launch:", err.message);
    vite.kill();
    process.exit(1);
  }
}

run();
