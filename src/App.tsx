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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100" dir={dir}>
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-100/40 blur-[160px] rounded-full" />
        <div className="absolute top-1/4 right-1/4 w-[30%] h-[30%] bg-emerald-100/20 blur-[120px] rounded-full" />
      </div>

      <Header lang={lang} setLang={setLang} onHome={handleHome} />

      <main className="relative">
        <AnimatePresence mode="wait">
          {currentView === 'auth' && (
            <motion.div key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pt-20">
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
