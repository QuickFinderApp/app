import { SpotterActionMenu } from "../others/action-menu";

export type SpotterImagePreviewData = {
  element: "ImagePreview";
  imageSources: string[];
  initialIndex?: number;
  actionMenu?: SpotterActionMenu;
};
