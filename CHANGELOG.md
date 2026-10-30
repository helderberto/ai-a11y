# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `ai-a11y`: announces streamed AI answers one sentence at a time, with start and complete messages.
- `mount()` adds the hidden live region and returns a cleanup, so the core is safe with server rendering.
- `getState()` and `subscribe()` so framework adapters can stay in sync.
- `ai-a11y/react`: `useAnnouncer` hook. Mounts on render, cleans up on unmount, works in StrictMode.
