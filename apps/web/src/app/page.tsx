import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Factory,
  Landmark,
  Map,
  Network,
  ShieldCheck,
  Users,
} from "lucide-react";

import { DecisionSection } from "@/components/investara/decision-section";
import { LanguageSwitcher } from "@/components/investara/language-switcher";
import { ProjectCard } from "@/components/investara/project-card";
import { ScoreRing } from "@/components/investara/score-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { featuredProject, investorProfile, projects } from "@/data/mock-projects";

const formatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border/70 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
                <Landmark className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold">Investara</span>
              <Badge variant="outline" className="border-primary/40 text-primary">
                AI Investment Copilot for Nusantara
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Decision workspace for Indonesian regional investment opportunities.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LanguageSwitcher />
            <Button asChild variant="secondary" size="sm">
              <Link href="/profile">Investor Profile</Link>
            </Button>
            <Button asChild size="sm">
              <Link href={`/projects/${featuredProject.id}`}>
                Open Decision Brief
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <Card className="border-border/70 bg-card/80 shadow-none">
            <CardHeader className="gap-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="max-w-2xl space-y-4">
                  <Badge className="w-fit bg-primary text-primary-foreground">
                    Recommended PIR
                  </Badge>
                  <div className="space-y-3">
                    <h1 className="max-w-3xl text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
                      {featuredProject.name}
                    </h1>
                    <p className="text-base leading-7 text-muted-foreground">
                      {featuredProject.overview} Investara links profitability, regional
                      viability, ecosystem strength, and execution readiness into one decision
                      brief.
                    </p>
                  </div>
                </div>
                <ScoreRing score={featuredProject.attractivenessScore} label="Attractiveness" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["IRR", `${featuredProject.financials.irr}%`],
                  ["NPV", `$${(featuredProject.financials.npvUsd / 1000000).toFixed(1)}M`],
                  ["Payback", `${featuredProject.financials.paybackYears} yrs`],
                  ["Ticket", `$${(featuredProject.investmentSizeUsd / 1000000).toFixed(0)}M`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-border/70 bg-secondary/40 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-2 font-mono text-2xl font-semibold text-foreground">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-3 rounded-md border border-border/70 bg-secondary/30 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Sector fit</span>
                    <span className="font-mono text-primary">100</span>
                  </div>
                  <Progress value={100} />
                  <p className="text-xs leading-5 text-muted-foreground">
                    Matches profile sector: {investorProfile.sector}.
                  </p>
                </div>
                <div className="space-y-3 rounded-md border border-border/70 bg-secondary/30 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Risk match</span>
                    <span className="font-mono text-primary">100</span>
                  </div>
                  <Progress value={100} />
                  <p className="text-xs leading-5 text-muted-foreground">
                    Medium risk aligns with current investor appetite.
                  </p>
                </div>
                <div className="space-y-3 rounded-md border border-border/70 bg-secondary/30 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Readiness</span>
                    <span className="font-mono text-primary">
                      {featuredProject.readinessLevel}
                    </span>
                  </div>
                  <Progress value={featuredProject.readinessLevel} />
                  <p className="text-xs leading-5 text-muted-foreground">
                    Permits, site, and government support are partially prepared.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Investor Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                ["Sector", investorProfile.sector],
                ["Ticket", `$${formatter.format(investorProfile.investmentSizeUsd)}`],
                ["Risk", investorProfile.riskAppetite],
                ["Regions", "Central Java"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-right text-sm font-medium capitalize">{value}</span>
                </div>
              ))}
              <Separator />
              <div className="grid gap-3">
                <Button asChild variant="secondary">
                  <Link href="/map">
                    <Map className="h-4 w-4" />
                    View Investment Map
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard">
                    <CheckCircle2 className="h-4 w-4" />
                    Track Actions
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-border/70 bg-card/80 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Decision Intelligence Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <DecisionSection
                icon={BarChart3}
                title="Executive Snapshot"
                metric={`${featuredProject.attractivenessScore}/100`}
                insight="Financial signal, investment size, payback, readiness, and AI summary are consolidated for executive review."
              />
              <DecisionSection
                icon={ShieldCheck}
                title="Financial & Risk Analysis"
                metric={`${featuredProject.financials.irr}% IRR`}
                insight="Upside is driven by regional manufacturing demand, while regulatory and operational risks require local execution support."
              />
              <DecisionSection
                icon={Users}
                title="Regional Intelligence"
                metric={`${formatter.format(featuredProject.region.workforce)} workforce`}
                insight="Central Java is suitable for labor-intensive manufacturing with strong workforce depth and sector adjacency."
              />
              <DecisionSection
                icon={Network}
                title="Infrastructure & Connectivity"
                metric={`${featuredProject.infrastructure.portsDistanceKm}km port`}
                insight="Port, airport, road, electricity, and internet scores indicate solid infrastructure readiness for industrial rollout."
              />
              <DecisionSection
                icon={Factory}
                title="Industry Ecosystem"
                metric={featuredProject.ecosystem.zones[0]}
                insight="Nearby industrial zones and existing manufacturing companies strengthen supply chain proximity."
              />
              <DecisionSection
                icon={Building2}
                title="Regulatory & Readiness"
                metric={featuredProject.regulatory.complexityLevel}
                insight="Permits and incentives are visible, with provincial government support reducing setup friction."
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

