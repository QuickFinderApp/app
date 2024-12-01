import { IpcMainInvokeEvent, shell } from "electron";

export async function openLink(event: IpcMainInvokeEvent, link: string) {
  return shell.openExternal(link);
}
