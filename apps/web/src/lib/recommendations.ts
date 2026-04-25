import type { InvestorProfile, Project, Recommendation, RiskAppetite } from "@/types/investara";

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

export function rankProjects(profile: InvestorProfile, projects: Project[]): Recommendation[] {
  const preferredRegions = new Set(profile.preferredRegions.map((region) => region.toLowerCase()));

  return projects
    .map((project, index) => {
      const sectorFit = profile.sector.toLowerCase() === project.sector.toLowerCase() ? 100 : 45;
      const ticketFit = sizeFit(profile.investmentSizeUsd, project.investmentSizeUsd);
      const riskMatch = riskFit(profile.riskAppetite, project.riskLevel);
      const regionBonus = preferredRegions.has(project.region.id.toLowerCase()) ? 8 : 0;
      const collaborativeBonus = index === 0 ? 4 : 1;
      const score = Math.min(
        100,
        Math.round(
          sectorFit * 0.32 +
            ticketFit * 0.24 +
            riskMatch * 0.18 +
            project.readinessLevel * 0.18 +
            project.attractivenessScore * 0.08 +
            regionBonus +
            collaborativeBonus,
        ),
      );

      const reasons = [
        `Sector fit: ${sectorFit}/100`,
        `Ticket fit: ${ticketFit}/100`,
        `Risk match: ${riskMatch}/100`,
        `Readiness: ${project.readinessLevel}/100`,
      ];

      if (regionBonus) {
        reasons.push("Preferred region match");
      }

      return { project, score, reasons };
    })
    .sort((a, b) => b.score - a.score);
}

