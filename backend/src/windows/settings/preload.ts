// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge } from "electron";
import { setupMainGlobal } from "../../modules/globals/main";

setupMainGlobal(contextBridge);
