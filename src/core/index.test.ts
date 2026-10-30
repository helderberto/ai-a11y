import * as api from "@/core";

test("exposes the core module API", () => {
  expect(Object.keys(api)).toEqual(["createAnnouncer"]);
});
