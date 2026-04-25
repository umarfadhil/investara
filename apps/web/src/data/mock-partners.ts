import type { InvestorAction, Partner } from "@/types/investara";

export const partners: Partner[] = [
  {
    id: "partner-kendal-advisory",
    name: "Kendal Industrial Advisory",
    regionId: "central-java",
    sectors: ["Renewable Energy", "Manufacturing"],
    capabilities: ["Site acquisition", "Permitting", "Industrial estate coordination"],
    matchScore: 91,
  },
  {
    id: "partner-semarang-energy",
    name: "Semarang Energy Services",
    regionId: "central-java",
    sectors: ["Renewable Energy", "Industrial Utilities"],
    capabilities: ["Grid interconnection", "EPC partner screening", "Utility approvals"],
    matchScore: 84,
  },
  {
    id: "partner-balikpapan-logistics",
    name: "Balikpapan Logistics Consortium",
    regionId: "east-kalimantan",
    sectors: ["Logistics", "Food Processing"],
    capabilities: ["Cold chain operations", "Port coordination", "Fleet partnerships"],
    matchScore: 87,
  },
];

export const investorActions: InvestorAction[] = [
  {
    id: "action-shortlist",
    projectId: "pir-solar-central-java",
    title: "Saved shortlist",
    type: "shortlist",
    status: "completed",
  },
  {
    id: "action-intro",
    projectId: "pir-solar-central-java",
    title: "Request local partner introduction",
    type: "request_intro",
    status: "open",
  },
  {
    id: "action-bkpm",
    projectId: "pir-solar-central-java",
    title: "Contact BKPM desk",
    type: "contact_bkpm",
    status: "open",
  },
  {
    id: "action-diligence",
    projectId: "pir-solar-central-java",
    title: "Diligence follow-up",
    type: "diligence",
    status: "scheduled",
  },
];

