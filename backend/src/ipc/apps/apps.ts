import { getMacApplications } from "./macOS";

export async function getApplications(): Promise<{ name: string; icon: string; path: string }[]> {
  if (process.platform == "darwin") {
    return await getMacApplications();
  }
  return [];
}
