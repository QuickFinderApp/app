import { KeybindHint } from "@/components/spotter/elements/keybind";
import dynamic from "next/dynamic";
import { useState, useEffect, RefObject } from "react";

export enum KeyName {
  // Modifier keys
  Ctrl = "Control",
  Command = "Meta",
  Alt = "Alt",
  Shift = "Shift",

  // Regular keys
  A = "a",
  B = "b",
  C = "c",
  D = "d",
  E = "e",
  F = "f",
  G = "g",
  H = "h",
  I = "i",
  J = "j",
  K = "k",
  L = "l",
  M = "m",
  N = "n",
  O = "o",
  P = "p",
  Q = "q",
  R = "r",
  S = "s",
  T = "t",
  U = "u",
  V = "v",
  W = "w",
  X = "x",
  Y = "y",
  Z = "z",

  // Special keys
  Enter = "Enter",
  Escape = "Escape",
  Space = " ",
  Tab = "Tab",
  Backspace = "Backspace",
  Delete = "Delete",
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
  Home = "Home",
  End = "End",
  PageUp = "PageUp",
  PageDown = "PageDown",

  // Function keys
  F1 = "F1",
  F2 = "F2",
  F3 = "F3",
  F4 = "F4",
  F5 = "F5",
  F6 = "F6",
  F7 = "F7",
  F8 = "F8",
  F9 = "F9",
  F10 = "F10",
  F11 = "F11",
  F12 = "F12",

  // Numeric keypad keys
  Numpad0 = "Numpad0",
  Numpad1 = "Numpad1",
  Numpad2 = "Numpad2",
  Numpad3 = "Numpad3",
  Numpad4 = "Numpad4",
  Numpad5 = "Numpad5",
  Numpad6 = "Numpad6",
  Numpad7 = "Numpad7",
  Numpad8 = "Numpad8",
  Numpad9 = "Numpad9",
  NumpadAdd = "NumpadAdd",
  NumpadSubtract = "NumpadSubtract",
  NumpadMultiply = "NumpadMultiply",
  NumpadDivide = "NumpadDivide",
  NumpadDecimal = "NumpadDecimal",
  NumpadEnter = "NumpadEnter",

  // Other common keys
  CapsLock = "CapsLock",
  Insert = "Insert",
  Pause = "Pause",
  PrintScreen = "PrintScreen",
  ScrollLock = "ScrollLock",
  NumLock = "NumLock",
  Windows = "Windows" // Often used for Windows key
}

export type KeyCombo = KeyName[];

type OS = "Mac" | "Windows" | "Linux" | "Android" | "iOS" | "Unknown";

// Functions
export function getOS(): OS {
  if (typeof window == "undefined") {
    return "Unknown";
  }
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;

  // Check for macOS
  if (platform.startsWith("Mac")) {
    return "Mac";
  }
  // Check for Windows
  if (platform.startsWith("Win")) {
    return "Windows";
  }
  // Optionally check for other OS
  if (/Linux/.test(platform)) {
    return "Linux";
  }
  if (/Android/.test(userAgent)) {
    return "Android";
  }
  if (/iPhone|iPad|iPod/.test(userAgent)) {
    return "iOS";
  }
  return "Unknown";
}

export function isActiveElementTextbox(): boolean {
  const activeElement = document.activeElement;

  if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
    if (activeElement instanceof HTMLInputElement) {
      const textInputTypes = ["text", "password", "email", "number", "search", "tel", "url"];
      return textInputTypes.includes(activeElement.type.toLowerCase());
    }

    // If it's a textarea, return true
    return true;
  }

  // If it's not an input or textarea, return false
  return false;
}

// Hooks
export function useKeyCombo(targetCombo: KeyCombo, onPress?: () => void, onRelease?: () => void) {
  const [isComboPressed, setIsComboPressed] = useState(false);

  useEffect(() => {
    setIsComboPressed(false);

    const keyMap = new Set<string>();

    const checkCombo = () => {
      const isMatch =
        targetCombo.every((key) => keyMap.has(key)) && keyMap.size === targetCombo.length && targetCombo.length > 0;

      setIsComboPressed(isMatch);

      if (isMatch && !isComboPressed && onPress) {
        onPress();
      } else if (!isMatch && isComboPressed && onRelease) {
        onRelease();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key) {
        keyMap.add(event.key);
      }
      if (event.metaKey) {
        keyMap.add("Meta");
      }

      checkCombo();
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keyMap.delete(event.key);
      checkCombo();
    };

    let removed = false;
    let added = false;

    const listenOptions: AddEventListenerOptions = {
      capture: true
    };

    setTimeout(() => {
      if (!removed) {
        added = true;
        document.addEventListener("keydown", handleKeyDown, listenOptions);
        document.addEventListener("keyup", handleKeyUp, listenOptions);
      }
    }, 200);

    return () => {
      removed = true;
      if (added) {
        document.removeEventListener("keydown", handleKeyDown, listenOptions);
        document.removeEventListener("keyup", handleKeyUp, listenOptions);
      }
    };
  }, [onPress, onRelease, targetCombo, isComboPressed]);

  return isComboPressed;
}

export function useAlwaysFocus(inputRef: RefObject<HTMLInputElement>) {
  useEffect(() => {
    let ended = false;

    function preventMouseDownDefault() {
      setTimeout(() => {
        const inputElement = inputRef.current;

        if (inputElement && !isActiveElementTextbox() && !ended) {
          inputElement.focus();
        }
      }, 200);
    }
    window.addEventListener("mousedown", preventMouseDownDefault);
    window.addEventListener("keydown", preventMouseDownDefault);

    return () => {
      ended = true;
      window.removeEventListener("mousedown", preventMouseDownDefault);
      window.removeEventListener("keydown", preventMouseDownDefault);
    };
  }, [inputRef]);
}

// Components
type KeyComboHintProps = {
  combo: KeyCombo;
  hasBackground?: boolean;
};
function InternalKeyComboHint({ combo, hasBackground }: KeyComboHintProps) {
  return (
    <>
      {combo.map((key, index) => (
        <KeybindHint key={index} hint={key} hasBackground={hasBackground} />
      ))}
    </>
  );
}
export const KeyComboHint = dynamic(async () => InternalKeyComboHint, {
  ssr: false
});
