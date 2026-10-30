export type Messages = {
  start: string;
  complete: string;
};

export type AnnouncerOptions = {
  locale?: string;
  messages?: Partial<Messages>;
};

export type AnnouncerStatus = "idle" | "streaming" | "complete";

export type AnnouncerState = {
  status: AnnouncerStatus;
  announcement: string;
};

export type Listener = (state: AnnouncerState) => void;

export type Announcer = {
  mount: () => () => void;
  start: () => void;
  push: (chunk: string) => void;
  end: () => void;
  getState: () => AnnouncerState;
  subscribe: (listener: Listener) => () => void;
};

const defaultMessages: Messages = {
  start: "Generating response",
  complete: "Response complete",
};

const visuallyHidden =
  "position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0";

function createRegion(): HTMLElement {
  const region = document.createElement("div");
  region.setAttribute("aria-live", "polite");
  region.setAttribute("aria-atomic", "true");
  region.style.cssText = visuallyHidden;
  document.body.append(region);
  return region;
}

export function createAnnouncer(options: AnnouncerOptions = {}): Announcer {
  const messages = { ...defaultMessages, ...options.messages };
  const segmenter = new Intl.Segmenter(options.locale, {
    granularity: "sentence",
  });
  const listeners = new Set<Listener>();
  let state: AnnouncerState = { status: "idle", announcement: "" };
  let region: HTMLElement | undefined;
  let buffer = "";

  const say = (status: AnnouncerStatus, announcement: string) => {
    state = { status, announcement };
    if (region) {
      region.textContent = announcement;
    }
    listeners.forEach((listener) => {
      listener(state);
    });
  };

  return {
    mount: () => {
      const mountedRegion = createRegion();
      region = mountedRegion;
      return () => {
        mountedRegion.remove();
        if (region === mountedRegion) {
          region = undefined;
        }
      };
    },
    start: () => {
      buffer = "";
      say("streaming", messages.start);
    },
    push: (chunk) => {
      buffer += chunk;
      const sentences = Array.from(segmenter.segment(buffer), (s) => s.segment);
      const pending = sentences.pop() ?? "";
      const complete = sentences.join("").trim();
      if (complete) {
        buffer = pending;
        say("streaming", complete);
      }
    },
    end: () => {
      const rest = buffer.trim();
      buffer = "";
      say(
        "complete",
        rest ? `${rest} ${messages.complete}` : messages.complete,
      );
    },
    getState: () => state,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
