import { spawn, execSync } from "node:child_process";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

console.log("\x1b[36m%s\x1b[0m", "[EZKORA Electron] Preparing environment...");

// Ensure port 5173 is free from any previous orphaned processes
try {
  const pids = execSync("lsof -ti:5173 2>/dev/null", { encoding: "utf8" }).trim();
  if (pids) {
    console.log(`[EZKORA Electron] Freeing port 5173 (killing PID: ${pids.replace(/\n/g, ", ")})`);
    execSync(`kill -9 ${pids.replace(/\n/g, " ")} 2>/dev/null`);
  }
} catch {
  // Port is already free
}

console.log("\x1b[36m%s\x1b[0m", "[EZKORA Electron] Starting Vite server & Supabase API...");

// 1. Start Vite Server
const vite = spawn("npx", ["vite", "--host", "0.0.0.0", "--port", "5173"], {
  cwd: ROOT_DIR,
  stdio: "inherit",
  shell: true,
});

function checkViteReady(maxAttempts = 30) {
  let attempts = 0;
  return new Promise((resolve) => {
    const tryConnect = () => {
      attempts++;
      const req = http.get("http://127.0.0.1:5173", { timeout: 800 }, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 500) {
          resolve(true);
        } else if (attempts < maxAttempts) {
          setTimeout(tryConnect, 300);
        } else {
          resolve(false);
        }
      });

      req.on("timeout", () => {
        req.destroy();
        if (attempts < maxAttempts) setTimeout(tryConnect, 300);
        else resolve(false);
      });

      req.on("error", () => {
        if (attempts < maxAttempts) setTimeout(tryConnect, 300);
        else resolve(false);
      });
    };

    tryConnect();
  });
}

async function run() {
  try {
    await checkViteReady();
    console.log("\x1b[32m%s\x1b[0m", "[EZKORA Electron] Launching desktop application window...");

    const electron = spawn("npx", ["electron", "."], {
      cwd: ROOT_DIR,
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        VITE_DEV_SERVER_URL: "http://127.0.0.1:5173",
      },
    });

    electron.on("close", (code) => {
      console.log(`[EZKORA Electron] Application closed (code ${code || 0})`);
      vite.kill();
      process.exit(code || 0);
    });

    process.on("SIGINT", () => {
      vite.kill();
      electron.kill();
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      vite.kill();
      electron.kill();
      process.exit(0);
    });
  } catch (err) {
    console.error("[EZKORA Electron] Failed to launch:", err.message);
    vite.kill();
    process.exit(1);
  }
}

run();
