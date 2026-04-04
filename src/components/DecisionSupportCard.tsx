import { HealthReport } from "../utils/score";
import { AlertCircle, CheckCircle2, Info, ArrowRight } from "lucide-react";
import { Language, translations } from "../utils/translations";

interface DecisionSupportCardProps {
  report: HealthReport;
  lang: Language;
}

export default function DecisionSupportCard({ report, lang }: DecisionSupportCardProps) {
  const t = translations[lang].ui;
  const decision = report.decisionSupport;

  const colors = {
    low: "bg-emerald-50 border-emerald-200 text-emerald-900",
    moderate: "bg-amber-50 border-amber-200 text-amber-900",
    high: "bg-rose-50 border-rose-200 text-rose-900"
  };

  const iconColors = {
    low: "text-emerald-500",
    moderate: "text-amber-500",
    high: "text-rose-500"
  };

  const Icons = {
    low: CheckCircle2,
    moderate: Info,
    high: AlertCircle
  };

  const Icon = Icons[decision.level];

  return (
    <div className={`rounded-[2.5rem] border-2 p-10 shadow-2xl shadow-black/5 ${colors[decision.level]}`}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-white/60 w-fit">
            <div className={`w-2 h-2 rounded-full animate-pulse ${decision.level === 'high' ? 'bg-rose-500' : decision.level === 'moderate' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.systemVerdict}</p>
          </div>
          <div className="flex items-center gap-4">
            <Icon className={`w-12 h-12 ${iconColors[decision.level]}`} />
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
              {t.concernLevel}: {decision.title}
            </h2>
          </div>
        </div>
        <div className="px-6 py-3 rounded-2xl bg-white/40 border border-white/60 text-[11px] font-black uppercase tracking-widest opacity-60 text-center md:text-right">
          {t.decisionPoweredBy.split(',')[0]}<br/>{t.decisionPoweredBy.split(',')[1] || ""}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-12">
        {/* Verdict & Meaning */}
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <p className="text-3xl font-black leading-tight tracking-tight">
                {decision.verdict}
              </p>
              <div className="p-8 rounded-[2rem] bg-white/60 border border-white shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-widest opacity-40 mb-3">{t.whatThisMeans}</p>
                <p className="text-xl font-bold leading-relaxed text-slate-800">
                  {decision.meaning}
                </p>
              </div>

              {/* Immediate Safe Actions */}
              <div className="p-8 rounded-[2rem] bg-white/60 border border-white shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-widest opacity-40 mb-3">{t.immediateActions}</p>
                <ul className="space-y-3">
                  {decision.immediateActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg font-bold text-slate-800 leading-tight">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specific Report Insights */}
              {decision.specificMessages && (decision.specificMessages.lines.length > 0 || decision.specificMessages.actions.length > 0) && (
                <div className="p-8 rounded-[2rem] bg-black/5 border border-black/5 space-y-6">
                  {decision.specificMessages.lines.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Report Insights</p>
                      <ul className="space-y-1">
                        {decision.specificMessages.lines.map((line, i) => (
                          <li key={i} className="text-sm font-bold text-slate-700 italic">
                            • {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {decision.specificMessages.actions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Suggested Adjustments</p>
                      <ul className="space-y-1">
                        {decision.specificMessages.actions.map((action, i) => (
                          <li key={i} className="text-sm font-bold text-blue-700">
                            → {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Human Layer */}
            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-black/5 border border-black/5 italic text-sm font-medium opacity-70">
              <Info className="w-5 h-5 shrink-0" />
              {decision.humanLayer}
            </div>
          </div>

          {/* Key Drivers */}
          <div className="lg:col-span-5">
            <div className="h-full p-8 rounded-[2rem] bg-white/40 border border-white/60 flex flex-col">
              <p className="text-[11px] font-black uppercase tracking-widest opacity-40 mb-6">{t.keyDrivers}</p>
              <div className="space-y-4 flex-grow">
                {decision.keyDrivers.map((driver, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-white shadow-sm group hover:bg-white transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${decision.level === 'high' ? 'bg-rose-100 text-rose-600' : decision.level === 'moderate' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {i + 1}
                    </div>
                    <p className="text-lg font-black tracking-tight">{driver}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Why & Action */}
        <div className="grid md:grid-cols-2 gap-10 pt-10 border-t border-black/5">
          <div className="space-y-4">
            <p className="text-[11px] font-black uppercase tracking-widest opacity-40">{t.whyDataBacked}</p>
            <div className="p-6 rounded-2xl bg-black/5 font-mono font-bold text-sm leading-relaxed border border-black/5">
              {decision.why}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[11px] font-black uppercase tracking-widest opacity-40">{t.whatToDoNow}</p>
            <div className="flex items-start gap-5 p-8 rounded-[2rem] bg-white border-2 border-blue-100 shadow-xl shadow-blue-500/5">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                <ArrowRight className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-black leading-tight text-slate-900 tracking-tight whitespace-pre-line">
                  {decision.action}
                </div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{t.priorityAction}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
