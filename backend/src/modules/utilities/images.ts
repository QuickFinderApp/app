import fs from "fs/promises";

export function pngBase64ToUrl(pngBase64: string) {
  const base64 = `data:image/png;base64,${pngBase64}`;
  return base64;
}

export function pngBufferToUrl(pngBuffer: Buffer | Buffer[]) {
  return pngBase64ToUrl(pngBuffer.toString("base64"));
}

export async function pngFileToUrl(filePath: string): Promise<string> {
  try {
    const pngBuffer = await fs.readFile(filePath);
    return pngBufferToUrl(pngBuffer);
  } catch {
    return "";
  }
}
