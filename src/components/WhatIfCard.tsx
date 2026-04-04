import { useState, useEffect } from "react";
import { LifestyleData, buildHealthReport, HealthReport } from "../utils/score";
import { RawAnalysisResult } from "../utils/gemini";
import { TrendingDown, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Language, translations } from "../utils/translations";

interface WhatIfCardProps {
  rawAnalysis: RawAnalysisResult;
  currentLifestyle: LifestyleData;
  lang: Language;
}

export default function WhatIfCard({ rawAnalysis, currentLifestyle, lang }: WhatIfCardProps) {
  const [improvedReport, setImprovedReport] = useState<HealthReport | null>(null);
  const currentReport = buildHealthReport(rawAnalysis, currentLifestyle, lang);
  const t = translations[lang].ui;

  useEffect(() => {
    const improvedLifestyle: LifestyleData = {
      sleepHours: Math.max(currentLifestyle.sleepHours, 8),
      activityLevel: "High",
      stressLevel: "Low",
    };
    setImprovedReport(buildHealthReport(rawAnalysis, improvedLifestyle, lang));
  }, [rawAnalysis, currentLifestyle, lang]);

  if (!improvedReport) return null;

  const improvement = currentReport.correlation.combinedRiskScore - improvedReport.correlation.combinedRiskScore;

  return (
    <div className="bg-slate-900 rounded-3xl p-8 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <TrendingDown className="w-32 h-32" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold">{t.whatIf}</h3>
        </div>

        <p className="text-slate-400 mb-8 max-w-md">
          {t.whatIfDesc}
        </p>

        <div className="flex items-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t.currentRisk}</p>
            <p className="text-4xl font-black text-slate-300">{currentReport.correlation.combinedRiskScore}</p>
          </div>
          <ArrowRight className="w-6 h-6 text-slate-700" />
          <div className="text-center">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">{t.potentialRisk}</p>
            <p className="text-4xl font-black text-emerald-400">{improvedReport.correlation.combinedRiskScore}</p>
          </div>
        </div>

        {improvement > 0 ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
            <p className="text-sm font-medium text-emerald-400">
              {t.potentialReduction} <span className="font-black text-lg">{improvement} {t.points}</span>.
            </p>
          </div>
        ) : (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
            <p className="text-sm font-medium text-blue-400">
              {t.alreadyOptimized}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
