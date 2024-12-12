import { SpotterData, SpotterLayout } from "../types/layouts/layouts";
import { SpotterSystemInfoData } from "../types/layouts/system-info";

export function useSpotterSystemInfo(spotterData: SpotterData): SpotterLayout {
  const { info } = spotterData as SpotterSystemInfoData;

  const isLoading = !info;

  const body = (
    <>
      {!isLoading && (
        <div className="p-4 flex gap-8">
          <div className="text-left">
            <p>
              <span className="text-[#98c379]">Hostname: </span>
              {info.hostname}
            </p>
            <p>
              <span className="text-[#98c379]">OS: </span>
              {info.os}
            </p>
            <p>
              <span className="text-[#98c379]">Host: </span>
              {info.host}
            </p>
            <p>
              <span className="text-[#98c379]">Kernel: </span>
              {info.kernel}
            </p>
            <p>
              <span className="text-[#98c379]">Uptime: </span>
              {info.uptime}
            </p>
            <p>
              <span className="text-[#98c379]">Packages: </span>
              {info.packages}
            </p>
            <p>
              <span className="text-[#98c379]">Resolution: </span>
              {info.resolution}
            </p>
            <p>
              <span className="text-[#98c379]">DE: </span>
              {info.de}
            </p>
            <p>
              <span className="text-[#98c379]">WM: </span>
              {info.wm}
            </p>
            <p>
              <span className="text-[#98c379]">WM Theme: </span>
              {info.wmTheme}
            </p>
            <p>
              <span className="text-[#98c379]">CPU: </span>
              {info.cpu}
            </p>
            <p>
              <span className="text-[#98c379]">GPU: </span>
              {info.gpu}
            </p>
            <p>
              <span className="text-[#98c379]">Memory: </span>
              {info.memory}
            </p>
          </div>
        </div>
      )}
    </>
  );

  return {
    body,
    isLoading: isLoading
  };
}
