export type Messages = {
  start: string;
  complete: string;
};

export type AnnouncerOptions = {
  locale?: string;
  messages?: Partial<Messages>;
};

export type Announcer = {
  start: () => void;
  push: (chunk: string) => void;
  end: () => void;
  destroy: () => void;
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
  const region = createRegion();
  let buffer = "";

  const say = (text: string) => {
    region.textContent = text;
  };

  return {
    start: () => {
      buffer = "";
      say(messages.start);
    },
    push: (chunk) => {
      buffer += chunk;
      const sentences = Array.from(segmenter.segment(buffer), (s) => s.segment);
      const pending = sentences.pop() ?? "";
      const complete = sentences.join("").trim();
      if (complete) {
        say(complete);
        buffer = pending;
      }
    },
    end: () => {
      const rest = buffer.trim();
      buffer = "";
      say(rest ? `${rest} ${messages.complete}` : messages.complete);
    },
    destroy: () => {
      region.remove();
    },
  };
}
