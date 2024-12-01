// Helps with Raycast Compatability :>

import { Theme } from "./themer";

type RaycastThemeVersion1 = {
  authorUsername: string;
  version: 1 | "1";
  author: string;
  appearance: "light" | "dark";
  name: string;
  colors: {
    background: string;
    backgroundSecondary: string;
    text: string;
    selection: string;
    loader: string;
    red: string;
    purple: string;
    magenta: string;
    orange: string;
    yellow: string;
    blue: string;
    green: string;
  };
  og_image: string;
};

export type RaycastTheme = RaycastThemeVersion1;

export function convertRaycastTheme(raycastTheme: RaycastTheme): Theme {
  const theme: Theme = {
    appearance: raycastTheme.appearance,
    colors: raycastTheme.colors
  };

  return theme;
}
