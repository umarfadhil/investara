import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const BKPM_BASE_URL = "https://regionalinvestment.bkpm.go.id";
const BKPM_API_BASE_URL = `${BKPM_BASE_URL}/be`;
const IDR_PER_USD = Number(process.env.BKPM_IDR_PER_USD || 16000);
const STATUS_FILTERS = ["ppi", "ipro", "pid"];
const OUTPUT_PATHS = [
  "apps/web/src/data/bkpm-opportunities.generated.json",
  "apps/api/app/repositories/bkpm_opportunities.generated.json",
];

const SECTOR_LABELS = new Map([
  ["PERTANIAN", "Agriculture"],
  ["PERIKANAN", "Fisheries"],
  ["PERTAMBANGAN", "Mining"],
  ["PERINDUSTRIAN", "Manufacturing"],
  ["INDUSTRI", "Manufacturing"],
  ["INDUSTRI MANUFAKTUR", "Manufacturing"],
  ["AGRO INDUSTRI", "Agro-industry"],
  ["ENERGI", "Energy"],
  ["ENERGI TERBARUKAN", "Renewable Energy"],
  ["KONSTRUKSI", "Construction"],
  ["PERDAGANGAN", "Trade"],
  ["KEUANGAN", "Finance"],
  ["PENGANGKUTAN", "Transport & Logistics"],
  ["PARIWISATA", "Tourism"],
  ["SUMBER DAYA ALAM", "Natural Resources"],
  ["KAWASAN INDUSTRI DAN REAL ESTATE", "Industrial Estate & Real Estate"],
  ["JASA DAN KAWASAN", "Services & Regions"],
  ["INFRASTRUKTUR", "Infrastructure"],
]);

function cleanText(value) {
  if (value == null) {
    return "";
  }

  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return cleanText(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseLocaleNumber(value) {
  if (value == null) {
    return 0;
  }

  let text = String(value).trim();
  if (!text) {
    return 0;
  }

  text = text.replace(/[^\d,.-]/g, "");
  if (!text || text === "-" || text === "." || text === ",") {
    return 0;
  }

  const lastComma = text.lastIndexOf(",");
  const lastDot = text.lastIndexOf(".");

  if (lastComma > -1 && lastDot > -1) {
    text =
      lastComma > lastDot
        ? text.replace(/\./g, "").replace(",", ".")
        : text.replace(/,/g, "");
  } else if (lastComma > -1) {
    text = text.replace(",", ".");
  } else if (lastDot > -1) {
    const parts = text.split(".");
    const lastPart = parts.at(-1) || "";
    const hasMultipleGroups = parts.length > 2;
    if (hasMultipleGroups || lastPart.length === 3) {
      text = text.replace(/\./g, "");
    }
  }

  const parsed = Number.parseFloat(text);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseIdr(value) {
  if (value == null) {
    return 0;
  }

  const text = String(value).toUpperCase();
  const amount = parseLocaleNumber(text);
  if (!amount) {
    return 0;
  }

  if (/[\d.,]\s*JT/.test(text) || text.includes("JUTA")) {
    return amount * 1_000_000;
  }
  if (/[\d.,]\s*RB/.test(text) || text.includes("RIBU")) {
    return amount * 1_000;
  }
  if (/[\d.,]\s*T(?![A-Z])/.test(text) || text.includes("TRILIUN")) {
    return amount * 1_000_000_000_000;
  }
  if (/[\d.,]\s*M(?![A-Z])/.test(text) || text.includes("MILIAR")) {
    return amount * 1_000_000_000;
  }

  return amount;
}

function parsePercent(value) {
  return Math.max(0, parseLocaleNumber(value));
}

function toUsdFromIdr(value) {
  return Math.round((parseIdr(value) / IDR_PER_USD) * 100) / 100;
}

async function fetchJson(url, init) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  const contentType = response.headers.get("content-type") || "";
  const body = await response.text();
  if (!contentType.includes("application/json") && body.trim().startsWith("<")) {
    throw new Error(`Expected JSON but received HTML for ${url}`);
  }

  return JSON.parse(body);
}

async function fetchOpportunityRows(status) {
  const params = new URLSearchParams({
    page: "1",
    page_size: "500",
    search: "",
    status,
  });
  const payload = await fetchJson(
    `${BKPM_API_BASE_URL}/peluang/peluang_investasi_wilayah?${params.toString()}`,
  );

  if (!payload.success || !Array.isArray(payload.data)) {
    throw new Error(`Unexpected BKPM list response for ${status}`);
  }

  return {
    status: status.toUpperCase(),
    totalRecords: Number(payload.totalRecords || payload.data.length),
    rows: payload.data,
  };
}

async function fetchOpportunityDetail(row) {
  const endpoint =
    String(row.status).toUpperCase() === "PID"
      ? `${BKPM_API_BASE_URL}/peluang/detail_pid/${row.id_peluang}`
      : `${BKPM_API_BASE_URL}/peluang/detail/${row.id_peluang}`;

  try {
    const payload = await fetchJson(endpoint);
    return payload.success ? payload.data : null;
  } catch (error) {
    console.warn(`Detail fetch skipped for ${row.status}-${row.id_peluang}: ${error.message}`);
    return null;
  }
}

async function fetchProvinceReferences() {
  const payload = await fetchJson(`${BKPM_API_BASE_URL}/daerah/get_prov/`);
  if (!payload.success || !Array.isArray(payload.data)) {
    throw new Error("Unexpected BKPM province reference response");
  }
  return new Map(payload.data.map((province) => [Number(province.id_adm_provinsi), province]));
}

async function fetchProvinceDetail(provinceId) {
  try {
    const payload = await fetchJson(`${BKPM_API_BASE_URL}/daerah/detail_provinsi/${provinceId}`);
    return payload.success ? payload.data : null;
  } catch (error) {
    console.warn(`Province detail fetch skipped for ${provinceId}: ${error.message}`);
    return null;
  }
}

async function mapLimit(items, limit, mapper) {
  const results = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function latestByYear(items, yearKey = "tahun") {
  if (!Array.isArray(items) || !items.length) {
    return null;
  }

  return [...items].sort((a, b) => Number(b[yearKey] || 0) - Number(a[yearKey] || 0))[0];
}

function extractWorkforce(profileText) {
  const text = cleanText(profileText);
  const match = text.match(/Angkatan kerja sebanyak\s+([\d.]+)/i);
  return match ? Math.round(parseLocaleNumber(match[1])) : 0;
}

function normalizeSectorName(value) {
  const cleaned = cleanText(value).toUpperCase();
  return SECTOR_LABELS.get(cleaned) || cleanText(value) || "Other";
}

function buildRegionSummary(provinceRef, provinceDetail) {
  const provinceName = cleanText(provinceRef?.nama || provinceDetail?.nama_provinsi || "Indonesia");
  const latestPopulation = latestByYear(provinceDetail?.daerahDetil?.penduduk);
  const latestWage = latestByYear(provinceDetail?.daerahDetil?.umr);
  const pdrbByYear = provinceDetail?.daerahDetil?.pdrb || {};
  const latestPdrbYear = Object.keys(pdrbByYear)
    .map(Number)
    .sort((a, b) => b - a)[0];
  const latestPdrbRows = latestPdrbYear ? pdrbByYear[String(latestPdrbYear)] : [];
  const pdrbIdr = Array.isArray(latestPdrbRows)
    ? latestPdrbRows.reduce((total, row) => total + Number(row.nilai || 0), 0)
    : 0;
  const population =
    Number(latestPopulation?.jumlah_pria || 0) + Number(latestPopulation?.jumlah_wanita || 0);
  const sectors = Array.isArray(provinceDetail?.sektorDaerah)
    ? [
        ...new Set(
          provinceDetail.sektorDaerah
            .map((sector) => normalizeSectorName(sector.nama))
            .filter(Boolean),
        ),
      ]
    : [];

  return {
    id: slugify(provinceName),
    name: provinceName,
    coordinates: [Number(provinceRef?.lat || provinceDetail?.lat || 0), Number(provinceRef?.lon || provinceDetail?.lon || 0)],
    population,
    workforce: extractWorkforce(provinceDetail?.profil),
    medianAge: 0,
    gdpUsdBillion: Math.round((pdrbIdr / IDR_PER_USD / 1_000_000_000) * 100) / 100,
    growthRate: 0,
    minimumWageUsd: Math.round((Number(latestWage?.nilai || 0) / IDR_PER_USD) * 100) / 100,
    sectors,
  };
}

function detailUrlFor(row) {
  const status = String(row.status || "").toUpperCase();
  if (status === "IPRO") {
    return `${BKPM_BASE_URL}/peluang_investasi/ipro/${row.id_peluang}`;
  }
  if (status === "PID") {
    return `${BKPM_BASE_URL}/daerah/peluang_investasi/${row.id_peluang}`;
  }
  return `${BKPM_BASE_URL}/peluang_investasi/detailed/${row.id_peluang}`;
}

function complexityFromRow(row) {
  const status = cleanText(row.status_proyek).toUpperCase();
  if (status === "SOLD") {
    return "high";
  }
  if (status === "RE/PUBLISH") {
    return "low";
  }
  return "medium";
}

function readinessFromRow(row) {
  const status = cleanText(row.status_proyek).toUpperCase();
  const opportunityType = String(row.status || "").toUpperCase();
  if (status === "SOLD") {
    return 55;
  }
  if (status === "RE/PUBLISH") {
    return opportunityType === "IPRO" ? 90 : 86;
  }
  if (status === "DIMINATI") {
    return 76;
  }
  if (opportunityType === "IPRO") {
    return 80;
  }
  if (opportunityType === "PPI") {
    return 72;
  }
  return 66;
}

function riskFromSignals(row, readiness, paybackYears) {
  const status = cleanText(row.status_proyek).toUpperCase();
  if (status === "SOLD" || readiness < 65 || paybackYears > 12) {
    return "high";
  }
  if (readiness >= 85 && paybackYears <= 8) {
    return "low";
  }
  return "medium";
}

function attractivenessFromSignals({ row, readiness, irr, paybackYears, investmentUsd }) {
  const status = cleanText(row.status_proyek).toUpperCase();
  const returnScore = Math.min(100, Math.max(0, irr * 4));
  const paybackScore = paybackYears > 0 ? Math.max(0, 100 - paybackYears * 5) : 55;
  const scaleScore = investmentUsd > 0 ? Math.min(100, Math.log10(investmentUsd + 1) * 11) : 45;
  const statusPenalty = status === "SOLD" ? 28 : status === "DIMINATI" ? 8 : 0;
  return Math.max(
    20,
    Math.min(96, Math.round(readiness * 0.42 + returnScore * 0.28 + paybackScore * 0.18 + scaleScore * 0.12 - statusPenalty)),
  );
}

function buildOverview(row, detailData) {
  const detail = detailData?.detail || {};
  const candidate =
    cleanText(detail.deskripsi_singkat) ||
    cleanText(row.deskripsi) ||
    cleanText(detail.deskripsi) ||
    cleanText(detailData?.deskripsi) ||
    cleanText(detailData?.aspek_teknis) ||
    cleanText(detailData?.aspek_pasar);

  if (candidate) {
    return candidate.length > 360 ? `${candidate.slice(0, 357).trim()}...` : candidate;
  }

  const location = [row.nama_kabkot, row.nama_provinsi].filter(Boolean).join(", ");
  return `BKPM PIR ${row.status} opportunity in ${location || "Indonesia"} for ${row.nama_sektor_peluang || row.nama_sektor || "regional investment"}.`;
}

function buildSource(row, detailData) {
  const detail = detailData?.detail || {};
  const contacts = Array.isArray(detailData?.kontak)
    ? detailData.kontak.map((contact) => ({
        name: cleanText(contact.Kontak),
        address: cleanText(contact.Alamat),
        phone: cleanText(contact.Telepon),
        email: cleanText(contact.Email),
        website: cleanText(contact.Website),
      }))
    : [];
  const incentives = Array.isArray(detailData?.insentif)
    ? detailData.insentif.map((incentive) => ({
        name: cleanText(incentive.nama),
        description: cleanText(incentive.keterangan),
      }))
    : [];
  const gallery = Array.isArray(detailData?.galeri)
    ? detailData.galeri.map((item) => cleanText(item.image)).filter(Boolean)
    : [];
  const documents = Array.isArray(detailData?.info)
    ? detailData.info.map((item) => cleanText(item.nama || item.url_rest)).filter(Boolean)
    : [];

  return {
    provider: "BKPM PIR",
    sourceId: `${row.status}-${row.id_peluang}`,
    opportunityType: cleanText(row.status),
    projectStatus: cleanText(detail.status_proyek || row.status_proyek),
    year: Number(row.tahun || detail.tahun || 0) || null,
    province: cleanText(row.nama_provinsi || detail.nama_provinsi),
    city: cleanText(row.nama_kabkot || detail.nama_kabkot),
    location: cleanText(detail.lokasi_kawasan),
    kbliCode: cleanText(detail.kode_kbli),
    imageUrl: cleanText(detail.image || row.image),
    videoUrl: cleanText(detail.vidio),
    sourceUrl: detailUrlFor(row),
    apiUrl:
      String(row.status).toUpperCase() === "PID"
        ? `${BKPM_API_BASE_URL}/peluang/detail_pid/${row.id_peluang}`
        : `${BKPM_API_BASE_URL}/peluang/detail/${row.id_peluang}`,
    investmentValueText: cleanText(detail.nilai_investasi || row.nilai_investasi),
    npvText: cleanText(detail.nilai_npv || row.nilai_npv),
    irrText: cleanText(detail.nilai_irr || row.nilai_irr),
    paybackText: cleanText(detail.payback_period || row.nilai_pp),
    description: cleanText(detail.deskripsi || row.deskripsi || detailData?.deskripsi),
    technicalAspect: cleanText(detailData?.aspek_teknis),
    marketAspect: cleanText(detailData?.aspek_pasar),
    incentives,
    contacts,
    gallery,
    documents,
  };
}

function buildProject(row, detailData, regionSummaries) {
  const detail = detailData?.detail || {};
  const provinceName = cleanText(row.nama_provinsi || detail.nama_provinsi || "Indonesia");
  const baseRegion = regionSummaries.get(Number(row.id_adm_provinsi)) || {
    id: slugify(provinceName),
    name: provinceName,
    coordinates: [Number(row.lat || detail.latitude || 0), Number(row.lon || detail.longitude || 0)],
    population: 0,
    workforce: 0,
    medianAge: 0,
    gdpUsdBillion: 0,
    growthRate: 0,
    minimumWageUsd: 0,
    sectors: [],
  };
  const projectCoordinates = [
    Number(detail.latitude || row.lat || baseRegion.coordinates[0] || 0),
    Number(detail.longitude || row.lon || baseRegion.coordinates[1] || 0),
  ];
  const sector = normalizeSectorName(row.nama_sektor_peluang || detail.nama_sektor || row.nama_sektor);
  const investmentSizeUsd = toUsdFromIdr(detail.nilai_investasi || row.nilai_investasi);
  const npvUsd = toUsdFromIdr(detail.nilai_npv || row.nilai_npv);
  const irr = parsePercent(detail.nilai_irr || row.nilai_irr);
  const paybackYears = parseLocaleNumber(detail.payback_period || row.nilai_pp);
  const readinessLevel = readinessFromRow(row);
  const riskLevel = riskFromSignals(row, readinessLevel, paybackYears);
  const attractivenessScore = attractivenessFromSignals({
    row,
    readiness: readinessLevel,
    irr,
    paybackYears,
    investmentUsd: investmentSizeUsd,
  });
  const source = buildSource(row, detailData);
  const projectId = `bkpm-${String(row.status || "pir").toLowerCase()}-${row.id_peluang}-${slugify(row.nama || detail.judul || "opportunity")}`;
  const location = source.location || source.city || source.province || "Indonesia";
  const incentives = source.incentives.map((item) => item.name).filter(Boolean);

  return {
    id: projectId,
    name: cleanText(row.nama || detail.judul || `BKPM Opportunity ${row.id_peluang}`),
    sector,
    regionId: baseRegion.id,
    investmentSizeUsd,
    readinessLevel,
    riskLevel,
    attractivenessScore,
    overview: buildOverview(row, detailData),
    coordinates: projectCoordinates,
    financials: {
      irr,
      npvUsd,
      paybackYears,
    },
    region: {
      ...baseRegion,
      sectors: baseRegion.sectors.length ? baseRegion.sectors : [sector],
    },
    infrastructure: {
      portsDistanceKm: 0,
      airportDistanceKm: 0,
      roadScore: readinessLevel,
      electricityScore: Math.max(45, readinessLevel - 6),
      internetScore: Math.max(45, readinessLevel - 8),
    },
    ecosystem: {
      industries: [sector, cleanText(row.nama_sektor || detail.nama_sektor)].filter(Boolean),
      zones: [location],
      companies: source.contacts.map((contact) => contact.name).filter(Boolean),
    },
    regulatory: {
      permits: ["Confirm licensing and land readiness through BKPM/PIR source documents"],
      incentives: incentives.length ? incentives : ["Confirm applicable fiscal and non-fiscal incentives"],
      complexityLevel: complexityFromRow(row),
      governmentSupport:
        source.contacts[0]?.name ||
        "BKPM/PIR public profile includes source metadata for investor follow-up.",
    },
    source,
  };
}

async function main() {
  if (!Number.isFinite(IDR_PER_USD) || IDR_PER_USD <= 0) {
    throw new Error("BKPM_IDR_PER_USD must be a positive number.");
  }

  console.log("Fetching BKPM opportunity rows...");
  const statusGroups = await Promise.all(STATUS_FILTERS.map(fetchOpportunityRows));
  const rows = statusGroups.flatMap((group) => group.rows);

  console.log(`Fetching ${rows.length} opportunity detail records...`);
  const details = await mapLimit(rows, 6, fetchOpportunityDetail);

  console.log("Fetching BKPM province summaries...");
  const provinceRefs = await fetchProvinceReferences();
  const provinceIds = [...new Set(rows.map((row) => Number(row.id_adm_provinsi)).filter(Boolean))];
  const provinceDetails = await mapLimit(provinceIds, 5, fetchProvinceDetail);
  const regionSummaries = new Map(
    provinceIds.map((provinceId, index) => [
      provinceId,
      buildRegionSummary(provinceRefs.get(provinceId), provinceDetails[index]),
    ]),
  );

  const projects = rows
    .map((row, index) => buildProject(row, details[index], regionSummaries))
    .sort((a, b) => {
      if (b.attractivenessScore !== a.attractivenessScore) {
        return b.attractivenessScore - a.attractivenessScore;
      }
      return (b.source.year || 0) - (a.source.year || 0);
    });

  const snapshot = {
    generatedAt: new Date().toISOString(),
    source: {
      provider: "BKPM PIR",
      websiteUrl: BKPM_BASE_URL,
      listEndpoint: `${BKPM_API_BASE_URL}/peluang/peluang_investasi_wilayah`,
      idrPerUsd: IDR_PER_USD,
    },
    counts: Object.fromEntries(statusGroups.map((group) => [group.status, group.totalRecords])),
    totalProjects: projects.length,
    projects,
  };

  for (const outputPath of OUTPUT_PATHS) {
    const absolutePath = path.resolve(process.cwd(), outputPath);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
    console.log(`Wrote ${outputPath}`);
  }

  console.log(`Synced ${projects.length} BKPM opportunities.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
