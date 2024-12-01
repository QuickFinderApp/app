"use client";

import { cn } from "@/lib/utils";
import { Icon, IconSource } from "./icon";

type CenterTextProps = {
  title?: string;
  description?: string;
  icon?: IconSource;
  iconClassName?: string;
};

export function CenterText({ title, description, icon, iconClassName }: CenterTextProps) {
  return (
    <div className={"flex-1 py-1 flex flex-col justify-center items-center"}>
      {icon && (
        <div className={cn("flex justify-center mb-4 text-primary", iconClassName)}>
          <Icon width={24} height={24} src={icon} />
        </div>
      )}
      {title && <h2 className="mb-2 text-lg font-semibold text-foreground">{title}</h2>}
      {description && <p className="text-sm text-text-600">{description}</p>}
    </div>
  );
}
