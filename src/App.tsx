import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Language, translations } from "./utils/translations";
import { useHealth, DoctorProfile, UserRole } from "./context/HealthContext";
import Header from "./components/Header";
import AuthForm from "./components/AuthForm";
import PatientDashboard from "./components/PatientDashboard";
import DoctorListingView from "./components/DoctorListingView";
import DoctorSearch from "./components/DoctorSearch";
import BookingModal from "./components/BookingModal";
import DoctorProfileForm from "./components/DoctorProfileForm";
import AppointmentsList from "./components/AppointmentsList";
import ReportAnalysisFlow from "./components/ReportAnalysisFlow";

type View = 'auth' | 'dashboard' | 'analysis' | 'search' | 'appointments' | 'profile';

export default function App() {
  const [lang, setLang] = useState<Language>("en");
  const [view, setView] = useState<View>('auth');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  
  const { user } = useHealth();
  const dir = translations[lang].dir;
  const t = translations[lang].ui;

  // Update view when auth state changes
  useEffect(() => {
    if (user) {
      setView('dashboard');
    } else {
      setView('auth');
    }
  }, [user]);

  // Route based on auth state
  const currentView = !user ? 'auth' : view;

  const handleHome = () => {
    if (!user) setView('auth');
    else setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#eef7ff_0%,#f6fbff_38%,#f7fafc_100%)] text-slate-900 font-sans selection:bg-blue-100" dir={dir}>
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.65),rgba(255,255,255,0)_28%,rgba(191,219,254,0.18)_55%,rgba(255,255,255,0.42)_100%)]" />
        <div className="absolute top-1/2 left-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/45 blur-[180px]" />
        <div className="absolute top-1/4 right-1/4 h-[30%] w-[30%] rounded-full bg-cyan-100/25 blur-[130px]" />
        <div className="absolute left-[12%] top-[22%] h-56 w-56 rounded-full bg-white/45 blur-[90px]" />
        <div className="absolute bottom-[14%] right-[10%] h-48 w-48 rounded-full bg-blue-50/55 blur-[95px]" />
      </div>

      <Header lang={lang} setLang={setLang} onHome={handleHome} />

      <main className="relative">
        <AnimatePresence mode="wait">
          {currentView === 'auth' && (
            <motion.div key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative pt-20">
              <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto h-[32rem] max-w-2xl rounded-full bg-white/35 blur-3xl" />
              <AuthForm lang={lang} />
            </motion.div>
          )}

          {currentView === 'dashboard' && user?.role === 'patient' && (
            <motion.div key="patient-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PatientDashboard 
                lang={lang} 
                onSelectAction={(action) => setView(action === 'doctor' ? 'search' : 'analysis')}
                onViewAppointments={() => setView('appointments')}
              />
            </motion.div>
          )}

          {currentView === 'dashboard' && user?.role === 'doctor' && (
            <motion.div key="doctor-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DoctorListingView 
                lang={lang} 
                onEdit={() => setView('profile')}
                onViewAppointments={() => setView('appointments')}
              />
            </motion.div>
          )}

          {currentView === 'search' && (
            <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DoctorSearch lang={lang} onBook={(doctor) => setSelectedDoctor(doctor)} onBack={() => setView('dashboard')} />
            </motion.div>
          )}

          {currentView === 'analysis' && (
            <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 py-12">
              <ReportAnalysisFlow lang={lang} onBack={() => setView('dashboard')} />
            </motion.div>
          )}

          {currentView === 'appointments' && (
            <motion.div key="appointments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AppointmentsList lang={lang} onBack={() => setView('dashboard')} />
            </motion.div>
          )}

          {currentView === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DoctorProfileForm lang={lang} onSave={() => setView('dashboard')} onBack={() => setView('dashboard')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {selectedDoctor && (
        <BookingModal 
          lang={lang} 
          doctor={selectedDoctor} 
          onClose={() => setSelectedDoctor(null)} 
        />
      )}

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
          {t.footer}
        </p>
      </footer>
    </div>
  );
}
