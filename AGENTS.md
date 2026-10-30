# AGENTS.md

## Code

- Strongly typed. No `any`; use `unknown` when the type isn't known (ESLint `strictTypeChecked`).
- No inline ifs. Always use braces (ESLint `curly: all`).
- Named exports and imports only. No `export default` (ESLint). Config files that tools require to default-export are exempt.
- Deep modules, shallow interfaces: hide complexity behind a small public API.
- Each module (`src/<module>`) exposes its API only through its `index.ts` barrel. Import other modules as `@/<module>`; use `./` inside a module. No `../` (ESLint).
- No circular dependencies (`pnpm test:circular`).
- `src/core` stays framework-free (ESLint). Adapters live in `src/<framework>` and ship as `ai-a11y/<framework>`.
- Keep code tree-shakable: no side effects at module scope.
- Max 2 params per function; use an options object for more (ESLint `max-params`).
- Files near 200 lines get split by concern, each with its own tests (ESLint `max-lines`).

## Tests

- Every implementation file has a colocated `.test.ts(x)` (`pnpm test:colocated`).
- 100% coverage: lines, branches, functions, statements.
- Shared cleanup lives in `setup.tests.ts`. Don't repeat it per file.
- `vi.spyOn` for our own code: easier to control and restore.
- `vi.mock` only for third-party packages.
- `vi.stubGlobal` for web APIs.

## Project

- `pnpm check` is the guard gate. It runs in the pre-commit hook and in CI.
- Commits: [Conventional Commits](https://www.conventionalcommits.org/).
- Versions: [SemVer 2.0.0](https://semver.org/spec/v2.0.0.html).
- Changelog: [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/). Update `## [Unreleased]` with every user-facing change.
- Exact dependency versions (`.npmrc` `save-prefix=""`).

## Releases

- Pre-releases: `X.Y.Z-beta.N`, published with `pnpm publish --tag beta`. Stable: `pnpm publish`.
- Before releasing: move `## [Unreleased]` items to `## [X.Y.Z] - YYYY-MM-DD`, update compare links, commit `chore(release): X.Y.Z`, tag `vX.Y.Z`.
- After pushing the tag, create a GitHub release with the CHANGELOG section as notes: `gh release create vX.Y.Z --notes-file <notes>`. Add `--prerelease` for betas.
- `prepublishOnly` runs `pnpm check`, so nothing ships without passing the gates.
