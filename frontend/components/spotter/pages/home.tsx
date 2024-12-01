"use client";

import { Spotter } from "@/components/spotter/spotter/spotter";
import MainCommands from "@/extensions/main/commands";
import DebugCommands from "@/extensions/debug/commands";
import { generatePageKey, useRouter } from "@/lib/stack-router";
import React from "react";
import { SpotterCommand, SpotterCommandType } from "../types/others/commands";
import { SpotterListItem } from "../types/layouts/list";
import { ActionContext, SpotterItem } from "../types/others/action-menu";
import { useApplicationCommands } from "@/extensions/applications/commands";
import { openFileLocation } from "@/lib/utils";

function getActionText(commandType: SpotterCommandType): string {
  if (commandType == "Application") {
    return "Open App";
  } else if (commandType == "Command") {
    return "Run Command";
  } else if (commandType == "Link") {
    return "Open Link";
  }
  return "Run";
}

function getCommandTypeDisplay(command: SpotterCommandType): string {
  return command;
}

export default function SpotterHome() {
  const router = useRouter();

  function executeCommand(command: SpotterCommand, context: ActionContext) {
    if (command.execute) {
      command.execute(context);
    } else if (command.render) {
      const RenderCommand = command.render;
      const result = <RenderCommand {...context} />;
      if (React.isValidElement(result)) {
        router.push({
          key: generatePageKey(`command.${command.id}`),
          component: result
        });
      }
    } else {
      console.warn("Command has no execute or render function", command);
    }
  }

  const appCommands = useApplicationCommands();

  const availableCommands: SpotterCommand[] = [...MainCommands, ...DebugCommands, ...appCommands];

  const items: SpotterListItem[] = availableCommands.map((command) => {
    let id = command.id;
    if (command.extensionId) {
      id = `${command.extensionId}.${id}`;
    }

    const actionMenuItems: SpotterItem[] = [
      {
        type: "Action",
        id: "Main",
        icon: "PanelTopOpen",
        title: getActionText(command.type),
        onAction: (context) => executeCommand(command, context),
        isPrimary: true,
        shortcut: "Enter"
      }
    ];
    if (command.filePath) {
      actionMenuItems.push({
        type: "Action",
        id: "OpenFileLocation",
        icon: "FolderSearch",
        title: "Open File Location",
        onAction: () => {
          if (command.filePath) {
            openFileLocation(command.filePath);
          }
        }
      });
    }

    return {
      ...command,
      id,
      accessories: [
        {
          icon: command.extensionIcon,
          text: getCommandTypeDisplay(command.type)
        },
        ...(command.accessories || [])
      ],
      actionMenu: {
        title: command.title,
        items: actionMenuItems
      }
    };
  });

  return (
    <Spotter
      data={{
        element: "List",
        isLoading: false,
        searchBarPlaceholder: "Type to search...",
        items
      }}
    />
  );
}
