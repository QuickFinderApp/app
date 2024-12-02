import { execSync } from "child_process";
import os from "os";

export default async function SleepComputer() {
  let command;

  // Determine platform and set the appropriate command
  switch (os.platform()) {
    case "darwin": // macOS
      command = `osascript -e 'tell app "System Events" to sleep'`;
      break;
    case "linux": // Linux
      command = `systemctl suspend`;
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
