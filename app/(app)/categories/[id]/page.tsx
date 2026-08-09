"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Play, 
  Flame, 
  Users, 
  Clock, 
  Trophy, 
  ArrowUpDown, 
  AlertTriangle, 
  RotateCcw,
  CheckCircle2,
  Heart
} from "lucide-react";
import { mockCategories, mockQuizzes, Quiz } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const getPaleCategoryClass = (id: string) => {
  switch (id) {
    case "pop-culture": return "bg-purple-50 border border-purple-100 text-purple-700";
    case "gaming": return "bg-blue-50 border border-blue-100 text-blue-700";
    case "pokemon": return "bg-amber-50 border border-amber-100 text-amber-800";
    case "films": return "bg-red-50 border border-red-100 text-red-700";
    case "series-tv": return "bg-emerald-50 border border-emerald-100 text-emerald-700";
    case "societe": return "bg-orange-50 border border-orange-100 text-orange-700";
    default: return "bg-gray-50 border border-gray-150 text-gray-700";
  }
};

import { fetchCategories, fetchQuizzes } from "@/lib/supabase/data";

export default function CategoryDetailPage({ params }: { params: { id: string } }) {
  const categoryId = params.id.toLowerCase();
  const [category, setCategory] = useState<any>(() => mockCategories.find((cat) => cat.id === categoryId));
  const [quizzesList, setQuizzesList] = useState<Quiz[]>([]);

  useEffect(() => {
    async function loadCategoryData() {
      const dbCategories = await fetchCategories();
      const foundCat = dbCategories.find((c) => c.id === categoryId);
      if (foundCat) {
        setCategory(foundCat);
      } else {
        const savedCategories = localStorage.getItem("custom-categories");
        if (savedCategories) {
          const categoriesList = JSON.parse(savedCategories);
          const found = categoriesList.find((cat: any) => cat.id === categoryId);
          if (found) setCategory(found);
        }
      }

      const dbQuizzes = await fetchQuizzes();
      if (dbQuizzes.length > 0) {
        setQuizzesList(dbQuizzes);
      } else {
        const deletedIds = JSON.parse(localStorage.getItem("deleted-quiz-ids") || "[]");
        const local = localStorage.getItem("custom-quizzes");
        const parsed = local ? JSON.parse(local) : [];
        const filtered = [...mockQuizzes, ...parsed].filter((q) => !deletedIds.includes(q.id));
        setQuizzesList(filtered);
      }
    }

    loadCategoryData();
  }, [categoryId]);

  const [pageState, setPageState] = useState<"normal" | "loading" | "empty" | "error">("normal");
  const [activeFilter, setActiveFilter] = useState<string>("tous");
  const [activeSort, setActiveSort] = useState<string>("popularite");
  const [favorites, setFavorites] = useState<string[]>(["pokemon-shinies"]);

  const toggleFavorite = (quizId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(quizId) ? prev.filter(id => id !== quizId) : [...prev, quizId]
    );
  };

  const categoryQuizzes = useMemo(() => {
    return quizzesList.map(quiz => ({
      ...quiz,
      isFavorite: favorites.includes(quiz.id)
    })).filter(quiz => quiz.categoryId === categoryId);
  }, [categoryId, favorites, quizzesList]);

  // 5. Apply filters and sorting dynamically
  const filteredAndSortedQuizzes = useMemo(() => {
    if (pageState === "empty") return [];

    let result = [...categoryQuizzes];

    // Filter
    if (activeFilter === "nouveaux") {
      result = result.filter(q => q.isNew);
    } else if (activeFilter === "populaires") {
      result = result.filter(q => q.isPopular || q.isTrending);
    } else if (activeFilter === "rapides") {
      result = result.filter(q => q.questionsCount <= 8);
    } else if (activeFilter === "non_joues") {
      result = result.filter(q => q.status === "not_played" || q.status === "in_progress");
    } else if (activeFilter === "termines") {
      result = result.filter(q => q.status === "completed");
    } else if (activeFilter === "favoris") {
      result = result.filter(q => q.isFavorite);
    }

    // Sort
    if (activeSort === "popularite") {
      result.sort((a, b) => b.participantsCount - a.participantsCount);
    } else if (activeSort === "nouveaute") {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (activeSort === "duree") {
      // Sort by number of questions
      result.sort((a, b) => a.questionsCount - b.questionsCount);
    } else if (activeSort === "difficulte") {
      const difficultyOrder = { Facile: 1, Moyen: 2, Difficile: 3 };
      result.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    }

    return result;
  }, [categoryQuizzes, activeFilter, activeSort, pageState]);

  // 6. Identify the featured quiz ("À jouer maintenant")
  const featuredQuiz = useMemo(() => {
    // Choose the first popular and unplayed quiz as featured
    return categoryQuizzes.find(q => q.status !== "completed") || categoryQuizzes[0];
  }, [categoryQuizzes]);

  // 7. Identify quizzes in progress
  const inProgressQuizzes = useMemo(() => {
    return categoryQuizzes.filter(q => q.status === "in_progress");
  }, [categoryQuizzes]);

  // 8. Popular quizzes (trending or popular)
  const popularQuizzes = useMemo(() => {
    return categoryQuizzes.filter(q => q.isPopular || q.isTrending);
  }, [categoryQuizzes]);

  // Handle case where category is not found in mock data
  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertTriangle size={64} className="text-secondary mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Catégorie introuvable</h2>
        <p className="text-gray-500 max-w-md mb-6">
          Désolé, la catégorie &quot;{params.id}&quot; n&apos;existe pas ou a été déplacée.
        </p>
        <Link 
          href="/dashboard"
          className="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Simulation Banner Controls (For Reviewer Testing) */}
      <div className="bg-surface border border-gray-100 p-4 rounded-3xl shadow-soft flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Outils de test</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["normal", "loading", "empty", "error"] as const).map((state) => (
            <button
              key={state}
              onClick={() => setPageState(state)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold transition-all uppercase border",
                pageState === state 
                  ? "bg-primary border-primary text-white shadow-sm" 
                  : "bg-surface-muted border-gray-200 text-gray-500 hover:bg-gray-100"
              )}
            >
              {state === "normal" && "Normal 🟢"}
              {state === "loading" && "Chargement ⏳"}
              {state === "empty" && "Vide 🫙"}
              {state === "error" && "Erreur 🔴"}
            </button>
          ))}
        </div>
      </div>

      {/* Main UI Body conditional on simulation states */}
      {pageState === "loading" && (
        <div className="space-y-8 animate-pulse">
          {/* Skeleton Header */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="h-10 bg-gray-200 rounded-2xl w-48"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded-[32px] w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-64 bg-gray-200 rounded-[32px]"></div>
            <div className="h-64 bg-gray-200 rounded-[32px]"></div>
          </div>
        </div>
      )}

      {pageState === "error" && (
        <div className="bg-red-50/50 border border-red-100 rounded-[32px] p-8 md:p-12 text-center max-w-xl mx-auto space-y-6">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <AlertTriangle size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-800">Erreur de chargement</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
              Impossible de récupérer la liste des quiz pour la catégorie {category.title}. Veuillez vérifier votre connexion et réessayer.
            </p>
          </div>
          <button 
            onClick={() => setPageState("normal")}
            className="bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-md hover:scale-105 hover:bg-red-700 transition-all flex items-center gap-2 mx-auto text-sm"
          >
            <RotateCcw size={16} /> Réessayer
          </button>
        </div>
      )}

      {pageState !== "loading" && pageState !== "error" && (
        <>
          {/* Category Header */}
          <div className="space-y-4">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors text-sm font-semibold group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Retour à l&apos;accueil
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface p-6 md:p-8 rounded-[32px] shadow-soft border border-gray-100 relative overflow-hidden">
              {/* Corner Accent Glow */}
              <div className={cn("absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-20", category.colorClass)}></div>

              <div className="flex items-start md:items-center gap-5 relative z-10">
                <div className={cn("w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center text-4xl md:text-5xl shadow-soft border", getPaleCategoryClass(category.id))}>
                  {category.emoji}
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">{category.title}</h1>
                  <p className="text-gray-500 text-sm md:text-base max-w-xl leading-relaxed">{category.description}</p>
                </div>
              </div>

              {/* Progress and Stats Box */}
              <div className="w-full md:w-80 bg-surface-muted p-5 rounded-3xl border border-gray-100 flex flex-col justify-between space-y-4 relative z-10">
                <div className="flex justify-between items-center text-sm font-bold text-gray-700">
                  <span className="flex items-center gap-1.5"><Trophy size={16} className="text-yellow-500" /> Progression</span>
                  <span>{category.userProgression}%</span>
                </div>
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-1000"
                    style={{ width: `${category.userProgression}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 font-semibold">
                  <span>{category.totalQuizzes} Quiz dispos</span>
                  <span>Précision moyenne : 82%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: À Jouer Maintenant (Featured Quiz Card) */}
          {featuredQuiz && pageState !== "empty" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Flame className="text-secondary" /> À jouer maintenant
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Hero Featured Quiz Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-dark rounded-[32px] p-6 md:p-8 text-white shadow-float relative overflow-hidden flex flex-col justify-between min-h-[300px] group cursor-pointer">
                  {/* Glowing blobs */}
                  <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                  
                  {/* Category large decorative emoji/image floating */}
                  {featuredQuiz.imageUrl ? (
                    <img 
                      src={featuredQuiz.imageUrl} 
                      alt="" 
                      className="absolute -right-6 -bottom-6 w-56 h-56 object-contain opacity-25 pointer-events-none rotate-12 group-hover:scale-110 group-hover:rotate-[0deg] transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute right-4 top-6 text-9xl opacity-20 pointer-events-none rotate-12 group-hover:scale-110 group-hover:rotate-[0deg] transition-transform duration-500">
                      {category.emoji}
                    </div>
                  )}

                  <div className="relative z-10 max-w-lg space-y-4">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md inline-block">
                      Quiz Recommandé ⭐
                    </span>
                    <h3 className="text-2xl md:text-3xl font-extrabold leading-tight">{featuredQuiz.title}</h3>
                    <p className="text-primary-100 text-sm md:text-base leading-relaxed">{featuredQuiz.tagline}</p>

                    <div className="w-fit">
                      <div className="flex flex-wrap gap-4 text-xs font-bold pt-2">
                        <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1.5 rounded-xl backdrop-blur-sm">
                          <Trophy size={14} /> {featuredQuiz.questionsCount} Questions
                        </span>
                        <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1.5 rounded-xl backdrop-blur-sm">
                          <Clock size={14} /> {featuredQuiz.estimatedDuration}
                        </span>
                        <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1.5 rounded-xl backdrop-blur-sm">
                          <Flame size={14} /> Difficulté : {featuredQuiz.difficulty}
                        </span>
                      </div>
                      
                      {/* Divider line ending at the vertical alignment of the badges */}
                      <div className="w-full border-t border-white/10 mt-6"></div>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-primary-200 flex items-center gap-1.5">
                      <Users size={16} /> {featuredQuiz.participantsCount.toLocaleString()} participants
                    </span>
                    <Link 
                      href={`/quizzes/${featuredQuiz.id}`}
                      className="bg-white text-primary font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <Play fill="currentColor" size={16} />
                      Commencer le quiz
                    </Link>
                  </div>
                </div>

                {/* Sub-featured Card / Category Stat */}
                <div className="bg-gradient-to-br from-secondary to-secondary-dark rounded-[32px] p-6 md:p-8 text-white shadow-float relative overflow-hidden flex flex-col justify-between min-h-[300px] group cursor-pointer">
                  <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10 space-y-4">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md inline-block">
                      Récompense 🏆
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold leading-tight">Badge Spécial à débloquer !</h3>
                    <p className="text-secondary-100 text-sm leading-relaxed">
                      Termine le quiz principal avec plus de 80% de prédictions correctes pour débloquer le badge exclusif <span className="font-bold">&quot;{featuredQuiz.badgeReward}&quot;</span>.
                    </p>
                  </div>

                  <div className="relative z-10 flex flex-col justify-end h-full pt-4">
                    <div className="w-20 h-20 bg-white/15 rounded-3xl border border-white/20 flex items-center justify-center text-4xl shadow-soft rotate-[-6deg] group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 mx-auto">
                      🏅
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Mes quiz en cours */}
          {inProgressQuizzes.length > 0 && pageState !== "empty" && (
            <div className="space-y-4 pt-4">
              <h2 className="text-xl font-bold text-gray-800">Mes quiz en cours</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inProgressQuizzes.map((quiz) => (
                  <div 
                    key={quiz.id} 
                    className="p-5 rounded-3xl bg-surface border border-gray-100 shadow-soft flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-float transition-shadow"
                  >
                    <div className="space-y-2 flex-1 w-full">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-800 text-base line-clamp-1">{quiz.title}</h4>
                        <button 
                          onClick={(e) => toggleFavorite(quiz.id, e)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Heart size={18} fill={quiz.isFavorite ? "currentColor" : "none"} className={cn(quiz.isFavorite && "text-red-500")} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                        <span>Progression : {quiz.userProgress}%</span>
                        <span>{quiz.questionsCount} Questions</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-secondary h-full rounded-full transition-all"
                          style={{ width: `${quiz.userProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    <Link 
                      href={`/quizzes/${quiz.id}`}
                      className="w-full sm:w-auto bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold py-2.5 px-6 rounded-2xl text-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
                    >
                      Continuer
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Quiz Populaires (Horizontal Carousel) */}
          {popularQuizzes.length > 0 && pageState !== "empty" && (
            <div className="space-y-4 pt-4">
              <h2 className="text-xl font-bold text-gray-800">Quiz populaires</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
                {popularQuizzes.map((quiz) => (
                  <Link
                    href={`/quizzes/${quiz.id}`}
                    key={quiz.id}
                    className={cn(
                      "w-72 p-5 rounded-3xl border shadow-soft flex flex-col justify-between gap-4 shrink-0 hover:shadow-float transition-all hover:-translate-y-1 duration-300 relative group cursor-pointer overflow-hidden",
                      quiz.cardBgClass || "bg-surface border-gray-100"
                    )}
                  >
                    <div className="space-y-3 relative z-10">
                      {/* Top Row: Pokemon on Left, Badge on Right */}
                      <div className="flex justify-between items-start">
                        {quiz.imageUrl ? (
                          <div className="bg-white/40 backdrop-blur-sm p-1.5 rounded-2xl border border-white/50 shadow-sm shrink-0">
                            <img 
                              src={quiz.imageUrl} 
                              alt="" 
                              className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center text-2xl shrink-0">
                            {category.emoji}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border border-white/20 shadow-sm",
                            quiz.badgeBgClass || (quiz.isTrending ? "bg-red-50 text-red-500" : "bg-purple-50 text-purple-500")
                          )}>
                            {quiz.isTrending ? "🔥 Tendance" : "🌟 Populaire"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className={cn(
                          "font-extrabold text-lg leading-snug line-clamp-2 transition-colors",
                          quiz.textColorClass || "text-gray-800 group-hover:text-primary"
                        )}>
                          {quiz.title}
                        </h3>
                        <p className={cn(
                          "text-xs line-clamp-2 leading-relaxed",
                          quiz.textMutedClass || "text-gray-500"
                        )}>
                          {quiz.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-gray-100/50 relative z-10 mt-auto">
                      <div className={cn(
                        "flex justify-between text-[11px] font-bold",
                        quiz.textMutedClass || "text-gray-500"
                      )}>
                        <span className="flex items-center gap-1"><Clock size={12} /> {quiz.estimatedDuration}</span>
                        <span className="flex items-center gap-1"><Users size={12} /> {quiz.participantsCount.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex gap-2 items-center justify-between">
                        {quiz.status === "completed" ? (
                          <div className={cn(
                            "flex justify-between items-center px-3 py-2 rounded-xl text-xs font-bold w-full backdrop-blur-sm shadow-sm border",
                            quiz.textColorClass 
                              ? "bg-white/20 border-white/20 text-white" 
                              : "bg-green-100/80 border-green-200 text-green-800"
                          )}>
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} /> Complété</span>
                            <span>Score : {quiz.userScore} PI</span>
                          </div>
                        ) : (
                          <div className={cn(
                            "w-full font-bold py-2.5 rounded-2xl text-xs transition-all flex items-center justify-center gap-1 shadow-sm backdrop-blur-sm border border-white/10",
                            quiz.themeColorClass || "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white"
                          )}>
                            Rejoindre la partie
                          </div>
                        )}
                        
                        <button 
                          onClick={(e) => toggleFavorite(quiz.id, e)}
                          className={cn(
                            "border p-2.5 rounded-2xl transition-all shadow-sm shrink-0",
                            quiz.textColorClass 
                              ? "bg-white/25 hover:bg-white/40 text-white border-white/20" 
                              : "bg-white/80 hover:bg-white text-gray-300 hover:text-red-500 border-gray-100/50"
                          )}
                        >
                          <Heart size={16} fill={quiz.isFavorite ? "currentColor" : "none"} className={cn(quiz.isFavorite && (quiz.textColorClass ? "text-white" : "text-red-500"))} />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Section: Tous les Quiz (Filters + Sorting + Results) */}
          <div className="space-y-6 pt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-800">Tous les quiz</h2>
              
              {/* Filters and Sorting buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Sort selector */}
                <div className="flex items-center gap-2 bg-surface border border-gray-100 px-4 py-2.5 rounded-2xl shadow-sm text-xs font-bold text-gray-600">
                  <ArrowUpDown size={14} className="text-gray-400" />
                  <select 
                    value={activeSort} 
                    onChange={(e) => setActiveSort(e.target.value)}
                    className="bg-transparent outline-none cursor-pointer text-gray-600"
                  >
                    <option value="popularite">Popularité</option>
                    <option value="nouveaute">Nouveauté</option>
                    <option value="duree">Durée</option>
                    <option value="difficulte">Difficulté</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filter chips list */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {[
                { id: "tous", label: "Tous" },
                { id: "nouveaux", label: "Nouveaux" },
                { id: "populaires", label: "Populaires" },
                { id: "rapides", label: "Rapides" },
                { id: "non_joues", label: "Non joués" },
                { id: "termines", label: "Terminés" },
                { id: "favoris", label: "Favoris ❤️" },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setActiveFilter(chip.id)}
                  className={cn(
                    "px-4 py-2 rounded-2xl text-xs font-bold tracking-wide transition-all border whitespace-nowrap",
                    activeFilter === chip.id
                      ? "bg-primary border-primary text-white shadow-sm"
                      : "bg-surface border-gray-100 text-gray-500 hover:bg-gray-50 shadow-sm"
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Quizzes List / Grid */}
            {filteredAndSortedQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedQuizzes.map((quiz) => (
                  <Link
                    href={`/quizzes/${quiz.id}`}
                    key={quiz.id}
                    className={cn(
                      "p-5 rounded-3xl border shadow-soft flex flex-col justify-between min-h-[180px] hover:shadow-float transition-all hover:-translate-y-0.5 duration-300 relative group cursor-pointer overflow-hidden",
                      quiz.cardBgClass || "bg-surface border-gray-100"
                    )}
                  >
                    <div className="space-y-2 relative z-10">
                      {/* Top Row: Pokemon on Left, Badges on Right */}
                      <div className="flex justify-between items-start">
                        {quiz.imageUrl ? (
                          <div className="bg-white/40 backdrop-blur-sm p-1 rounded-xl border border-white/50 shadow-sm shrink-0">
                            <img 
                              src={quiz.imageUrl} 
                              alt="" 
                              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center text-xl shrink-0">
                            {category.emoji}
                          </div>
                        )}

                        <div className="flex items-center gap-1.5">
                          {quiz.isNew && (
                            <span className={cn(
                              "px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm border",
                              quiz.textColorClass 
                                ? "bg-white/20 border-white/10 text-white" 
                                : "bg-emerald-100/80 border-emerald-200 text-emerald-800"
                            )}>
                              Nouveau
                            </span>
                          )}
                          {quiz.isTrending && (
                            <span className={cn(
                              "px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm border",
                              quiz.textColorClass 
                                ? "bg-white/20 border-white/10 text-white" 
                                : "bg-red-100/80 border-red-200 text-red-800"
                            )}>
                              Tendance
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <h3 className={cn(
                          "font-extrabold text-base group-hover:text-primary transition-colors line-clamp-1",
                          quiz.textColorClass || "text-gray-800"
                        )}>
                          {quiz.title}
                        </h3>
                        <p className={cn(
                          "text-xs line-clamp-2 leading-relaxed",
                          quiz.textMutedClass || "text-gray-500"
                        )}>
                          {quiz.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-gray-100/50 mt-4 relative z-10">
                      <div className={cn(
                        "flex justify-between text-[11px] font-bold",
                        quiz.textMutedClass || "text-gray-500"
                      )}>
                        <span className="flex items-center gap-1"><Clock size={12} /> {quiz.estimatedDuration}</span>
                        <span className="flex items-center gap-1"><Trophy size={12} /> {quiz.difficulty}</span>
                        <span className="flex items-center gap-1"><Users size={12} /> {quiz.participantsCount.toLocaleString()}</span>
                      </div>

                      <div className="flex gap-2 items-center justify-between">
                        {quiz.status === "completed" ? (
                          <div className={cn(
                            "flex justify-between items-center px-3 py-1.5 rounded-xl text-[11px] font-bold w-full backdrop-blur-sm shadow-sm border",
                            quiz.textColorClass 
                              ? "bg-white/20 border-white/20 text-white" 
                              : "bg-green-100/80 border-green-200 text-green-800"
                          )}>
                            <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Complété</span>
                            <span>{quiz.userScore} PI</span>
                          </div>
                        ) : (
                          <div className={cn(
                            "w-full font-bold py-2 rounded-2xl text-xs transition-all flex items-center justify-center gap-1 shadow-sm backdrop-blur-sm border border-white/10",
                            quiz.themeColorClass ? `${quiz.themeColorClass} group-hover:bg-primary group-hover:text-white` : "bg-surface-muted text-gray-700 group-hover:bg-primary group-hover:text-white"
                          )}>
                            Jouer <Play size={10} fill="currentColor" />
                          </div>
                        )}

                        <button 
                          onClick={(e) => toggleFavorite(quiz.id, e)}
                          className={cn(
                            "border p-2 rounded-2xl transition-all shadow-sm shrink-0",
                            quiz.textColorClass 
                              ? "bg-white/25 hover:bg-white/40 text-white border-white/20" 
                              : "bg-white/80 hover:bg-white text-gray-300 hover:text-red-500 border-gray-100/50"
                          )}
                        >
                          <Heart size={14} fill={quiz.isFavorite ? "currentColor" : "none"} className={cn(quiz.isFavorite && (quiz.textColorClass ? "text-white" : "text-red-500"))} />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* Empty state (filtered list yields nothing) */
              <div className="bg-surface border border-gray-100 rounded-[32px] p-8 md:p-12 text-center max-w-xl mx-auto space-y-5 shadow-soft">
                <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mx-auto text-3xl">
                  🫙
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-800">Aucun quiz trouvé</h3>
                  <p className="text-gray-500 text-xs max-w-sm mx-auto leading-relaxed">
                    Nous n&apos;avons trouvé aucun quiz correspondant à vos filtres actuels. Modifiez ou réinitialisez les critères.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setActiveFilter("tous");
                    setPageState("normal");
                  }}
                  className="bg-primary/10 text-primary font-bold py-2.5 px-6 rounded-2xl text-xs hover:bg-primary hover:text-white transition-all flex items-center gap-1.5 mx-auto"
                >
                  <RotateCcw size={14} /> Réinitialiser
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
