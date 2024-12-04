"use client";

import { Umami } from "./tracker";

const umamiClient =
  (typeof window !== "undefined" &&
    new Umami({
      autoTrack: true,
      shouldSendLocation: false,
      host: "https://umami.iamevan.dev/",
      websiteId: "9c2b5679-5ddf-4ee3-a0b2-5c526d37cd49"
    })) ||
  null;

export function trackEvent(
  eventName: string,
  data: {
    [key: string]: any;
  }
) {
  umamiClient?.track(eventName, data);
}
