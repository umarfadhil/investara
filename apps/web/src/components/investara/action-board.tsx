"use client";

import { useState } from "react";
import { CheckCircle2, Clock3, Handshake, Landmark, ListPlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InvestorAction } from "@/types/investara";

const actionIcons = {
  shortlist: CheckCircle2,
  request_intro: Handshake,
  contact_bkpm: Landmark,
  diligence: Clock3,
};

type ActionBoardProps = {
  initialActions: InvestorAction[];
};

export function ActionBoard({ initialActions }: ActionBoardProps) {
  const [actions, setActions] = useState(initialActions);

  function advanceAction(actionId: string) {
    setActions((current) =>
      current.map((action) => {
        if (action.id !== actionId || action.status === "completed") {
          return action;
        }

        return {
          ...action,
          status: action.status === "open" ? "in_progress" : "completed",
        };
      }),
    );
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ListPlus className="h-4 w-4 text-primary" />
          Investor action flow
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action) => {
          const Icon = actionIcons[action.type];
          return (
            <div
              key={action.id}
              className="flex flex-col gap-3 rounded-md border border-border/70 bg-secondary/30 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-sm">{action.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {action.status.replace("_", " ")}
                </Badge>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={action.status === "completed"}
                  onClick={() => advanceAction(action.id)}
                >
                  Update
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

