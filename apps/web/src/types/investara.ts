export type LanguageCode = "en" | "zh" | "ja" | "ko";
export type RiskAppetite = "low" | "medium" | "high";
export type InvestorType =
  | "strategic_corporate"
  | "private_equity"
  | "family_office"
  | "development_finance"
  | "government_agency";
export type EntryMode =
  | "joint_venture"
  | "minority_stake"
  | "greenfield"
  | "project_finance"
  | "acquisition";
export type InvestmentTimeline = "0_6_months" | "6_12_months" | "12_24_months";
export type StrategicPriority =
  | "domestic_market"
  | "export_platform"
  | "downstream_resources"
  | "green_transition"
  | "infrastructure_corridor"
  | "partner_ready";

export type Region = {
  id: string;
  name: string;
  coordinates: [number, number];
  population: number;
  workforce: number;
  medianAge: number;
  gdpUsdBillion: number;
  growthRate: number;
  minimumWageUsd: number;
  sectors: string[];
};

export type ProjectSource = {
  provider: string;
  sourceId: string;
  opportunityType: string;
  projectStatus: string;
  year: number | null;
  province: string;
  city: string;
  location: string;
  kbliCode: string;
  imageUrl: string;
  videoUrl: string;
  sourceUrl: string;
  apiUrl: string;
  investmentValueText: string;
  npvText: string;
  irrText: string;
  paybackText: string;
  description: string;
  technicalAspect: string;
  marketAspect: string;
  incentives: Array<{
    name: string;
    description: string;
  }>;
  contacts: Array<{
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  }>;
  gallery: string[];
  documents: string[];
};

export type Infrastructure = {
  portsDistanceKm: number;
  airportDistanceKm: number;
  roadScore: number;
  electricityScore: number;
  internetScore: number;
};

export type Ecosystem = {
  industries: string[];
  zones: string[];
  companies: string[];
};

export type Project = {
  id: string;
  name: string;
  sector: string;
  region: Region;
  investmentSizeUsd: number;
  readinessLevel: number;
  riskLevel: RiskAppetite;
  attractivenessScore: number;
  overview: string;
  coordinates?: [number, number];
  financials: {
    irr: number;
    npvUsd: number;
    paybackYears: number;
  };
  infrastructure: Infrastructure;
  ecosystem: Ecosystem;
  regulatory: {
    permits: string[];
    incentives: string[];
    complexityLevel: "low" | "medium" | "high";
    governmentSupport: string;
  };
  source?: ProjectSource;
};

export type InvestorProfile = {
  investorType: InvestorType;
  originCountry: string;
  sector: string;
  investmentSizeUsd: number;
  riskAppetite: RiskAppetite;
  entryMode: EntryMode;
  timeline: InvestmentTimeline;
  targetIrrPct: number;
  investmentHorizonYears: number;
  minimumReadiness: number;
  preferredRegions: string[];
  strategicPriorities: StrategicPriority[];
};

export type Recommendation = {
  project: Project;
  score: number;
  reasons: string[];
};

export type Partner = {
  id: string;
  name: string;
  regionId: string;
  sectors: string[];
  capabilities: string[];
  matchScore: number;
};

export type InvestorAction = {
  id: string;
  projectId: string;
  title: string;
  type: "shortlist" | "request_intro" | "contact_bkpm" | "diligence";
  status: "open" | "in_progress" | "completed" | "scheduled";
};
