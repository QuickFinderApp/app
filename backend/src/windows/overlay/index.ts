import { BrowserWindow, ipcMain } from "electron";
import { getFocusedDisplayBounds } from "../../modules/utils";
import { createWindowManager } from "../../modules/windows-manager";
import { IS_DEV_MODE } from "../../config";

declare const OVERLAY_WINDOW_WEBPACK_ENTRY: string;
declare const OVERLAY_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const WINDOW_ID = "overlay";
const {
  getWindow: getOverlayWindow,
  setWindow: setOverlayWindow,
  removeWindow: removeOverlayWindow
} = createWindowManager(WINDOW_ID);

export const createOverlayWindow = (): void => {
  const windowData = getOverlayWindow();
  if (windowData) {
    windowData.show();
    return;
  }

  // Create the browser window.
  const window = new BrowserWindow({
    title: "Overlay",
    height: 500,
    width: 800,
    webPreferences: {
      preload: OVERLAY_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: false,
      devTools: IS_DEV_MODE
    },
    movable: true,
    transparent: true,
    hasShadow: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    show: false,
    skipTaskbar: true // on Windows
  });

  if (process.platform == "darwin") {
    window.setHiddenInMissionControl(true);
  }

  // Load the page
  window.loadURL(OVERLAY_WINDOW_WEBPACK_ENTRY);
  window.setIgnoreMouseEvents(true, { forward: true });
  window.maximize();

  // Open the DevTools.
  if (IS_DEV_MODE) {
    window.webContents.openDevTools({
      mode: "detach"
    });
  }

  function hideOverlayWindow() {
    window.hide();
  }
  function showOverlayWindow() {
    const bounds = getFocusedDisplayBounds();
    window.setBounds(bounds);
    window.show();
    window.focus();
  }

  // Listen for close
  window.on("closed", () => {
    removeOverlayWindow();
  });

  showOverlayWindow();

  setOverlayWindow({
    window: window,
    show: showOverlayWindow,
    hide: hideOverlayWindow,
    hiddenFromDock: true
  });
};

ipcMain.handle("launch-confetti", () => {
  createOverlayWindow();
  getOverlayWindow()?.window.webContents.send("launch-confetti");
});
