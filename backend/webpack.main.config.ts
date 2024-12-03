import type { Compiler, Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import fs from "fs";
// eslint-disable-next-line import/default
import CopyPlugin from "copy-webpack-plugin";
import path from "path";

// This adds back executable permissions to the binaries, as permissions are lost when copying files with copy-webpack-plugin.
class PermissionsPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tap("PermissionsPlugin", () => {
      const directoryPath = path.join(__dirname, "./.webpack/main/assets/binaries");
      console.log("Changing permissions for directory:", directoryPath);
      this.setPermissionsRecursively(directoryPath);
    });
  }

  private setPermissionsRecursively(dirPath: string) {
    if (fs.existsSync(dirPath)) {
      fs.readdirSync(dirPath).forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          this.setPermissionsRecursively(filePath);
        }

        console.log("Setting permissions for:", filePath);
        fs.chmodSync(filePath, 0o755);
      });
    } else {
      console.log("Directory not found:", dirPath);
    }
  }
}

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/index.ts",
  // Put your normal webpack config below here
  module: {
    rules
  },
  plugins: [
    new PermissionsPlugin(),
    new CopyPlugin({
      patterns: [
        // assets
        {
          from: "src/assets",
          to: "./assets"
        }
      ],
      options: {
        concurrency: 100
      }
    }),
    ...plugins
  ],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"]
  },
  devtool: process.env.BUILD_ENV === "production" ? false : "eval"
};
