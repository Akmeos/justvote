"use client";

import React, { useState } from "react";
import { 
  PlusCircle, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ShieldAlert, 
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface QuizSuggestion {
  id: string;
  type: "duel" | "quiz";
  question: string; // Quiz title or Duel question
  optionA?: string; // Only for duels
  optionB?: string; // Only for duels
  category: string;
  votes: number;
  status: "pending" | "approved" | "rejected";
  proposedBy: string;
  avatarUrl: string;
  hasVoted?: boolean;
}

const initialSuggestions: QuizSuggestion[] = [
  // Duels
  {
    id: "sug-1",
    type: "duel",
    question: "Instagram vs TikTok",
    optionA: "Instagram",
    optionB: "TikTok",
    category: "societe",
    votes: 154,
    status: "pending",
    proposedBy: "Maxime",
    avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
  },
  {
    id: "sug-2",
    type: "duel",
    question: "Star Wars vs Le Seigneur des Anneaux",
    optionA: "Star Wars",
    optionB: "Le Seigneur des Anneaux",
    category: "films",
    votes: 128,
    status: "pending",
    proposedBy: "Lucas",
    avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
  },
  {
    id: "sug-3",
    type: "duel",
    question: "Café vs Thé",
    optionA: "Café",
    optionB: "Thé",
    category: "pop-culture",
    votes: 95,
    status: "approved",
    proposedBy: "Amélie",
    avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
  },
  {
    id: "sug-4",
    type: "duel",
    question: "iOS vs Android",
    optionA: "iOS",
    optionB: "Android",
    category: "autre",
    votes: 86,
    status: "pending",
    proposedBy: "Jean",
    avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png"
  },
  // Quizzes (No options required, just title)
  {
    id: "sug-quiz-1",
    type: "quiz",
    question: "Le Quiz Ultime de la Gastronomie Française 🧀",
    category: "pop-culture",
    votes: 210,
    status: "approved",
    proposedBy: "Sophie",
    avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png"
  },
  {
    id: "sug-quiz-2",
    type: "quiz",
    question: "Test: Quelle Viennoiserie es-tu vraiment ? 🥐",
    category: "pop-culture",
    votes: 145,
    status: "approved",
    proposedBy: "Antoine",
    avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
  },
  {
    id: "sug-quiz-3",
    type: "quiz",
    question: "Quiz de Culture Générale: Spécial Années 90 🧠",
    category: "societe",
    votes: 120,
    status: "pending",
    proposedBy: "Nathan",
    avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
  },
  {
    id: "sug-quiz-4",
    type: "quiz",
    question: "Quiz Pokémon: Connais-tu la 1ère Génération ? 🦖",
    category: "pokemon",
    votes: 95,
    status: "pending",
    proposedBy: "Emma",
    avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
  }
];

const categories = [
  { 
    id: "pop-culture", 
    name: "Pop Culture", 
    emoji: "🍿", 
    color: "from-purple-400 to-purple-600",
    bgClass: "bg-purple-50/60 border-purple-100/80 hover:bg-purple-100/50",
    textClass: "text-purple-950",
    pillClass: "bg-purple-100/70 text-purple-700 border-purple-200/30",
    unselectedBtnClass: "border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 hover:text-purple-700 text-gray-500 bg-gray-50/50",
    selectedBtnClass: "border-purple-300 bg-purple-50 text-purple-700 shadow-sm ring-2 ring-purple-300/10"
  },
  { 
    id: "gaming", 
    name: "Gaming", 
    emoji: "🎮", 
    color: "from-blue-400 to-blue-600",
    bgClass: "bg-blue-50/60 border-blue-100/80 hover:bg-blue-100/50",
    textClass: "text-blue-950",
    pillClass: "bg-blue-100/70 text-blue-700 border-blue-200/30",
    unselectedBtnClass: "border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 hover:text-blue-700 text-gray-500 bg-gray-50/50",
    selectedBtnClass: "border-blue-300 bg-blue-50 text-blue-700 shadow-sm ring-2 ring-blue-300/10"
  },
  { 
    id: "pokemon", 
    name: "Pokémon", 
    emoji: "⚡️", 
    color: "from-yellow-400 to-yellow-600",
    bgClass: "bg-amber-50/60 border-amber-100/80 hover:bg-amber-100/50",
    textClass: "text-amber-950",
    pillClass: "bg-amber-100/70 text-amber-700 border-amber-200/30",
    unselectedBtnClass: "border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 hover:text-amber-750 text-gray-500 bg-gray-50/50",
    selectedBtnClass: "border-amber-300 bg-amber-50 text-amber-800 shadow-sm ring-2 ring-amber-300/10"
  },
  { 
    id: "films", 
    name: "Films", 
    emoji: "🎬", 
    color: "from-red-400 to-red-600",
    bgClass: "bg-red-50/60 border-red-100/80 hover:bg-red-100/50",
    textClass: "text-red-950",
    pillClass: "bg-red-100/70 text-red-700 border-red-200/30",
    unselectedBtnClass: "border-gray-100 hover:border-red-200 hover:bg-red-50/30 hover:text-red-700 text-gray-500 bg-gray-50/50",
    selectedBtnClass: "border-red-300 bg-red-50 text-red-700 shadow-sm ring-2 ring-red-300/10"
  },
  { 
    id: "series-tv", 
    name: "Séries TV", 
    emoji: "📺", 
    color: "from-emerald-400 to-emerald-600",
    bgClass: "bg-emerald-50/60 border-emerald-100/80 hover:bg-emerald-100/50",
    textClass: "text-emerald-950",
    pillClass: "bg-emerald-100/70 text-emerald-700 border-emerald-200/30",
    unselectedBtnClass: "border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 hover:text-emerald-700 text-gray-500 bg-gray-50/50",
    selectedBtnClass: "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm ring-2 ring-emerald-300/10"
  },
  { 
    id: "societe", 
    name: "Société", 
    emoji: "👥", 
    color: "from-orange-400 to-orange-600",
    bgClass: "bg-orange-50/60 border-orange-100/80 hover:bg-orange-100/50",
    textClass: "text-orange-950",
    pillClass: "bg-orange-100/70 text-orange-700 border-orange-200/30",
    unselectedBtnClass: "border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 hover:text-orange-700 text-gray-500 bg-gray-50/50",
    selectedBtnClass: "border-orange-300 bg-orange-50 text-orange-700 shadow-sm ring-2 ring-orange-300/10"
  },
  { 
    id: "gastronomie", 
    name: "Gastronomie", 
    emoji: "🍳", 
    color: "from-pink-400 to-pink-600",
    bgClass: "bg-pink-50/60 border-pink-100/80 hover:bg-pink-100/50",
    textClass: "text-pink-950",
    pillClass: "bg-pink-100/70 text-pink-700 border-pink-200/30",
    unselectedBtnClass: "border-gray-100 hover:border-pink-200 hover:bg-pink-50/30 hover:text-pink-700 text-gray-500 bg-gray-50/50",
    selectedBtnClass: "border-pink-300 bg-pink-50 text-pink-700 shadow-sm ring-2 ring-pink-300/10"
  },
  { 
    id: "autre", 
    name: "Autre", 
    emoji: "💡", 
    color: "from-gray-400 to-slate-500",
    bgClass: "bg-gray-50/60 border-gray-150 hover:bg-gray-100/50",
    textClass: "text-gray-950",
    pillClass: "bg-gray-200/70 text-gray-700 border-gray-300/30",
    unselectedBtnClass: "border-gray-100 hover:border-gray-300 hover:bg-gray-100/30 hover:text-gray-700 text-gray-500 bg-gray-50/50",
    selectedBtnClass: "border-gray-300 bg-gray-100 text-gray-700 shadow-sm ring-2 ring-gray-300/10"
  }
];

import { submitQuizProposal } from "@/lib/supabase/data";
import { useAuth } from "@/components/auth/AuthProvider";

export default function ProposeQuizPage() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<QuizSuggestion[]>(initialSuggestions);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  
  // Tabs for the list: "duel" or "quiz"
  const [activeListTab, setActiveListTab] = useState<"duel" | "quiz">("duel");
  
  // Tab for the proposal form type: "duel" or "quiz"
  const [proposalType, setProposalType] = useState<"duel" | "quiz">("duel");

  // Form State
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("pop-culture");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handlePropose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;
    if (proposalType === "duel" && (!optionA || !optionB)) return;

    setIsSubmitting(true);
    
    try {
      await submitQuizProposal({
        userId: user?.id,
        title: question.trim(),
        categoryId: selectedCategory,
        description: proposalType === "duel" ? `Duel: ${optionA} VS ${optionB}` : question.trim(),
        questionsData: proposalType === "duel" ? [{ optionA, optionB }] : [],
      });

      const newSuggestion: QuizSuggestion = {
        id: `sug-${Date.now()}`,
        type: proposalType,
        question: question.trim(),
        optionA: proposalType === "duel" ? optionA.trim() : undefined,
        optionB: proposalType === "duel" ? optionB.trim() : undefined,
        category: selectedCategory,
        votes: 1,
        status: "pending",
        proposedBy: user?.email ? user.email.split('@')[0] : "Vous",
        avatarUrl: localStorage.getItem("user-avatar-url") || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
        hasVoted: true
      };

      setSuggestions(prev => [newSuggestion, ...prev]);
      setQuestion("");
      setOptionA("");
      setOptionB("");
      setSuccessMessage(proposalType === "duel" ? "Duel proposé à la communauté et enregistré !" : "Idée de quiz proposée à la communauté et enregistrée !");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Erreur lors de la proposition du quiz:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = (id: string) => {
    setSuggestions(prev => 
      prev.map(s => {
        if (s.id === id) {
          const hasVoted = !s.hasVoted;
          return {
            ...s,
            votes: s.votes + (hasVoted ? 1 : -1),
            hasVoted
          };
        }
        return s;
      })
    );
  };

  const handleAdminAction = (id: string, action: "pending" | "approved" | "rejected") => {
    setSuggestions(prev => 
      prev.map(s => {
        if (s.id === id) {
          return { ...s, status: action };
        }
        return s;
      })
    );
  };

  // Filter logic:
  // 1. Must match activeListTab (type: "duel" or "quiz")
  // 2. If Admin Mode is OFF: show ONLY "approved" suggestions.
  // 3. If Admin Mode is ON: show ALL suggestions (pending, approved, rejected) so the admin can validate/reject.
  // 4. Sort: Descending order (highest votes first).
  const visibleSuggestions = suggestions
    .filter(s => {
      // Check type tab
      if (s.type !== activeListTab) return false;
      
      // If Admin Mode is ON, see everything. If OFF, only see approved
      if (isAdminMode) return true;
      return s.status === "approved";
    })
    .sort((a, b) => b.votes - a.votes);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      
      {/* Header Panel */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 p-8 rounded-[32px] border border-purple-500/20 shadow-float">
        {/* Decorative Glowing Orbs */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]">💡</span>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Vote ou Propose un Quiz
              </h1>
            </div>
            <p className="text-sm text-white/80 font-medium leading-relaxed">
              Proposez de nouveaux duels ou de grands quiz thématiques. Votez pour les idées validées de la communauté.
            </p>
          </div>

          {/* Simulated Admin Mode Toggle Switch */}
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shadow-lg self-start md:self-auto transition-all duration-300 hover:bg-white/10">
            <div className="p-2 bg-yellow-400/20 rounded-xl text-yellow-300">
              <ShieldAlert size={18} />
            </div>
            <div className="text-left">
              <div className="text-[9px] font-black text-white/50 uppercase tracking-wider">Simulateur</div>
              <div className="text-xs font-bold text-white">Mode Administrateur</div>
            </div>
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={cn(
                "w-11 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none ml-2 flex items-center",
                isAdminMode ? "bg-emerald-500 justify-end" : "bg-white/20 justify-start"
              )}
            >
              <motion.div 
                layout 
                className="w-5 h-5 rounded-full bg-white shadow-md"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Info notice about visibility depending on Admin Mode */}
      <div className="p-4 bg-white border border-gray-100 rounded-[24px] shadow-sm flex items-center gap-3">
        <span className="text-xl">🔒</span>
        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
          {isAdminMode ? (
            <span className="text-emerald-600 font-black">
              🛡️ Mode Admin : Vous pouvez modérer toutes les propositions de la communauté.
            </span>
          ) : (
            <span>
              👤 Mode Utilisateur : Seuls les quiz validés par l&apos;administrateur sont affichés.
            </span>
          )}
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Propose form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -mr-6 -mt-6"></div>
            
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2 mb-4">
              <PlusCircle className="text-primary" size={22} />
              Proposer une idée
            </h2>

            {/* Proposal Type Selector Tabs */}
            <div className="grid grid-cols-2 bg-gray-50 p-1 rounded-2xl mb-5 border border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setProposalType("duel");
                  setQuestion("");
                }}
                className={cn(
                  "py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5",
                  proposalType === "duel" 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                ⚔️ Un Duel
              </button>
              <button
                type="button"
                onClick={() => {
                  setProposalType("quiz");
                  setQuestion("");
                }}
                className={cn(
                  "py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5",
                  proposalType === "quiz" 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                🧩 Un Quiz
              </button>
            </div>

            <form onSubmit={handlePropose} className="space-y-5">
              
              {/* Category selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                  Catégorie
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "py-2.5 px-1 text-center rounded-xl border text-[11px] font-black transition-all flex flex-col items-center gap-1 active:scale-95",
                        selectedCategory === cat.id
                          ? cat.selectedBtnClass
                          : cat.unselectedBtnClass
                      )}
                    >
                      <span className="text-sm">{cat.emoji}</span>
                      <span className="truncate w-full">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Inputs depending on type */}
              <div className="space-y-4 pt-2">
                {proposalType === "duel" ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                        La Question du duel
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Le meilleur univers de super-héros ?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-100 outline-none text-sm placeholder:text-gray-400 font-bold focus:border-primary transition-colors bg-gray-50/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                          Option A 🔵
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Marvel"
                          value={optionA}
                          onChange={(e) => setOptionA(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-gray-100 outline-none text-sm placeholder:text-gray-400 font-bold focus:border-blue-500 transition-colors bg-gray-50/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                          Option B 🔴
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: DC Comics"
                          value={optionB}
                          onChange={(e) => setOptionB(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-gray-100 outline-none text-sm placeholder:text-gray-400 font-bold focus:border-red-500 transition-colors bg-gray-50/50"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                      Nom / Titre du Quiz
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Le grand quiz des Capitales du Monde 🌍"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-100 outline-none text-sm placeholder:text-gray-400 font-bold focus:border-primary transition-colors bg-gray-50/50"
                    />
                    <p className="text-[9px] text-gray-400 font-bold mt-1">
                      💡 Indiquez uniquement le titre. Les questions du quiz seront rédigées ultérieurement.
                    </p>
                  </div>
                )}
              </div>

              {/* Status information notice */}
              <div className="p-3.5 bg-amber-50/60 border border-amber-100/50 rounded-2xl flex gap-2.5">
                <span className="text-base text-amber-500 mt-0.5">⏳</span>
                <p className="text-[10px] text-amber-700/80 font-bold leading-normal">
                  Votre proposition apparaîtra comme <span className="underline">En attente de validation</span>. Elle ne sera visible des autres utilisateurs que lorsqu&apos;elle aura été validée.
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full bg-gradient-to-tr from-primary to-primary-light hover:shadow-lg text-white font-extrabold py-3.5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 active:scale-[0.98]",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Send size={14} /> Soumettre la proposition
                  </>
                )}
              </button>
            </form>

            <AnimatePresence>
              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl text-[11px] font-bold text-center"
                >
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Suggestions Feed List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm min-h-[500px] flex flex-col">
            
            {/* Feed header & list tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-lg">📋</span>
                <h2 className="text-lg font-black text-gray-800">
                  Idées Soumises
                </h2>
              </div>

              {/* Main List Tabs: Duels vs Quizzes */}
              <div className="flex bg-gray-50 border border-gray-100 p-0.5 rounded-xl self-start sm:self-auto">
                <button
                  onClick={() => setActiveListTab("duel")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5",
                    activeListTab === "duel"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  ⚔️ Duels
                </button>
                <button
                  onClick={() => setActiveListTab("quiz")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5",
                    activeListTab === "quiz"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  🧩 Quiz
                </button>
              </div>
            </div>

            {/* List item mapping */}
            <div className="space-y-4 flex-1">
              <AnimatePresence mode="popLayout">
                {visibleSuggestions.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center text-gray-400"
                  >
                    <span className="text-3xl mb-2">🔒</span>
                    <p className="text-xs font-black">Aucune suggestion validée disponible dans cette liste.</p>
                    <p className="text-[10px] text-gray-400 mt-1 max-w-xs">
                      Activez le **Mode Administrateur** en haut de page pour voir les suggestions en attente de validation.
                    </p>
                  </motion.div>
                ) : (
                  visibleSuggestions.map((sug) => {
                    const catInfo = categories.find(c => c.id === sug.category) || categories[5];
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={sug.id}
                        className={cn(
                          "p-4 rounded-[24px] border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden",
                          catInfo.bgClass
                        )}
                      >
                        {/* Left part: Suggestion Detail */}
                        <div className="space-y-2.5 flex-1 min-w-0">
                          {/* User tag, category, and type tag */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1 bg-white/60 border border-white/40 rounded-full px-2 py-0.5 shadow-sm">
                              <img src={sug.avatarUrl} alt="" className="w-3.5 h-3.5 rounded-full object-contain" />
                              <span className="text-[9px] font-black text-gray-600">Par {sug.proposedBy}</span>
                            </div>
                            <span className={cn(
                              "text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full border shadow-sm",
                              catInfo.pillClass
                            )}>
                              {catInfo.emoji} {catInfo.name}
                            </span>
                            <span className="text-[8px] font-bold text-gray-400 bg-white/60 border border-white/40 px-2 py-0.5 rounded-full uppercase shadow-sm">
                              {sug.type}
                            </span>
                          </div>
 
                          {/* Question text */}
                          <div>
                            <h3 className={cn("text-sm font-black leading-tight", catInfo.textClass)}>
                              {sug.question}
                            </h3>
                            {sug.type === "duel" && sug.optionA && sug.optionB && (
                              <div className="text-[11px] font-bold mt-1.5 flex items-center gap-1.5">
                                <span className="text-blue-600 bg-white/70 px-2 py-0.5 rounded-lg border border-blue-100/50 shadow-sm">{sug.optionA}</span>
                                <span className="opacity-60 text-[9px] font-black uppercase text-gray-500">vs</span>
                                <span className="text-red-600 bg-white/70 px-2 py-0.5 rounded-lg border border-red-100/50 shadow-sm">{sug.optionB}</span>
                              </div>
                            )}
                          </div>

                          {/* Status Badge (always visible to Admin, only shows 'approved' for normal users if they view it) */}
                          <div className="flex items-center gap-1.5">
                            {sug.status === "pending" && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md animate-pulse">
                                <Clock size={10} /> ⏳ En attente de validation
                              </span>
                            )}
                            {sug.status === "approved" && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                                <CheckCircle size={10} /> ✅ Validé & En Ligne
                              </span>
                            )}
                            {sug.status === "rejected" && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-black text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">
                                <XCircle size={10} /> ❌ Refusé par l&apos;admin
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right part: Upvote & Admin Actions */}
                        <div className="flex items-center gap-3.5 self-end sm:self-auto flex-shrink-0">
                          
                          {/* Admin decisions display */}
                          {isAdminMode && sug.status === "pending" && (
                            <div className="flex gap-1.5 mr-1">
                              <button
                                onClick={() => handleAdminAction(sug.id, "approved")}
                                className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[9px] font-black transition-colors flex items-center gap-1 shadow-sm active:scale-95"
                              >
                                <CheckCircle size={10} /> Valider
                              </button>
                              <button
                                onClick={() => handleAdminAction(sug.id, "rejected")}
                                className="px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[9px] font-black transition-colors flex items-center gap-1 shadow-sm active:scale-95"
                              >
                                <XCircle size={10} /> Refuser
                              </button>
                            </div>
                          )}

                          {/* Admin Reset to pending (for testing convenience!) */}
                          {isAdminMode && sug.status !== "pending" && (
                            <button
                              onClick={() => handleAdminAction(sug.id, "pending")}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-[9px] font-bold transition-colors mr-1 active:scale-95"
                            >
                              Reset status
                            </button>
                          )}

                          {/* Vote action block (visible to everyone, but only interactable/upvotable on approved suggestions) */}
                          <button
                            onClick={() => handleVote(sug.id)}
                            className={cn(
                              "flex flex-col items-center justify-center py-2 px-3.5 rounded-2xl border transition-all active:scale-90 group",
                              sug.hasVoted 
                                ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm" 
                                : "bg-white hover:bg-rose-50/50 border-gray-100 text-gray-400 hover:text-rose-500 hover:border-rose-100"
                            )}
                          >
                            <Heart 
                              size={18} 
                              className={cn(
                                "transition-all duration-300", 
                                sug.hasVoted ? "fill-rose-600 text-rose-600 scale-110" : "group-hover:scale-110 group-hover:text-rose-400"
                              )} 
                            />
                            <span className="text-[11px] font-black mt-1 leading-none">{sug.votes}</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
