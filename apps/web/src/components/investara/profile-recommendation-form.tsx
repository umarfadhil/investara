"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { rankProjects } from "@/lib/recommendations";
import type { InvestorProfile, RiskAppetite } from "@/types/investara";

type ProfileRecommendationFormProps = {
  initialProfile: InvestorProfile;
};

export function ProfileRecommendationForm({ initialProfile }: ProfileRecommendationFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const recommendations = useMemo(() => rankProjects(profile, projects), [profile]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">Profile inputs</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="sector">Sector</Label>
            <Select
              value={profile.sector}
              onValueChange={(sector) => setProfile((current) => ({ ...current, sector }))}
            >
              <SelectTrigger id="sector">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Renewable Energy">Renewable Energy</SelectItem>
                <SelectItem value="Logistics">Logistics</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ticket">Investment size USD</Label>
            <Input
              id="ticket"
              inputMode="numeric"
              value={profile.investmentSizeUsd}
              onChange={(event) =>
                setProfile((current) => ({
                  ...current,
                  investmentSizeUsd: Number(event.target.value) || 0,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="risk">Risk appetite</Label>
            <Select
              value={profile.riskAppetite}
              onValueChange={(riskAppetite: RiskAppetite) =>
                setProfile((current) => ({ ...current, riskAppetite }))
              }
            >
              <SelectTrigger id="risk">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => setSavedAt(new Date().toLocaleTimeString())}
            className="w-full"
          >
            <Save className="h-4 w-4" />
            Save profile
          </Button>
          {savedAt ? (
            <p className="text-xs text-muted-foreground">Saved locally at {savedAt}.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">Ranked project matches</CardTitle>
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
                    Brief
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
  );
}

