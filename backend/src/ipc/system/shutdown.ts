import { execSync } from "child_process";
import os from "os";

export default async function ShutdownComputer() {
  let command;

  // Determine platform and set the appropriate command
  switch (os.platform()) {
    case "win32": // Windows
      command = "shutdown -s -t 0";
      break;
    case "darwin": // macOS
      command = `osascript -e 'tell app "System Events" to shut down'`;
      break;
    case "linux": // Linux
      command = "shutdown now";
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
