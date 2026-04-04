import React, { useEffect, useRef, useState } from 'react';
import { useHealth, UserRole } from '../context/HealthContext';
import { Language, translations } from '../utils/translations';
import { Mail, Lock, User, UserCircle, Stethoscope } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthFormProps {
  lang: Language;
  initialRole?: UserRole | null;
}

export default function AuthForm({ lang, initialRole }: AuthFormProps) {
  const { login, signUp, loginWithGoogle } = useHealth();
  const t = translations[lang].ui.auth;
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole || 'patient');
  const [googleError, setGoogleError] = useState('');
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!googleClientId || !window.google?.accounts.id || !googleButtonRef.current) {
      return;
    }

    googleButtonRef.current.innerHTML = '';

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async ({ credential }) => {
        try {
          const payload = JSON.parse(atob(credential.split('.')[1])) as GoogleJwtPayload;
          await loginWithGoogle(
            {
              email: payload.email,
              fullName: payload.name,
              googleId: payload.sub,
              photo: payload.picture,
            },
            role
          );
          setGoogleError('');
        } catch (error) {
          console.error('Google sign-in failed', error);
          setGoogleError(t.googleError);
        }
      },
    });

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      text: isSignUp ? 'signup_with' : 'signin_with',
      width: '320',
    });
  }, [googleClientId, isSignUp, loginWithGoogle, role, t.googleError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await signUp(email, fullName, role);
    } else {
      await login(email, password);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-10 bg-white rounded-[3.5rem] shadow-2xl shadow-blue-100/50 border border-slate-50">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
          {isSignUp ? t.createAccount : t.welcomeBack}
        </h2>
        <p className="text-slate-500 font-semibold text-lg">
          {isSignUp ? t.hasAccount : t.noAccount}{' '}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 font-black hover:underline"
          >
            {isSignUp ? t.signIn : t.signUp}
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {isSignUp && (
          <div className="relative group">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder={t.fullName}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-semibold text-slate-700"
              required
            />
          </div>
        )}

        <div className="relative group">
          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-semibold text-slate-700"
            required
          />
        </div>

        <div className="relative group">
          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="password"
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-semibold text-slate-700"
            required
          />
        </div>

        {isSignUp && (
          <div className="space-y-4 pt-2">
            <p className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] px-1">{t.role}</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`flex items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all font-black ${
                  role === 'patient' ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-lg shadow-blue-100/50' : 'border-transparent bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                <UserCircle className="w-6 h-6" />
                {t.patient}
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`flex items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all font-black ${
                  role === 'doctor' ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-lg shadow-blue-100/50' : 'border-transparent bg-slate-50 text-slate-400 hover:bg-slate-100'
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
          className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all mt-6"
        >
          {isSignUp ? t.signUp : t.signIn}
        </motion.button>

        <div className="pt-2">
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                {t.orContinue}
              </span>
            </div>
          </div>

          {googleClientId ? (
            <div className="flex justify-center">
              <div ref={googleButtonRef} />
            </div>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-400 font-bold"
            >
              {t.googleDisabled}
            </button>
          )}

          {googleError && (
            <p className="mt-3 text-center text-sm font-semibold text-rose-500">{googleError}</p>
          )}
        </div>
      </form>
    </div>
  );
}
