"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Save } from "lucide-react";

import { useLanguage } from "@/components/investara/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projects } from "@/data/mock-projects";
import {
  entryModeOptions,
  getOptionLabel,
  investorTypeOptions,
  normalizeRegionPreferences,
  originCountryOptions,
  parseInvestorProfile,
  profileStorageKey,
  regionGroupOptions,
  riskOptions,
  sectorOptions,
  strategicPriorityOptions,
  timelineOptions,
} from "@/lib/investor-profile";
import { rankProjects } from "@/lib/recommendations";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import type {
  EntryMode,
  InvestmentTimeline,
  InvestorProfile,
  InvestorType,
  RiskAppetite,
  StrategicPriority,
} from "@/types/investara";

type ProfileRecommendationFormProps = {
  initialProfile: InvestorProfile;
};

const usdFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

function profileSummary(profile: InvestorProfile) {
  return [
    {
      label: "Investor",
      value: getOptionLabel(investorTypeOptions, profile.investorType),
    },
    {
      label: "Origin",
      value: profile.originCountry,
    },
    {
      label: "Entry mode",
      value: getOptionLabel(entryModeOptions, profile.entryMode),
    },
    {
      label: "Ticket",
      value: usdFormatter.format(profile.investmentSizeUsd),
    },
    {
      label: "Target IRR",
      value: `${profile.targetIrrPct}%`,
    },
    {
      label: "Readiness floor",
      value: `${profile.minimumReadiness}/100`,
    },
  ];
}

export function ProfileRecommendationForm({ initialProfile }: ProfileRecommendationFormProps) {
  const { t } = useLanguage();
  const [profile, setProfile] = useLocalStorageState(
    profileStorageKey,
    initialProfile,
    parseInvestorProfile,
  );
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const recommendations = useMemo(() => rankProjects(profile, projects), [profile]);
  const summary = useMemo(() => profileSummary(profile), [profile]);
  const selectedRegions = useMemo(
    () => new Set(normalizeRegionPreferences(profile.preferredRegions)),
    [profile.preferredRegions],
  );
  const selectedPriorities = useMemo(
    () => new Set(profile.strategicPriorities),
    [profile.strategicPriorities],
  );

  function updateProfile<TKey extends keyof InvestorProfile>(
    key: TKey,
    value: InvestorProfile[TKey],
  ) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function updateNumber<TKey extends keyof InvestorProfile>(key: TKey, value: string) {
    const parsed = Number(value);
    updateProfile(key, (Number.isFinite(parsed) ? parsed : 0) as InvestorProfile[TKey]);
  }

  function saveProfile() {
    setProfile(profile);
    setSavedAt(new Date().toLocaleTimeString());
  }

  function toggleRegion(regionId: string) {
    setProfile((current) => {
      const preferredRegions = new Set(normalizeRegionPreferences(current.preferredRegions));

      if (preferredRegions.has(regionId)) {
        preferredRegions.delete(regionId);
      } else {
        preferredRegions.add(regionId);
      }

      return {
        ...current,
        preferredRegions: [...preferredRegions],
      };
    });
  }

  function togglePriority(priority: StrategicPriority) {
    setProfile((current) => {
      const strategicPriorities = new Set(current.strategicPriorities);

      if (strategicPriorities.has(priority)) {
        strategicPriorities.delete(priority);
      } else {
        strategicPriorities.add(priority);
      }

      return {
        ...current,
        strategicPriorities: [...strategicPriorities],
      };
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">{t("profile.inputs")}</CardTitle>
          <CardDescription>
            Make the investor intent explicit so recommendations can weigh entry mode, return,
            readiness, region, and partner needs.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <section className="grid gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Investor identity
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Clarifies who is investing and where the capital is coming from.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="investor-type">Investor type</Label>
                <Select
                  value={profile.investorType}
                  onValueChange={(investorType: InvestorType) =>
                    updateProfile("investorType", investorType)
                  }
                >
                  <SelectTrigger id="investor-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {investorTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="origin-country">Origin market</Label>
                <Select
                  value={profile.originCountry}
                  onValueChange={(originCountry) => updateProfile("originCountry", originCountry)}
                >
                  <SelectTrigger id="origin-country" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {originCountryOptions.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section className="grid gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Deal criteria
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Sets the sector, ticket size, return hurdle, and timing constraints.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="sector">{t("profile.sector")}</Label>
                <Select
                  value={profile.sector}
                  onValueChange={(sector) => updateProfile("sector", sector)}
                >
                  <SelectTrigger id="sector" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sectorOptions.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="entry-mode">Preferred entry mode</Label>
                <Select
                  value={profile.entryMode}
                  onValueChange={(entryMode: EntryMode) => updateProfile("entryMode", entryMode)}
                >
                  <SelectTrigger id="entry-mode" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {entryModeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ticket">{t("profile.ticket")}</Label>
                <Input
                  id="ticket"
                  inputMode="numeric"
                  value={profile.investmentSizeUsd}
                  onChange={(event) => updateNumber("investmentSizeUsd", event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="target-irr">Target IRR %</Label>
                <Input
                  id="target-irr"
                  inputMode="decimal"
                  value={profile.targetIrrPct}
                  onChange={(event) => updateNumber("targetIrrPct", event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="horizon">Investment horizon years</Label>
                <Input
                  id="horizon"
                  inputMode="numeric"
                  value={profile.investmentHorizonYears}
                  onChange={(event) => updateNumber("investmentHorizonYears", event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timeline">Decision timeline</Label>
                <Select
                  value={profile.timeline}
                  onValueChange={(timeline: InvestmentTimeline) =>
                    updateProfile("timeline", timeline)
                  }
                >
                  <SelectTrigger id="timeline" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timelineOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section className="grid gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Risk and readiness
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Converts risk appetite into clearer matching thresholds.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="risk">{t("profile.risk")}</Label>
                <Select
                  value={profile.riskAppetite}
                  onValueChange={(riskAppetite: RiskAppetite) =>
                    updateProfile("riskAppetite", riskAppetite)
                  }
                >
                  <SelectTrigger id="risk" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {riskOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="readiness-floor">Minimum readiness score</Label>
                <Input
                  id="readiness-floor"
                  inputMode="numeric"
                  max={100}
                  min={0}
                  value={profile.minimumReadiness}
                  onChange={(event) => updateNumber("minimumReadiness", event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="grid gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Strategic priorities
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick the business drivers that should influence project ranking.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {strategicPriorityOptions.map((priority) => {
                const active = selectedPriorities.has(priority.value);

                return (
                  <Button
                    key={priority.value}
                    type="button"
                    variant={active ? "default" : "outline"}
                    aria-pressed={active}
                    onClick={() => togglePriority(priority.value)}
                    className="h-auto justify-start whitespace-normal px-3 py-2 text-left"
                  >
                    {priority.label}
                  </Button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Location preference
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Adds ranking weight to regions already in the investor thesis.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {regionGroupOptions.map((region) => {
                const active = selectedRegions.has(region.value);

                return (
                  <Button
                    key={region.value}
                    type="button"
                    variant={active ? "default" : "outline"}
                    aria-pressed={active}
                    onClick={() => toggleRegion(region.value)}
                    className="h-auto justify-start whitespace-normal px-3 py-2 text-left"
                  >
                    {region.label}
                  </Button>
                );
              })}
            </div>
          </section>

          <Button type="button" onClick={saveProfile} className="w-full">
            <Save className="h-4 w-4" />
            {t("profile.save")}
          </Button>
          {savedAt ? (
            <p className="text-xs text-muted-foreground">
              {t("profile.saved")} {savedAt}.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Profile summary</CardTitle>
            <CardDescription>
              These variables are persisted locally and reused from landing entry to ranked matches.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summary.map((item) => (
              <div key={item.label} className="rounded-lg border border-border/70 bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-sm font-semibold">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">{t("profile.matches")}</CardTitle>
            <CardDescription>
              Match reasons now show the specific variables that moved each ranking.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {recommendations.map((recommendation) => (
              <div
                key={recommendation.project.id}
                className="rounded-lg border border-border/70 bg-secondary/30 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>{recommendation.score}/100 match</Badge>
                      <Badge variant="secondary">{recommendation.project.sector}</Badge>
                    </div>
                    <h2 className="mt-3 text-base font-medium">{recommendation.project.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {recommendation.project.region.name}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/projects/${recommendation.project.id}`}>
                      {t("profile.brief")}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {recommendation.reasons.map((reason) => (
                    <Badge key={reason} variant="outline">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
