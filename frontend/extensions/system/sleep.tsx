import { SpotterCommand } from "@/components/spotter/types/others/commands";
import { runSystemAction } from "@/lib/utility/spotter";

async function execute() {
  const success = await runSystemAction("sleep");
  // TODO: display success message or error message to user
}

export const SleepCommand: SpotterCommand = {
  icon: "Moon",
  id: "sleep",
  title: "Sleep",
  type: "Command",
  execute
};
