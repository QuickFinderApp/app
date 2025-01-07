import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { getThemeSetting, setThemeSetting } from "@/lib/utility/settings";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { themes } from "@/lib/utility/themes";

export function ThemeSelector() {
  const [theme, setTheme] = useState("");
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    getThemeSetting().then((newTheme) => {
      setTheme(newTheme);
      setLoading(false);
    });
  }, []);

  const themeIds: {
    name: string;
    display: string;
    bg1: string;
    bg2: string;
  }[] = [
    {
      name: "system",
      display: "System",
      bg1: "#ffffff",
      bg2: "#000000"
    }
  ];
  themes.map((theme) => {
    if (theme.name && theme.display) {
      themeIds.push({
        name: theme.name,
        display: theme.display,
        bg1: theme.colors.background,
        bg2: theme.colors.backgroundSecondary
      });
    }
  });

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="start-on-login" className="text-sm font-medium">
        Theme
      </Label>
      <div className="h-10 flex flex-row justify-center">
        {!loading && (
          <Select
            disabled={disabled}
            value={theme}
            defaultValue="system"
            onValueChange={async (value) => {
              const promise = setThemeSetting(value);

              setDisabled(true);

              const success = await promise;
              if (success) {
                setTheme(value);
              } else {
                // TODO: Show error on overlay if failed
              }

              setDisabled(false);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent className="bg-background-full">
              {themeIds.map(({ name, display, bg1, bg2 }) => {
                return (
                  <SelectItem key={name} value={name}>
                    <div className="flex flex-row gap-1.5 items-center">
                      <div
                        className="rounded-full h-4 w-4"
                        style={{
                          border: "1px solid #545454",
                          background: `linear-gradient(to bottom right, ${bg1}, ${bg2})`,
                          aspectRatio: 1
                        }}
                      ></div>
                      {display}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
        {loading && <Skeleton className="bg-text-400 w-32" />}
      </div>
    </div>
  );
}
