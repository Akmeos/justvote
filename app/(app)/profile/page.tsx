"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Award, 
  Flame, 
  Trophy, 
  Zap, 
  History, 
  Lock, 
  ArrowRight,
  Share2,
  HelpCircle,
  Camera,
  X,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock user statistics
const userStats = {
  name: "Akmeos",
  title: "Oracle Légendaire",
  emoji: "🔮",
  level: 14,
  currentPi: 2450,
  nextLevelPi: 3000,
  points: 1840,
  quizPlayed: 14,
  accuracy: 78, // % affinity with France
  maxStreak: 7,
  currentStreak: 3
};

// Avatar options list with unlocking levels
interface AvatarOption {
  pokemonId: number;
  name: string;
  requiredLevel: number;
  bgClass: string;
}

const avatarOptions: AvatarOption[] = [
  { pokemonId: 25, name: "Pikachu", requiredLevel: 1, bgClass: "bg-yellow-50/70 border-yellow-100" },
  { pokemonId: 133, name: "Évoli", requiredLevel: 1, bgClass: "bg-amber-50/70 border-amber-100" },
  { pokemonId: 1, name: "Bulbizarre", requiredLevel: 1, bgClass: "bg-emerald-50/70 border-emerald-100" },
  { pokemonId: 4, name: "Salamèche", requiredLevel: 1, bgClass: "bg-orange-50/70 border-orange-100" },
  { pokemonId: 9, name: "Tortank", requiredLevel: 5, bgClass: "bg-blue-50/70 border-blue-100" },
  { pokemonId: 94, name: "Ectoplasma", requiredLevel: 8, bgClass: "bg-purple-50/70 border-purple-100" },
  { pokemonId: 6, name: "Dracaufeu", requiredLevel: 10, bgClass: "bg-red-50/70 border-red-100" },
  { pokemonId: 143, name: "Ronflex", requiredLevel: 12, bgClass: "bg-cyan-50/70 border-cyan-100" },
  { pokemonId: 150, name: "Mewtwo", requiredLevel: 15, bgClass: "bg-indigo-50/70 border-indigo-100" } // Locked (Titouan is 14)
];

// Badges list (matches mockData badges + additional)
interface ProfileBadge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  gradientClass: string;
  category: string;
}

const profileBadges: ProfileBadge[] = [
  {
    id: "expert-pokemon",
    title: "Expert Pokémon",
    description: "Obtenu en terminant 'Le grand débat Pokémon' avec une forte affinité.",
    emoji: "⚡️",
    isUnlocked: true,
    unlockedAt: "12 Juillet 2026",
    gradientClass: "from-amber-400 to-orange-500",
    category: "Pokémon"
  },
  {
    id: "pionnier-kanto",
    title: "Pionnier de Kanto",
    description: "Obtenu en complétant le quiz sur la Génération 1.",
    emoji: "🎒",
    isUnlocked: true,
    unlockedAt: "28 Juillet 2026",
    gradientClass: "from-yellow-400 to-amber-500",
    category: "Pokémon"
  },
  {
    id: "gamer-ultime",
    title: "Gamer Ultime",
    description: "Obtenu en devinant correctement la console préférée des Français.",
    emoji: "🎮",
    isUnlocked: true,
    unlockedAt: "30 Juillet 2026",
    gradientClass: "from-blue-500 to-indigo-600",
    category: "Gaming"
  },
  {
    id: "cinephile-averti",
    title: "Cinéphile Averti",
    description: "Débloque ce badge en complétant un quiz de la catégorie Films.",
    emoji: "🎬",
    isUnlocked: false,
    gradientClass: "from-red-400 to-rose-600",
    category: "Films"
  },
  {
    id: "accro-series",
    title: "Sériephile Elite",
    description: "Débloque ce badge en complétant 3 quiz de la catégorie Séries TV.",
    emoji: "📺",
    isUnlocked: false,
    gradientClass: "from-emerald-400 to-teal-600",
    category: "Séries TV"
  },
  {
    id: "chasseur-etoiles",
    title: "Chasseur d'Étoiles",
    description: "Complète le quiz sur les Pokémon Shiny.",
    emoji: "✨",
    isUnlocked: false,
    gradientClass: "from-cyan-400 to-blue-500",
    category: "Pokémon"
  }
];

// Mock quiz history
const quizHistory = [
  {
    id: "pokemon-power",
    title: "Le grand débat Pokémon",
    categoryEmoji: "⚡️",
    score: 180,
    questionsCount: 10,
    affinity: 80,
    playedAt: "Hier"
  },
  {
    id: "pokemon-gen1",
    title: "Génération 1 : Le Nostalgie Tour",
    categoryEmoji: "⚡️",
    score: 140,
    questionsCount: 8,
    affinity: 75,
    playedAt: "Il y a 3 jours"
  },
  {
    id: "gaming-consoles",
    title: "La guerre des Consoles",
    categoryEmoji: "🎮",
    score: 160,
    questionsCount: 10,
    affinity: 80,
    playedAt: "Il y a 5 jours"
  }
];

import { useAuth } from "@/components/auth/AuthProvider";
import { AuthModal } from "@/components/auth/AuthModal";
import { LogIn, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<ProfileBadge | null>(null);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png");
  const [equippedTitle, setEquippedTitle] = useState("Oracle Légendaire");
  const [equippedEmoji, setEquippedEmoji] = useState("🔮");

  // User stats derived from Supabase Profile or default
  const activeStats = {
    name: profile?.username || (user?.email ? user.email.split('@')[0] : userStats.name),
    title: profile?.equipped_title || equippedTitle,
    emoji: equippedEmoji,
    level: profile?.level || userStats.level,
    currentPi: profile?.points || userStats.currentPi,
    nextLevelPi: (profile?.level || userStats.level) * 200 + 2000,
    points: profile?.points || userStats.points,
    quizPlayed: profile?.quizzes_completed || userStats.quizPlayed,
    accuracy: profile?.affinity_score || userStats.accuracy,
    maxStreak: profile?.max_streak || userStats.maxStreak,
    currentStreak: profile?.current_streak || userStats.currentStreak,
  };

  // Sync avatar url, title, and emoji on mount
  useEffect(() => {
    const saved = localStorage.getItem("user-avatar-url");
    if (saved) {
      setCurrentAvatarUrl(saved);
    }
    const savedTitle = localStorage.getItem("user-equipped-title");
    const savedEmoji = localStorage.getItem("user-equipped-emoji");
    if (savedTitle) setEquippedTitle(savedTitle);
    if (savedEmoji) setEquippedEmoji(savedEmoji);
  }, []);

  const handleShareProfile = () => {
    const text = `Rejoins-moi sur Just Vote ! Je suis niveau ${userStats.level} avec le titre "${equippedTitle}" ${equippedEmoji}. Prêt à tester ton intuition ? ⚡️`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getPokemonImageUrl = (pokemonId: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  };

  const selectAvatar = (option: AvatarOption) => {
    if (userStats.level < option.requiredLevel) return; // Avatar is locked
    
    const newUrl = getPokemonImageUrl(option.pokemonId);
    setCurrentAvatarUrl(newUrl);
    localStorage.setItem("user-avatar-url", newUrl);
    
    // Dispatch custom event to notify layout topbar immediately
    const event = new CustomEvent("avatar-changed", { detail: newUrl });
    window.dispatchEvent(event);
    
    setAvatarModalOpen(false);
  };

  const piPercentage = Math.round((activeStats.currentPi / activeStats.nextLevelPi) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Mon Profil</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Visualise ton palmarès et tes badges d&apos;intuition <span className="whitespace-nowrap">sociale !</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShareProfile}
            className="self-start md:self-auto bg-surface hover:bg-gray-50 text-gray-700 font-extrabold px-5 py-3 rounded-2xl text-xs transition-all border border-gray-200/60 shadow-sm flex items-center gap-2 active:scale-95"
          >
            <Share2 size={14} />
            {copied ? "Lien copié !" : "Partager mon profil"}
          </button>

          {user ? (
            <button
              onClick={async () => {
                await signOut();
                setIsAuthModalOpen(true);
              }}
              className="bg-red-50 text-red-600 hover:bg-red-100 font-extrabold px-4 py-3 rounded-2xl text-xs transition-all border border-red-100 shadow-sm flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <LogOut size={14} />
              <span>Déconnexion</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold px-5 py-3 rounded-2xl text-xs transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
              <LogIn size={14} />
              <span>Se connecter</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Banner/User Card (Span 2) */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 rounded-[32px] p-5 sm:p-7 text-white relative overflow-hidden shadow-float flex flex-col justify-center space-y-4">
          {/* Decorative glows */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Title Badge in top right */}
          <div className="absolute top-2.5 right-4 z-20">
            <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border border-white/10 inline-block whitespace-nowrap">
              {activeStats.title} {activeStats.emoji}
            </span>
          </div>

          <div className="flex items-center gap-5 sm:gap-6 relative z-10 w-full pt-2">
            {/* Interactive Avatar Container */}
            <button 
              onClick={() => setAvatarModalOpen(true)}
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 sm:border-4 border-white/20 bg-yellow-100 p-1 sm:p-2 flex items-center justify-center shadow-lg flex-shrink-0 relative group overflow-hidden cursor-pointer active:scale-95 transition-transform"
              title="Changer de photo de profil"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={currentAvatarUrl} 
                alt="Avatar" 
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              {/* Camera Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                <Camera size={18} className="sm:w-5 sm:h-5" />
                <span className="text-[9px] font-black uppercase tracking-wider">Modifier</span>
              </div>
            </button>

            {/* Profile info */}
            <div className="space-y-1.5 text-left">
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">{userStats.name}</h3>
              <p className="text-primary-200 text-sm sm:text-base font-bold opacity-90">
                Niveau {userStats.level}
              </p>
            </div>
          </div>

          {/* PI Progress Bar at the bottom, within card padding so it doesn't touch borders */}
          <div className="w-full relative z-10 pt-1">
            <div className="flex justify-between text-[9px] sm:text-[10px] font-black text-primary-200 mb-1.5">
              <span>POINTS D&apos;INTUITION</span>
              <span>{userStats.currentPi} / {userStats.nextLevelPi} ({piPercentage}%)</span>
            </div>
            <div className="w-full h-2 bg-black/35 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-1000"
                style={{ width: `${piPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Affinity Score Card (Span 1) */}
        <div className="bg-gradient-to-br from-secondary to-secondary-dark rounded-[32px] p-5 sm:p-7 text-white relative overflow-hidden shadow-float flex flex-col justify-center space-y-3 group max-w-sm mx-auto w-full md:max-w-none md:mx-0">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          {/* Brain Emoji floating right */}
          <div className="absolute right-4 top-8 text-8xl opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-300 pointer-events-none rotate-12">🧠</div>
          
          <div className="relative z-10 space-y-3">
            <div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/10 inline-block">
                Affinité France 🇫🇷
              </span>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-5xl font-black tracking-tight">{userStats.accuracy}%</span>
              </div>
            </div>
            
            <p className="text-secondary-100 text-xs font-bold leading-relaxed max-w-[200px]">
              Tu es extrêmement en phase avec l&apos;opinion publique nationale !
            </p>
          </div>
        </div>

        {/* Stats Bento Grid Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:col-span-3">
          
          {/* Stat 1 */}
          <div className="bg-surface p-3 sm:p-4 rounded-3xl border border-gray-100 shadow-soft flex items-center justify-between min-h-[84px] sm:min-h-[90px]">
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-purple-50 text-purple-600 rounded-2xl shrink-0">
              <Trophy className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center px-1 min-w-0">
              <span className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-wider leading-none whitespace-nowrap">Quiz Complétés</span>
              <span className="text-sm sm:text-lg font-black text-gray-800 mt-1.5 leading-none whitespace-nowrap">{userStats.quizPlayed}</span>
            </div>
            <div className="w-8 sm:w-10 shrink-0" />
          </div>

          {/* Stat 2 */}
          <div className="bg-surface p-3 sm:p-4 rounded-3xl border border-gray-100 shadow-soft flex items-center justify-between min-h-[84px] sm:min-h-[90px]">
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-orange-50 text-orange-600 rounded-2xl shrink-0">
              <Flame className="w-4 h-4 sm:w-[18px] sm:h-[18px] fill-current" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center px-1 min-w-0">
              <span className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-wider leading-none whitespace-nowrap">Série Maximum</span>
              <span className="text-sm sm:text-lg font-black text-gray-800 mt-1.5 leading-none whitespace-nowrap">{userStats.maxStreak} jours 🔥</span>
            </div>
            <div className="w-8 sm:w-10 shrink-0" />
          </div>

          {/* Stat 3 */}
          <div className="bg-surface p-3 sm:p-4 rounded-3xl border border-gray-100 shadow-soft flex items-center justify-between min-h-[84px] sm:min-h-[90px]">
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-yellow-50 text-yellow-600 rounded-2xl shrink-0">
              <Zap className="w-4 h-4 sm:w-[18px] sm:h-[18px] fill-current" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center px-1 min-w-0">
              <span className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-wider leading-none whitespace-nowrap">Série Actuelle</span>
              <span className="text-sm sm:text-lg font-black text-gray-800 mt-1.5 leading-none whitespace-nowrap">{userStats.currentStreak} jours 🔥</span>
            </div>
            <div className="w-8 sm:w-10 shrink-0" />
          </div>

          {/* Stat 4 */}
          <div className="bg-surface p-3 sm:p-4 rounded-3xl border border-gray-100 shadow-soft flex items-center justify-between min-h-[84px] sm:min-h-[90px]">
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
              <Award className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center px-1 min-w-0">
              <span className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-wider leading-none whitespace-nowrap">Total PI</span>
              <span className="text-sm sm:text-lg font-black text-gray-800 mt-1.5 leading-none whitespace-nowrap">{userStats.points} PI</span>
            </div>
            <div className="w-8 sm:w-10 shrink-0" />
          </div>

        </div>

        {/* Unlocked Badges Showcase (Span 2) */}
        <div className="md:col-span-2 bg-surface p-6 rounded-[32px] border border-gray-100 shadow-soft flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Award size={20} className="text-primary" /> Palmarès des Badges ({profileBadges.filter(b => b.isUnlocked).length} / {profileBadges.length})
            </h4>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {profileBadges.map((badge) => (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className="flex flex-col items-center gap-2 group focus:outline-none"
              >
                {/* Badge Icon circle */}
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl relative shadow-sm transition-all duration-300 border",
                  badge.isUnlocked 
                    ? cn("bg-gradient-to-br text-white group-hover:scale-115 group-hover:shadow-md", badge.gradientClass, "border-transparent")
                    : "bg-gray-100 border-dashed border-gray-200 text-gray-300"
                )}>
                  {badge.emoji}
                  {!badge.isUnlocked && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[9px] text-gray-400 border border-white">
                      <Lock size={8} />
                    </div>
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-extrabold text-center leading-tight truncate w-full",
                  badge.isUnlocked ? "text-gray-700" : "text-gray-400"
                )}>
                  {badge.title}
                </span>
              </button>
            ))}
          </div>

          {/* Badge Detail Overlay Panel */}
          {selectedBadge ? (
            <div className={cn(
              "p-4 rounded-2xl animate-in fade-in duration-300 border flex gap-4 items-start relative overflow-hidden",
              selectedBadge.isUnlocked 
                ? "bg-purple-50/50 border-purple-100" 
                : "bg-gray-50 border-gray-100"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 text-white shadow-inner bg-gradient-to-br",
                selectedBadge.isUnlocked ? selectedBadge.gradientClass : "from-gray-300 to-gray-400"
              )}>
                {selectedBadge.emoji}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h5 className="text-sm font-black text-gray-800">{selectedBadge.title}</h5>
                  <span className={cn(
                    "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                    selectedBadge.isUnlocked 
                      ? "bg-purple-100 text-purple-700 border-purple-200" 
                      : "bg-gray-200 text-gray-500 border-gray-300"
                  )}>
                    {selectedBadge.isUnlocked ? "Débloqué" : "Verrouillé"}
                  </span>
                  {selectedBadge.isUnlocked && (
                    <button
                      onClick={() => {
                        if (equippedTitle === selectedBadge.title) {
                          setEquippedTitle("Oracle Légendaire");
                          setEquippedEmoji("🔮");
                          localStorage.setItem("user-equipped-title", "Oracle Légendaire");
                          localStorage.setItem("user-equipped-emoji", "🔮");
                        } else {
                          setEquippedTitle(selectedBadge.title);
                          setEquippedEmoji(selectedBadge.emoji);
                          localStorage.setItem("user-equipped-title", selectedBadge.title);
                          localStorage.setItem("user-equipped-emoji", selectedBadge.emoji);
                        }
                      }}
                      className={cn(
                        "text-[9px] font-black uppercase px-3 py-0.5 rounded-full border transition-all active:scale-95 cursor-pointer",
                        equippedTitle === selectedBadge.title
                          ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                          : "bg-primary text-white border-transparent hover:bg-primary-dark shadow-sm"
                      )}
                    >
                      {equippedTitle === selectedBadge.title ? "Retirer" : "Équiper le titre"}
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed text-balance">
                  {selectedBadge.description}
                </p>
                {selectedBadge.isUnlocked && selectedBadge.unlockedAt && (
                  <p className="text-[10px] text-gray-400 font-medium">
                    Débloqué le {selectedBadge.unlockedAt}
                  </p>
                )}
              </div>
              
              <button 
                onClick={() => setSelectedBadge(null)}
                className="absolute top-2 right-3 text-xs font-black text-gray-400 hover:text-gray-600"
              >
                Fermer
              </button>
            </div>
          ) : (
            <div className="p-4 bg-gray-50/50 border border-gray-100/60 rounded-2xl flex items-center gap-2 justify-center text-xs font-bold text-gray-400">
              <HelpCircle size={14} />
              <span>Clique sur un badge pour voir les détails de déblocage 💡</span>
            </div>
          )}
        </div>

        {/* Recently Played History (Span 1) */}
        <div className="bg-surface p-6 rounded-[32px] border border-gray-100 shadow-soft flex flex-col gap-4">
          <h4 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <History size={20} className="text-primary" /> Activité Récente
          </h4>

          <div className="space-y-3 flex-1">
            {quizHistory.map((item) => (
              <div 
                key={item.id}
                className="p-3 rounded-2xl border border-gray-50 hover:bg-gray-50/50 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-base flex-shrink-0 shadow-inner">
                    {item.categoryEmoji}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-black text-gray-800 truncate group-hover:text-primary transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                      {item.playedAt} · {item.affinity}% affinité
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-black text-gray-800">{item.score} PI</span>
                  <Link 
                    href={`/quizzes/${item.id}/play`}
                    className="text-[9px] font-black uppercase text-primary flex items-center gap-0.5 justify-end mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Rejouer <ArrowRight size={8} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard"
            className="w-full bg-surface-muted hover:bg-gray-100 text-gray-700 font-extrabold py-3 rounded-2xl text-xs transition-all border border-gray-200/50 flex items-center justify-center gap-1.5 active:scale-95"
          >
            Trouver un autre quiz <ArrowRight size={12} />
          </Link>
        </div>

        {/* Administration Section (Span 3) */}
        <div className="md:col-span-3 bg-gradient-to-r from-gray-800 to-slate-900 rounded-[32px] p-6 md:p-8 text-white relative overflow-hidden shadow-float flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-6">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-2 relative z-10">
            <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/10 inline-block">
              Outils Administrateur 🛠️
            </span>
            <h3 className="text-xl md:text-2xl font-black">Créer de nouveaux Quiz</h3>
            <p className="text-gray-300 text-xs font-semibold max-w-xl leading-relaxed">
              Ajoute de nouvelles catégories, des questions interactives, simule des votes communautaires et téléverse des illustrations personnalisées pour dynamiser l&apos;application.
            </p>
          </div>
          <Link
            href="/admin"
            className="bg-primary hover:bg-primary-dark text-white font-black px-6 py-4 rounded-2xl text-xs transition-all tracking-wider uppercase text-center shadow-md active:scale-95 shrink-0 flex items-center gap-2"
          >
            <Settings size={14} className="animate-spin-slow" />
            Accéder à l&apos;Admin
          </Link>
        </div>

      </div>

      {/* Avatar Changer Modal/Overlay */}
      {avatarModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-surface rounded-[32px] border border-gray-100 shadow-float max-w-lg w-full p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300 relative">
            
            {/* Close Button */}
            <button 
              onClick={() => setAvatarModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="space-y-1.5 text-center">
              <h3 className="text-2xl font-black text-gray-800 tracking-tight">Changer d&apos;avatar</h3>
              <p className="text-gray-500 font-semibold text-sm text-balance">
                Débloque de nouveaux compagnons d&apos;opinion en grimpant dans les <span className="whitespace-nowrap">niveaux !</span>
              </p>
            </div>

            {/* Avatars Bento Grid */}
            <div className="grid grid-cols-3 gap-4">
              {avatarOptions.map((option) => {
                const isUnlocked = userStats.level >= option.requiredLevel;
                const isSelected = currentAvatarUrl === getPokemonImageUrl(option.pokemonId);

                return (
                  <button
                    key={option.pokemonId}
                    disabled={!isUnlocked}
                    onClick={() => selectAvatar(option)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 sm:p-4 rounded-[24px] border relative transition-all duration-300 group",
                      
                      // Active/Selected state
                      isSelected && "border-primary bg-primary/5 ring-2 ring-primary/20",
                      
                      // Unlocked & not selected
                      isUnlocked && !isSelected && "bg-white hover:bg-gray-50 hover:border-gray-300 active:scale-95 cursor-pointer",
                      
                      // Locked state
                      !isUnlocked && "bg-gray-50 border-dashed border-gray-200 opacity-60 cursor-not-allowed"
                    )}
                  >
                    {/* Pokémon avatar */}
                    <div className="w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={getPokemonImageUrl(option.pokemonId)} 
                        alt={option.name} 
                        className={cn(
                          "w-full h-full object-contain transition-transform duration-300",
                          isUnlocked && "group-hover:scale-110",
                          !isUnlocked && "grayscale"
                        )}
                      />
                    </div>

                    {/* Badge/Text */}
                    <span className={cn(
                      "text-[10px] sm:text-xs font-black mt-2.5 truncate max-w-full text-center leading-none",
                      isSelected ? "text-primary" : "text-gray-700"
                    )}>
                      {option.name}
                    </span>

                    {/* Lock indicator */}
                    {!isUnlocked && (
                      <div className="absolute top-2 right-2 text-gray-400">
                        <Lock size={10} />
                      </div>
                    )}

                    {/* Level requirement badge (visible if locked) */}
                    {!isUnlocked && (
                      <div className="absolute bottom-1 bg-gray-200 text-gray-600 text-[8px] font-black px-1.5 py-0.5 rounded-full">
                        Niv {option.requiredLevel}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Cancel/Close Footer Button */}
            <button
              onClick={() => setAvatarModalOpen(false)}
              className="w-full bg-surface-muted hover:bg-gray-100 text-gray-700 font-extrabold py-3.5 rounded-2xl text-xs transition-all border border-gray-200/50 flex items-center justify-center active:scale-95"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
