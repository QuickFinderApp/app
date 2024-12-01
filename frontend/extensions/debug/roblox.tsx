import SpotterWelcome from "@/components/spotter/pages/welcome";
import { SpotterCommand } from "@/components/spotter/types/others/commands";

function Render() {
  return <SpotterWelcome />;
}

export const Roblox: SpotterCommand = {
  icon: "https://files.raycast.com/9hoiih0sgx1gqtw1xihiwfgjl1yn",
  id: "roblox",
  title: "Example Post",
  subtitle: "Roblox",
  keywords: ["Roblox"],
  type: "Command",
  render: Render
};
