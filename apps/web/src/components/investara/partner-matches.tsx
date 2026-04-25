import { Handshake } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Partner } from "@/types/investara";

type PartnerMatchesProps = {
  partners: Partner[];
  regionId?: string;
  sector?: string;
};

export function PartnerMatches({ partners, regionId, sector }: PartnerMatchesProps) {
  const visiblePartners = partners
    .filter((partner) => !regionId || partner.regionId === regionId)
    .filter((partner) => !sector || partner.sectors.includes(sector))
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Handshake className="h-4 w-4 text-primary" />
          Local partner matches
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {visiblePartners.map((partner) => (
          <div key={partner.id} className="rounded-md border border-border/70 bg-secondary/30 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium">{partner.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {partner.capabilities.join(" · ")}
                </p>
              </div>
              <Badge>{partner.matchScore}/100</Badge>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {partner.sectors.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
              <Button size="sm" variant="secondary">
                Request Introduction
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

