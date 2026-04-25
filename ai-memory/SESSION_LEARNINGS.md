# Investara Session Learnings

## Decisions
- The project starts as a monorepo with separate frontend and backend apps.
- Mock data comes first, but route and schema names are production-shaped.
- Leaflet is the initial map implementation for MVP speed and easier local development.
- AI features will be routed through FastAPI so API keys never reach the browser.
- The first screen is an investor decision workspace, not a marketing landing page.
- Next.js uses shadcn/ui with dark-mode dashboard defaults and a pinned Turbopack root.
- FastAPI exposes typed MVP endpoints under `/api/v1` with mock project, partner, action, recommendation, translation, and decision-brief services.
- Next local dev uses `next dev --webpack` because Turbopack dev spawned excessive PostCSS worker processes in this workspace. Production build remains verified.

## Trade-offs
- Collaborative filtering is mocked initially because there is no historical investor behavior dataset yet.
- PostgreSQL schema is planned immediately, but persistence can be staged after the first working mock flow.
- Translation and decision-brief features can return mock output when OpenAI credentials are absent.
- The map route now renders Leaflet with interactive project markers and filters. More advanced cluster layers are still reserved for the map phase.
- Playwright was added as a root dev dependency because `agent-browser` was unavailable in this environment.
- `npm audit --omit=dev` reports a moderate PostCSS advisory through Next's nested `postcss@8.4.31`; `npm audit fix --force` would attempt a breaking downgrade, so it was not applied.

## Improvements To Track
- Add real migrations once the initial backend schemas stabilize.
- Add end-to-end tests for profile to recommendation to decision brief.
- Add region data import pipeline for authoritative BPS/BKPM/regional data sources.
- Add role-based access after basic JWT auth exists.
- Replace duplicated frontend/backend mock data with generated shared fixtures or API-backed loading.
- Implement real OpenAI translation and decision brief calls behind the existing backend service functions.
- Replace the map placeholder with interactive Leaflet clusters, infrastructure layers, and filters.
- Move frontend recommendation scoring to API-backed loading once auth/profile persistence is ready.
- Re-check Next/PostCSS audit status when Next publishes a patched dependency chain.
- Apply `infra/supabase/001_init.sql` to the hosted Supabase project before running the API with `DATA_BACKEND=supabase`.
- Direct remote schema application still needs a Supabase database password or Supabase access token; project API keys only cover REST data access after tables exist.

## Current Session
- Created the required `/ai-memory` folder and initial project memory files.
- Scaffolded `apps/web` with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.
- Added root workspace scripts, Docker Compose PostgreSQL setup, `.env.example`, README, and shared package placeholder.
- Built `apps/api` with FastAPI structure, domain schemas, mock repositories, services, API v1 routes, and a recommendation unit test.
- Built initial frontend routes for workspace, profile, project decision brief, map, and action dashboard.
- Continued the build with:
  - Interactive Leaflet investment map with sector, region, and readiness filters.
  - Investor profile form with live ranked project recommendations and match reasons.
  - Action dashboard with shortlist, request intro, BKPM contact, and diligence state updates.
  - Local partner matching cards and request introduction buttons.
  - Financial and risk charts on the project decision brief.
  - Web dev script switched to `next dev --webpack` to avoid the local Turbopack worker issue.
- Verification completed:
  - `npm run lint` passed in `apps/web`.
  - `npm run build` passed in `apps/web`.
  - `python -m compileall apps/api/app apps/api/tests` passed.
  - `python -m pytest` passed in `apps/api`.
  - `ruff check app tests` passed in `apps/api`.
  - API health check returned `{"status":"ok","service":"investara-api"}`.
  - Browser check confirmed content, key actions, no Next overlay, and no console errors.
  - Browser check after the continued build covered `/`, `/profile`, `/map`, `/dashboard`, and `/projects/pir-solar-central-java`.
  - Leaflet map browser check confirmed map pane rendered with 2 interactive markers.
- Supabase database integration staged:
  - Added `DATA_BACKEND` setting with `mock` and `supabase` modes.
  - Added Supabase REST repository using server-side Supabase keys.
  - Routed projects, regions, partners, investor profiles, actions, recommendations, and decision briefs through the repository selector.
  - Added `/api/v1/health/database` to check the active data backend.
  - Added hosted Supabase SQL setup at `infra/supabase/001_init.sql` with schema, seed data, RLS, and grants.
  - Expanded local `infra/postgres/001_init.sql` to match the Supabase schema without Supabase-only roles.
  - Updated `.env` for project `ooleaipbqhcbicjohsyu`; `.env.example` contains placeholders only.
  - Verified `DATA_BACKEND=mock` project API and database health paths.
  - Verification completed:
    - `npm run api:lint` passed.
    - `npm run api:test` passed.
    - `python -m compileall apps/api/app apps/api/tests` passed.
  - Supabase REST credentials were accepted, but remote `public.projects` is not created yet, so Supabase mode remains blocked until the SQL migration is applied.
- Follow-up dev script improvement:
  - Added root `npm run dev` as an alias for `npm run web:dev`.
  - Documented that `npm run api:dev` should run in a second terminal when testing frontend flows that call the FastAPI backend.
- Follow-up duplicate Next dev server improvement:
  - Replaced the root `npm run dev` alias with `scripts/dev-web.mjs`.
  - The wrapper detects an existing Next dev lock and localhost server on ports 3000-3005, then prints the active URL instead of starting a duplicate server.
  - `npm run web:dev` remains the direct raw Next command for cases where the wrapper is not wanted.
