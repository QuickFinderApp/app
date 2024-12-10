import { SpotterCommand } from "@/components/spotter/types/others/commands";
import { openSettings } from "@/lib/utility/spotter";

async function execute() {
  openSettings();
}

export const OpenSettings: SpotterCommand = {
  icon: "Cog",
  id: "OpenSettings",
  title: "QuickFinder Settings",
  type: "Command",
  execute
};
