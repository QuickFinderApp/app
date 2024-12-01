import { SpotterActionMenu } from "../others/action-menu";

export type SpotterDetailData = {
  element: "Detail";
  markdown: string;
  markdownClassName?: string;
  actionMenu?: SpotterActionMenu;
};
