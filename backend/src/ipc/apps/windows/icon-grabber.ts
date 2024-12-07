import path from "path";
import { getTempDirectory, pathExists } from "../../../modules/utilities/filesystem";
import powershell from "../../../modules/utilities/powershell";
import { extractAssociatedFileIconPowershellScript } from "./powershell-scripts";
import random from "../../../modules/utilities/random";
import { pngFileToUrl } from "../../../modules/utilities/images";

interface FileIconExtractor {
  matchesFilePath: (filePath: string) => boolean;
  extractFileIcon: (filePath: string) => Promise<string>;
  extractFileIcons: (filePaths: string[]) => Promise<Record<string, string>>;
}

async function filterAlreadyExistingFilePaths(filePaths: string[]): Promise<string[]> {
  const result: string[] = [];

  const promiseResults = await Promise.allSettled(filePaths.map((f) => pathExists(getTempFilePath(f))));

  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    const promiseResult = promiseResults[i];

    if (promiseResult.status === "fulfilled") {
      if (!promiseResult.value) {
        result.push(filePath);
      }
    }
  }

  return result;
}

async function ensureCachedFileExists(filePath: string): Promise<string> {
  const cacheFilePath = getTempFilePath(filePath);
  const cachedFileAlreadyExists = await pathExists(cacheFilePath);

  if (!cachedFileAlreadyExists) {
    await powershell.executeScript(`
          ${extractAssociatedFileIconPowershellScript}
          ${getPowershellCommand(filePath, cacheFilePath)}
      `);
  }

  return cacheFilePath;
}

function getPowershellCommand(inFilePath: string, outFilePath: string): string {
  return `Get-Associated-Icon -InFilePath "${inFilePath}" -OutFilePath "${outFilePath}"`;
}

function getTempFilePaths(filePaths: string[]): Record<string, string> {
  const result: Record<string, string> = {};

  for (const filePath of filePaths) {
    result[filePath] = getTempFilePath(filePath);
  }

  return result;
}

function getTempFilePath(filePath: string): string {
  const tempFolderPath = getTempDirectory();
  return path.join(tempFolderPath, `${random.getRandomUUID()}.png`);
}

function matchesFilePath(filePath: string) {
  return [".lnk", ".url", ".appref-ms", ".exe"].some((fileExtension) => filePath.toLowerCase().endsWith(fileExtension));
}

async function extractFileIcon(filePath: string) {
  const cacheFilePath = await ensureCachedFileExists(filePath);
  return await pngFileToUrl(cacheFilePath);
}

async function extractFileIcons(filePaths: string[]) {
  const result: Record<string, string> = {};
  const cacheFilePaths = getTempFilePaths(filePaths);

  const filePathsToEnsure = await filterAlreadyExistingFilePaths(filePaths);

  if (filePathsToEnsure.length) {
    await powershell.executeScript(`
          ${extractAssociatedFileIconPowershellScript}
          ${filePathsToEnsure.map((f) => getPowershellCommand(f, cacheFilePaths[f])).join("\n")}
      `);
  }

  for (const filePath of filePaths) {
    result[filePath] = await pngFileToUrl(cacheFilePaths[filePath]);
  }

  return result;
}

const IconGrabber: FileIconExtractor = {
  matchesFilePath,
  extractFileIcon,
  extractFileIcons
};

export default IconGrabber;
