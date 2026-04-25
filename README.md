# Investara

AI Investment Copilot for Nusantara.

Investara helps foreign investors discover, evaluate, and match with Indonesian regional investment opportunities using multilingual AI, investor profiling, recommendation scoring, regional intelligence, and partner introduction workflows.

## Stack
- Frontend: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui
- Backend: FastAPI
- Database: PostgreSQL
- AI: OpenAI API behind FastAPI services
- Map: Leaflet for MVP geospatial views
- Auth: JWT

## Local Setup
```bash
npm install
npm run web:dev
```

The repository root also supports the standard frontend shortcut:

```bash
npm run dev
```

If the same Next.js dev server is already running, `npm run dev` reuses it and prints
the existing localhost URL instead of failing with the Next.js duplicate-server error.

API setup:

```bash
cd apps/api
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
```

Then run from the repository root:

```bash
npm run api:dev
```

Use a second terminal for `npm run api:dev` when testing frontend features that call
`NEXT_PUBLIC_API_BASE_URL`.

PostgreSQL:

```bash
npm run db:up
```

Supabase:

1. Put project values in `.env` and set `DATA_BACKEND=supabase`.
2. Run `infra/supabase/001_init.sql` in the Supabase SQL editor for the target project.
3. Start the API and check the database connection:

```bash
npm run api:dev
curl http://127.0.0.1:8000/api/v1/health/database
```

Supabase API keys allow the backend to read and write data after tables exist. Applying schema
changes remotely still requires the Supabase SQL editor, the database password, or a Supabase
access token for CLI-based migrations.

Quality checks:

```bash
npm run web:lint
npm run web:build
npm run api:lint
npm run api:test
```

## Memory Rule
Before changing project behavior or structure, read `/ai-memory`. After meaningful changes, update `/ai-memory`.
