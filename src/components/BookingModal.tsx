import React, { useState } from 'react';
import { Language, translations } from '../utils/translations';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Video, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { useHealth, DoctorProfile } from '../context/HealthContext';

interface BookingModalProps {
  lang: Language;
  doctor: DoctorProfile;
  onClose: () => void;
}

export default function BookingModal({ lang, doctor, onClose }: BookingModalProps) {
  const { user, bookAppointment } = useHealth();
  const t = translations[lang].ui.booking;
  const ui = translations[lang].ui;
  const common = translations[lang].ui.common;
  const doctorT = translations[lang].ui.doctor;
  
  const [step, setStep] = useState(1);
  const [type, setType] = useState<'clinic' | 'video'>('clinic');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleConfirm = () => {
    if (!user) return;
    bookAppointment({
      patientId: user.id,
      patientName: user.fullName,
      doctorId: doctor.id,
      doctorName: doctor.fullName,
      specialty: doctor.specialty,
      type,
      date,
      time,
    });
    setStep(3);
  };

  const dates = [
    { id: '2026-04-05', label: lang === 'ar' ? 'الاثنين، 5 أبريل' : lang === 'tr' ? 'Pzt, 5 Nis' : 'Mon, Apr 5' },
    { id: '2026-04-06', label: lang === 'ar' ? 'الثلاثاء، 6 أبريل' : lang === 'tr' ? 'Sal, 6 Nis' : 'Tue, Apr 6' },
    { id: '2026-04-07', label: lang === 'ar' ? 'الأربعاء، 7 أبريل' : lang === 'tr' ? 'Çar, 7 Nis' : 'Wed, Apr 7' },
    { id: '2026-04-08', label: lang === 'ar' ? 'الخميس، 8 أبريل' : lang === 'tr' ? 'Per, 8 Nis' : 'Thu, Apr 8' },
    { id: '2026-04-09', label: lang === 'ar' ? 'الجمعة، 9 أبريل' : lang === 'tr' ? 'Cum, 9 Nis' : 'Fri, Apr 9' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">{t.title}</h3>
              <p className="text-sm font-bold text-slate-500">{doctor.fullName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.selectType}</p>
                <div className="grid grid-cols-2 gap-4">
                  {doctor.consultationTypes.includes('clinic') && (
                    <button
                      onClick={() => setType('clinic')}
                      className={`p-6 rounded-3xl border-2 transition-all text-left space-y-2 ${
                        type === 'clinic' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 bg-slate-50 text-slate-500 opacity-60'
                      }`}
                    >
                      <MapPin className="w-6 h-6" />
                      <p className="font-black">{doctorT.clinicVisit}</p>
                    </button>
                  )}
                  {doctor.consultationTypes.includes('video') && (
                    <button
                      onClick={() => setType('video')}
                      className={`p-6 rounded-3xl border-2 transition-all text-left space-y-2 ${
                        type === 'video' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 bg-slate-50 text-slate-500 opacity-60'
                      }`}
                    >
                      <Video className="w-6 h-6" />
                      <p className="font-black">{doctorT.videoCall}</p>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.selectDate}</p>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {dates.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDate(d.id)}
                      className={`px-6 py-4 rounded-2xl font-bold whitespace-nowrap transition-all border-2 ${
                        date === d.id 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                          : 'bg-slate-50 text-slate-500 border-slate-100'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {date && (
                <div className="space-y-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.selectTime}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {doctor.availableTimeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setTime(slot)}
                        className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                          time === slot 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                            : 'bg-slate-50 text-slate-500 border-slate-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                disabled={!type || !date || !time}
                onClick={() => setStep(2)}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:grayscale"
              >
                {ui.landing.getStarted}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{t.type}</span>
                  <span className="font-bold text-slate-900">{type === 'clinic' ? doctorT.clinicVisit : doctorT.videoCall}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{t.date}</span>
                  <span className="font-bold text-slate-900">{date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{t.time}</span>
                  <span className="font-bold text-slate-900">{time}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{doctorT.consultationPrice}</span>
                  <span className="text-2xl font-black text-slate-900">${doctor.price}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-5 bg-white border border-slate-100 text-slate-600 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all"
                >
                  {common.back}
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                  {t.confirm}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-12 text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto">
                <CheckCircle className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-900">{t.success}</h3>
                <p className="text-lg text-slate-500 font-medium">
                  {lang === 'ar' ? `تم تأكيد موعدك مع ${doctor.fullName}.` : lang === 'tr' ? `${doctor.fullName} ile randevunuz onaylandı.` : `Your appointment with ${doctor.fullName} is confirmed.`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all"
              >
                {common.done}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
