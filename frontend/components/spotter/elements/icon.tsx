import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useCallback } from "react";
import * as LucideIcons from "lucide-react";

type LucideIconNames = keyof typeof LucideIcons;
// @ts-expect-error workaround
const lucideIcons: Record<LucideIconNames, React.FC<LucideIcons.LucideProps>> = LucideIcons;

export type IconSource = LucideIconNames | (string & {});

export interface IconProps {
  src: IconSource;
  width?: number;
  height?: number;
  className?: string;
}

export const Icon = React.memo(function Icon({ src, width = 24, height = 24, className: extraClassNames }: IconProps) {
  const className = cn(`w-${width} h-${height}`, extraClassNames);

  const renderIcon = useCallback(() => {
    const widthPixels = width * 4;
    const heightPixels = height * 4;

    if (typeof src === "string") {
      if (
        src.startsWith("http://") ||
        src.startsWith("https://") ||
        src.startsWith("file://") ||
        src.startsWith("data:")
      ) {
        // URL case
        return (
          <div className={cn(className, "overflow-hidden")}>
            <Image src={src} className="object-contain" alt="Icon" width={widthPixels} height={heightPixels} />
          </div>
        );
      } else if (src in lucideIcons) {
        // Lucide icon case
        const LucideIcon = lucideIcons[src as LucideIconNames];
        return (
          <div className={cn(className, "flex items-center justify-center")}>
            <LucideIcon className={cn(className)} width={widthPixels} height={heightPixels} />
          </div>
        );
      } else {
        // Local asset case
        const assetPath = src.startsWith("/") ? src : `/assets/${src}`;
        return (
          <div className={cn(className, "overflow-hidden")}>
            <Image src={assetPath} className="object-contain" alt="Icon" width={widthPixels} height={heightPixels} />
          </div>
        );
      }
    }
    // Handle unexpected cases
    return null;
  }, [src, className, width, height]);

  return renderIcon();
});

// Add autocomplete for Lucide icons
export type LucideIconName = keyof typeof LucideIcons;
