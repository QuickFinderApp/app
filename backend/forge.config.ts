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

import fs, { existsSync, readFileSync } from "fs";
import path from "path";
import { execSync } from "child_process";

let appVersion = "dev";
let buildVersion = "dev";

const DEV_REGENERATE_FRONTEND = true;
let REGENERATE_FRONTEND = DEV_REGENERATE_FRONTEND;
if (process.env.BUILD_ENV == "production") {
  REGENERATE_FRONTEND = true;

  try {
    const packageContent = readFileSync("../package.json", "utf8");
    const packageJSON = JSON.parse(packageContent);
    if (packageJSON.version) {
      appVersion = packageJSON.version;
    }
  } catch {
    /* empty */
  }

  try {
    const gitDir = path.resolve(__dirname, "../.git");
    if (existsSync(gitDir)) {
      buildVersion = execSync("git rev-parse --short HEAD", { cwd: path.dirname(gitDir) })
        .toString()
        .trim();
    }
  } catch {
    /* empty */
  }
}

console.log("App Version:", appVersion);
console.log("Build Version", buildVersion);

const config: ForgeConfig = {
  packagerConfig: {
    executableName: "quick-finder",
    asar: true,
    icon: "icons/macos/AppIcon.icns",
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
            html: "./src/out/spotter.html",
            js: "./src/windows/spotter/renderer.ts",
            preload: {
              js: "./src/windows/spotter/preload.ts"
            }
          },
          {
            name: "overlay_window",
            html: "./src/out/overlay.html",
            js: "./src/windows/overlay/renderer.ts",
            preload: {
              js: "./src/windows/overlay/preload.ts"
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

// Function to run build script and copy output
const runBuildScriptAndCopyOutput = () => {
  const outputDir = path.join(__dirname, "../frontend/out");
  const targetDir = path.join(__dirname, "src/out");

  try {
    // Run the build script
    execSync("npm run build", { cwd: "../frontend", stdio: "inherit" });

    // Check if output directory exists
    if (fs.existsSync(outputDir)) {
      // Remove existing contents in the target directory
      if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
      }

      // Copy the output directory to the target directory recursively
      fs.cpSync(outputDir, targetDir, { recursive: true });

      console.log(`Successfully copied build output from ${outputDir} to ${targetDir}`);
    } else {
      console.error(`Output directory does not exist: ${outputDir}`);
      process.exit(1);
    }
  } catch (error) {
    console.error("Error running build script:", error);
    process.exit(1);
  }
};

if (REGENERATE_FRONTEND) {
  // Run the build script and copy output before the packaging process
  runBuildScriptAndCopyOutput();
}

export default config;
