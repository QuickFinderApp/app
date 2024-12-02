import { execSync } from "child_process";
import os from "os";

export default async function LockScreen() {
  let command;

  // Determine platform and set the appropriate command
  switch (os.platform()) {
    case "darwin": // macOS
      command = `osascript -e 'tell application "System Events" to tell process "Finder"
	click menu item "Lock Screen" of menu 0 of menu bar 1
end tell'`;
      break;
    default:
      console.error("Unsupported platform");
      return false; // Exit if unsupported platform
  }

  // Execute the command
  try {
    execSync(command);
    return true;
  } catch {
    return false;
  }
}
