"use client";

import { RouterContextType, useRouter } from "@/lib/stack-router";
import { Spotter } from "../spotter/spotter";

function transformPagesStack(router: RouterContextType) {
  return router.stack.map((page) => {
    return page.key;
  });
}

export default function SpotterError({ error }: { error: Error }) {
  const router = useRouter();

  return (
    <Spotter
      data={{
        element: "Error",
        errorMessage: error.message,
        pagesStackTrace: transformPagesStack(router)
      }}
    />
  );
}
