"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Compass, MapPin, Sparkles, Target } from "lucide-react";

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
  investorTypeOptions,
  normalizeRegionPreferences,
  originCountryOptions,
  parseInvestorProfile,
  profileStorageKey,
  regionGroupOptions,
  riskOptions,
  sectorOptions,
  strategicPriorityOptions,
} from "@/lib/investor-profile";
import { rankProjects } from "@/lib/recommendations";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import type {
  EntryMode,
  InvestorProfile,
  InvestorType,
  RiskAppetite,
  StrategicPriority,
} from "@/types/investara";

type DiscoverEntryPanelProps = {
  initialProfile: InvestorProfile;
};

const ticketPresets = [
  { label: "$50M", value: 50000000 },
  { label: "$90M", value: 90000000 },
  { label: "$150M", value: 150000000 },
];

const compactPriorityOptions = strategicPriorityOptions.filter((priority) =>
  ["domestic_market", "export_platform", "green_transition", "partner_ready"].includes(
    priority.value,
  ),
);

export function DiscoverEntryPanel({ initialProfile }: DiscoverEntryPanelProps) {
  const router = useRouter();
  const [profile, setProfile] = useLocalStorageState(
    profileStorageKey,
    initialProfile,
    parseInvestorProfile,
  );

  const topRecommendation = useMemo(() => rankProjects(profile, projects)[0], [profile]);
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

  function toggleRegion(regionId: string) {
    setProfile((current) => {
      const preferredRegions = new Set(normalizeRegionPreferences(current.preferredRegions));

      if (preferredRegions.has(regionId)) {
        preferredRegions.delete(regionId);
      } else {
        preferredRegions.add(regionId);
      }

      return { ...current, preferredRegions: [...preferredRegions] };
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

      return { ...current, strategicPriorities: [...strategicPriorities] };
    });
  }

  function continueToProfile() {
    setProfile(profile);
    router.push("/profile");
  }

  return (
    <section id="discover-entry" className="border-b border-border/70 bg-background">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="space-y-5">
          <Badge className="w-fit">Discover & Entry</Badge>
          <div className="space-y-3">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
              Start with a usable investor entry profile.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              The landing page now does more than route visitors onward. It captures the first
              investment intent, persists it locally, and sends the same profile into ranked
              recommendations.
            </p>
          </div>
          {topRecommendation ? (
            <Card className="shadow-none">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Recommended first stop</CardTitle>
                    <CardDescription>
                      Based on the entry variables selected on this page.
                    </CardDescription>
                  </div>
                  <Badge>{topRecommendation.score}/100</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{topRecommendation.project.name}</h3>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {topRecommendation.project.region.name}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topRecommendation.reasons.slice(0, 4).map((reason) => (
                    <Badge key={reason} variant="outline">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Compass className="h-5 w-5 text-primary" />
              Entry variables
            </CardTitle>
            <CardDescription>
              Set the minimum data needed to make the next page immediately useful.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="entry-investor-type">Investor type</Label>
                <Select
                  value={profile.investorType}
                  onValueChange={(investorType: InvestorType) =>
                    updateProfile("investorType", investorType)
                  }
                >
                  <SelectTrigger id="entry-investor-type" className="w-full">
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
                <Label htmlFor="entry-origin">Origin market</Label>
                <Select
                  value={profile.originCountry}
                  onValueChange={(originCountry) => updateProfile("originCountry", originCountry)}
                >
                  <SelectTrigger id="entry-origin" className="w-full">
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
              <div className="grid gap-2">
                <Label htmlFor="entry-sector">Target sector</Label>
                <Select
                  value={profile.sector}
                  onValueChange={(sector) => updateProfile("sector", sector)}
                >
                  <SelectTrigger id="entry-sector" className="w-full">
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
                <Label htmlFor="entry-mode">Entry mode</Label>
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
                <Label htmlFor="entry-ticket">Ticket size USD</Label>
                <Input
                  id="entry-ticket"
                  inputMode="numeric"
                  value={profile.investmentSizeUsd}
                  onChange={(event) => updateNumber("investmentSizeUsd", event.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  {ticketPresets.map((ticket) => (
                    <Button
                      key={ticket.value}
                      type="button"
                      size="sm"
                      variant={profile.investmentSizeUsd === ticket.value ? "default" : "outline"}
                      onClick={() => updateProfile("investmentSizeUsd", ticket.value)}
                    >
                      {ticket.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="entry-risk">Risk appetite</Label>
                <Select
                  value={profile.riskAppetite}
                  onValueChange={(riskAppetite: RiskAppetite) =>
                    updateProfile("riskAppetite", riskAppetite)
                  }
                >
                  <SelectTrigger id="entry-risk" className="w-full">
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
                <Label htmlFor="entry-readiness">Minimum readiness</Label>
                <Input
                  id="entry-readiness"
                  inputMode="numeric"
                  max={100}
                  min={0}
                  value={profile.minimumReadiness}
                  onChange={(event) => updateNumber("minimumReadiness", event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="entry-irr">Target IRR %</Label>
                <Input
                  id="entry-irr"
                  inputMode="decimal"
                  value={profile.targetIrrPct}
                  onChange={(event) => updateNumber("targetIrrPct", event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Preferred regions</Label>
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
            </div>

            <div className="grid gap-2">
              <Label>Strategic priorities</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {compactPriorityOptions.map((priority) => {
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
                      <Target className="h-4 w-4" />
                      {priority.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Button type="button" onClick={continueToProfile} className="w-full">
              <Sparkles className="h-4 w-4" />
              Save entry and view matches
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
