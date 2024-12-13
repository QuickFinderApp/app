import { app, ipcMain } from "electron";
import { getAllWindows } from "../windows-manager";
import { Store } from "electron-datastore";

const settingsStore = new Store({
  name: "settings",
  template: {
    launchOnLogin: false,
    theme: "system"
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
