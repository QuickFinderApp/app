"use client";

import { ConfettiCommand } from "./confetti";
import { OpenSettings } from "./open-settings";
import { QuitApp } from "./quit-app";

const initialCommands = [QuitApp, ConfettiCommand, OpenSettings];
const commands = initialCommands.map((command) => {
  return {
    extensionId: "main",
    extensionName: "Main",
    extensionIcon: "icon.png",
    ...command
  };
});

export default commands;
