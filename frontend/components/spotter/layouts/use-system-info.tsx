import { ActionRunner } from "../spotter/spotter";
import { SystemInfoLayout } from "../types/layouts/system-info";
import { SpotterData, SpotterLayout } from "../types/layouts/layouts";
import { SystemInfo } from "./system-info";

export function useSpotterSystemInfo(spotterData: SpotterData, runAction: ActionRunner): SpotterLayout {
  if (spotterData.type !== "system-info") {
    throw new Error("Invalid spotter data type");
  }

  return {
    body: <SystemInfo data={spotterData} />,
    useArrowKeys: true,
  };
}