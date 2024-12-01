import path from "path";
import fsPromises from "fs/promises";
import { fileIconToBuffer } from "../../../dependencies/file-icon/index";

async function getFileIcon(path: string): Promise<string | null> {
  try {
    const pngBuffer = await fileIconToBuffer(path, { size: 256 });
    const base64 = `data:image/png;base64,${pngBuffer.toString("base64")}`;
    return base64;
  } catch (err) {
    console.error("Failed to get icon:", err);
    return null;
  }
}

export async function getMacApplications(): Promise<{ name: string; icon: string; path: string }[]> {
  // TODO: Windows & Linux Support (This is just for MacOS)
  try {
    const appsDir = "/Applications";
    const entries = await fsPromises.readdir(appsDir, { withFileTypes: true });

    const apps = Promise.all(
      entries
        .filter((entry) => entry.isDirectory() && entry.name.endsWith(".app"))
        .map(async (entry) => {
          const appPath = path.join(appsDir, entry.name);
          const name = entry.name.slice(0, -4); // Remove '.app' from the end

          return {
            name,
            icon: await getFileIcon(appPath),
            path: appPath
          };
        })
    );

    return apps;
  } catch (error) {
    console.error("Error reading applications:", error);
    return [];
  }
}
