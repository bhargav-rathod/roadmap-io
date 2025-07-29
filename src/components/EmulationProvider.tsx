import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export type EmulatedUser = {
  id: string;
  name: string;
  email: string;
  user_role: string;
  credits: number;
};

interface EmulationContextType {
  emulatedUser: EmulatedUser | null;
  setEmulatedUser: (user: EmulatedUser | null) => void;
  setEmulationByEmail: (email: string) => Promise<boolean>;
  clearEmulation: () => void;
  loading: boolean;
  error: string | null;
}

const EmulationContext = createContext<EmulationContextType | undefined>(undefined);

export const useEmulation = () => {
  const ctx = useContext(EmulationContext);
  if (!ctx) throw new Error('useEmulation must be used within EmulationProvider');
  return ctx;
};

const EMU_KEY = 'admin_emulation_user';

const EmulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const [emulatedUser, setEmulatedUserState] = useState<EmulatedUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load emulation from storage
  useEffect(() => {
    const stored = localStorage.getItem(EMU_KEY);
    if (stored) {
      try {
        setEmulatedUserState(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Persist emulation
  const setEmulatedUser = (user: EmulatedUser | null) => {
    setEmulatedUserState(user);
    if (user) {
      localStorage.setItem(EMU_KEY, JSON.stringify(user));
      document.cookie = `emulation=${encodeURIComponent(JSON.stringify(user))}; path=/`;
    } else {
      localStorage.removeItem(EMU_KEY);
      document.cookie = 'emulation=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  };

  // Set emulation by email
  const setEmulationByEmail = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/emulate?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        setError('User not found or not allowed');
        setLoading(false);
        return false;
      }
      const user = await res.json();
      setEmulatedUser(user);
      setLoading(false);
      return true;
    } catch (e) {
      setError('Failed to emulate user');
      setLoading(false);
      return false;
    }
  };

  const clearEmulation = () => setEmulatedUser(null);

  return (
    <EmulationContext.Provider value={{ emulatedUser, setEmulatedUser, setEmulationByEmail, clearEmulation, loading, error }}>
      {children}
    </EmulationContext.Provider>
  );
};

export default EmulationProvider; 