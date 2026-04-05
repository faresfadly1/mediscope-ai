import React, { useState } from 'react';
import { Language, translations } from '../utils/translations';
import { motion } from 'motion/react';
import { Search, Filter, UserCircle, Stethoscope, MapPin, Video, ArrowRight, Star, RefreshCcw } from 'lucide-react';
import { useHealth, DoctorProfile } from '../context/HealthContext';

interface DoctorSearchProps {
  lang: Language;
  onBook: (doctor: DoctorProfile) => void;
  onBack: () => void;
}

export default function DoctorSearch({ lang, onBook, onBack }: DoctorSearchProps) {
  const { doctors } = useHealth();
  const t = translations[lang].ui.doctor;
  const ui = translations[lang].ui;
  const common = translations[lang].ui.common;
  const specialties = translations[lang].ui.specialties;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  const filteredDoctors = doctors.filter(d => {
    if (!d.isPublished) return false;
    const matchesSearch = d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || d.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const specialtyList = [
    { id: 'all', label: t.allSpecialties },
    { id: 'Internal Medicine', label: specialties.internal },
    { id: 'Orthopedics', label: specialties.ortho },
    { id: 'Cardiology', label: specialties.cardio },
    { id: 'Dermatology', label: specialties.derma },
    { id: 'Neurology', label: specialties.neuro },
    { id: 'Gastroenterology', label: specialties.gastro },
    { id: 'ENT', label: specialties.ent },
    { id: 'Pediatrics', label: specialties.pedia },
    { id: 'Gynecology', label: specialties.gynae },
    { id: 'Urology', label: specialties.uro },
    { id: 'Psychiatry', label: specialties.psych },
    { id: 'Pulmonology', label: specialties.pulmo },
    { id: 'General Surgery', label: specialties.surgery },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10 md:space-y-12 md:py-12">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-xs transition-colors"
        >
          <RefreshCcw className="w-3 h-3 rotate-180" />
          {common.backToDashboard}
        </button>
      </div>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 sm:left-6 sm:h-6 sm:w-6" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-[1.5rem] border border-slate-100 bg-white py-4 pl-14 pr-5 text-base font-medium shadow-xl shadow-slate-200/50 outline-none transition-all focus:ring-2 focus:ring-blue-500 sm:rounded-[2rem] sm:py-5 sm:pl-16 sm:pr-6 sm:text-lg"
            />
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:gap-4 md:pb-0 no-scrollbar">
            {specialtyList.slice(0, 6).map((spec) => (
              <button
                key={spec.id}
                onClick={() => setSelectedSpecialty(spec.id)}
                className={`whitespace-nowrap rounded-2xl border-2 px-4 py-3 text-sm font-bold transition-all sm:px-6 sm:py-4 ${
                  selectedSpecialty === spec.id 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                    : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200'
                }`}
              >
                {spec.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <motion.div
            key={doctor.id}
            whileHover={{ y: -8 }}
            className="group space-y-5 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-6 md:rounded-[2.5rem] md:p-8"
          >
            <div className="flex items-start gap-4">
              {doctor.photo ? (
                <img src={doctor.photo} alt={doctor.fullName} className="h-16 w-16 rounded-2xl object-cover sm:h-20 sm:w-20" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:h-20 sm:w-20">
                  <UserCircle className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
              )}
              <div className="min-w-0 space-y-1">
                <h3 className="text-lg font-black text-slate-900 sm:text-xl">{doctor.fullName}</h3>
                <p className="flex items-center gap-1 text-sm font-bold text-blue-600 sm:text-base">
                  <Stethoscope className="h-4 w-4" />
                  {doctor.specialty}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                <MapPin className="w-4 h-4 text-blue-400" />
                {doctor.clinicAddress}
              </div>
              <div className="flex items-center gap-4">
                {doctor.consultationTypes.includes('clinic') && (
                  <span className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-slate-400">
                    <MapPin className="w-3 h-3" />
                    {t.clinicVisit}
                  </span>
                )}
                {doctor.consultationTypes.includes('video') && (
                  <span className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-blue-500">
                    <Video className="w-3 h-3" />
                    {t.videoCall}
                  </span>
                )}
              </div>
            </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-5 sm:pt-6">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.consultationPrice}</p>
                <p className="text-xl font-black text-slate-900 sm:text-2xl">${doctor.price}</p>
              </div>
              <button 
                onClick={() => onBook(doctor)}
                className="rounded-2xl bg-blue-600 px-4 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 sm:px-6 sm:py-4 sm:text-sm"
              >
                {t.bookNow}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
