import { app, BrowserWindow, ipcMain } from "electron";
import { getFocusedDisplayBounds } from "../../utils";

declare const OVERLAY_WINDOW_WEBPACK_ENTRY: string;
declare const OVERLAY_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

type WindowType = {
  window: BrowserWindow;
  show: () => void;
  hide: () => void;
};
let overlayWindow: WindowType | null = null;

export const createOverlayWindow = (): void => {
  if (overlayWindow) {
    overlayWindow.show();
    return;
  }

  // Create the browser window.
  const packaged = app.isPackaged;
  const devMode = !packaged;

  const window = new BrowserWindow({
    height: 500,
    width: 800,
    webPreferences: {
      preload: OVERLAY_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: false,
      devTools: devMode
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

  window.setHiddenInMissionControl(true);

  // Load the page
  window.loadURL(OVERLAY_WINDOW_WEBPACK_ENTRY);
  window.setIgnoreMouseEvents(true, { forward: true });
  window.maximize();

  // Open the DevTools.
  if (devMode) {
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

  // Set shortcut
  showOverlayWindow();

  overlayWindow = {
    window: window,
    show: showOverlayWindow,
    hide: hideOverlayWindow
  };
};

ipcMain.handle("launch-confetti", () => {
  createOverlayWindow();
  if (overlayWindow) {
    overlayWindow.window.webContents.send("launch-confetti");
  }
});
