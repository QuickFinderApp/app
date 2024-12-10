import { app, ipcMain } from "electron";
import Store from "../../../dependencies/electron-storage/index";
import { getAllWindows } from "../windows-manager";

const settingsStore = new Store({
  name: "settings",
  defaults: {
    launchOnLogin: false,
    theme: "system"
  },
  schema: {
    type: "object",
    properties: {
      launchOnLogin: {
        type: "boolean"
      },
      theme: {
        type: "string"
      }
    },
    additionalProperties: false
  }
});

export function getSetting(setting: string) {
  return settingsStore.get(setting as undefined);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setSetting(setting: string, value: any) {
  settingsStore.set(setting as undefined, value);

  getAllWindows().forEach(({ window }) => {
    window.webContents.send("settings-changed");
  });

  return true;
}

ipcMain.handle("get-setting", (_, setting: string) => {
  return getSetting(setting);
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
ipcMain.handle("set-setting", (_, setting: string, value: any) => {
  if (setting == "launchOnLogin" && typeof value == "boolean") {
    app.setLoginItemSettings({
      openAtLogin: value
    });
  }
  return setSetting(setting, value);
});
