import {
  createAnnouncer,
  type Announcer,
  type AnnouncerOptions,
  type AnnouncerState,
} from "ai-a11y";
import { useEffect, useState, useSyncExternalStore } from "react";

export type UseAnnouncerResult = AnnouncerState &
  Pick<Announcer, "start" | "push" | "end">;

export function useAnnouncer(options?: AnnouncerOptions): UseAnnouncerResult {
  const [announcer] = useState(() => createAnnouncer(options));

  useEffect(() => announcer.mount(), [announcer]);

  const state = useSyncExternalStore(
    announcer.subscribe,
    announcer.getState,
    announcer.getState,
  );

  return {
    ...state,
    start: announcer.start,
    push: announcer.push,
    end: announcer.end,
  };
}
