import { CommonKeyComboNames } from "@/lib/key-combos";
import { IconSource } from "../../elements/icon";

export type SpotterActionArguments = Record<string, any>;

export type ActionContext = {
  arguments: SpotterActionArguments;
};

export type SpotterAction = {
  type: "Action";
  id: string;
  title: string;
  icon?: IconSource;
  isPrimary?: boolean;
  shortcut?: CommonKeyComboNames;
  style?: "Regular" | "Destructive";
  onAction: (context: ActionContext) => Promise<void> | void;
};

export type SpotterActionMenuSection = {
  type: "Section";
  id: string;
  title?: string;
  items: SpotterAction[];
};

export type SpotterActionSubmenu = {
  type: "Submenu";
  id: string;
  title?: string;
  items: SpotterAction[];
};

export type SpotterItem = SpotterAction | SpotterActionMenuSection | SpotterActionSubmenu;

export type SpotterActionMenu = {
  title?: string;
  items: SpotterItem[];
  show?: boolean;
};
