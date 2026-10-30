import { createAnnouncer } from "@/core/announcer";

const region = () =>
  document.querySelector<HTMLElement>('[aria-live="polite"]');

afterEach(() => {
  document.body.innerHTML = "";
});

test("adds one hidden polite live region on create", () => {
  createAnnouncer();

  expect(document.querySelectorAll('[aria-live="polite"]')).toHaveLength(1);
});

test("announces start", () => {
  const a = createAnnouncer();

  a.start();

  expect(region()?.textContent).toBe("Generating response");
});

test("does not announce an incomplete sentence", () => {
  const a = createAnnouncer();
  a.start();

  a.push("The best way");

  expect(region()?.textContent).toBe("Generating response");
});

test("announces a sentence once it is complete", () => {
  const a = createAnnouncer();
  a.start();

  a.push("The best way is ");
  a.push("flexbox. Set");

  expect(region()?.textContent).toBe("The best way is flexbox.");
});

test("end flushes the last sentence then announces complete", () => {
  const a = createAnnouncer();
  a.start();
  a.push("Use flexbox");

  a.end();

  expect(region()?.textContent).toBe("Use flexbox Response complete");
});

test("destroy removes the live region", () => {
  const a = createAnnouncer();

  a.destroy();

  expect(region()).toBeNull();
});
