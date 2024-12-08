import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { getLaunchOnBootSetting, setLaunchOnBootSetting } from "@/lib/utility/settings";
import { Skeleton } from "@/components/ui/skeleton";

export function LaunchOnLoginSwitch() {
  const [startOnLogin, setStartOnLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    getLaunchOnBootSetting().then((shouldStartAtLogin) => {
      setStartOnLogin(shouldStartAtLogin);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="start-on-login" className="text-sm font-medium">
        Launch at Login
      </Label>
      <div className="h-5 flex flex-row justify-center">
        {!loading && (
          <Switch
            id="start-on-login"
            checked={startOnLogin}
            disabled={disabled}
            onCheckedChange={async () => {
              const newState = !startOnLogin;
              const promise = setLaunchOnBootSetting(newState);

              setDisabled(true);

              const success = await promise;
              if (success) {
                setStartOnLogin(newState);
              } else {
                // TODO: Show error on overlay if failed
              }

              setDisabled(false);
            }}
          />
        )}
        {loading && <Skeleton className="bg-text-400 w-32" />}
      </div>
    </div>
  );
}
