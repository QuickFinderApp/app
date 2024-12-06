import fs from "fs";
import path from "path";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

interface FileSystemUtility {
  pathExists(filePath: string): Promise<boolean>;
}

export class DefaultFileSystemUtility implements FileSystemUtility {
  public async pathExists(filePath: string): Promise<boolean> {
    try {
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  }
}

interface PowershellUtility {
  executeScript(script: string, options?: { maxBuffer?: number }): Promise<string>;
}

export class DefaultPowershellUtility implements PowershellUtility {
  private async runPowerShellCommand(command: string): Promise<string> {
    const { stdout } = await execAsync(`powershell.exe -NoProfile -NonInteractive -Command "${command}"`, {
      encoding: "utf8"
    });
    return stdout.trim();
  }

  public async executeScript(script: string): Promise<string> {
    return this.runPowerShellCommand(script);
  }
}

interface CacheFileNameGenerator {
  generateCacheFileName(filePath: string): string;
}

export class DefaultCacheFileNameGenerator implements CacheFileNameGenerator {
  public generateCacheFileName(filePath: string): string {
    const safeName = filePath.replace(/[^a-zA-Z0-9]/g, "_");
    return `icon_${safeName}`;
  }
}

interface Image {
  url: string;
}

const extractAssociatedFileIconPowershellScript = `
  Function Get-Associated-Icon {
      param(
          [Parameter(Mandatory=$true)][string]$InFilePath,
          [Parameter(Mandatory=$true)][string]$OutFilePath
      )
  
      Add-Type -AssemblyName System.Drawing
      $icon = [System.Drawing.Icon]::ExtractAssociatedIcon($InFilePath)
  
      if ($icon) {
          $bitmap = $icon.ToBitmap()
          $bitmap.Save($OutFilePath, [System.Drawing.Imaging.ImageFormat]::Png)
          $bitmap.Dispose()
          $icon.Dispose()
      }
  }
  `;

export class WindowsApplicationIconExtractor {
  public constructor(
    private readonly fileSystemUtility: FileSystemUtility,
    private readonly powershellUtility: PowershellUtility,
    private readonly cacheFileNameGenerator: CacheFileNameGenerator,
    private readonly cacheFolderPath: string
  ) {}

  public matchesFilePath(filePath: string) {
    return [".lnk", ".url", ".appref-ms", ".exe"].some((fileExtension) =>
      filePath.toLowerCase().endsWith(fileExtension)
    );
  }

  public async extractFileIcon(filePath: string) {
    const cacheFilePath = await this.ensureCachedFileExists(filePath);
    return { url: `file://${cacheFilePath}` };
  }

  public async extractFileIcons(filePaths: string[]) {
    const result: Record<string, Image> = {};
    const cacheFilePaths = this.getCacheFilePaths(filePaths);

    const filePathsToEnsure = await this.filterAlreadyExistingFilePaths(filePaths);

    if (filePathsToEnsure.length) {
      await this.powershellUtility.executeScript(`
                  ${extractAssociatedFileIconPowershellScript}
                  ${filePathsToEnsure.map((f) => this.getPowershellCommand(f, cacheFilePaths[f])).join("\n")}
              `);
    }

    for (const filePath of filePaths) {
      result[filePath] = {
        url: `file://${cacheFilePaths[filePath]}`
      };
    }

    return result;
  }

  private async filterAlreadyExistingFilePaths(filePaths: string[]): Promise<string[]> {
    const result: string[] = [];

    const promiseResults = await Promise.allSettled(
      filePaths.map((f) => this.fileSystemUtility.pathExists(this.getCacheFilePath(f)))
    );

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

  private async ensureCachedFileExists(filePath: string): Promise<string> {
    const cacheFilePath = this.getCacheFilePath(filePath);
    const cachedFileAlreadyExists = await this.fileSystemUtility.pathExists(cacheFilePath);

    if (!cachedFileAlreadyExists) {
      await this.powershellUtility.executeScript(`
                  ${extractAssociatedFileIconPowershellScript}
                  ${this.getPowershellCommand(filePath, cacheFilePath)}
              `);
    }

    return cacheFilePath;
  }

  private getPowershellCommand(inFilePath: string, outFilePath: string): string {
    return `Get-Associated-Icon -InFilePath "${inFilePath}" -OutFilePath "${outFilePath}"`;
  }

  private getCacheFilePaths(filePaths: string[]): Record<string, string> {
    const result: Record<string, string> = {};

    for (const filePath of filePaths) {
      result[filePath] = this.getCacheFilePath(filePath);
    }

    return result;
  }

  private getCacheFilePath(filePath: string): string {
    return path.join(this.cacheFolderPath, `${this.cacheFileNameGenerator.generateCacheFileName(filePath)}.png`);
  }
}
