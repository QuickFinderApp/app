"use client";

import dynamic from "next/dynamic";
import Script from "next/script";

function RawUmami() {
  const isJavaScriptEnabled = false; //typeof window !== "undefined";
  if (process.env.NODE_ENV == "development" && isJavaScriptEnabled) {
    localStorage.setItem("umami.disabled", "1");
  }

  return (
    <>
      <Script async src="https://umami.iamevan.dev/script.js" data-website-id="9c2b5679-5ddf-4ee3-a0b2-5c526d37cd49" />
    </>
  );
}

export const Umami = dynamic(async () => RawUmami, {
  ssr: false
});
