import { SpotterCommand } from "@/components/spotter/types/others/commands";
import SpotterDetail from "@/components/spotter/pages/detail";
import { SpotterActionMenu } from "@/components/spotter/types/others/action-menu";
import { useRouter } from "@/lib/stack-router";
import { useSpotterTheme } from "@/lib/themer";
import { convertRaycastTheme, RaycastTheme } from "@/lib/raycast";
import { useEffect } from "react";

const raycastThemes: RaycastTheme[] = [
  {
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
  },
  {
    author: "Danny Seidel",
    authorUsername: "DannySeidel",
    version: "1",
    name: "Alpenglow",
    appearance: "dark",
    colors: {
      background: "#003F71",
      backgroundSecondary: "#9E0000",
      text: "#EEEEEE",
      selection: "#FF7C43",
      loader: "#5751A1",
      red: "#FF1111",
      orange: "#F86D1C",
      yellow: "#FFC839",
      green: "#23F893",
      blue: "#1686F6",
      purple: "#7546F8",
      magenta: "#F847BA"
    },
    og_image: "https://www.ray.so/themes-og/dannyseidel_alpenglow.png"
  },
  {
    author: "Daniel",
    authorUsername: "daniel",
    version: "1",
    name: "Gradient Solarised",
    appearance: "light",
    colors: {
      background: "#FDFF73",
      backgroundSecondary: "#E99C40",
      text: "#000000",
      selection: "#000000",
      loader: "#000000",
      red: "#FD3131",
      orange: "#F2894C",
      yellow: "#FFCC47",
      green: "#4EF8A7",
      blue: "#228CF6",
      purple: "#7B4EF8",
      magenta: "#F84EBD"
    },
    og_image: "https://www.ray.so/themes-og/daniel_gradient-solarised.png"
  },
  {
    appearance: "light",
    name: "Nadeshiko",
    version: "1",
    author: "M.Y.",
    authorUsername: "nagauta",
    colors: {
      background: "#DC9FB4",
      backgroundSecondary: "#DC9FB4",
      text: "#000000",
      selection: "#DC2F6A",
      loader: "#000000",
      red: "#F84E4E",
      orange: "#F88D4E",
      yellow: "#FFCC47",
      green: "#4EF8A7",
      blue: "#228CF6",
      purple: "#7B4EF8",
      magenta: "#F84EBD"
    },
    og_image: "https://www.ray.so/themes-og/nagauta_nadeshiko.png"
  }
];

export default raycastThemes.map((raycastTheme) => {
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

  const themerCommand: SpotterCommand = {
    icon: "Paintbrush",
    id: `theme-${raycastTheme.name}`,
    title: raycastTheme.name,
    subtitle: "Themes",
    type: "Command",
    webLink: `https://ray.so/themes/${raycastTheme.authorUsername.toLowerCase()}/${raycastTheme.name.toLowerCase()}`,
    render: Render
  };
  return themerCommand;
});
