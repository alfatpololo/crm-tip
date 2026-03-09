'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export type Role = 'superadmin' | 'management' | 'koordinator' | 'sales_officer' | 'staff';

export type AppUser = { id: string; email: string | null };

type AuthState = {
  user: AppUser | null;
  role: Role;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  authMode: 'supabase' | 'none';
};

const defaultState: AuthState = {
  user: null,
  role: 'staff',
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
  authMode: 'none',
};

const AuthContext = createContext<AuthState>(defaultState);

const SUPERADMIN_EMAIL = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL ?? 'alfat.pololo@gmail.com').trim().toLowerCase();
const KOORDINATOR_EMAILS = (process.env.NEXT_PUBLIC_KOORDINATOR_EMAIL ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);
const KOORDINATOR_EMAIL_DEFAULT = 'ninaahrr@gmail.com';

function getRoleFromEmail(email: string | undefined): Role {
  if (!email) return 'staff';
  const lower = email.toLowerCase();
  if (lower === SUPERADMIN_EMAIL) return 'superadmin';
  if (KOORDINATOR_EMAILS.includes(lower)) return 'koordinator';
  if (lower === KOORDINATOR_EMAIL_DEFAULT) return 'koordinator';
  if (lower.includes('nina')) return 'koordinator';
  return 'staff';
}

const VALID_ROLES: Role[] = ['superadmin', 'management', 'koordinator', 'sales_officer', 'staff'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [role, setRole] = useState<Role>('staff');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = useCallback(async (uid: string, email?: string) => {
    const lower = (email ?? '').toLowerCase();
    if (lower === SUPERADMIN_EMAIL) {
      setRole('superadmin');
      return;
    }
    if (!isSupabaseConfigured()) {
      setRole(getRoleFromEmail(email));
      return;
    }
    try {
      const { data } = await supabase.from('profiles').select('role').eq('id', uid).single();
      const r = data?.role as string | undefined;
      if (r && VALID_ROLES.includes(r as Role)) setRole(r as Role);
      else setRole(getRoleFromEmail(email));
    } catch {
      setRole(getRoleFromEmail(email));
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      setUser(null);
      setRole('staff');
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user;
      if (u) {
        setUser({ id: u.id, email: u.email ?? null });
        fetchProfile(u.id, u.email ?? undefined);
      } else {
        setUser(null);
        setRole('staff');
      }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      if (u) {
        setUser({ id: u.id, email: u.email ?? null });
        fetchProfile(u.id, u.email ?? undefined);
      } else {
        setUser(null);
        setRole('staff');
      }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured()) await supabase.auth.signOut();
    setUser(null);
    setRole('staff');
    router.push('/login');
  }, [router]);

  const refreshProfile = useCallback(async () => {
    if (user?.id) await fetchProfile(user.id, user.email ?? undefined);
  }, [user?.id, user?.email, fetchProfile]);

  const authMode: 'supabase' | 'none' = isSupabaseConfigured() ? 'supabase' : 'none';

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut, refreshProfile, authMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
