export type LanguageCode = "en" | "zh" | "ja" | "ko";
export type RiskAppetite = "low" | "medium" | "high";

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
};

export type InvestorProfile = {
  sector: string;
  investmentSizeUsd: number;
  riskAppetite: RiskAppetite;
  preferredRegions: string[];
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
