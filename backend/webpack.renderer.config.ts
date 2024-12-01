import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
// eslint-disable-next-line import/default
import CopyPlugin from "copy-webpack-plugin";

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }]
});

export const rendererConfig: Configuration = {
  module: {
    rules
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        // main (dev)
        {
          from: "src/out",
          to: ".",
          globOptions: {
            ignore: ["**/index.html"]
          }
        },
        // spotter window (prod)
        {
          from: "src/out",
          to: "./main_window",
          globOptions: {
            ignore: ["**/index.html"]
          }
        },
        // overlay window (prod)
        {
          from: "src/out",
          to: "./overlay_window",
          globOptions: {
            ignore: ["**/index.html"]
          }
        }
      ],
      options: {
        concurrency: 100
      }
    }),
    ...plugins
  ],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"]
  },
  output: {
    publicPath: "./"
  }
};
