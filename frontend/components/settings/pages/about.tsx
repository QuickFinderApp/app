import { Icon } from "@/components/spotter/elements/icon";

export default function SettingsAboutPage() {
  return (
    <>
      <div className="py-4 flex justify-center">
        <div className="flex flex-row items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center">
            <Icon src="icon.png" className="w-full h-full" />
          </div>
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-bold tracking-tight">QuickFinder</h1>
            <p className="text-lg text-muted-foreground">Version 0.0.18</p>
          </div>
        </div>
      </div>
    </>
  );
}
