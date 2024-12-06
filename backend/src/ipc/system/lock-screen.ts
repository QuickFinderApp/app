import { exec } from "child_process";
import os from "os";

export default function LockScreen(): Promise<boolean> {
  let command: string = "";

  // Determine platform and set the appropriate command
  switch (os.platform()) {
    case "win32": // Windows
      command = "rundll32.exe user32.dll,LockWorkStation";
      break;
    case "darwin": // macOS
      command = `osascript -e 'tell application "System Events" to tell process "Finder"
	click menu item "Lock Screen" of menu 0 of menu bar 1
end tell'`;
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
