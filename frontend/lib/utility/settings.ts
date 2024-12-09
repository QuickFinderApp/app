const mainGlobalExists = (): boolean => {
  return typeof main !== "undefined";
};

export function getLaunchOnBootSetting() {
  if (!mainGlobalExists()) {
    return Promise.resolve(false);
  }
  return main.getSetting<boolean>("launchOnLogin");
}
export function setLaunchOnBootSetting(bool: boolean) {
  if (!mainGlobalExists()) {
    return Promise.resolve(false);
  }
  return main.setSetting<boolean>("launchOnLogin", bool);
}
