import { SpotterCommand } from "@/components/spotter/types/others/commands";
import { quitApp } from "@/lib/utility/spotter";

async function execute() {
  quitApp();
}

export const QuitApp: SpotterCommand = {
  icon: "MonitorX",
  id: "QuitApp",
  title: "Quit QuickFinder",
  type: "Command",
  execute
};
