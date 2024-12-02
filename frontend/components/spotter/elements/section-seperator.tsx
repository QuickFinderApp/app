import { cn } from "@/lib/utils";

type SectionSeperatorProps = {
  isLoading?: boolean;
};
export function HorizontalSectionSeperator({ isLoading }: SectionSeperatorProps) {
  const hasAnimation = true;
  return (
    <div className="relative">
      <div className={cn(isLoading && "animate-[pulse_1s_infinite]", "w-full h-[2px] bg-border-soft")} />

      {isLoading && (
        <div
          className="absolute top-full w-[200px] h-[2px]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0), var(--loader), rgba(255, 255, 255, 0))`,
            animation: hasAnimation ? "loadingRunner 2s ease-in-out infinite" : undefined
          }}
        />
      )}
    </div>
  );
}
