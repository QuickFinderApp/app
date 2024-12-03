"use client";

import { Command } from "cmdk";
import { useMemo, useRef, useState } from "react";
import { CenterText } from "../elements/center-text";
import { cn, getRelativeTimeText } from "@/lib/utils";
import { Icon } from "../elements/icon";
import { SpotterListData, SpotterListItem, SpotterListItemArgument, SpotterListSection } from "../types/layouts/list";
import { SpotterData, SpotterLayout } from "../types/layouts/layouts";
import { getActionMenuState } from "../spotter/action-menu";
import { useAlwaysFocus } from "@/lib/keyboard";
import { Input } from "@/components/ui/input";
import { ActionRunner } from "../spotter/spotter";
import { SpotterAction, SpotterActionArguments } from "../types/others/action-menu";
import { ArrowRight } from "lucide-react";

type SectionWithItems = SpotterListSection & {
  items: SpotterListItem[];
};
type SectionsWithItems = SectionWithItems[];

const getItemWithId = (sectionsWithItems: SectionsWithItems, id: string | undefined) => {
  for (const section of sectionsWithItems) {
    const foundItem = section.items.find((item) => item.id === id);
    if (foundItem) {
      return foundItem;
    }
  }
  return null;
};

function ListItem({
  id,
  title,
  subtitle,
  accessories = [],
  keywords = [],
  icon,
  onSelected
}: SpotterListItem & { onSelected: () => void }) {
  return (
    <Command.Item
      value={id}
      id={id}
      onSelect={onSelected}
      className={cn(
        "h-10 bg-opacity-50 rounded-md flex flex-row items-center p-3 gap-4 text-sm",
        "data-[selected=true]:bg-selection-200",
        "hover:bg-selection-100"
      )}
      keywords={[title, ...((subtitle && [subtitle]) || []), ...keywords]}
    >
      <div className="flex flex-row gap-3">
        {icon && <Icon src={icon} width={6} height={6} className="rounded-sm" />}
        <span className="text-text">{title}</span>
      </div>
      {subtitle && <span className="text-text-600">{subtitle}</span>}
      <div className="ml-auto flex flex-row">
        {accessories.map((accessory, index) => (
          <span key={index} className="flex flex-row text-text-600 gap-1.5">
            {accessory.icon && <Icon src={accessory.icon} width={5} height={5} />}
            {accessory.text && accessory.text}
            {accessory.date && getRelativeTimeText(accessory.date)}
          </span>
        ))}
      </div>
    </Command.Item>
  );
}

function useSearch(initialQuery: string | undefined, onSearchTextChange?: (query: string) => void) {
  const [search, setSearch] = useState<string>(initialQuery ?? "");

  function onQueryChange(query: string) {
    setSearch(query);
    if (onSearchTextChange) {
      onSearchTextChange(query);
    }
  }

  return { search, onQueryChange };
}

function useSectionsWithItems(items: SpotterListItem[], sections: SpotterListSection[]) {
  return useMemo(() => {
    const sectionMap = new Map<string, SectionWithItems>();

    sections.forEach((section) => {
      sectionMap.set(section.id, { ...section, items: [] });
    });

    items.forEach((item) => {
      const sectionId = item.section || "Unknown";
      if (!sectionMap.has(sectionId)) {
        sectionMap.set(sectionId, {
          id: sectionId,
          title: sectionId,
          items: []
        });
      }
      sectionMap.get(sectionId)!.items.push(item);
    });

    const sectionsArray = Array.from(sectionMap.values());

    if (sectionsArray.length === 1 && sectionsArray[0].id === "Unknown") {
      return [{ id: "", title: "", items: items }];
    }

    sectionsArray.sort((a, b) => {
      const indexA = sections.findIndex((s) => s.id === a.id);
      const indexB = sections.findIndex((s) => s.id === b.id);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    return sectionsArray;
  }, [items, sections]);
}

function useSelection(
  selectedItemId: string | undefined,
  sectionsWithItems: SectionsWithItems,
  customOnSelectionChange?: (value: string) => void
) {
  const [selection, setSelection] = useState<string | undefined>(selectedItemId ?? sectionsWithItems[0]?.items[0]?.id);

  function onSelectionChange(value: string) {
    setSelection(value);
    customOnSelectionChange?.(value);
  }

  const selectedItem = getItemWithId(sectionsWithItems, selection);
  if (!selectedItem && sectionsWithItems[0]?.items[0]) {
    setSelection(sectionsWithItems[0].items[0].id);
  }

  return { selection, onSelectionChange, selectedItem };
}

type ArgumentInputsProps = {
  arg: SpotterListItemArgument;
  runArguments: SpotterActionArguments;
};
function ArgumentInput({ arg, runArguments }: ArgumentInputsProps) {
  const { id, required, type } = arg;

  const placeholder = arg.placeholder ?? id;

  const [value, setValue] = useState("");
  const isValidInput = useMemo(() => {
    let isValid = true;

    if (type == "text") {
      if (required && value.trim().length <= 0) {
        isValid = false;
      }

      runArguments[id] = value;
    } else if (type == "number") {
      if (required && !parseFloat(value)) {
        isValid = false;
      }

      runArguments[id] = parseFloat(value);
    }

    if (!isValid) {
      delete runArguments[id];
    }

    return isValid;
  }, [id, value, type, required, runArguments]);

  return (
    <Input
      key={id}
      data-tab-enabled="1"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className={cn(!isValidInput && "border-destructive", "blacklistDrag")}
    />
  );
}

function Header({
  searchQuery,
  onQueryChange,
  searchBarPlaceholder,
  selectedItem,
  runArguments
}: {
  searchQuery: string;
  onQueryChange: (query: string) => void;
  searchBarPlaceholder: string | undefined;
  selectedItem: SpotterListItem | null;
  runArguments: SpotterActionArguments;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useAlwaysFocus(inputRef);

  const args = selectedItem?.arguments ?? [];

  return (
    <div className="flex flex-1 justify-normal items-center">
      <Command.Input
        data-tab-enabled="1"
        ref={inputRef}
        value={searchQuery}
        onValueChange={onQueryChange}
        placeholder={searchBarPlaceholder}
        autoFocus
        className="blacklistDrag flex h-7 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-text-600 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-gray-400"
      />

      {/* Arguments */}
      <div className="flex flex-row gap-2">
        {args.map((arg) => (
          <ArgumentInput key={arg.id} arg={arg} runArguments={runArguments} />
        ))}
      </div>
    </div>
  );
}

function Body({
  sectionsWithItems,
  onSelected
}: {
  sectionsWithItems: SectionsWithItems;
  onSelected: (itemId: string) => void;
}) {
  const noResults = <CenterText icon="CircleHelp" description="No results found." iconClassName="text-text-600" />;

  return (
    <Command.List className="flex flex-col flex-1">
      {
        /* Just for testing :D */ false && (
          <Command.Group
            key={"calculator"}
            heading={"Calculator"}
            className="ml-2 mb-2 text-sm font-medium text-text-600"
          >
            <Command.Item
              value={"calculator"}
              id={"calculator"}
              onSelect={onSelected}
              className={cn(
                "h-28 bg-opacity-50 rounded-md flex items-center p-3 text-sm",
                "data-[selected=true]:bg-selection-200",
                "hover:bg-selection-100"
              )}
              keywords={["calculator"]}
            >
              <div className="flex-1 flex justify-between items-center text-white">
                <div className="flex-1 flex flex-col items-center">
                  <div className="text-2xl">1+1</div>
                  <div className="text-xs text-text-600 mt-1 px-2 py-1 rounded-2xl bg-text-100">Sum</div>
                </div>
                <div className="mx-4">
                  <ArrowRight size={24} />
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="text-2xl">2</div>
                  <div className="text-xs text-text-600 mt-1 px-2 py-1 rounded-2xl bg-text-100">Two</div>
                </div>
              </div>
            </Command.Item>
          </Command.Group>
        )
      }

      {sectionsWithItems.map((section) =>
        section.id ? (
          <Command.Group
            key={section.id}
            heading={section.title}
            className="ml-2 mb-2 text-sm font-medium text-text-600"
          >
            {section.items.map((item) => (
              <ListItem key={item.id} {...item} onSelected={() => onSelected(item.id)} />
            ))}
          </Command.Group>
        ) : (
          section.items.map((item) => <ListItem key={item.id} {...item} onSelected={() => onSelected(item.id)} />)
        )
      )}
      <Command.Empty className="flex-1 flex">{noResults}</Command.Empty>
    </Command.List>
  );
}

export function useSpotterList(spotterData: SpotterData, runAction: ActionRunner): SpotterLayout {
  const {
    initialQuery,
    searchBarPlaceholder,
    isLoading,
    items,
    sections = [],
    searchText,
    onSearchTextChange,
    shouldFilter,
    filter,
    selectedItemId,
    onSelectionChange: customOnSelectionChange
  } = spotterData as SpotterListData;

  const runArguments: SpotterActionArguments = {};

  const { search, onQueryChange } = useSearch(initialQuery, onSearchTextChange);
  const searchQuery = searchText ?? search;

  const sectionsWithItems = useSectionsWithItems(items, sections);
  const { selection, onSelectionChange, selectedItem } = useSelection(
    selectedItemId,
    sectionsWithItems,
    customOnSelectionChange
  );

  const args = selectedItem?.arguments ?? [];
  function canRunAction(action: SpotterAction): boolean {
    if (action.isPrimary) {
      const canRun = args.every((arg) => {
        if (arg.required) {
          return !!runArguments[arg.id];
        }
        return true;
      });

      return canRun;
    }
    return true;
  }

  function onSelected(itemId: string) {
    const listItem = getItemWithId(sectionsWithItems, itemId);
    const { primaryActions } = getActionMenuState(listItem?.actionMenu);

    const enterAction = primaryActions.find((action) => {
      if (action.shortcut == "Enter") {
        return true;
      }
      return false;
    });

    if (itemId !== selection) {
      onSelectionChange(itemId);
      return;
    }

    if (enterAction) {
      runAction(enterAction);
    }
  }

  const header = (
    <Header
      searchQuery={searchQuery}
      onQueryChange={onQueryChange}
      searchBarPlaceholder={searchBarPlaceholder}
      selectedItem={selectedItem}
      runArguments={runArguments}
    />
  );
  const body = <Body sectionsWithItems={sectionsWithItems} onSelected={onSelected} />;
  const actionMenu = selectedItem?.actionMenu;

  const extraCommandProps = {
    ...(shouldFilter !== undefined && { shouldFilter }),
    ...(filter !== undefined && { filter }),
    ...(selection !== undefined && { value: selection }),
    ...(onSelectionChange !== undefined && { onValueChange: onSelectionChange })
  };

  return {
    header,
    body,
    actionMenu,
    extraCommandProps,
    isLoading: isLoading ?? false,
    disabledListeners: ["Enter"],
    actionArguments: runArguments,
    canRunAction
  };
}
