// Manage windows orchastration (is that the right word?)

import { app, BrowserWindow } from "electron";

export type WindowType = {
  window: BrowserWindow;
  show: () => void;
  hide: () => void;
  hiddenFromDock?: boolean;
};

const windowsManager = new Map<string, WindowType>();

function WindowsChanged() {
  const windows = Array.from(windowsManager.values());
  const windowCount = windows.length;

  // macOS only: hide on dock
  if (process.platform == "darwin") {
    if (windowCount === 0) {
      app.dock.hide();
    } else {
      const hasDockIcon = windows.every((window) => !window.hiddenFromDock);

      if (hasDockIcon) {
        app.dock.show();
      } else {
        app.dock.hide();
      }
    }
  }
}

export function getWindow(windowId: string): WindowType | undefined {
  return windowsManager.get(windowId);
}

export function registerWindow(windowId: string, windowData: WindowType): boolean {
  if (getWindow(windowId)) {
    console.warn(`Window with ID ${windowId} already exists.`);
    return false;
  }
  windowsManager.set(windowId, {
    ...windowData,
    show: () => {
      windowData.show();
      WindowsChanged();
    },
    hide: () => {
      windowData.hide();
      WindowsChanged();
    }
  });
  WindowsChanged();
  return true;
}

export function removeWindow(windowId: string): boolean {
  const deleted = windowsManager.delete(windowId);
  if (deleted) {
    WindowsChanged();
  }
  return deleted;
}

export function createWindowManager(windowId: string) {
  const windowManager = {
    getWindow: (): WindowType | undefined => {
      return getWindow(windowId);
    },
    setWindow: (windowData: WindowType) => {
      return registerWindow(windowId, windowData);
    },
    removeWindow: () => {
      return removeWindow(windowId);
    }
  };
  return windowManager;
}
