import Link from "next/link";

import { ActionBoard } from "@/components/investara/action-board";
import { PartnerMatches } from "@/components/investara/partner-matches";
import { Button } from "@/components/ui/button";
import { featuredProject } from "@/data/mock-projects";
import { investorActions, partners } from "@/data/mock-partners";

export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Investor actions</p>
          <h1 className="text-2xl font-semibold">Action Dashboard</h1>
        </div>
        <Button asChild variant="secondary">
          <Link href="/">Back to workspace</Link>
        </Button>
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

