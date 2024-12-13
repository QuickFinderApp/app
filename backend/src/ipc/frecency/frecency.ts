import { ipcMain } from "electron";
import { getFrecencyScores, recordCommandAccess, resetCommandScore } from "../../modules/stores/frecency";

export function initializeFrecencyIPC() {
  ipcMain.handle("frecency:record-access", async (_, commandId: string) => {
    await recordCommandAccess(commandId);
  });

  ipcMain.handle("frecency:reset-score", async (_, commandId: string) => {
    await resetCommandScore(commandId);
  });

  ipcMain.handle("frecency:get-scores", async () => {
    return getFrecencyScores();
  });
}
