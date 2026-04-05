import React from 'react';
import { Language, translations } from '../utils/translations';
import { useHealth } from '../context/HealthContext';
import { LogOut, Globe, UserCircle, Stethoscope } from 'lucide-react';
import { motion } from 'motion/react';
import mediscopeLogo from '../assets/mediscope-logo.png';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onHome: () => void;
}

export default function Header({ lang, setLang, onHome }: HeaderProps) {
  const { user, logout } = useHealth();
  const t = translations[lang].ui;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-50 bg-white/90 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button 
          onClick={onHome}
          className="group flex items-center justify-center sm:justify-start"
        >
          <img
            src={mediscopeLogo}
            alt={t.appName}
            className="h-12 w-auto object-contain transition-transform group-hover:scale-[1.02] sm:h-14 lg:h-16"
          />
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:gap-6">
          <div className="flex flex-wrap items-center justify-center gap-1 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-sm sm:justify-start">
            <div className="hidden p-2 text-slate-300 sm:block">
              <Globe className="w-4 h-4" />
            </div>
            {(['en', 'tr', 'ar'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`min-w-[5.25rem] rounded-xl px-3 py-2 text-[11px] font-black uppercase tracking-wide transition-all sm:px-4 sm:text-xs sm:tracking-widest ${
                  lang === l ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                {l === 'en' ? 'English' : l === 'tr' ? 'Türkçe' : 'العربية'}
              </button>
            ))}
          </div>

          {user && (
            <div className="flex items-center justify-center gap-3 border-t border-slate-100 pt-3 sm:border-t-0 sm:border-l sm:pl-4 sm:pt-0">
              <div className="flex min-w-0 items-center gap-3">
                <div className="hidden text-right md:block">
                  <p className="truncate text-sm font-black leading-none text-slate-900">{user.fullName}</p>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                    {user.role === 'patient' ? t.auth.patient : t.auth.doctor}
                  </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  {user.role === 'patient' ? <UserCircle className="w-6 h-6" /> : <Stethoscope className="w-6 h-6" />}
                </div>
              </div>
              <button
                onClick={logout}
                className="rounded-xl bg-slate-50 p-2.5 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
                title={t.auth.signOut}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
