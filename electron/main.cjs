const { app, BrowserWindow, shell } = require("electron");
const path = require("path");

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 420,
    minHeight: 600,
    title: "EZKORA - Authentic Sports Platform",
    backgroundColor: "#1c2e30",
    show: true, // Show immediately so it never hangs hidden
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const isDev = process.env.NODE_ENV !== "production";
  const devUrl = process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";

  if (isDev) {
    mainWindow.loadURL(devUrl).catch(() => {
      // If initial load fails, will be caught by did-fail-load handler below
    });

    // Auto-retry if Vite was still booting
    let retryCount = 0;
    mainWindow.webContents.on("did-fail-load", () => {
      if (retryCount < 10) {
        retryCount++;
        setTimeout(() => {
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.loadURL(devUrl).catch(() => {});
          }
        }, 500);
      } else {
        // Fallback to local built index.html if Vite is unreachable
        mainWindow.loadFile(path.join(__dirname, "../dist/index.html")).catch(() => {});
      }
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // Open external links in user's default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http:") || url.startsWith("https:")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
