"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  Factory,
  Globe2,
  Handshake,
  Landmark,
  Languages,
  Leaf,
  Map,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingUp,
  Users,
  Waves,
} from "lucide-react";

import { DiscoverEntryPanel } from "@/components/investara/discover-entry-panel";
import { LanguageSwitcher } from "@/components/investara/language-switcher";
import { useLanguage } from "@/components/investara/language-provider";
import { ProjectCard } from "@/components/investara/project-card";
import { ScoreRing } from "@/components/investara/score-ring";
import { ThemeToggle } from "@/components/investara/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  bkpmOpportunitySnapshot,
  featuredProject,
  investorProfile,
  projects,
} from "@/data/mock-projects";

const heroImage =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Piaynemo%20Island,%20Raja%20Ampat,%20West%20Papua,%20Indonesia.jpg";

const wholeNumberFormatter = new Intl.NumberFormat("en-US");

const discoverySignals = [
  {
    title: "Archipelago Beauty",
    copy: "Lead investors from place to opportunity with Indonesia's islands, ports, tourism magnets, and regional identity in view.",
    icon: Waves,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Piaynemo%20Island,%20Raja%20Ampat,%20West%20Papua,%20Indonesia.jpg",
  },
  {
    title: "Domestic Market",
    copy: "Frame demand across city growth, logistics corridors, industrial estates, and consumers moving through a connected island economy.",
    icon: TrendingUp,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jakarta%20Skyline%20by%20judhi.jpg",
  },
  {
    title: "Culture & Confidence",
    copy: "Make local context part of the diligence path, from heritage and creative industries to trusted regional partners.",
    icon: Landmark,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Borobudur%20Sunrise%202012-01-05.jpg",
  },
  {
    title: "Demographic Dividend",
    copy: `${featuredProject.region.name} example: ${wholeNumberFormatter.format(featuredProject.region.workforce)} workforce in the BKPM-sourced regional profile.`,
    icon: Users,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/School%20students%20in%20Indonesia%20taking%20part%20in%20Wikimedia%20Design%20Research.jpg",
  },
  {
    title: "Natural Resources",
    copy: "Connect resources to downstream sectors such as renewable energy, logistics, food processing, mining services, and manufacturing.",
    icon: Sprout,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Sulawesi%2C%20Indonesia%20%28PIA26007%29.jpg",
  },
];

const journeySteps = [
  {
    number: "1",
    title: "Discover & Entry",
    copy: "Capture the first investor intent and carry it into the profile and ranking flow.",
    href: "#discover-entry",
    cta: "Start entry",
    icon: Compass,
  },
  {
    number: "2",
    title: "Profile Setup",
    copy: "Define sector, ticket size, risk appetite, and preferred regions in under two minutes.",
    href: "/profile",
    cta: "Set profile",
    icon: BriefcaseBusiness,
  },
  {
    number: "3",
    title: "AI Recommendations",
    copy: "Rank projects by fit, readiness, score, and investor-specific match reasons.",
    href: "/profile",
    cta: "View matches",
    icon: Sparkles,
  },
  {
    number: "4",
    title: "Project Insights",
    copy: "Open an investment decision brief with financial, risk, ecosystem, and readiness signals.",
    href: `/projects/${featuredProject.id}`,
    cta: "Open brief",
    icon: BarChart3,
  },
  {
    number: "5",
    title: "Geospatial Explore",
    copy: "Compare opportunities through an Indonesia map filtered by sector, region, and readiness.",
    href: "/map",
    cta: "Explore map",
    icon: Map,
  },
  {
    number: "6",
    title: "Partner Matching",
    copy: "Find relevant local partners, government desks, and ecosystem players for execution.",
    href: "/dashboard",
    cta: "Find partners",
    icon: Handshake,
  },
  {
    number: "7",
    title: "Decision & Action",
    copy: "Save shortlist, request introductions, contact the BKPM desk, and track diligence.",
    href: "/dashboard",
    cta: "Track action",
    icon: Send,
  },
];

const investorValues = [
  { label: "One portal for Indonesian opportunities", icon: Globe2 },
  { label: "Multilingual confidence for global investors", icon: Languages },
  { label: "AI-ranked projects that fit investor goals", icon: BadgeCheck },
  { label: "Decision briefs with the key diligence signals", icon: BarChart3 },
  { label: "Map-led regional context", icon: MapPin },
  { label: "Faster path to local partners", icon: Handshake },
];

const impactSignals = [
  "Better access to regional investment information",
  "More focused investor-project matching",
  "Decision data prepared for global investors",
  "Higher-quality introductions for sustainable growth",
];

const formatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const previewProjects = projects.slice(0, 6);

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-background">
      <section
        className="relative overflow-hidden border-b border-white/15 bg-cover bg-center text-white"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(5, 17, 33, 0.9) 0%, rgba(8, 43, 54, 0.76) 44%, rgba(6, 16, 30, 0.3) 100%), url("${heroImage}")`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(20,184,166,0.28),transparent_34%),linear-gradient(180deg,rgba(2,6,23,0.18),rgba(2,6,23,0.78))]" />
        <div className="relative mx-auto flex min-h-[86svh] w-full max-w-7xl flex-col px-5 py-5 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="flex w-fit items-center gap-3">
              <div className="grid size-10 place-items-center rounded-md bg-white/12 ring-1 ring-white/25 backdrop-blur">
                <Landmark className="h-5 w-5 text-cyan-200" />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-normal">Investara</p>
                <p className="text-xs text-cyan-50/75">{t("brand.tagline")}</p>
              </div>
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle className="border-white/20 bg-white/10 shadow-none" />
              <Button asChild variant="secondary" size="sm">
                <Link href="/profile">{t("nav.profile")}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/map">
                  {t("nav.map")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </header>

          <div className="flex flex-1 items-center py-12 sm:py-16 lg:py-20">
            <div className="max-w-4xl space-y-8">
              <div className="inline-flex w-fit flex-wrap items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-50 backdrop-blur">
                <Sparkles className="h-4 w-4 text-amber-200" />
                {t("landing.eyebrow")}
              </div>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-7xl">
                  {t("landing.heroTitle")}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-cyan-50/82 sm:text-lg">
                  {t("landing.heroCopy")}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="#discover-entry">
                    {t("landing.findCta")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/35 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  <Link href={`/projects/${featuredProject.id}`}>{t("landing.openBrief")}</Link>
                </Button>
              </div>
              <div className="grid max-w-3xl gap-3 sm:grid-cols-3">
                {[
                  [t("landing.profileMatch"), investorProfile.sector],
                  [
                    t("landing.featuredScore"),
                    `${bkpmOpportunitySnapshot.totalProjects} BKPM opportunities`,
                  ],
                  [t("landing.languages"), "EN / ZH / JA / KO"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-md border border-white/18 bg-white/10 p-4 backdrop-blur"
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-cyan-50/65">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 text-xs text-cyan-50/70">
            <span>{t("landing.discoveryImage")}</span>
            <span>{t("landing.scrollHint")}</span>
          </div>
        </div>
      </section>

      <DiscoverEntryPanel initialProfile={investorProfile} />

      <section className="border-b border-border/70 bg-background">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <div className="space-y-4">
            <Badge className="w-fit">{t("landing.whyBadge")}</Badge>
            <h2 className="max-w-xl text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
              {t("landing.whyTitle")}
            </h2>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              {t("landing.whyCopy")}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {discoverySignals.map((signal) => {
              const Icon = signal.icon;

              return (
                <article
                  key={signal.title}
                  className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm shadow-black/5"
                >
                  {signal.image ? (
                    <div
                      className="h-36 bg-cover bg-center"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(2, 6, 23, 0.08), rgba(2, 6, 23, 0.36)), url("${signal.image}")`,
                      }}
                    />
                  ) : null}
                  <div className="space-y-3 p-5">
                    <div className="flex items-center gap-2">
                      <div className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="font-semibold">{signal.title}</h3>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{signal.copy}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border/70 bg-secondary/30">
        <div className="mx-auto w-full max-w-7xl space-y-8 px-5 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <Badge variant="outline" className="w-fit">
                {t("landing.journeyBadge")}
              </Badge>
              <h2 className="text-3xl font-semibold tracking-normal text-foreground">
                {t("landing.journeyTitle")}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {t("landing.journeyCopy")}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
            {journeySteps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="flex min-h-[250px] flex-col justify-between rounded-lg border border-border/70 bg-card p-4 shadow-sm shadow-black/5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        {step.number}
                      </span>
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold leading-5">{step.title}</h3>
                      <p className="text-xs leading-5 text-muted-foreground">{step.copy}</p>
                    </div>
                  </div>
                  <Link
                    href={step.href}
                    className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-primary"
                  >
                    {step.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border/70 bg-background">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <Badge className="w-fit">{t("landing.previewBadge")}</Badge>
              <h2 className="text-3xl font-semibold tracking-normal">
                {t("landing.previewTitle")}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {t("landing.previewCopy")}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["IRR", `${featuredProject.financials.irr}%`, BarChart3],
                [
                  "Ticket",
                  `$${formatter.format(featuredProject.investmentSizeUsd)}`,
                  BriefcaseBusiness,
                ],
                ["Readiness", `${featuredProject.readinessLevel}/100`, CheckCircle2],
                ["Workforce", formatter.format(featuredProject.region.workforce), Users],
              ].map(([label, value, icon]) => {
                const Icon = icon as typeof BarChart3;

                return (
                  <div
                    key={label as string}
                    className="rounded-lg border border-border/70 bg-card p-4"
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="h-4 w-4 text-primary" />
                      {label as string}
                    </div>
                    <p className="mt-3 font-mono text-2xl font-semibold text-foreground">
                      {value as string}
                    </p>
                  </div>
                );
              })}
            </div>
            <Button asChild>
              <Link href={`/projects/${featuredProject.id}`}>
                {t("landing.openDecisionBrief")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-border/70 bg-card p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-fit">
                    {featuredProject.source?.opportunityType ?? "Recommended PIR"}
                  </Badge>
                  <h3 className="max-w-xl text-xl font-semibold">{featuredProject.name}</h3>
                  <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                    {featuredProject.overview}
                  </p>
                </div>
                <ScoreRing score={featuredProject.attractivenessScore} label="Attractiveness" />
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  ["Region", featuredProject.region.name, MapPin],
                  ["Ecosystem", featuredProject.ecosystem.zones[0], Factory],
                  [
                    "Status",
                    featuredProject.source?.projectStatus || featuredProject.regulatory.complexityLevel,
                    ShieldCheck,
                  ],
                ].map(([label, value, icon]) => {
                  const Icon = icon as typeof MapPin;

                  return (
                    <div key={label as string} className="rounded-md bg-secondary/50 p-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                        {label as string}
                      </div>
                      <p className="mt-2 text-sm font-medium capitalize">{value as string}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {previewProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/30">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div className="space-y-5">
            <div className="space-y-3">
              <Badge variant="outline" className="w-fit">
                {t("landing.valueBadge")}
              </Badge>
              <h2 className="text-3xl font-semibold tracking-normal">
                {t("landing.valueTitle")}
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {investorValues.map((value) => {
                const Icon = value.icon;

                return (
                  <div
                    key={value.label}
                    className="flex min-h-24 items-start gap-3 rounded-lg border border-border/70 bg-card p-4"
                  >
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm font-medium leading-6">{value.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <Badge className="w-fit">{t("landing.impactBadge")}</Badge>
              <h2 className="text-3xl font-semibold tracking-normal">
                {t("landing.impactTitle")}
              </h2>
            </div>
            <div className="grid gap-3">
              {impactSignals.map((signal) => (
                <div
                  key={signal}
                  className="flex items-center gap-3 rounded-lg border border-border/70 bg-card p-4"
                >
                  <Leaf className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium">{signal}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/dashboard">
                  {t("landing.continueActions")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/map">{t("landing.compareRegions")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
