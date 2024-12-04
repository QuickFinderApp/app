"use client";

import React, { useState, useContext, createContext, useCallback, useRef, useMemo, useEffect } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { trackEvent } from "./umami";

// Define page configuration type
export type PageConfig = {
  key: string;
  component: React.ReactNode;
  props?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  sentAnalytics?: boolean;
};

// Enhanced router context type
export type RouterContextType = {
  push: (page: PageConfig | React.ReactNode) => void;
  pop: () => void;
  popToRoot: () => void;
  replace: (page: PageConfig | React.ReactNode) => void;
  popTo: (key: string) => void;
  canPop: boolean;
  stack: PageConfig[];
  currentPage: PageConfig | null;
};

const RouterContext = createContext<RouterContextType | null>(null);

// Router configuration options
type RouterConfig = {
  enableTransitions?: boolean;
  errorFallback?: React.FC<FallbackProps>;
  defaultTransition?: string;
  maxStackSize?: number;
  maxStackSizeReachedBehavior?: "removeOldest" | "error";
  onStackChange?: (stack: PageConfig[]) => void;
};

type RouterProviderProps = {
  children: React.ReactNode;
  config?: RouterConfig;
};

export function generatePageKey(name: string) {
  return `${name}.${Math.random().toString(36).slice(2, 11)}`;
}

// Helper to convert ReactNode to PageConfig
const normalizePageInput = (page: PageConfig | React.ReactNode, customPageKey?: string): PageConfig => {
  if (React.isValidElement(page) || typeof page !== "object" || page === null) {
    return {
      key: customPageKey ?? Math.random().toString(36).slice(2, 11),
      component: page,
      sentAnalytics: false
    };
  }
  return page as PageConfig;
};

export function RouterProvider({ children, config }: RouterProviderProps) {
  const [stack, setStack] = useState<PageConfig[]>(() => [normalizePageInput(children, "main")]);

  const {
    enableTransitions = true,
    maxStackSize = 50,
    maxStackSizeReachedBehavior = "removeOldest",
    onStackChange,
    errorFallback: CustomErrorFallback
  } = config || {};

  // Memoized stack operations
  const push = useCallback(
    (page: PageConfig | React.ReactNode) => {
      setStack((prevStack) => {
        if (prevStack.length >= maxStackSize) {
          if (maxStackSizeReachedBehavior == "error") {
            throw new Error(`Stack size limit (${maxStackSize}) reached.`);
          }
          console.warn(`Stack size limit (${maxStackSize}) reached. Removing oldest page.`);
          return [...prevStack.slice(1), normalizePageInput(page)];
        }

        return [...prevStack, normalizePageInput(page)];
      });
    },
    [maxStackSize, maxStackSizeReachedBehavior]
  );

  const pop = useCallback(() => {
    setStack((prevStack) => (prevStack.length > 1 ? prevStack.slice(0, -1) : prevStack));
  }, []);

  const popToRoot = useCallback(() => {
    setStack((prevStack) => [prevStack[0]]);
  }, []);

  const replace = useCallback((page: PageConfig | React.ReactNode) => {
    setStack((prevStack) => [...prevStack.slice(0, -1), normalizePageInput(page)]);
  }, []);

  const popTo = useCallback((key: string) => {
    setStack((prevStack) => {
      const index = prevStack.findIndex((page) => page.key === key);
      return index >= 0 ? prevStack.slice(0, index + 1) : prevStack;
    });
  }, []);

  const currentPage = useMemo(() => (stack.length > 0 ? stack[stack.length - 1] : null), [stack]);

  const errorBoundaryResetter = useRef<(() => void) | null>(null);
  function resetErrorBoundary() {
    if (errorBoundaryResetter.current) {
      errorBoundaryResetter.current();
      errorBoundaryResetter.current = null;
    }
  }
  useEffect(resetErrorBoundary, [currentPage]);

  // Handle stack changes
  const prevStackLength = useRef(stack.length);
  if (stack.length !== prevStackLength.current) {
    prevStackLength.current = stack.length;
    onStackChange?.(stack);
  }

  useEffect(() => {
    stack.forEach((page) => {
      if (page.sentAnalytics !== true) {
        trackEvent("push_page_to_stack", {
          pageKey: page.key
        });
        page.sentAnalytics = true;
      }
    });
  }, [stack]);

  const contextValue = useMemo(
    () => ({
      push,
      pop,
      popToRoot,
      replace,
      popTo,
      canPop: stack.length > 1,
      stack,
      currentPage
    }),
    [push, pop, popToRoot, replace, popTo, stack, currentPage]
  );

  function ErrorFallback({ error, resetErrorBoundary: resetter }: FallbackProps) {
    errorBoundaryResetter.current = resetter;

    if (CustomErrorFallback) {
      return <CustomErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />;
    }

    const canPop = stack.length > 1;
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Alert variant="default" className="max-w-md w-fit h-fit mx-auto mt-8">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="text-sm mb-4">{error.message || "An unexpected error occurred."}</p>
            <Button onClick={resetErrorBoundary} variant="outline" size="sm">
              {canPop && "Go Back"}
              {!canPop && "Try Again"}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <RouterContext.Provider value={contextValue}>
      <ErrorBoundary fallbackRender={ErrorFallback}>
        <div className={enableTransitions ? "transition-all duration-300" : ""}>{currentPage?.component}</div>
      </ErrorBoundary>
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
}

// Custom hook for navigation confirmation
export function useNavigationGuard(shouldBlock: () => boolean) {
  const { push, pop, replace, popToRoot } = useRouter();

  const guardedPush = useCallback(
    (page: PageConfig | React.ReactNode) => {
      if (!shouldBlock() || window.confirm("Are you sure you want to navigate away?")) {
        push(page);
      }
    },
    [push, shouldBlock]
  );

  const guardedPop = useCallback(() => {
    if (!shouldBlock() || window.confirm("Are you sure you want to navigate away?")) {
      pop();
    }
  }, [pop, shouldBlock]);

  return {
    push: guardedPush,
    pop: guardedPop,
    replace,
    popToRoot
  };
}
