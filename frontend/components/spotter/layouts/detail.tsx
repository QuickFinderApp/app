/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactMarkdown, { Components } from "react-markdown";
import { cn } from "@/lib/utils";
import { generatePageKey, useRouter } from "@/lib/stack-router";
import SpotterImagePreview from "../pages/image-preview";
import { SpotterData, SpotterLayout } from "../types/layouts/layouts";
import { SpotterDetailData } from "../types/layouts/detail";
import React, { useRef, useEffect } from "react";

const headingRenderers: Partial<Components> = {
  h1: ({ node, children, ...props }) => (
    <h1 className="text-3xl font-bold" {...props}>
      {children}
    </h1>
  ),
  h2: ({ node, children, ...props }) => (
    <h1 className="text-2xl font-bold m" {...props}>
      {children}
    </h1>
  ),
  h3: ({ children, ...props }) => (
    <h1 className="text-xl font-bold" {...props}>
      {children}
    </h1>
  ),
  h4: ({ node, children, ...props }) => (
    <h1 className="text-lg font-bold" {...props}>
      {children}
    </h1>
  ),
  h5: ({ node, children, ...props }) => (
    <h1 className="text-sm font-bold" {...props}>
      {children}
    </h1>
  ),
  h6: ({ node, children, ...props }) => (
    <h1 className="text-xs font-bold" {...props}>
      {children}
    </h1>
  )
};

const listRenderers: Partial<Components> = {
  ol: ({ node, children, ...props }) => {
    return (
      <ol className={`list-decimal`} {...props}>
        {children}
      </ol>
    );
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul className={`list-disc`} {...props}>
        {children}
      </ul>
    );
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className="ml-4" {...props}>
        {children}
      </li>
    );
  }
};

type SearchParamsObject = {
  [key: string]: string;
};
const getSrcSearchParams = (src: string | undefined): SearchParamsObject => {
  if (!src) {
    return {};
  }

  try {
    const [, queryString] = src.split("?");
    if (!queryString) return {};

    const searchParams = new URLSearchParams(queryString);
    return Object.fromEntries(searchParams.entries());
  } catch {
    return {};
  }
};

const getSearchParamsNumber = (searchParams: SearchParamsObject, field: string) => {
  const value = searchParams[field];
  return value ? parseInt(value, 10) : undefined;
};
const inferImageSizeFromSearchParams = (searchParams: SearchParamsObject) => {
  const spotterWidth = getSearchParamsNumber(searchParams, "spotter-width");
  const spotterHeight = getSearchParamsNumber(searchParams, "spotter-width");

  const raycastWidth = getSearchParamsNumber(searchParams, "raycast-width");
  const raycastHeight = getSearchParamsNumber(searchParams, "raycast-height");

  let definedWidth = spotterWidth || spotterHeight;
  if (definedWidth) {
    definedWidth = definedWidth / 25;
  }

  let definedHeight = raycastWidth || raycastHeight;
  if (definedHeight) {
    definedHeight = definedHeight / 25;
  }

  return {
    width: definedWidth,
    height: definedHeight
  };
};

const renderers: Partial<Components> = {
  ...headingRenderers,
  ...listRenderers,
  code: ({ node, children, ...props }) => (
    <code className="bg-slate-300 dark:bg-gray-700 bg-opacity-45 rounded-md p-0.5" {...props}>
      {children}
    </code>
  ),
  a: ({ node, children, ...props }) => (
    <a className="hover:underline text-blue-800 dark:text-blue-500" {...props}>
      {children}
    </a>
  ),
  blockquote: ({ node, children, ...props }) => (
    <blockquote className="text-text-600 border-l-2 px-4" {...props}>
      {children}
    </blockquote>
  )
};

export function useSpotterDetail(spotterData: SpotterData): SpotterLayout {
  const { markdown, markdownClassName, actionMenu } = spotterData as SpotterDetailData;
  const imageSourcesRef = useRef<string[]>([]);

  useEffect(() => {
    const imgRegex = /!\[.*?\]\((.*?)\)/g;
    const matches = markdown.matchAll(imgRegex);
    imageSourcesRef.current = Array.from(matches, (m) => m[1]);
  }, [markdown]);

  const renderers: Partial<Components> = {
    ...headingRenderers,
    ...listRenderers,
    code: ({ node, children, ...props }) => (
      <code className="bg-slate-300 dark:bg-gray-700 bg-opacity-45 rounded-md p-0.5" {...props}>
        {children}
      </code>
    ),
    a: ({ node, children, ...props }) => (
      <a className="hover:underline text-blue-800 dark:text-blue-500" {...props}>
        {children}
      </a>
    ),
    blockquote: ({ node, children, ...props }) => (
      <blockquote className="text-text-600 border-l-2 px-4" {...props}>
        {children}
      </blockquote>
    ),
    img: ({ node, children, alt, src, className, ...props }) => {
      const searchParams = getSrcSearchParams(src);
      const { height, width } = inferImageSizeFromSearchParams(searchParams);

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();

      function zoomIntoImage() {
        if (!src) return;
        const currentIndex = imageSourcesRef.current.indexOf(src);
        if (currentIndex === -1) return;

        router.push({
          key: generatePageKey(`image-view`),
          component: <SpotterImagePreview sources={imageSourcesRef.current} initialIndex={currentIndex} />
        });
      }

      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={alt}
          src={src}
          className={cn(className, "cursor-pointer object-contain")}
          style={{
            height: height ? `${height}rem` : undefined,
            width: width ? `${width}rem` : undefined
          }}
          {...props}
          onClick={zoomIntoImage}
        >
          {children}
        </img>
      );
    }
  };

  const body = (
    <ReactMarkdown components={renderers} className={cn("m-2 space-y-2 flex flex-col gap-2", markdownClassName)}>
      {markdown}
    </ReactMarkdown>
  );

  return {
    body,
    actionMenu,
    useArrowKeys: true
  };
}
