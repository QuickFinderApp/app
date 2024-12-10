import { Label } from "@/components/ui/label";
import { KeyComboHint, KeyName } from "@/lib/keyboard";
import { LaunchOnLoginSwitch } from "../components/launch-on-login-switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ThemeSelector } from "../components/theme-selector";

export default function SettingsGeneralPage() {
  return (
    <>
      <div className="py-4 px-4 flex flex-col items-center">
        <div className="w-full max-w-md space-y-4">
          <LaunchOnLoginSwitch />
          <ThemeSelector />
          <div className="flex items-center justify-between">
            <Label htmlFor="hotkey" className="text-sm font-medium">
              Spotter Hotkey
            </Label>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-32">
                    <div className="flex flex-row gap-1 justify-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm">
                      <KeyComboHint combo={[KeyName.Ctrl, KeyName.Space]} />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className={cn("flex flex-row justify-center items-center gap-1")}>
                  <p>Coming Soon!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </>
  );
}
