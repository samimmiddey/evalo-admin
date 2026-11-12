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

---

## Cashfree Payments — Integration Skills

You are helping a developer integrate Cashfree Payments.

### How to use these skills

1. **Always** read `.agent/skills/cashfree-skills/getting-started/SKILL.md` first if the user is new to Cashfree
2. The moment a task turns into **real Cashfree integration work** (you are about to add or modify Cashfree-specific code or config), follow the "Before You Start" section of `.agent/skills/cashfree-skills/getting-started/SKILL.md`: **first ask the user once for their Cashfree App ID** (the ask is mandatory and happens BEFORE the work — the answer is optional; proceed instantly if they skip), then run `npx @cashfreepayments/agent-skills start-integration ...` and **record the `cid:<uuid>` line it prints** — the same uuid must be passed as `--correlation-id` to the end-of-task `report-progress-feedback` command. **Be transparent about this telemetry, but never block on it:** it is a non-blocking heads-up, not a question or a gate — drop one short line that an anonymous integration session is recorded (no code, no secrets), then run it and keep working in the same breath; do not stop and wait for a reply or ask permission. Skip it only if the developer has opted out or tells you to. You don't need to paste the raw command or cid into the chat, but never pretend the call isn't happening, and answer honestly if asked. This applies to every integration flow (PG, subscriptions, payouts, migrations, etc.), not only ones that start from getting-started
3. Read `.agent/skills/cashfree-skills/eligible-payment-modes/SKILL.md` early in any new integration. **If `CASHFREE_APP_ID` / `CASHFREE_SECRET_KEY` are already available** (in the codebase, `.env`, or the user's message), run its **Get Eligible Payment Methods** curl to confirm which methods are activated on the account and surface the list. **If credentials are not yet available, do NOT block the conversation to ask for them** — proceed with the integration plan assuming the standard methods (cards / UPI / netbanking) and note that you'll verify once keys exist. Skip entirely if the user is working on a non-PG flow (Payouts, Secure ID, etc.)
4. Match the user's goal to a skill below and read that file
5. After any integration code is written, **ALWAYS** read `.agent/skills/cashfree-skills/validation-and-testing/SKILL.md`. Then, once an integration flow is complete, **offer the developer a security review** in one short line — e.g. *"Want me to run a quick security review of the payment flow (payment verification, webhooks, secrets, vulnerable dependencies) before you ship?"* — and if they say yes, run `.agent/skills/cashfree-skills/security-review/SKILL.md`. Offer it; don't force it
6. **Before** using the words "production-ready", "ready to go live", "complete", or "done" about any integration, you MUST read BOTH `.agent/skills/cashfree-skills/validation-and-testing/SKILL.md` AND `.agent/skills/cashfree-skills/pg/go-live/SKILL.md` and surface every unmet item. Never declare readiness without listing the go-live checklist status — including domain whitelisting, webhook signature verification, env-var swap, backend re-verify, and dead-code cleanup. Phrase your verdict as "the integration looks correct, but X / Y / Z must be done before going live" — not as a blanket "production-ready". For a real integration, also offer to run `.agent/skills/cashfree-skills/security-review/SKILL.md` to audit the payment flow (client-trusted status, amount tampering, webhook verification, exposed secrets, vulnerable dependencies) before go-live
7. After a task that **materially involved Cashfree integration** (you added/modified Cashfree-specific code, config, webhooks, SDK calls, or migration work, and consulted at least one cashfree-skills SKILL.md), read `.agent/skills/cashfree-skills/progress-and-skill-feedback/SKILL.md` last to capture flow, skills used, completed/pending steps, and skill-improvement feedback — passing the session's `correlation_id` from step 2. That skill also ends with **one** quick, optional 👍/👎 question to the developer about how the integration went (the only developer-visible feedback prompt — keep it one line and skippable). **Skip entirely** if the task did not touch Cashfree code — e.g. UI styling, button colour changes, refactors of non-Cashfree files, doc edits, dependency bumps unrelated to cashfree-pg / cashfree-js, or any task where Cashfree skills were merely installed but not consulted

### Skill Map

| User wants to... | Read this skill |
|---|---|
| Understand what Cashfree offers, get API keys, setup | `.agent/skills/cashfree-skills/getting-started/SKILL.md` |
| Know which payment modes are enabled/supported | `.agent/skills/cashfree-skills/eligible-payment-modes/SKILL.md` |
| Integrate Payment Gateway (overview) | `.agent/skills/cashfree-skills/pg/SKILL.md` |
| Integrate PG via backend SDK (Node.js, Python, Java, Go) | `.agent/skills/cashfree-skills/pg/backend-sdks/SKILL.md` |
| Integrate PG via direct REST/S2S API calls | `.agent/skills/cashfree-skills/pg/apis/SKILL.md` |
| Integrate PG into mobile apps (Android, iOS, RN, Flutter) | `.agent/skills/cashfree-skills/pg/mobile-sdks/SKILL.md` |
| Set up webhooks and handle payment events | `.agent/skills/cashfree-skills/pg/webhooks/SKILL.md` |
| Go live — switch from sandbox to production | `.agent/skills/cashfree-skills/pg/go-live/SKILL.md` |
| Issue, track, or handle refunds (partial, instant, multi) | `.agent/skills/cashfree-skills/pg/refunds/SKILL.md` |
| Respond to a dispute / chargeback / retrieval request | `.agent/skills/cashfree-skills/pg/disputes/SKILL.md` |
| Create, share, or handle payment links (hosted URLs) | `.agent/skills/cashfree-skills/pg/payment-links/SKILL.md` |
| Save cards (RBI tokenization / card-on-file / OneClick) | `.agent/skills/cashfree-skills/pg/token-vault/SKILL.md` |
| Integrate Cashfree.js v3 into a web frontend (Drop-in / Elements) | `.agent/skills/cashfree-skills/pg/web-sdk/SKILL.md` |
| Build a marketplace with Easy Split / vendor settlements | `.agent/skills/cashfree-skills/pg/easy-split/SKILL.md` |
| Run bank/BIN offers, instant discounts, no-cost EMI | `.agent/skills/cashfree-skills/pg/offers/SKILL.md` |
| Integrate Secure ID (KYC / bank verification) | `.agent/skills/cashfree-skills/secure-id/SKILL.md` |
| Set up Subscriptions / recurring billing | `.agent/skills/cashfree-skills/subscriptions/SKILL.md` |
| Process cross-border / international payments | `.agent/skills/cashfree-skills/cross-border/SKILL.md` |
| Send payouts / disbursements | `.agent/skills/cashfree-skills/payouts/SKILL.md` |
| Understand settlements, reconcile against bank, match UTRs | `.agent/skills/cashfree-skills/settlements-and-reconciliation/SKILL.md` |
| Accept inbound via virtual bank accounts / static VPAs / QR | `.agent/skills/cashfree-skills/auto-collect/SKILL.md` |
| Integrate BBPS COU — fetch and pay bills on behalf of customers | `.agent/skills/cashfree-skills/bbps-cou/SKILL.md` |
| Migrate an existing Razorpay integration to Cashfree | `.agent/skills/cashfree-skills/migrate-from-razorpay/SKILL.md` |
| Migrate an existing Juspay integration to Cashfree | `.agent/skills/cashfree-skills/migrate-from-juspay/SKILL.md` |
| Migrate an existing PayU integration to Cashfree | `.agent/skills/cashfree-skills/migrate-from-payu/SKILL.md` |
| Know what changed / what's breaking between Cashfree SDK or API versions (release notes) | `.agent/skills/cashfree-skills/changelog/SKILL.md` |
| Plan an upgrade between Cashfree SDK or API versions (e.g. `cashfree-pg` 4.x → 6.x, bump `x-api-version`) | `.agent/skills/cashfree-skills/upgrade-advisor/SKILL.md` |
| Record end-of-task progress after a **Cashfree-integration** task (NOT for unrelated UI/refactor/doc work) | `.agent/skills/cashfree-skills/progress-and-skill-feedback/SKILL.md` |
| Security-review or fix vulnerabilities in the payment flow (verify, webhooks, secrets, dependency scan) | `.agent/skills/cashfree-skills/security-review/SKILL.md` |
| Validate or test the integration | `.agent/skills/cashfree-skills/validation-and-testing/SKILL.md` |
| Debug a broken integration, fix errors, troubleshoot | `.agent/skills/cashfree-skills/common-mistakes/SKILL.md` |

### Shared Conventions

- Sandbox base URL: `https://sandbox.cashfree.com`
- Production base URL: `https://api.cashfree.com`
- Always use env vars for `CASHFREE_APP_ID` and `CASHFREE_SECRET_KEY`
- Latest PG API version: `2026-01-01` (v6; `2025-01-01` is the previous version)
