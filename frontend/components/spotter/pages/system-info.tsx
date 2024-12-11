"use client";

import { useState, useEffect } from "react";
import { Spotter } from "../spotter/spotter";
import { getSystemInfo } from "@/lib/utility/spotter";
import { SystemInfo } from "../types/others/globals";

export default function SpotterSystemInfo() {
  const [info, setInfo] = useState<SystemInfo | null>(null);

  useEffect(() => {
    async function fetchSystemInfo() {
      try {
        const systemInfo = await getSystemInfo();
        setInfo(systemInfo);
      } catch (error) {
        console.error("Error fetching system info:", error);
        // Handle error appropriately
      }
    }

    fetchSystemInfo();
  }, []);

  return (
    <Spotter
      data={{
        element: "SystemInfo",
        info
      }}
    />
  );
}
