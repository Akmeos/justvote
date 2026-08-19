"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Search, LogIn, User as UserIcon } from "lucide-react";

import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { AuthModal } from "@/components/auth/AuthModal";
import { OnboardingCinematicModal } from "@/components/onboarding/OnboardingCinematicModal";
import { InitialProfileSetupModal } from "@/components/auth/InitialProfileSetupModal";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [avatarUrl, setAvatarUrl] = useState("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png");
  const [username, setUsername] = useState<string>("Joueur");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const { user, profile } = useAuth();

  useEffect(() => {
    // Check first visit onboarding
    const hasSeenOnboarding = localStorage.getItem("has_seen_onboarding");
    if (!hasSeenOnboarding) {
      setIsOnboardingOpen(true);
    }

    // Sync avatar from profile, user metadata or local storage
    if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    } else if (user?.user_metadata?.avatar_url || user?.user_metadata?.picture) {
      setAvatarUrl(user.user_metadata.avatar_url || user.user_metadata.picture);
    } else {
      const saved = localStorage.getItem("user-avatar-url");
      if (saved) setAvatarUrl(saved);
    }

    // Sync in-game username (exclude Google OAuth full name)
    const savedName = localStorage.getItem("user-username");
    const googleFullName = user?.user_metadata?.full_name || user?.user_metadata?.name;

    if (savedName) {
      setUsername(savedName);
    } else if (profile?.username && profile.username !== googleFullName) {
      setUsername(profile.username);
    } else if (user?.email) {
      setUsername(user.email.split('@')[0]);
    } else if (profile?.username) {
      setUsername(profile.username);
    } else {
      setUsername("Joueur");
    }

    // Sync when avatar or username changes
    const handleAvatarChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail === "string") {
        setAvatarUrl(customEvent.detail);
      }
    };

    const handleUsernameChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail === "string") {
        setUsername(customEvent.detail);
      }
    };

    window.addEventListener("user-avatar-changed", handleAvatarChange);
    window.addEventListener("user-username-changed", handleUsernameChange);
    return () => {
      window.removeEventListener("user-avatar-changed", handleAvatarChange);
      window.removeEventListener("user-username-changed", handleUsernameChange);
    };
  }, [profile, user]);

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* Topbar for mobile/desktop */}
        <header className="flex justify-between items-center p-6 md:px-10 lg:px-12 pt-8">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-lg leading-none">J</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Just Vote
            </h1>
          </div>

          <div className="hidden md:flex items-center bg-surface px-4 py-3 rounded-full w-96 shadow-sm border border-gray-100">
            <Search className="text-gray-400 mr-2" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher des quiz, des catégories..." 
              className="bg-transparent outline-none w-full text-sm placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-3">

            {user ? (
              <Link 
                href="/profile"
                className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover:border-indigo-300 transition-all"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-indigo-200 shadow-soft bg-yellow-100 flex items-center justify-center p-0.5 shrink-0">
                  <img src={avatarUrl} alt="Avatar Joueur" className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-xs font-black text-gray-800 max-w-[160px] truncate hidden sm:inline">
                  {username}
                </span>
              </Link>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-xs font-black shadow-md hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-95"
              >
                <LogIn size={15} />
                <span>Connexion</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24 md:pb-10 px-6 md:px-10 lg:px-12">
          {children}
        </main>
        <MobileNav />
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <OnboardingCinematicModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <InitialProfileSetupModal />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}

