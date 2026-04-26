"use client";

import Link from "next/link";

import { LanguageSwitcher } from "@/components/investara/language-switcher";
import { useLanguage } from "@/components/investara/language-provider";
import { ProfileRecommendationForm } from "@/components/investara/profile-recommendation-form";
import { ThemeToggle } from "@/components/investara/theme-toggle";
import { Button } from "@/components/ui/button";
import { investorProfile } from "@/data/mock-projects";

export default function ProfilePage() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">{t("profile.eyebrow")}</p>
          <h1 className="text-2xl font-semibold">{t("profile.title")}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild variant="secondary">
            <Link href="/">{t("common.backDiscovery")}</Link>
          </Button>
        </div>
      </div>
      <ProfileRecommendationForm initialProfile={investorProfile} />
    </main>
  );
}
