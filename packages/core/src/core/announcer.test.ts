import { createAnnouncer } from "@/core/announcer";

const regions = () => document.querySelectorAll('[aria-live="polite"]');
const region = () =>
  document.querySelector<HTMLElement>('[aria-live="polite"]');

const mounted = () => {
  const announcer = createAnnouncer();
  announcer.mount();
  return announcer;
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("lifecycle", () => {
  test("does not touch the DOM before mount", () => {
    createAnnouncer();

    expect(regions()).toHaveLength(0);
  });

  test("mount adds one hidden polite live region", () => {
    mounted();

    expect(regions()).toHaveLength(1);
  });

  test("mount cleanup removes the live region", () => {
    const announcer = createAnnouncer();
    const cleanup = announcer.mount();

    cleanup();

    expect(regions()).toHaveLength(0);
  });

  test("survives mount, cleanup, mount (React StrictMode)", () => {
    const announcer = createAnnouncer();
    announcer.mount()();
    announcer.mount();

    announcer.start();

    expect(regions()).toHaveLength(1);
    expect(region()?.textContent).toBe("Generating response");
  });

  test("start before mount updates state without throwing", () => {
    const announcer = createAnnouncer();

    announcer.start();

    expect(announcer.getState().status).toBe("streaming");
  });
});

describe("announcements", () => {
  test("announces start", () => {
    const announcer = mounted();

    announcer.start();

    expect(region()?.textContent).toBe("Generating response");
  });

  test("does not announce an incomplete sentence", () => {
    const announcer = mounted();
    announcer.start();

    announcer.push("The best way");

    expect(region()?.textContent).toBe("Generating response");
  });

  test("announces a sentence once it is complete", () => {
    const announcer = mounted();
    announcer.start();

    announcer.push("The best way is ");
    announcer.push("flexbox. Set");

    expect(region()?.textContent).toBe("The best way is flexbox.");
  });

  test("end flushes the last sentence then announces complete", () => {
    const announcer = mounted();
    announcer.start();
    announcer.push("Use flexbox");

    announcer.end();

    expect(region()?.textContent).toBe("Use flexbox Response complete");
  });

  test("uses custom messages", () => {
    const announcer = createAnnouncer({
      messages: { start: "Gerando resposta" },
    });
    announcer.mount();

    announcer.start();

    expect(region()?.textContent).toBe("Gerando resposta");
  });
});

describe("state", () => {
  test("starts idle", () => {
    const announcer = createAnnouncer();

    expect(announcer.getState()).toEqual({ status: "idle", announcement: "" });
  });

  test("tracks status and last announcement", () => {
    const announcer = createAnnouncer();

    announcer.start();
    announcer.push("Hi. ");
    announcer.push("Bye");
    announcer.end();

    expect(announcer.getState()).toEqual({
      status: "complete",
      announcement: "Bye Response complete",
    });
  });

  test("notifies subscribers on change", () => {
    const announcer = createAnnouncer();
    const listener = vi.fn();
    announcer.subscribe(listener);

    announcer.start();

    expect(listener).toHaveBeenCalledWith({
      status: "streaming",
      announcement: "Generating response",
    });
  });

  test("unsubscribe stops notifications", () => {
    const announcer = createAnnouncer();
    const listener = vi.fn();
    const unsubscribe = announcer.subscribe(listener);

    unsubscribe();
    announcer.start();

    expect(listener).not.toHaveBeenCalled();
  });

  test("getState returns the same object until state changes", () => {
    const announcer = createAnnouncer();

    expect(announcer.getState()).toBe(announcer.getState());
  });
});
