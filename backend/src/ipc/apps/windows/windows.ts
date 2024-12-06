import { exec } from "child_process";
import util from "util";
import path from "path";
import os from "os";
import fsPromises from "fs/promises";
import {
  DefaultCacheFileNameGenerator,
  DefaultFileSystemUtility,
  DefaultPowershellUtility,
  WindowsApplicationIconExtractor
} from "./icon-grabber";

const execAsync = util.promisify(exec);

// Common Start Menu paths
const commonStartMenuPaths = [
  path.join(process.env.PROGRAMDATA || "C:\\ProgramData", "Microsoft", "Windows", "Start Menu", "Programs"),
  path.join(os.homedir(), "AppData", "Roaming", "Microsoft", "Windows", "Start Menu", "Programs")
];

interface WindowsApp {
  name: string;
  icon: string;
  path: string;
}

/**
 * Runs a PowerShell command and returns its standard output.
 */
async function runPowerShellCommand(command: string): Promise<string> {
  const { stdout } = await execAsync(`powershell.exe -NoProfile -NonInteractive -Command "${command}"`, {
    encoding: "utf8"
  });
  return stdout.trim();
}

async function getAllShortcuts(dirs: string[]): Promise<string[]> {
  const shortcuts: string[] = [];

  for (const dir of dirs) {
    try {
      const files = await fsPromises.readdir(dir, { withFileTypes: true });
      for (const file of files) {
        if (file.isDirectory()) {
          // Recursively search subdirectories
          const subDir = path.join(dir, file.name);
          const subShortcuts = await getAllShortcuts([subDir]);
          shortcuts.push(...subShortcuts);
        } else if (file.name.endsWith(".lnk")) {
          shortcuts.push(path.join(dir, file.name));
        }
      }
    } catch {
      // Directory may not exist or can't be accessed
      // Just continue
    }
  }

  return shortcuts;
}

async function resolveShortcutTarget(shortcutPath: string): Promise<string | null> {
  const command = `
  $WshShell = New-Object -ComObject WScript.Shell
  $Shortcut = $WshShell.CreateShortcut("${shortcutPath.replace(/"/g, '""')}")
  $Shortcut.TargetPath
  `;

  try {
    const output = await runPowerShellCommand(command);
    return output || null;
  } catch {
    return null;
  }
}

export async function getWindowsApplications(): Promise<WindowsApp[]> {
  const shortcuts = await getAllShortcuts(commonStartMenuPaths);

  const apps: WindowsApp[] = [];

  const fileSystemUtility = new DefaultFileSystemUtility();
  const powershellUtility = new DefaultPowershellUtility();
  const cacheFileNameGenerator = new DefaultCacheFileNameGenerator();
  const cacheFolderPath = path.join(os.tmpdir(), "windows-app-icons-cache");

  // Ensure cache folder exists
  await fsPromises.mkdir(cacheFolderPath, { recursive: true });

  const iconExtractor = new WindowsApplicationIconExtractor(
    fileSystemUtility,
    powershellUtility,
    cacheFileNameGenerator,
    cacheFolderPath
  );

  // Collect all target paths for apps to extract icons
  const filePathsForIcons: string[] = [];

  for (const shortcut of shortcuts) {
    const target = await resolveShortcutTarget(shortcut);
    if (!target) {
      continue;
    }

    const name = path.basename(shortcut, ".lnk");
    const appPath = target;
    filePathsForIcons.push(shortcut); // We'll use the shortcut path for icon extraction
    apps.push({
      name,
      icon: null, // temporarily null, will set after icon extraction
      path: appPath
    });
  }

  // Extract icons for all discovered apps
  const iconResults = await iconExtractor.extractFileIcons(filePathsForIcons);

  // Map back icons to apps
  for (let i = 0; i < apps.length; i++) {
    // Not all shortcuts are from the first path, so we should match them differently.
    // Let's find the actual shortcut path that was used:
    // A better way is to just match by index since we pushed them in order:
    const iconPath = filePathsForIcons[i];
    const icon = iconResults[iconPath]?.url ?? null;
    apps[i].icon = icon;
  }

  return apps;
}
