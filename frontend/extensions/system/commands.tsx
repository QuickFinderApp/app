"use client";

import { LockScreenCommand } from "./lock-screen";
import { LogoutCommand } from "./logout";
import { RestartCommand } from "./restart";
import { ShutdownCommand } from "./shutdown";
import { SleepCommand } from "./sleep";
import { SystemInfoCommand } from "./system-info";

const initialCommands = [
  SystemInfoCommand,
  ShutdownCommand,
  RestartCommand,
  SleepCommand,
  LogoutCommand,
  LockScreenCommand
];
const commands = initialCommands.map((command) => {
  return {
    extensionId: "system",
    extensionName: "System",
    extensionIcon: "LaptopMinimal",
    subtitle: "System",
    ...command
  };
});

export default commands;
