CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS regions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Indonesia',
  population BIGINT NOT NULL,
  workforce BIGINT NOT NULL,
  median_age NUMERIC(5, 2) NOT NULL,
  gdp_usd_billion NUMERIC(14, 2) NOT NULL,
  growth_rate NUMERIC(5, 2) NOT NULL,
  minimum_wage_usd NUMERIC(12, 2) NOT NULL,
  sectors TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  region_id TEXT NOT NULL REFERENCES regions(id),
  investment_size_usd NUMERIC(16, 2) NOT NULL,
  readiness_level INTEGER NOT NULL CHECK (readiness_level BETWEEN 0 AND 100),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  attractiveness_score INTEGER NOT NULL CHECK (attractiveness_score BETWEEN 0 AND 100),
  overview TEXT NOT NULL,
  irr NUMERIC(6, 2) NOT NULL,
  npv_usd NUMERIC(16, 2) NOT NULL,
  payback_years NUMERIC(6, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_infrastructure (
  project_id TEXT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  ports_distance_km NUMERIC(8, 2) NOT NULL,
  airport_distance_km NUMERIC(8, 2) NOT NULL,
  road_score INTEGER NOT NULL CHECK (road_score BETWEEN 0 AND 100),
  electricity_score INTEGER NOT NULL CHECK (electricity_score BETWEEN 0 AND 100),
  internet_score INTEGER NOT NULL CHECK (internet_score BETWEEN 0 AND 100)
);

CREATE TABLE IF NOT EXISTS project_ecosystems (
  project_id TEXT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  industries TEXT[] NOT NULL DEFAULT '{}',
  zones TEXT[] NOT NULL DEFAULT '{}',
  companies TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS project_regulatory_readiness (
  project_id TEXT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  permits TEXT[] NOT NULL DEFAULT '{}',
  incentives TEXT[] NOT NULL DEFAULT '{}',
  complexity_level TEXT NOT NULL CHECK (complexity_level IN ('low', 'medium', 'high')),
  government_support TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS investor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_type TEXT NOT NULL DEFAULT 'strategic_corporate' CHECK (
    investor_type IN (
      'strategic_corporate',
      'private_equity',
      'family_office',
      'development_finance',
      'government_agency'
    )
  ),
  origin_country TEXT NOT NULL DEFAULT 'Singapore',
  sector TEXT NOT NULL,
  investment_size_usd NUMERIC(16, 2) NOT NULL,
  risk_appetite TEXT NOT NULL CHECK (risk_appetite IN ('low', 'medium', 'high')),
  entry_mode TEXT NOT NULL DEFAULT 'joint_venture' CHECK (
    entry_mode IN (
      'joint_venture',
      'minority_stake',
      'greenfield',
      'project_finance',
      'acquisition'
    )
  ),
  timeline TEXT NOT NULL DEFAULT '6_12_months' CHECK (
    timeline IN ('0_6_months', '6_12_months', '12_24_months')
  ),
  target_irr_pct NUMERIC(5, 2) NOT NULL DEFAULT 15,
  investment_horizon_years INTEGER NOT NULL DEFAULT 7 CHECK (
    investment_horizon_years BETWEEN 1 AND 30
  ),
  minimum_readiness INTEGER NOT NULL DEFAULT 70 CHECK (minimum_readiness BETWEEN 0 AND 100),
  preferred_regions TEXT[] NOT NULL DEFAULT '{}',
  strategic_priorities TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  region_id TEXT NOT NULL REFERENCES regions(id),
  sectors TEXT[] NOT NULL DEFAULT '{}',
  capabilities TEXT[] NOT NULL DEFAULT '{}',
  match_score INTEGER NOT NULL CHECK (match_score BETWEEN 0 AND 100)
);

CREATE TABLE IF NOT EXISTS investor_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL REFERENCES projects(id),
  action_type TEXT NOT NULL CHECK (action_type IN ('shortlist', 'request_intro', 'contact_bkpm', 'diligence')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'scheduled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE investor_profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE investor_actions ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE investor_profiles
  ADD COLUMN IF NOT EXISTS investor_type TEXT NOT NULL DEFAULT 'strategic_corporate',
  ADD COLUMN IF NOT EXISTS origin_country TEXT NOT NULL DEFAULT 'Singapore',
  ADD COLUMN IF NOT EXISTS entry_mode TEXT NOT NULL DEFAULT 'joint_venture',
  ADD COLUMN IF NOT EXISTS timeline TEXT NOT NULL DEFAULT '6_12_months',
  ADD COLUMN IF NOT EXISTS target_irr_pct NUMERIC(5, 2) NOT NULL DEFAULT 15,
  ADD COLUMN IF NOT EXISTS investment_horizon_years INTEGER NOT NULL DEFAULT 7,
  ADD COLUMN IF NOT EXISTS minimum_readiness INTEGER NOT NULL DEFAULT 70,
  ADD COLUMN IF NOT EXISTS strategic_priorities TEXT[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_projects_sector ON projects(sector);
CREATE INDEX IF NOT EXISTS idx_projects_region_id ON projects(region_id);
CREATE INDEX IF NOT EXISTS idx_projects_readiness_level ON projects(readiness_level);
CREATE INDEX IF NOT EXISTS idx_partners_region_id ON partners(region_id);
CREATE INDEX IF NOT EXISTS idx_investor_actions_project_id ON investor_actions(project_id);

INSERT INTO regions (
  id,
  name,
  country,
  population,
  workforce,
  median_age,
  gdp_usd_billion,
  growth_rate,
  minimum_wage_usd,
  sectors
) VALUES
  (
    'central-java',
    'Central Java',
    'Indonesia',
    37180000,
    19900000,
    31.7,
    108.4,
    5.1,
    145,
    ARRAY['Manufacturing', 'Textiles', 'Food Processing', 'Renewable Energy']
  ),
  (
    'east-kalimantan',
    'East Kalimantan',
    'Indonesia',
    4050000,
    2130000,
    29.8,
    54.2,
    6.3,
    220,
    ARRAY['Energy', 'Mining Services', 'Logistics', 'Construction']
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  country = EXCLUDED.country,
  population = EXCLUDED.population,
  workforce = EXCLUDED.workforce,
  median_age = EXCLUDED.median_age,
  gdp_usd_billion = EXCLUDED.gdp_usd_billion,
  growth_rate = EXCLUDED.growth_rate,
  minimum_wage_usd = EXCLUDED.minimum_wage_usd,
  sectors = EXCLUDED.sectors;

INSERT INTO projects (
  id,
  name,
  sector,
  region_id,
  investment_size_usd,
  readiness_level,
  risk_level,
  attractiveness_score,
  overview,
  irr,
  npv_usd,
  payback_years
) VALUES
  (
    'pir-solar-central-java',
    'Central Java Solar Components Park',
    'Renewable Energy',
    'central-java',
    85000000,
    82,
    'medium',
    88,
    'Integrated solar panel component manufacturing park near Semarang industrial corridors.',
    16.8,
    22400000,
    6.2
  ),
  (
    'pir-logistics-east-kalimantan',
    'IKN Regional Cold Chain Hub',
    'Logistics',
    'east-kalimantan',
    52000000,
    74,
    'medium',
    81,
    'Temperature-controlled logistics hub serving the new capital region and eastern Indonesia.',
    14.2,
    13700000,
    7.1
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sector = EXCLUDED.sector,
  region_id = EXCLUDED.region_id,
  investment_size_usd = EXCLUDED.investment_size_usd,
  readiness_level = EXCLUDED.readiness_level,
  risk_level = EXCLUDED.risk_level,
  attractiveness_score = EXCLUDED.attractiveness_score,
  overview = EXCLUDED.overview,
  irr = EXCLUDED.irr,
  npv_usd = EXCLUDED.npv_usd,
  payback_years = EXCLUDED.payback_years;

INSERT INTO project_infrastructure (
  project_id,
  ports_distance_km,
  airport_distance_km,
  road_score,
  electricity_score,
  internet_score
) VALUES
  ('pir-solar-central-java', 24, 18, 87, 82, 78),
  ('pir-logistics-east-kalimantan', 32, 41, 72, 76, 70)
ON CONFLICT (project_id) DO UPDATE SET
  ports_distance_km = EXCLUDED.ports_distance_km,
  airport_distance_km = EXCLUDED.airport_distance_km,
  road_score = EXCLUDED.road_score,
  electricity_score = EXCLUDED.electricity_score,
  internet_score = EXCLUDED.internet_score;

INSERT INTO project_ecosystems (
  project_id,
  industries,
  zones,
  companies
) VALUES
  (
    'pir-solar-central-java',
    ARRAY['Electronics', 'Glass', 'Metal fabrication', 'Industrial logistics'],
    ARRAY['Kendal Industrial Park', 'Semarang Industrial Estate'],
    ARRAY['Polytron', 'Djarum Group', 'Kendal Eco City tenants']
  ),
  (
    'pir-logistics-east-kalimantan',
    ARRAY['Food distribution', 'Construction supply', 'Port logistics'],
    ARRAY['Kariangau Industrial Estate', 'Balikpapan logistics corridor'],
    ARRAY['Pelindo', 'Pertamina logistics network', 'Regional food distributors']
  )
ON CONFLICT (project_id) DO UPDATE SET
  industries = EXCLUDED.industries,
  zones = EXCLUDED.zones,
  companies = EXCLUDED.companies;

INSERT INTO project_regulatory_readiness (
  project_id,
  permits,
  incentives,
  complexity_level,
  government_support
) VALUES
  (
    'pir-solar-central-java',
    ARRAY['Location permit', 'Industrial estate approval', 'Environmental baseline'],
    ARRAY['Tax allowance eligibility', 'Import duty facility'],
    'medium',
    'Provincial one-stop investment desk assigned.'
  ),
  (
    'pir-logistics-east-kalimantan',
    ARRAY['Warehouse permit', 'Cold storage certification'],
    ARRAY['Strategic region facilitation', 'Customs zone discussion'],
    'medium',
    'Regional investment office and IKN-linked facilitation available.'
  )
ON CONFLICT (project_id) DO UPDATE SET
  permits = EXCLUDED.permits,
  incentives = EXCLUDED.incentives,
  complexity_level = EXCLUDED.complexity_level,
  government_support = EXCLUDED.government_support;

INSERT INTO partners (
  id,
  name,
  region_id,
  sectors,
  capabilities,
  match_score
) VALUES
  (
    'partner-kendal-advisory',
    'Kendal Industrial Advisory',
    'central-java',
    ARRAY['Renewable Energy', 'Manufacturing'],
    ARRAY['Site acquisition', 'Permitting', 'Industrial estate coordination'],
    91
  ),
  (
    'partner-balikpapan-logistics',
    'Balikpapan Logistics Consortium',
    'east-kalimantan',
    ARRAY['Logistics', 'Food Processing'],
    ARRAY['Cold chain operations', 'Port coordination', 'Fleet partnerships'],
    87
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  region_id = EXCLUDED.region_id,
  sectors = EXCLUDED.sectors,
  capabilities = EXCLUDED.capabilities,
  match_score = EXCLUDED.match_score;
