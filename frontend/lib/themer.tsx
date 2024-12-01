"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "next-themes";

export type Theme = {
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

const defaultTheme: Theme = {
  appearance: "dark",
  colors: {
    background: "#030303",
    backgroundSecondary: "#030303",
    text: "#F2F2F2",
    selection: "#FFFFFF",
    loader: "#FFFFFF",
    red: "#F84E4E",
    orange: "#F88D4E",
    yellow: "#FFCC47",
    green: "#4EF8A7",
    blue: "#228CF6",
    purple: "#7B4EF8",
    magenta: "#F84EBD"
  }
};

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}>({ theme: defaultTheme, setTheme: () => {} });

export const useSpotterTheme = () => useContext(ThemeContext);

type ThemerProps = {
  children: React.ReactNode;
};

export function Themer({ children }: ThemerProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

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
