import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BarChart3,
  Database,
  ExternalLink,
  Factory,
  Landmark,
  Network,
  ShieldCheck,
  Users,
} from "lucide-react";

import { DecisionSection } from "@/components/investara/decision-section";
import { FinancialRiskChart } from "@/components/investara/financial-risk-chart";
import { LanguageSwitcher } from "@/components/investara/language-switcher";
import { PartnerMatches } from "@/components/investara/partner-matches";
import { ScoreRing } from "@/components/investara/score-ring";
import { ThemeToggle } from "@/components/investara/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bkpmOpportunitySnapshot, projects } from "@/data/mock-projects";
import { partners } from "@/data/mock-partners";
import { buildBpsReferenceSnapshot } from "@/lib/bps-reference";
import { buildProjectDecisionBrief } from "@/lib/decision-brief";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = projects.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  const decisionBrief = buildProjectDecisionBrief(project);
  const bpsReference = buildBpsReferenceSnapshot(project, {
    generatedAt: bkpmOpportunitySnapshot.generatedAt,
    idrPerUsd: bkpmOpportunitySnapshot.source.idrPerUsd,
  });
  const decisionSectionIcons = {
    financial: BarChart3,
    regional: Users,
    infrastructure: Network,
    ecosystem: Factory,
    regulatory: Landmark,
    recommendation: ShieldCheck,
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="space-y-2">
          <Badge>{project.sector}</Badge>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{project.overview}</p>
          {project.source ? (
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">{project.source.opportunityType}</Badge>
              {project.source.projectStatus ? <span>{project.source.projectStatus}</span> : null}
              {project.source.year ? <span>{project.source.year}</span> : null}
              {project.source.city ? <span>{project.source.city}</span> : null}
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {project.source?.sourceUrl ? (
            <Button asChild variant="outline">
              <a href={project.source.sourceUrl} target="_blank" rel="noreferrer">
                BKPM source
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          ) : null}
          <Button asChild variant="secondary">
            <Link href="/">Back to discovery</Link>
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Executive Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <ScoreRing score={project.attractivenessScore} label="AI Attractiveness" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-secondary/40 p-3">
                <p className="font-mono text-xl">{project.financials.irr}%</p>
                <p className="text-xs text-muted-foreground">IRR</p>
              </div>
              <div className="rounded-md bg-secondary/40 p-3">
                <p className="font-mono text-xl">
                  {project.source?.npvText ?? `$${(project.financials.npvUsd / 1000000).toFixed(1)}M`}
                </p>
                <p className="text-xs text-muted-foreground">NPV</p>
              </div>
              <div className="rounded-md bg-secondary/40 p-3">
                <p className="font-mono text-xl">{project.financials.paybackYears} yrs</p>
                <p className="text-xs text-muted-foreground">Payback</p>
              </div>
              <div className="rounded-md bg-secondary/40 p-3">
                <p className="font-mono text-xl">{project.readinessLevel}</p>
                <p className="text-xs text-muted-foreground">Readiness</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">Investment Decision Brief</CardTitle>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  {decisionBrief.sourceNote}
                </p>
              </div>
              <div className="flex max-w-md flex-wrap gap-1.5 sm:justify-end">
                {decisionBrief.primarySources.map((source) => (
                  <Badge
                    key={source}
                    variant="outline"
                    className="h-auto min-h-5 justify-start whitespace-normal text-left"
                  >
                    {source}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-2 md:grid-cols-4">
              {decisionBrief.summary.map((item) => (
                <div
                  key={item.label}
                  className="rounded-md border border-border/70 bg-secondary/20 p-3"
                >
                  <p className="text-[11px] font-medium uppercase tracking-normal text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">{item.value}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            <div>
              {decisionBrief.factors.map((section) => {
                const Icon = decisionSectionIcons[section.id];
                return (
                  <DecisionSection
                    key={section.id}
                    icon={Icon}
                    title={section.title}
                    metric={section.metric}
                    insight={section.insight}
                    evidence={section.evidence}
                    diligenceFocus={section.diligenceFocus}
                    sources={section.sources}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-primary">
                <Database className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg">Investara BPS Reference</CardTitle>
                  <Badge variant="secondary">{bpsReference.badge}</Badge>
                </div>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                  {bpsReference.note}
                </p>
              </div>
            </div>
            <p className="text-xs leading-5 text-muted-foreground sm:max-w-56 sm:text-right">
              {bpsReference.generatedLabel}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {bpsReference.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-md border border-border/70 bg-secondary/20 p-3"
              >
                <p className="text-[11px] font-medium uppercase tracking-normal text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-2 text-sm font-semibold leading-5 text-foreground break-words">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-md border border-border/70 p-4">
            <p className="text-[11px] font-medium uppercase tracking-normal text-muted-foreground">
              Regional evidence surfaced by Investara
            </p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-foreground md:grid-cols-2">
              {bpsReference.evidence.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">Financial & Risk Charts</CardTitle>
        </CardHeader>
        <CardContent>
          <FinancialRiskChart
            irr={project.financials.irr}
            readiness={project.readinessLevel}
          />
        </CardContent>
      </Card>

      <PartnerMatches
        partners={partners}
        regionId={project.region.id}
        sector={project.sector}
      />
    </main>
  );
}
