import { SpotterCommand } from "@/components/spotter/types/others/commands";
import { confirmAlert } from "@/lib/alert";
import { runSystemAction } from "@/lib/utility/spotter";

async function execute() {
  const res = await confirmAlert({
    icon: "PowerCircle",
    title: "Shutdown",
    message: "Are you sure you want to shutdown the system?",
    primaryAction: {
      title: "Shutdown",
      style: "Destructive"
    },
    secondaryAction: {
      title: "Cancel",
      style: "Cancel"
    }
  });
  if (res !== "Primary") return;

  const success = await runSystemAction("shutdown");
  // TODO: display success message or error message to user
}

export const ShutdownCommand: SpotterCommand = {
  icon: "Power",
  id: "shutdown",
  title: "Shutdown",
  type: "Command",
  execute
};
