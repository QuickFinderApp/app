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
  };
}

// Ensure this file is treated as a module
export {};
