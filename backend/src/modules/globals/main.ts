/* eslint-disable @typescript-eslint/no-unused-vars */
import { ContextBridge, ipcRenderer, app, ipcMain } from "electron";

export function setupMainGlobal(contextBridge: ContextBridge) {
  contextBridge.exposeInMainWorld("main", {
    getVersion: async () => {
      const version = await ipcRenderer.invoke("get-version");
      return `Version ${version}`;
    },

    getSetting: async (setting: string) => {
      // TODO!!
      return false;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSetting: async (setting: string, newValue: any) => {
      // TODO!!
      return false;
    }
  });
}

export function setupRendererBindings() {
  ipcMain.handle("get-version", () => app.getVersion());
}
