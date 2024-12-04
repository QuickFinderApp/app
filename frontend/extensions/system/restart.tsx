import { SpotterCommand } from "@/components/spotter/types/others/commands";
import { confirmAlert } from "@/lib/alert";
import { runSystemAction } from "@/lib/utils";

async function execute() {
  const res = await confirmAlert({
    icon: "PowerCircle",
    title: "Restart",
    message: "Are you sure you want to restart the system?",
    primaryAction: {
      title: "Restart",
      style: "Destructive"
    },
    secondaryAction: {
      title: "Cancel",
      style: "Cancel"
    }
  });
  if (res !== "Primary") return;

  const success = await runSystemAction("restart");
  // TODO: display success message or error message to user
}

export const RestartCommand: SpotterCommand = {
  icon: "Power",
  id: "restart",
  title: "Restart",
  type: "Command",
  execute
};
