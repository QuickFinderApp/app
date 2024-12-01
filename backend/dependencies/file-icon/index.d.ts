/**
 * Options for retrieving the file icon as a buffer.
 */
export interface FileIconOptions {
  /**
   * The desired size of the icon. Maximum allowed is 1024.
   * @default 1024
   */
  size?: number;
}

/**
 * Options for saving the file icon to a file.
 */
export interface FileIconToFileOptions extends FileIconOptions {
  /**
   * The destination path or an array of paths where the icon(s) will be saved.
   */
  destination: string | string[];
}

/**
 * Retrieves the icon of a file or application and returns it as a Buffer or an array of Buffers.
 * @param file - The file path, application name, bundle identifier, process ID, or an array of these.
 * @param options - Optional settings for icon size.
 * @returns A Promise that resolves with a Buffer or an array of Buffers containing the icon image data.
 * @throws Will throw an error if the platform is not macOS or if invalid arguments are provided.
 */
export function fileIconToBuffer(
  file: string | number | Array<string | number>,
  options?: FileIconOptions
): Promise<Buffer | Buffer[]>;

/**
 * Retrieves the icon of a file or application and saves it to the specified destination(s).
 * @param file - The file path, application name, bundle identifier, process ID, or an array of these.
 * @param options - Settings for icon size and destination path(s).
 * @returns A Promise that resolves when the icon(s) have been saved.
 * @throws Will throw an error if the platform is not macOS or if invalid arguments are provided.
 */
export function fileIconToFile(
  file: string | number | Array<string | number>,
  options: FileIconToFileOptions
): Promise<void>;
