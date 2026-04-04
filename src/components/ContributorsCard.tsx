import { HelpCircle, AlertCircle } from "lucide-react";
import { HealthReport } from "../utils/score";
import { Language, translations } from "../utils/translations";

interface ContributorsCardProps {
  report: HealthReport;
  lang: Language;
}

export default function ContributorsCard({ report, lang }: ContributorsCardProps) {
  const contributors = report.decisionSupport.possibleContributors;
  const t = translations[lang].ui;

  if (!contributors || contributors.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <HelpCircle className="w-3 h-3" />
          {t.possibleContributors}
        </h3>
      </div>

      <div className="grid gap-4">
        {contributors.map((contributor, i) => (
          <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-colors">
            <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
            <p className="text-slate-700 font-medium leading-relaxed">
              {contributor}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-4 flex items-start gap-2 border-t border-slate-100">
        <AlertCircle className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
        <p className="text-[10px] font-bold text-slate-400 leading-tight italic">
          {t.contributorsSafetyNote}
        </p>
      </div>
    </div>
  );
}
