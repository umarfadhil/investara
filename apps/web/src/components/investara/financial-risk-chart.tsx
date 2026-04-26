"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type FinancialRiskChartProps = {
  irr: number;
  readiness: number;
};

const currencyFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function FinancialRiskChart({ irr, readiness }: FinancialRiskChartProps) {
  const cashflow = [
    { year: "Y1", revenue: 8, cost: 18 },
    { year: "Y2", revenue: 22, cost: 26 },
    { year: "Y3", revenue: 41, cost: 31 },
    { year: "Y4", revenue: 58, cost: 36 },
    { year: "Y5", revenue: 73, cost: 41 },
  ];

  const risks = [
    { name: "Regulatory", value: 54 },
    { name: "Market", value: Math.max(35, 78 - irr * 2) },
    { name: "Operational", value: Math.max(28, 92 - readiness) },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="h-[260px] rounded-lg border border-border/70 bg-secondary/20 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium">Revenue vs cost assumptions</h3>
          <span className="font-mono text-xs text-muted-foreground">USD millions</span>
        </div>
        <ResponsiveContainer width="100%" height="86%">
          <LineChart data={cashflow}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="year" stroke="var(--muted-foreground)" tickLine={false} />
            <YAxis
              stroke="var(--muted-foreground)"
              tickFormatter={(value) => `$${currencyFormatter.format(Number(value))}`}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[260px] rounded-lg border border-border/70 bg-secondary/20 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium">Risk breakdown</h3>
          <span className="font-mono text-xs text-muted-foreground">0 low / 100 high</span>
        </div>
        <ResponsiveContainer width="100%" height="86%">
          <BarChart data={risks} layout="vertical">
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} stroke="var(--muted-foreground)" />
            <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" width={88} />
            <Tooltip
              cursor={{ fill: "var(--muted)" }}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
              }}
            />
            <Bar dataKey="value" fill="var(--primary)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
