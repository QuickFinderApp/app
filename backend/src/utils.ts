import { BrowserWindow, screen } from "electron";

export type WindowType = {
  window: BrowserWindow;
  show: () => void;
  hide: () => void;
};

export function getFocusedDisplay() {
  const point = screen.getCursorScreenPoint();
  return screen.getDisplayNearestPoint(point);
}

export function getFocusedDisplayBounds() {
  const display = getFocusedDisplay();
  const bounds = display.bounds;
  return bounds;
}
