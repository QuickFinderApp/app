"use client";

import { openLink } from "@/lib/utility/spotter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getOS } from "@/lib/keyboard";
import { SettingsNavBar } from "./nav-bar";
import { AppWindowIcon, CogIcon, CpuIcon, HammerIcon } from "lucide-react";
import SettingsGeneralPage from "./pages/general";
import SettingsAboutPage from "@/components/settings/pages/about";
import SettingsComingSoonPage from "./pages/coming-soon";

type SettingsPageProps = {
  activeTab: string;
};
export function SettingsPage({ activeTab }: SettingsPageProps) {
  const os = getOS();

  const tabs = [
    {
      id: "general",
      label: "General",
      icon: CogIcon,
      content: SettingsGeneralPage
    },
    {
      id: "extensions",
      label: "Extensions",
      icon: CpuIcon,
      content: SettingsComingSoonPage
    },
    {
      id: "settings",
      label: "Settings",
      icon: HammerIcon,
      content: SettingsComingSoonPage
    },
    {
      id: "about",
      label: "About",
      icon: AppWindowIcon,
      content: SettingsAboutPage
    }
  ];

  const currentTab = tabs.find((tab) => tab.id === activeTab);
  const TabContent = currentTab?.content;

  return (
    <div
      className={cn(
        "h-screen flex flex-col",
        os !== "Windows" && "bg-gradient-to-b from-background to-backgroundSecondary",
        os == "Windows" && "bg-gradient-to-b from-background-full to-backgroundSecondary-full"
      )}
    >
      <SettingsNavBar activeTab={activeTab} tabs={tabs} />
      <Separator />
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto custom-scrollbar p-2">{TabContent && <TabContent />}</div>
      </div>
      <Separator />
      <div className="flex flex-row gap-2 my-4 justify-center">
        <Button onClick={() => openLink("https://github.com/QuickFinderApp/issues/")}>Open GitHub</Button>
      </div>
    </div>
  );
}
