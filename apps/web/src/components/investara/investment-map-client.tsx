"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { ChevronRight, Filter, MapPin } from "lucide-react";

import { useLanguage } from "@/components/investara/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Project } from "@/types/investara";

type InvestmentMapClientProps = {
  projects: Project[];
};

export function InvestmentMapClient({ projects }: InvestmentMapClientProps) {
  const { t } = useLanguage();
  const [sector, setSector] = useState("all");
  const [region, setRegion] = useState("all");
  const [readiness, setReadiness] = useState("70");

  const sectors = useMemo(
    () => [...new Set(projects.map((project) => project.sector))].sort((a, b) => a.localeCompare(b)),
    [projects],
  );
  const regions = useMemo(
    () => [...new Set(projects.map((project) => project.region.name))].sort((a, b) => a.localeCompare(b)),
    [projects],
  );

  const visibleProjects = useMemo(
    () =>
      projects
        .filter((project) => {
          const sectorMatch = sector === "all" || project.sector === sector;
          const regionMatch = region === "all" || project.region.name === region;
          const readinessMatch = project.readinessLevel >= Number(readiness);
          return sectorMatch && regionMatch && readinessMatch;
        })
        .sort(
          (a, b) =>
            b.attractivenessScore - a.attractivenessScore ||
            b.readinessLevel - a.readinessLevel ||
            a.name.localeCompare(b.name),
        ),
    [projects, readiness, region, sector],
  );
  const projectCoordinates = (project: Project) => project.coordinates ?? project.region.coordinates;

  function resetFilters() {
    setSector("all");
    setRegion("all");
    setReadiness("70");
  }

  return (
    <div className="grid min-h-0 gap-4 lg:h-[calc(100svh-12rem)] lg:min-h-[620px] lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="flex h-[520px] min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-card sm:h-[560px] lg:h-auto">
        <div className="shrink-0 space-y-4 border-b border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Filter className="h-4 w-4 shrink-0 text-primary" />
              <h2 className="text-sm font-medium">{t("map.filters")}</h2>
            </div>
            <Badge variant="secondary" className="font-mono">
              {visibleProjects.length}/{projects.length}
            </Badge>
          </div>
          <div className="grid gap-3">
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger aria-label={t("map.sector")} className="w-full">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("map.allSectors")}</SelectItem>
                {sectors.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger aria-label={t("map.region")} className="w-full">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("map.allRegions")}</SelectItem>
                {regions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={readiness} onValueChange={setReadiness}>
              <SelectTrigger aria-label={t("map.readiness")} className="w-full">
                <SelectValue placeholder="Readiness" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">Readiness 60+</SelectItem>
                <SelectItem value="70">Readiness 70+</SelectItem>
                <SelectItem value="80">Readiness 80+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs leading-5 text-muted-foreground">{t("map.filterHint")}</p>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3" role="list">
          {visibleProjects.length === 0 ? (
            <div className="rounded-md border border-dashed border-border/70 bg-secondary/30 p-3">
              <p className="text-sm text-muted-foreground">{t("map.empty")}</p>
              <Button type="button" size="sm" variant="secondary" onClick={resetFilters} className="mt-3">
                {t("map.reset")}
              </Button>
            </div>
          ) : null}
          {visibleProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-md border border-border/70 bg-secondary/30 p-3 transition-colors hover:border-primary/40 hover:bg-secondary/50"
              role="listitem"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-medium leading-5">{project.name}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{project.region.name}</p>
                </div>
                <Badge className="font-mono">{project.readinessLevel}</Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge variant="outline" className="max-w-full truncate">
                  {project.sector}
                </Badge>
                {project.source?.opportunityType ? (
                  <Badge variant="secondary">{project.source.opportunityType}</Badge>
                ) : null}
              </div>
              <Button asChild size="sm" variant="ghost" className="mt-3 w-full justify-between">
                <Link href={`/projects/${project.id}`}>
                  {t("map.openBrief")}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </aside>

      <div className="min-h-[440px] overflow-hidden rounded-lg border border-border bg-card lg:min-h-0">
        <MapContainer
          center={[-2.2, 117.8]}
          zoom={5}
          scrollWheelZoom
          className="h-[440px] w-full lg:h-full lg:min-h-0"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {visibleProjects.map((project) => (
            <CircleMarker
              key={project.id}
              center={projectCoordinates(project)}
              radius={12 + project.attractivenessScore / 10}
              pathOptions={{
                color: "#0fd3b8",
                fillColor: "#0fd3b8",
                fillOpacity: 0.42,
                weight: 2,
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <div className="font-semibold">{project.name}</div>
                  <div>{project.region.name}</div>
                  <div>Score: {project.attractivenessScore}/100</div>
                  <div>Readiness: {project.readinessLevel}/100</div>
                  <a href={`/projects/${project.id}`} className="font-semibold">
                    {t("map.openBrief")}
                  </a>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <div className="lg:col-start-2">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {t("map.sizeHint")}
          </span>
          <span>{t("map.filterHint")}</span>
        </div>
      </div>
    </div>
  );
}
