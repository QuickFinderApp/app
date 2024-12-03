import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import util from "util";
import os from "os";

const execAsync = util.promisify(exec);

async function parseDesktopFile(filePath: string): Promise<{ name: string; icon: string; path: string } | null> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const lines = content.split("\n");
    let name = "";
    let icon = "";
    let execPath = "";

    for (const line of lines) {
      if (line.startsWith("Name=")) {
        name = line.split("=")[1];
      } else if (line.startsWith("Icon=")) {
        icon = line.split("=")[1];
      } else if (line.startsWith("Exec=")) {
        execPath = line.split("=")[1].split(" ")[0];
      }
    }

    if (name && execPath) {
      return { name, icon, path: execPath };
    }
  } catch (error) {
    console.error(`Error parsing desktop file ${filePath}:`, error);
  }

  return null;
}

async function getIconPath(iconName: string): Promise<string> {
  try {
    const { stdout } = await execAsync(`find /usr/share/icons -name "${iconName}.*" | head -n 1`);
    return stdout.trim();
  } catch (error) {
    console.error(`Error finding icon for ${iconName}:`, error);
    return "";
  }
}

async function getLinuxApplicationsInDirectory(dir: string): Promise<{ name: string; icon: string; path: string }[]> {
  const apps: { name: string; icon: string; path: string }[] = [];

  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      if (file.endsWith(".desktop")) {
        const filePath = path.join(dir, file);
        const app = await parseDesktopFile(filePath);
        if (app) {
          const iconPath = await getIconPath(app.icon);
          apps.push({ ...app, icon: iconPath });
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return apps;
}

export async function getLinuxApplications(): Promise<{ name: string; icon: string; path: string }[]> {
  const directories = [
    "/usr/share/applications",
    "/usr/local/share/applications",
    path.join(os.homedir(), ".local/share/applications")
  ];

  const applications: { name: string; icon: string; path: string }[] = [];

  const promises = directories.map(async (dir) => {
    const appsFound = await getLinuxApplicationsInDirectory(dir);
    applications.push(...appsFound);
  });

  await Promise.all(promises);

  return applications;
}
