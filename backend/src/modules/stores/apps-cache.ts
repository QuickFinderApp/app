import { ApplicationInfo } from "../../ipc/apps/apps";
import Store from "../../../dependencies/electron-storage/index";

const appsCacheStore = new Store({
  name: "apps-cache",
  defaults: {
    apps: []
  },
  schema: {
    type: "object",
    additionalProperties: true
  }
});

export function getAppsCache() {
  return appsCacheStore.get("apps");
}
export function setAppsCache(apps: ApplicationInfo[]) {
  appsCacheStore.set("apps", apps);
}
