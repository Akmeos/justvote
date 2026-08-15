"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getAvatars, AvatarItem } from "@/lib/avatars";
import { updateUserProfile } from "@/lib/supabase/data";
import { Check, Sparkles, User as UserIcon } from "lucide-react";

export function InitialProfileSetupModal() {
  const { user, profile, refetchProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarItem | null>(null);
  const [avatarsList, setAvatarsList] = useState<AvatarItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const list = getAvatars();
    setAvatarsList(list);

    if (user) {
      const hasCompletedSetup = localStorage.getItem(`setup-completed-${user.id}`);
      if (!hasCompletedSetup) {
        // Pre-fill username from metadata or email
        const initialName = profile?.username || user.user_metadata?.full_name || user.user_metadata?.name || (user.email ? user.email.split('@')[0] : "Joueur");
        setUsername(initialName);

        // Pre-select first avatar or matching avatar
        const matching = list.find(a => a.url === profile?.avatar_url || a.url === user.user_metadata?.avatar_url) || list[0];
        setSelectedAvatar(matching);

        setIsOpen(true);
      }
    }
  }, [user, profile]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !selectedAvatar) return;

    setLoading(true);
    try {
      // 1. Update Supabase Profile
      await updateUserProfile(user.id, {
        username: username.trim(),
        avatar_url: selectedAvatar.url,
      });

      // 2. Update Local Storage
      localStorage.setItem("user-avatar-url", selectedAvatar.url);
      localStorage.setItem(`setup-completed-${user.id}`, "true");

      // 3. Dispatch event for header topbar
      window.dispatchEvent(new CustomEvent("user-avatar-changed", { detail: selectedAvatar.url }));

      // 4. Refetch profile in AuthProvider
      await refetchProfile();

      setIsOpen(false);
    } catch (err) {
      console.error("Error saving initial profile setup:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border border-indigo-500/30 rounded-[36px] shadow-2xl p-6 sm:p-8 text-white overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30 mb-3">
            <Sparkles className="w-7 h-7 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-200">
            Bienvenue sur Just Vote ! 🎉
          </h2>
          <p className="text-sm text-indigo-200/80 mt-1">
            Personnalise ton pseudo et choisis ton avatar pour commencer à deviner les tendances nationales.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pseudo Input */}
          <div>
            <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2">
              Ton Pseudo de Joueur
            </label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: Akmeos, MasterOracle..."
                className="w-full bg-slate-800/80 border border-indigo-500/30 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-white placeholder-indigo-300/40 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2">
              Choisis ton Avatar
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-56 overflow-y-auto p-1 custom-scrollbar">
              {avatarsList.map((avatar) => {
                const isSelected = selectedAvatar?.id === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`relative flex flex-col items-center p-2 rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? "bg-indigo-600/40 border-indigo-400 scale-105 shadow-lg shadow-indigo-500/30"
                        : "bg-slate-800/40 border-indigo-500/10 hover:border-indigo-500/30 hover:bg-slate-800/80"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center p-1 bg-slate-900/60 border border-white/10 shrink-0">
                      <img src={avatar.url} alt={avatar.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-200/90 truncate w-full text-center mt-1">
                      {avatar.name}
                    </span>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-md">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !username.trim() || !selectedAvatar}
            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-500/25 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enregistrement..." : "Valider et Commencer ⚡️"}
          </button>
        </form>
      </div>
    </div>
  );
}
