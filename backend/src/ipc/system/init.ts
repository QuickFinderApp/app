import { IpcMainInvokeEvent } from "electron";
import ShutdownComputer from "./shutdown";
import RestartComputer from "./restart";
import SleepComputer from "./sleep";
import LogOutComputer from "./log-out";
import LockScreen from "./lock-screen";

type ActionName = "shutdown" | "restart" | "sleep" | "logout" | "lock-screen";
export async function handleSystemAction(event: IpcMainInvokeEvent, action: ActionName) {
  if (action == "shutdown") {
    return await ShutdownComputer();
  } else if (action == "restart") {
    return await RestartComputer();
  } else if (action == "sleep") {
    return await SleepComputer();
  } else if (action == "logout") {
    return await LogOutComputer();
  } else if (action == "lock-screen") {
    return await LockScreen();
  }
  return false;
}
