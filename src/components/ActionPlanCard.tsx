import { HealthReport } from "../utils/score";
import { ListChecks } from "lucide-react";
import { Language, translations } from "../utils/translations";

interface ActionPlanCardProps {
  report: HealthReport;
  lang: Language;
}

export default function ActionPlanCard({ report, lang }: ActionPlanCardProps) {
  const t = translations[lang].ui;
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <ListChecks className="w-5 h-5 text-emerald-500" />
        <h2 className="text-lg font-bold text-slate-900">{t.actionPlan}</h2>
      </div>

      <div className="space-y-3">
        {report.actions.nextSteps.map((step, i) => (
          <div key={i} className="flex items-start gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-xs font-black text-slate-400 border border-slate-200 shrink-0">
              {i + 1}
            </span>
            <p className="text-sm font-semibold text-slate-700 leading-snug">
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
