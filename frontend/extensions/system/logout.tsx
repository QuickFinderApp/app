import { SpotterCommand } from "@/components/spotter/types/others/commands";
import { confirmAlert } from "@/lib/alert";
import { runSystemAction } from "@/lib/utils";

async function execute() {
  const res = await confirmAlert({
    icon: "LockIcon",
    title: "Restart",
    message: "Are you sure you want to logout?",
    primaryAction: {
      title: "Logout",
      style: "Destructive"
    },
    secondaryAction: {
      title: "Cancel",
      style: "Cancel"
    }
  });
  if (res !== "Primary") return;

  const success = await runSystemAction("logout");
  // TODO: display success message or error message to user
}

export const LogoutCommand: SpotterCommand = {
  icon: "DoorOpen",
  id: "logout",
  title: "Logout",
  type: "Command",
  execute
};
