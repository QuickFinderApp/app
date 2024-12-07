"use client";

import { SpotterCommand } from "@/components/spotter/types/others/commands";
import { ApplicationItem } from "@/components/spotter/types/others/globals";
import { hideSpotter, openApp } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

async function getAllApplications() {
  try {
    return await spotter.getApplications();
  } catch {
    return [];
  }
}

const extensionInfo = {
  extensionId: "applications",
  extensionName: "Applications",
  extensionIcon: "AppWindow"
};

export function useApplicationCommands() {
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);

  useEffect(() => {
    // TODO: Cache this and return stale as its refreshing
    getAllApplications().then((apps) => {
      setIsLoading(false);
      setApplications(apps);
    });
  }, []);

  const applicationCommands = useMemo((): SpotterCommand[] => {
    const appCommands: SpotterCommand[] = applications.map((app) => {
      function execute() {
        openApp(app.path);
        hideSpotter();
      }

      return {
        ...extensionInfo,

        icon: app.icon || "FileQuestion",
        id: app.path,
        title: app.name,
        filePath: app.path,
        type: "Application",
        execute
      };
    });

    if (isLoading) {
      appCommands.push({
        ...extensionInfo,

        icon: "FileQuestion",
        id: "LoadingApplications",
        title: "Loading Applications...",
        type: "Application",
        canExecute: false,
        execute: () => {}
      });
    }

    return appCommands;
  }, [isLoading, applications]);

  return applicationCommands;
}
