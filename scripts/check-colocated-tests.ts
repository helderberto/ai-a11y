import { existsSync, globSync } from "node:fs";

const implementation = /^(?!.*\.test\.tsx?$).*\.tsx?$/;

const missing = globSync("src/**/*")
  .filter((file) => implementation.test(file))
  .filter((file) => {
    const base = file.replace(/\.tsx?$/, "");
    return !existsSync(`${base}.test.ts`) && !existsSync(`${base}.test.tsx`);
  });

if (missing.length > 0) {
  console.error("Missing colocated tests:");
  missing.forEach((file) => {
    console.error(`  ${file}`);
  });
  process.exit(1);
}
