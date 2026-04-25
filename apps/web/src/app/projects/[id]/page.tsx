import Link from "next/link";
import { notFound } from "next/navigation";
import { BarChart3, Factory, Landmark, Network, ShieldCheck, Users } from "lucide-react";

import { DecisionSection } from "@/components/investara/decision-section";
import { FinancialRiskChart } from "@/components/investara/financial-risk-chart";
import { PartnerMatches } from "@/components/investara/partner-matches";
import { ScoreRing } from "@/components/investara/score-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projects } from "@/data/mock-projects";
import { partners } from "@/data/mock-partners";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = projects.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Badge>{project.sector}</Badge>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{project.overview}</p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/">Back to workspace</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
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
                  ${(project.financials.npvUsd / 1000000).toFixed(1)}M
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
            <CardTitle className="text-lg">Investment Decision Brief</CardTitle>
          </CardHeader>
          <CardContent>
            <DecisionSection
              icon={BarChart3}
              title="Financial & Risk Analysis"
              metric={`${project.financials.irr}% IRR`}
              insight="Positive upside with medium regulatory and operational risk requiring local diligence."
            />
            <DecisionSection
              icon={Users}
              title="Regional Intelligence"
              metric={`${project.region.population.toLocaleString()} population`}
              insight={`${project.region.name} has workforce depth, relevant sectors, GDP growth, and wage levels suitable for the project profile.`}
            />
            <DecisionSection
              icon={Network}
              title="Infrastructure & Connectivity"
              metric={`${project.infrastructure.airportDistanceKm}km airport`}
              insight="Connectivity scores support execution, with port, airport, road, utility, and internet signals visible."
            />
            <DecisionSection
              icon={Factory}
              title="Industry Ecosystem"
              metric={project.ecosystem.industries[0]}
              insight="Nearby industries, zones, supply chain proximity, and major companies strengthen ecosystem readiness."
            />
            <DecisionSection
              icon={Landmark}
              title="Regulatory & Readiness"
              metric={project.regulatory.complexityLevel}
              insight={project.regulatory.governmentSupport}
            />
            <DecisionSection
              icon={ShieldCheck}
              title="Final Recommendation"
              metric="Proceed"
              insight="Proceed to diligence and partner introduction if target ticket size, sector thesis, and risk appetite align."
            />
          </CardContent>
        </Card>
      </div>

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
