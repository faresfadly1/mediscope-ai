import { LifestyleData } from "../utils/score";
import { Moon, Activity, Zap } from "lucide-react";
import { Language, translations } from "../utils/translations";

interface LifestyleFormProps {
  data: LifestyleData;
  onChange: (data: LifestyleData) => void;
  lang: Language;
}

export default function LifestyleForm({ data, onChange, lang }: LifestyleFormProps) {
  const t = translations[lang].ui;
  const levels: ("Low" | "Moderate" | "High")[] = ["Low", "Moderate", "High"];

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Moon className="w-4 h-4 text-blue-500" />
          {t.sleepHours}
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="3"
            max="12"
            step="0.5"
            value={data.sleepHours}
            onChange={(e) => onChange({ ...data, sleepHours: parseFloat(e.target.value) })}
            className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-lg font-bold text-slate-900 min-w-[3rem] text-right">
            {data.sleepHours}{t.h}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Activity className="w-4 h-4 text-emerald-500" />
          {t.activityLevel}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => onChange({ ...data, activityLevel: level })}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                data.activityLevel === level
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-100 scale-[1.02]"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {(t[level.toLowerCase() as keyof typeof t] as string) || level}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Zap className="w-4 h-4 text-amber-500" />
          {t.stressLevel}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => onChange({ ...data, stressLevel: level })}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                data.stressLevel === level
                  ? "bg-amber-500 text-white shadow-md shadow-amber-100 scale-[1.02]"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {(t[level.toLowerCase() as keyof typeof t] as string) || level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
