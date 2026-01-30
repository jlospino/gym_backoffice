import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

import { supabase } from '../supabaseClient';
import { Profile } from '../interfaces/user.interface';

export type UserRole = 'admin' | 'aux_reception' | null;

interface AuthState {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    setSession: (session: Session | null) => void;
    setProfile: (profile: Profile | null) => void;
    setLoading: (loading: boolean) => void;
    clearSession: () => void;
    fetchUserProfile: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    user: null,
    profile: null,
    loading: true,
    setSession: (session) => set({ session, user: session?.user ?? null, loading: false }),
    setProfile: (profile: Profile | null) => set({ profile }),
    setLoading: (loading: boolean) => set({ loading }),
    clearSession: () => set({ session: null, user: null, profile: null, loading: false }),
    fetchUserProfile: async (userId: string) => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (data) {
                set({ profile: data as Profile });
            }
        } catch (error) {
            console.error('Error fetching role:', error);
        }
    }
}));
