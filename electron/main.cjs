const { app, BrowserWindow, shell } = require("electron");
const path = require("path");
const http = require("http");

let mainWindow = null;

function waitForServer(url, timeout = 15000) {
  const start = Date.now();
  return new Promise((resolve) => {
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve(true);
        } else {
          retry();
        }
      }).on("error", () => {
        retry();
      });
    };

    const retry = () => {
      if (Date.now() - start > timeout) {
        resolve(false);
      } else {
        setTimeout(check, 300);
      }
    };

    check();
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 420,
    minHeight: 600,
    title: "Aervo - Authentic Sports Platform",
    backgroundColor: "#1c2e30",
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const isDev = process.env.NODE_ENV !== "production";
  const devUrl = process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";

  if (isDev) {
    const serverReady = await waitForServer(devUrl);
    if (serverReady) {
      mainWindow.loadURL(devUrl);
    } else {
      mainWindow.loadFile(path.join(__dirname, "../dist/index.html")).catch(() => {
        mainWindow.loadURL(devUrl);
      });
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Open external links in default browser
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
