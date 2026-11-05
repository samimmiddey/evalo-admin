## Core Principles
- **Conventions & Reference:** All new code and modifications must strictly follow the patterns and conventions documented in this file. When in doubt, reference existing implementation files in the project.

## Project Structure & File Placement
- **Route Handlers & Pages:** App Router routes live in `src/app/(routes)/(protected)/` (authenticated admin views) and `src/app/(routes)/(public)/(auth)/` (public/auth views). Page files (`page.tsx`) must remain thin wrappers that only import and render feature components (e.g., `src/app/(routes)/(protected)/dashboard/page.tsx`).
- **Feature Modules:** Feature-specific code lives in `src/features/<feature>/` containing its main entry component, subcomponents (`components/`), loading skeletons (`components/skeletons/`), Zod validation schemas (`schemas/`), client/server services (`services/`), and TypeScript definitions (`types/`) (e.g., `src/features/dashboard/`).
- **Static Content & Copy:** All static text, copy, headers, and UI strings must reside in `src/data/<feature>/<feature>.data.ts` and be typed via `<feature>.types.ts` (e.g., `src/data/dashboard/dashboard.data.ts`). Never hardcode user-facing copy directly in UI components.
- **Shared Components:** Shared UI components belong in `src/components/common/` (e.g., `src/components/common/primary-title.tsx`), layout wrappers in `src/components/layouts/` (e.g., `src/components/layouts/card-layout.tsx`), navigation components in `src/components/navigation/`, and primitives in `src/components/ui/`.
- **Hooks & Utilities:** Reusable hooks belong in `src/hooks/` (e.g., `src/hooks/use-fetch.ts`). Generic utility functions belong in `src/utils/` (e.g., `src/utils/format-date.ts`).
- **Shared Libraries & Singletons:** Global client instances (Prisma, Ky API) live in `src/lib/` (e.g., `src/lib/prisma.ts`, `src/lib/api.ts`). Centralized API route constants belong in `src/constants/query-urls.ts`.

## Naming & Code Style Conventions
- **File Naming:** Use kebab-case for all files and directories (e.g., `dashboard-stats.tsx`, `use-fetch.ts`, `format-currency.ts`, `auth.schema.ts`).
- **Services Naming:** Explicitly separate client-side and server-side services: `<feature>.client.service.ts` for browser API calls and `<feature>.server.service.ts` for database and server logic (e.g., `src/features/dashboard/services/dashboard.client.service.ts`).
- **Components & Types:** Use PascalCase for React component names and TypeScript interfaces/types.
- **Constants:** Use UPPER_SNAKE_CASE for global constants, route endpoint URLs, and configuration series (e.g., `GET_DASHBOARD_METRICS` in `src/constants/query-urls.ts`).
- **Lint Standards:** No console statements permitted (`no-console: "error"`). Prefix unused variables with an underscore `_`. Use self-closing tags and avoid curly braces for plain string props.

## Component & UI Conventions
- **Typography Primitives:** Use standardized typography components (`PrimaryTitle`, `SecondaryTitle`, `PrimaryBody`) instead of raw heading or paragraph tags with ad-hoc classes (e.g., `src/components/common/primary-title.tsx`).
- **Standard Layouts:** Wrap page containers in `container s-margin-t`, use `PageHeaderLayout` and `HeaderLayout` for section headers, and wrap content blocks in `CardLayout` (e.g., `src/features/dashboard/dashboard.tsx`).
- **Icons & Styling:** Use `lucide-react` for icons and `cn(...)` from `@/lib/utils` for conditional class merging. The application defaults to dark mode (`src/app/css/globals.css`).
- **Data Tables:** Render tabular data using the shared `DataTable` component built on `@tanstack/react-table` with column sizing and infinite pagination support (e.g., `src/features/dashboard/recent-sessions.tsx`).

## Data Fetching, State & Forms
- **Client Fetching:** Fetch data in client components using custom hooks: `useFetch` for single requests and `useInfiniteFetch` for paginated infinite-scroll lists (e.g., `src/hooks/use-fetch.ts`, `src/features/dashboard/dashboard-stats.tsx`).
- **Client Mutations:** Run client-side data mutations using `useMutation` (e.g., `src/hooks/use-mutation.ts`).
- **HTTP Client:** Perform frontend requests using `ky` through the configured `api` instance in `src/lib/api.ts`. Catch and format client errors using `apiError({ error, fallbackMessage })` in client services.
- **Form Handling:** Build forms using `react-hook-form` with `zodResolver` and Zod validation schemas from `src/features/<feature>/schemas/<feature>.schema.ts`. Display field errors with `<InputError />` (e.g., `src/features/auth/sign-in.tsx`).
- **State Management:** Use local `useState` for UI state. Use Zustand for cross-component global state, persisting to `localStorage` via middleware when needed (e.g., `src/store/auth-store.ts`).
- **Client Navigation:** Use `useRouter` from `nextjs-toploader/app` instead of `next/navigation` to preserve the top loading progress indicator (e.g., `src/features/auth/sign-in.tsx`).

## Backend, Database & External Services
- **API Route Handlers:** Define handlers in `src/app/api/.../route.ts`. Parse parameters, validate inputs (throw `ValidationError` if invalid), call the server service, return `apiResponse({ statusCode, data })`, and catch errors with `apiErrorResponse({ error })` (e.g., `src/app/api/dashboard/stat-metrics/route.ts`).
- **Database Access:** Access PostgreSQL strictly through Prisma (`db` from `@/lib/prisma.ts`). Never instantiate new Prisma clients.
- **Server Error Mapping:** Catch errors in server services and route them through `serverError({ error, fallbackMessage })` to translate Prisma and runtime errors into typed `AppError` instances (e.g., `src/lib/server-error.ts`, `src/features/dashboard/services/dashboard.server.service.ts`).
- **External Services:** Isolate third-party server integrations to dedicated clients marked with `import "server-only";` (e.g., `src/lib/api-cashfree.ts`).

## Security & Permission Checks
- **Route Guarding:** Protect private admin routes at the edge via Clerk middleware in `src/proxy.ts`, enforcing `sessionClaims?.metadata?.role === 'ADMIN'`.
- **Server Authorization:** Always invoke `await getAuthenticatedUser()` at the start of any server service or protected data fetching method to enforce valid admin credentials before executing queries (e.g., `src/services/global.server.service.ts`).
- **Redirect Sanitization:** Always sanitize return/redirect query URLs with `sanitizeRedirectUrl` to prevent open-redirect vulnerabilities (e.g., `src/utils/redirect-url-sanitizer.ts`).

## Error, Loading & Feedback States
- **Tri-State Rendering:** All async data components must explicitly handle loading, error, and empty states: return a skeleton loader when `isLoading`, `<ErrorCard text={error} />` when `error`, and `<NoDataCard />` when `!data` (e.g., `src/features/dashboard/dashboard-stats.tsx`).
- **Error Exceptions:** Throw domain-specific error classes extending `AppError` (`UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ValidationError`, `ConflictError`, `RateLimitError`) from `src/lib/app-error.ts`.
- **Toasts & Feedback:** Display user notifications using `sonner` (`toast.success(...)`, `toast.error(...)`).

## Testing, Linting & Commit Commands
- **Lint Verification:** Run `npm run lint` before finishing any task to ensure zero ESLint errors.
- **Git Commit Messages:** Commits must adhere to conventional commit format (`type(scope): subject`) enforced by commitlint and husky hooks (e.g., `feat(users): ...`, `fix(auth): ...`).

## Strict Execution Guidelines
- **Zero Proactivity:** Do not assume, anticipate, or add anything not explicitly requested.
- **Literal Scope:** Implement only the exact task described—no extra files, functions, abstractions, or "helpful" additions.
- **Minimal Changes:** When asked for X, touch only X. Do not refactor, optimize, or embellish surrounding code.
- **Conversations:** During conversation, always answer in words. Never code unless explicitly asked.
- **Responses:** When asked something, always give proper answer in a compact form. Only explain in large if it is truly requried or explictly requested. Keep your answers short, precise and to the point. Never talk about things that are unnecessary and not directly related.
- **Modifications:** Never modify shared components without permission. If a feature/fix requires modification of a shared component, always flag it as a decision point.
- **Ambiguity:** If a request is unclear, ask one short clarifying question instead of guessing.
- **Dependencies:** Never add, remove, or upgrade packages without explicit approval.
- **Existing Conventions:** Follow the project's existing naming, structure, styling, and patterns. Do not introduce new ones.
- **No Unrequested Changes to Config:** Do not touch config, env, build, or tooling files unless asked.
- **Formatting:** Do not reformat, reorder imports, or rename anything outside the requested change.
- **Deletions:** Never delete files, code, or data without explicit permission.
- **Scope Creep:** If you notice a bug or improvement outside the task, mention it properly and do not fix it.