import { HealthReport } from "../utils/score";
import { ShieldAlert, Fingerprint, Eye, ClipboardList } from "lucide-react";
import { Language, translations } from "../utils/translations";

interface SafetyConfidenceCardProps {
  report: HealthReport;
  lang: Language;
}

export default function SafetyConfidenceCard({ report, lang }: SafetyConfidenceCardProps) {
  const t = translations[lang].ui;
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <ShieldAlert className="w-5 h-5 text-slate-400" />
        <h2 className="text-lg font-bold text-slate-900">{t.safetyDisclaimer}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Eye className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{t.imageQuality as string}</span>
          </div>
          <p className="font-bold text-slate-900 capitalize">{(t[report.confidence.imageQuality as keyof typeof t] as string) || report.confidence.imageQuality}</p>
          <p className="text-[9px] text-slate-500 leading-tight mt-1">{report.confidence.imageClarityFeedback}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Fingerprint className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{t.extractionConfidence}</span>
          </div>
          <p className="font-bold text-slate-900">{report.confidence.extractionConfidence}%</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <ClipboardList className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{t.dataCompleteness as string}</span>
          </div>
          <p className="font-bold text-slate-900 capitalize">{(t[report.confidence.dataCompleteness.toLowerCase() as keyof typeof t] as string) || report.confidence.dataCompleteness}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <ShieldAlert className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{t.priority as string}</span>
          </div>
          <p className="font-bold text-slate-900 capitalize">{(t[report.actions.followUpPriority as keyof typeof t] as string) || report.actions.followUpPriority}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 font-medium leading-relaxed">
        {report.safety.disclaimer}
      </div>
    </div>
  );
}
