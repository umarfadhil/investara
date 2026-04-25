"use client";

import dynamic from "next/dynamic";

import type { Project } from "@/types/investara";

const InvestmentMapClient = dynamic(
  () => import("@/components/investara/investment-map-client").then((mod) => mod.InvestmentMapClient),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-[620px] place-items-center rounded-lg border border-border bg-card">
        <p className="text-sm text-muted-foreground">Loading investment map...</p>
      </div>
    ),
  },
);

type InvestmentMapProps = {
  projects: Project[];
};

export function InvestmentMap(props: InvestmentMapProps) {
  return <InvestmentMapClient {...props} />;
}

