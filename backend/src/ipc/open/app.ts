import { IpcMainInvokeEvent, shell } from "electron";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

export async function openApp(event: IpcMainInvokeEvent, appPath: string): Promise<string> {
  if (process.platform === "linux") {
    try {
      // Split the command and its arguments
      const [command, ...args] = appPath.split(' ');
      
      // Escape each argument individually
      const escapedArgs = args.map(arg => `"${arg.replace(/"/g, '\\"')}"`);
      
      // Reconstruct the command
      const fullCommand = `${command} ${escapedArgs.join(' ')}`;
      
      await execAsync(fullCommand);
      return "App launched successfully";
    } catch (error) {
      console.error(`Error launching app: ${error}`);
      return `Failed to launch app: ${error}`;
    }
  } else {
    return shell.openPath(appPath);
  }
}