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
  const devUrl = process.env.VITE_DEV_SERVER_URL || "http://127.0.0.1:5173";

  // Forward renderer console logs to terminal for real-time visibility
  mainWindow.webContents.on("console-message", (event, level, message, line, sourceId) => {
    console.log(`[Renderer] ${message}`);
  });

  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (!isMainFrame || errorCode === -3) return;
    console.warn(`[Electron] Load failed: ${validatedURL} (${errorCode}: ${errorDescription})`);
    // If dev URL fails, fallback to local dist/index.html
    if (isDev) {
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.loadFile(path.join(__dirname, "../dist/index.html")).catch(() => {});
        }
      }, 1000);
    }
  });

  mainWindow.webContents.on("did-finish-load", async () => {
    try {
      const title = await mainWindow.webContents.executeJavaScript("document.title");
      const rootChildren = await mainWindow.webContents.executeJavaScript("document.getElementById('root')?.children.length || 0");
      console.log(`[Electron] Page rendered! Title: "${title}", Root DOM children: ${rootChildren}`);
    } catch (e) {
      console.error("[Electron] Eval error:", e.message);
    }
  });

  if (isDev && devUrl) {
    console.log(`[Electron] Connecting to: ${devUrl}`);
    mainWindow.loadURL(devUrl).catch(() => {
      mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // Toggle DevTools with F12 or Cmd+Alt+I
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F12" || ((input.meta || input.control) && input.alt && input.key.toLowerCase() === "i")) {
      mainWindow.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

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
