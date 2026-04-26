# Investara File Map

## Target Architecture
```text
investara/
  ai-memory/
    PROJECT_OVERVIEW.md
    CODE_RULES.md
    FILE_MAP.md
    SESSION_LEARNINGS.md
  apps/
    web/
      components.json
      next.config.ts
      package.json
      src/
        data/
          bkpm-opportunities.generated.json
          mock-projects.ts
        app/
          page.tsx
          dashboard/page.tsx
          map/page.tsx
          profile/page.tsx
          projects/[id]/page.tsx
        components/
          investara/
            action-board.tsx
            discover-entry-panel.tsx
            financial-risk-chart.tsx
            investment-map.tsx
            investment-map-client.tsx
            language-provider.tsx
            partner-matches.tsx
            profile-recommendation-form.tsx
            theme-toggle.tsx
          ui/
        lib/
          api.ts
          bps-reference.ts
          i18n.ts
          investor-profile.ts
          recommendations.ts
          use-local-storage-state.ts
        types/
          investara.ts
      public/
    api/
      pyproject.toml
      app/
        api/v1/
        core/
        db/
        models/
        repositories/
          bkpm_opportunities.generated.json
          data_store.py
          mock_data.py
          supabase.py
        schemas/
        services/
      tests/
  packages/
    shared/
  infra/
    postgres/
      001_init.sql
    supabase/
      001_init.sql
  docker-compose.yml
  scripts/
    sync-bkpm-opportunities.mjs
  vercel.json
  package.json
  README.md
```

## Frontend Components
- `src/app/page.tsx`: investor discovery landing page with Indonesia visual narrative, seven-step journey, opportunity preview, functional Discover & Entry handoff, and action CTAs.
- `src/app/dashboard/page.tsx`: investor action dashboard.
- `src/app/projects/[id]/page.tsx`: decision intelligence dashboard.
- `src/app/map/page.tsx`: geospatial investment map.
- `src/app/profile/page.tsx`: investor profiling workflow.
- `src/components/investara/*`: domain components for project cards, scores, dashboards, briefs, and map controls.
- `src/components/investara/investment-map.tsx`: SSR-safe dynamic wrapper for Leaflet.
- `src/components/investara/investment-map-client.tsx`: interactive Leaflet map with sector, region, readiness filters, a fixed-height scroll-contained opportunity rail, empty-state reset, and project brief links.
- `src/components/investara/language-provider.tsx`: app-level client language state and persisted language preference.
- `src/components/investara/discover-entry-panel.tsx`: landing-page entry workflow that captures core investor intent, persists the shared profile locally, previews the top match, and routes into `/profile`.
- `src/components/investara/profile-recommendation-form.tsx`: editable enriched profile, strategic priority and preferred region toggles, local profile persistence, profile summary, and ranked project matches.
- `src/components/investara/action-board.tsx`: persisted shortlist, intro request, BKPM contact, and diligence tracking.
- `src/components/investara/financial-risk-chart.tsx`: Recharts financial and risk visualization.
- `src/components/investara/partner-matches.tsx`: local partner recommendation cards.
- `src/components/investara/theme-toggle.tsx`: client display-mode segmented control for persisted light/dark theme switching.
- `src/components/ui/*`: shadcn/ui source components.
- `src/lib/api.ts`: backend client.
- `src/lib/bps-reference.ts`: Investara-provided project-page BPS/regional reference builder that summarizes normalized population, workforce, GRDP proxy, wage, sector, snapshot freshness, and any direct BPS excerpts from PIR source text.
- `src/lib/decision-brief.ts`: source-aware project decision-brief builder that turns BKPM PIR project fields, regional metadata, detected BPS/sector references, evidence snippets, and diligence prompts into the `/projects/[id]` brief sections.
- `src/lib/i18n.ts`: language metadata and UI translation helpers for English, Chinese, Japanese, and Korean.
- `src/lib/investor-profile.ts`: shared frontend profile storage key, option lists, label helpers, and backwards-compatible local profile parser.
- `src/lib/recommendations.ts`: frontend mirror of recommendation scoring for mock UX.
- `src/lib/use-local-storage-state.ts`: hydration-safe localStorage-backed state hook for MVP client persistence.
- `src/data/bkpm-opportunities.generated.json`: generated BKPM PIR opportunity snapshot used by the MVP frontend.
- `src/data/mock-projects.ts`: typed frontend export over the generated BKPM PIR snapshot plus the default investor profile.
- `src/data/mock-partners.ts`: local partner and action-flow mock data.

## Backend APIs
- `GET /api/v1/health`: service health.
- `GET /api/v1/health/database`: active data backend health check.
- `POST /api/v1/auth/login`: mock JWT login for MVP.
- `GET /api/v1/projects`: list and filter projects.
- `GET /api/v1/projects/{project_id}`: project detail.
- `POST /api/v1/investor-profiles`: create/update investor profile.
- `POST /api/v1/investor-profiles/recommendations`: ranked project recommendations from profile payload.
- `POST /api/v1/projects/recommendations`: alternate ranked project recommendations endpoint.
- `POST /api/v1/ai/translate`: AI translation endpoint.
- `POST /api/v1/ai/decision-brief`: AI investment decision brief.
- `GET /api/v1/regions/{region_id}`: regional intelligence.
- `GET /api/v1/partners`: local partner recommendations.
- `POST /api/v1/actions`: shortlist, introduction, BKPM contact, and tracking actions.

## Data Model
- `projects`: sector, investment_size, location, readiness, financials, risk profile, linked region, infrastructure, ecosystem, regulatory data, optional project coordinates, and optional BKPM PIR source metadata.
- `regions`: population, workforce, median_age, gdp, growth_rate, minimum_wage, sectors.
- `project_infrastructure`: ports_distance, airport_distance, road_score, electricity_score, internet_score.
- `project_ecosystems`: industries, zones, companies.
- `project_regulatory_readiness`: permits, incentives, complexity_level, government_support.
- `investor_profiles`: investor_type, origin_country, sector, investment_size, risk_appetite, entry_mode, timeline, target_irr_pct, investment_horizon_years, minimum_readiness, preferred_regions, strategic_priorities.
- `partners`: company profile, region, sector fit, capabilities, contact metadata.
- `actions`: investor workflow events and statuses, including diligence tracking and scheduled statuses.

## Integration Direction
- Vercel production deployment targets project `prj_JCvCSeCUxDiobczAjj5i8PGumXJU`.
- Vercel should deploy from the repository root using `vercel.json`, which installs with optional dependencies, builds the web workspace with `npm run web:build`, and publishes `apps/web/.next`.
- The root `package.json` intentionally includes pinned `next`, `react`, and `react-dom` dev dependencies for Vercel framework/version detection; `apps/web/package.json` remains the actual web app manifest.
- The root `package.json` also includes `@tailwindcss/oxide-linux-x64-gnu` and `lightningcss-linux-x64-gnu` as optional dependencies because the root lockfile is maintained on Windows but Vercel builds on Linux.
- `apps/web` must be tracked by the root Git repository as normal files, not as a nested Git repo or unresolved gitlink/submodule.
- Frontend calls FastAPI directly in local MVP using `NEXT_PUBLIC_API_BASE_URL`.
- Backend reads `DATA_BACKEND`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `JWT_SECRET`, and `OPENAI_API_KEY`.
- `DATA_BACKEND=mock` uses in-memory MVP fixtures; `DATA_BACKEND=supabase` uses `app/repositories/supabase.py` through `app/repositories/data_store.py`.
- PostgreSQL is available locally through Docker Compose.
- Supabase schema and seed SQL lives in `infra/supabase/001_init.sql`; apply it with the Supabase SQL editor, database password, or Supabase access token before using Supabase mode.
- AI services return deterministic mock responses when `OPENAI_API_KEY` is missing.
- Dev servers run locally at `http://localhost:3000` for Next.js and `http://127.0.0.1:8000/api/v1` for FastAPI.
- Local Next dev uses Webpack via `next dev --webpack`; production `next build` still uses the working Next 16 build path.
- `npm run data:sync:bkpm` refreshes generated BKPM PIR snapshots for frontend and API mock repositories from `https://regionalinvestment.bkpm.go.id/be/peluang/peluang_investasi_wilayah`.
