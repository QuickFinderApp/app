import { app, Menu, nativeImage, Tray } from "electron";
import { createSettingsWindow } from "../../windows/settings";
import { createSpotterWindow } from "../../windows/spotter";
import path from "path";

export function createMainTray() {
  const glassIcon = nativeImage
    .createFromPath(path.join(__dirname, "assets", "glass.png"))
    .resize({ width: 20, height: 20 });
  const mainTray = new Tray(glassIcon);

  const trayContextMenu = Menu.buildFromTemplate([
    {
      label: "Open Spotter",
      type: "normal",
      click: () => createSpotterWindow()
    },
    { type: "separator" },
    {
      label: `v${app.getVersion()}`,
      type: "normal",
      enabled: false
    },
    {
      label: "Spotter Settings",
      type: "normal",
      click: () => createSettingsWindow()
    },
    { type: "separator" },
    { label: "Quit", type: "normal", click: () => app.quit() }
  ]);

  mainTray.setContextMenu(trayContextMenu);
}
