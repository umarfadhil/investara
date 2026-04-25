type ScoreRingProps = {
  score: number;
  label: string;
};

export function ScoreRing({ score, label }: ScoreRingProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="grid size-16 place-items-center rounded-full border border-primary/30 bg-primary/10 font-mono text-lg font-semibold text-primary"
        style={{
          backgroundImage: `conic-gradient(var(--primary) ${score * 3.6}deg, transparent 0deg)`,
        }}
      >
        <div className="grid size-12 place-items-center rounded-full bg-card">{score}</div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">AI-calibrated project signal</p>
      </div>
    </div>
  );
}

