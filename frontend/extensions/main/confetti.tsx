import { SpotterCommand } from "@/components/spotter/types/others/commands";
import { confetti } from "@/lib/utils";

async function execute() {
  confetti();
}

export const ConfettiCommand: SpotterCommand = {
  icon: "PartyPopper",
  id: "Confetti",
  title: "Confetti",
  type: "Command",
  execute
};
