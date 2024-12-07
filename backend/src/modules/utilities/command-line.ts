import { exec as execCommand } from "child_process";

/**
 * Offers methods to execute command line commands.
 */
export interface CommandlineUtility {
  /**
   * Executes a command and returns the output.
   * @param command The command to execute, e.g. `"echo Hello World"`.
   * @param options The options for the command execution
   * @param options.ignoreErr If `true`, the error is ignored and not thrown as an error.
   * @param options.ignoreStdErr If `true`, the standard error output is ignored and not thrown as an error.
   * @param options.maxBuffer The maximum buffer size in bytes allowed for the standard output and standard error streams.
   * @returns A promise that resolves with the output of the command.
   */
  exec(
    command: string,
    options?: {
      ignoreStdErr?: boolean;
      ignoreErr?: boolean;
      maxBuffer?: number;
    }
  ): Promise<string>;
}

function exec(
  command: string,
  options?: {
    ignoreStdErr?: boolean;
    ignoreErr?: boolean;
    maxBuffer?: number;
  }
): Promise<string> {
  return new Promise((resolve, reject) => {
    execCommand(command, { maxBuffer: options?.maxBuffer }, (error, stdout, stderr) => {
      if (error && !options?.ignoreErr) {
        reject(error);
      } else if (stderr && !options?.ignoreStdErr) {
        reject(stderr);
      } else {
        resolve(stdout.toString());
      }
    });
  });
}

const commandline: CommandlineUtility = { exec };

export default commandline;
