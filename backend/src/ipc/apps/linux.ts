import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import os from "os";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

interface DesktopEntry {
  Name?: string;
  Icon?: string;
  Exec?: string;
  NoDisplay?: string;
  Hidden?: string;
}

async function parseDesktopFile(filePath: string): Promise<DesktopEntry | null> {
  try {
    const content = await fsPromises.readFile(filePath, "utf-8");
    const lines = content.split("\n");
    const entry: DesktopEntry = {};
    let inDesktopEntry = false;

    for (const line of lines) {
      if (line.trim() === "[Desktop Entry]") {
        inDesktopEntry = true;
        continue;
      }
      if (line.trim().startsWith("[") && line.trim().endsWith("]")) {
        inDesktopEntry = false;
        continue;
      }
      if (!inDesktopEntry) continue;

      const [key, ...valueParts] = line.split("=");
      if (key && valueParts.length > 0) {
        entry[key.trim() as keyof DesktopEntry] = valueParts.join("=").trim();
      }
    }

    return entry;
  } catch (error) {
    console.error(`Error parsing desktop file ${filePath}:`, error);
    return null;
  }
}

async function findIconPath(iconName: string): Promise<string> {
  const iconDirs = [
    "/usr/share/icons",
    "/usr/share/pixmaps",
    path.join(os.homedir(), ".icons"),
    path.join(os.homedir(), ".local/share/icons"),
  ];

  for (const dir of iconDirs) {
    try {
      const { stdout } = await execAsync(`find "${dir}" -name "${iconName}.*" | head -n 1`);
      const iconPath = stdout.trim();
      if (iconPath) {
        return iconPath;
      }
    } catch (error) {
      // Ignore errors and continue searching
    }
  }

  // If no icon found, return the original name
  return iconName;
}

async function getLinuxApplicationsInDirectory(dir: string): Promise<{ name: string; icon: string; path: string }[]> {
  const apps: { name: string; icon: string; path: string }[] = [];

  if (!fs.existsSync(dir)) {
    return [];
  }

  try {
    const files = await fsPromises.readdir(dir);
    for (const file of files) {
      if (file.endsWith(".desktop")) {
        const filePath = path.join(dir, file);
        const entry = await parseDesktopFile(filePath);
        if (entry && entry.Name && entry.Exec && entry.NoDisplay !== "true" && entry.Hidden !== "true") {
          const execCommand = entry.Exec.split(" ").filter(part => !part.startsWith("%"));
          const iconPath = entry.Icon ? await findIconPath(entry.Icon) : "";
          apps.push({ 
            name: entry.Name, 
            icon: iconPath, 
            path: execCommand.join(" ")
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return apps;
}

export async function getLinuxApplications(): Promise<{ name: string; icon: string; path: string }[]> {
  const dataHome = process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share");
  const extraDataDirs = process.env.XDG_DATA_DIRS
    ? process.env.XDG_DATA_DIRS.split(":")
    : ["/usr/local/share", "/usr/share", "/var/lib/flatpak/exports/share"];

  const flatpakDir = path.join(dataHome, "flatpak", "exports", "share");
  
  const directories = [
    path.join(dataHome, "applications"),
    path.join(flatpakDir, "applications"),
    ...extraDataDirs.map(dir => path.join(dir, "applications"))
  ];

  const applications: { name: string; icon: string; path: string }[] = [];

  const promises = directories.map(async (dir) => {
    const appsFound = await getLinuxApplicationsInDirectory(dir).catch(() => []);
    applications.push(...appsFound);
  });

  await Promise.all(promises);

  return applications;
}