import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type SettingsNavBarProps = {
  activeTab: string;
  tabs: Array<{
    id: string;
    label: string;
    icon: React.FC<{ className?: string }>;
  }>;
};
export function SettingsNavBar({ activeTab, tabs }: SettingsNavBarProps) {
  const router = useRouter();

  return (
    <nav className="flex gap-4 justify-center my-2">
      {tabs.map((tab) => {
        const ButtonIcon = tab.icon;
        return (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => {
              router.push(`/settings/${tab.id}`);
            }}
            className={cn("h-12 flex flex-col text-text gap-1", activeTab === tab.id && "bg-text-400")}
          >
            <ButtonIcon className="h-4 w-4" />
            {tab.label}
          </Button>
        );
      })}
    </nav>
  );
}
