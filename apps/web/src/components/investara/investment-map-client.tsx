"use client";

import { useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { Filter, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
  const [sector, setSector] = useState("all");
  const [region, setRegion] = useState("all");
  const [readiness, setReadiness] = useState("70");

  const sectors = useMemo(() => [...new Set(projects.map((project) => project.sector))], [projects]);
  const regions = useMemo(() => [...new Set(projects.map((project) => project.region.name))], [projects]);

  const visibleProjects = projects.filter((project) => {
    const sectorMatch = sector === "all" || project.sector === sector;
    const regionMatch = region === "all" || project.region.name === region;
    const readinessMatch = project.readinessLevel >= Number(readiness);
    return sectorMatch && regionMatch && readinessMatch;
  });

  return (
    <div className="grid h-full min-h-[620px] gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-medium">Map filters</h2>
        </div>
        <div className="grid gap-3">
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger aria-label="Filter sector">
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sectors</SelectItem>
              {sectors.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger aria-label="Filter region">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All regions</SelectItem>
              {regions.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={readiness} onValueChange={setReadiness}>
            <SelectTrigger aria-label="Filter readiness">
              <SelectValue placeholder="Readiness" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="60">Readiness 60+</SelectItem>
              <SelectItem value="70">Readiness 70+</SelectItem>
              <SelectItem value="80">Readiness 80+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3 pt-2">
          {visibleProjects.map((project) => (
            <div key={project.id} className="rounded-md border border-border/70 bg-secondary/30 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{project.region.name}</p>
                <Badge>{project.readinessLevel}</Badge>
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{project.name}</p>
            </div>
          ))}
        </div>
      </aside>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <MapContainer
          center={[-2.2, 117.8]}
          zoom={5}
          scrollWheelZoom
          className="h-full min-h-[620px] w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {visibleProjects.map((project) => (
            <CircleMarker
              key={project.id}
              center={project.region.coordinates}
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
            Circle size reflects AI attractiveness score.
          </span>
          <span>Filters update the project clusters and side list together.</span>
        </div>
      </div>
    </div>
  );
}

