import path from "path"
import os from "os"
import { getWindowsAppsPowershellScript, getWindowsStoreAppsScript } from "./powershell-scripts";
import powershell from "../../../modules/utilities/powershell";
import { ApplicationInfo } from "../apps";
import IconGrabber from "./icon-grabber";
import { pngBase64ToUrl } from "../../../modules/utilities/images";

const POWERSHELL_MAX_BUFFER_SIZE = 4096 * 4096;

type WindowsApplicationRetrieverResult = {
  BaseName: string;
  FullName: string;
};

type WindowsStoreApplication = {
  DisplayName: string;
  AppId: string;
  LogoBase64: string;
};

function getPowershellScript(folderPaths: string[], fileExtensions: string[]): string {
  const concatenatedFolderPaths = folderPaths.map((folderPath) => `"${folderPath}"`).join(",");
  const concatenatedFileExtensions = fileExtensions.map((fileExtension) => `"*.${fileExtension}"`).join(",");

  return `
            [Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
            ${getWindowsAppsPowershellScript}
            Get-WindowsApps -FolderPaths ${concatenatedFolderPaths} -FileExtensions ${concatenatedFileExtensions};`;
}

async function getManuallyInstalledApps(): Promise<ApplicationInfo[]> {
  const folderPaths = [
    "C:\\ProgramData\\Microsoft\\Windows\\Start Menu",
    path.join(os.homedir(), "AppData", "Roaming", "Microsoft", "Windows", "Start Menu"),
  ];
  const fileExtensions = ["lnk"];

  if (!folderPaths.length || !fileExtensions.length) {
    return [];
  }

  const stdout = await powershell.executeScript(
    getPowershellScript(folderPaths, fileExtensions),
    { maxBuffer: POWERSHELL_MAX_BUFFER_SIZE },
  );

  const windowsApplicationRetrieverResults = <WindowsApplicationRetrieverResult[]>JSON.parse(stdout);
  const appIcons = await IconGrabber.extractFileIcons(
    windowsApplicationRetrieverResults.map(({ FullName }) => FullName),
  );

  return windowsApplicationRetrieverResults.map(({ BaseName, FullName }) => {
    const icon = appIcons[FullName] || "";

    return {
      name: BaseName,
      icon,
      path: FullName
    }
  });
}

async function getWindowsStoreApps(): Promise<ApplicationInfo[]> {
  const includeWindowsStoreApps = true;

  if (!includeWindowsStoreApps) {
    return [];
  }

  const stdout = await powershell.executeScript(getWindowsStoreAppsScript, {
    maxBuffer: POWERSHELL_MAX_BUFFER_SIZE,
  });

  const windowStoreApplications = <WindowsStoreApplication[]>JSON.parse(stdout);

  return windowStoreApplications.map(
    ({ AppId, DisplayName, LogoBase64 }) => {
      return {
        name: DisplayName,
        icon: pngBase64ToUrl(LogoBase64),
        path: `shell:AppsFolder\\${AppId}`
      }
    }
  );
}

export async function getWindowsApplications(): Promise<ApplicationInfo[]> {
  const manuallyInstalledApps = await getManuallyInstalledApps();
  const windowsStoreApps: any[] = await getWindowsStoreApps();

  return [...manuallyInstalledApps, ...windowsStoreApps];
}