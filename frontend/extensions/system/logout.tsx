import { SpotterCommand } from "@/components/spotter/types/others/commands";
import { runSystemAction } from "@/lib/utils";

async function execute() {
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
