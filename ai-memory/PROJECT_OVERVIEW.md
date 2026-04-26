# Investara Project Overview

## Vision
Investara is an AI Investment Copilot for Nusantara: a multilingual platform that helps foreign investors discover, evaluate, compare, and act on Indonesian regional investment opportunities.

The product must answer four investor questions clearly:

- Is the project profitable?
- Is the region viable?
- Is the ecosystem strong?
- Is execution feasible?

## Problem
Foreign investors evaluating Indonesian regional investment opportunities face four core gaps:

- Investment project data is scattered across agencies, regions, PDFs, websites, and informal channels.
- Language barriers slow evaluation for English, Chinese, Japanese, and Korean investors.
- Project discovery is weak because investor profile, project fit, size fit, risk appetite, and readiness are rarely matched systematically.
- Regional intelligence is usually disconnected from project dashboards, making decisions harder.

## Users
- Foreign investors and strategic corporate development teams.
- Investment promotion agencies and regional government teams.
- Local partners seeking foreign investment.
- BKPM-style coordination users who need action tracking and introductions.

## Mandatory Features
- Investor discovery landing page that hooks foreign investors into Indonesian opportunities through country narrative, visual Indonesia cues, a functional Discover & Entry profile capture, and a clear journey into profile, recommendations, project briefs, map exploration, partner matching, and action tracking.
- Multilingual portal with English default plus Chinese, Japanese, and Korean support.
- Investor profiling for investor type, origin market, sector, entry mode, investment size, target IRR, investment horizon, decision timeline, risk appetite, readiness floor, strategic priorities, and preferred regions.
- AI recommendation engine combining content-based scoring and mock collaborative filtering.
- Investor Decision Intelligence Dashboard with six sections:
  - Executive Snapshot
  - Financial & Risk Analysis
  - Regional Intelligence
  - Infrastructure & Connectivity
  - Industry Ecosystem
  - Regulatory & Readiness
- Generated Investment Decision Brief covering why invest, why not, ideal investor, final recommendation, and source-aware diligence factors using BKPM PIR fields plus Investara-provided BPS/regional reference snapshots and sector-source evidence where available.
- Geospatial investment map for Indonesia with filters for sector, region, and readiness.
- Partner matching and request introduction flow.
- Investor action flow for shortlist, introductions, BKPM contact, and action tracking.

## MVP Approach
Use mock data first, but keep interfaces compatible with a production backend. The MVP mock project universe is now a generated BKPM PIR snapshot, not hand-authored sample-only data.

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui.
- Backend: FastAPI with typed route modules and service boundaries.
- Database: PostgreSQL schema planned from day one, with Supabase as the hosted production target.
- Supabase integration uses the FastAPI backend as the data access boundary; browser-facing keys stay public-only, while server-side keys stay in `.env`.
- Auth: JWT access tokens.
- AI: OpenAI API adapter behind backend service interfaces.
- Map: Leaflet first for fast MVP delivery, with Mapbox-compatible data structures where useful.
- MVP browser state for language, profile preferences, partner introduction requests, and action progress may use hydration-safe `localStorage` until API-backed persistence is wired.
- BKPM PIR enrichment: `npm run data:sync:bkpm` pulls public PPI, IPRO, and PID opportunity rows from `regionalinvestment.bkpm.go.id`, stores 183 normalized opportunities in generated frontend/API snapshot files, and preserves source URLs/status/contacts/incentives where available.
- Project detail pages must keep first-pass BPS/regional cross-checking inside Investara by showing normalized regional statistics and direct PIR BPS excerpts when present, rather than sending investors to an external BPS page for basic screening.
