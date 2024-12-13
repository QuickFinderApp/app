import { SpotterCommand } from "@/components/spotter/types/others/commands";
import { confirmAlert } from "@/lib/alert";
import { quitApp } from "@/lib/utility/spotter";

async function execute() {
  const res = await confirmAlert({
    icon: "MonitorX",
    title: "Quit App",
    message: "Are you sure you want to quit QuickFinder?",
    primaryAction: {
      title: "Quit",
      style: "Destructive"
    },
    secondaryAction: {
      title: "Cancel",
      style: "Cancel"
    }
  });
  if (res !== "Primary") return;

  quitApp();
}

export const QuitApp: SpotterCommand = {
  icon: "MonitorX",
  id: "quit-app",
  title: "Quit QuickFinder",
  type: "Command",
  execute
};
