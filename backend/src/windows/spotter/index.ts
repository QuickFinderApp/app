import { app, BrowserWindow, globalShortcut, ipcMain } from "electron";
import { getFocusedDisplayBounds } from "../../modules/utils";
import { createWindowManager } from "../../modules/windows-manager";
import { IS_DEV_MODE } from "../../config";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const WINDOW_ID = "spotter";
const {
  getWindow: getSpotterWindow,
  setWindow: setSpotterWindow,
  removeWindow: removeSpotterWindow
} = createWindowManager(WINDOW_ID);

let USER_HIDE_ON_FOCUS_LOST = true;
function setUserHideOnFocusLost(value: boolean) {
  USER_HIDE_ON_FOCUS_LOST = value;
  computeHideOnFocusLost();
}

let SYSTEM_HIDE_ON_FOCUS_LOST = true;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setSystemHideOnFocusLost(value: boolean) {
  SYSTEM_HIDE_ON_FOCUS_LOST = value;
  computeHideOnFocusLost();
}

let HIDE_ON_FOCUS_LOST = true;
function computeHideOnFocusLost() {
  HIDE_ON_FOCUS_LOST = USER_HIDE_ON_FOCUS_LOST && SYSTEM_HIDE_ON_FOCUS_LOST;
}

export const createSpotterWindow = (): void => {
  const windowData = getSpotterWindow();
  if (windowData) {
    windowData.show();
    return;
  }

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: "Spotter",
    height: 482,
    width: 768,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: false,
      devTools: IS_DEV_MODE
    },
    movable: true,
    transparent: true,
    frame: false,
    resizable: false,
    show: false,
    alwaysOnTop: true,
    vibrancy: "fullscreen-ui", // on MacOS
    backgroundMaterial: "acrylic", // on Windows
    skipTaskbar: true // on Windows
  });

  // Load the page
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (IS_DEV_MODE) {
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
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.webContents.setZoomFactor(1);
    mainWindow.webContents.setVisualZoomLevelLimits(1, 1);
    showMainWindow();
  });

  // Hide the window when it loses focus
  mainWindow.on("blur", () => {
    if (!HIDE_ON_FOCUS_LOST) return;

    hideMainWindow();
  });

  // Listen for close
  mainWindow.on("closed", () => {
    removeSpotterWindow();
  });

  setSpotterWindow({
    window: mainWindow,
    show: showMainWindow,
    hide: hideMainWindow,
    hiddenFromDock: true
  });
};

ipcMain.handle("open-spotter", () => createSpotterWindow());
ipcMain.handle("hide-spotter", () => getSpotterWindow()?.hide());

ipcMain.handle("get-hide-spotter-on-focus-lost", () => USER_HIDE_ON_FOCUS_LOST);
ipcMain.handle("set-hide-spotter-on-focus-lost", (event, bool: boolean) => {
  setUserHideOnFocusLost(bool);
});

app.on("ready", () => {
  globalShortcut.register("CommandOrControl+Space", () => {
    if (!getSpotterWindow()) {
      return createSpotterWindow();
    }

    const spotterWindow = getSpotterWindow();
    if (spotterWindow && spotterWindow.window.isFocused() && spotterWindow.window.isVisible()) {
      spotterWindow.hide();
    } else {
      spotterWindow.show();
    }
  });
});
