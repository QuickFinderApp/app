// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { setupMainGlobal } from "../../modules/globals/main";

contextBridge.exposeInMainWorld("overlay", {
  onConfetti: (callback: () => void) => ipcRenderer.on("launch-confetti", () => callback())
});

setupMainGlobal(contextBridge);
