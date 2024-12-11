const spotterGlobalExists = (): boolean => {
  return typeof spotter !== "undefined";
};

export function openLink(link: string) {
  if (!spotterGlobalExists()) {
    return;
  }
  return spotter.openLink(link);
}
export function openApp(appPath: string) {
  if (!spotterGlobalExists()) {
    return;
  }
  return spotter.openApp(appPath);
}
export function openFileLocation(filePath: string) {
  if (!spotterGlobalExists()) {
    return;
  }
  return spotter.openFileLocation(filePath);
}

export function quitApp() {
  if (!spotterGlobalExists()) {
    return;
  }
  return spotter.quit();
}

export function hideSpotter() {
  if (!spotterGlobalExists()) {
    return;
  }
  return spotter.hide();
}
export function showSpotter() {
  if (!spotterGlobalExists()) {
    return;
  }
  return spotter.show();
}

export function confetti() {
  if (!spotterGlobalExists()) {
    return;
  }
  return spotter.launchConfetti();
}

export function openSettings() {
  if (!spotterGlobalExists()) {
    return;
  }
  return spotter.openSettings();
}

export function runSystemAction(action: string) {
  if (!spotterGlobalExists()) {
    return Promise.resolve(false);
  }
  return spotter.runSystemAction(action);
}

export function getSystemInfo() {
  if (!spotterGlobalExists()) {
    return Promise.resolve(null);
  }
  return spotter.getSystemInfo();
}
