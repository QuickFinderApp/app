"use client";

import { useEffect, useRef } from "react";

type TabRestricterProps = {
  children: React.ReactNode;
};

export function TabRestricter({ children }: TabRestricterProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          event.preventDefault();

          const focusableElements = container.querySelectorAll('[data-tab-enabled="1"]');

          let currentIndex = Array.from(focusableElements).indexOf(document.activeElement as Element);

          if (event.shiftKey) {
            currentIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
          } else {
            currentIndex = (currentIndex + 1) % focusableElements.length;
          }

          if (focusableElements.length > 0) {
            (focusableElements[currentIndex] as HTMLElement).focus();
          }
        }
      };

      const listenOptions: AddEventListenerOptions = {
        capture: true
      };
      container.addEventListener("keydown", handleKeyDown, listenOptions);
      return () => {
        container.removeEventListener("keydown", handleKeyDown, listenOptions);
      };
    }
  }, [containerRef]);

  return <div ref={containerRef}>{children}</div>;
}
