import type {
  EntryMode,
  InvestorProfile,
  Project,
  Recommendation,
  RiskAppetite,
  StrategicPriority,
} from "@/types/investara";
import { getRegionGroupForRegionId, normalizeRegionPreferences } from "@/lib/investor-profile";

const riskRank: Record<RiskAppetite, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

function sizeFit(profileSize: number, projectSize: number) {
  if (profileSize <= 0) {
    return 0;
  }

  return Math.round((Math.min(profileSize, projectSize) / Math.max(profileSize, projectSize)) * 100);
}

function riskFit(profileRisk: RiskAppetite, projectRisk: RiskAppetite) {
  const distance = Math.abs(riskRank[profileRisk] - riskRank[projectRisk]);
  return Math.max(0, 100 - distance * 35);
}

function targetIrrFit(targetIrrPct: number, projectIrr: number) {
  if (targetIrrPct <= 0) {
    return 75;
  }

  if (projectIrr >= targetIrrPct) {
    return 100;
  }

  return Math.max(0, Math.round(100 - (targetIrrPct - projectIrr) * 8));
}

function readinessFit(minimumReadiness: number, projectReadiness: number) {
  if (minimumReadiness <= 0) {
    return projectReadiness;
  }

  if (projectReadiness >= minimumReadiness) {
    return 100;
  }

  return Math.max(0, 100 - (minimumReadiness - projectReadiness) * 4);
}

const projectPrioritySignals: Record<string, StrategicPriority[]> = {
  "pir-solar-central-java": [
    "domestic_market",
    "export_platform",
    "green_transition",
    "partner_ready",
  ],
  "pir-logistics-east-kalimantan": [
    "domestic_market",
    "downstream_resources",
    "infrastructure_corridor",
    "partner_ready",
  ],
};

const entryModeSignals: Record<string, EntryMode[]> = {
  "pir-solar-central-java": ["joint_venture", "greenfield", "project_finance"],
  "pir-logistics-east-kalimantan": ["joint_venture", "project_finance", "minority_stake"],
};

function inferPrioritySignals(project: Project) {
  const text = [
    project.name,
    project.sector,
    project.overview,
    project.source?.opportunityType,
    project.source?.projectStatus,
    project.source?.description,
  ]
    .join(" ")
    .toLowerCase();
  const signals = new Set<StrategicPriority>(["domestic_market"]);

  if (
    text.includes("export") ||
    text.includes("industrial") ||
    text.includes("industri") ||
    text.includes("port") ||
    text.includes("pelabuhan")
  ) {
    signals.add("export_platform");
  }
  if (
    text.includes("hilirisasi") ||
    text.includes("smelter") ||
    text.includes("pengolahan") ||
    text.includes("mining") ||
    text.includes("natural resources")
  ) {
    signals.add("downstream_resources");
  }
  if (
    text.includes("renewable") ||
    text.includes("green") ||
    text.includes("eco") ||
    text.includes("battery") ||
    text.includes("baterai") ||
    text.includes("waste") ||
    text.includes("sampah")
  ) {
    signals.add("green_transition");
  }
  if (
    text.includes("logistics") ||
    text.includes("transport") ||
    text.includes("infrastructure") ||
    text.includes("kawasan") ||
    text.includes("hub")
  ) {
    signals.add("infrastructure_corridor");
  }
  if (project.source?.projectStatus || project.source?.contacts?.length) {
    signals.add("partner_ready");
  }

  return signals;
}

function inferEntryModeSignals(project: Project) {
  const signals = new Set<EntryMode>(entryModeSignals[project.id] ?? []);
  const text = [project.source?.opportunityType, project.source?.projectStatus, project.sector]
    .join(" ")
    .toLowerCase();

  if (text.includes("ipro") || text.includes("re/publish")) {
    signals.add("project_finance");
    signals.add("joint_venture");
  }
  if (project.investmentSizeUsd > 250_000_000) {
    signals.add("project_finance");
    signals.add("minority_stake");
  }
  if (project.sector.toLowerCase().includes("industrial")) {
    signals.add("greenfield");
  }

  return signals;
}

function strategicFit(profilePriorities: StrategicPriority[], project: Project) {
  if (!profilePriorities.length) {
    return 70;
  }

  const projectSignals = inferPrioritySignals(project);
  (projectPrioritySignals[project.id] ?? []).forEach((priority) => projectSignals.add(priority));
  const matches = profilePriorities.filter((priority) => projectSignals.has(priority)).length;

  return Math.round((matches / profilePriorities.length) * 100);
}

export function rankProjects(profile: InvestorProfile, projects: Project[]): Recommendation[] {
  const preferredRegions = new Set(normalizeRegionPreferences(profile.preferredRegions));

  return projects
    .map((project, index) => {
      const sectorFit = profile.sector.toLowerCase() === project.sector.toLowerCase() ? 100 : 45;
      const ticketFit = sizeFit(profile.investmentSizeUsd, project.investmentSizeUsd);
      const riskMatch = riskFit(profile.riskAppetite, project.riskLevel);
      const targetReturnFit = targetIrrFit(profile.targetIrrPct, project.financials.irr);
      const readinessPreferenceFit = readinessFit(profile.minimumReadiness, project.readinessLevel);
      const strategicPriorityFit = strategicFit(profile.strategicPriorities, project);
      const projectRegionId = project.region.id.toLowerCase();
      const projectRegionGroup = getRegionGroupForRegionId(projectRegionId);
      const regionBonus =
        preferredRegions.has(projectRegionId) ||
        (projectRegionGroup ? preferredRegions.has(projectRegionGroup) : false)
          ? 6
          : 0;
      const entryModeBonus = inferEntryModeSignals(project).has(profile.entryMode) ? 3 : 0;
      const collaborativeBonus = index === 0 ? 4 : 1;
      const score = Math.min(
        100,
        Math.round(
          sectorFit * 0.24 +
            ticketFit * 0.18 +
            riskMatch * 0.14 +
            readinessPreferenceFit * 0.16 +
            targetReturnFit * 0.12 +
            strategicPriorityFit * 0.1 +
            project.attractivenessScore * 0.06 +
            regionBonus +
            entryModeBonus +
            collaborativeBonus,
        ),
      );

      const reasons = [
        `Sector alignment: ${sectorFit}/100`,
        `Ticket-size fit: ${ticketFit}/100`,
        `Risk match: ${riskMatch}/100`,
        `Readiness threshold: ${readinessPreferenceFit}/100`,
        `Target IRR fit: ${targetReturnFit}/100`,
        `Strategic priorities: ${strategicPriorityFit}/100`,
      ];

      if (regionBonus) {
        reasons.push("Preferred region match");
      }
      if (entryModeBonus) {
        reasons.push("Preferred entry mode match");
      }

      return { project, score, reasons };
    })
    .sort((a, b) => b.score - a.score);
}
