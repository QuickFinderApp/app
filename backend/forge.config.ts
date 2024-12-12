import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerDMG } from "@electron-forge/maker-dmg";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

import { readFileSync } from "fs";
import { syncVersion } from "./src/scripts/sync-version";
import { buildFrontend, FRONTEND_BUILD_PATH } from "./src/scripts/build-frontend";

let appVersion = "1.0.0";
let buildVersion = "1.0.0";

// Sync versions across all package.json files
try {
  syncVersion();
  
  // Read version from root package.json
  const packageContent = readFileSync("../package.json", "utf8");
  const packageJSON = JSON.parse(packageContent);
  if (packageJSON.version) {
    appVersion = packageJSON.version;
    buildVersion = packageJSON.version;
  }
} catch (error) {
  console.error("Failed to sync/read versions:", error);
  process.exit(1);
}

// Build frontend if in production or if DEV_REGENERATE_FRONTEND is true
const shouldBuildFrontend = process.env.BUILD_ENV === "production" || true;
if (shouldBuildFrontend) {
  try {
    buildFrontend();
  } catch (error) {
    console.error("Failed to build frontend:", error);
    process.exit(1);
  }
}

console.log("App Version:", appVersion);
console.log("Build Version", buildVersion);

const config: ForgeConfig = {
  packagerConfig: {
    executableName: "quick-finder",
    asar: true,
    icon: "icons/static/AppIcon",
    appBundleId: "dev.iamevan.quickfinder",
    appVersion,
    buildVersion,
    appCopyright: "Copyright © 2024 iamEvan"
  },
  rebuildConfig: {},
  makers: [
    // Windows (exe)
    new MakerSquirrel({}),

    // Mac (dmg)
    new MakerDMG(),

    // Linux
    new MakerRpm({
      options: {
        name: "quick-finder",
        genericName: "QuickFinder",
        icon: "./icons/web/icon-512.png"
      }
    }),
    new MakerDeb({
      options: {
        name: "quick-finder",
        genericName: "QuickFinder",
        icon: "./icons/web/icon-512.png"
      }
    })
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      devContentSecurityPolicy: "connect-src 'self' * 'unsafe-eval'",
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            name: "main_window",
            html: `${FRONTEND_BUILD_PATH}/spotter/index.html`,
            js: "./src/windows/spotter/renderer.ts",
            preload: {
              js: "./src/windows/spotter/preload.ts"
            }
          },
          {
            name: "overlay_window",
            html: `${FRONTEND_BUILD_PATH}/overlay/index.html`,
            js: "./src/windows/overlay/renderer.ts",
            preload: {
              js: "./src/windows/overlay/preload.ts"
            }
          },
          {
            name: "settings_window",
            html: `${FRONTEND_BUILD_PATH}/settings/index.html`,
            js: "./src/windows/settings/renderer.ts",
            preload: {
              js: "./src/windows/settings/preload.ts"
            }
          }
        ]
      }
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true
    })
  ]
};

export default config;
