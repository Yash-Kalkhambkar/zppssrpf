import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isMock: boolean;
  mockLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  isMock: false,
  mockLogin: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Mock auth state for preview
      const storedMock = localStorage.getItem('mockSession');
      if (storedMock === 'true') {
        setIsMock(true);
        setUser({ id: 'mock-user', email: 'principal@school.com' } as User);
      }
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('mockSession');
      setIsMock(false);
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
  };

  const mockLogin = () => {
    if (!isSupabaseConfigured) {
      localStorage.setItem('mockSession', 'true');
      setIsMock(true);
      setUser({ id: 'mock-user', email: 'principal@school.com' } as User);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, isMock, mockLogin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
