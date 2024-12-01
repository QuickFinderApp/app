import { useRouter } from "@/lib/stack-router";
import { CenterText } from "../elements/center-text";
import { SpotterActionMenu } from "../types/others/action-menu";

export function useSpotterUnknown() {
  const body = (
    <CenterText
      icon="Frown"
      iconClassName="text-foreground"
      title="Not Found"
      description="How did you get here?"
    />
  );

  const router = useRouter();
  async function onAction() {
    router.pop();
  }

  const actionMenu: SpotterActionMenu = {
    title: "Unknown",
    items: [
      {
        type: "Action",
        id: "back",
        title: "Go Back",
        isPrimary: true,
        shortcut: "Enter",
        onAction
      }
    ]
  };

  return {
    body,
    actionMenu
  };
}
