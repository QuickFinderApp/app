import os from "os";
import { execSync } from "child_process";
import { screen } from "electron";

interface SystemInfo {
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
}

function formatUptime(uptime: number): string {
  const days = Math.floor(uptime / (24 * 60 * 60));
  const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((uptime % (60 * 60)) / 60);
  return `${days} days, ${hours} hours, ${minutes} mins`;
}

function getPackageCount(): string {
  try {
    if (process.platform === "darwin") {
      const brewCount = execSync("brew list | wc -l").toString().trim();
      return `${brewCount} (brew)`;
    } else if (process.platform === "linux") {
      // Try different package managers
      try {
        const aptCount = execSync('dpkg -l | grep "^ii" | wc -l').toString().trim();
        return `${aptCount} (apt)`;
      } catch {
        try {
          const pacmanCount = execSync("pacman -Q | wc -l").toString().trim();
          return `${pacmanCount} (pacman)`;
        } catch {
          return "Unknown";
        }
      }
    } else if (process.platform === "win32") {
      // Count Windows Store apps
      const appxCount = execSync('powershell "Get-AppxPackage | Measure-Object | Select-Object -ExpandProperty Count"')
        .toString()
        .trim();
      return `${appxCount} (store)`;
    }
  } catch {
    return "Unknown";
  }
  return "Unknown";
}

function getGPUInfo(): string {
  try {
    if (process.platform === "darwin") {
      const gpuInfo = execSync('system_profiler SPDisplaysDataType | grep "Chipset Model:" | cut -d: -f2')
        .toString()
        .trim();
      return gpuInfo || "Unknown";
    } else if (process.platform === "linux") {
      const gpuInfo = execSync("lspci | grep -i vga").toString().trim();
      return gpuInfo.split(":").pop()?.trim() || "Unknown";
    } else if (process.platform === "win32") {
      const gpuInfo = execSync("wmic path win32_VideoController get name").toString().split("\n")[1].trim();
      return gpuInfo || "Unknown";
    }
  } catch {
    return "Unknown";
  }
  return "Unknown";
}

function getDesktopEnvironment(): { de: string; wm: string; wmTheme: string } {
  if (process.platform === "darwin") {
    return {
      de: "Aqua",
      wm: "Quartz Compositor",
      wmTheme: "System"
    };
  } else if (process.platform === "linux") {
    const de = process.env.XDG_CURRENT_DESKTOP || process.env.DESKTOP_SESSION || "Unknown";
    const wm = process.env.WINDOW_MANAGER || "Unknown";
    return {
      de,
      wm,
      wmTheme: "System"
    };
  } else if (process.platform === "win32") {
    return {
      de: "Explorer",
      wm: "DWM",
      wmTheme: "Windows"
    };
  }
  return {
    de: "Unknown",
    wm: "Unknown",
    wmTheme: "Unknown"
  };
}

export async function getSystemInfo(): Promise<SystemInfo> {
  const { de, wm, wmTheme } = getDesktopEnvironment();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const primaryDisplay = screen.getPrimaryDisplay();

  return {
    hostname: os.hostname(),
    os:
      process.platform === "darwin"
        ? `macOS ${os.release()}`
        : process.platform === "win32"
          ? `Windows ${os.release()}`
          : `${os.type()} ${os.release()}`,
    host: process.platform === "darwin" ? "MacBook" : process.platform === "win32" ? "PC" : os.hostname(),
    kernel: os.release(),
    uptime: formatUptime(os.uptime()),
    packages: getPackageCount(),

    resolution: `${primaryDisplay.size.width}x${primaryDisplay.size.height}`,
    de,
    wm,
    wmTheme,
    terminal: process.env.TERM_PROGRAM || "Unknown",
    terminalFont: "System",
    cpu: os.cpus()[0].model,
    gpu: getGPUInfo(),
    memory: `${Math.round(usedMem / 1024 / 1024)}MB / ${Math.round(totalMem / 1024 / 1024)}MB`
  };
}
