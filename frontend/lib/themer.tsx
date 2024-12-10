"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { getThemeSetting } from "./utility/settings";
import { themes } from "./utility/themes";

export type Theme = {
  name?: string;
  display?: string;
  appearance: "light" | "dark";
  colors: {
    background: string;
    backgroundSecondary: string; // not used yet
    text: string;
    selection: string;
    loader: string;
    red: string;
    orange: string;
    yellow: string;
    green: string;
    blue: string;
    purple: string;
    magenta: string;
  };
};

const defaultTheme: Theme = themes.find((theme) => theme.appearance === "dark")!;

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}>({ theme: defaultTheme, setTheme: () => {} });

export const useSpotterTheme = () => useContext(ThemeContext);

type ThemerProps = {
  children: React.ReactNode;
};

function getSystemTheme() {
  if (typeof window === "undefined") {
    return "dark";
  }

  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function Themer({ children }: ThemerProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    function refreshTheme() {
      getThemeSetting().then((themeId) => {
        if (themeId == "system") {
          themeId = getSystemTheme();
        }

        const newTheme = themes.find((theme) => {
          return theme.name == themeId;
        });
        if (newTheme) {
          setTheme(newTheme);
        }
      });
    }

    refreshTheme();
    if (typeof main !== "undefined") {
      main.onSettingsChanged(() => {
        refreshTheme();
      });
    }
  }, []);

  const colorTheme = useTheme();

  useEffect(() => {
    colorTheme.setTheme(theme.appearance);

    const themeStyles: { [key: string]: string } = {};

    for (const [key, value] of Object.entries(theme.colors)) {
      themeStyles[`--${key}`] = value;
    }

    Object.entries(themeStyles).forEach(([property, value]) => {
      document.body.style.setProperty(property, value);
    });

    return () => {
      Object.keys(themeStyles).forEach((property) => {
        document.body.style.removeProperty(property);
      });
    };
  }, [theme, colorTheme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
