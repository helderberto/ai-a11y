import * as api from "@/react";

test("exposes the public React API", () => {
  expect(Object.keys(api)).toEqual(["useAnnouncer"]);
});
