# Investara Code Rules

## Operating Rules
- Always read `/ai-memory` before changing project behavior or structure.
- Always update `/ai-memory` after meaningful architectural or implementation changes.
- Build incrementally with mock data first.
- Keep backend AI, data, auth, and recommendation logic behind typed service boundaries.
- Do not hardcode secrets. Use `.env` files and keep examples in versioned `.env.example` files.

## Naming
- Use PascalCase for React components and TypeScript types.
- Use camelCase for variables, functions, and object fields in TypeScript.
- Use snake_case for Python modules, functions, database columns, and Pydantic model fields.
- Use kebab-case for route path segments and frontend-only file groups where appropriate.
- Use singular entity names for models: `Project`, `Region`, `Partner`, `InvestorProfile`.

## Structure
- `apps/web`: Next.js App Router application.
- `apps/api`: FastAPI application.
- `packages/shared`: shared schemas or generated API clients when needed.
- `infra`: database, Docker, deployment, and local operations assets.
- `ai-memory`: project memory and architecture notes.

## API Standards
- Prefix backend routes with `/api/v1`.
- Return JSON responses with predictable typed payloads.
- Use explicit Pydantic request and response models.
- Use JWT bearer auth for protected investor actions.
- Keep AI calls server-side only.
- Keep OpenAI prompts versioned in backend service modules.
- Use mock repositories until PostgreSQL persistence is wired.

## Frontend Standards
- Use App Router under `src/app`.
- Prefer Server Components for data-loading shells.
- Push Client Components to interactive islands only.
- Use shadcn/ui primitives before custom controls.
- Use theme tokens for surfaces and text.
- Keep dashboard UI dense, restrained, and decision-oriented.
- Use accessible labels, keyboard-friendly controls, and responsive layouts.
- Run `npm run lint` and `npm run build` in `apps/web` after meaningful frontend changes.
- Keep browser-only libraries such as Leaflet behind client/dynamic boundaries so App Router prerendering stays safe.

## Backend Standards
- Keep `main.py` minimal.
- Organize routes under `app/api/v1`.
- Organize domain schemas under `app/schemas`.
- Organize logic under `app/services`.
- Organize data access under `app/repositories`.
- Keep settings in `app/core/config.py`.
- Route data access through `app/repositories/data_store.py`; do not import Supabase or mock fixtures directly from route modules.
- Keep Supabase service/secret keys server-side only. Frontend may only receive `NEXT_PUBLIC_*` publishable values.
- Add tests around scoring and decision-brief logic as soon as those services are implemented.
- Run `ruff check app tests` and `pytest` in `apps/api` after meaningful backend changes.
