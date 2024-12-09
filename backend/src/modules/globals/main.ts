/* eslint-disable @typescript-eslint/no-unused-vars */
import { ContextBridge, ipcRenderer, app, ipcMain } from "electron";

export function setupMainGlobal(contextBridge: ContextBridge) {
  contextBridge.exposeInMainWorld("main", {
    getVersion: async () => {
      const version = await ipcRenderer.invoke("get-version");
      return `Version ${version}`;
    },

    getSetting: async (setting: string) => {
      return ipcRenderer.invoke("get-setting", setting);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSetting: async (setting: string, newValue: any) => {
      return ipcRenderer.invoke("set-setting", setting, newValue);
    }
  });
}

export function setupRendererBindings() {
  ipcMain.handle("get-version", () => app.getVersion());
}
