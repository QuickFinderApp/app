import { app } from "electron";
import ipc from "./ipc";
import { createOverlayWindow } from "./windows/overlay";
import { createSpotterWindow } from "./windows/spotter";
import { registerFileProtocol } from "./modules/protocols/file";
import { setupRendererBindings } from "./modules/globals/main";
import { createMainTray } from "./modules/trays/main";
import "./modules/stores/settings";

// single instance only
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  if (require("electron-squirrel-startup")) {
    app.quit();
  }

  ipc.init();

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", () => {
    createSpotterWindow();
    createOverlayWindow();

    registerFileProtocol();
    createMainTray();
  });

  app.on("activate", () => {
    createSpotterWindow();
  });

  app.on("window-all-closed", function () {
    /* surprise: nothing! */
  });

  app.on("second-instance", () => {
    // Someone tried to run a second instance, we should focus our window.
    createSpotterWindow();
  });

  setupRendererBindings();
}
