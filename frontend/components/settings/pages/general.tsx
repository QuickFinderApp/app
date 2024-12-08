import { Label } from "@/components/ui/label";
import { KeyComboHint, KeyName } from "@/lib/keyboard";
import { LaunchOnLoginSwitch } from "../components/launch-on-login-switch";

export default function SettingsGeneralPage() {
  return (
    <>
      <div className="py-4 px-4 flex flex-col items-center">
        <div className="w-full max-w-md space-y-4">
          <LaunchOnLoginSwitch />
          <div className="flex items-center justify-between">
            <Label htmlFor="hotkey" className="text-sm font-medium">
              Spotter Hotkey
            </Label>
            <div className="w-32">
              <div className="flex flex-row gap-1 justify-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm">
                <KeyComboHint combo={[KeyName.Ctrl, KeyName.Space]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
