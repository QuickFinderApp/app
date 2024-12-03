import { getLinuxApplications } from "./linux";
import { getMacApplications } from "./macOS";

export async function getApplications(): Promise<{ name: string; icon: string; path: string }[]> {
  if (process.platform == "darwin") {
    return await getMacApplications();
  } else if (process.platform == "linux") {
    return await getLinuxApplications();
  }
  return [];
}
