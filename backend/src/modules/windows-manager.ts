// Manage windows orchastration (is that the right word?)

import { app, BrowserWindow, nativeImage } from "electron";
import path from "path";

export type WindowType = {
  window: BrowserWindow;
  show: () => void;
  hide: () => void;
  hiddenFromDock?: boolean;
};

const windowsManager = new Map<string, WindowType>();
const HIDE_DOCK_ENABLED = true;

function WindowsChanged() {
  const windows = Array.from(windowsManager.values());
  const windowCount = windows.length;

  // macOS only: hide on dock
  if (process.platform == "darwin" && HIDE_DOCK_ENABLED) {
    if (windowCount === 0) {
      app.dock.hide();
    } else {
      const hasDockIcon = windows.some((window) => !window.hiddenFromDock);

      let hideDockIcon: boolean | null = null;

      const activeWindows = windows
        .map((window) => {
          if (window.window.isVisible()) {
            return {
              window,
              isFocused: window.window.isFocused()
            };
          }
          return null;
        })
        .filter((window) => window != null);

      if (hasDockIcon) {
        if (!app.dock.isVisible()) {
          hideDockIcon = false;
        }
      } else {
        if (app.dock.isVisible()) {
          hideDockIcon = true;
        }
      }

      if (hideDockIcon == true) {
        app.dock.hide();

        setTimeout(() => {
          activeWindows.forEach(({ window }) => {
            window.window.restore();
            window.window.focus();
          });
        }, 200);
      } else if (hideDockIcon == false) {
        app.dock.show();
      }
    }
  }
}

export function invokeWindowsChanged() {
  WindowsChanged();
}

export function getWindow(windowId: string): WindowType | undefined {
  return windowsManager.get(windowId);
}

export function registerWindow(windowId: string, windowData: WindowType): boolean {
  if (getWindow(windowId)) {
    console.warn(`Window with ID ${windowId} already exists.`);
    return false;
  }

  if (process.platform == "linux" && windowData.window) {
    windowData.window.setIcon(nativeImage.createFromPath(path.join(__dirname, "assets", "icon-rounded.png")));
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
