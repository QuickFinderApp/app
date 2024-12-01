import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { KeyComboHint, useKeyCombo } from "@/lib/keyboard";
import { useRouter } from "@/lib/stack-router";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { getPopKeyCombo, getPopToRootKeyCombo } from "@/lib/key-combos";

export function BackButton() {
  const router = useRouter();
  const onClick = () => {
    router.pop();
  };

  const popCombo = getPopKeyCombo();
  const popToRootCombo = getPopToRootKeyCombo();

  const hasCombos = popCombo.length > 0 || popToRootCombo.length > 0;

  const popTriggered = useKeyCombo(popCombo);
  useEffect(() => {
    if (popTriggered) {
      router.pop();
    }
  }, [popTriggered, router]);

  const popToRootTriggered = useKeyCombo(popToRootCombo);
  useEffect(() => {
    if (popToRootTriggered) {
      router.popToRoot();
    }
  }, [popToRootTriggered, router]);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="h-8 w-8 blacklistDrag" variant="outline" size="icon" onClick={onClick}>
            <ArrowLeft />
          </Button>
        </TooltipTrigger>
        <TooltipContent className={cn("flex flex-row justify-center items-center gap-1", !hasCombos && "opacity-0")}>
          <KeyComboHint combo={popCombo} />
          <p>to go back,</p>
          <p>or</p>
          <KeyComboHint combo={popToRootCombo} />
          <p>to go to root.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
