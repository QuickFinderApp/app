import { exec } from "child_process";
import os from "os";

export default function LogOutComputer(): Promise<boolean> {
  let command;

  // Determine platform and set the appropriate command
  switch (os.platform()) {
    case "win32": // Windows
      command = "shutdown /l";
      break;
    case "darwin": // macOS
      command = `osascript -e 'tell app "System Events" to log out'`;
      break;
    case "linux": // Linux
      command = `pkill -KILL -u "$(whoami)"`;
      break;
    default:
      console.error("Unsupported platform");
      return Promise.resolve(false); // Exit if unsupported platform
  }

  // Execute the command
  return new Promise((resolve) => {
    exec(command, (error) => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}
