import { getLinuxApplications } from "./linux";
import { getMacApplications } from "./macOS";
import { getWindowsApplications } from "./windows";

export async function getApplications(): Promise<{ name: string; icon: string; path: string }[]> {
  if (process.platform == "darwin") {
    return await getMacApplications();
  } else if (process.platform == "linux") {
    return await getLinuxApplications();
  } else if (process.platform == "win32") {
    return await getWindowsApplications();
  }
  return [];
}
