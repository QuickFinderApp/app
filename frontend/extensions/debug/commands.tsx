"use client";

import { v0 } from "./v0";
import { Roblox } from "./roblox";
import { dictionary } from "./dictionary";
import themes from "./test-themes";

const debug = false;

const initialCommands = [v0, Roblox, dictionary, ...themes];
const commands = initialCommands
  .map((command) => {
    return {
      extensionId: "main",
      extensionName: "Main",
      extensionIcon: "Hammer",
      ...command
    };
  })
  .filter(() => debug);

export default commands;
