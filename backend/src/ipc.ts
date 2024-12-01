import { app, ipcMain } from "electron";
import { getApplications } from "./ipc/apps/apps";
import { openApp } from "./ipc/open/app";
import { openLink } from "./ipc/open/link";
import { openFileLocation } from "./ipc/open/file-location";

export default {
  init: () => {
    ipcMain.handle("get-applications", getApplications);

    ipcMain.handle("open-app", openApp);
    ipcMain.handle("open-link", openLink);
    ipcMain.handle("open-file-location", openFileLocation);

    ipcMain.handle("quit-app", () => {
      app.quit();
    });
  }
};
