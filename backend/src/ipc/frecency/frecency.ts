import { ipcMain } from "electron";
import { getFrecencyScores, recordCommandAccess } from "../../modules/stores/frecency";

export function initializeFrecencyIPC() {
  ipcMain.handle("frecency:record-access", async (_, commandId: string) => {
    await recordCommandAccess(commandId);
  });

  ipcMain.handle("frecency:get-scores", async () => {
    return getFrecencyScores();
  });
}