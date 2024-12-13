"use client";

import { Spotter } from "@/components/spotter/spotter/spotter";
import MainCommands from "@/extensions/main/commands";
import SystemCommands from "@/extensions/system/commands";
import DebugCommands from "@/extensions/debug/commands";
import { generatePageKey, useRouter } from "@/lib/stack-router";
import React, { useEffect, useState } from "react";
import { SpotterCommand, SpotterCommandType } from "../types/others/commands";
import { SpotterListItem } from "../types/layouts/list";
import { ActionContext, SpotterItem } from "../types/others/action-menu";
import { useApplicationCommands } from "@/extensions/applications/commands";
import { openFileLocation, openLink } from "@/lib/utility/spotter";
import { trackEvent } from "@/lib/umami/umami";
import { getFrecencyScores, recordCommandAccess, createFrecencyFilter } from "@/lib/utility/frecency";

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

export default function SpotterCommandsHub() {
  const router = useRouter();

  async function executeCommand(command: SpotterCommand, context: ActionContext) {
    const trackEventPayload = {
      extensionId: command.extensionId,
      commandId: command.id
    };

    // Record command usage for frecency
    let commandId = command.id;
    if (command.extensionId) {
      commandId = `${command.extensionId}.${commandId}`;
    }
    await recordCommandAccess(commandId);

    // Update frecency scores
    const newScores = await getFrecencyScores();
    setFrecencyScores(newScores);

    if (command.execute) {
      trackEvent("execute_command_callback", trackEventPayload);
      command.execute(context);
    } else if (command.render) {
      trackEvent("render_command_view", trackEventPayload);

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

  const [frecencyScores, setFrecencyScores] = useState<Record<string, number>>({});

  useEffect(() => {
    getFrecencyScores().then(setFrecencyScores);
  }, []);

  const availableCommands: SpotterCommand[] = [...MainCommands, ...SystemCommands, ...DebugCommands, ...appCommands];

  const items: SpotterListItem[] = availableCommands.map((command) => {
    let id = command.id;
    if (command.extensionId) {
      id = `${command.extensionId}.${id}`;
    }

    const actionMenuItems: SpotterItem[] = [];

    if (command.canExecute !== false) {
      actionMenuItems.push({
        type: "Action",
        id: "Main",
        icon: "PanelTopOpen",
        title: getActionText(command.type),
        onAction: (context) => executeCommand(command, context),
        isPrimary: true,
        shortcut: "Enter"
      });
    }

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
    if (command.webLink) {
      actionMenuItems.push({
        type: "Action",
        id: "OpenWebLink",
        icon: "Link",
        title: "Open Link",
        onAction: () => {
          if (command.webLink) {
            openLink(command.webLink);
          }
        }
      });
    }

    if (command.actionMenu?.items) {
      actionMenuItems.push(...command.actionMenu.items);
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
        items,
        shouldFilter: true,
        filter: createFrecencyFilter(frecencyScores)
      }}
    />
  );
}
