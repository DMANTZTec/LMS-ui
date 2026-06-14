# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `LMS-ui/` directory (the Vite project root).

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run lint` — run ESLint over the project
- `npm run preview` — preview the production build

There is no test suite configured.

## Project overview

This is the frontend for a Learning Management System (LMS) — React 19 + Vite, with separate flows for **Staff** (course/program/provider/class management, course builder) and **Students** (dashboard, courses, tasks, schedule).

## Architecture

### Path aliases
`@` resolves to `src/` (configured in `vite.config.js`, `jsconfig.json`, `tsconfig*.json`). Always use `@/...` imports for anything under `src`.

### Routing (`src/route/AppRoute.jsx`)
- `react-router-dom` v7 with `BrowserRouter`.
- Public routes: main landing page, staff/student login, OTP verification, student registration.
- Staff and student feature pages are lazy-loaded (`React.lazy` + `Suspense`).
- Protected routes are wrapped in `<Route element={<AuthGuard allowedRole="STAFF" />}>` / `"STUDENT"` — `AuthGuard` (`src/components/protectedRoutes/AuthGuard.jsx`) checks for a JWT and redirects to the relevant login page if missing/expired.
- Note: `src/components/ProotectedRoute.jsx` is an older, unused protected-route component (checks `localStorage.getItem("token")`) — do not extend it; `AuthGuard` is the one actually wired into routing.

### Authentication / tokens (`src/utils/tokenUtility.js`)
- JWT is stored in `localStorage` under the key **`LmsJwTtoken`**.
- `getToken`, `saveToken`, `decodeToken` (via `jwt-decode`), `isTokenExpired`, `isAuthenticated`, and `getUserRole` (reads `role` claim) are the canonical helpers — use these rather than touching `localStorage` directly.
- Staff/Student login flows go through an OTP step: login API returns an id (`staffId`/similar), which is stashed in `sessionStorage` (e.g. `otpStaff`) before navigating to the OTP verification page; the JWT is saved only after OTP verification succeeds.

### API layer
- **Generated OpenAPI client** lives in `src/api/openApi/` (generated via `@openapitools/openapi-generator-cli`, config in `openapitools.json`; generator version 7.21.0). Do not hand-edit files here — `api.ts` contains all controller classes (`AuthControllerApi`, `CourseManagementControllerApi`, `StaffControllerApi`, `StudentControllerApi`, `ProviderControllerApi`, `StaffCourseControllerApi`, etc.) and DTO types. `docs/` contains per-model/per-controller markdown reference generated alongside the client.
- **Thin wrapper modules** in `src/api/*.api.js` / `src/api/*Controller.js` instantiate each generated controller with the shared axios instance, e.g.:
  ```js
  import { AuthControllerApi } from "./openApi";
  import axiosInstance from './axios/setupInterceptors';
  export const authapi = new AuthControllerApi(undefined, undefined, axiosInstance);
  ```
  Feature code imports these singletons (`authapi`, `api` from `CourseMgtController`, `staffApi`, `studentApi`, `providerApi`, `staffcourseApi`) and calls methods directly, e.g. `authapi.staffLogin(payload)`.
- **Axios setup** (`src/api/axios/`):
  - `axiosInstance.js` — base axios instance, `baseURL: "http://localhost:9090"` (local backend).
  - `requestInterceptor.js` — attaches `Authorization: Bearer <LmsJwTtoken>` from localStorage to every request.
  - `responseInterceptor.js` — on `401`, clears the token and hard-redirects to `/`.
  - `setupInterceptors.js` — wires the above interceptors onto `axiosInstance` and is the instance actually passed into the generated API controllers (import this, not the bare `axiosInstance`).

### State management
- **Jotai** for global/shared client state. `src/store/appStore.js` creates the store, provided at the root in `main.jsx` via `<Provider store={appStore}>`.
- Atoms live in `src/store/atoms/` and are re-exported from `src/store/atoms/index.js` (`authAtoms.js`, `courseAtoms.js`). Add new shared atoms there.
- **TanStack React Query** (`QueryClientProvider` set up in `App.jsx`) is available for server-state caching, though many existing components still fetch via `useEffect` + the API wrappers directly rather than `useQuery`.

### Forms & validation
- `react-hook-form` + `@hookform/resolvers` + `zod` is the intended pattern for new/complex forms (see `src/features/courseBuilder/validation.js` for zod schema examples — `topicSchema`, `chapterSchema`, `courseSchema`).
- `src/components/common/Field.jsx` is the shared field wrapper (label, optional badge, error message) used across forms — prefer it over shadcn's `Form` components.
- Some existing dialogs (e.g. `ProgramFormDialog`) still use plain `useState` + manual `handleChange`/`handleSubmit` — newer forms should follow the RHF + zod + `Field` pattern instead.

### UI / styling
- Tailwind CSS v4 (via `@tailwindcss/vite`) + shadcn/ui (`components.json`, style `radix-nova`, base color `neutral`, icon library `lucide-react`). Generated primitives live in `src/components/ui/` (button, dialog, input, select, tabs, table, etc.) — prefer composing these over writing raw markup.
- `src/index.css` defines the design tokens (CSS custom properties for light/dark themes) and Tailwind `@theme inline` mappings.
- Toasts via `react-hot-toast` (`<Toaster position="top-right" />` mounted in `App.jsx`).
- File uploads go through Cloudinary via `src/components/useCloudinaryUpload.js` (cloud name and upload presets are hardcoded — `upload_img` / `upload_video`).

### Feature structure
- `src/features/Course-Mgt/` — staff "LMS Administration" UI: a single `Main.jsx` with a tab switcher (Courses, Programs, Classes, Students, Staff, Reports, Providers), each tab a component re-exported from `index.js`. Per-tab dialogs/subcomponents live in `coursesTabComponents/` and `ProgramsTabComponents/`. `CourseDetail/` holds chapter/topic/resource views for a single course.
- `src/features/courseBuilder/` — drag-and-drop course structure editor (chapters → topics, with documents/videos/url references per topic). `types.js` defines the in-memory shape (`createChapter`, `createTopic`, using `crypto.randomUUID()` for client-side ids and a separate `backendId`), `validation.js` has the zod schemas.
- `src/pages/Auth/` — staff/student login (`LoginForm.jsx` shared component) and student self-registration + OTP flows.
- `src/pages/staffPages/` and `src/pages/studentPages/` — dashboards per role; `studentDashBoard/` has its own subcomponents (status cards, weekly schedule/performance, task management).
- Images live in `src/assets/images/`, re-exported via `src/assets/images/index.js` — import named exports (`import { Avatar, MCP } from '@/assets/images'`) rather than direct file paths where an export exists.
