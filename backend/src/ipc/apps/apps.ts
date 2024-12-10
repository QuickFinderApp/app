import { setAppsCache } from "../../modules/stores/apps-cache";
import { getLinuxApplications } from "./linux";
import { getMacApplications } from "./macOS";
import { getWindowsApplications } from "./windows/windows";

export type ApplicationInfo = {
  name: string;
  icon: string;
  path: string;
};

export async function getApplications(): Promise<ApplicationInfo[]> {
  let apps: ApplicationInfo[] = [];
  if (process.platform == "darwin") {
    apps = await getMacApplications();
  } else if (process.platform == "linux") {
    apps = await getLinuxApplications();
  } else if (process.platform == "win32") {
    apps = await getWindowsApplications();
  }

  setAppsCache(apps);
  return apps;
}
