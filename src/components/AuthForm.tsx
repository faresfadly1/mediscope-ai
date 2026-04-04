import React, { useState } from 'react';
import { useHealth, UserRole } from '../context/HealthContext';
import { Language, translations } from '../utils/translations';
import { Mail, Lock, User, UserCircle, Stethoscope } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthFormProps {
  lang: Language;
  initialRole?: UserRole | null;
}

export default function AuthForm({ lang, initialRole }: AuthFormProps) {
  const { login, signUp } = useHealth();
  const t = translations[lang].ui.auth;
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole || 'patient');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await signUp(email, fullName, role);
    } else {
      await login(email, password);
    }
  };

  return (
    <div className="relative max-w-md w-full mx-auto overflow-hidden rounded-[3.5rem] border border-white/35 bg-white/38 p-10 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.42),rgba(255,255,255,0.14)_42%,rgba(191,219,254,0.12)_100%)]" />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-24 rounded-b-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute inset-[1px] rounded-[calc(3.5rem-1px)] border border-white/20" />
      <div className="relative text-center mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
          {isSignUp ? t.createAccount : t.welcomeBack}
        </h2>
        <p className="text-slate-600 font-semibold text-lg">
          {isSignUp ? t.hasAccount : t.noAccount}{' '}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 font-black hover:text-blue-700 hover:underline"
          >
            {isSignUp ? t.signIn : t.signUp}
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-5">
        {isSignUp && (
          <div className="relative group">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400/90 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder={t.fullName}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-2xl border border-white/45 bg-white/32 pl-14 pr-6 py-5 font-semibold text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_10px_30px_rgba(148,163,184,0.12)] outline-none backdrop-blur-md transition-all placeholder:text-slate-400/95 focus:border-blue-200/80 focus:bg-white/48 focus:ring-2 focus:ring-blue-500/25"
              required
            />
          </div>
        )}

        <div className="relative group">
          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400/90 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/45 bg-white/32 pl-14 pr-6 py-5 font-semibold text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_10px_30px_rgba(148,163,184,0.12)] outline-none backdrop-blur-md transition-all placeholder:text-slate-400/95 focus:border-blue-200/80 focus:bg-white/48 focus:ring-2 focus:ring-blue-500/25"
            required
          />
        </div>

        <div className="relative group">
          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400/90 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="password"
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/45 bg-white/32 pl-14 pr-6 py-5 font-semibold text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_10px_30px_rgba(148,163,184,0.12)] outline-none backdrop-blur-md transition-all placeholder:text-slate-400/95 focus:border-blue-200/80 focus:bg-white/48 focus:ring-2 focus:ring-blue-500/25"
            required
          />
        </div>

        {isSignUp && (
          <div className="space-y-4 pt-2">
            <p className="px-1 text-xs font-black uppercase tracking-[0.2em] text-blue-500/90">{t.role}</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`flex items-center justify-center gap-3 rounded-2xl border-2 p-5 font-black transition-all ${
                  role === 'patient'
                    ? 'border-blue-400/80 bg-blue-100/35 text-blue-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_18px_35px_rgba(59,130,246,0.16)] backdrop-blur-md'
                    : 'border-white/35 bg-white/22 text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_10px_24px_rgba(148,163,184,0.1)] backdrop-blur-md hover:bg-white/30'
                }`}
              >
                <UserCircle className="w-6 h-6" />
                {t.patient}
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`flex items-center justify-center gap-3 rounded-2xl border-2 p-5 font-black transition-all ${
                  role === 'doctor'
                    ? 'border-blue-400/80 bg-blue-100/35 text-blue-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_18px_35px_rgba(59,130,246,0.16)] backdrop-blur-md'
                    : 'border-white/35 bg-white/22 text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_10px_24px_rgba(148,163,184,0.1)] backdrop-blur-md hover:bg-white/30'
                }`}
              >
                <Stethoscope className="w-6 h-6" />
                {t.doctor}
              </button>
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.01, translateY: -2 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          className="mt-6 w-full rounded-2xl bg-blue-600 py-5 text-xl font-black text-white shadow-[0_18px_34px_rgba(37,99,235,0.32)] transition-all hover:bg-blue-700"
        >
          {isSignUp ? t.signUp : t.signIn}
        </motion.button>
      </form>
    </div>
  );
}
