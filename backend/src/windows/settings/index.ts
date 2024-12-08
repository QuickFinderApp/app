import { BrowserWindow, ipcMain } from "electron";
import { createWindowManager } from "../../modules/windows-manager";
import { IS_DEV_MODE } from "../../config";

declare const SETTINGS_WINDOW_WEBPACK_ENTRY: string;
declare const SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const WINDOW_ID = "settings";
const {
  getWindow: getSettingsWindow,
  setWindow: setSettingsWindow,
  removeWindow: removeSettingsWindow
} = createWindowManager(WINDOW_ID);

export const createSettingsWindow = (): void => {
  const windowData = getSettingsWindow();
  if (windowData) {
    windowData.show();
    return;
  }

  // Create the browser window.
  const window = new BrowserWindow({
    title: "Settings",
    height: 500,
    width: 800,
    webPreferences: {
      preload: SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: false,
      devTools: IS_DEV_MODE
    },
    minHeight: 400,
    minWidth: 700,
    movable: true,
    transparent: false,
    frame: false,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      height: 30,
      color: "#000000",
      symbolColor: "#ffffff"
    },
    resizable: true,
    show: false,
    vibrancy: "fullscreen-ui" // on MacOS
  });

  // Load the page
  window.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (IS_DEV_MODE) {
    window.webContents.openDevTools({
      mode: "detach"
    });
  }

  function hideMainWindow() {
    window.hide();
  }
  function showMainWindow() {
    window.show();
  }

  window.once("ready-to-show", () => {
    window.webContents.setZoomFactor(1);
    window.webContents.setVisualZoomLevelLimits(1, 1);
    showMainWindow();
  });

  // Listen for close
  window.on("closed", () => {
    removeSettingsWindow();
  });

  setSettingsWindow({
    window: window,
    show: showMainWindow,
    hide: hideMainWindow,
    hiddenFromDock: false
  });
};

ipcMain.handle("open-settings", () => createSettingsWindow());
ipcMain.handle("hide-settings", () => getSettingsWindow()?.hide());
