import { HealthReport } from "../utils/score";
import { ClipboardList } from "lucide-react";
import { Language, translations } from "../utils/translations";

interface FindingsCardProps {
  report: HealthReport;
  lang: Language;
}

export default function FindingsCard({ report, lang }: FindingsCardProps) {
  const t = translations[lang].ui;
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-bold text-slate-900">{t.clinicalFindings}</h2>
      </div>

      <div className="space-y-3">
        {report.clinical.findings.map((finding, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
            <div>
              <p className="font-bold text-slate-900">{finding.name}</p>
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{finding.value}</span>
                {finding.referenceRange && ` • ${t.referenceRange}: ${finding.referenceRange}`}
              </p>
              {finding.status !== 'normal' && (
                <div className="mt-2 flex items-start gap-2 bg-white/50 p-2 rounded-lg border border-slate-100">
                  <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <p className="text-[11px] font-medium text-slate-600 leading-tight">
                    <span className="font-bold text-slate-900">{t.implication}:</span> {finding.implication}
                  </p>
                </div>
              )}
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border
              ${finding.status === 'normal' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                finding.status === 'needs_attention' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                'bg-slate-100 text-slate-600 border-slate-200'}`}>
              {finding.status === 'normal' ? t.normal : finding.status === 'needs_attention' ? t.needsAttention : t.unclear}
            </div>
          </div>
        ))}
        {report.clinical.findings.length === 0 && (
          <p className="text-center py-4 text-slate-400 text-sm italic">{t.noReport}</p>
        )}
      </div>
    </div>
  );
}
