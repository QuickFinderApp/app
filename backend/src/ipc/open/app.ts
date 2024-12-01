import { IpcMainInvokeEvent, shell } from "electron";

export async function openApp(event: IpcMainInvokeEvent, appPath: string) {
  return shell.openPath(appPath);
}
