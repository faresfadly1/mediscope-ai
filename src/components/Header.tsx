import React from 'react';
import { Language, translations } from '../utils/translations';
import { useHealth } from '../context/HealthContext';
import { LogOut, Globe, UserCircle, Stethoscope } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onHome: () => void;
}

export default function Header({ lang, setLang, onHome }: HeaderProps) {
  const { user, logout } = useHealth();
  const t = translations[lang].ui;
  const logoSrc = `${import.meta.env.BASE_URL}mediscope-logo.png`;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-50 px-8 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button 
          onClick={onHome}
          className="flex items-center gap-3 group"
        >
          <img
            src={logoSrc}
            alt={t.appName}
            className="h-16 w-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
        </button>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-2 text-slate-300">
              <Globe className="w-4 h-4" />
            </div>
            {(['en', 'tr', 'ar'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  lang === l ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                {l === 'en' ? 'English' : l === 'tr' ? 'Türkçe' : 'العربية'}
              </button>
            ))}
          </div>

          {user && (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-black text-slate-900 leading-none">{user.fullName}</p>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                    {user.role === 'patient' ? t.auth.patient : t.auth.doctor}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  {user.role === 'patient' ? <UserCircle className="w-6 h-6" /> : <Stethoscope className="w-6 h-6" />}
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
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
