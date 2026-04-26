import type {
  EntryMode,
  InvestmentTimeline,
  InvestorProfile,
  InvestorType,
  RiskAppetite,
  StrategicPriority,
} from "@/types/investara";

export const profileStorageKey = "investara-profile";

export const investorTypeOptions: Array<{
  value: InvestorType;
  label: string;
  description: string;
}> = [
  {
    value: "strategic_corporate",
    label: "Strategic corporate",
    description: "Operating company looking for supply chain, market, or capability expansion.",
  },
  {
    value: "private_equity",
    label: "Private equity / fund",
    description: "Fund investor screening return profile, governance, and exit path.",
  },
  {
    value: "family_office",
    label: "Family office",
    description: "Longer-horizon capital seeking resilient local partners and controlled risk.",
  },
  {
    value: "development_finance",
    label: "Development finance",
    description: "Impact-oriented investor balancing commercial and development outcomes.",
  },
  {
    value: "government_agency",
    label: "Government / IPA",
    description: "Promotion or coordination user preparing investor introductions.",
  },
];

export const originCountryOptions = [
  "Singapore",
  "Japan",
  "China",
  "South Korea",
  "United States",
  "Australia",
  "United Arab Emirates",
  "Other",
];

export const sectorOptions = [
  "Renewable Energy",
  "Manufacturing",
  "Industrial Estate & Real Estate",
  "Tourism",
  "Transport & Logistics",
  "Infrastructure",
  "Agriculture",
  "Agro-industry",
  "Fisheries",
  "Energy",
  "Natural Resources",
  "Construction",
  "Trade",
  "Services & Regions",
  "Logistics",
];

export const regionGroupOptions = [
  {
    value: "sumatera",
    label: "Sumatera",
    provinceIds: [
      "aceh",
      "sumatera-utara",
      "sumatera-barat",
      "riau",
      "jambi",
      "sumatera-selatan",
      "bengkulu",
      "lampung",
      "kepulauan-bangka-belitung",
      "kepulauan-riau",
    ],
  },
  {
    value: "java",
    label: "Java",
    provinceIds: [
      "dki-jakarta",
      "jawa-barat",
      "jawa-tengah",
      "daerah-istimewa-yogyakarta",
      "jawa-timur",
      "banten",
      "central-java",
      "east-java",
      "west-java",
      "jakarta",
      "yogyakarta",
    ],
  },
  {
    value: "kalimantan",
    label: "Kalimantan",
    provinceIds: [
      "kalimantan-barat",
      "kalimantan-tengah",
      "kalimantan-selatan",
      "kalimantan-timur",
      "kalimantan-utara",
      "east-kalimantan",
      "west-kalimantan",
      "central-kalimantan",
      "south-kalimantan",
      "north-kalimantan",
    ],
  },
  {
    value: "sulawesi",
    label: "Sulawesi",
    provinceIds: [
      "sulawesi-utara",
      "sulawesi-tengah",
      "sulawesi-selatan",
      "sulawesi-tenggara",
      "gorontalo",
      "sulawesi-barat",
    ],
  },
  {
    value: "bali-nusa-tenggara",
    label: "Bali & Nusa Tenggara",
    provinceIds: ["bali", "nusa-tenggara-barat", "nusa-tenggara-timur"],
  },
  {
    value: "maluku-papua",
    label: "Maluku & Papua",
    provinceIds: [
      "maluku",
      "maluku-utara",
      "papua",
      "papua-barat",
      "papua-selatan",
      "papua-tengah",
      "papua-pegunungan",
      "papua-barat-daya",
    ],
  },
] as const;

export type RegionGroupId = (typeof regionGroupOptions)[number]["value"];

const regionGroupValues = new Set<string>(regionGroupOptions.map((option) => option.value));
const regionGroupByProvinceId = regionGroupOptions.reduce<Record<string, RegionGroupId>>(
  (groups, option) => {
    option.provinceIds.forEach((provinceId) => {
      groups[provinceId] = option.value;
    });

    return groups;
  },
  {},
);

export const riskOptions: Array<{ value: RiskAppetite; label: string; description: string }> = [
  { value: "low", label: "Low", description: "Prioritize proven projects and lower execution risk." },
  { value: "medium", label: "Medium", description: "Balance project readiness, return, and execution risk." },
  { value: "high", label: "High", description: "Accept earlier-stage projects for higher potential upside." },
];

export const entryModeOptions: Array<{ value: EntryMode; label: string; description: string }> = [
  {
    value: "joint_venture",
    label: "Joint venture",
    description: "Enter with a local operating or government-linked partner.",
  },
  {
    value: "minority_stake",
    label: "Minority stake",
    description: "Take a financial or strategic position without operating control.",
  },
  {
    value: "greenfield",
    label: "Greenfield build",
    description: "Build new capacity, site, or facility from the ground up.",
  },
  {
    value: "project_finance",
    label: "Project finance",
    description: "Finance a specific asset with cash-flow based diligence.",
  },
  {
    value: "acquisition",
    label: "Acquisition",
    description: "Buy or consolidate an existing asset or operating company.",
  },
];

export const timelineOptions: Array<{
  value: InvestmentTimeline;
  label: string;
  description: string;
}> = [
  { value: "0_6_months", label: "0-6 months", description: "Need a ready shortlist quickly." },
  { value: "6_12_months", label: "6-12 months", description: "Enough time for diligence and partner setup." },
  { value: "12_24_months", label: "12-24 months", description: "Can evaluate earlier-stage regional opportunities." },
];

export const strategicPriorityOptions: Array<{
  value: StrategicPriority;
  label: string;
  description: string;
}> = [
  {
    value: "domestic_market",
    label: "Domestic demand",
    description: "Serve Indonesia's local market growth.",
  },
  {
    value: "export_platform",
    label: "Export platform",
    description: "Use Indonesia as a regional production or distribution base.",
  },
  {
    value: "downstream_resources",
    label: "Downstream resources",
    description: "Link natural resources to higher-value processing.",
  },
  {
    value: "green_transition",
    label: "Green transition",
    description: "Prioritize renewable energy, efficiency, or climate-aligned assets.",
  },
  {
    value: "infrastructure_corridor",
    label: "Infrastructure corridor",
    description: "Focus on ports, roads, logistics, and connectivity advantages.",
  },
  {
    value: "partner_ready",
    label: "Partner ready",
    description: "Need credible local partners and facilitation support.",
  },
];

const investorTypeValues = new Set(investorTypeOptions.map((option) => option.value));
const sectorValues = new Set(sectorOptions);
const riskValues = new Set(riskOptions.map((option) => option.value));
const entryModeValues = new Set(entryModeOptions.map((option) => option.value));
const timelineValues = new Set(timelineOptions.map((option) => option.value));
const priorityValues = new Set(strategicPriorityOptions.map((option) => option.value));

export function getOptionLabel<TValue extends string>(
  options: Array<{ value: TValue; label: string }>,
  value: TValue,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function getRegionGroupForRegionId(regionId: string): RegionGroupId | null {
  const normalizedRegionId = regionId.trim().toLowerCase();

  if (regionGroupValues.has(normalizedRegionId)) {
    return normalizedRegionId as RegionGroupId;
  }

  return regionGroupByProvinceId[normalizedRegionId] ?? null;
}

export function normalizeRegionPreferences(regions: string[]) {
  const normalizedRegions = new Set<string>();

  regions.forEach((region) => {
    const normalizedRegion = region.trim().toLowerCase();

    if (!normalizedRegion) {
      return;
    }

    normalizedRegions.add(getRegionGroupForRegionId(normalizedRegion) ?? normalizedRegion);
  });

  return [...normalizedRegions];
}

export function parseInvestorProfile(value: unknown, fallback: InvestorProfile): InvestorProfile {
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const parsedProfile = value as Partial<InvestorProfile>;
  const investmentSizeUsd = Number(parsedProfile.investmentSizeUsd);
  const targetIrrPct = Number(parsedProfile.targetIrrPct);
  const investmentHorizonYears = Number(parsedProfile.investmentHorizonYears);
  const minimumReadiness = Number(parsedProfile.minimumReadiness);

  return {
    ...fallback,
    ...parsedProfile,
    investorType: investorTypeValues.has(parsedProfile.investorType ?? fallback.investorType)
      ? (parsedProfile.investorType ?? fallback.investorType)
      : fallback.investorType,
    originCountry:
      typeof parsedProfile.originCountry === "string" && parsedProfile.originCountry.trim()
        ? parsedProfile.originCountry.trim()
        : fallback.originCountry,
    sector: sectorValues.has(parsedProfile.sector ?? fallback.sector)
      ? (parsedProfile.sector ?? fallback.sector)
      : fallback.sector,
    investmentSizeUsd: Number.isFinite(investmentSizeUsd)
      ? Math.max(0, investmentSizeUsd)
      : fallback.investmentSizeUsd,
    riskAppetite: riskValues.has(parsedProfile.riskAppetite ?? fallback.riskAppetite)
      ? (parsedProfile.riskAppetite ?? fallback.riskAppetite)
      : fallback.riskAppetite,
    entryMode: entryModeValues.has(parsedProfile.entryMode ?? fallback.entryMode)
      ? (parsedProfile.entryMode ?? fallback.entryMode)
      : fallback.entryMode,
    timeline: timelineValues.has(parsedProfile.timeline ?? fallback.timeline)
      ? (parsedProfile.timeline ?? fallback.timeline)
      : fallback.timeline,
    targetIrrPct: Number.isFinite(targetIrrPct)
      ? Math.max(0, targetIrrPct)
      : fallback.targetIrrPct,
    investmentHorizonYears: Number.isFinite(investmentHorizonYears)
      ? Math.max(1, Math.round(investmentHorizonYears))
      : fallback.investmentHorizonYears,
    minimumReadiness: Number.isFinite(minimumReadiness)
      ? Math.min(100, Math.max(0, Math.round(minimumReadiness)))
      : fallback.minimumReadiness,
    preferredRegions: normalizeRegionPreferences(
      Array.isArray(parsedProfile.preferredRegions)
        ? parsedProfile.preferredRegions.filter((region): region is string => typeof region === "string")
        : fallback.preferredRegions,
    ),
    strategicPriorities: Array.isArray(parsedProfile.strategicPriorities)
      ? parsedProfile.strategicPriorities.filter((priority): priority is StrategicPriority =>
          priorityValues.has(priority as StrategicPriority),
        )
      : fallback.strategicPriorities,
  };
}
