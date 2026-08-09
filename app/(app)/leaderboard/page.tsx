"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Crown, 
  Flame, 
  Search, 
  Zap,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock players data for different tabs
interface LeaderboardPlayer {
  rank: number;
  name: string;
  avatarUrl: string;
  title: string;
  points: number;
  isCurrentUser?: boolean;
  streak: number;
  badgeEmoji: string;
  level: number;
}

const mockRankings: Record<"weekly" | "monthly" | "allTime", LeaderboardPlayer[]> = {
  weekly: [
    {
      rank: 1,
      name: "Maxime_D",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png", // Charizard
      title: "Oracle Absolu",
      points: 840,
      streak: 9,
      badgeEmoji: "🏆",
      level: 18
    },
    {
      rank: 2,
      name: "Chloé_Pikafan",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png", // Eevee
      title: "Mentaliste Expert",
      points: 790,
      streak: 6,
      badgeEmoji: "⚡️",
      level: 17
    },
    {
      rank: 3,
      name: "Rayan_94",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png", // Gengar
      title: "Chasseur d'Intuitions",
      points: 750,
      streak: 5,
      badgeEmoji: "🔮",
      level: 16
    },
    {
      rank: 4,
      name: "Thomas_C",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png", // Blastoise
      title: "Devin Kanto",
      points: 710,
      streak: 4,
      badgeEmoji: "🐢",
      level: 15
    },
    {
      rank: 5,
      name: "Léa_Star",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png", // Jigglypuff
      title: "Intuition Pop",
      points: 680,
      streak: 4,
      badgeEmoji: "🎤",
      level: 15
    },
    {
      rank: 6,
      name: "Mon Pseudo",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", // Pikachu (User)
      title: "Oracle Légendaire",
      points: 640,
      streak: 3,
      isCurrentUser: true,
      badgeEmoji: "🔮",
      level: 14
    },
    {
      rank: 7,
      name: "Antoine_G",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png", // Snorlax
      title: "Calculateur Calme",
      points: 620,
      streak: 3,
      badgeEmoji: "💤",
      level: 13
    },
    {
      rank: 8,
      name: "Sarah_M",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png", // Charmander
      title: "Flamboyante Intuition",
      points: 590,
      streak: 2,
      badgeEmoji: "🔥",
      level: 12
    },
    {
      rank: 9,
      name: "Hugo_B",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
      title: "Explorateur de Tendances",
      points: 550,
      streak: 2,
      badgeEmoji: "🌿",
      level: 11
    },
    {
      rank: 10,
      name: "Manon_L",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
      title: "Intuition Marine",
      points: 510,
      streak: 1,
      badgeEmoji: "💧",
      level: 10
    }
  ],
  monthly: [
    {
      rank: 1,
      name: "Chloé_Pikafan",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
      title: "Mentaliste Expert",
      points: 3450,
      streak: 11,
      badgeEmoji: "⚡️",
      level: 17
    },
    {
      rank: 2,
      name: "Maxime_D",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
      title: "Oracle Absolu",
      points: 3210,
      streak: 9,
      badgeEmoji: "🏆",
      level: 18
    },
    {
      rank: 3,
      name: "Julien_Retro",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/137.png", // Porygon
      title: "Devin Consoles",
      points: 2980,
      streak: 8,
      badgeEmoji: "👾",
      level: 15
    },
    {
      rank: 4,
      name: "Rayan_94",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
      title: "Chasseur d'Intuitions",
      points: 2840,
      streak: 7,
      badgeEmoji: "🔮",
      level: 16
    },
    {
      rank: 5,
      name: "Emma_V",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
      title: "Mentaliste Verte",
      points: 2710,
      streak: 5,
      badgeEmoji: "🍃",
      level: 14
    },
    {
      rank: 6,
      name: "Thomas_C",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
      title: "Devin Kanto",
      points: 2550,
      streak: 4,
      badgeEmoji: "🐢",
      level: 15
    },
    {
      rank: 7,
      name: "Léa_Star",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png",
      title: "Intuition Pop",
      points: 2420,
      streak: 4,
      badgeEmoji: "🎤",
      level: 15
    },
    {
      rank: 8,
      name: "Sarah_M",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
      title: "Flamboyante Intuition",
      points: 2350,
      streak: 5,
      badgeEmoji: "🔥",
      level: 12
    },
    {
      rank: 9,
      name: "Antoine_G",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png",
      title: "Calculateur Calme",
      points: 2150,
      streak: 3,
      badgeEmoji: "💤",
      level: 13
    },
    {
      rank: 10,
      name: "Hugo_B",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
      title: "Explorateur de Tendances",
      points: 1980,
      streak: 2,
      badgeEmoji: "🌿",
      level: 11
    },
    {
      rank: 22,
      name: "Mon Pseudo",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
      title: "Oracle Légendaire",
      points: 1840,
      streak: 3,
      isCurrentUser: true,
      badgeEmoji: "🔮",
      level: 14
    }
  ],
  allTime: [
    {
      rank: 1,
      name: "Jean_Oracle",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png", // Mewtwo
      title: "Le Dieu Devin",
      points: 14200,
      streak: 18,
      badgeEmoji: "👑",
      level: 25
    },
    {
      rank: 2,
      name: "Chloé_Pikafan",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
      title: "Mentaliste Expert",
      points: 12900,
      streak: 12,
      badgeEmoji: "⚡️",
      level: 17
    },
    {
      rank: 3,
      name: "Maxime_D",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
      title: "Oracle Absolu",
      points: 11450,
      streak: 10,
      badgeEmoji: "🏆",
      level: 18
    },
    {
      rank: 4,
      name: "Rayan_94",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
      title: "Chasseur d'Intuitions",
      points: 9800,
      streak: 7,
      badgeEmoji: "🔮",
      level: 16
    },
    {
      rank: 5,
      name: "Julien_Retro",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/137.png",
      title: "Devin Consoles",
      points: 9100,
      streak: 8,
      badgeEmoji: "👾",
      level: 15
    },
    {
      rank: 6,
      name: "Emma_V",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
      title: "Mentaliste Verte",
      points: 8500,
      streak: 5,
      badgeEmoji: "🍃",
      level: 14
    },
    {
      rank: 7,
      name: "Thomas_C",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
      title: "Devin Kanto",
      points: 7800,
      streak: 4,
      badgeEmoji: "🐢",
      level: 15
    },
    {
      rank: 8,
      name: "Léa_Star",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png",
      title: "Intuition Pop",
      points: 7200,
      streak: 4,
      badgeEmoji: "🎤",
      level: 15
    },
    {
      rank: 9,
      name: "Antoine_G",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png",
      title: "Calculateur Calme",
      points: 6900,
      streak: 3,
      badgeEmoji: "💤",
      level: 13
    },
    {
      rank: 10,
      name: "Sarah_M",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
      title: "Flamboyante Intuition",
      points: 5900,
      streak: 2,
      badgeEmoji: "🔥",
      level: 12
    },
    {
      rank: 22,
      name: "Mon Pseudo",
      avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
      title: "Oracle Légendaire",
      points: 1840,
      streak: 7,
      isCurrentUser: true,
      badgeEmoji: "🔮",
      level: 14
    }
  ]
};

import { useEffect } from "react";
import { fetchLeaderboard, UserProfile } from "@/lib/supabase/data";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LeaderboardPage() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "allTime">("weekly");
  const [searchQuery, setSearchQuery] = useState("");
  const [dbRankings, setDbRankings] = useState<LeaderboardPlayer[]>([]);

  const currentUsername = profile?.username || (user?.email ? user.email.split('@')[0] : "Mon Pseudo");

  useEffect(() => {
    async function loadLeaderboard() {
      const profiles = await fetchLeaderboard();
      if (profiles && profiles.length > 0) {
        const mapped: LeaderboardPlayer[] = profiles.map((p, idx) => ({
          rank: idx + 1,
          name: p.username || 'Joueur JustVote',
          avatarUrl: p.avatar_url?.startsWith('http') 
            ? p.avatar_url 
            : "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
          title: p.equipped_title || "Joueur Passionné",
          points: p.points || 0,
          streak: p.current_streak || 0,
          badgeEmoji: p.avatar_url || "⚡️",
          level: p.level || 1,
          isCurrentUser: p.id === user?.id,
        }));
        setDbRankings(mapped);
      }
    }
    loadLeaderboard();
  }, [user?.id]);

  const rawRankings = dbRankings.length > 0 ? dbRankings : mockRankings[activeTab];
  const currentRankings = rawRankings.map((p) => {
    if (p.isCurrentUser) {
      return { ...p, name: currentUsername };
    }
    return p;
  });

  const sortedRankings = [...currentRankings].sort((a, b) => a.rank - b.rank);
  
  // Podium players
  const top1 = sortedRankings.find(p => p.rank === 1);
  const top2 = sortedRankings.find(p => p.rank === 2);
  const top3 = sortedRankings.find(p => p.rank === 3);
  
  // Players in rankings (top 10)
  const otherPlayers = sortedRankings.filter(p => p.rank <= 10);

  // Filter based on search query
  const filteredPlayers = otherPlayers.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Current user's info for the selected period
  const currentUser = sortedRankings.find(p => p.isCurrentUser);

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Classement National</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Compare tes prédictions avec le reste de la <span className="whitespace-nowrap">France !</span>
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-surface px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm w-full md:w-64">
          <Search className="text-gray-400 mr-2" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher un joueur..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-xs placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex bg-white/40 border border-gray-100/50 p-1.5 rounded-2xl w-full sm:w-fit gap-2">
        <button
          onClick={() => setActiveTab("weekly")}
          className={cn(
            "flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-black transition-all",
            activeTab === "weekly" 
              ? "bg-primary text-white shadow-soft" 
              : "text-gray-500 hover:text-primary hover:bg-white/50"
          )}
        >
          Cette semaine
        </button>
        <button
          onClick={() => setActiveTab("monthly")}
          className={cn(
            "flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-black transition-all",
            activeTab === "monthly" 
              ? "bg-primary text-white shadow-soft" 
              : "text-gray-500 hover:text-primary hover:bg-white/50"
          )}
        >
          Ce mois-ci
        </button>
        <button
          onClick={() => setActiveTab("allTime")}
          className={cn(
            "flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-black transition-all",
            activeTab === "allTime" 
              ? "bg-primary text-white shadow-soft" 
              : "text-gray-500 hover:text-primary hover:bg-white/50"
          )}
        >
          Général
        </button>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Podium & List (Span 2) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Podium Component */}
          <div className="bg-surface p-6 rounded-[32px] border border-gray-100 shadow-soft">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-1.5">
              <Crown size={16} className="text-yellow-500 fill-current" /> Le Top 3 de la période
            </h3>

            {/* Podium layout */}
            <div className="flex items-end justify-center gap-3 sm:gap-10 md:gap-16 pt-4 pb-2">
              
              {/* Second Place (Left) */}
              {top2 && (
                <div className="flex flex-col items-center w-28 sm:w-36 text-center">
                  <div className="relative group">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-gray-200 bg-gray-50 p-1 flex items-center justify-center shadow-md overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={top2.avatarUrl} alt={top2.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-gray-200 text-gray-700 border-2 border-white flex items-center justify-center text-[10px] font-black shadow-sm">
                      2
                    </span>
                  </div>
                  <div className="mt-3 w-full">
                    <h4 className="text-xs font-black text-gray-800 flex items-center justify-center gap-1 flex-wrap">
                      <span>{top2.name}</span>
                      <span className="text-[8px] font-black bg-gray-155 text-gray-600 px-1 py-0.5 rounded flex-shrink-0">Niv. {top2.level}</span>
                    </h4>
                    <p className="text-[9px] text-gray-400 font-bold">{top2.title}</p>
                    <span className="inline-block mt-1 bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {top2.points} PI
                    </span>
                  </div>
                </div>
              )}

              {/* First Place (Middle - Taller) */}
              {top1 && (
                <div className="flex flex-col items-center w-32 sm:w-40 text-center -mt-6">
                  <div className="relative group">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
                      <Crown size={28} className="text-yellow-500 fill-current" />
                    </div>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-yellow-400 bg-yellow-50 p-1 flex items-center justify-center shadow-lg overflow-hidden ring-4 ring-yellow-400/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={top1.avatarUrl} alt={top1.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-yellow-400 text-yellow-950 border-2 border-white flex items-center justify-center text-xs font-black shadow-md">
                      1
                    </span>
                  </div>
                  <div className="mt-3 w-full">
                    <h4 className="text-sm font-black text-gray-800 flex items-center justify-center gap-1.5 flex-wrap">
                      <span>{top1.name}</span>
                      <span>{top1.badgeEmoji}</span>
                      <span className="text-[9px] font-black bg-yellow-400/20 text-yellow-800 px-1.5 py-0.5 rounded flex-shrink-0">Niv. {top1.level}</span>
                    </h4>
                    <p className="text-[10px] text-yellow-600 font-black">{top1.title}</p>
                    <span className="inline-block mt-1.5 bg-yellow-400 text-yellow-950 text-xs font-black px-3 py-1 rounded-full shadow-sm">
                      {top1.points} PI
                    </span>
                  </div>
                </div>
              )}

              {/* Third Place (Right) */}
              {top3 && (
                <div className="flex flex-col items-center w-28 sm:w-36 text-center">
                  <div className="relative group">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-amber-600 bg-amber-50 p-1 flex items-center justify-center shadow-md overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={top3.avatarUrl} alt={top3.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-amber-600 text-white border-2 border-white flex items-center justify-center text-[10px] font-black shadow-sm">
                      3
                    </span>
                  </div>
                  <div className="mt-3 w-full">
                    <h4 className="text-xs font-black text-gray-800 flex items-center justify-center gap-1 flex-wrap">
                      <span>{top3.name}</span>
                      <span className="text-[8px] font-black bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded flex-shrink-0">Niv. {top3.level}</span>
                    </h4>
                    <p className="text-[9px] text-gray-400 font-bold">{top3.title}</p>
                    <span className="inline-block mt-1 bg-amber-50 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {top3.points} PI
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* User Rank Card (Only if user is outside the top 10) */}
          {currentUser && currentUser.rank > 10 && (
            <div className="bg-surface p-5 rounded-[32px] border border-primary/20 shadow-soft flex items-center justify-between gap-4 transition-all duration-300 ring-2 ring-primary/5">
              <div className="flex items-center gap-3 min-w-0">
                {/* Rank */}
                <span className="w-8 text-center text-sm font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">
                  #{currentUser.rank}
                </span>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gray-50 p-1 flex items-center justify-center flex-shrink-0 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-contain" />
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-gray-800 truncate flex items-center gap-1.5">
                    {currentUser.name}
                    <span className="text-[9px] font-black bg-primary/10 text-primary-dark px-1.5 py-0.5 rounded flex-shrink-0">
                      Niv. {currentUser.level}
                    </span>
                    <span className="bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase flex-shrink-0">
                      Toi (Mon Classement)
                    </span>
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold">{currentUser.title}</p>
                </div>
              </div>

              {/* Points & Streak info */}
              <div className="flex items-center gap-4 flex-shrink-0">
                {currentUser.streak >= 3 && (
                  <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <Flame size={10} className="fill-current" /> {currentUser.streak}
                  </span>
                )}
                <span className="text-xs font-black text-gray-800">{currentUser.points} PI</span>
              </div>
            </div>
          )}

          {/* Rankings List ranks 1-10 */}
          <div className="bg-surface p-6 rounded-[32px] border border-gray-100 shadow-soft space-y-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-2">Le Top 10</h3>
            
            <div className="space-y-2">
              {filteredPlayers.map((player) => (
                <div
                  key={player.rank}
                  className={cn(
                    "p-3 rounded-2xl border flex items-center justify-between gap-4 transition-all duration-300",
                    player.isCurrentUser 
                      ? "bg-primary/5 border-primary/20 shadow-sm" 
                      : "bg-surface border-gray-50 hover:bg-gray-50/50"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank */}
                    <span className={cn(
                      "w-6 text-center text-xs font-black",
                      player.isCurrentUser ? "text-primary" : "text-gray-400"
                    )}>
                      #{player.rank}
                    </span>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-gray-50 p-1 flex items-center justify-center flex-shrink-0 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={player.avatarUrl} alt={player.name} className="w-full h-full object-contain" />
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-gray-800 truncate flex items-center gap-1.5">
                        {player.name}
                        <span className="text-[9px] font-black bg-primary/10 text-primary-dark px-1.5 py-0.5 rounded flex-shrink-0">
                          Niv. {player.level}
                        </span>
                        {player.isCurrentUser && (
                          <span className="bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase flex-shrink-0">Toi</span>
                        )}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold">{player.title}</p>
                    </div>
                  </div>

                  {/* Points & Streak info */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {player.streak >= 3 && (
                      <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Flame size={10} className="fill-current" /> {player.streak}
                      </span>
                    )}
                    <span className="text-xs font-black text-gray-800">{player.points} PI</span>
                  </div>
                </div>
              ))}

              {filteredPlayers.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-xs font-bold">
                  Aucun joueur ne correspond à ta recherche.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Personal Rank & Stats (Span 1) */}
        <div className="space-y-6">
          
          {/* Your position card */}
          {currentUser && (
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-[32px] p-6 md:p-8 text-white relative overflow-hidden shadow-float min-h-[220px] group">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              {/* Floating Trophy icon */}
              <div className="absolute right-4 top-8 text-7xl opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-300 pointer-events-none rotate-12">🏆</div>
              
              <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
                <div>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/10 inline-block">
                    Ta Position
                  </span>
                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-5xl font-black tracking-tight">#{currentUser.rank}</span>
                    <span className="text-xs text-primary-200 font-bold">
                      {activeTab === "allTime" ? "(Top 5%)" : activeTab === "monthly" ? "(Top 8%)" : "(Top 10%)"}
                    </span>
                  </div>
                </div>
                
                <p className="text-primary-100 text-xs font-bold leading-relaxed max-w-[200px] mt-4">
                  {currentUser.rank <= 10 
                    ? "Incroyable ! Tu fais partie de l'élite. Garde ton avance." 
                    : "Tu es tout proche du Top 10 ! Complète d'autres quiz pour grimper."}
                </p>
              </div>
            </div>
          )}

          {/* Stats Box */}
          <div className="bg-surface p-6 rounded-[32px] border border-gray-100 shadow-soft space-y-4">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider">Objectif de la saison</h4>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600 flex-shrink-0">
                  <Flame size={18} className="fill-current" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-gray-800">Série continue</h5>
                  <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">
                    Maintiens une série de 5 réponses gagnantes pour obtenir un bonus de +50 PI.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-yellow-50 text-yellow-600 flex-shrink-0">
                  <Zap size={18} className="fill-current" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-gray-800">Niveau 15 en vue</h5>
                  <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">
                    Il te manque 550 PI pour passer au niveau supérieur et débloquer le titre *Dresseur Divin*.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="w-full bg-surface-muted hover:bg-gray-100 text-gray-700 font-extrabold py-3.5 rounded-2xl text-xs transition-all border border-gray-200/50 flex items-center justify-center gap-1.5 active:scale-95 mt-4"
            >
              Jouer maintenant <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Hall of Fame badge highlight */}
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 p-6 rounded-[32px] text-white relative overflow-hidden shadow-float">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="relative z-10 space-y-3">
              <div className="p-2.5 rounded-2xl bg-white/10 w-fit border border-white/10 text-yellow-400">
                <Crown size={20} className="fill-current" />
              </div>
              <h4 className="text-sm font-black">L&apos;Arène Légendaire</h4>
              <p className="text-[10px] text-white/70 leading-relaxed">
                Les 3 premiers joueurs du classement général mensuel reçoivent le badge exclusif d&apos;**Oracle Suprême** à la fin du mois.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
