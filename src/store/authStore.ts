import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

import { supabase } from '../supabaseClient';

export type UserRole = 'admin' | 'aux_reception' | null;

interface AuthState {
    session: Session | null;
    user: User | null;
    role: UserRole;
    loading: boolean;
    setSession: (session: Session | null) => void;
    setRole: (role: UserRole) => void;
    setLoading: (loading: boolean) => void;
    clearSession: () => void;
    fetchUserRole: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    user: null,
    role: null,
    loading: true,
    setSession: (session) => set({ session, user: session?.user ?? null, loading: false }),
    setRole: (role) => set({ role }),
    setLoading: (loading) => set({ loading }),
    clearSession: () => set({ session: null, user: null, role: null, loading: false }),
    fetchUserRole: async (userId: string) => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (data) {
                set({ role: data.role as UserRole });
            }
        } catch (error) {
            console.error('Error fetching role:', error);
        }
    }
}));
