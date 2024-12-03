import { app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, Tray } from "electron";
import { getFocusedDisplayBounds, WindowType } from "../../utils";
import path from "path";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let spotterWindow: WindowType | null = null;

export const createSpotterWindow = (): void => {
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
    backgroundMaterial: "acrylic", // on Windows
    skipTaskbar: true // on Windows
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

ipcMain.handle("open-spotter", () => spotterWindow?.show());
ipcMain.handle("hide-spotter", () => spotterWindow?.hide());

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

  const glassIcon = nativeImage
    .createFromPath(path.join(__dirname, "assets", "glass.png"))
    .resize({ width: 20, height: 20 });
  const mainTray = new Tray(glassIcon);

  const trayContextMenu = Menu.buildFromTemplate([
    {
      label: "Open Spotter",
      type: "normal",
      click: () => spotterWindow?.show()
    },
    { type: "separator" },
    { label: "Quit", type: "normal", click: () => app.quit() }
  ]);

  mainTray.setContextMenu(trayContextMenu);
});
