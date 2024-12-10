"use client";

import { SpotterCommand } from "@/components/spotter/types/others/commands";
import { ApplicationItem } from "@/components/spotter/types/others/globals";
import { hideSpotter, openApp } from "@/lib/utility/spotter";
import { useEffect, useMemo, useState } from "react";

async function getAllCachedApplications() {
  try {
    return await spotter.getCachedApplications();
  } catch {
    return [];
  }
}

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
    let finished = false;

    getAllCachedApplications().then((apps) => {
      if (!finished) {
        setIsLoading(false);
        setApplications(apps);
      }
    });

    getAllApplications().then((apps) => {
      finished = true;
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
