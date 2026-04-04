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
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* Studio Header */}
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest text-blue-400">
              <Stethoscope className="w-4 h-4" />
              Professional Studio
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              {isNew ? 'Create Your Doctor Listing' : t.createListingTitle}
            </h2>
            <p className="text-xl text-slate-400 font-medium max-w-xl">
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

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                {t.listingStatus}
              </h3>
              <p className="text-sm font-medium text-slate-500">Control how patients see your profile.</p>
            </div>
            
            <div className={`p-8 rounded-[2rem] flex flex-col gap-4 ${doctorProfile.isPublished ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'}`}>
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
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{t.previewListing}</h3>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-tighter">Live Preview Mode</span>
          </div>
          
          <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500" />
            
            <div className="p-10 md:p-16 space-y-12">
              <div className="flex flex-col md:flex-row gap-12">
                <div className="relative shrink-0">
                  {doctorProfile.photo ? (
                    <img src={doctorProfile.photo} alt={doctorProfile.fullName} className="w-48 h-48 rounded-[3rem] object-cover shadow-2xl ring-8 ring-slate-50" />
                  ) : (
                    <div className="w-48 h-48 rounded-[3rem] bg-slate-50 flex items-center justify-center text-slate-200 ring-8 ring-slate-50">
                      <UserCircle className="w-24 h-24" />
                    </div>
                  )}
                  <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-50">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Star className="w-6 h-6 fill-current" />
                      <span className="text-slate-900 text-lg font-black">5.0</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-4xl font-black text-slate-900 tracking-tight">{doctorProfile.fullName}</h4>
                    <div className="inline-flex px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-lg font-bold">
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

                  <p className="text-lg text-slate-500 leading-relaxed font-medium">
                    {doctorProfile.bio || 'Add a professional bio to help patients understand your expertise and approach to care.'}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-slate-50">
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
                    <span className="text-5xl font-black text-slate-900">${doctorProfile.price}</span>
                    <span className="text-slate-400 font-bold">/ session</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-12 border-t border-slate-50">
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
