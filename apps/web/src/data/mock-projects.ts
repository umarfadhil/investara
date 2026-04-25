import type { InvestorProfile, Project } from "@/types/investara";

export const investorProfile: InvestorProfile = {
  sector: "Renewable Energy",
  investmentSizeUsd: 90000000,
  riskAppetite: "medium",
  preferredRegions: ["central-java"],
};

export const projects: Project[] = [
  {
    id: "pir-solar-central-java",
    name: "Central Java Solar Components Park",
    sector: "Renewable Energy",
    investmentSizeUsd: 85000000,
    readinessLevel: 82,
    riskLevel: "medium",
    attractivenessScore: 88,
    overview:
      "Integrated solar panel component manufacturing park near Semarang industrial corridors.",
    financials: {
      irr: 16.8,
      npvUsd: 22400000,
      paybackYears: 6.2,
    },
    region: {
      id: "central-java",
      name: "Central Java",
      coordinates: [-7.15, 110.14],
      population: 37180000,
      workforce: 19900000,
      medianAge: 31.7,
      gdpUsdBillion: 108.4,
      growthRate: 5.1,
      minimumWageUsd: 145,
      sectors: ["Manufacturing", "Textiles", "Food Processing", "Renewable Energy"],
    },
    infrastructure: {
      portsDistanceKm: 24,
      airportDistanceKm: 18,
      roadScore: 87,
      electricityScore: 82,
      internetScore: 78,
    },
    ecosystem: {
      industries: ["Electronics", "Glass", "Metal fabrication", "Industrial logistics"],
      zones: ["Kendal Industrial Park", "Semarang Industrial Estate"],
      companies: ["Polytron", "Djarum Group", "Kendal Eco City tenants"],
    },
    regulatory: {
      permits: ["Location permit", "Industrial estate approval", "Environmental baseline"],
      incentives: ["Tax allowance eligibility", "Import duty facility"],
      complexityLevel: "medium",
      governmentSupport: "Provincial one-stop investment desk assigned.",
    },
  },
  {
    id: "pir-logistics-east-kalimantan",
    name: "IKN Regional Cold Chain Hub",
    sector: "Logistics",
    investmentSizeUsd: 52000000,
    readinessLevel: 74,
    riskLevel: "medium",
    attractivenessScore: 81,
    overview:
      "Temperature-controlled logistics hub serving the new capital region and eastern Indonesia.",
    financials: {
      irr: 14.2,
      npvUsd: 13700000,
      paybackYears: 7.1,
    },
    region: {
      id: "east-kalimantan",
      name: "East Kalimantan",
      coordinates: [-0.5, 117.15],
      population: 4050000,
      workforce: 2130000,
      medianAge: 29.8,
      gdpUsdBillion: 54.2,
      growthRate: 6.3,
      minimumWageUsd: 220,
      sectors: ["Energy", "Mining Services", "Logistics", "Construction"],
    },
    infrastructure: {
      portsDistanceKm: 32,
      airportDistanceKm: 41,
      roadScore: 72,
      electricityScore: 76,
      internetScore: 70,
    },
    ecosystem: {
      industries: ["Food distribution", "Construction supply", "Port logistics"],
      zones: ["Kariangau Industrial Estate", "Balikpapan logistics corridor"],
      companies: ["Pelindo", "Pertamina logistics network", "Regional food distributors"],
    },
    regulatory: {
      permits: ["Warehouse permit", "Cold storage certification"],
      incentives: ["Strategic region facilitation", "Customs zone discussion"],
      complexityLevel: "medium",
      governmentSupport: "Regional investment office and IKN-linked facilitation available.",
    },
  },
];

export const featuredProject = projects[0];
