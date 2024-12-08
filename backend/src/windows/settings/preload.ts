// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { setupMainGlobal } from "../../modules/globals/main";

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
  },

  launchConfetti: () => {
    return ipcRenderer.invoke("launch-confetti");
  },

  runSystemAction: (action: string) => {
    return ipcRenderer.invoke("system-action", action);
  },

  getHideOnFocusLost: () => {
    return ipcRenderer.invoke("get-hide-spotter-on-focus-lost");
  },
  setHideOnFocusLost: (bool: boolean) => {
    return ipcRenderer.invoke("set-hide-spotter-on-focus-lost", bool);
  }
});

setupMainGlobal(contextBridge);
