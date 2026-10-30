import { act, renderHook } from "@testing-library/react";
import { StrictMode } from "react";
import { useAnnouncer } from "@/use-announcer";

const regions = () => document.querySelectorAll('[aria-live="polite"]');
const region = () =>
  document.querySelector<HTMLElement>('[aria-live="polite"]');

test("adds the live region on mount", () => {
  renderHook(() => useAnnouncer());

  expect(regions()).toHaveLength(1);
});

test("removes the live region on unmount", () => {
  const { unmount } = renderHook(() => useAnnouncer());

  unmount();

  expect(regions()).toHaveLength(0);
});

test("keeps one live region in StrictMode", () => {
  renderHook(() => useAnnouncer(), { wrapper: StrictMode });

  expect(regions()).toHaveLength(1);
});

test("starts idle", () => {
  const { result } = renderHook(() => useAnnouncer());

  expect(result.current.status).toBe("idle");
  expect(result.current.announcement).toBe("");
});

test("re-renders with new state", () => {
  const { result } = renderHook(() => useAnnouncer());

  act(() => {
    result.current.start();
    result.current.push("Use flexbox. Then");
  });

  expect(result.current.status).toBe("streaming");
  expect(result.current.announcement).toBe("Use flexbox.");
  expect(region()?.textContent).toBe("Use flexbox.");
});

test("announces complete on end", () => {
  const { result } = renderHook(() => useAnnouncer());

  act(() => {
    result.current.start();
    result.current.end();
  });

  expect(result.current.status).toBe("complete");
  expect(region()?.textContent).toBe("Response complete");
});

test("passes options to the core", () => {
  const { result } = renderHook(() =>
    useAnnouncer({ messages: { start: "Gerando resposta" } }),
  );

  act(() => {
    result.current.start();
  });

  expect(region()?.textContent).toBe("Gerando resposta");
});

test("keeps methods stable across renders", () => {
  const { result, rerender } = renderHook(() => useAnnouncer());
  const { start, push, end } = result.current;

  rerender();

  expect(result.current.start).toBe(start);
  expect(result.current.push).toBe(push);
  expect(result.current.end).toBe(end);
});
