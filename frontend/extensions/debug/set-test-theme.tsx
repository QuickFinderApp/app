import { SpotterCommand } from "@/components/spotter/types/others/commands";
import SpotterDetail from "@/components/spotter/pages/detail";
import { SpotterActionMenu } from "@/components/spotter/types/others/action-menu";
import { useRouter } from "@/lib/stack-router";
import { useSpotterTheme } from "@/lib/themer";
import { convertRaycastTheme, RaycastTheme } from "@/lib/raycast";
import { useEffect } from "react";

const raycastTheme: RaycastTheme = {
  author: "Daniel Hollick",
  authorUsername: "danhollick",
  version: "1",
  name: "Submarine",
  appearance: "dark",
  colors: {
    background: "#001068",
    backgroundSecondary: "#00685E",
    text: "#EAFBFF",
    selection: "#00FFEA",
    loader: "#D6AEFF",
    red: "#F87E7E",
    orange: "#FFB765",
    yellow: "#FEFF7F",
    green: "#7EECAE",
    blue: "#72BAFB",
    purple: "#CE9DFA",
    magenta: "#FFA2D4"
  },
  og_image: "https://www.ray.so/themes-og/danhollick_submarine.png"
};

function Render() {
  const router = useRouter();
  const themer = useSpotterTheme();

  const actionMenu: SpotterActionMenu = {
    title: "Test Themer",
    items: [
      {
        type: "Action",
        id: "back",
        title: "Go Back",
        isPrimary: true,
        shortcut: "Enter",
        onAction: () => router.pop()
      }
    ]
  };

  useEffect(() => {
    themer.setTheme(convertRaycastTheme(raycastTheme));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <SpotterDetail markdown="Success!" actionMenu={actionMenu} />;
}

export const testThemer: SpotterCommand = {
  icon: "Paintbrush",
  id: "test-themer",
  title: "Set Test Theme",
  subtitle: "Themes",
  type: "Command",
  render: Render
};
