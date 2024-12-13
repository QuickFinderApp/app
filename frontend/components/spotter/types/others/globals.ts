export type ApplicationItem = {
  name: string;
  icon: string;
  path: string;
};

export type SystemInfo = {
  hostname: string;
  os: string;
  host: string;
  kernel: string;
  uptime: string;
  packages: string;

  resolution: string;
  de: string;
  wm: string;
  wmTheme: string;
  terminal: string;
  terminalFont: string;
  cpu: string;
  gpu: string;
  memory: string;
};

// Declare the global spotter variable
declare global {
  const spotter: {
    getCachedApplications: () => Promise<ApplicationItem[]>;
    getApplications: () => Promise<ApplicationItem[]>;

    openApp: (appPath: string) => void;
    openLink: (link: string) => void;
    openFileLocation: (filePath: string) => void;

    show: () => void;
    hide: () => void;
    quit: () => void;

    launchConfetti: () => void;
    openSettings: () => void;

    runSystemAction: (action: string) => Promise<boolean>;

    getHideOnFocusLost: () => Promise<boolean>;
    setHideOnFocusLost: (value: boolean) => Promise<void>;
    getSystemInfo: () => Promise<SystemInfo>;

    frecency: {
      recordAccess: (commandId: string) => Promise<void>;
      getScores: () => Promise<Record<string, number>>;
    };
  };

  const overlay: {
    onConfetti: (callback: () => void) => void;
  };

  const main: {
    getVersion: () => Promise<string>;
    getSetting: <T>(setting: string) => Promise<T>;
    setSetting: <T>(setting: string, value: T) => Promise<boolean>;

    onSettingsChanged: (callback: () => void) => void;
  };
}

// Ensure this file is treated as a module
export {};
