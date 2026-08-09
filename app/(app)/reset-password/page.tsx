"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, CheckCircle2, AlertCircle, ArrowRight, KeyRound, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Impossible de réinitialiser le mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      
      {/* Background Halo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white rounded-[36px] p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Ambient Gradient Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl shadow-indigo-500/30 mb-3">
            <KeyRound size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Nouveau mot de passe 🔑
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Choisis un nouveau mot de passe sécurisé pour ton compte Just Vote.
          </p>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle size={18} className="shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success View */}
        {success ? (
          <div className="text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-3xl text-sm font-bold flex flex-col items-center gap-2">
              <CheckCircle2 size={36} className="text-emerald-500 animate-bounce" />
              <span>Mot de passe réinitialisé avec succès ! 🎉</span>
              <p className="text-xs text-emerald-600 font-medium">
                Ton nouveau mot de passe est enregistré. Tu es maintenant connecté à Just Vote.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>Accéder à mon tableau de bord 🚀</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="6 caractères minimum"
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Répète ton nouveau mot de passe"
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Enregistrer le mot de passe</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
