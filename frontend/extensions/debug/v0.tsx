import { SpotterCommand } from "@/components/spotter/types/others/commands";
import { openLink } from "@/lib/utils";

async function execute() {
  openLink("https://v0.dev");
}

export const v0: SpotterCommand = {
  icon: "https://pbs.twimg.com/profile_images/1711816706874540032/z07hmQEH_400x400.png",
  id: "v0",
  title: "v0",
  subtitle: "v0.dev",
  keywords: ["vercel", "v0"],
  type: "Link",
  execute
};
