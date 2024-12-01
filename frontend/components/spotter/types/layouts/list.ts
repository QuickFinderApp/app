import { IconSource } from "../../elements/icon";
import { SpotterActionMenu } from "../others/action-menu";

// Arguments //
type TextArgument = {
  type: "text";
};

type NumberArgument = {
  type: "number";
};

type ArgumentTypes = TextArgument | NumberArgument;

export type SpotterListItemArgument = {
  id: string;
  placeholder: string;
  required?: boolean;
} & ArgumentTypes;

// Others //
export type SpotterListItemAccessory = {
  text?: string | null;
  date?: Date | null;
  icon?: IconSource | null;
  tooltip?: string | null; // TODO: not implemented yet
};

export type SpotterListItem = {
  title: string;
  accessories?: SpotterListItemAccessory[];
  detail?: any; // TODO: not implemented yet
  icon?: IconSource;
  id: string;
  keywords?: string[];
  quickLook?: any; // TODO: not implemented yet
  subtitle?: string;
  section?: string;
  actionMenu?: SpotterActionMenu;
  arguments?: SpotterListItemArgument[];
};

export type SpotterListSection = {
  id: string;
  title: string;
};

export type SpotterListData = {
  element: "List";
  initialQuery?: string; // Default to ""
  searchBarPlaceholder?: string;
  isLoading?: boolean; // Default to false
  items: SpotterListItem[];
  sections?: SpotterListSection[];

  // Search Text
  searchText?: string;
  onSearchTextChange?: (text: string) => void;

  // Filtering
  shouldFilter?: boolean;
  filter?: (value: string, search: string, keywords?: string[]) => number;

  // Selection
  selectedItemId?: string;
  onSelectionChange?: (itemId: string) => void;
};
