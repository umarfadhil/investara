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
            financial-risk-chart.tsx
            investment-map.tsx
            investment-map-client.tsx
            partner-matches.tsx
            profile-recommendation-form.tsx
          ui/
        lib/
          api.ts
          i18n.ts
          recommendations.ts
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
  vercel.json
  package.json
  README.md
```

## Frontend Components
- `src/app/page.tsx`: first-screen investor dashboard experience.
- `src/app/dashboard/page.tsx`: investor action dashboard.
- `src/app/projects/[id]/page.tsx`: decision intelligence dashboard.
- `src/app/map/page.tsx`: geospatial investment map.
- `src/app/profile/page.tsx`: investor profiling workflow.
- `src/components/investara/*`: domain components for project cards, scores, dashboards, briefs, and map controls.
- `src/components/investara/investment-map.tsx`: SSR-safe dynamic wrapper for Leaflet.
- `src/components/investara/investment-map-client.tsx`: interactive Leaflet map with sector, region, and readiness filters.
- `src/components/investara/profile-recommendation-form.tsx`: editable profile and ranked project matches.
- `src/components/investara/action-board.tsx`: shortlist, intro request, BKPM contact, and diligence tracking.
- `src/components/investara/financial-risk-chart.tsx`: Recharts financial and risk visualization.
- `src/components/investara/partner-matches.tsx`: local partner recommendation cards.
- `src/components/ui/*`: shadcn/ui source components.
- `src/lib/api.ts`: backend client.
- `src/lib/i18n.ts`: language metadata and translation helpers.
- `src/lib/recommendations.ts`: frontend mirror of recommendation scoring for mock UX.
- `src/data/mock-projects.ts`: MVP project and investor profile data until API integration is complete.
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
- `projects`: sector, investment_size, location, readiness, financials, risk profile, linked region, infrastructure, ecosystem, regulatory data.
- `regions`: population, workforce, median_age, gdp, growth_rate, minimum_wage, sectors.
- `project_infrastructure`: ports_distance, airport_distance, road_score, electricity_score, internet_score.
- `project_ecosystems`: industries, zones, companies.
- `project_regulatory_readiness`: permits, incentives, complexity_level, government_support.
- `investor_profiles`: sector, investment_size, risk_appetite, preferred_regions.
- `partners`: company profile, region, sector fit, capabilities, contact metadata.
- `actions`: investor workflow events and statuses.

## Integration Direction
- Vercel production deployment targets project `prj_JCvCSeCUxDiobczAjj5i8PGumXJU`.
- Vercel should deploy from the repository root using `vercel.json`, which builds the web workspace with `npm run web:build` and publishes `apps/web/.next`.
- `apps/web` must be tracked by the root Git repository as normal files, not as a nested Git repo or unresolved gitlink/submodule.
- Frontend calls FastAPI directly in local MVP using `NEXT_PUBLIC_API_BASE_URL`.
- Backend reads `DATA_BACKEND`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `JWT_SECRET`, and `OPENAI_API_KEY`.
- `DATA_BACKEND=mock` uses in-memory MVP fixtures; `DATA_BACKEND=supabase` uses `app/repositories/supabase.py` through `app/repositories/data_store.py`.
- PostgreSQL is available locally through Docker Compose.
- Supabase schema and seed SQL lives in `infra/supabase/001_init.sql`; apply it with the Supabase SQL editor, database password, or Supabase access token before using Supabase mode.
- AI services return deterministic mock responses when `OPENAI_API_KEY` is missing.
- Dev servers run locally at `http://localhost:3000` for Next.js and `http://127.0.0.1:8000/api/v1` for FastAPI.
- Local Next dev uses Webpack via `next dev --webpack`; production `next build` still uses the working Next 16 build path.
