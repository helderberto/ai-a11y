import * as api from "@/index";

test("exposes the public core API", () => {
  expect(Object.keys(api)).toEqual(["createAnnouncer"]);
});
