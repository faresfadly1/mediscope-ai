import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Stethoscope, Loader2, RefreshCcw, LayoutDashboard } from "lucide-react";
import UploadBox from "./UploadBox";
import LifestyleForm from "./LifestyleForm";
import ScoreCards from "./ScoreCards";
import FindingsCard from "./FindingsCard";
import CorrelationCard from "./CorrelationCard";
import ActionPlanCard from "./ActionPlanCard";
import SafetyConfidenceCard from "./SafetyConfidenceCard";
import WhatIfCard from "./WhatIfCard";
import DecisionSupportCard from "./DecisionSupportCard";
import ContributorsCard from "./ContributorsCard";
import { LifestyleData, buildHealthReport, HealthReport } from "../utils/score";
import { RawAnalysisResult, analyzeMedicalImage } from "../utils/gemini";
import { Language, translations } from "../utils/translations";

interface ReportAnalysisFlowProps {
  lang: Language;
  onBack: () => void;
}

export default function ReportAnalysisFlow({ lang, onBack }: ReportAnalysisFlowProps) {
  const [file, setFile] = useState<File | null>(null);
  const [lifestyle, setLifestyle] = useState<LifestyleData>({
    sleepHours: 7,
    activityLevel: "Moderate",
    stressLevel: "Moderate",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [rawAnalysis, setRawAnalysis] = useState<RawAnalysisResult | null>(null);
  const [report, setReport] = useState<HealthReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = translations[lang].ui;
  const common = translations[lang].ui.common;

  const LOADING_STEPS = [
    t.analyzing,
    t.analyzing,
    t.analyzing,
    t.analyzing
  ];

  useEffect(() => {
    if (rawAnalysis) {
      const updatedReport = buildHealthReport(rawAnalysis, lifestyle, lang);
      setReport(updatedReport);
    }
  }, [lang]);

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setLoadingStep(0);
    setError(null);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;
      const result = await analyzeMedicalImage(base64, file.type);
      const healthReport = buildHealthReport(result, lifestyle, lang);

      setRawAnalysis(result);
      setReport(healthReport);
    } catch (err) {
      console.error(err);
      setError(t.error);
    } finally {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setRawAnalysis(null);
    setReport(null);
    setError(null);
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-xs transition-colors"
        >
          <RefreshCcw className="w-3 h-3 rotate-180" />
          {common.backToDashboard}
        </button>
      </div>
      <AnimatePresence mode="wait">
        {!report ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid lg:grid-cols-12 gap-8 items-start"
          >
            <div className="lg:col-span-5 space-y-8">
              <section className="space-y-4">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  {t.uploadReport}
                </h2>
                <UploadBox onFileSelect={setFile} lang={lang} />
              </section>

              <section className="space-y-4">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  {t.lifestyleInfo}
                </h2>
                <LifestyleForm data={lifestyle} onChange={setLifestyle} lang={lang} />
              </section>

              <button
                disabled={!file || isAnalyzing}
                onClick={handleAnalyze}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                  !file || isAnalyzing
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98]"
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {LOADING_STEPS[loadingStep]}
                  </>
                ) : (
                  t.analyze
                )}
              </button>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-rose-500 text-sm font-semibold text-center"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <div className="lg:col-span-7 hidden lg:block">
              <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-12 border border-white/60 flex flex-col items-center justify-center text-center space-y-6 h-full min-h-[500px]">
                <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
                  <Stethoscope className="w-12 h-12 text-blue-200" />
                </div>
                <div className="max-w-xs">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t.noReport.split('.')[0]}</h3>
                  <p className="text-slate-500 leading-relaxed">
                    {t.noReport.split('.')[1] || t.noReport}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-blue-600" />
                {t.insight}
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-xs transition-colors"
                >
                  <RefreshCcw className="w-3 h-3" />
                  {t.analyze}
                </button>
              </div>
            </div>

            <div className="space-y-12">
              <DecisionSupportCard report={report} lang={lang} />

              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t.insight}</h3>
                <p className="text-xl font-bold text-slate-900 leading-relaxed italic">
                  "{report.correlation.insight}"
                </p>
              </div>

              <ScoreCards report={report} lang={lang} />

              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-12">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Activity className="w-3 h-3" />
                      {t.clinicalFindings}
                    </h3>
                    <FindingsCard report={report} lang={lang} />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Activity className="w-3 h-3" />
                      {t.combinedRisk}
                    </h3>
                    <CorrelationCard report={report} lang={lang} />
                  </div>
                </div>

                <div className="space-y-12">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Activity className="w-3 h-3" />
                      {t.actionPlan}
                    </h3>
                    <ActionPlanCard report={report} lang={lang} />
                  </div>
                  
                  <WhatIfCard rawAnalysis={rawAnalysis!} currentLifestyle={lifestyle} lang={lang} />
                  <ContributorsCard report={report} lang={lang} />
                  <SafetyConfidenceCard report={report} lang={lang} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
