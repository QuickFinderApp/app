export function trackEvent(
  eventName: string,
  data: {
    [key: string]: any;
  }
) {
  if (typeof window !== "undefined") {
    const umami = (window as any).umami;
    if (typeof umami !== "undefined") {
      umami.track(eventName, data);
    }
  }
}
