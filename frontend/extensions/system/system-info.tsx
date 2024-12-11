import { Command } from "@/types/command";
import { useEffect, useState } from "react";
import { SpotterData } from "@/components/spotter/types/layouts/layouts";

const SystemInfoView = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SpotterData | null>(null);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const info = await spotter.getSystemInfo();
        setData({
          type: "system-info",
          info
        });
      } catch (error) {
        console.error("Failed to fetch system info:", error);
        setData({
          type: "error",
          error: "Failed to load system information"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSystemInfo();
  }, []);

  if (loading) {
    return <div className="p-4">Loading system information...</div>;
  }

  if (!data) {
    return {
      type: "error",
      error: "Failed to load system information"
    };
  }
  return data;
};

export const systemInfoCommand: Command = {
  id: "system-info",
  name: "System Info",
  description: "Display system information in a neofetch-like style",
  keywords: ["system", "info", "neofetch", "specs", "hardware"],
  icon: "🖥️",
  parent: "system",
  fullScreen: true,
  component: SystemInfoView,
};