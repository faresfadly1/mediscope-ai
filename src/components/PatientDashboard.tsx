import React from 'react';
import { Language, translations } from '../utils/translations';
import { motion } from 'motion/react';
import { Stethoscope, FileText, Calendar, ArrowRight, UserCircle } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

interface PatientDashboardProps {
  lang: Language;
  onSelectAction: (action: 'doctor' | 'report') => void;
  onViewAppointments: () => void;
}

export default function PatientDashboard({ lang, onSelectAction, onViewAppointments }: PatientDashboardProps) {
  const { user } = useHealth();
  const t = translations[lang].ui.dashboard;
  const ui = translations[lang].ui;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
          {t.patientWelcome}, {user?.fullName.split(' ')[0]}
        </h2>
        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
          {t.patientSubtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Doctor Card */}
        <motion.button
          whileHover={{ y: -12, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectAction('doctor')}
          className="relative overflow-hidden p-12 rounded-[4rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 text-left space-y-8 group transition-all"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-blue-100/50 transition-colors" />
          
          <div className="relative w-24 h-24 rounded-[2rem] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-200 group-hover:rotate-6 transition-transform">
            <Stethoscope className="w-12 h-12" />
          </div>
          
          <div className="relative space-y-4">
            <h3 className="text-4xl font-black text-slate-900 leading-tight">{t.contactDoctor}</h3>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              {t.contactDoctorDesc}
            </p>
          </div>
          
          <div className="relative flex items-center gap-3 text-blue-600 font-black text-xl">
            {ui.landing.getStarted}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </div>
        </motion.button>

        {/* Upload Report Card */}
        <motion.button
          whileHover={{ y: -12, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectAction('report')}
          className="relative overflow-hidden p-12 rounded-[4rem] bg-slate-900 text-white shadow-2xl shadow-slate-900/40 text-left space-y-8 group transition-all"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors" />
          
          <div className="relative w-24 h-24 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-900/20 group-hover:-rotate-6 transition-transform">
            <FileText className="w-12 h-12" />
          </div>
          
          <div className="relative space-y-4">
            <h3 className="text-4xl font-black leading-tight">{t.uploadReport}</h3>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              {t.uploadReportDesc}
            </p>
          </div>
          
          <div className="relative flex items-center gap-3 text-emerald-400 font-black text-xl">
            {ui.analyze}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </div>
        </motion.button>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={onViewAppointments}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm font-black text-slate-700 hover:bg-slate-50 hover:border-blue-200 transition-all"
        >
          <Calendar className="w-6 h-6 text-blue-600" />
          {t.myAppointments}
        </button>
      </div>
    </div>
  );
}
