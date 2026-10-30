# AGENTS.md

## Code

- No inline ifs. Always use braces (ESLint `curly: all`).
- Named exports and imports only. No `export default` (ESLint). Config files that tools require to default-export are exempt.
- Deep modules, shallow interfaces: hide complexity behind a small public API.
- Max 2 params per function; use an options object for more (ESLint `max-params`).
- Files near 200 lines get split by concern, each with its own tests (ESLint `max-lines`).

## Tests

- `vi.spyOn` for our own code: easier to control and restore.
- `vi.mock` only for third-party packages.
- `vi.stubGlobal` for web APIs.

## Project

- Commits: [Conventional Commits](https://www.conventionalcommits.org/).
- Versions: [SemVer 2.0.0](https://semver.org/spec/v2.0.0.html).
- Changelog: [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/). Update `## [Unreleased]` with every user-facing change.
- Exact dependency versions (`.npmrc` `save-prefix=""`).
