export type TrackedProperties = {
  hostname?: string;
  language: string;
  referrer: string;
  screen: string;
  title: string;
  url: string;
  website: string;
  tag?: string;
};

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export interface EventData {
  [key: string]: number | string | EventData | number[] | string[] | EventData[];
}

export type EventProperties = {
  name: string;
  data?: EventData;
} & WithRequired<TrackedProperties, "website">;

export type PageViewProperties = WithRequired<TrackedProperties, "website">;
export type CustomEventFunction = (props: PageViewProperties) => EventProperties | PageViewProperties;

export type UmamiTracker = {
  track: {
    (): Promise<string>;
    (eventName: string): Promise<string>;
    (eventName: string, obj: EventData): Promise<string>;
    (properties: PageViewProperties): Promise<string>;
    (eventFunction: CustomEventFunction): Promise<string>;
  };
  identify: (data: EventData) => Promise<string>;
};

export interface UmamiOptions {
  autoTrack: boolean;
  host: string;
  websiteId: string;
  shouldSendLocation: boolean;
  excludeSearch?: boolean;
  domains?: string[];
  tag?: string;
  collectAPIEndpoint?: string;
}

export class Umami implements UmamiTracker {
  private options: UmamiOptions;
  private currentUrl: string;
  private currentRef: string;
  private title: string;
  private cache?: string;
  private initialized: boolean = false;
  private endpoint: string;

  constructor(options: UmamiOptions) {
    const collectAPIEndpoint = options.collectAPIEndpoint || "/api/send";

    this.options = options;
    this.endpoint = `${this.options.host.replace(/\/$/, "")}${collectAPIEndpoint}`;
    this.currentUrl = this.parseURL(window.location.href);
    this.currentRef = document.referrer.startsWith(window.location.origin) ? "" : document.referrer;
    this.title = document.title;

    if (this.options.autoTrack && !this.trackingDisabled()) {
      if (document.readyState === "complete") {
        this.init();
      } else {
        document.addEventListener("readystatechange", this.init.bind(this), true);
      }
    }
  }

  private encode(str?: string): string | undefined {
    if (!str) {
      return undefined;
    }

    try {
      const result = decodeURI(str);

      if (result !== str) {
        return result;
      }
    } catch {
      return str;
    }

    return encodeURI(str);
  }

  private parseURL(url: string): string {
    try {
      const { pathname, search, hash } = new URL(url, window.location.origin);
      url = pathname + search + hash;
    } catch {
      /* empty */
    }
    return this.options.excludeSearch ? url.split("?")[0] : url;
  }

  private getPayload(): PageViewProperties {
    const { width, height } = window.screen;
    const screen = `${width}x${height}`;
    const { language } = window.navigator;

    const payload: PageViewProperties = {
      website: this.options.websiteId,
      language,
      screen,
      title: this.encode(this.title) || "",
      url: "",
      referrer: ""
    };

    if (this.options.shouldSendLocation) {
      payload.hostname = window.location.hostname;
      payload.url = this.encode(this.currentUrl) || "";
      payload.referrer = this.encode(this.currentRef) || "";
    }

    if (this.options.tag) {
      payload.tag = this.options.tag;
    }

    return payload;
  }

  private handlePush = (_state: any, _title: string, url?: string | URL | null) => {
    if (!url) return;

    this.currentRef = this.currentUrl;
    this.currentUrl = this.parseURL(url.toString());

    if (this.currentUrl !== this.currentRef) {
      setTimeout(() => this.track(), 300);
    }
  };

  private handlePathChanges() {
    type HistoryMethod = (data: any, unused: string, url?: string | URL | null | undefined) => void;

    const hook = (_this: History, method: "pushState" | "replaceState", callback: HistoryMethod) => {
      const orig = _this[method];

      return (data: any, unused: string, url?: string | URL | null | undefined) => {
        callback(data, unused, url);
        return orig.call(_this, data, unused, url);
      };
    };

    window.history.pushState = hook(window.history, "pushState", this.handlePush as HistoryMethod);
    window.history.replaceState = hook(window.history, "replaceState", this.handlePush as HistoryMethod);
  }

  private handleTitleChanges() {
    const observer = new MutationObserver(([entry]) => {
      this.title = entry && entry.target ? (entry.target as HTMLTitleElement).text : "";
    });

    const node = document.querySelector("head > title");

    if (node) {
      observer.observe(node, {
        subtree: true,
        characterData: true,
        childList: true
      });
    }
  }

  private handleClicks() {
    document.addEventListener(
      "click",
      async (e: MouseEvent) => {
        const isSpecialTag = (tagName: string) => ["BUTTON", "A"].includes(tagName);

        const trackElement = async (el: HTMLElement) => {
          const attr = el.getAttribute.bind(el);
          const eventName = attr("data-umami-event");

          if (eventName) {
            const eventData: EventData = {};

            el.getAttributeNames().forEach((name) => {
              const match = name.match(/data-umami-event-([\w-_]+)/);

              if (match) {
                eventData[match[1]] = attr(name) || "";
              }
            });

            return this.track(eventName, eventData);
          }
        };

        const findParentTag = (rootElem: HTMLElement, maxSearchDepth: number): HTMLElement | null => {
          let currentElement: HTMLElement | null = rootElem;
          for (let i = 0; i < maxSearchDepth; i++) {
            if (currentElement && isSpecialTag(currentElement.tagName)) {
              return currentElement;
            }
            currentElement = currentElement?.parentElement || null;
            if (!currentElement) {
              return null;
            }
          }
          return null;
        };

        const el = e.target as HTMLElement;
        const parentElement = isSpecialTag(el.tagName) ? el : findParentTag(el, 10);

        if (parentElement) {
          const href = (parentElement as HTMLAnchorElement).href;
          const target = (parentElement as HTMLAnchorElement).target;
          const eventName = parentElement.getAttribute("data-umami-event");

          if (eventName) {
            if (parentElement.tagName === "A") {
              const external = target === "_blank" || e.ctrlKey || e.shiftKey || e.metaKey || e.button === 1;

              if (eventName && href) {
                if (!external) {
                  e.preventDefault();
                }
                return trackElement(parentElement).then(() => {
                  if (!external) window.location.href = href;
                });
              }
            } else if (parentElement.tagName === "BUTTON") {
              return trackElement(parentElement);
            }
          }
        } else {
          return trackElement(el);
        }
      },
      true
    );
  }

  private trackingDisabled(): boolean {
    return (
      !this.options.websiteId ||
      (typeof localStorage !== "undefined" && localStorage.getItem("umami.disabled") !== null) ||
      (this.options.domains !== undefined && !this.options.domains.includes(window.location.hostname))
    );
  }

  private async send(payload: EventProperties | PageViewProperties, type: string = "event"): Promise<string> {
    if (this.trackingDisabled()) return "";

    const headers: HeadersInit = {
      "Content-Type": "application/json"
    };

    if (typeof this.cache !== "undefined") {
      headers["x-umami-cache"] = this.cache;
    }

    try {
      const res = await fetch(this.endpoint, {
        method: "POST",
        body: JSON.stringify({ type, payload }),
        headers
      });
      const text = await res.text();

      return (this.cache = text);
    } catch {
      return "";
    }
  }

  private init() {
    if (!this.initialized) {
      this.track();
      this.handlePathChanges();
      this.handleTitleChanges();
      this.handleClicks();
      this.initialized = true;
    }
  }

  track: UmamiTracker["track"] = (obj?: string | PageViewProperties | CustomEventFunction, data?: EventData) => {
    if (typeof obj === "string") {
      return this.send({
        ...this.getPayload(),
        name: obj,
        data: typeof data === "object" ? data : undefined
      });
    } else if (typeof obj === "object") {
      return this.send(obj);
    } else if (typeof obj === "function") {
      return this.send(obj(this.getPayload()));
    }
    return this.send(this.getPayload());
  };

  identify(data: EventData): Promise<string> {
    return this.send({ ...this.getPayload(), data }, "identify");
  }
}
