import React from 'react';
import { Language, translations } from '../utils/translations';
import { motion } from 'motion/react';
import { Stethoscope, UserCircle, MapPin, Video, Clock, Star, Edit, CheckCircle, AlertCircle, Eye, Calendar, Briefcase } from 'lucide-react';
import { useHealth, DoctorProfile } from '../context/HealthContext';

interface DoctorListingViewProps {
  lang: Language;
  onEdit: () => void;
  onViewAppointments: () => void;
}

export default function DoctorListingView({ lang, onEdit, onViewAppointments }: DoctorListingViewProps) {
  const { user, doctors, updateDoctorProfile } = useHealth();
  const t = translations[lang].ui.doctor;
  const ui = translations[lang].ui;
  const dashboardT = translations[lang].ui.dashboard;
  const doctorProfile = doctors.find(d => d.userId === user?.id);

  if (!doctorProfile) return null;

  const isComplete = doctorProfile.fullName && doctorProfile.specialty && doctorProfile.clinicAddress && doctorProfile.price > 0;
  const isNew = !doctorProfile.bio && !doctorProfile.photo && !doctorProfile.isPublished;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10 md:space-y-12 md:py-12">
      {/* Studio Header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-6 text-white shadow-2xl shadow-slate-900/40 sm:p-8 md:rounded-[3rem] md:p-12 lg:p-16">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center md:gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest text-blue-400">
              <Stethoscope className="w-4 h-4" />
              Professional Studio
            </div>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {isNew ? 'Create Your Doctor Listing' : t.createListingTitle}
            </h2>
            <p className="max-w-xl text-base font-medium text-slate-400 sm:text-lg md:text-xl">
              {isNew ? 'Reach more patients by creating a professional medical profile on MediScope AI.' : t.createListingSub}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onViewAppointments}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/10 border border-white/10 font-black text-white hover:bg-white/20 transition-all"
            >
              <Calendar className="w-5 h-5 text-blue-400" />
              {dashboardT.myAppointments}
            </button>
            <button
              onClick={onEdit}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-900/20 font-black hover:bg-blue-500 transition-all"
            >
              <Edit className="w-5 h-5" />
              {isNew ? 'Start My Listing' : t.editListing}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-6 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8 md:space-y-8 md:rounded-[2.5rem]">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                {t.listingStatus}
              </h3>
              <p className="text-sm font-medium text-slate-500">Control how patients see your profile.</p>
            </div>
            
              <div className={`flex flex-col gap-4 rounded-[1.5rem] p-6 sm:p-8 md:rounded-[2rem] ${doctorProfile.isPublished ? 'border border-emerald-100 bg-emerald-50' : 'border border-amber-100 bg-amber-50'}`}>
              <div className="flex items-center gap-4">
                {doctorProfile.isPublished ? (
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <p className={`font-black uppercase tracking-widest text-xs ${doctorProfile.isPublished ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {doctorProfile.isPublished ? 'Live & Active' : 'Draft Mode'}
                  </p>
                  <p className="text-sm font-bold text-slate-600 mt-0.5">
                    {doctorProfile.isPublished ? 'Visible to all patients' : 'Hidden from search results'}
                  </p>
                </div>
              </div>
            </div>

            {!isComplete && (
              <div className="p-6 rounded-3xl bg-rose-50 border border-rose-100 space-y-3">
                <div className="flex items-center gap-2 text-rose-700">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm font-black uppercase tracking-widest">Action Required</p>
                </div>
                <p className="text-xs font-medium text-rose-600 leading-relaxed">
                  Your profile is missing critical information. Complete your specialty, clinic address, and consultation fee to enable publishing.
                </p>
              </div>
            )}

            <button
              disabled={!isComplete}
              onClick={() => updateDoctorProfile({ isPublished: !doctorProfile.isPublished })}
              className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl ${
                !isComplete 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : doctorProfile.isPublished 
                    ? 'bg-slate-900 text-white hover:bg-slate-800' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
              }`}
            >
              {doctorProfile.isPublished ? t.unpublishProfile : t.publishProfile}
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{t.previewListing}</h3>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-tighter">Live Preview Mode</span>
          </div>
          
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 md:rounded-[3.5rem]">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500" />
            
            <div className="space-y-8 p-6 sm:p-8 md:space-y-12 md:p-12 lg:p-16">
              <div className="flex flex-col gap-8 md:flex-row md:gap-12">
                <div className="relative shrink-0">
                  {doctorProfile.photo ? (
                    <img src={doctorProfile.photo} alt={doctorProfile.fullName} className="h-32 w-32 rounded-[2rem] object-cover shadow-2xl ring-8 ring-slate-50 sm:h-40 sm:w-40 md:h-48 md:w-48 md:rounded-[3rem]" />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] bg-slate-50 text-slate-200 ring-8 ring-slate-50 sm:h-40 sm:w-40 md:h-48 md:w-48 md:rounded-[3rem]">
                      <UserCircle className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" />
                    </div>
                  )}
                  <div className="absolute -bottom-3 -right-3 rounded-2xl border border-slate-50 bg-white p-3 shadow-xl sm:-bottom-4 sm:-right-4 sm:p-4">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Star className="h-5 w-5 fill-current sm:h-6 sm:w-6" />
                      <span className="text-base font-black text-slate-900 sm:text-lg">5.0</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-4xl">{doctorProfile.fullName}</h4>
                    <div className="inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-base font-bold text-blue-700 sm:text-lg">
                      {doctorProfile.specialty}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-slate-50 text-slate-600 text-sm font-bold border border-slate-100">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {doctorProfile.clinicName || 'Private Clinic'}
                    </div>
                    <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-slate-50 text-slate-600 text-sm font-bold border border-slate-100">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      {doctorProfile.experience || 0} {t.experience}
                    </div>
                  </div>

                  <p className="text-base font-medium leading-relaxed text-slate-500 sm:text-lg">
                    {doctorProfile.bio || 'Add a professional bio to help patients understand your expertise and approach to care.'}
                  </p>
                </div>
              </div>

              <div className="grid gap-8 border-t border-slate-50 pt-8 md:grid-cols-2 md:gap-12 md:pt-12">
                <div className="space-y-6">
                  <h5 className="text-sm font-black text-slate-400 uppercase tracking-widest">{t.consultationTypes}</h5>
                  <div className="flex flex-wrap gap-4">
                    {doctorProfile.consultationTypes.map(type => (
                      <div key={type} className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-50 text-blue-700 text-sm font-black uppercase tracking-widest">
                        {type === 'video' ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                        {type === 'video' ? t.videoCall : t.clinicVisit}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <h5 className="text-sm font-black text-slate-400 uppercase tracking-widest">{t.consultationPrice}</h5>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 sm:text-4xl md:text-5xl">${doctorProfile.price}</span>
                    <span className="text-slate-400 font-bold">/ session</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 border-t border-slate-50 pt-8 md:pt-12">
                <h5 className="text-sm font-black text-slate-400 uppercase tracking-widest">{t.availableDays}</h5>
                <div className="flex flex-wrap gap-3">
                  {doctorProfile.availableDays.length > 0 ? (
                    doctorProfile.availableDays.map(day => (
                      <span key={day} className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/10">
                        {day}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 font-medium italic">No availability set yet.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
