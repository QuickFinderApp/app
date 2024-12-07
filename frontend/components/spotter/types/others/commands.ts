import { IconSource } from "../../elements/icon";
import { SpotterListItem } from "../layouts/list";
import { ActionContext } from "./action-menu";

export type SpotterCommandType = "Application" | "Command" | "Link";
export type SpotterCommand = {
  type: SpotterCommandType;

  extensionId?: string;
  extensionName?: string;
  extensionIcon?: IconSource;

  filePath?: string;
  webLink?: string;

  canExecute?: boolean;

  execute?: (context: ActionContext) => Promise<void> | void;
  render?: (context: ActionContext) => JSX.Element;
} & SpotterListItem;
