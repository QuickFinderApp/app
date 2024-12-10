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
        // main
        {
          from: "src/frontend_build",
          to: "."
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
  }
};
