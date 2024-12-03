import { screen } from "electron";

export function getFocusedDisplay() {
  const point = screen.getCursorScreenPoint();
  return screen.getDisplayNearestPoint(point);
}

export function getFocusedDisplayBounds() {
  const display = getFocusedDisplay();
  const bounds = display.bounds;
  return bounds;
}
