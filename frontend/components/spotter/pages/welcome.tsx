import { Spotter } from "../spotter/spotter";

export default function SpotterWelcome() {
  return (
    <Spotter
      data={{
        element: "Detail",
        markdown: `# [🦃 THANKSGIVING] Toilet Tower Defense
![CommonMark Logo](https://tr.rbxcdn.com/180DAY-e7a82a7e898f9e7d99e6b686e4454481/768/432/Image/Png/noFilter?raycast-height=450)

![](https://files.raycast.com/d80rkmcxvzlhtmozciarvru5szxq)

![CommonMark Logo](https://raw.githubusercontent.com/aidenybai/react-scan/refs/heads/main/.github/assets/demo.gif?token=GHSAT0AAAAAAB4IOFACRC6P6E45TB2FPYFCZZV2AYA?raycast-height=450)`
      }}
    />
  );
}
