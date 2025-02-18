import path from "path";
import fsPromises from "fs/promises";
import { fileIconToBuffer } from "../../../dependencies/file-icon/index";
import os from "os";
import { ApplicationInfo } from "./apps";
import { pngBufferToUrl } from "../../modules/utilities/images";

async function getFileIcon(path: string): Promise<string | null> {
  try {
    const pngBuffer = await fileIconToBuffer(path, { size: 256 });
    return pngBufferToUrl(pngBuffer);
  } catch (err) {
    console.log("Failed to get icon:", err.message);
    return null;
  }
}

const MAX_DEPTH = 1;
async function getMacApplicationsInDirectory(appsDir: string, depth = 0): Promise<ApplicationInfo[]> {
  try {
    const entries = await fsPromises.readdir(appsDir, { withFileTypes: true });

    const apps = await Promise.all(
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

    if (depth < MAX_DEPTH) {
      depth += 1;

      const appsInFolderPromises = entries
        .filter((entry) => entry.isDirectory() && !entry.name.endsWith(".app"))
        .map(async (entry) => {
          const folderPath = path.join(entry.parentPath, entry.name);
          const appsInFolders = getMacApplicationsInDirectory(folderPath, depth);
          (await appsInFolders).forEach((app) => {
            apps.push(app);
          });
        });

      await Promise.all(appsInFolderPromises);
    }

    return apps;
  } catch (error) {
    console.error("Error reading applications:", error);
    return [];
  }
}

export async function getMacApplications(): Promise<ApplicationInfo[]> {
  const applicationsPath = "/Applications";
  const systemApplicationsPath = "/System/Applications";
  const userApplicationsPath = path.join(os.homedir(), "Applications");

  const directories = [applicationsPath, systemApplicationsPath, userApplicationsPath];

  const applications: ApplicationInfo[] = [];

  const promises = directories.map(async (dir) => {
    await getMacApplicationsInDirectory(dir).then((appsFound) => {
      appsFound.forEach((app) => {
        applications.push(app);
      });
    });
  });

  await Promise.all(promises);

  return applications;
}
