import { CommonKeyComboNames } from "@/lib/key-combos";
import { SpotterAction, SpotterActionArguments, SpotterActionMenu } from "../others/action-menu";
import { SpotterDetailData } from "./detail";
import { SpotterErrorData } from "./error";
import { SpotterImagePreviewData } from "./image-preview";
import { SpotterListData } from "./list";
import { SpotterUnknownData } from "./unknown";
import { SystemInfoLayout } from "./system-info";

export type SpotterData =
  | SpotterUnknownData
  | SpotterDetailData
  | SpotterListData
  | SpotterImagePreviewData
  | SpotterErrorData
  | SystemInfoLayout;

export type SpotterLayout = {
  header?: JSX.Element;
  body?: JSX.Element;
  outerBody?: JSX.Element;
  actionMenu?: SpotterActionMenu;
  extraCommandProps?: Record<string, any>; // Additional props for the layout component
  isLoading?: boolean;
  disabledListeners?: CommonKeyComboNames[];
  useArrowKeys?: boolean;
  actionArguments?: SpotterActionArguments;
  canRunAction?: (action: SpotterAction) => boolean;
};
