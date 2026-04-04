import React from 'react';
import { Language, translations } from '../utils/translations';
import { motion } from 'motion/react';
import { Calendar, Clock, Video, MapPin, UserCircle, Stethoscope, CheckCircle, RefreshCcw } from 'lucide-react';
import { useHealth, Booking } from '../context/HealthContext';

interface AppointmentsListProps {
  lang: Language;
  onBack: () => void;
}

export default function AppointmentsList({ lang, onBack }: AppointmentsListProps) {
  const { user, bookings, doctors } = useHealth();
  const t = translations[lang].ui.booking;
  const ui = translations[lang].ui;
  const common = translations[lang].ui.common;
  const dashboardT = translations[lang].ui.dashboard;
  const doctorT = translations[lang].ui.doctor;
  
  const doctorProfile = doctors.find(d => d.userId === user?.id);
  
  const userBookings = user?.role === 'patient' 
    ? bookings.filter(b => b.patientId === user.id)
    : bookings.filter(b => b.doctorId === doctorProfile?.id);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-xs transition-colors"
        >
          <RefreshCcw className="w-3 h-3 rotate-180" />
          {common.backToDashboard}
        </button>
      </div>
      <h2 className="text-4xl font-black text-slate-900 flex items-center gap-3">
        <Calendar className="w-10 h-10 text-blue-600" />
        {dashboardT.myAppointments}
      </h2>

      <div className="space-y-6">
        {userBookings.length > 0 ? (
          userBookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-blue-200 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600">
                  {user?.role === 'patient' ? <Stethoscope className="w-10 h-10" /> : <UserCircle className="w-10 h-10" />}
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-slate-900">
                    {user?.role === 'patient' ? booking.doctorName : booking.patientName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      {booking.date}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50">
                      <Clock className="w-4 h-4 text-blue-400" />
                      {booking.time}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50">
                      {booking.type === 'video' ? <Video className="w-4 h-4 text-blue-400" /> : <MapPin className="w-4 h-4 text-blue-400" />}
                      {booking.type === 'video' ? doctorT.videoCall : doctorT.clinicVisit}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-50 text-blue-700 font-black text-sm uppercase tracking-widest">
                <CheckCircle className="w-5 h-5" />
                {t.upcoming}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-20 rounded-[3rem] bg-white border border-slate-100 border-dashed text-center space-y-6">
            <Calendar className="w-20 h-20 text-slate-100 mx-auto" />
            <div className="space-y-2">
              <p className="text-2xl font-black text-slate-300">{dashboardT.noAppointments}</p>
              <p className="text-slate-400 font-medium max-w-xs mx-auto">
                {lang === 'ar' ? 'احجز استشارتك الأولى اليوم لبدء رحلتك الصحية.' : lang === 'tr' ? 'Sağlık yolculuğunuza başlamak için bugün ilk konsültasyonunuzu ayırtın.' : 'Book your first consultation today to start your health journey.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
