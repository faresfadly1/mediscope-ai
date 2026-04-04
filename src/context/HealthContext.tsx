import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'patient' | 'doctor';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  fullName: string;
  photo: string;
  specialty: string;
  bio: string;
  clinicName?: string;
  clinicAddress: string;
  price: number;
  consultationTypes: ('clinic' | 'video')[];
  availableDays: string[];
  availableTimeSlots: string[];
  languages: string[];
  experience?: number;
  isPublished: boolean;
}

export interface Booking {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  type: 'clinic' | 'video';
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface HealthContextType {
  user: User | null;
  doctors: DoctorProfile[];
  bookings: Booking[];
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, fullName: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateDoctorProfile: (profile: Partial<DoctorProfile>) => void;
  bookAppointment: (booking: Omit<Booking, 'id' | 'status'>) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Initial mock data
  useEffect(() => {
    const mockDoctors: DoctorProfile[] = [
      {
        id: 'd1',
        userId: 'u2',
        fullName: 'Dr. Sarah Johnson',
        photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200',
        specialty: 'Internal Medicine',
        bio: 'Specialist in internal medicine with over 10 years of experience in managing chronic conditions.',
        clinicName: 'City Health Center',
        clinicAddress: '123 Medical Plaza, New York',
        price: 150,
        consultationTypes: ['clinic', 'video'],
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
        languages: ['English', 'Spanish'],
        experience: 12,
        isPublished: true,
      },
      {
        id: 'd2',
        userId: 'u3',
        fullName: 'Dr. Michael Chen',
        photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200',
        specialty: 'Gastroenterology',
        bio: 'Expert in digestive health and metabolic disorders.',
        clinicName: 'Digestive Care Institute',
        clinicAddress: '456 Wellness Way, San Francisco',
        price: 200,
        consultationTypes: ['clinic'],
        availableDays: ['Tuesday', 'Thursday'],
        availableTimeSlots: ['10:00', '11:00', '13:00', '16:00'],
        languages: ['English', 'Mandarin'],
        experience: 8,
        isPublished: true,
      },
      {
        id: 'd3',
        userId: 'u4',
        fullName: 'Dr. Elena Rodriguez',
        photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200',
        specialty: 'Dermatology',
        bio: 'Board-certified dermatologist focusing on skin health and aesthetic treatments.',
        clinicName: 'Skin & Glow Clinic',
        clinicAddress: '789 Beauty Blvd, Miami',
        price: 180,
        consultationTypes: ['clinic', 'video'],
        availableDays: ['Monday', 'Tuesday', 'Thursday'],
        availableTimeSlots: ['09:30', '11:30', '14:30', '15:30'],
        languages: ['English', 'Spanish', 'Portuguese'],
        experience: 15,
        isPublished: true,
      }
    ];
    setDoctors(mockDoctors);
  }, []);

  const login = async (email: string, _password: string) => {
    // Simple prototype login
    const isDoctor = email.includes('doctor');
    const mockUser: User = {
      id: isDoctor ? 'u2' : 'u1', // u2 is Dr. Sarah Johnson in mock data
      email,
      fullName: isDoctor ? 'Dr. Sarah Johnson' : 'John Doe',
      role: isDoctor ? 'doctor' : 'patient',
    };
    setUser(mockUser);
  };

  const signUp = async (email: string, fullName: string, role: UserRole) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      fullName,
      role,
    };
    setUser(newUser);
    
    if (role === 'doctor') {
      const newDoctor: DoctorProfile = {
        id: Math.random().toString(36).substr(2, 9),
        userId: newUser.id,
        fullName,
        photo: '',
        specialty: 'Internal Medicine',
        bio: '',
        clinicAddress: '',
        price: 100,
        consultationTypes: ['clinic'],
        availableDays: [],
        availableTimeSlots: [],
        languages: ['English'],
        isPublished: false,
      };
      setDoctors(prev => [...prev, newDoctor]);
    }
  };

  const logout = () => setUser(null);

  const updateDoctorProfile = (profile: Partial<DoctorProfile>) => {
    setDoctors(prev => prev.map(d => d.userId === user?.id ? { ...d, ...profile } : d));
  };

  const bookAppointment = (booking: Omit<Booking, 'id' | 'status'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      status: 'upcoming',
    };
    setBookings(prev => [...prev, newBooking]);
  };

  return (
    <HealthContext.Provider value={{ 
      user, 
      doctors, 
      bookings, 
      login, 
      signUp, 
      logout, 
      updateDoctorProfile, 
      bookAppointment 
    }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
