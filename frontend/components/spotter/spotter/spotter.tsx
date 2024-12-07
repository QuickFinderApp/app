"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { CommonKeyCombos, getActionMenuKeyCombo } from "@/lib/key-combos";
import { getOS, KeyComboHint, KeyName, OS, useKeyCombo } from "@/lib/keyboard";
import { useRouter } from "@/lib/stack-router";
import { cn } from "@/lib/utils";
import { Command } from "cmdk";
import { LockIcon, LockOpenIcon, Search } from "lucide-react";
import { Fragment, memo, useCallback, useEffect, useRef, useState } from "react";
import { Separator } from "../../ui/separator";
import { BackButton } from "../elements/back-button";
import { HorizontalSectionSeperator } from "../elements/section-seperator";
import { useSpotterDetail } from "../layouts/detail";
import { useSpotterError } from "../layouts/error";
import { useSpotterImagePreview } from "../layouts/image-preview";
import { useSpotterList } from "../layouts/list";
import { useSpotterUnknown } from "../layouts/unknown";
import { SpotterData, SpotterLayout } from "../types/layouts/layouts";
import { SpotterAction } from "../types/others/action-menu";
import { getActionMenuState, useActionMenu } from "./action-menu";
import { BatteryIndicator } from "../elements/battery-indicator";
import { ConfirmationData, ConfirmationFinishAction } from "../types/others/confirmation";
import { Icon } from "../elements/icon";
import { setAlertCallback } from "@/lib/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "motion/react";
import { useSpotterSettings } from "../layouts/settings";

const SCROLL_INCREMENTS = 200;

export type ActionRunner = (action: SpotterAction) => void;

function useSpotterDataHook(spotterData: SpotterData, runAction: ActionRunner): SpotterLayout {
  let dataHook: (spotterData: SpotterData, runAction: ActionRunner) => SpotterLayout = useSpotterUnknown;
  if (spotterData.element === "List") {
    dataHook = useSpotterList;
  } else if (spotterData.element == "Detail") {
    dataHook = useSpotterDetail;
  } else if (spotterData.element == "ImagePreview") {
    dataHook = useSpotterImagePreview;
  } else if (spotterData.element == "Error") {
    dataHook = useSpotterError;
  } else if (spotterData.element == "Settings") {
    dataHook = useSpotterSettings;
  }
  return dataHook(spotterData, runAction);
}

function SpotterHeader({
  canGoBack,
  header,
  hasOuterBody
}: {
  canGoBack: boolean;
  header: React.ReactNode;
  hasOuterBody: boolean;
}) {
  return (
    <div className="flex h-11 items-center px-3 gap-2 justify-between enableDrag">
      {canGoBack && <BackButton />}
      <div className="flex-1">{header}</div>
      {!hasOuterBody && <BatteryIndicator />}
    </div>
  );
}

function SpotterBody({
  body,
  useArrowKeys,
  ActionMenu
}: {
  body: React.ReactNode;
  useArrowKeys: boolean;
  ActionMenu: React.ReactNode;
}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const downArrowTriggered = useKeyCombo([KeyName.ArrowDown]);
  useEffect(() => {
    if (downArrowTriggered && useArrowKeys && containerRef.current) {
      setScrollPosition((prev) =>
        Math.min(prev + SCROLL_INCREMENTS, containerRef.current!.scrollHeight - containerRef.current!.clientHeight)
      );
    }
  }, [downArrowTriggered, useArrowKeys]);

  const upArrowTriggered = useKeyCombo([KeyName.ArrowUp]);
  useEffect(() => {
    if (upArrowTriggered && useArrowKeys) {
      setScrollPosition((prev) => Math.max(prev - SCROLL_INCREMENTS, 0));
    }
  }, [upArrowTriggered, useArrowKeys]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex-1 custom-scrollbar overflow-y-auto p-2 flex flex-col",
        "md:min-h-96 md:max-h-96 max-h-screen"
      )}
    >
      {ActionMenu}
      {body}
    </div>
  );
}

function SpotterFooter({
  primaryActions,
  showActionMenu,
  toggleActionMenu,
  isActionMenuOpen,
  runAction,
  isSpotterFocusLocked,
  setIsSpotterFocusLocked
}: {
  primaryActions: SpotterAction[];
  showActionMenu: boolean;
  toggleActionMenu: () => void;
  isActionMenuOpen: boolean;
  runAction: ActionRunner;
  isSpotterFocusLocked: boolean | null;
  setIsSpotterFocusLocked: (locked: boolean) => void;
}) {
  const actionMenuCombo = getActionMenuKeyCombo();

  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-1.5 h-12",
        "backdrop-blur-3xl bg-white/20 dark:bg-white/5"
      )}
    >
      <div className="flex flex-row items-center gap-1">
        <Button variant="ghost" className="px-2 gap-0" size="sm">
          <Search className="w-5 h-5 mr-1" />
          <div className="text-sm font-medium max-sm:hidden">QuickFinder</div>
        </Button>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn("rounded-full w-10 h-10", isSpotterFocusLocked && "bg-red hover:bg-red-300")}
                onClick={() => setIsSpotterFocusLocked(!isSpotterFocusLocked)}
              >
                {isSpotterFocusLocked && <LockIcon className="w-5 h-5" />}
                {!isSpotterFocusLocked && <LockOpenIcon className="w-5 h-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent className={cn("flex flex-row justify-center items-center gap-1")}>
              Toggle Keep on Top
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center space-x-1">
        {primaryActions &&
          primaryActions.map((action, index) => (
            <Fragment key={index}>
              <Button
                variant="ghost"
                size="sm"
                className="px-2 flex flex-row items-center font-bold text-sm"
                onClick={() => runAction(action)}
              >
                {action.title}
                {action.shortcut && <KeyComboHint combo={CommonKeyCombos[action.shortcut]()} />}
              </Button>
              {index < primaryActions.length - 1 && <Separator orientation="vertical" className="h-4" />}
            </Fragment>
          ))}
        {showActionMenu && primaryActions && primaryActions.length > 0 && (
          <Separator orientation="vertical" className="h-4" />
        )}
        {showActionMenu && (
          <Button
            variant="ghost"
            size="sm"
            className={cn("px-2 text-sm", isActionMenuOpen && "bg-selection-200")}
            onClick={toggleActionMenu}
          >
            Actions
            {actionMenuCombo && <KeyComboHint combo={actionMenuCombo} />}
          </Button>
        )}
      </div>
    </div>
  );
}

function SpotterConfirmation({
  title,
  icon,
  message,
  primaryAction = { title: "Confirm", style: "Default" },
  secondaryAction = { title: "Cancel", style: "Cancel" },
  onFinish,
  setConfirmation
}: ConfirmationData & { setConfirmation: (newState: ConfirmationData | null) => void }) {
  function selectedOption(option: ConfirmationFinishAction) {
    onFinish(option);
    setTimeout(() => setConfirmation(null), 50);
  }

  const enterCombo = CommonKeyCombos.Enter();
  const escapeCombo = CommonKeyCombos.Escape();
  useKeyCombo(enterCombo, () => selectedOption("Primary"));
  useKeyCombo(escapeCombo, () => selectedOption("Secondary"));

  return (
    <motion.div
      className="z-50 absolute flex flex-col justify-center items-center h-full w-full max-h-screen bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      <motion.div
        className={cn("w-96 rounded-xl", "dark:bg-gray-900", "border border-border")}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        <div className="w-full h-full bg-text-100 p-6">
          <div className="flex flex-col items-center space-y-2">
            {icon && (
              <div className="h-10 w-10 flex items-center justify-center">
                <Icon width={10} height={10} src={icon} />
              </div>
            )}
            <div>
              <h2 className="text-lg font-medium text-text text-center">{title}</h2>
              <h2 className="text-sm font-medium text-text-600 text-center">{message}</h2>
            </div>
          </div>
          <div className="flex space-x-2 mt-6">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    className={cn(
                      "flex-1",
                      secondaryAction.style == "Default" && "text-text",
                      secondaryAction.style == "Cancel" && "text-text-600",
                      secondaryAction.style == "Destructive" && "text-red"
                    )}
                    onClick={() => selectedOption("Secondary")}
                  >
                    {secondaryAction.title}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className={cn("flex flex-row justify-center items-center gap-1", !escapeCombo && "opacity-0")}
                >
                  <KeyComboHint combo={escapeCombo} hasBackground={false} />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    className={cn(
                      "flex-1",
                      primaryAction.style == "Default" && "text-text",
                      primaryAction.style == "Cancel" && "text-text-600",
                      primaryAction.style == "Destructive" && "text-red"
                    )}
                    onClick={() => selectedOption("Primary")}
                  >
                    {primaryAction.title}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className={cn("flex flex-row justify-center items-center gap-1", !enterCombo && "opacity-0")}
                >
                  <KeyComboHint combo={enterCombo} hasBackground={false} />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const MemoizedSpotterHeader = memo(SpotterHeader);
const MemoizedSpotterBody = memo(SpotterBody);
const MemoizedSpotterFooter = memo(SpotterFooter);
const MemoizedSpotterConfirmation = memo(SpotterConfirmation);

export function Spotter({ data: spotterData }: { data: SpotterData }) {
  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(null);

  useEffect(() => {
    setAlertCallback(setConfirmation);
  }, []);

  let canRunAction: (action: SpotterAction) => boolean = () => false;
  let runActionArguments = {};
  function runAction(action: SpotterAction) {
    if (!canRunAction(action)) return;
    if (confirmation) return;

    action.onAction({
      arguments: runActionArguments
    });
  }

  const {
    header,
    body,
    outerBody,
    actionMenu,
    extraCommandProps = {},
    isLoading = false,
    disabledListeners = [],
    useArrowKeys = false,
    actionArguments = {},
    canRunAction: canRunActionChecker = () => true,
    hasFooter = true
  } = useSpotterDataHook(spotterData, runAction);

  runActionArguments = actionArguments;

  canRunAction = canRunActionChecker;

  const { primaryActions, showActionMenu } = getActionMenuState(actionMenu);

  const router = useRouter();
  const canGoBack = router.canPop;

  const [isActionMenuOpen, setActionMenuOpen] = useState(false);

  function validateAndSetActionMenuOpen(newState: boolean) {
    if (newState == true && !showActionMenu) {
      return;
    }
    if (confirmation) return;

    return setActionMenuOpen(newState);
  }
  function toggleActionMenu() {
    validateAndSetActionMenuOpen(!isActionMenuOpen);
  }

  if (isActionMenuOpen && !showActionMenu) {
    setActionMenuOpen(false);
  }

  const { ActionMenu, ActionKeybinds } = useActionMenu(
    actionMenu,
    disabledListeners,
    isActionMenuOpen,
    setActionMenuOpen,
    toggleActionMenu,
    runAction
  );

  const [isSpotterFocusLocked, setIsSpotterFocusLocked] = useState<boolean | null>(null);
  useEffect(() => {
    let ended = false;

    try {
      if (isSpotterFocusLocked == null) {
        spotter.getHideOnFocusLost().then((value: boolean) => {
          if (ended) return;
          setIsSpotterFocusLocked(!value);
        });
      } else {
        spotter.setHideOnFocusLost(!isSpotterFocusLocked);
      }
    } catch {}

    return () => {
      ended = true;
    };
  }, [isSpotterFocusLocked]);

  const [os, setOS] = useState<OS>("Unknown");
  useEffect(() => {
    setOS(getOS());
  }, []);

  return (
    <Dialog>
      <Command
        disablePointerSelection
        className={cn(
          "left-1/2 top-1/2",
          "fixed z-40 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl shadow-2xl transition-all",
          "max-md:h-full max-md:rounded-none max-h-screen",
          "md:border border-border",
          "flex flex-col",
          "backdrop-blur-[80px]",
          os !== "Windows" && "bg-gradient-to-b from-background to-backgroundSecondary",
          os == "Windows" && "bg-gradient-to-b from-background-full to-backgroundSecondary-full"
        )}
        loop
        vimBindings={false}
        {...extraCommandProps}
      >
        {confirmation && <MemoizedSpotterConfirmation {...confirmation} setConfirmation={setConfirmation} />}
        <div className="flex flex-col h-full max-h-screen">
          <MemoizedSpotterHeader canGoBack={canGoBack} header={header} hasOuterBody={!!outerBody} />
          {!outerBody && <HorizontalSectionSeperator isLoading={isLoading} />}
          <div className="flex-1 min-h-0">
            <MemoizedSpotterBody body={body} useArrowKeys={useArrowKeys} ActionMenu={ActionMenu} />
          </div>
          <div className="-z-10 absolute min-w-full min-h-full flex flex-col pb-12">{outerBody}</div>
          <HorizontalSectionSeperator isLoading={isLoading} />
          {hasFooter && (
            <MemoizedSpotterFooter
              primaryActions={primaryActions}
              showActionMenu={showActionMenu}
              toggleActionMenu={toggleActionMenu}
              isActionMenuOpen={isActionMenuOpen}
              runAction={runAction}
              isSpotterFocusLocked={isSpotterFocusLocked}
              setIsSpotterFocusLocked={setIsSpotterFocusLocked}
            />
          )}

          {/* Debug Purposes */}
          <div className="hidden">
            <div className="flex flex-row gap-1">
              Action Keybinds:
              {ActionKeybinds}
            </div>
          </div>
        </div>
      </Command>
    </Dialog>
  );
}
