# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Mobile web frontend for an IT operations / repair-ticket ("报修") system. Vue 3 + TypeScript + Vite, single-column layout constrained to a phone-frame width (`#app` max-width 480px, see [src/styles/main.css](src/styles/main.css)). No state management library — state lives in composables or component `ref`s. No CSS framework — plain scoped CSS per component using CSS variables defined in `main.css`.

UI text, code comments, and API error messages are in Chinese; keep new code consistent with this.

## Commands

```bash
pnpm install       # install deps (pnpm-lock.yaml is the lockfile in use, despite package-lock.json also existing)
pnpm dev           # start Vite dev server
pnpm build         # type-check (vue-tsc --noEmit) then production build
pnpm type-check    # run vue-tsc only
pnpm preview       # preview production build
```

There is no test suite and no lint script configured in this repo.

## Backend integration

- Dev server proxies any request matching `^/api` to `http://127.0.0.1:8000` (see [vite.config.ts](vite.config.ts)). The backend's own routes already include the `/api/mobile` prefix — do not strip it.
- In dev, `axios` uses an empty `baseURL` so requests go through the Vite proxy above (avoids CORS). In production it uses `VITE_API_BASE_URL` directly ([.env.development](.env.development), [src/utils/request.ts](src/utils/request.ts)).
- Backend responses use an envelope `{ code, message, data }`. The response interceptor in [src/utils/request.ts](src/utils/request.ts) unwraps this — API functions declare their return type as the unwrapped `data` shape directly, not the envelope. `code !== 200` is treated as an application error, toasted, and rejected.
- A `401` response clears auth and redirects to `/mobile/login`, preserving the original path in a `redirect` query param.
- FastAPI's default 422 validation error shape (`{ detail: [{ msg, ... }] }`) is special-cased in `extractErrorMessage` since it doesn't match the `{ code, message }` envelope.
- Auth token is a bearer JWT stored in `localStorage` (see [src/utils/storage.ts](src/utils/storage.ts)) and attached via a request interceptor.

## Architecture

- **Routing** ([src/router/index.ts](src/router/index.ts)): all routes are nested under `/mobile/*`. Route `meta` fields (`title`, `showBack`, `showTabBar`, `public`) drive the shared chrome in [src/App.vue](src/App.vue) (`NavBar` / `TabBar`) — new pages should set these instead of each page building its own header/nav. A global `beforeEach` guard redirects unauthenticated users to login for any route not marked `meta.public`.
- **API layer** ([src/api/mobile/*.ts](src/api/mobile/)): one file per backend resource (`auth`, `ticket`, `home`, `faq`, `asset`), each just a thin set of typed functions wrapping `request()` from [src/utils/request.ts](src/utils/request.ts). Add new endpoints here rather than calling axios/`request` directly from views.
- **Types** ([src/types/index.ts](src/types/index.ts)): all shared domain types and enum-like label maps (`ticketStatusMap`, `priorityMap`, `ticketRecordActionMap`, etc.) live in this single file. When adding a new status/enum value from the backend, add both the union type and its label map here.
- **Composables** ([src/composables/](src/composables/)): module-level (singleton) reactive state rather than a store library. E.g. `useTicketCategories` lazily fetches and caches ticket categories once per app session (`loaded`/`loadingPromise` guards against duplicate fetches); `useToast` holds a single global toast `ref` pair. Follow this pattern for other cross-page shared state instead of introducing Pinia/Vuex.
- **Views** ([src/views/](src/views/)) map 1:1 to routes; **components** ([src/components/](src/components/)) are shared presentational pieces (`StatusTag`, `PriorityTag`, `RepairCard`, `NavBar`, `TabBar`, `Toast`, `Icon`).
- Styling: components use `<style scoped>` with CSS variables from `main.css` (`--color-primary`, `--color-text-secondary`, `--color-border`, etc.) rather than hardcoded values. Shared layout primitives (`.page-section`, `.section-title`, `.empty-tip`, `.required`) are defined globally in `main.css` — reuse them instead of redefining per-component.
- Path alias `@/*` maps to `src/*` (configured in both `vite.config.ts` and `tsconfig.json`).
