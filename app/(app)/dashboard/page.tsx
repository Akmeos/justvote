"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { Trophy, Zap, Play, MoreHorizontal, Flame, Award, Clock, Users } from "lucide-react";
import { cn, formatFrenchTypography } from "@/lib/utils";
import { mockQuizzes, mockCategories, Quiz } from "@/lib/mockData";
import { fetchCategories, fetchQuizzes } from "@/lib/supabase/data";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Dashboard() {
  const [categoriesList, setCategoriesList] = useState<any[]>(mockCategories);
  const [quizzesList, setQuizzesList] = useState<Quiz[]>(mockQuizzes);
  const [equippedTitle, setEquippedTitle] = useState("Oracle Légendaire");
  const [equippedEmoji, setEquippedEmoji] = useState("🔮");
  const { user, profile } = useAuth();

  useEffect(() => {
    async function loadData() {
      const dbCategories = await fetchCategories();
      if (dbCategories.length > 0) {
        setCategoriesList(dbCategories);
      } else {
        const savedCategories = localStorage.getItem("custom-categories");
        if (savedCategories) setCategoriesList(JSON.parse(savedCategories));
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

    loadData();

    const savedTitle = localStorage.getItem("user-equipped-title");
    const savedEmoji = localStorage.getItem("user-equipped-emoji");
    if (savedTitle) setEquippedTitle(savedTitle);
    if (savedEmoji) setEquippedEmoji(savedEmoji);
  }, []);

  const username = profile?.username || user?.user_metadata?.full_name || user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : "Joueur");


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Area */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">
            Prêt à retourner des cerveaux, <span className="text-primary">{username}</span> ? 🧠
          </h2>
          <p className="text-gray-500 mt-2 font-medium text-balance">
            La communauté a voté. À toi de deviner <span className="whitespace-nowrap">comment !</span>
          </p>
        </div>
      </div>

      {/* 1. Explore les Catégories */}
      <div className="pt-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-extrabold text-gray-800">Explore les Catégories</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoriesList.map((cat) => (
            <CategoryCard 
              key={cat.id}
              id={cat.id}
              title={cat.title} 
              emoji={cat.emoji} 
              colorClass={cat.colorClass} 
              className="h-[140px] md:h-[180px] min-w-0"
            />
          ))}
          <Link 
            href="/trends"
            className="flex flex-col items-center justify-center h-[140px] md:h-[180px] rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <MoreHorizontal size={32} className="mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">Voir plus</span>
          </Link>
        </div>
      </div>

      {/* 2. Horizontal Level Progress Bar (PI Gauge) */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                Niveau 14 • {equippedTitle} {equippedEmoji}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-gray-800 mt-2">Progression de tes Points d&apos;Intuition</h3>
            <p className="text-gray-400 text-xs font-semibold">Gagne des PI en complétant des quiz et en faisant des prédictions <span className="whitespace-nowrap">justes !</span></p>
          </div>
          <div className="text-left md:text-right shrink-0">
            <span className="text-3xl font-black text-gray-900">2 450 PI</span>
            <span className="text-xs text-gray-400 font-bold block mt-0.5">/ 3 000 PI pour le Niveau 15</span>
          </div>
        </div>
 
        {/* Progress Bar Jauge */}
        <div className="mt-5 space-y-2 relative z-10">
          <div className="w-full bg-gray-50 border border-gray-150 p-1 h-5 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-1000 shadow-sm relative group"
              style={{ width: "81.7%" }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
            </div>
          </div>
          <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-wider px-1">
            <span>Niveau 14</span>
            <span>Niveau 15 (3 000 PI)</span>
          </div>
        </div>
      </div>

      {/* 3. Stats Bento Grid Row (Palmarès) */}
      <div className="pt-2">
        <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2 mb-4">
          <Flame className="text-primary" /> Ton Palmarès d&apos;Intuition
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-soft flex items-center justify-between min-h-[90px]">
            <div className="w-10 h-10 flex items-center justify-center bg-purple-50 text-purple-600 rounded-2xl shrink-0">
              <Trophy size={18} />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center px-1">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider leading-none">Quiz Complétés</span>
              <span className="text-lg font-black text-gray-800 mt-1.5 leading-none">14</span>
            </div>
            <div className="w-10 shrink-0" />
          </div>

          {/* Stat 2 */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-soft flex items-center justify-between min-h-[90px]">
            <div className="w-10 h-10 flex items-center justify-center bg-orange-50 text-orange-600 rounded-2xl shrink-0">
              <Flame size={18} className="fill-current" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center px-1">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider leading-none">Série Maximum</span>
              <div className="flex items-center gap-1 mt-1.5">
                <span className="text-lg font-black text-gray-800 leading-none">7 jours</span>
                <span className="text-lg leading-none">🔥</span>
              </div>
            </div>
            <div className="w-10 shrink-0" />
          </div>

          {/* Stat 3 */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-soft flex items-center justify-between min-h-[90px]">
            <div className="w-10 h-10 flex items-center justify-center bg-yellow-50 text-yellow-600 rounded-2xl shrink-0">
              <Zap size={18} className="fill-current" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center px-1">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider leading-none">Série Actuelle</span>
              <div className="flex items-center gap-1 mt-1.5">
                <span className="text-lg font-black text-gray-800 leading-none">3 jours</span>
                <span className="text-lg leading-none">🔥</span>
              </div>
            </div>
            <div className="w-10 shrink-0" />
          </div>

          {/* Stat 4 */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-soft flex items-center justify-between min-h-[90px]">
            <div className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
              <Award size={18} />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center px-1">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider leading-none">Total Points</span>
              <span className="text-lg font-black text-gray-800 mt-1.5 leading-none">1 840 PI</span>
            </div>
            <div className="w-10 shrink-0" />
          </div>
        </div>
      </div>

      {/* 4. Les Quiz available */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-extrabold text-gray-800">Les Quiz Just Vote</h3>
          <span className="text-xs font-bold text-gray-400">{quizzesList.length} quiz disponibles</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzesList.map((quiz) => {
            const cat = mockCategories.find((c) => c.id === quiz.categoryId);
            const categoryBgMap: Record<string, string> = {
              "pokemon": "bg-gradient-to-br from-orange-500 to-amber-600 border-orange-400/80 shadow-orange-500/20",
              "pop-culture": "bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400/80 shadow-purple-500/20",
              "gaming": "bg-gradient-to-br from-cyan-600 to-blue-700 border-cyan-400/80 shadow-cyan-500/20",
              "films": "bg-gradient-to-br from-rose-600 to-red-700 border-rose-400/80 shadow-rose-500/20",
              "series-tv": "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400/80 shadow-emerald-500/20",
              "societe": "bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400/80 shadow-amber-500/20",
              "gastronomie": "bg-gradient-to-br from-pink-500 to-rose-600 border-pink-400/80 shadow-pink-500/20",
            };
            const activeBgClass = quiz.cardBgClass || categoryBgMap[quiz.categoryId] || "bg-gradient-to-br from-indigo-600 to-purple-700 border-indigo-500/80 shadow-indigo-600/20";
            const isDarkBg = !activeBgClass.includes("bg-white") && !activeBgClass.includes("border-gray");
            
            return (
              <div
                key={quiz.id}
                className={cn(
                  "p-6 rounded-[32px] border shadow-soft flex flex-col justify-between min-h-[220px] transition-all hover:shadow-float hover:-translate-y-1 duration-300 relative overflow-hidden group",
                  activeBgClass
                )}
              >
                {/* Background image preview */}
                {quiz.imageUrl ? (
                  <div className="absolute right-0 bottom-0 w-28 h-28 opacity-25 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={quiz.imageUrl} alt="" className="w-full h-full object-contain object-bottom-right" />
                  </div>
                ) : (
                  <div className={cn(
                    "absolute right-2 bottom-2 text-7xl pointer-events-none group-hover:scale-110 transition-transform duration-500",
                    isDarkBg ? "opacity-20" : "opacity-10"
                  )}>
                    {cat?.emoji || "🍿"}
                  </div>
                )}

                {/* Top Row with Category and Play button */}
                <div className="flex justify-between items-start gap-4 relative z-10">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-md inline-block border shrink-0",
                    isDarkBg 
                      ? "bg-white/20 border-white/10 text-white" 
                      : "bg-gray-100 border-gray-200 text-gray-500"
                  )}>
                    {cat?.title || "Quiz"}
                  </span>
                  
                  <Link
                    href={`/quizzes/${quiz.id}`}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider active:scale-95 hover:scale-105 transition-all shadow-md shrink-0 flex items-center gap-1",
                      isDarkBg 
                        ? "bg-white text-gray-900 hover:bg-gray-50" 
                        : "bg-primary text-white hover:bg-primary-dark"
                    )}
                  >
                    <Play size={10} className="fill-current" />
                    <span>Jouer</span>
                  </Link>
                </div>

                {/* Header */}
                <div className="space-y-1.5 mt-3 relative z-10">
                  <h4 className={cn(
                    "font-extrabold text-lg leading-tight pr-28 text-balance",
                    isDarkBg ? "text-white" : "text-gray-800"
                  )}>
                    {formatFrenchTypography(quiz.title)}
                  </h4>
                  <p className={cn(
                    "text-xs leading-normal line-clamp-3 pr-28 text-balance",
                    isDarkBg ? "text-white/80" : "text-gray-400"
                  )}>
                    {formatFrenchTypography(quiz.tagline)}
                  </p>
                </div>

                {/* Actions & info */}
                <div className="relative z-10 pt-4 mt-4 flex items-center justify-between gap-2">
                  <div className={cn(
                    "flex flex-wrap items-center gap-2 text-[9px] font-bold",
                    isDarkBg ? "text-white/70" : "text-gray-400"
                  )}>
                    <span className="flex items-center gap-0.5"><Clock size={10} /> {quiz.estimatedDuration || "5 min"}</span>
                    <span>•</span>
                    <span>{quiz.difficulty || "Moyen"}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><Users size={10} /> {(quiz.participantsCount || 120).toLocaleString("fr-FR")}</span>
                  </div>
                  
                  {/* Spacer to prevent metadata text wrapping/overlapping the bottom-right image/emoji */}
                  <div className="w-20 shrink-0 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}
