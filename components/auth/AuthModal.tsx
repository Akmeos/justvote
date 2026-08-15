"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Mail, Lock, User, Sparkles, LogIn, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const supabase = createClient();

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSuccessMsg("Lien de réinitialisation envoyé ! Vérifie ta boîte mail 📩");
      } else if (isMagicLink) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        setSuccessMsg("Lien magique envoyé ! Vérifie ta boîte mail 📩");
      } else if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split("@")[0],
            },
          },
        });
        if (error) throw error;
        setSuccessMsg("Compte créé avec succès ! Connecté 🎉");
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1200);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg("Ravi de te revoir ! Connexion réussie 🚀");
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Une erreur s'est produite lors de l'authentification.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    setLoading(true);
    setErrorMsg(null);
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || `Erreur lors de la connexion avec ${provider}.`);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Decorative ambient gradient */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-500/30 mb-3">
            <Sparkles size={28} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {isForgotPassword
              ? "Mot de passe oublié 🔒"
              : isMagicLink
              ? "Connexion sans mot de passe 🪄"
              : isSignUp
              ? "Rejoins la communauté 🚀"
              : "Connexion à Just Vote 🔐"}
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {isForgotPassword
              ? "Saisis ton email pour recevoir un lien de réinitialisation"
              : isMagicLink
              ? "Reçois un lien de connexion instantané par email"
              : isSignUp
              ? "Sauvegarde tes scores, débloque des badges et gagne des PI"
              : "Accède à ton profil et tes statistiques d'opinion"}
          </p>
        </div>

        {/* Status Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && !isMagicLink && !isForgotPassword && (
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5">
                Pseudo
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ex: Akmeos"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5">
              Adresse Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton.email@exemple.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {!isMagicLink && !isForgotPassword && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                  Mot de passe
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setIsMagicLink(false);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>
                  {isForgotPassword
                    ? "Envoyer le lien de réinitialisation"
                    : isMagicLink
                    ? "Envoyer le lien magique"
                    : isSignUp
                    ? "Créer mon compte"
                    : "Se connecter"}
                </span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {!isForgotPassword && (
          <>
            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold uppercase text-slate-400 shrink-0">
                Ou continuer avec
              </span>
              <div className="border-t border-slate-200 w-full" />
            </div>

            {/* Social OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>

              {/* Apple Button */}
              <button
                type="button"
                onClick={() => handleSocialLogin("apple")}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.76.13-9.62-1.92-14.59-6.14-3.23-2.76-7.14-7.46-11.75-14.12-6.53-9.48-11.79-20.2-15.77-32.17-3.99-11.96-5.99-23.4-5.99-34.31 0-14.55 3.73-26.68 11.21-36.38 7.48-9.7 16.92-14.67 28.32-14.92 4.43 0 9.4 1.13 14.9 3.38 5.5 2.26 9.45 3.39 11.85 3.39 2.05 0 6.1-1.18 12.16-3.53 6.06-2.35 11.19-3.41 15.39-3.18 10.63.66 19.37 4.54 26.23 11.64-9.57 5.79-14.24 13.91-14.01 24.36.23 8.08 3.3 14.86 9.21 20.34 5.92 5.48 13.06 8.7 21.43 9.66-2.45 7.21-5.78 14.49-9.98 21.84zM119.22 31.84c0-7.07 2.58-13.92 7.74-20.55 5.16-6.63 11.67-10.69 19.53-12.18.3 1.83.45 3.51.45 5.04 0 6.94-2.61 13.79-7.83 20.55-5.22 6.76-11.74 10.74-19.56 11.94-.08-1.54-.33-3.14-.33-4.8z"/>
                </svg>
                <span>Apple</span>
              </button>
            </div>
          </>
        )}

        {/* Toggle options */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-2">
          {isForgotPassword ? (
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 block mx-auto cursor-pointer"
            >
              ← Retour à la connexion
            </button>
          ) : (
            <>
              {!isMagicLink && (
                <button
                  onClick={() => setIsMagicLink(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 block mx-auto cursor-pointer"
                >
                  🪄 Me connecter par Lien Magique (sans mot de passe)
                </button>
              )}

              {isMagicLink && (
                <button
                  onClick={() => setIsMagicLink(false)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 block mx-auto cursor-pointer"
                >
                  🔑 Utiliser un mot de passe
                </button>
              )}

              <div className="text-xs text-slate-500 font-semibold pt-1">
                {isSignUp ? (
                  <>
                    Déjà un compte ?{" "}
                    <button
                      onClick={() => {
                        setIsSignUp(false);
                        setIsMagicLink(false);
                        setIsForgotPassword(false);
                      }}
                      className="font-extrabold text-indigo-600 hover:underline cursor-pointer"
                    >
                      Se connecter
                    </button>
                  </>
                ) : (
                  <>
                    Pas encore de compte ?{" "}
                    <button
                      onClick={() => {
                        setIsSignUp(true);
                        setIsMagicLink(false);
                        setIsForgotPassword(false);
                      }}
                      className="font-extrabold text-indigo-600 hover:underline cursor-pointer"
                    >
                      Créer un compte
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
