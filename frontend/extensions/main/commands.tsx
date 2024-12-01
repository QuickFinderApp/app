"use client";

import { QuitApp } from "./quit-app";

const initialCommands = [QuitApp];
const commands = initialCommands.map((command) => {
  return {
    extensionId: "main",
    extensionName: "Main",
    extensionIcon: "icon.png",
    ...command
  };
});

export default commands;
