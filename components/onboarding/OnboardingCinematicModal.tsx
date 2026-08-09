"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Flame, 
  Trophy, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Award, 
  Play, 
  Compass, 
  ChevronRight,
  Gift,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface OnboardingCinematicModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminPreview?: boolean;
}

export function OnboardingCinematicModal({ 
  isOpen, 
  onClose,
  isAdminPreview = false 
}: OnboardingCinematicModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [votedOption, setVotedOption] = useState<"A" | "B" | null>(null);
  const [showPercentages, setShowPercentages] = useState(false);

  if (!isOpen) return null;

  const handleVote = (option: "A" | "B") => {
    setVotedOption(option);
    setShowPercentages(true);
  };

  const handleComplete = () => {
    if (!isAdminPreview) {
      localStorage.setItem("has_seen_onboarding", "true");
    }
    window.dispatchEvent(new Event("onboarding-completed"));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
      
      {/* Background Glowing Halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-pink-500/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-[36px] shadow-2xl overflow-hidden flex flex-col my-auto text-white">
        
        {/* Header Bar */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-sm shadow-md">
              J
            </div>
            <span className="font-black text-sm text-slate-200 tracking-tight">Just Vote</span>
            {isAdminPreview && (
              <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1">
                <ShieldCheck size={12} /> Aperçu Admin
              </span>
            )}
          </div>

          {/* Steps Pill Indicator */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step} 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  currentStep === step 
                    ? "w-6 bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm" 
                    : step < currentStep 
                    ? "w-2 bg-purple-400" 
                    : "w-2 bg-slate-700"
                )}
              />
            ))}
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Dynamic Step Content */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
          
          {/* STEP 1: PITCH & IMMERSION */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 mb-1">
                  <Sparkles size={14} className="text-indigo-400 animate-pulse" /> Le Quiz N°1 🇫🇷
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                  Devine ce que la France pense vraiment ! 🧠
                </h3>
                <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-md mx-auto">
                  Compare tes prédictions avec des milliers de joueurs sur la Pop Culture, les Pokémon, le Gaming et les grands débats de société.
                </p>
              </div>

              {/* Visual Showcase Tiles */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 space-y-2">
                  <span className="text-2xl">⚡️</span>
                  <h4 className="text-xs font-black text-white">Pokémon & Gaming</h4>
                  <p className="text-[11px] text-slate-400 leading-tight">Les starters ultimes & jeux rétro cultes.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 space-y-2">
                  <span className="text-2xl">🍿</span>
                  <h4 className="text-xs font-black text-white">Pop Culture & Mèmes</h4>
                  <p className="text-[11px] text-slate-400 leading-tight">Internet, cinéma et répliques inoubliables.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-2 font-bold">
                  <Flame size={16} className="text-amber-400" /> +100 PI offerts au démarrage
                </span>
                <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">Bonus Actif</span>
              </div>

            </div>
          )}

          {/* STEP 2: INTERACTIVE DEMO VOTE */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-500/15 border border-purple-500/30 text-purple-300">
                  <Zap size={14} className="text-purple-400" /> Teste ton intuition en direct !
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  Quel est le meilleur Starter Gen 1 ? ⚡️
                </h3>
                <p className="text-xs text-slate-400">Clique sur ta tuile préférée pour comparer ton vote avec la France :</p>
              </div>

              {/* Quiz Interface: Side-by-Side Rectangular Tiles (Left & Right) */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
                
                {/* Option Left (Dracaufeu) */}
                <button
                  onClick={() => handleVote("A")}
                  className={cn(
                    "relative p-4 rounded-3xl border text-center transition-all duration-300 overflow-hidden flex flex-col items-center justify-between min-h-[190px] group cursor-pointer active:scale-95",
                    votedOption === "A"
                      ? "bg-gradient-to-b from-orange-500/30 to-amber-600/30 border-orange-500 shadow-xl shadow-orange-500/25 ring-2 ring-orange-500"
                      : "bg-slate-800/80 border-slate-700/80 hover:border-orange-500/60 hover:bg-slate-800"
                  )}
                >
                  {/* Progress overlay bar on reveal */}
                  {showPercentages && (
                    <div 
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-orange-500/40 to-amber-500/20 transition-all duration-1000 ease-out" 
                      style={{ height: "68%" }}
                    />
                  )}

                  {/* Top Badge */}
                  <div className="relative z-10 w-full flex justify-between items-center text-[10px] font-black text-slate-400">
                    <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">Feu 🔥</span>
                    {showPercentages && <span className="text-orange-400 font-black text-sm">68%</span>}
                  </div>

                  {/* Real Pokemon Image */}
                  <div className="relative z-10 w-24 h-24 my-1 group-hover:scale-110 transition-transform duration-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png" 
                      alt="Dracaufeu" 
                      className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(249,115,22,0.4)]"
                    />
                  </div>

                  {/* Title & Vote CTA */}
                  <div className="relative z-10 w-full space-y-1">
                    <h4 className="font-extrabold text-sm text-white">Dracaufeu</h4>
                    <div className={cn(
                      "w-full py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all",
                      votedOption === "A" 
                        ? "bg-orange-500 text-white shadow-md" 
                        : "bg-slate-700/70 text-slate-300 group-hover:bg-orange-500 group-hover:text-white"
                    )}>
                      {showPercentages ? "68% des votes" : "Choisir ➔"}
                    </div>
                  </div>
                </button>

                {/* Option Right (Tortank) */}
                <button
                  onClick={() => handleVote("B")}
                  className={cn(
                    "relative p-4 rounded-3xl border text-center transition-all duration-300 overflow-hidden flex flex-col items-center justify-between min-h-[190px] group cursor-pointer active:scale-95",
                    votedOption === "B"
                      ? "bg-gradient-to-b from-red-500/20 to-red-600/30 border-red-500 shadow-xl shadow-red-500/25 ring-2 ring-red-500"
                      : "bg-slate-800/80 border-slate-700/80 hover:border-cyan-500/60 hover:bg-slate-800"
                  )}
                >
                  {/* Progress overlay bar on reveal */}
                  {showPercentages && (
                    <div 
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-red-500/30 to-red-600/20 transition-all duration-1000 ease-out" 
                      style={{ height: "32%" }}
                    />
                  )}

                  {/* Top Badge */}
                  <div className="relative z-10 w-full flex justify-between items-center text-[10px] font-black text-slate-400">
                    <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">Eau 🐢</span>
                    {showPercentages && <span className="text-red-400 font-black text-sm">32%</span>}
                  </div>

                  {/* Real Pokemon Image */}
                  <div className="relative z-10 w-24 h-24 my-1 group-hover:scale-110 transition-transform duration-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png" 
                      alt="Tortank" 
                      className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(6,182,212,0.4)]"
                    />
                  </div>

                  {/* Title & Vote CTA */}
                  <div className="relative z-10 w-full space-y-1">
                    <h4 className="font-extrabold text-sm text-white">Tortank</h4>
                    <div className={cn(
                      "w-full py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all",
                      votedOption === "B" 
                        ? "bg-red-500 text-white shadow-md" 
                        : "bg-slate-700/70 text-slate-300 group-hover:bg-cyan-500 group-hover:text-white"
                    )}>
                      {showPercentages ? "32% des votes" : "Choisir ➔"}
                    </div>
                  </div>
                </button>

              </div>

              {/* Real-time intuition result highlight */}
              {showPercentages ? (
                votedOption === "A" ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-center animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-1">
                    <div className="text-xs font-black flex flex-col items-center justify-center gap-0.5">
                      <span className="flex items-center gap-1.5 font-black text-emerald-400 text-sm">
                        <CheckCircle2 size={16} /> Bonne réponse !
                      </span>
                      <span className="text-slate-200 font-semibold">68% de la France pense comme toi !</span>
                    </div>
                    <span className="text-[11px] font-black text-amber-300 inline-block">
                      +50 PI d&apos;Intuition gagnés ! 🔮
                    </span>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-center animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-1">
                    <div className="text-xs font-black flex flex-col items-center justify-center gap-0.5">
                      <span className="flex items-center gap-1.5 font-black text-red-400 text-sm">
                        <X size={16} className="bg-red-500/30 rounded-full p-0.5" /> Mauvaise réponse !
                      </span>
                      <span className="text-slate-200 font-semibold">Seulement 32% partagent ton choix.</span>
                    </div>
                    <span className="text-[11px] font-black text-amber-300 inline-block">
                      +50 PI d&apos;Intuition tout de même ! 🔮
                    </span>
                  </div>
                )
              ) : (
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-400 text-center text-xs font-medium animate-pulse">
                  👆 Clique sur Dracaufeu ou Tortank pour révéler le vote national !
                </div>
              )}

            </div>
          )}

          {/* STEP 3: GAMIFICATION & RANKING SHOWCASE */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  <Trophy size={14} className="text-amber-400" /> Système de Rangs & Niveaux
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  Grimpe les échelons de l&apos;Oracle National ! 🏆
                </h3>
              </div>

              {/* 3 Key Gamification Bento Cards */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/70 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xl shrink-0">
                    🔮
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white">Points d&apos;Intuition (PI)</h4>
                    <p className="text-[11px] text-slate-400 leading-snug">Chaque bonne prédiction t&apos;accorde des PI pour monter de niveau et débloquer des avatars majeurs.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/70 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shrink-0">
                    🔥
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white">Série (Streak)</h4>
                    <p className="text-[11px] text-slate-400 leading-snug">Chaque jour pour obtenir ton streak et multiplier tes récompenses par 2.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/70 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xl shrink-0">
                    👑
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white">Classement Général</h4>
                    <p className="text-[11px] text-slate-400 leading-snug">Mesure-toi au Top 10 des meilleurs Oracles de France et débloque le titre légendaire.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: WELCOME REWARD & ACTION CTA */}
          {currentStep === 4 && (
            <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-500 to-orange-500 p-0.5 shadow-xl shadow-amber-500/20 animate-bounce">
                <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-4xl">
                  🎁
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  Ton profil est prêt ! 🎉
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Ton bonus de démarrage t&apos;attend. Prépare-toi à faire tes premières prédictions sur les quiz du moment !
                </p>
              </div>

              {/* Reward Chest Box */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">Cadeau d&apos;arrivée</span>
                <p className="text-2xl font-black text-white tracking-tight">+100 PI Crédités 🔮</p>
                <p className="text-[11px] text-amber-200">Titre attribué : Apprenti Oracle 🌟</p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play size={16} className="fill-current" />
                <span>Lancer mon premier Quiz 🚀</span>
              </button>

            </div>
          )}

          {/* Navigation Buttons for steps 1-3 */}
          {currentStep < 4 && (
            <div className="pt-6 flex items-center justify-between border-t border-slate-800/60 mt-4">
              <button
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1) as any)}
                className="text-xs font-extrabold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                Précédent
              </button>

              {/* Hide Next button on step 2 until the user has voted */}
              {currentStep === 2 && !showPercentages ? (
                <span className="text-[11px] font-bold text-slate-500 italic">
                  Choisis une réponse pour continuer ➔
                </span>
              ) : (
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1) as any)}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer animate-in fade-in duration-200"
                >
                  <span>Suivant</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
