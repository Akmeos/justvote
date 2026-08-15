"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchUserProfile, ensureUserProfile, UserProfile } from "@/lib/supabase/data";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refetchProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refetchProfile: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserAndProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      let currentUser = session?.user || null;

      if (!currentUser) {
        const { data: { user: fetchedUser } } = await supabase.auth.getUser();
        currentUser = fetchedUser;
      }

      setUser(currentUser);

      if (currentUser) {
        const userProf = await ensureUserProfile(currentUser);
        setProfile(userProf);
      } else {
        setProfile(null);
      }
    } catch (e) {
      console.error("Error loading Auth user:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        const userProf = await ensureUserProfile(currentUser);
        setProfile(userProf);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refetchProfile = async () => {
    if (user) {
      const userProf = await ensureUserProfile(user);
      setProfile(userProf);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, refetchProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
