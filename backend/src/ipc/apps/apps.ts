import { getLinuxApplications } from "./linux";
import { getMacApplications } from "./macOS";
import { getWindowsApplications } from "./windows/windows";

export type ApplicationInfo = {
  name: string;
  icon: string;
  path: string
}

export async function getApplications(): Promise<ApplicationInfo[]> {
  if (process.platform == "darwin") {
    return await getMacApplications();
  } else if (process.platform == "linux") {
    return await getLinuxApplications();
  } else if (process.platform == "win32") {
    return await getWindowsApplications();
  }
  return [];
}
