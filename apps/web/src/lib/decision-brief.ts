import type { Project } from "@/types/investara";

export type DecisionBriefFactorId =
  | "financial"
  | "regional"
  | "infrastructure"
  | "ecosystem"
  | "regulatory"
  | "recommendation";

export type DecisionBriefSummaryItem = {
  label: string;
  value: string;
  detail: string;
};

export type DecisionBriefFactor = {
  id: DecisionBriefFactorId;
  title: string;
  metric: string;
  insight: string;
  evidence: string[];
  diligenceFocus: string;
  sources: string[];
};

export type ProjectDecisionBrief = {
  summary: DecisionBriefSummaryItem[];
  factors: DecisionBriefFactor[];
  primarySources: string[];
  sourceNote: string;
};

const numberFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 0,
});

const compactNumberFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1,
  notation: "compact",
});

const usdFormatter = new Intl.NumberFormat("en", {
  currency: "USD",
  maximumFractionDigits: 1,
  notation: "compact",
  style: "currency",
});

const INVESTARA_BPS_REFERENCE = "Investara BPS reference";

const sourcePatterns = [
  { label: "BPS cited in PIR source", pattern: /\bBPS\b|Badan Pusat Statistik/i },
  { label: "KKP cited in source", pattern: /\bKKP\b|Kementerian Kelautan/i },
  { label: "PLN cited in source", pattern: /\bPLN\b/i },
  { label: "PDAM cited in source", pattern: /\bPDAM\b/i },
  { label: "RTRW cited in source", pattern: /\bRTRW\b/i },
  { label: "Ministry cited in source", pattern: /Kementerian/i },
];

const regionalKeywords = [
  "bps",
  "badan pusat statistik",
  "penduduk",
  "population",
  "angkatan kerja",
  "workforce",
  "pdrb",
  "produksi",
  "konsumsi",
  "ekspor",
  "impor",
  "demand",
];

const infrastructureKeywords = [
  "akses",
  "aksesibilitas",
  "bandara",
  "bts",
  "dermaga",
  "internet",
  "jalan",
  "jetty",
  "kawasan",
  "listrik",
  "pelabuhan",
  "pln",
  "pdam",
  "transportasi",
  "utility",
];

const ecosystemKeywords = [
  "bahan baku",
  "ekspor",
  "hilir",
  "industri",
  "konsumsi",
  "market",
  "pasar",
  "permintaan",
  "produksi",
  "rantai pasok",
  "supply",
];

function cleanSourceText(value: string | null | undefined): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function truncateAtWord(value: string, maxLength = 260): string {
  const cleaned = cleanSourceText(value);
  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  const slice = cleaned.slice(0, maxLength - 3).trimEnd();
  return `${slice.replace(/\s+\S*$/, "")}...`;
}

function splitSentences(value: string): string[] {
  const cleaned = cleanSourceText(value);
  if (!cleaned) {
    return [];
  }

  return (cleaned.match(/[^.!?]+(?:[.!?]+|$)/g) ?? [cleaned])
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function containsKeyword(value: string, keywords: string[]): boolean {
  const lowerValue = value.toLowerCase();
  return keywords.some((keyword) => lowerValue.includes(keyword.toLowerCase()));
}

function collectSourceTexts(project: Project): string[] {
  const source = project.source;
  const incentives =
    source?.incentives.flatMap((item) => [item.name, item.description]) ?? [];

  return [
    project.overview,
    source?.description,
    source?.technicalAspect,
    source?.marketAspect,
    ...incentives,
  ].filter((value): value is string => Boolean(cleanSourceText(value)));
}

function pickSourceSentence(texts: string[], keywords: string[]): string {
  for (const text of texts) {
    const match = splitSentences(text).find((sentence) =>
      containsKeyword(sentence, keywords),
    );
    if (match) {
      return truncateAtWord(match);
    }
  }

  const fallback = texts
    .flatMap((text) => splitSentences(text))
    .find((sentence) => sentence.length > 40);

  return fallback ? truncateAtWord(fallback) : "";
}

function sourceSignals(project: Project, texts: string[], extra: string[] = []): string[] {
  const labels = new Set<string>();
  labels.add(project.source?.provider || "Investara dataset");

  for (const { label, pattern } of sourcePatterns) {
    if (texts.some((text) => pattern.test(text))) {
      labels.add(label);
    }
  }

  for (const label of extra) {
    if (label) {
      labels.add(label);
    }
  }

  return [...labels].slice(0, 5);
}

function uniqueLabels(labels: string[]): string[] {
  return [...new Set(labels.filter(Boolean))];
}

function hasBpsCitation(texts: string[]): boolean {
  return texts.some((text) => /\bBPS\b|Badan Pusat Statistik/i.test(text));
}

function formatUsd(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return "Not disclosed";
  }

  return usdFormatter.format(value);
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return "Not available";
  }

  return numberFormatter.format(value);
}

function formatCompactNumber(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return "Regional data";
  }

  return compactNumberFormatter.format(value);
}

function titleCase(value: string): string {
  return value
    .split("_")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function validContactCount(project: Project): number {
  return (
    project.source?.contacts.filter((contact) =>
      [contact.name, contact.address, contact.phone, contact.email, contact.website].some(
        (value) => {
          const cleaned = cleanSourceText(value);
          return cleaned && cleaned !== "-";
        },
      ),
    ).length ?? 0
  );
}

function buildFinancialEvidence(project: Project): string[] {
  const source = project.source;
  return [
    source?.investmentValueText
      ? `Investment value from source: ${source.investmentValueText}`
      : `Investment size: ${formatUsd(project.investmentSizeUsd)}`,
    source?.npvText
      ? `NPV from source: ${source.npvText}`
      : `Estimated NPV: ${formatUsd(project.financials.npvUsd)}`,
    source?.paybackText
      ? `Payback from source: ${source.paybackText}`
      : `Estimated payback: ${project.financials.paybackYears} years`,
  ];
}

function buildRegionMetricEvidence(project: Project): string {
  const metrics = [
    `${formatNumber(project.region.population)} population`,
    `${formatNumber(project.region.workforce)} workforce`,
    project.region.gdpUsdBillion > 0
      ? `${formatUsd(project.region.gdpUsdBillion * 1_000_000_000)} GRDP proxy`
      : "",
    project.region.minimumWageUsd > 0
      ? `${formatUsd(project.region.minimumWageUsd)} monthly minimum wage proxy`
      : "",
  ].filter(Boolean);

  return metrics.join("; ");
}

function buildRegulatoryEvidence(project: Project): string[] {
  const incentives =
    project.source?.incentives
      .map((item) => {
        const name = cleanSourceText(item.name);
        const description = cleanSourceText(item.description);
        if (!name && !description) {
          return "";
        }
        return description ? `${name}: ${truncateAtWord(description, 180)}` : name;
      })
      .filter(Boolean) ?? [];

  if (incentives.length) {
    return incentives.slice(0, 2);
  }

  return project.regulatory.permits.slice(0, 2);
}

function recommendationFor(project: Project): string {
  const status = cleanSourceText(project.source?.projectStatus).toUpperCase();
  if (status === "SOLD") {
    return "Do not pursue";
  }
  if (project.riskLevel === "high" || project.readinessLevel < 65) {
    return "Proceed selectively";
  }
  if (project.attractivenessScore >= 80 && project.readinessLevel >= 75) {
    return "Proceed";
  }
  return "Qualify";
}

export function buildProjectDecisionBrief(project: Project): ProjectDecisionBrief {
  const source = project.source;
  const allTexts = collectSourceTexts(project);
  const bpsCited = hasBpsCitation(allTexts);
  const provider = source?.provider || "Investara dataset";
  const recommendation = recommendationFor(project);
  const regionalEvidence = pickSourceSentence(allTexts, regionalKeywords);
  const infrastructureEvidence = pickSourceSentence(
    [source?.technicalAspect, source?.description, project.overview].filter(
      (value): value is string => Boolean(cleanSourceText(value)),
    ),
    infrastructureKeywords,
  );
  const ecosystemEvidence = pickSourceSentence(
    [source?.marketAspect, source?.description, project.overview].filter(
      (value): value is string => Boolean(cleanSourceText(value)),
    ),
    ecosystemKeywords,
  );
  const regionMetricEvidence = buildRegionMetricEvidence(project);
  const contactCount = validContactCount(project);
  const financialMetric = source?.irrText || `${project.financials.irr}% IRR`;
  const payback = source?.paybackText || `${project.financials.paybackYears} years`;
  const npv = source?.npvText || formatUsd(project.financials.npvUsd);
  const status = cleanSourceText(source?.projectStatus);
  const sourceState = status || titleCase(project.regulatory.complexityLevel);
  const regulatoryEvidence = buildRegulatoryEvidence(project);

  const summary: DecisionBriefSummaryItem[] = [
    {
      label: "Why invest",
      value: `${project.attractivenessScore}/100`,
      detail: `${financialMetric}, ${project.readinessLevel}/100 readiness, and ${project.sector} exposure create a screenable opportunity.`,
    },
    {
      label: "Why not",
      value: `${titleCase(project.riskLevel)} risk`,
      detail: status
        ? `Project status is ${status}; confirm it is still actionable before committing diligence cost.`
        : `Regulatory complexity is ${project.regulatory.complexityLevel}; local execution support is still needed.`,
    },
    {
      label: "Ideal investor",
      value: project.sector,
      detail: `Best fit for an operator, strategic corporate, or project-finance sponsor with Indonesia partner appetite.`,
    },
    {
      label: "Next action",
      value: recommendation,
      detail:
        "Review Investara's BPS/regional snapshot, request BKPM source documents, and pressure-test the financial model.",
    },
  ];

  const factors: DecisionBriefFactor[] = [
    {
      id: "financial",
      title: "Financial & Risk Analysis",
      metric: financialMetric,
      insight: `${financialMetric}, ${npv} NPV, ${payback} payback, and ${titleCase(project.riskLevel)} risk make this a screening case, not an approval case.`,
      evidence: buildFinancialEvidence(project),
      diligenceFocus:
        "Request the underlying model, capex schedule, revenue assumptions, FX sensitivity, and downside payback case.",
      sources: sourceSignals(project, [], ["Financial fields"]),
    },
    {
      id: "regional",
      title: "Regional Intelligence",
      metric: `${formatCompactNumber(project.region.population)} population`,
      insight: `Investara provides a regional reference snapshot for ${project.region.name} covering labor depth, market scale, wage proxy, and GRDP proxy.`,
      evidence: [
        regionalEvidence || regionMetricEvidence,
        bpsCited
          ? "The public PIR text already contains a BPS citation, and Investara surfaces it with the regional snapshot on this page."
          : "Investara has normalized the available regional profile metrics into the BPS reference panel on this page.",
      ].filter(Boolean),
      diligenceFocus:
        "Use the BPS reference panel as the first-pass regional baseline, then focus diligence on site ownership, offtake quality, sponsor authority, and execution gaps.",
      sources: sourceSignals(project, [regionalEvidence], [
        bpsCited ? "" : INVESTARA_BPS_REFERENCE,
        "BKPM province metadata",
      ]),
    },
    {
      id: "infrastructure",
      title: "Infrastructure & Connectivity",
      metric: source?.location || source?.city || project.region.name,
      insight:
        "Connectivity should be evaluated from the source location, utility availability, and route-to-market evidence, not only from a generic readiness score.",
      evidence: [
        infrastructureEvidence ||
          "Exact port, airport, road, utility, and internet diligence should be confirmed from source documents.",
      ],
      diligenceFocus:
        "Verify land access, port or airport route, grid connection, water supply, telecom coverage, and last-mile logistics cost.",
      sources: sourceSignals(project, [infrastructureEvidence]),
    },
    {
      id: "ecosystem",
      title: "Industry Ecosystem",
      metric: project.ecosystem.industries[0] || project.sector,
      insight:
        "The investability test is whether local demand, inputs, offtakers, and adjacent industries can support ramp-up after close.",
      evidence: [
        ecosystemEvidence ||
          `Current ecosystem signals include ${project.ecosystem.industries.join(", ") || project.sector}.`,
      ],
      diligenceFocus:
        "Map raw-material availability, offtake counterparties, competitor capacity, anchor tenants, and export or domestic channels.",
      sources: sourceSignals(project, [ecosystemEvidence]),
    },
    {
      id: "regulatory",
      title: "Regulatory & Readiness",
      metric: sourceState,
      insight: `${sourceState} status, ${project.readinessLevel}/100 readiness, ${project.regulatory.complexityLevel} complexity, and ${contactCount} usable contact record(s) shape execution feasibility.`,
      evidence: regulatoryEvidence,
      diligenceFocus:
        "Confirm land status, permits, fiscal and non-fiscal incentives, sponsor authority, and the correct government contact before outreach.",
      sources: sourceSignals(project, regulatoryEvidence, [
        source?.incentives.length ? "Incentive records" : "Permit check needed",
        contactCount ? "Contact records" : "",
      ]),
    },
    {
      id: "recommendation",
      title: "Final Recommendation",
      metric: recommendation,
      insight:
        recommendation === "Do not pursue"
          ? "Do not treat this as an open opportunity unless BKPM or the local owner confirms availability has changed."
          : "Proceed after reviewing the Investara BPS/regional snapshot, source documents, partner diligence, and financial downside testing.",
      evidence: [
        `Scorecard: ${project.attractivenessScore}/100 attractiveness, ${project.readinessLevel}/100 readiness, ${titleCase(project.riskLevel)} risk.`,
        `${provider}${source?.sourceId ? ` ${source.sourceId}` : ""} is the primary public opportunity source.`,
      ],
      diligenceFocus:
        "Prepare a go/no-go memo that separates verified public evidence from assumptions still requiring management confirmation.",
      sources: sourceSignals(project, [], [
        bpsCited ? "BPS cited in PIR source" : INVESTARA_BPS_REFERENCE,
        "Investara scorecard",
      ]),
    },
  ];

  const primarySources = uniqueLabels([
    provider,
    bpsCited ? "BPS cited in PIR source" : INVESTARA_BPS_REFERENCE,
    source?.documents.length ? "Source documents" : "",
  ]);

  return {
    summary,
    factors,
    primarySources,
    sourceNote: `Brief uses ${provider} project fields, BKPM regional metadata, and Investara's BPS/regional reference layer so first-pass regional checking stays inside the project page.`,
  };
}
