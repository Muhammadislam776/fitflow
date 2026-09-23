import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { api } from '../services/api';
import { INITIAL_PROFILES } from '../data/initialSeedData';

const AuthContext = createContext(null);

const CURRENT_USER_KEY = 'fitflow_auth_user';
const CREDENTIALS_KEY = 'fitflow_user_credentials';

// Pre-seeded credentials for instant testing
const DEFAULT_CREDENTIALS = {
  'admin@fitflow.com': {
    id: 'user-admin-1',
    password: 'password123',
    role: 'admin',
    full_name: 'Muhammad Islam',
    gym_id: 'gym-001',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  'alex.trainer@fitflow.com': {
    id: 'user-trainer-1',
    password: 'password123',
    role: 'trainer',
    full_name: 'Alex Morgan',
    gym_id: 'gym-001',
    avatar_url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200&q=80',
  },
  'sarah@example.com': {
    id: 'user-member-1',
    password: 'password123',
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
  // Load stored active session
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved user session:', e);
    }
    // Default to initial admin so demo exploration remains friction-free
    return INITIAL_PROFILES[0];
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
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Login action: verifies email and password against Supabase or credentials store
  const login = async (email, password) => {
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      let remoteUser = null;

      // Try Supabase Auth first if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });

          if (!error && data?.user) {
            remoteUser = data.user;
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
          console.warn('Supabase auth attempt failed, checking local credentials fallback:', sbErr.message);
        }
      }

      // Check credentials store
      const credentials = getStoredCredentials();
      const account = credentials[normalizedEmail];

      if (!account) {
        throw new Error(`No account found for "${email}". Please sign up first.`);
      }

      if (account.password !== password) {
        throw new Error('Incorrect password. Please verify your credentials and try again.');
      }

      // Lookup full profile
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

  // Signup action: registers user in Supabase Auth and credentials registry
  const signup = async ({ full_name, email, password, role = 'member' }) => {
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      let supabaseUserId = null;

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

            // Attempt to insert profile if table exists
            try {
              await supabase.from('profiles').insert([newProfile]);
            } catch (pErr) {
              console.warn('Note: profiles table not populated yet in Supabase:', pErr);
            }
          }
        } catch (sbErr) {
          console.warn('Supabase signUp warning:', sbErr);
        }
      }

      // Local registration
      const credentials = getStoredCredentials();
      const newId = supabaseUserId || `user-${role}-${Date.now()}`;
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(full_name)}`;

      // Save credential
      credentials[normalizedEmail] = {
        id: newId,
        password,
        role,
        full_name,
        gym_id: 'gym-001',
        avatar_url: avatarUrl,
      };
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));

      // Save profile in api store
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

      // If registering as member, create active membership
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

  // Quick switch for live testing all three user personas
  const switchDemoUser = (role) => {
    if (role === 'admin') {
      setUser(INITIAL_PROFILES[0]); // Muhammad Islam
    } else if (role === 'trainer') {
      setUser(INITIAL_PROFILES[1]); // Alex Morgan
    } else if (role === 'member') {
      setUser(INITIAL_PROFILES[4]); // Sarah Jenkins
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'member',
        loading,
        login,
        signup,
        logout,
        switchDemoUser,
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
