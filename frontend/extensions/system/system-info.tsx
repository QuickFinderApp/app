import SpotterSystemInfo from "@/components/spotter/pages/system-info";
import { SpotterCommand } from "@/components/spotter/types/others/commands";

const SystemInfoView = () => {
  return <SpotterSystemInfo />;
};

export const SystemInfoCommand: SpotterCommand = {
  type: "Command",
  id: "system-info",
  title: "System Info",
  keywords: ["system", "info", "specs", "hardware"],
  icon: "ComputerIcon",
  render: SystemInfoView
};
