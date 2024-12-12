import { app, ipcMain } from "electron";
import { getApplications } from "./ipc/apps/apps";
import { openApp } from "./ipc/open/app";
import { openLink } from "./ipc/open/link";
import { openFileLocation } from "./ipc/open/file-location";
import { handleSystemAction } from "./ipc/system/init";
import { getAppsCache } from "./modules/stores/apps-cache";
import { getSystemInfo } from "./modules/system/info";
import { initializeFrecencyIPC } from "./ipc/frecency/frecency";

export default {
  init: () => {
    ipcMain.handle("get-cached-applications", getAppsCache);
    ipcMain.handle("get-applications", getApplications);

    ipcMain.handle("open-app", openApp);
    ipcMain.handle("open-link", openLink);
    ipcMain.handle("open-file-location", openFileLocation);

    ipcMain.handle("quit-app", () => {
      app.quit();
    });

    ipcMain.handle("system-action", handleSystemAction);
    ipcMain.handle("get-system-info", getSystemInfo);
    
    initializeFrecencyIPC();
  }
};
