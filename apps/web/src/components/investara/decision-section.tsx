import type { LucideIcon } from "lucide-react";

type DecisionSectionProps = {
  icon: LucideIcon;
  title: string;
  metric: string;
  insight: string;
};

export function DecisionSection({ icon: Icon, title, metric, insight }: DecisionSectionProps) {
  return (
    <div className="border-t border-border/70 py-5 first:border-t-0 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            <span className="font-mono text-xs text-muted-foreground">{metric}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{insight}</p>
        </div>
      </div>
    </div>
  );
}

