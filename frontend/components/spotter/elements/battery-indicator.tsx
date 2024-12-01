"use client";

import { Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useBattery } from "@uidotdev/usehooks";
import dynamic from "next/dynamic";

interface EnhancedBatteryIndicatorProps {
  supported: boolean;
  loading: boolean;
  level: number | null;
  charging: boolean | null;
  chargingTime: number | null;
  dischargingTime: number | null;
}

export function EnhancedBatteryIndicator({
  supported,
  loading,
  level,
  charging,
  chargingTime,
  dischargingTime
}: EnhancedBatteryIndicatorProps) {
  if (!supported || loading || level === null) {
    return (
      <div className="flex items-center gap-1 text-text-600">
        <Battery className="h-4 w-4" />
        <span className="text-sm">N/A</span>
      </div>
    );
  }

  const percentage = Math.round(level * 100);

  const getBatteryIcon = () => {
    if (charging) return BatteryCharging;
    if (percentage >= 90) return BatteryFull;
    if (percentage >= 50) return BatteryMedium;
    if (percentage >= 20) return BatteryLow;
    return BatteryWarning;
  };

  const BatteryIcon = getBatteryIcon();

  const getStatusColor = () => {
    if (charging) return "text-green";
    if (percentage <= 20) return "text-red";
    if (percentage <= 50) return "text-yellow";
    return "text-primary";
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null || seconds === Infinity) return "Unknown";
    if (seconds === 0) return "Fully charged";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getTimeStatus = () => {
    if (charging) {
      if (chargingTime === 0) return "Fully charged";
      if (chargingTime === Infinity) return "Charging";
      return `Full in: ${formatTime(chargingTime)}`;
    } else {
      if (dischargingTime === Infinity) return "Calculating...";
      return `Time remaining: ${formatTime(dischargingTime)}`;
    }
  };

  const tooltipContent = (
    <div className="text-sm">
      <p className="font-medium">{percentage}% Battery</p>
      <p>{getTimeStatus()}</p>
    </div>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-1 ${getStatusColor()}`}>
            <BatteryIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{percentage}%</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function InternalBatteryIndicator() {
  const batteryData = useBattery();

  if (!batteryData.supported) {
    return null;
  }

  return (
    <div className="ml-2 blacklistDrag">
      <EnhancedBatteryIndicator {...batteryData} />
    </div>
  );
}
export const BatteryIndicator = dynamic(async () => InternalBatteryIndicator, {
  ssr: false
});
