"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ChevronLeft, 
  Play, 
  Clock, 
  Users, 
  Trophy, 
  Award,
  Sparkles,
  Flame,
  HelpCircle,
  AlertTriangle,
  RefreshCw,
  Heart,
  Share2
} from "lucide-react";
import { mockQuizzes, mockCategories, Quiz, Category } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function QuizDetailPage() {
  const params = useParams();
  const quizId = params.id as string;

  // Simulator States
  const [pageState, setPageState] = useState<"normal" | "loading" | "error">("normal");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  // Find current quiz and category (including custom quizzes from localStorage)
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const deletedIds = JSON.parse(localStorage.getItem("deleted-quiz-ids") || "[]");
    const local = localStorage.getItem("custom-quizzes");
    const parsed = local ? JSON.parse(local) : [];
    const merged = [...mockQuizzes, ...parsed].filter((q) => !deletedIds.includes(q.id));
    const foundQuiz = merged.find((q) => q.id === quizId);
    setQuiz(foundQuiz || null);
    
    if (foundQuiz) {
      const savedCategories = localStorage.getItem("custom-categories");
      const categoriesList = savedCategories ? JSON.parse(savedCategories) : mockCategories;
      const foundCategory = categoriesList.find((c: any) => c.id === foundQuiz.categoryId);
      setCategory(foundCategory || null);
    }
  }, [quizId]);

  // Initialize favorite state
  useEffect(() => {
    if (quiz) {
      setIsFavorite(!!quiz.isFavorite);
    }
  }, [quiz]);

  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-surface-muted p-4 md:p-8 flex flex-col gap-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-2xl"></div>
          <div className="h-6 w-32 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Left Column Skeleton */}
          <div className="md:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 rounded-[32px]"></div>
            <div className="h-48 bg-gray-200 rounded-[32px]"></div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-6">
            <div className="h-40 bg-gray-200 rounded-[32px]"></div>
            <div className="h-56 bg-gray-200 rounded-[32px]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "error" || !quiz || !category) {
    return (
      <div className="min-h-screen bg-surface-muted p-4 md:p-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
        <div className="bg-surface p-8 md:p-10 rounded-[32px] shadow-soft max-w-md w-full border border-gray-100 flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center shadow-inner">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-gray-800">Quiz introuvable</h2>
            <p className="text-gray-500 text-sm leading-relaxed text-balance">
              Le quiz demandé n&apos;existe pas ou une erreur est survenue lors de la récupération des données.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={() => setPageState("normal")}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> Réessayer
            </button>
            <Link 
              href="/dashboard"
              className="w-full bg-surface-muted hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl text-sm transition-all border border-gray-200/50 flex items-center justify-center gap-2"
            >
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Toggle favorite helper
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Copy share link helper
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted p-4 pb-28 md:p-8 md:pb-8 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Simulation Banner (Dev Mode Only) */}
      <div className="bg-surface border border-gray-100 p-3 rounded-2xl shadow-soft flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
          <span className="font-bold text-gray-600">Simulateur d&apos;états :</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setPageState("normal")}
            className={cn("px-3 py-1.5 rounded-xl font-extrabold border transition-all", 
              (pageState as string) === "normal" ? "bg-primary text-white border-primary" : "bg-surface-muted hover:bg-gray-100 text-gray-600 border-gray-200")}
          >
            Normal
          </button>
          <button 
            onClick={() => setPageState("loading")}
            className={cn("px-3 py-1.5 rounded-xl font-extrabold border transition-all", 
              (pageState as string) === "loading" ? "bg-primary text-white border-primary" : "bg-surface-muted hover:bg-gray-100 text-gray-600 border-gray-200")}
          >
            Chargement
          </button>
          <button 
            onClick={() => setPageState("error")}
            className={cn("px-3 py-1.5 rounded-xl font-extrabold border transition-all", 
              (pageState as string) === "error" ? "bg-primary text-white border-primary" : "bg-surface-muted hover:bg-gray-100 text-gray-600 border-gray-200")}
          >
            Erreur
          </button>
        </div>
      </div>

      {/* Navigation Header */}
      <div className="flex justify-between items-center">
        <Link 
          href={`/categories/${quiz.categoryId}`}
          className="flex items-center gap-2 bg-surface hover:bg-gray-50 border border-gray-100 text-gray-700 px-4 py-2.5 rounded-2xl shadow-sm text-xs font-bold transition-all"
        >
          <ChevronLeft size={16} /> Retour à la catégorie
        </Link>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            className="relative p-2.5 bg-surface hover:bg-gray-50 text-gray-500 hover:text-primary border border-gray-100 rounded-2xl transition-all shadow-sm"
            title="Partager"
          >
            <Share2 size={16} />
            {showShareTooltip && (
              <span className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md font-bold">
                Lien copié !
              </span>
            )}
          </button>
          <button 
            onClick={handleToggleFavorite}
            className={cn(
              "p-2.5 border rounded-2xl transition-all shadow-sm",
              isFavorite 
                ? "bg-red-50 border-red-100 text-red-500" 
                : "bg-surface border-gray-100 text-gray-400 hover:text-red-500"
            )}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Hero & Rules */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Main Hero Card (Matches Quiz Theme Color) */}
          <div className={cn(
            "p-6 md:p-8 rounded-[32px] border relative overflow-hidden shadow-float min-h-[260px] flex flex-col justify-between text-white",
            quiz.cardBgClass || "bg-gradient-to-br from-primary to-primary-dark"
          )}>
            {/* Background elements */}
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
            
            {/* Top row Category badge */}
            <div className="relative z-10 flex justify-between items-start">
              <span className={cn(
                "px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-sm border shadow-sm",
                quiz.badgeBgClass || "bg-white/20 border-white/10"
              )}>
                {category.emoji} {category.title}
              </span>

              {quiz.isTrending && (
                <span className="bg-red-500 border border-red-400 text-white px-2.5 py-1 rounded-xl text-[9px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1 animate-pulse">
                  <Flame size={10} fill="currentColor" /> Tendance
                </span>
              )}
            </div>

            {/* Title & Tagline & Illustration Container */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end mt-6">
              <div className="sm:col-span-2 space-y-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  {quiz.title}
                </h1>
                <p className={cn(
                  "text-xs sm:text-sm font-medium leading-relaxed text-balance",
                  quiz.textMutedClass || "text-white/80"
                )}>
                  {quiz.description}
                </p>
              </div>

              {/* Quiz-specific floating artwork */}
              {quiz.imageUrl && (
                <div className="flex justify-center sm:justify-end">
                  <div className="relative bg-white/15 backdrop-blur-md p-3 rounded-3xl border border-white/20 shadow-md transform hover:scale-105 transition-transform duration-300 overflow-hidden">
                    <img 
                      src={quiz.imageUrl} 
                      alt="" 
                      className={cn(
                        "w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)]",
                        quiz.id === "films-cultes" && "object-cover rounded-2xl"
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* How It Works Card (Gamified Steps) */}
          <div className="bg-surface p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-soft space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-gray-800">Comment se déroule <span className="whitespace-nowrap">la partie ?</span></h2>
              <p className="text-gray-500 text-xs font-medium">Deux étapes rapides pour tester ton instinct et deviner la France.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
              {/* Step 1 */}
              <div className="space-y-3 relative group">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm group-hover:scale-105 transition-transform duration-300">
                  1
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-gray-800 text-sm">Devine la France</h3>
                  <p className="text-gray-500 text-xs leading-relaxed text-balance">
                    Prédis quel sera le choix majoritaire de la communauté. Plus tu es proche du score exact, plus tu gagnes de points !
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-3 relative group">
                <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-black text-sm group-hover:scale-105 transition-transform duration-300">
                  2
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-gray-800 text-sm">Révélation</h3>
                  <p className="text-gray-500 text-xs leading-relaxed text-balance">
                    Découvre les statistiques détaillées de la communauté et ton positionnement dans le classement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats Bento & Actions */}
        <div className="space-y-6">
          
          {/* Bento Stats Block */}
          <div className="bg-surface p-6 rounded-[32px] border border-gray-100 shadow-soft space-y-5">
            <h3 className="font-extrabold text-gray-800 text-sm">Détails du quiz</h3>
            
            <div className="grid grid-cols-2 gap-3.5">
              {/* Question Count */}
              <div className="bg-surface-muted p-3.5 rounded-2xl border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Questions</div>
                  <div className="text-sm font-black text-gray-800">{quiz.questionsCount}</div>
                </div>
              </div>

              {/* Duration */}
              <div className="bg-surface-muted p-3.5 rounded-2xl border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Durée</div>
                  <div className="text-sm font-black text-gray-800">{quiz.estimatedDuration}</div>
                </div>
              </div>

              {/* Difficulty */}
              <div className="bg-surface-muted p-3.5 rounded-2xl border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-yellow-500/10 text-yellow-600 flex items-center justify-center">
                  <Trophy size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Difficulté</div>
                  <div className="text-sm font-black text-gray-800">{quiz.difficulty}</div>
                </div>
              </div>

              {/* Participants */}
              <div className="bg-surface-muted p-3.5 rounded-2xl border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Users size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Joueurs</div>
                  <div className="text-sm font-black text-gray-800">{quiz.participantsCount.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Rewards Card */}
          <div className="bg-surface p-6 rounded-[32px] border border-gray-100 shadow-soft space-y-4">
            <h3 className="font-extrabold text-gray-800 text-sm">Récompenses à la clé</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-sm">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-purple-700/80 uppercase tracking-wide block">Points</span>
                    <span className="text-sm font-black text-purple-900">+{quiz.pointsReward} PI max</span>
                  </div>
                </div>
              </div>

              {quiz.badgeReward && (
                <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-100 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-secondary text-white flex items-center justify-center shadow-sm">
                      <Award size={18} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-orange-700/80 uppercase tracking-wide block">Badge déblocable</span>
                      <span className="text-sm font-black text-orange-900">{quiz.badgeReward}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Leaderboard Mini-Preview */}
          <div className="bg-surface p-6 rounded-[32px] border border-gray-100 shadow-soft space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-gray-800 text-sm">Meilleurs dresseurs</h3>
              <span className="text-[10px] font-black text-primary hover:underline cursor-pointer">Voir tout</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-muted transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-yellow-600 w-4 text-center">🥇</span>
                  <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">T</div>
                  <span className="text-xs font-bold text-gray-700">Thomas</span>
                </div>
                <span className="text-xs font-black text-gray-800">{quiz.pointsReward + 40} PI</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-muted transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-gray-400 w-4 text-center">🥈</span>
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">L</div>
                  <span className="text-xs font-bold text-gray-700">Léa</span>
                </div>
                <span className="text-xs font-black text-gray-800">{quiz.pointsReward + 25} PI</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-muted transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-amber-700 w-4 text-center">🥉</span>
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">A</div>
                  <span className="text-xs font-bold text-gray-700">Antoine</span>
                </div>
                <span className="text-xs font-black text-gray-800">{quiz.pointsReward + 10} PI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Play CTA (Fixed bottom on mobile, centered block on desktop) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 md:relative md:bg-transparent md:border-none md:p-0 md:mt-8 flex justify-center z-40">
        <div className="max-w-5xl w-full flex flex-col md:flex-row gap-4 items-center justify-between md:bg-surface md:p-5 md:rounded-[28px] md:border md:border-gray-100 md:shadow-soft">
          
          <div className="hidden md:flex flex-col gap-0.5">
            <span className="text-xs text-gray-400 font-bold">Prêt à relever le défi ?</span>
            <span className="text-sm font-black text-gray-800">
              {quiz.status === "completed" 
                ? "Tu as déjà complété ce quiz." 
                : quiz.status === "in_progress" 
                ? `Partie commencée (${quiz.userProgress}%).` 
                : "Rejoins les dresseurs français."}
            </span>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {quiz.status === "completed" ? (
              <Link 
                href={`/quizzes/${quiz.id}/play`}
                className="flex-1 md:flex-none bg-primary hover:bg-primary-dark text-white font-extrabold px-8 py-4 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                Rejouer la partie <RefreshCw size={16} />
              </Link>
            ) : quiz.status === "in_progress" ? (
              <Link 
                href={`/quizzes/${quiz.id}/play`}
                className="flex-1 md:flex-none bg-secondary hover:bg-secondary-dark text-white font-extrabold px-8 py-4 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                Continuer le quiz ({quiz.userProgress}%) <Play size={16} fill="currentColor" />
              </Link>
            ) : (
              <Link 
                href={`/quizzes/${quiz.id}/play`}
                className="flex-1 md:flex-none bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark text-white font-extrabold px-12 py-4 rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                Lancer le quiz <Play size={16} fill="currentColor" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
