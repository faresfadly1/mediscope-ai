import { HealthReport } from "../utils/score";
import { Zap, Link } from "lucide-react";
import { Language, translations } from "../utils/translations";

interface CorrelationCardProps {
  report: HealthReport;
  lang: Language;
}

export default function CorrelationCard({ report, lang }: CorrelationCardProps) {
  const t = translations[lang].ui;
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <Link className="w-5 h-5 text-indigo-500" />
        <h2 className="text-lg font-bold text-slate-900">{t.combinedRisk}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t.drivers}</h3>
          <ul className="space-y-3">
            {report.correlation.drivers.map((driver, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{driver.factor}</p>
                  <p className="text-[10px] font-medium text-slate-500 leading-tight">→ {driver.impact}</p>
                </div>
              </li>
            ))}
            {report.correlation.drivers.length === 0 && (
              <li className="text-sm text-slate-400 italic">{t.noReport}</li>
            )}
          </ul>
        </div>

        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-blue-900 uppercase tracking-widest">{t.insight}</h3>
          </div>
          <p className="text-sm leading-relaxed text-blue-900 font-medium italic">
            "{report.correlation.insight}"
          </p>
        </div>
      </div>
    </div>
  );
}
