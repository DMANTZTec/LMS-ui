# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # production build
npm run preview   # preview production build
npm run lint      # eslint .
npm run gen:api   # regenerate src/api/openApi from the live backend's OpenAPI spec
```

There is no test runner configured in this project.

`gen:api` requires a running backend at `http://localhost:9090/lms/v3/api-docs` (see `openapitools.json`); it regenerates the `typescript-axios` client under `src/api/openApi`. Treat `src/api/openApi/**` as generated code — don't hand-edit it, regenerate it instead.

## Architecture

React 19 + Vite SPA (JSX, not TypeScript — despite `tsconfig.json`/`tsconfig.app.json` existing, the app code is `.jsx`). Styling is Tailwind CSS v4 (via `@tailwindcss/vite`) with shadcn/ui components (`components.json`: style `radix-nova`, base color `neutral`, icons from `lucide-react`). The `@/*` import alias maps to `src/*` (configured in both `vite.config.js` and `jsconfig.json`).

### Directory layout (`src/`)

- `api/` — API layer. Most files (`*-controller*.js`) are thin wrappers that instantiate a generated OpenAPI client class from `api/openApi/` bound to the shared `axiosInstance` from `api/axios/setupInterceptors.js`, e.g. `export const studentApi = new StudentControllerApi(undefined, undefined, axiosInstance)`. `api/openApi/` is the openapi-generator output (typescript-axios) — regenerate via `npm run gen:api`, don't edit by hand.
- `api/axios/` — `axiosInstance.js` creates the base axios instance (`baseURL` from `VITE_API_URL`); `requestInterceptor.js` attaches the JWT from `localStorage["LmsJwTtoken"]` as a Bearer token; `responseInterceptor.js` clears the token and hard-redirects to `/` on a 401; `setupInterceptors.js` wires both interceptors onto the instance and is the import used everywhere else.
- `route/AppRoute.jsx` — single source of truth for all routes (`react-router-dom`, `BrowserRouter`). Role-gated route groups (STAFF / INSTRUCTOR / STUDENT) are wrapped in `<Route element={<AuthGuard allowedRole="...">}>`. Most dashboard-level pages are `React.lazy`-loaded inside one top-level `<Suspense>`.
- `components/protectedRoutes/AuthGuard.jsx` — route guard: reads the JWT via `utils/tokenUtility.js`, redirects to the role-appropriate login page if missing/expired, otherwise renders `<Outlet />`.
- `utils/tokenUtility.js` — all JWT/localStorage logic (`getToken`, `saveToken`, `decodeToken` via `jwt-decode`, `isTokenExpired`, `isAuthenticated`, `getUserRole`). Role and auth state are derived from the decoded token, not from separate stored fields.
- `store/` — global client state via Jotai. `appStore.js` creates the store instance, provided at the root in `main.jsx`. Atoms live under `store/atoms/` (e.g. `authAtoms.js`, `courseAtoms.js`), re-exported from `store/atoms/index.js`.
- `features/` — feature-scoped component modules organized by domain (`Course-Mgt`, `courseBuilder`, `Avatar`, etc.), each with its own subcomponents, and sometimes local `validation.js`/`types.js` files.
- `pages/` — route-level page components, organized by audience (`Auth/`, `staffPages/`, `studentPages/`, `instructorPages/`, `public/`, `main/`).
- `components/ui/` — shadcn/ui primitives (generated; extend via `shadcn` CLI/registry rather than restructuring by hand).
- `components/common/` — shared non-generated components used across features.
- `lib/utils.js` — `cn()` helper (`clsx` + `tailwind-merge`) used throughout for conditional Tailwind classes.

### Data fetching & app-wide providers

`App.jsx` wraps the app in `QueryClientProvider` (`@tanstack/react-query`) and a global `react-hot-toast` `<Toaster>`. Server state (fetching/mutating LMS data) should go through TanStack Query calling the `api/*` controller wrappers; local/cross-component client state goes through Jotai atoms in `store/`.

### Auth model

JWT (`LmsJwTtoken`) is stored in `localStorage`, decoded client-side for role (`STAFF` / `INSTRUCTOR` / `STUDENT`) and expiry — there is no separate session/user endpoint on the client. Route protection, role checks, and token attachment (axios request interceptor) all read from this single token, so changes to the token's shape or claims need to be reflected in `utils/tokenUtility.js`, `AuthGuard.jsx`, and `requestInterceptor.js` together.
