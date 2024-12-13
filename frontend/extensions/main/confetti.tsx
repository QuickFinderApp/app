import { SpotterCommand } from "@/components/spotter/types/others/commands";
import { confetti } from "@/lib/utility/spotter";

async function execute() {
  confetti();
}

export const ConfettiCommand: SpotterCommand = {
  icon: "PartyPopper",
  id: "confetti",
  title: "Confetti",
  type: "Command",
  execute
};
