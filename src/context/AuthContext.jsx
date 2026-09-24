import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { api } from '../services/api';

const AuthContext = createContext(null);

const CURRENT_USER_KEY = 'fitflow_auth_user';
const CREDENTIALS_KEY = 'fitflow_user_credentials';

// Initial pre-registered users (if user wants to test existing accounts)
const DEFAULT_CREDENTIALS = {
  'admin@fitflow.com': {
    id: 'user-admin-1',
    password: 'Password123',
    role: 'admin',
    full_name: 'Muhammad Islam',
    gym_id: 'gym-001',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  'trainer@fitflow.com': {
    id: 'user-trainer-1',
    password: 'Password123',
    role: 'trainer',
    full_name: 'Alex Morgan',
    gym_id: 'gym-001',
    avatar_url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200&q=80',
  },
  'member@fitflow.com': {
    id: 'user-member-1',
    password: 'Password123',
    role: 'member',
    full_name: 'Sarah Jenkins',
    gym_id: 'gym-001',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
};

const getStoredCredentials = () => {
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
  return DEFAULT_CREDENTIALS;
};

export const AuthProvider = ({ children }) => {
  // Session strictly loads from stored logged-in user, default NULL (must log in!)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved user session:', e);
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user]);

  // Real Supabase session listener if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser(profile);
          }
        } catch (e) {
          console.warn('Could not fetch remote profile:', e);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Strict Login Authentication
  const login = async (email, password) => {
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // 1. Try Supabase Auth first if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });

          if (!error && data?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            const finalUser = profile || {
              id: data.user.id,
              gym_id: 'a0000000-0000-0000-0000-000000000001',
              full_name: data.user.user_metadata?.full_name || email.split('@')[0],
              email: normalizedEmail,
              role: data.user.user_metadata?.role || 'member',
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(normalizedEmail)}`,
            };

            setUser(finalUser);
            return finalUser;
          }
        } catch (sbErr) {
          console.warn('Supabase remote auth check:', sbErr.message);
        }
      }

      // 2. Local Registry Verification
      const credentials = getStoredCredentials();
      const account = credentials[normalizedEmail];

      if (!account) {
        throw new Error('Account not found with this email. Please register first.');
      }

      if (account.password !== password) {
        throw new Error('Incorrect password. Please verify your credentials and try again.');
      }

      // Lookup profile and role
      const profiles = await api.getProfiles();
      const matchedProfile = profiles.find((p) => p.email.toLowerCase() === normalizedEmail) || {
        id: account.id,
        gym_id: account.gym_id || 'gym-001',
        full_name: account.full_name,
        email: normalizedEmail,
        role: account.role,
        avatar_url: account.avatar_url,
      };

      setUser(matchedProfile);
      return matchedProfile;
    } finally {
      setLoading(false);
    }
  };

  // Strict Signup Registration
  const signup = async ({ full_name, email, password, role = 'member' }) => {
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const credentials = getStoredCredentials();
      if (credentials[normalizedEmail]) {
        throw new Error(`An account with email "${email}" already exists. Please log in.`);
      }

      let supabaseUserId = null;

      // Register with Supabase if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: normalizedEmail,
            password,
            options: {
              data: { full_name, role },
            },
          });

          if (!error && data?.user) {
            supabaseUserId = data.user.id;
            const newProfile = {
              id: data.user.id,
              gym_id: 'a0000000-0000-0000-0000-000000000001',
              full_name,
              email: normalizedEmail,
              role,
              created_at: new Date().toISOString(),
            };

            try {
              await supabase.from('profiles').insert([newProfile]);
            } catch (pErr) {
              console.warn('Supabase profiles insert notice:', pErr);
            }
          }
        } catch (sbErr) {
          console.warn('Supabase signup notice:', sbErr);
        }
      }

      // Register account in local credentials
      const newId = supabaseUserId || `user-${role}-${Date.now()}`;
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(full_name)}`;

      credentials[normalizedEmail] = {
        id: newId,
        password,
        role,
        full_name,
        gym_id: 'gym-001',
        avatar_url: avatarUrl,
      };
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));

      // Save profile in directory
      const profiles = await api.getProfiles();
      const newProfile = {
        id: newId,
        gym_id: 'gym-001',
        full_name,
        email: normalizedEmail,
        phone: '',
        avatar_url: avatarUrl,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      profiles.push(newProfile);
      localStorage.setItem('fitflow_profiles', JSON.stringify(profiles));

      // If registered as member, activate membership
      if (role === 'member') {
        const memberships = await api.getMemberships();
        memberships.push({
          id: 'mship-' + Date.now(),
          gym_id: 'gym-001',
          member_id: newId,
          plan_id: 'plan-premium',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          status: 'active',
        });
        localStorage.setItem('fitflow_memberships', JSON.stringify(memberships));
      }

      return newProfile;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
