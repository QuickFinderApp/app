import { IpcMainInvokeEvent, shell } from "electron";

export async function openFileLocation(event: IpcMainInvokeEvent, filePath: string) {
  return shell.showItemInFolder(filePath);
}
