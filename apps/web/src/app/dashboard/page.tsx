"use client";

import Link from "next/link";

import { ActionBoard } from "@/components/investara/action-board";
import { LanguageSwitcher } from "@/components/investara/language-switcher";
import { useLanguage } from "@/components/investara/language-provider";
import { PartnerMatches } from "@/components/investara/partner-matches";
import { ThemeToggle } from "@/components/investara/theme-toggle";
import { Button } from "@/components/ui/button";
import { featuredProject } from "@/data/mock-projects";
import { investorActions, partners } from "@/data/mock-partners";

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">{t("dashboard.eyebrow")}</p>
          <h1 className="text-2xl font-semibold">{t("dashboard.title")}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild variant="secondary">
            <Link href="/">{t("common.backDiscovery")}</Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ActionBoard initialActions={investorActions} />
        <PartnerMatches
          partners={partners}
          regionId={featuredProject.region.id}
          sector={featuredProject.sector}
        />
      </div>
    </main>
  );
}
