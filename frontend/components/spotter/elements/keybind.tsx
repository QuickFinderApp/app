"use client";

import { cn } from "@/lib/utils";
import { CornerDownLeft } from "lucide-react";

type KeybindHintProps = {
  hint: string;
};

const keyHints = [
  {
    keys: ["Enter"],
    element: <CornerDownLeft className="w-4 h-4 text-secondary-foreground/70" />
  },
  {
    keys: ["Command", "Meta"],
    element: (
      <svg
        viewBox="-3 -3 30 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-secondary-foreground/70"
      >
        <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
      </svg>
    )
  },
  {
    keys: ["Escape"],
    text: "Esc"
  },
  {
    keys: ["Control"],
    text: "Ctrl"
  },
  {
    keys: ["ArrowLeft"],
    text: "←"
  },
  {
    keys: ["ArrowRight"],
    text: "→"
  }
];

export function KeybindHint({ hint }: KeybindHintProps) {
  const keyHint = keyHints.find((k) => k.keys.some((key) => key.toLowerCase() === hint.toLowerCase()));

  let elementHint: JSX.Element | null = null;
  let textHint: string = hint;

  if (keyHint?.element) {
    elementHint = keyHint.element;
  } else if (keyHint?.text) {
    textHint = keyHint.text;
  }

  return (
    <div className="flex items-center gap-1">
      {elementHint && (
        <div className={cn("rounded px-0.5 py-0.5 text-xs font-semibold", "bg-text-100")}>{elementHint}</div>
      )}
      {!elementHint && textHint && (
        <kbd className={cn("rounded px-1.5 py-0.5 text-xs font-semibold", "bg-text-100")}>{textHint.toUpperCase()}</kbd>
      )}
    </div>
  );
}
