// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("spotter", {
  getApplications: () => {
    return ipcRenderer.invoke("get-applications");
  },

  openApp: (appPath: string) => {
    return ipcRenderer.invoke("open-app", appPath);
  },
  openLink: (link: string) => {
    return ipcRenderer.invoke("open-link", link);
  },
  openFileLocation: (filePath: string) => {
    return ipcRenderer.invoke("open-file-location", filePath);
  },

  show: () => {
    return ipcRenderer.invoke("open-spotter");
  },
  hide: () => {
    return ipcRenderer.invoke("hide-spotter");
  },
  quit: () => {
    return ipcRenderer.invoke("quit-app");
  }
});
