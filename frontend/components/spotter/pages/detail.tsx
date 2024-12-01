import { Spotter } from "../spotter/spotter";
import { SpotterActionMenu } from "../types/others/action-menu";

type SpotterDetailProps = {
  markdown: string;
  actionMenu?: SpotterActionMenu;
};
export default function SpotterDetail({ ...props }: SpotterDetailProps) {
  return (
    <Spotter
      data={{
        element: "Detail",
        ...props
      }}
    />
  );
}
