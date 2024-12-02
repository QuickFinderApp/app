import { app, BrowserWindow, globalShortcut, ipcMain } from "electron";
import ipc from "./ipc";
import { createOverlayWindow } from "./windows/overlay";
import { getFocusedDisplayBounds } from "./utils";

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line @typescript-eslint/no-require-imports
if (require("electron-squirrel-startup")) {
  app.quit();
}

type SpotterWindowType = {
  window: BrowserWindow;
  show: () => void;
  hide: () => void;
};
let spotterWindow: SpotterWindowType | null = null;

const createSpotterWindow = (): void => {
  if (spotterWindow) {
    spotterWindow.show();
    return;
  }

  // Create the browser window.
  const packaged = app.isPackaged;
  const devMode = !packaged;

  const mainWindow = new BrowserWindow({
    height: 482,
    width: 768,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: false,
      devTools: devMode
    },
    movable: true,
    frame: false,
    resizable: false,
    show: false,
    vibrancy: "fullscreen-ui", // on MacOS
    backgroundMaterial: "acrylic" // on Windows 11
  });

  // Load the page
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (devMode) {
    mainWindow.webContents.openDevTools({
      mode: "detach"
    });
  }

  function hideMainWindow() {
    mainWindow.hide();
  }
  function showMainWindow() {
    const { x, y, width, height } = getFocusedDisplayBounds();
    const windowBounds = mainWindow.getBounds();
    mainWindow.show();

    const xOffset = Math.round((width - windowBounds.width) / 2);
    const yOffset = Math.round((height - windowBounds.height) / 2);
    mainWindow.setPosition(x + xOffset, y + yOffset);
    mainWindow.focus();
  }

  // Set shortcut
  mainWindow.on("blur", hideMainWindow);

  // Listen for close
  mainWindow.on("closed", () => {
    spotterWindow = null;
  });

  showMainWindow();

  spotterWindow = {
    window: mainWindow,
    show: showMainWindow,
    hide: hideMainWindow
  };
};

ipc.init();
ipcMain.handle("open-spotter", () => spotterWindow?.show());
ipcMain.handle("hide-spotter", () => spotterWindow?.hide());

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  globalShortcut.register("CommandOrControl+Space", () => {
    if (!spotterWindow) {
      return createSpotterWindow();
    }

    if (spotterWindow.window.isFocused()) {
      spotterWindow.hide();
    } else {
      spotterWindow.show();
    }
  });

  createSpotterWindow();
  createOverlayWindow();
});

app.on("activate", () => {
  createSpotterWindow();
});

app.on("window-all-closed", function () {
  /* surprise: nothing! */
});
