import { SystemInfoLayout } from "../types/layouts/system-info";

interface SystemInfoProps {
  data: SystemInfoLayout;
}

const getOSArt = (os: string) => {
  // macOS ASCII art
  if (os.toLowerCase().includes('macos')) {
    return `
                  'c.
                ,xNMM.
               .OMMMMo
               OMMM0,
              .;loddo:' loolodol;.
             cKMMMMMMMMMMNWMMMMMMMMMO:
           .KMMMMMMMMMMMMMMMMMMMMMMMd
           XMMMMMMMMMMMMMMMMMMMMMMMX.
          ;MMMMMMMMMMMMMMMMMMMMMMMM:
          :MMMMMMMMMMMMMMMMMMMMMMMM:
          .MMMMMMMMMMMMMMMMMMMMMMMMX.
           kMMMMMMMMMMMMMMMMMMMMMMMMd
           'XMMMMMMMMMMMMMMMMMMMMMMMMk
            'XMMMMMMMMMMMMMMMMMMMMMMK.
              kMMMMMMMMMMMMMMMMMMMMd
               ;KMMMMMMMXXMMMMMMMk.
                 'cooc,.  .,coo:'`;
  }
  
  // Linux ASCII art
  if (os.toLowerCase().includes('linux')) {
    return `
               .88888888:.
              88888888.88888.
            .8888888888888888.
            888888888888888888
            88' \`88'88 '88888
            88  88  88  88888
            88  88  88  88888
            88  88  88  88888
            88  88  88  88888
            '88  88  88 88888'
             88  88  88'8888'
              88  88  88888'
               '88  888888'
                 '888888'
                   '888'
                     '`;
  }
  
  // Windows ASCII art
  if (os.toLowerCase().includes('windows')) {
    return `
                              ..,
                  ....,,:;+ccllll
    ...,,+:;  cllllllllllllllllll
,cclllllllllll  lllllllllllllllllll
llllllllllllll  lllllllllllllllllll
llllllllllllll  lllllllllllllllllll
llllllllllllll  lllllllllllllllllll
llllllllllllll  lllllllllllllllllll
llllllllllllll  lllllllllllllllllll
                                    
llllllllllllll  lllllllllllllllllll
llllllllllllll  lllllllllllllllllll
llllllllllllll  lllllllllllllllllll
llllllllllllll  lllllllllllllllllll
llllllllllllll  lllllllllllllllllll
\`'ccllllllllll  lllllllllllllllllll
     \`' \\*::  :ccllllllllllllllll
                     \`\`\`\`''*::cll`;
  }

  // BSD ASCII art
  if (os.toLowerCase().includes('bsd')) {
    return `
                   ,_____,
                .-'   _   '-
               /     |_|     \\
              /               \\
             /|     _____     |\\
              |    |==|==|    |
              |    |--|--|    |
              |    |==|==|    |
              \\    |--|--|    /
               \\   |==|==|   /
                \\  |--|--|  /
                 \\ |==|==| /
                  \\|--|--|/
                   |==|==|
                   |--|--|
                   |==|==|
                   |--|--|
                   |==|==|
                   '------'`;
  }

  // Default ASCII art for unknown OS
  return `
                   .______.
                  /      /|
                 /      / |_
                /      /  //
               /_____/  //
              |==== /  //
              |---- \\ //
              |=====\\//
              |____/\\/
              |===|
              |   |
              |   |
              |   |
              |   |
              |___|
              /   /
             /___|`;
};

export const SystemInfo = ({ data }: SystemInfoProps) => {
  const { info } = data;

  return (
    <div className="p-4 flex gap-8">
      <pre className="text-[#98c379]">{getOSArt(info.os)}</pre>
      <div className="text-left">
        <p><span className="text-[#98c379]">Hostname: </span>{info.hostname}</p>
        <p><span className="text-[#98c379]">OS: </span>{info.os}</p>
        <p><span className="text-[#98c379]">Host: </span>{info.host}</p>
        <p><span className="text-[#98c379]">Kernel: </span>{info.kernel}</p>
        <p><span className="text-[#98c379]">Uptime: </span>{info.uptime}</p>
        <p><span className="text-[#98c379]">Packages: </span>{info.packages}</p>
        <p><span className="text-[#98c379]">Resolution: </span>{info.resolution}</p>
        <p><span className="text-[#98c379]">DE: </span>{info.de}</p>
        <p><span className="text-[#98c379]">WM: </span>{info.wm}</p>
        <p><span className="text-[#98c379]">WM Theme: </span>{info.wmTheme}</p>
        <p><span className="text-[#98c379]">Terminal: </span>{info.terminal}</p>
        <p><span className="text-[#98c379]">Terminal Font: </span>{info.terminalFont}</p>
        <p><span className="text-[#98c379]">CPU: </span>{info.cpu}</p>
        <p><span className="text-[#98c379]">GPU: </span>{info.gpu}</p>
        <p><span className="text-[#98c379]">Memory: </span>{info.memory}</p>
      </div>
    </div>
  );
};