import { SpotterCommand } from "@/components/spotter/types/others/commands";
import { runSystemAction } from "@/lib/utils";

async function execute() {  
  const success = await runSystemAction("lock-screen");
  // TODO: display success message or error message to user
}

export const LockScreenCommand: SpotterCommand = {
  icon: "Lock",
  id: "lock-screen",
  title: "Lock Screen",
  type: "Command",
  execute
};
