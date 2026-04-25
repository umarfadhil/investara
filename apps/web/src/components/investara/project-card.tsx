import Link from "next/link";
import { ArrowUpRight, Building2, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/types/investara";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="border-border/70 bg-card/80 shadow-none">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="secondary" className="w-fit">
              {project.sector}
            </Badge>
            <CardTitle className="max-w-[22rem] text-lg leading-tight">{project.name}</CardTitle>
          </div>
          <Badge className="bg-primary text-primary-foreground">
            {project.attractivenessScore}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-6 text-muted-foreground">{project.overview}</p>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="font-mono text-lg text-foreground">{project.financials.irr}%</p>
            <p className="text-xs text-muted-foreground">IRR</p>
          </div>
          <div>
            <p className="font-mono text-lg text-foreground">{project.readinessLevel}</p>
            <p className="text-xs text-muted-foreground">Readiness</p>
          </div>
          <div>
            <p className="font-mono text-lg text-foreground">
              ${(project.investmentSizeUsd / 1000000).toFixed(0)}M
            </p>
            <p className="text-xs text-muted-foreground">Ticket</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {project.region.name}
            </span>
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {project.ecosystem.zones[0]}
            </span>
          </div>
          <Button asChild size="sm" variant="secondary">
            <Link href={`/projects/${project.id}`}>
              Brief
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

