import { AlertCircle } from "lucide-react";

export default function SettingsComingSoonPage() {
  return (
    <>
      <div className="py-4 px-4 flex flex-col items-center justify-center h-full">
        <div className="w-full max-w-md space-y-4 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="text-2xl font-bold">Coming Soon</h2>
          <p className="text-muted-foreground">
            {`We're working hard to bring you exciting new features.`}
            <br />
            This page is currently under development.
          </p>
          <p className="text-sm text-muted-foreground">Stay tuned for updates!</p>
        </div>
      </div>
    </>
  );
}
