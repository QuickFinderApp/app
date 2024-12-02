"use client";

import { LockScreenCommand } from "./lock-screen";
import { LogoutCommand } from "./logout";
import { RestartCommand } from "./restart";
import { ShutdownCommand } from "./shutdown";
import { SleepCommand } from "./sleep";

const initialCommands = [ShutdownCommand, RestartCommand, SleepCommand, LogoutCommand, LockScreenCommand];
const commands = initialCommands.map((command) => {
  return {
    extensionId: "system",
    extensionName: "System",
    extensionIcon: "LaptopMinimal",
    ...command
  };
});

export default commands;
