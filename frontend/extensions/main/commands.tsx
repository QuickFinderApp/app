"use client";

import { ConfettiCommand } from "./confetti";
import { QuitApp } from "./quit-app";

const initialCommands = [QuitApp, ConfettiCommand];
const commands = initialCommands.map((command) => {
  return {
    extensionId: "main",
    extensionName: "Main",
    extensionIcon: "icon.png",
    ...command
  };
});

export default commands;
