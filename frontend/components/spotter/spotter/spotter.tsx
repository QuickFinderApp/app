"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { CommonKeyCombos, getActionMenuKeyCombo } from "@/lib/key-combos";
import { KeyComboHint, KeyName, useKeyCombo } from "@/lib/keyboard";
import { useRouter } from "@/lib/stack-router";
import { cn } from "@/lib/utils";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
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
  runAction
}: {
  primaryActions: SpotterAction[];
  showActionMenu: boolean;
  toggleActionMenu: () => void;
  isActionMenuOpen: boolean;
  runAction: ActionRunner;
}) {
  const actionMenuCombo = getActionMenuKeyCombo();

  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-1.5 h-12",
        "backdrop-blur-3xl bg-white/20 dark:bg-white/5"
      )}
    >
      <div className="flex flex-row items-center">
        <Button variant="ghost" className="px-2 gap-0" size="sm">
          <Search className="w-5 h-5 mr-1" />
          <div className="text-sm font-medium max-sm:hidden">QuickFinder</div>
        </Button>
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

export function Spotter({ data: spotterData }: { data: SpotterData }) {
  let canRunAction: (action: SpotterAction) => boolean = () => false;
  let runActionArguments = {};
  function runAction(action: SpotterAction) {
    if (!canRunAction(action)) return;

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
    canRunAction: canRunActionChecker = () => true
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
          "backdrop-blur-[70px]",
          "bg-gradient-to-b from-background to-backgroundSecondary"
        )}
        loop
        vimBindings={false}
        {...extraCommandProps}
      >
        <div className="flex flex-col h-full max-h-screen">
          <SpotterHeader canGoBack={canGoBack} header={header} hasOuterBody={!!outerBody} />
          {!outerBody && <HorizontalSectionSeperator isLoading={isLoading} />}
          <div className="flex-1 min-h-0">
            <SpotterBody body={body} useArrowKeys={useArrowKeys} ActionMenu={ActionMenu} />
          </div>
          <div className="-z-10 absolute min-w-full min-h-full flex flex-col pb-12">{outerBody}</div>
          <HorizontalSectionSeperator isLoading={isLoading} />
          <SpotterFooter
            primaryActions={primaryActions}
            showActionMenu={showActionMenu}
            toggleActionMenu={toggleActionMenu}
            isActionMenuOpen={isActionMenuOpen}
            runAction={runAction}
          />

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
