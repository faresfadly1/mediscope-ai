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
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 sm:py-10 md:space-y-16 md:py-12">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
          {t.patientWelcome}, {user?.fullName.split(' ')[0]}
        </h2>
        <p className="mx-auto max-w-2xl text-base font-medium text-slate-500 sm:text-lg md:text-xl">
          {t.patientSubtitle}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        {/* Contact Doctor Card */}
        <motion.button
          whileHover={{ y: -12, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectAction('doctor')}
          className="group relative space-y-6 overflow-hidden rounded-[2.25rem] border border-slate-100 bg-white p-6 text-left shadow-2xl shadow-slate-200/50 transition-all sm:p-8 md:space-y-8 md:rounded-[3rem] lg:rounded-[4rem] lg:p-12"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-blue-100/50 transition-colors" />
          
          <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-blue-600 text-white shadow-xl shadow-blue-200 transition-transform group-hover:rotate-6 sm:h-20 sm:w-20 md:h-24 md:w-24 md:rounded-[2rem]">
            <Stethoscope className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
          </div>
          
          <div className="relative space-y-3 md:space-y-4">
            <h3 className="text-2xl font-black leading-tight text-slate-900 sm:text-3xl md:text-4xl">{t.contactDoctor}</h3>
            <p className="text-base font-medium leading-relaxed text-slate-500 sm:text-lg md:text-xl">
              {t.contactDoctorDesc}
            </p>
          </div>
          
          <div className="relative flex items-center gap-3 text-lg font-black text-blue-600 md:text-xl">
            {ui.landing.getStarted}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2 md:h-6 md:w-6" />
          </div>
        </motion.button>

        {/* Upload Report Card */}
        <motion.button
          whileHover={{ y: -12, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectAction('report')}
          className="group relative space-y-6 overflow-hidden rounded-[2.25rem] bg-slate-900 p-6 text-left text-white shadow-2xl shadow-slate-900/40 transition-all sm:p-8 md:space-y-8 md:rounded-[3rem] lg:rounded-[4rem] lg:p-12"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors" />
          
          <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-emerald-500 text-white shadow-xl shadow-emerald-900/20 transition-transform group-hover:-rotate-6 sm:h-20 sm:w-20 md:h-24 md:w-24 md:rounded-[2rem]">
            <FileText className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
          </div>
          
          <div className="relative space-y-3 md:space-y-4">
            <h3 className="text-2xl font-black leading-tight sm:text-3xl md:text-4xl">{t.uploadReport}</h3>
            <p className="text-base font-medium leading-relaxed text-slate-400 sm:text-lg md:text-xl">
              {t.uploadReportDesc}
            </p>
          </div>
          
          <div className="relative flex items-center gap-3 text-lg font-black text-emerald-400 md:text-xl">
            {ui.analyze}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2 md:h-6 md:w-6" />
          </div>
        </motion.button>
      </div>

      <div className="flex justify-center pt-2 md:pt-8">
        <button 
          onClick={onViewAppointments}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white px-6 py-4 font-black text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-slate-50 sm:w-auto sm:px-8"
        >
          <Calendar className="w-6 h-6 text-blue-600" />
          {t.myAppointments}
        </button>
      </div>
    </div>
  );
}
