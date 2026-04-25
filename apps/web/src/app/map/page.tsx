import Link from "next/link";

import { InvestmentMap } from "@/components/investara/investment-map";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/mock-projects";

export default function MapPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-5 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Indonesia geospatial intelligence</p>
          <h1 className="text-2xl font-semibold">Investment Map</h1>
        </div>
        <Button asChild variant="secondary">
          <Link href="/">Back to workspace</Link>
        </Button>
      </div>
      <InvestmentMap projects={projects} />
    </main>
  );
}

