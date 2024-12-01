"use client";

import { SpotterCommand } from "@/components/spotter/types/others/commands";
import { ApplicationItem } from "@/components/spotter/types/others/globals";
import { openApp } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

async function getAllApplications() {
  try {
    return await spotter.getApplications();
  } catch {
    return [];
  }
}

export function useApplicationCommands() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);

  useEffect(() => {
    // TODO: Cache this and return stale as its refreshing
    getAllApplications().then((apps) => {
      setApplications(apps);
    });
  }, []);

  const applicationCommands = useMemo((): SpotterCommand[] => {
    return applications.map((app) => {
      function execute() {
        openApp(app.path);
      }

      return {
        extensionId: "applications",
        extensionName: "Applications",
        extensionIcon: "AppWindow",

        icon: app.icon || "FileQuestion",
        id: app.name,
        title: app.name,
        filePath: app.path,
        type: "Application",
        execute
      };
    });
  }, [applications]);

  return applicationCommands;
}
