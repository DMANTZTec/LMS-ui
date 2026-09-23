# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server (Vite HMR)
npm run build            # Build (production mode, loads .env.production)
npm run build:uat        # Build for UAT (loads .env.uat)
npm run build:prod       # Build for production (loads .env.production)
npm run lint             # ESLint
npm run preview          # Preview last build locally
npm run preview:uat      # Preview UAT build
npm run preview:prod     # Preview production build
npm run gen:api          # Regenerate OpenAPI client from running backend
```

`gen:api` reads `VITE_API_URL` from `.env` / `.env.development`, fetches `/v3/api-docs` from the backend, and writes generated TypeScript-Axios code to `src/api/openApi/`. Run this whenever the backend API changes.

## Environment files

| File | Purpose |
|------|---------|
| `.env` | Local development defaults (committed) |
| `.env.uat` | UAT overrides — set `VITE_API_URL` to the UAT backend (gitignored) |
| `.env.production` | Production overrides — set `VITE_API_URL` to the production backend (gitignored) |

All Vite env vars must be prefixed `VITE_` to be accessible in browser code via `import.meta.env.VITE_*`.

## CI/CD

**`Jenkinsfile`** — parametrized pipeline with a `BUILD_ENV` choice (`uat` | `production`).

- Checkout → Docker Build → Push to Nexus → Deployment Approval → Deploy
- Checks out branch `uat`; uses Jenkins credential ID `github-lms` for GitHub access.
- `BUILD_ENV` is forwarded to Docker as `--build-arg BUILD_ENV=<value>`, which drives `vite build --mode <value>` inside the container, loading the matching `.env.<value>` file.
- Images are tagged by environment: `lms-webui-docker-container:uat` / `:production`.
- Containers are named `lms-webui-docker-container-<env>` so UAT and production can run side-by-side on the same host.
- External port: `30280:80`.

**`Dockerfile`** — two-stage build:
1. `node:20.18-alpine` — runs `npm install` then `npm run build -- --mode ${BUILD_ENV}`; output lands in `dist/`.
2. `nginx:alpine` — copies `dist/` to `/usr/share/nginx/html/lms` and uses `nginx/default.conf`.

**`nginx/default.conf`** — serves the SPA at root `/` with `try_files $uri $uri/ /index.html` so React Router client-side routes work correctly.

## Architecture

### User roles and routing

Three roles drive the entire app: **STAFF**, **INSTRUCTOR**, **STUDENT**. `src/route/AppRoute.jsx` defines all routes. Role-protected sections are wrapped in `<AuthGuard allowedRole="...">` which reads the JWT from `localStorage` (`LmsJwTtoken`), decodes it via `jwt-decode`, and checks expiry. On 401 responses the Axios response interceptor clears the token and redirects to `/`.

| Role | Dashboard route |
|------|----------------|
| STAFF | `/Staff-dashboard` → `StaffDashBoard`, `/courseMgt` → Course-Mgt feature |
| INSTRUCTOR | `/Instructor-dashboard` |
| STUDENT | `/student-dashboard` |

Heavy pages use `React.lazy` + `<Suspense>` for code splitting.

### Path alias

`@/` maps to `src/` (configured in `jsconfig.json` and Vite). Always use `@/` for imports from `src/`.

### API layer

Two parallel API layers exist:
- **`src/api/*.js`** — hand-written modules using the configured `axiosInstance` (`src/api/axios/`). Interceptors automatically attach the Bearer token on every request.
- **`src/api/openApi/`** — auto-generated TypeScript-Axios client. Prefer regenerating this rather than editing it manually.

`axiosInstance` base URL comes from `import.meta.env.VITE_API_URL`.

### State management

- **Jotai** (`src/store/`) for lightweight global state (atoms). The single `appStore` instance lives in `src/store/appStore.js`. Atoms are defined per-domain in `src/store/atoms/`.
- **TanStack React Query** for all server-state fetching, caching, and mutation.

### UI components

shadcn/ui components live in `src/components/ui/`. The project uses Tailwind CSS v4 (config-free, CSS-first). Icons come from `lucide-react`. Notifications use `react-hot-toast` and `sweetalert2`.

### Feature structure

Large features are self-contained under `src/features/`:
- **`Course-Mgt/`** — STAFF course management with tabs: Courses, Programs, Classes, Students, Staff, Reports, Providers. Each tab has a matching `*Tab.jsx` entry and a `*TabComponents/` sub-folder for dialogs and sub-views.
- **`courseBuilder/`** — drag-and-drop course structure editor (`react-movable`).
- **`Avatar/`** — profile/avatar components split by role (`staff/`, `student/`).

Public-facing pages live in `src/pages/main/` (landing page with React Leaflet map) and `src/pages/public/`.
