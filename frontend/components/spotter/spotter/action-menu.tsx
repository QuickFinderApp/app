import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "motion/react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  SpotterAction,
  SpotterActionMenu,
  SpotterActionMenuSection,
  SpotterActionSubmenu
} from "../types/others/action-menu";
import { CommonKeyComboNames, CommonKeyCombos, getActionMenuKeyCombo } from "@/lib/key-combos";
import { KeyComboHint, useKeyCombo } from "@/lib/keyboard";
import { Icon } from "../elements/icon";
import { Fragment } from "react";
import { ActionRunner } from "./spotter";

export function getActionMenuState(actionMenu: SpotterActionMenu | undefined) {
  const amountOfItems = actionMenu?.items.length ?? 0;

  const primaryActions: SpotterAction[] = [];
  let hasNonPrimaryActions = false;

  // only look for it in the root
  actionMenu?.items.forEach((item) => {
    if (item.type == "Action") {
      if (item.isPrimary) {
        primaryActions.push(item);
      }
    }
  });

  function searchMenu(menu: SpotterActionMenu | SpotterActionMenuSection | SpotterActionSubmenu) {
    menu?.items.forEach((action) => {
      if (action.type == "Action") {
        if (!action.isPrimary) {
          hasNonPrimaryActions = true;
        }
      } else if (action.type == "Section") {
        searchMenu(action);
      } else if (action.type == "Submenu") {
        searchMenu(action);
      }
    });
  }
  if (actionMenu) {
    searchMenu(actionMenu);
  }

  const showActionMenu = actionMenu?.show !== false && amountOfItems > 0 && hasNonPrimaryActions;
  return { primaryActions, showActionMenu };
}

type ActionKeybindProps = {
  action: SpotterAction;
  runAction: ActionRunner;
};
function ActionKeybind({ action, runAction }: ActionKeybindProps) {
  const combo = (action.shortcut && CommonKeyCombos[action.shortcut]()) || [];
  useKeyCombo(combo, () => runAction(action));

  if (action.shortcut) {
    return <span>{action.shortcut}</span>;
  }

  return <></>;
}

type ActionMenuActionProps = {
  action: SpotterAction;
  runAction: ActionRunner;
};
function ActionMenuAction({ action, runAction }: ActionMenuActionProps) {
  function onSelected() {
    runAction(action);
  }

  return (
    <Command.Item
      onSelect={onSelected}
      className={cn(
        "h-10 bg-opacity-50 rounded-md gap-4 text-sm",
        "data-[selected=true]:bg-selection-100",
        "hover:bg-selection-200",
        "rounded-sm p-2 cursor-pointer",
        "flex flex-row items-center justify-between"
      )}
      value={action.id}
      keywords={[action.title]}
    >
      <div className={cn("text-foreground flex flex-row", action.style == "Destructive" && "text-red")}>
        {action.icon && (
          <>
            <Icon src={action.icon} width={5} height={5} className="rounded-sm" />
            <div className="mr-2" />
          </>
        )}
        {action.title}
      </div>
      {action.shortcut && <KeyComboHint combo={CommonKeyCombos[action.shortcut]()} />}
    </Command.Item>
  );
}
type ActionMenuSectionProps = {
  section: SpotterActionMenu | SpotterActionMenuSection;
  runAction: ActionRunner;
};
function ActionMenuSection({ section, runAction }: ActionMenuSectionProps) {
  return (
    <Command.Group className="text-text-600 font-bold mx-2" heading={section.title ?? ""}>
      {section.items
        .map((item) => {
          if (item.type == "Action") {
            return <ActionMenuAction key={item.id} action={item} runAction={runAction} />;
          }
          return null;
        })
        .filter((item) => item != null)}
    </Command.Group>
  );
}

function SectionSeperator() {
  return (
    <Command.Separator className="my-3" asChild>
      <Separator />
    </Command.Separator>
  );
}

function useActionMenuKeybind(toggleActionMenu: () => void) {
  function onPress() {
    toggleActionMenu();
  }

  const combo = getActionMenuKeyCombo();
  useKeyCombo(combo, onPress);
}

export function useActionMenu(
  actionMenu: SpotterActionMenu | undefined,
  disabledListeners: CommonKeyComboNames[],
  isOpen: boolean,
  setIsOpen: (showing: boolean) => void,
  toggleActionMenu: () => void,
  runAction: ActionRunner
) {
  const keybindListeners: JSX.Element[] = [];

  const actionMenuSections: (SpotterActionMenu | SpotterActionMenuSection)[] = [];

  function searchMenu(menu: SpotterActionMenu | SpotterActionMenuSection | SpotterActionSubmenu) {
    menu?.items.forEach((action) => {
      if (action.type == "Action") {
        if (action.shortcut && disabledListeners.includes(action.shortcut)) {
          return;
        }
        keybindListeners.push(<ActionKeybind key={action.id} action={action} runAction={runAction} />);
      } else if (action.type == "Section") {
        actionMenuSections.push(action);
        searchMenu(action);
      } else if (action.type == "Submenu") {
        searchMenu(action);
      }
    });
  }

  if (actionMenu) {
    actionMenuSections.push(actionMenu);
    searchMenu(actionMenu);
  }

  useActionMenuKeybind(toggleActionMenu);

  const ActionMenu = (
    <div className="fixed z-50 bottom-14 right-1">
      <AnimatePresence>
        {isOpen && (
          <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Content asChild forceMount>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col-reverse origin-bottom-right"
              >
                <VisuallyHidden.Root>
                  <Dialog.Title />
                  <Dialog.Description />
                </VisuallyHidden.Root>
                <Command
                  className={cn(
                    "w-80 overflow-hidden shadow-2xl transition-all",
                    "border border-border rounded-xl custom-scrollbar",
                    "bg-gradient-to-b from-background-full to-backgroundSecondary-full"
                  )}
                  disablePointerSelection
                  loop
                  vimBindings={false}
                >
                  <Command.List className="max-h-48 overflow-y-auto my-3">
                    {actionMenuSections.map((section, index) => (
                      <Fragment key={`section-${index}`}>
                        {index !== 0 && <SectionSeperator key={`separator-${index}`} />}
                        <ActionMenuSection
                          key={(section as SpotterActionMenuSection).id || section.title || `section-${index}`}
                          section={section}
                          runAction={runAction}
                        />
                      </Fragment>
                    ))}
                  </Command.List>
                  <Separator />
                  <Command.Input
                    placeholder="Search for action..."
                    className="bg-transparent mx-4 my-1.5 outline-none border-none focus:ring-0 focus:outline-none placeholder:text-text-400"
                  />
                </Command>
              </motion.div>
            </Dialog.Content>
          </Dialog.Root>
        )}
      </AnimatePresence>
    </div>
  );

  const ActionKeybinds = <>{keybindListeners}</>;

  return {
    ActionMenu,
    ActionKeybinds
  };
}
