import path from "path";
import os from "os";
import fsPromises from "fs/promises";
import commandline from "./command-line";
import random from "./random";
import { getTempDirectory } from "./filesystem";

const PowershellPath = `C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`;
const byteOrderMark: string = "\ufeff";

/**
 * Offers methods to execute PowerShell commands and scripts.
 */
export interface PowershellUtilityInterface {
  /**
   * Executes a PowerShell command.
   * @param command The command to execute, e.g. `Get-Process`.
   * @param options The options for the command execution
   * @param options.maxBuffer The maximum buffer size in bytes allowed for the standard output and standard error streams.
   * @returns The output of the powershell command.
   */
  executeCommand(command: string, options?: { maxBuffer?: number }): Promise<string>;

  /**
   * Executes a PowerShell script. The script can also be multi-line and include functions.
   * @param script The script to execute, e.g.:
   * ```powershell
   * Write-Host "Hello, World!"
   * Write-Host "This is a PowerShell script."
   * Write-Host "It is executed by the PowerShellUtility."
   * ```
   * @param options The options for the script execution
   * @param options.maxBuffer The maximum buffer size in bytes allowed for the standard output and standard error streams.
   * @returns The output of the powershell script.
   */
  executeScript(script: string, options?: { maxBuffer?: number }): Promise<string>;
}

async function executeCommand(command: string, options?: { maxBuffer: number }): Promise<string> {
  return await commandline.exec(`${PowershellPath} -Command "& {${command}}"`, options);
}

async function executeScript(script: string, options?: { maxBuffer: number }): Promise<string> {
  const temporaryDirectoryFilePath = getTempDirectory();
  const filePath = path.join(temporaryDirectoryFilePath, `${random.getRandomUUID()}.ps1`);

  await fsPromises.writeFile(filePath, `${byteOrderMark}${script}`, "utf8");

  const stdout = await commandline.exec(
    `${PowershellPath} -NoProfile -NonInteractive -ExecutionPolicy bypass -File "${filePath}"`,
    options
  );

  await fsPromises.rm(filePath);

  return stdout;
}

const powershell: PowershellUtilityInterface = { executeCommand, executeScript };

export default powershell;
