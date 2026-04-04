import React, { useState } from 'react';
import { Language, translations } from '../utils/translations';
import { motion } from 'motion/react';
import { Save, User, Stethoscope, MapPin, DollarSign, Clock, CheckCircle, Globe, Briefcase, RefreshCcw } from 'lucide-react';
import { useHealth, DoctorProfile } from '../context/HealthContext';

interface DoctorProfileFormProps {
  lang: Language;
  onSave: () => void;
  onBack: () => void;
}

export default function DoctorProfileForm({ lang, onSave, onBack }: DoctorProfileFormProps) {
  const { user, doctors, updateDoctorProfile } = useHealth();
  const t = translations[lang].ui.doctor;
  const ui = translations[lang].ui;
  const common = translations[lang].ui.common;
  const specialties = translations[lang].ui.specialties;
  const doctorProfile = doctors.find(d => d.userId === user?.id);

  const [formData, setFormData] = useState<Partial<DoctorProfile>>(doctorProfile || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use the latest formData which might have been updated by the button click
    updateDoctorProfile(formData);
    onSave();
  };

  const handlePublish = () => {
    const updatedData = { ...formData, isPublished: true };
    setFormData(updatedData);
    updateDoctorProfile(updatedData);
    onSave();
  };

  const handleSaveDraft = () => {
    const updatedData = { ...formData, isPublished: false };
    setFormData(updatedData);
    updateDoctorProfile(updatedData);
    onSave();
  };

  const specialtyList = [
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

  const days = [
    { id: 'Monday', label: common.days.monday },
    { id: 'Tuesday', label: common.days.tuesday },
    { id: 'Wednesday', label: common.days.wednesday },
    { id: 'Thursday', label: common.days.thursday },
    { id: 'Friday', label: common.days.friday },
    { id: 'Saturday', label: common.days.saturday },
    { id: 'Sunday', label: common.days.sunday },
  ];
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-xs transition-colors"
          >
            <RefreshCcw className="w-3 h-3 rotate-180" />
            {common.preview}
          </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-4xl font-black text-slate-900">{t.createListingTitle}</h2>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 text-slate-600 rounded-2xl font-black shadow-sm hover:bg-slate-50 transition-all"
            >
              <Save className="w-5 h-5" />
              {common.saveDraft}
            </button>
            <button
              type="button"
              onClick={() => {
                updateDoctorProfile(formData);
                onBack();
              }}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
            >
              <RefreshCcw className="w-5 h-5" />
              {common.preview}
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              <CheckCircle className="w-5 h-5" />
              {t.publishProfile}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Basic Info */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                {common.basicInfo}
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">{ui.auth.fullName}</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">{t.profilePhoto}</label>
                  <input
                    type="text"
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">{t.specialty}</label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  >
                    {specialtyList.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">{t.bio}</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium h-32 resize-none"
                    placeholder={t.bioPlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">{t.experience}</label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">{t.languages}</label>
                  <input
                    type="text"
                    value={formData.languages?.join(', ')}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value.split(',').map(s => s.trim()) })}
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    placeholder={t.languagesPlaceholder}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                {common.clinicDetails}
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">{t.consultationTypes}</label>
                  <div className="flex gap-4">
                    {['clinic', 'video'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          const current = formData.consultationTypes || [];
                          const updated = current.includes(type as any) ? current.filter(t => t !== type) : [...current, type as any];
                          setFormData({ ...formData, consultationTypes: updated });
                        }}
                        className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${
                          formData.consultationTypes?.includes(type as any) ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-100 text-slate-400'
                        }`}
                      >
                        {type === 'clinic' ? t.clinicVisit : t.videoCall}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">{t.clinicName}</label>
                  <input
                    type="text"
                    value={formData.clinicName}
                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">{t.clinicAddress}</label>
                  <input
                    type="text"
                    value={formData.clinicAddress}
                    onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">{t.consultationPrice} ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Availability & Types */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                {common.availability}
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">{t.availableDays}</label>
                  <div className="flex flex-wrap gap-2">
                    {days.map(day => (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => {
                          const current = formData.availableDays || [];
                          const updated = current.includes(day.id) ? current.filter(d => d !== day.id) : [...current, day.id];
                          setFormData({ ...formData, availableDays: updated });
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                          formData.availableDays?.includes(day.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-100'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">{t.availableTime}</label>
                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          const current = formData.availableTimeSlots || [];
                          const updated = current.includes(slot) ? current.filter(s => s !== slot) : [...current, slot];
                          setFormData({ ...formData, availableTimeSlots: updated });
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                          formData.availableTimeSlots?.includes(slot) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                {common.settings}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-6 h-6 rounded-lg text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <label htmlFor="isPublished" className="text-lg font-black text-slate-900 cursor-pointer">
                    {t.publishProfile}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
