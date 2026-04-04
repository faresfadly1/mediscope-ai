interface ScoreBadgeProps {
  level: "Low" | "Moderate" | "High";
}

export default function ScoreBadge({ level }: ScoreBadgeProps) {
  const styles = {
    Low: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Moderate: "bg-amber-100 text-amber-700 border-amber-200",
    High: "bg-rose-100 text-rose-700 border-rose-200",
  };

  const labels = {
    Low: "Low Risk",
    Moderate: "Moderate Risk",
    High: "Action Recommended",
  };

  return (
    <div className={`px-4 py-2 rounded-full border text-sm font-bold tracking-tight shadow-sm ${styles[level]}`}>
      {labels[level]}
    </div>
  );
}
