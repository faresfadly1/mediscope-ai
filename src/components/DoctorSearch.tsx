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
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
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
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-lg"
            />
          </div>
          <div className="flex items-center gap-4 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
            {specialtyList.slice(0, 6).map((spec) => (
              <button
                key={spec.id}
                onClick={() => setSelectedSpecialty(spec.id)}
                className={`px-6 py-4 rounded-2xl font-bold whitespace-nowrap transition-all border-2 ${
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.map((doctor) => (
          <motion.div
            key={doctor.id}
            whileHover={{ y: -8 }}
            className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6 group"
          >
            <div className="flex items-center gap-4">
              {doctor.photo ? (
                <img src={doctor.photo} alt={doctor.fullName} className="w-20 h-20 rounded-2xl object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <UserCircle className="w-10 h-10" />
                </div>
              )}
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">{doctor.fullName}</h3>
                <p className="text-blue-600 font-bold flex items-center gap-1">
                  <Stethoscope className="w-4 h-4" />
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

            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.consultationPrice}</p>
                <p className="text-2xl font-black text-slate-900">${doctor.price}</p>
              </div>
              <button 
                onClick={() => onBook(doctor)}
                className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
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
