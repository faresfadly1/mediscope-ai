import { HealthReport } from "../utils/score";
import { AlertTriangle, ShieldCheck, Activity } from "lucide-react";
import { Language, translations } from "../utils/translations";

interface ScoreCardsProps {
  report: HealthReport;
  lang: Language;
}

export default function ScoreCards({ report, lang }: ScoreCardsProps) {
  const t = translations[lang].ui;
  const cards = [
    {
      label: t.clinicalRisk,
      score: report.clinical.clinicalRiskScore,
      level: report.clinical.clinicalRiskLevel,
      icon: <Activity className="w-4 h-4" />,
      color: report.clinical.clinicalRiskScore < 25 ? "emerald" : report.clinical.clinicalRiskScore < 55 ? "amber" : "rose"
    },
    {
      label: t.lifestyleFoundation,
      score: report.lifestyle.lifestyleScore,
      level: report.lifestyle.lifestyleRiskLevel,
      icon: <ShieldCheck className="w-4 h-4" />,
      color: report.lifestyle.lifestyleScore >= 80 ? "emerald" : report.lifestyle.lifestyleScore >= 60 ? "amber" : "rose"
    },
    {
      label: t.combinedRisk,
      score: report.correlation.combinedRiskScore,
      level: report.correlation.combinedRiskLevel,
      icon: <AlertTriangle className="w-4 h-4" />,
      color: report.correlation.combinedRiskScore < 25 ? "emerald" : report.correlation.combinedRiskScore < 55 ? "amber" : "rose"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
            <div className={`text-${card.color}-500`}>{card.icon}</div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{card.score}</span>
            <span className="text-xs font-medium text-slate-400">/ 100</span>
          </div>
          <div className={`mt-3 inline-block px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border
            ${card.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
              card.color === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
              'bg-rose-50 text-rose-700 border-rose-100'}`}>
            {card.level}
          </div>
        </div>
      ))}
    </div>
  );
}
