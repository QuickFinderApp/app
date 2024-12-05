export type ApplicationItem = {
  name: string;
  icon: string;
  path: string;
};

// Declare the global spotter variable
declare global {
  const spotter: {
    getApplications: () => Promise<ApplicationItem[]>;

    openApp: (appPath: string) => void;
    openLink: (link: string) => void;
    openFileLocation: (filePath: string) => void;

    show: () => void;
    hide: () => void;
    quit: () => void;

    launchConfetti: () => void;

    runSystemAction: (action: string) => Promise<boolean>;

    getHideOnFocusLost: () => Promise<boolean>;
    setHideOnFocusLost: (value: boolean) => Promise<void>;
  };

  const overlay: {
    onConfetti: (callback: () => void) => void;
  };
}

// Ensure this file is treated as a module
export {};
