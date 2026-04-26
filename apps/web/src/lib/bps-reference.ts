import type { Project } from "@/types/investara";

export type BpsReferenceMetric = {
  label: string;
  value: string;
  detail: string;
};

export type BpsReferenceSnapshot = {
  badge: string;
  title: string;
  note: string;
  generatedLabel: string;
  metrics: BpsReferenceMetric[];
  evidence: string[];
};

type BpsReferenceOptions = {
  generatedAt?: string;
  idrPerUsd?: number;
};

const numberFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

function cleanText(value: string | null | undefined): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function truncateAtWord(value: string, maxLength = 220): string {
  const cleaned = cleanText(value);
  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  const slice = cleaned.slice(0, maxLength - 3).trimEnd();
  return `${slice.replace(/\s+\S*$/, "")}...`;
}

function splitSentences(value: string): string[] {
  const cleaned = cleanText(value);
  if (!cleaned) {
    return [];
  }

  return (cleaned.match(/[^.!?]+(?:[.!?]+|$)/g) ?? [cleaned])
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function formatNumber(value: number): string {
  return Number.isFinite(value) && value > 0 ? numberFormatter.format(value) : "Not available";
}

function formatUsdBillion(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return "Not available";
  }

  return `$${value.toFixed(value >= 10 ? 1 : 2)}B`;
}

function formatMonthlyWage(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return "Not available";
  }

  return `$${numberFormatter.format(value)}/mo`;
}

function formatGeneratedLabel(generatedAt: string | undefined): string {
  if (!generatedAt) {
    return "Investara regional reference snapshot";
  }

  const generatedDate = new Date(generatedAt);
  if (Number.isNaN(generatedDate.getTime())) {
    return "Investara regional reference snapshot";
  }

  return `Investara regional reference snapshot, generated ${dateFormatter.format(generatedDate)}`;
}

function extractBpsEvidence(project: Project): string[] {
  const source = project.source;
  const texts = [
    project.overview,
    source?.description,
    source?.technicalAspect,
    source?.marketAspect,
  ].filter((value): value is string => Boolean(cleanText(value)));

  const excerpts = texts
    .flatMap(splitSentences)
    .filter((sentence) => /\bBPS\b|Badan Pusat Statistik/i.test(sentence))
    .map((sentence) => truncateAtWord(sentence));

  return [...new Set(excerpts)].slice(0, 2);
}

export function buildBpsReferenceSnapshot(
  project: Project,
  options: BpsReferenceOptions = {},
): BpsReferenceSnapshot {
  const bpsEvidence = extractBpsEvidence(project);
  const hasDirectBpsCitation = bpsEvidence.length > 0;
  const location = [project.source?.city, project.source?.province || project.region.name]
    .filter(Boolean)
    .join(", ");
  const sectorList = project.region.sectors.length
    ? project.region.sectors.slice(0, 4).join(", ")
    : project.sector;
  const conversionDetail = options.idrPerUsd
    ? `GRDP proxy converted from IDR with the snapshot rate of Rp${numberFormatter.format(options.idrPerUsd)} per USD.`
    : "GRDP proxy converted to USD in the generated snapshot.";

  return {
    badge: hasDirectBpsCitation ? "BPS cited by PIR" : "Investara-provided BPS reference",
    title: `${project.region.name} Regional Statistics`,
    note: hasDirectBpsCitation
      ? "Investara detected BPS evidence in the public PIR text and pairs it with normalized regional indicators here."
      : "Investara provides the normalized regional indicators here, so first-pass BPS/regional review can happen without leaving this page.",
    generatedLabel: formatGeneratedLabel(options.generatedAt),
    metrics: [
      {
        label: "Population",
        value: formatNumber(project.region.population),
        detail: `Province-level market and labor catchment for ${location || project.region.name}.`,
      },
      {
        label: "Workforce",
        value: formatNumber(project.region.workforce),
        detail: "Available labor pool from the generated regional profile.",
      },
      {
        label: "GRDP proxy",
        value: formatUsdBillion(project.region.gdpUsdBillion),
        detail: conversionDetail,
      },
      {
        label: "Minimum wage",
        value: formatMonthlyWage(project.region.minimumWageUsd),
        detail: "Monthly wage proxy for early operating-cost screening.",
      },
      {
        label: "Regional sectors",
        value: sectorList,
        detail: "Sector mix surfaced from the regional profile and matched to this opportunity.",
      },
    ],
    evidence: hasDirectBpsCitation
      ? bpsEvidence
      : [
          `No direct BPS sentence was present in the PIR text for this project; Investara still surfaces the regional profile metrics for ${project.region.name}.`,
        ],
  };
}
