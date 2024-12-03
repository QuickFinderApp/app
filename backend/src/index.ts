import { app } from "electron";
import ipc from "./ipc";
import { createOverlayWindow } from "./windows/overlay";
import { createSpotterWindow } from "./windows/spotter";

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
});

app.on("activate", () => {
  createSpotterWindow();
});

app.on("window-all-closed", function () {
  /* surprise: nothing! */
});
