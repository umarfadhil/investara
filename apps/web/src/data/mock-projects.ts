import bkpmOpportunityData from "@/data/bkpm-opportunities.generated.json";
import type { InvestorProfile, Project } from "@/types/investara";

type BkpmOpportunitySnapshot = {
  generatedAt: string;
  source: {
    provider: string;
    websiteUrl: string;
    listEndpoint: string;
    idrPerUsd: number;
  };
  counts: Record<string, number>;
  totalProjects: number;
  projects: Project[];
};

export const bkpmOpportunitySnapshot =
  bkpmOpportunityData as unknown as BkpmOpportunitySnapshot;

export const investorProfile: InvestorProfile = {
  investorType: "strategic_corporate",
  originCountry: "Singapore",
  sector: "Renewable Energy",
  investmentSizeUsd: 90000000,
  riskAppetite: "medium",
  entryMode: "joint_venture",
  timeline: "6_12_months",
  targetIrrPct: 15,
  investmentHorizonYears: 7,
  minimumReadiness: 70,
  preferredRegions: ["java", "kalimantan"],
  strategicPriorities: ["green_transition", "export_platform", "partner_ready"],
};

export const projects: Project[] = bkpmOpportunitySnapshot.projects;

export const featuredProject =
  projects.find(
    (project) =>
      project.source?.projectStatus !== "SOLD" &&
      (project.source?.opportunityType === "IPRO" || project.source?.opportunityType === "PPI"),
  ) ?? projects[0];
