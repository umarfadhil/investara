import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type DecisionSectionProps = {
  icon: LucideIcon;
  title: string;
  metric: string;
  insight: string;
  evidence?: string[];
  diligenceFocus?: string;
  sources?: string[];
};

export function DecisionSection({
  icon: Icon,
  title,
  metric,
  insight,
  evidence = [],
  diligenceFocus,
  sources = [],
}: DecisionSectionProps) {
  return (
    <div className="border-t border-border/70 py-5 first:border-t-0 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            <span className="max-w-[48%] text-right font-mono text-xs text-muted-foreground break-words">
              {metric}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{insight}</p>
          {evidence.length ? (
            <ul className="mt-3 space-y-2 text-sm leading-6 text-foreground">
              {evidence.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {diligenceFocus ? (
            <div className="mt-3 rounded-md border border-border/70 bg-secondary/20 p-3">
              <p className="text-[11px] font-medium uppercase tracking-normal text-muted-foreground">
                Diligence focus
              </p>
              <p className="mt-1 text-sm leading-6 text-foreground">{diligenceFocus}</p>
            </div>
          ) : null}
          {sources.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {sources.map((source) => (
                <Badge
                  key={source}
                  variant="outline"
                  className="h-auto min-h-5 justify-start whitespace-normal text-left"
                >
                  {source}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
