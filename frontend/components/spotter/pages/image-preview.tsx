"use client";

import { Spotter } from "../spotter/spotter";
import { SpotterActionMenu } from "../types/others/action-menu";

type SpotterImagePreviewProps = {
  sources: string[];
  initialIndex: number;
  actionMenu?: SpotterActionMenu;
};
export default function SpotterImagePreview({ sources, initialIndex, actionMenu }: SpotterImagePreviewProps) {
  return (
    <Spotter
      data={{
        element: "ImagePreview",
        imageSources: sources,
        initialIndex,
        actionMenu: actionMenu
      }}
    />
  );
}
