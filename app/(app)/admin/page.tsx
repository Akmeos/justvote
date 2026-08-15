"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  AlertCircle, 
  Eye, 
  ArrowRight, 
  ArrowLeft,
  Settings,
  HelpCircle,
  Users,
  LayoutDashboard,
  Search,
  Calendar,
  AlertTriangle,
  Download,
  MapPin,
  TrendingUp,
  UserPlus,
  Play,
  Award,
  Zap,
  Clock,
  Grid
} from "lucide-react";
import { mockCategories, mockQuizzes, Quiz } from "@/lib/mockData";
import { QuizQuestion, QuizOption } from "@/lib/quizQuestions";
import { cn, formatFrenchTypography } from "@/lib/utils";
import { fetchAdminUsers, UserProfile } from "@/lib/supabase/data";
import { OnboardingCinematicModal } from "@/components/onboarding/OnboardingCinematicModal";

// Pre-defined color themes for quiz cards
const CARD_THEMES = [
  { id: "purple-indigo", name: "Violet Royal", bgClass: "bg-gradient-to-br from-indigo-600 to-purple-700 border-indigo-500/80 shadow-indigo-600/20", textClass: "text-white" },
  { id: "orange-amber", name: "Feu Solaire", bgClass: "bg-gradient-to-br from-orange-500 to-amber-600 border-orange-400/80 shadow-orange-500/20", textClass: "text-white" },
  { id: "red-rose", name: "Cinéma Écarlate", bgClass: "bg-gradient-to-br from-red-600 to-rose-700 border-red-500/80 shadow-red-600/20", textClass: "text-white" },
  { id: "yellow-amber", name: "Jaune Rétro", bgClass: "bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-300/80 shadow-yellow-400/20", textClass: "text-yellow-950" },
  { id: "emerald-teal", name: "Forêt d'Émeraude", bgClass: "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400/80 shadow-emerald-500/20", textClass: "text-white" },
  { id: "cyan-blue", name: "Bleu Néon", bgClass: "bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-400/80 shadow-cyan-500/20", textClass: "text-white" },
  { id: "dark-slate", name: "Noir Carbon", bgClass: "bg-gradient-to-br from-gray-800 to-slate-950 border-gray-700/85 shadow-slate-900/35", textClass: "text-white" },
];

// Pre-defined stock images for ease of creation
const STOCK_IMAGES = [
  { name: "Cinéma / Popcorn", url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80" },
  { name: "Espace / Étoiles", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80" },
  { name: "Gaming / Retro", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80" },
  { name: "Néon / Tech", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80" },
];

// User representation interface
interface AdminUser {
  id: string;
  username: string;
  email: string;
  joinDate: string;
  lastActive: string;
  completedQuizzes: number;
  status: "Actif" | "Suspendu" | "Supprimé";
  region: string;
  startedQuizzes: number;
  completionRate: number;
  timeSpent: string;
  lastQuiz: string;
}

// 5 Real Users from Supabase Database
const INITIAL_USERS: AdminUser[] = [
  { id: "a77d4634-3124-430e-8cca-9d66d59b1be8", username: "Akmeos", email: "titouan.kerneis.pro@gmail.com", joinDate: "2026-08-01", lastActive: "Aujourd'hui", completedQuizzes: 50, status: "Actif", region: "Île-de-France", startedQuizzes: 52, completionRate: 96, timeSpent: "5h 20m", lastQuiz: "Le grand débat Pokémon" },
  { id: "70b74243-c6cb-4913-8913-7c243ae0df47", username: "User_Test_4", email: "user_test_4@justvote.fr", joinDate: "2026-08-02", lastActive: "Aujourd'hui", completedQuizzes: 56, status: "Actif", region: "Auvergne-Rhône-Alpes", startedQuizzes: 58, completionRate: 95, timeSpent: "4h 10m", lastQuiz: "Rétro Gaming vs Next-Gen" },
  { id: "7fd4dc4e-fe2a-4dd4-8b20-7f8db88441f3", username: "User_Test_1", email: "user_test_1@justvote.fr", joinDate: "2026-08-03", lastActive: "Aujourd'hui", completedQuizzes: 42, status: "Actif", region: "Provence-Alpes-Côte d'Azur", startedQuizzes: 45, completionRate: 93, timeSpent: "3h 15m", lastQuiz: "Le grand débat Pokémon" },
  { id: "4296a7bd-480a-4ec5-95dc-b780d22514fc", username: "User_Test_2", email: "user_test_2@justvote.fr", joinDate: "2026-08-04", lastActive: "Hier", completedQuizzes: 28, status: "Actif", region: "Nouvelle-Aquitaine", startedQuizzes: 31, completionRate: 90, timeSpent: "2h 05m", lastQuiz: "L'Âge d'Or des Mèmes" },
  { id: "1621b8b9-709d-4788-81b3-ade777ae29ef", username: "User_Test_3", email: "user_test_3@justvote.fr", joinDate: "2026-08-05", lastActive: "Hier", completedQuizzes: 19, status: "Actif", region: "Occitanie", startedQuizzes: 20, completionRate: 95, timeSpent: "1h 30m", lastQuiz: "Les jeux dérivés Pokémon" },
];

interface DropOffItem {
  question: string;
  title: string;
  answers: number;
  top: string;
  distribution: Record<string, number>;
  time: string;
  dropAfter: string;
}

interface QuizStat {
  id: string;
  title: string;
  status: string;
  date: string;
  starts: number;
  completions: number;
  completionRate: number;
  avgTime: string;
  shares: number;
  dropOff: number[];
  dropOffDetail: DropOffItem[];
}

// Mock Quiz Performance Statistics
const INITIAL_QUIZ_STATS: QuizStat[] = [
  { id: "pokemon-power", title: "Le grand débat Pokémon", status: "Publié", date: "2026-06-28", starts: 1520, completions: 1231, completionRate: 81, avgTime: "1 min 34", shares: 242, dropOff: [100, 95, 91, 78, 75], dropOffDetail: [
    { question: "Question 1", title: "Starter de Kanto préféré", answers: 1520, top: "Dracaufeu (48%)", distribution: { "Dracaufeu": 48, "Tortank": 30, "Florizarre": 22 }, time: "8.5s", dropAfter: "0%" },
    { question: "Question 2", title: "Starter de Johto préféré", answers: 1520, top: "Héricendre (52%)", distribution: { "Héricendre": 52, "Kaiminus": 30, "Germignon": 18 }, time: "9.2s", dropAfter: "5%" },
    { question: "Question 3", title: "Le légendaire ultime", answers: 1444, top: "Mewtwo (65%)", distribution: { "Mewtwo": 65, "Lugia": 35 }, time: "11.1s", dropAfter: "4%" },
    { question: "Question 4", title: "Le pire Pokémon", answers: 1386, top: "Miasmax (78%)", distribution: { "Miasmax": 78, "Insolourdo": 22 }, time: "10.4s", dropAfter: "13%" },
    { question: "Question 5", title: "Ta région favorite", answers: 1205, top: "Kanto (45%)", distribution: { "Kanto": 45, "Johto": 35, "Sinnoh": 20 }, time: "12.0s", dropAfter: "3%" }
  ] },
  { id: "films-cultes", title: "Les Films Cultes", status: "Publié", date: "2026-07-15", starts: 850, completions: 586, completionRate: 69, avgTime: "1 min 52", shares: 145, dropOff: [100, 88, 80, 72, 69], dropOffDetail: [
    { question: "Question 1", title: "Ton film préféré", answers: 850, top: "Inception (42%)", distribution: { "Inception": 42, "Interstellar": 38, "Le Prestige": 20 }, time: "12.4s", dropAfter: "12%" },
    { question: "Question 2", title: "Le meilleur réalisateur", answers: 748, top: "Christopher Nolan (55%)", distribution: { "Nolan": 55, "Tarantino": 30, "Spielberg": 15 }, time: "11.8s", dropAfter: "8%" },
    { question: "Question 3", title: "Le film le plus triste", answers: 688, top: "La Ligne Verte (70%)", distribution: { "La Ligne Verte": 70, "Titanic": 30 }, time: "10.1s", dropAfter: "8%" },
    { question: "Question 4", title: "Le meilleur méchant", answers: 633, top: "Le Joker (80%)", distribution: { "Le Joker": 80, "Vador": 20 }, time: "9.5s", dropAfter: "3%" }
  ] },
  { id: "pop-culture-memes", title: "L'âge d'or des Mèmes", status: "Brouillon", date: "2026-07-28", starts: 620, completions: 471, completionRate: 76, avgTime: "1 min 41", shares: 89, dropOff: [100, 94, 88, 82, 76], dropOffDetail: [
    { question: "Question 1", title: "Le mème de la décennie", answers: 620, top: "Doge (44%)", distribution: { "Doge": 44, "Pepe": 36, "Wojak": 20 }, time: "9.4s", dropAfter: "6%" },
    { question: "Question 2", title: "Rickroll favori", answers: 583, top: "Original video (72%)", distribution: { "Original": 72, "Remix": 28 }, time: "8.1s", dropAfter: "6%" }
  ] }
];

// Mock Chart data structure
const CHART_DATA = {
  new_users: {
    "7d": [12, 18, 15, 24, 20, 28, 22],
    "30d": [10, 15, 12, 18, 14, 22, 20, 25, 22, 28, 26, 30, 27, 32, 29, 35, 33, 38, 36, 42, 40, 45, 43, 48, 46, 52, 50, 56, 54, 86],
    labels_7d: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    labels_30d: Array.from({ length: 30 }, (_, i) => `J${i + 1}`)
  },
  active_users: {
    "7d": [380, 395, 410, 425, 460, 510, 532],
    "30d": [210, 225, 220, 235, 240, 250, 245, 260, 275, 290, 285, 300, 310, 330, 320, 340, 350, 370, 365, 390, 400, 415, 410, 430, 445, 470, 485, 500, 515, 532],
    labels_7d: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    labels_30d: Array.from({ length: 30 }, (_, i) => `J${i + 1}`)
  },
  quizzes_played: {
    "7d": [250, 290, 280, 340, 390, 480, 510],
    "30d": [120, 140, 135, 150, 170, 190, 180, 210, 230, 250, 240, 270, 290, 310, 300, 330, 350, 370, 360, 390, 410, 430, 420, 450, 475, 510, 530, 550, 575, 620],
    labels_7d: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    labels_30d: Array.from({ length: 30 }, (_, i) => `J${i + 1}`)
  }
};

// Activity Feed Mock
const INITIAL_ACTIVITIES = [
  { id: 1, text: "Un utilisateur s'est inscrit il y a 2 minutes.", time: "2m", type: "user" },
  { id: 2, text: "Le quiz Pokémon a dépassé 1 000 participations.", time: "15m", type: "milestone" },
  { id: 3, text: "Le quiz Cinéma vient d'être publié.", time: "1h", type: "publish" },
  { id: 4, text: "Compte suspendu : @spammer99.", time: "3h", type: "suspension" },
  { id: 5, text: "Le quiz Séries TV a enregistré un taux de complétion de 85% aujourd'hui.", time: "5h", type: "stats" },
  { id: 6, text: "Nouvel avis utilisateur soumis pour le quiz Disney.", time: "1j", type: "feedback" }
];

// High-fidelity France Map paths from Trends page
const mainlandPath = "M4805 9979 c-192 -43 -280 -74 -360 -127 l-55 -36 0 -53 c0 -30 -7 -70 -15 -90 -21 -49 -19 -80 9 -140 19 -39 21 -53 11 -56 -15 -6 -45 -90 -45 -128 0 -15 5 -29 11 -31 8 -3 7 -14 -5 -35 -23 -45 -20 -54 24 -87 78 -58 118 -146 66 -146 -14 0 -28 5 -31 10 -4 6 -27 21 -52 34 l-46 23 -60 -64 c-63 -66 -196 -182 -234 -202 -12 -6 -41 -11 -65 -10 -24 1 -61 -6 -84 -14 -22 -8 -53 -13 -67 -10 -54 11 -116 -7 -183 -53 -36 -25 -88 -54 -116 -65 -28 -11 -64 -29 -79 -40 -40 -28 -93 -140 -93 -197 l-1 -46 99 -18 c91 -16 128 -30 115 -43 -3 -2 -49 -13 -102 -24 -70 -14 -125 -34 -198 -70 -59 -30 -116 -51 -134 -51 -18 0 -70 18 -116 39 -103 48 -164 61 -279 61 -64 0 -96 5 -117 17 -39 22 -83 11 -83 -20 0 -38 -12 -45 -67 -40 -47 5 -53 8 -53 28 0 12 7 36 16 54 15 31 15 33 -20 97 -20 35 -36 72 -36 81 0 10 14 32 31 49 25 25 30 38 25 58 -9 36 -56 42 -130 16 -33 -11 -73 -20 -90 -20 -38 0 -152 35 -185 57 -23 15 -24 15 -16 -8 4 -13 14 -82 23 -154 l15 -130 73 -78 c80 -85 92 -110 75 -158 -6 -18 -8 -55 -5 -85 6 -44 10 -54 25 -54 25 0 24 -23 -2 -165 -26 -135 -21 -151 58 -205 59 -39 68 -66 26 -76 -83 -18 -104 -26 -113 -44 -10 -18 -13 -19 -33 -6 -12 8 -53 20 -92 26 -90 16 -113 30 -117 75 l-3 36 -35 -30 -35 -29 18 -51 c19 -54 16 -83 -11 -113 -14 -17 -52 -25 -52 -12 0 4 5 24 11 45 10 33 9 42 -10 73 -13 20 -27 36 -31 36 -5 0 -20 -11 -34 -25 -31 -31 -49 -32 -73 -2 -10 12 -25 22 -33 22 -10 0 -15 9 -15 27 1 23 -2 25 -18 17 -10 -6 -28 -9 -40 -7 -14 2 -30 -7 -45 -24 -13 -15 -48 -41 -78 -58 -29 -17 -54 -36 -54 -41 0 -5 -8 -9 -18 -9 -13 0 -34 29 -72 98 -114 208 -122 218 -174 213 -28 -3 -29 -2 -23 34 6 35 5 36 -12 21 -23 -21 -41 -20 -56 1 -11 15 -17 14 -64 -16 -36 -23 -58 -31 -75 -27 -20 5 -24 1 -35 -34 -21 -70 -102 -106 -134 -60 -8 11 -27 23 -44 26 -26 5 -32 2 -51 -30 -23 -38 -36 -43 -76 -25 -16 8 -26 23 -31 46 -5 28 -10 33 -23 27 -54 -23 -142 -52 -174 -58 -31 -6 -38 -4 -38 10 0 11 -5 14 -16 10 -9 -3 -34 -9 -57 -12 -23 -4 -53 -15 -67 -24 -31 -21 -86 -40 -115 -40 -19 0 -23 -7 -29 -46 -3 -26 -6 -66 -6 -90 0 -43 1 -44 33 -44 17 0 83 11 145 23 105 21 112 22 112 5 0 -9 -10 -23 -22 -29 -21 -11 -20 -12 12 -25 25 -11 31 -19 27 -34 -4 -15 0 -20 16 -20 31 0 44 -11 57 -44 8 -21 7 -32 -1 -42 -16 -20 -31 -17 -73 11 -36 24 -134 55 -175 55 -17 0 -21 -6 -21 -30 0 -30 0 -30 25 -14 24 15 28 15 68 0 64 -25 85 -46 93 -93 8 -54 -3 -59 -139 -72 -59 -6 -118 -13 -133 -17 -38 -10 -10 -24 48 -24 45 0 49 -3 73 -40 14 -22 37 -69 52 -106 26 -62 26 -67 10 -79 -16 -11 -16 -13 -1 -19 8 -3 38 -6 66 -6 l50 0 -6 34 c-5 25 -3 35 9 40 8 3 15 18 15 34 0 34 16 52 47 52 16 0 23 -6 23 -19 0 -11 -4 -23 -10 -26 -19 -12 -10 -34 18 -49 26 -14 30 -13 45 5 24 28 32 24 65 -29 24 -39 38 -51 73 -61 70 -21 162 -66 192 -94 l27 -26 0 34 0 34 43 -18 c32 -14 42 -24 43 -42 1 -47 3 -50 32 -47 22 2 28 8 30 36 4 40 28 43 66 7 37 -34 34 -60 -12 -84 -29 -15 -29 -41 1 -41 13 0 28 -5 34 -11 18 -18 58 -7 61 18 2 12 9 27 17 33 11 9 17 6 28 -16 14 -26 19 -28 83 -28 66 -1 69 -2 79 -30 8 -24 6 -31 -16 -50 l-26 -22 76 -1 c51 0 88 -6 109 -17 34 -17 42 -43 17 -52 -11 -5 -12 -10 -3 -24 11 -18 8 -26 -36 -85 -5 -6 -6 -32 -2 -56 l7 -44 64 -16 65 -16 29 32 c43 49 66 58 130 51 61 -7 77 -16 134 -70 40 -38 99 -59 194 -71 48 -6 52 -9 43 -26 -20 -37 -47 -42 -122 -24 -49 13 -92 33 -144 68 -53 35 -87 51 -119 55 -55 6 -73 -7 -73 -52 0 -19 -3 -42 -6 -53 -5 -15 1 -22 30 -32 37 -13 134 -99 134 -118 0 -6 -11 -14 -24 -17 -29 -7 -126 -134 -126 -164 0 -11 17 -42 37 -69 20 -26 54 -70 75 -98 21 -27 46 -79 57 -115 15 -50 30 -75 63 -106 49 -48 106 -79 161 -87 20 -3 50 -15 65 -26 41 -29 82 -37 82 -17 0 29 30 17 47 -20 14 -28 21 -34 38 -29 40 13 58 10 77 -16 27 -36 17 -63 -38 -95 -40 -24 -43 -28 -31 -43 26 -29 97 -180 97 -206 0 -18 -5 -25 -20 -25 -17 0 -18 -3 -10 -26 18 -45 12 -71 -16 -78 -30 -8 -27 -28 13 -90 34 -52 15 -65 -45 -30 -49 29 -57 27 -48 -10 4 -17 21 -33 51 -48 54 -28 225 -211 255 -274 14 -28 25 -78 30 -141 13 -138 24 -170 86 -247 30 -37 54 -74 54 -81 0 -19 -13 -25 -30 -15 -11 7 -18 -1 -30 -33 -9 -23 -20 -42 -25 -42 -5 0 -13 19 -17 43 -4 25 -20 58 -39 81 -36 43 -65 129 -78 237 -7 63 -15 80 -63 150 -100 146 -113 163 -125 164 -24 0 -44 -48 -53 -126 -13 -118 -29 -206 -61 -339 -16 -66 -34 -165 -39 -220 -6 -55 -14 -125 -19 -155 -5 -30 -8 -56 -6 -58 2 -2 10 21 19 52 16 53 36 76 69 76 20 0 117 -101 117 -123 0 -52 -42 -71 -105 -47 -17 7 -33 7 -45 0 -29 -15 -57 -104 -79 -251 -11 -74 -47 -253 -80 -399 -32 -146 -62 -285 -66 -309 -18 -129 -164 -311 -250 -311 -18 0 -18 1 -4 -39 9 -27 16 -31 45 -31 24 0 43 -8 59 -25 l25 -24 0 24 c0 36 40 33 101 -7 43 -27 49 -36 49 -65 0 -18 -14 -63 -30 -100 -17 -36 -30 -70 -30 -74 0 -5 13 -9 29 -9 22 0 31 6 41 30 26 63 80 63 80 0 0 -46 29 -85 78 -106 80 -35 190 -64 243 -64 l55 0 22 -45 c12 -25 33 -63 47 -85 l25 -40 154 0 153 0 47 -59 c46 -57 49 -59 79 -50 18 5 76 12 129 16 l98 6 11 -33 12 -33 14 27 c16 30 29 32 61 11 15 -11 40 -15 84 -13 l63 3 -3 41 c-2 23 4 58 12 78 17 42 38 46 94 17 20 -10 75 -27 122 -36 64 -13 93 -24 118 -47 33 -28 36 -28 107 -22 89 8 125 -8 125 -55 0 -16 8 -39 18 -51 16 -20 21 -21 41 -11 18 10 42 10 113 0 96 -14 108 -23 108 -82 0 -16 9 -26 29 -33 18 -7 39 -29 56 -60 73 -128 86 -133 201 -83 l71 31 99 -40 c98 -40 99 -40 149 -25 27 8 97 39 154 69 58 30 112 54 120 54 8 0 45 -16 82 -35 38 -19 71 -35 74 -35 4 0 -3 13 -14 29 -12 16 -21 35 -21 43 0 8 -16 29 -35 48 l-35 34 0 115 c0 83 5 135 18 181 16 54 17 70 6 95 -10 25 -9 35 6 66 12 23 15 40 9 50 -22 36 -2 83 26 59 11 -9 17 -5 30 21 25 47 103 127 152 156 42 25 72 27 115 9 12 -6 29 4 60 37 55 57 255 219 313 252 31 19 55 25 82 23 36 -3 38 -5 47 -47 12 -56 36 -66 176 -76 120 -8 158 -23 166 -65 7 -34 24 -40 117 -40 l67 0 0 30 c0 54 60 91 90 55 7 -8 21 -15 32 -15 19 0 19 1 4 25 -17 26 -21 82 -7 104 8 12 20 9 73 -17 35 -18 73 -32 84 -32 50 0 58 -69 12 -103 -15 -11 -51 -22 -83 -26 -54 -6 -55 -7 -41 -26 14 -20 15 -20 87 -1 95 24 116 23 147 -7 20 -20 25 -36 25 -71 l0 -46 41 0 c23 0 52 -7 65 -16 22 -16 24 -16 33 0 14 25 35 19 81 -23 23 -21 52 -41 64 -45 12 -4 32 -23 43 -41 23 -37 40 -37 70 -1 16 20 67 20 100 1 35 -20 48 -18 52 7 3 22 8 23 76 22 65 0 73 2 78 21 4 17 23 25 105 45 54 13 103 26 108 29 5 4 12 21 16 38 6 28 4 33 -13 33 -11 0 -26 7 -33 16 -11 14 -11 18 4 28 9 7 25 33 36 59 21 50 37 62 94 72 53 10 83 38 102 95 17 51 27 58 111 75 25 5 37 17 58 55 32 59 69 90 107 90 26 0 29 3 29 33 0 64 27 77 106 52 21 -7 22 -4 20 80 -1 85 0 87 30 115 17 15 37 29 43 31 16 6 32 142 17 151 -18 12 -69 9 -148 -8 -41 -8 -90 -13 -113 -9 -58 8 -192 78 -252 130 -70 62 -90 108 -96 227 l-5 97 58 92 c57 88 59 93 46 123 -16 39 -69 76 -109 76 -24 0 -42 11 -79 51 -60 64 -128 165 -128 191 0 30 54 78 87 78 15 0 89 23 164 52 l136 53 7 70 c8 79 13 72 -93 138 -51 32 -62 44 -71 77 -5 22 -15 58 -21 81 -7 30 -19 45 -42 57 -17 10 -44 30 -60 45 -24 23 -28 33 -23 59 10 50 29 72 95 107 71 38 76 54 34 119 -20 31 -38 45 -64 52 -19 5 -46 21 -60 36 -22 24 -24 33 -24 132 0 69 -5 115 -13 130 -9 15 -11 37 -7 63 l7 39 -56 0 c-65 0 -241 -53 -250 -75 -7 -19 12 -75 34 -100 23 -26 13 -51 -34 -93 -54 -47 -109 -72 -159 -72 -27 0 -49 -6 -57 -15 -28 -34 -54 -5 -52 59 1 22 16 45 61 90 34 34 61 66 61 71 0 5 -10 33 -22 62 -21 51 -21 53 -4 98 15 39 16 51 5 77 -12 30 -11 32 27 66 90 81 131 120 162 156 30 35 32 41 32 117 0 44 4 88 10 98 9 18 42 34 93 45 15 4 27 13 27 22 0 8 24 41 53 72 66 70 132 159 142 192 4 14 17 35 28 48 20 22 20 22 1 22 -48 0 -56 44 -23 120 19 44 24 49 62 55 23 4 59 16 79 26 21 11 39 19 42 19 15 0 36 -35 36 -60 0 -55 54 -44 128 27 72 69 76 83 42 169 l-29 71 28 135 c27 131 27 135 11 184 -28 80 -5 193 56 283 20 30 24 48 24 109 0 44 5 81 14 95 7 12 16 45 19 74 7 57 23 96 71 161 61 84 77 101 111 113 30 11 33 16 28 41 -4 21 0 35 17 53 l22 23 -24 15 c-159 99 -201 116 -340 132 -87 10 -126 19 -147 34 -37 27 -45 26 -99 -5 -40 -24 -48 -25 -82 -15 -29 8 -45 8 -64 0 -29 -13 -51 -2 -61 32 -9 28 -81 27 -88 -1 -7 -29 -53 -26 -99 7 -36 24 -110 126 -180 245 -26 46 -26 46 -90 50 -53 4 -74 0 -131 -25 l-69 -29 -82 51 -83 51 -84 -25 c-131 -38 -143 -36 -164 35 -9 30 -14 35 -38 32 -29 -4 -32 0 -42 60 -5 33 -11 40 -63 64 -227 106 -258 128 -248 170 5 20 0 34 -24 60 -35 41 -36 52 -10 136 24 78 24 77 0 71 -14 -4 -22 -17 -26 -43 -10 -60 -36 -93 -119 -149 -85 -57 -114 -62 -202 -36 -98 29 -133 86 -75 122 15 9 29 18 30 19 2 1 -6 16 -19 33 -19 26 -22 41 -21 109 2 70 0 81 -21 101 -29 27 -77 41 -139 41 -39 0 -53 -5 -78 -30 -35 -35 -32 -33 -64 -19 -29 13 -41 46 -51 133 -10 84 -34 106 -118 106 -76 0 -109 20 -127 78 -7 20 -30 71 -52 112 l-40 75 -44 -4 c-40 -3 -44 -5 -44 -30 0 -15 -6 -36 -14 -46 -12 -17 -18 -15 -100 44 -101 73 -121 105 -137 218 -12 89 -18 113 -27 112 -4 -1 -83 -18 -177 -40z";
const corsicaPath = "M10049 1898 c0 -2 -3 -28 -6 -58 -3 -30 -9 -62 -14 -72 -14 -25 -11 -54 6 -68 18 -15 13 -55 -11 -102 -17 -32 -40 -35 -82 -11 -25 14 -34 15 -75 3 -42 -11 -47 -16 -47 -41 0 -36 -40 -63 -118 -81 -46 -10 -55 -16 -67 -45 -12 -28 -18 -33 -38 -28 -15 4 -28 0 -40 -13 -19 -21 -21 -35 -11 -95 6 -37 6 -38 -21 -31 -27 7 -28 6 -22 -27 4 -19 20 -46 37 -61 16 -15 30 -30 30 -32 0 -3 -20 -19 -44 -35 -43 -30 -44 -32 -34 -67 5 -20 7 -42 4 -50 -3 -9 1 -14 13 -14 24 0 74 -25 94 -47 8 -10 18 -30 22 -45 5 -21 2 -30 -14 -40 -12 -7 -21 -21 -21 -31 0 -10 -5 -28 -11 -39 -11 -20 -10 -21 22 -13 56 13 101 11 111 -5 8 -13 -5 -48 -70 -181 -1 -3 10 -4 25 -2 33 5 133 -41 133 -62 0 -7 -21 -31 -46 -53 -29 -24 -45 -45 -41 -54 3 -8 58 -35 123 -60 72 -28 123 -54 128 -65 5 -10 12 -25 16 -33 4 -8 15 -16 24 -18 12 -3 16 4 16 25 0 48 21 107 43 125 18 15 19 18 5 18 -25 0 -30 16 -23 61 7 38 9 41 35 37 26 -4 29 -1 40 41 7 25 15 105 19 176 l7 130 47 88 c26 49 47 97 47 107 0 10 -11 60 -24 112 -14 51 -29 146 -35 211 -9 111 -11 121 -45 170 l-35 52 -7 163 c-6 149 -8 162 -25 162 -11 0 -19 -1 -20 -2z";

// High-fidelity User Geographic Hotspots dataset
const CITIES_DATA = [
  { id: "paris", name: "Paris", x: 540, y: 280, users: 432, newUsers: 45, activeUsers: 210, quizzes: 1205, popularQuiz: "Cinéma" },
  { id: "lyon", name: "Lyon", x: 710, y: 510, users: 210, newUsers: 24, activeUsers: 95, quizzes: 670, popularQuiz: "Pokémon" },
  { id: "marseille", name: "Marseille", x: 740, y: 850, users: 182, newUsers: 20, activeUsers: 85, quizzes: 512, popularQuiz: "Pokémon" },
  { id: "toulouse", name: "Toulouse", x: 460, y: 810, users: 156, newUsers: 18, activeUsers: 73, quizzes: 490, popularQuiz: "Cinéma" },
  { id: "bordeaux", name: "Bordeaux", x: 340, y: 690, users: 145, newUsers: 14, activeUsers: 62, quizzes: 412, popularQuiz: "Séries TV" },
  { id: "strasbourg", name: "Strasbourg", x: 880, y: 290, users: 120, newUsers: 11, activeUsers: 52, quizzes: 340, popularQuiz: "Cinéma" },
  { id: "lille", name: "Lille", x: 550, y: 80, users: 104, newUsers: 12, activeUsers: 48, quizzes: 290, popularQuiz: "Séries TV" },
  { id: "nantes", name: "Nantes", x: 260, y: 440, users: 92, newUsers: 7, activeUsers: 41, quizzes: 234, popularQuiz: "Séries TV" },
  { id: "nice", name: "Nice", x: 870, y: 800, users: 87, newUsers: 8, activeUsers: 38, quizzes: 195, popularQuiz: "Cinéma" },
  { id: "ajaccio", name: "Ajaccio", x: 950, y: 950, users: 24, newUsers: 2, activeUsers: 10, quizzes: 60, popularQuiz: "Cinéma" }
];

const getCategoryUnselectedTheme = (colorClass: string) => {
  switch (colorClass) {
    case "bg-purple-500":
      return {
        bg: "bg-purple-50/60",
        border: "border-purple-100/80",
        title: "text-purple-950",
        desc: "text-purple-700/80",
        pill: "bg-purple-100/70 text-purple-700 border-purple-200/30",
        hoverBg: "hover:bg-purple-100/50"
      };
    case "bg-blue-500":
      return {
        bg: "bg-blue-50/60",
        border: "border-blue-100/80",
        title: "text-blue-950",
        desc: "text-blue-700/80",
        pill: "bg-blue-100/70 text-blue-700 border-blue-200/30",
        hoverBg: "hover:bg-blue-100/50"
      };
    case "bg-yellow-500":
    case "bg-amber-500":
      return {
        bg: "bg-amber-50/60",
        border: "border-amber-100/80",
        title: "text-amber-950",
        desc: "text-amber-700/80",
        pill: "bg-amber-100/70 text-amber-700 border-amber-200/30",
        hoverBg: "hover:bg-amber-100/50"
      };
    case "bg-red-500":
      return {
        bg: "bg-red-50/60",
        border: "border-red-100/80",
        title: "text-red-950",
        desc: "text-red-700/80",
        pill: "bg-red-100/70 text-red-700 border-red-200/30",
        hoverBg: "hover:bg-red-100/50"
      };
    case "bg-emerald-500":
      return {
        bg: "bg-emerald-50/60",
        border: "border-emerald-100/80",
        title: "text-emerald-950",
        desc: "text-emerald-700/80",
        pill: "bg-emerald-100/70 text-emerald-700 border-emerald-200/30",
        hoverBg: "hover:bg-emerald-100/50"
      };
    case "bg-orange-500":
      return {
        bg: "bg-orange-50/60",
        border: "border-orange-100/80",
        title: "text-orange-950",
        desc: "text-orange-700/80",
        pill: "bg-orange-100/70 text-orange-700 border-orange-200/30",
        hoverBg: "hover:bg-orange-100/50"
      };
    case "bg-pink-500":
      return {
        bg: "bg-pink-50/60",
        border: "border-pink-100/80",
        title: "text-pink-950",
        desc: "text-pink-700/80",
        pill: "bg-pink-100/70 text-pink-700 border-pink-200/30",
        hoverBg: "hover:bg-pink-100/50"
      };
    case "bg-indigo-500":
      return {
        bg: "bg-indigo-50/60",
        border: "border-indigo-100/80",
        title: "text-indigo-950",
        desc: "text-indigo-700/80",
        pill: "bg-indigo-100/70 text-indigo-700 border-indigo-200/30",
        hoverBg: "hover:bg-indigo-100/50"
      };
    default:
      return {
        bg: "bg-purple-50/60",
        border: "border-purple-100/80",
        title: "text-purple-950",
        desc: "text-purple-700/80",
        pill: "bg-purple-100/70 text-purple-700 border-purple-200/30",
        hoverBg: "hover:bg-purple-100/50"
      };
  }
};

import { 
  fetchCategories, 
  fetchQuizzes, 
  adminUpsertCategory, 
  adminDeleteCategory, 
  adminUpsertQuiz, 
  adminDeleteQuiz 
} from "@/lib/supabase/data";

import { useAuth } from "@/components/auth/AuthProvider";
import { AuthModal } from "@/components/auth/AuthModal";
import { ShieldAlert, Lock, Sparkles, LogIn } from "lucide-react";

import { getAvatars, saveAvatars, AvatarItem } from "@/lib/avatars";

export default function AdminDashboardPage() {
  const { user, profile } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Navigation state (6 main tabs including categories & avatars)
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "quizzes" | "stats" | "categories" | "avatars">("dashboard");
  const [categoriesList, setCategoriesList] = useState<any[]>(mockCategories);
  
  // Avatars Admin State
  const [adminAvatars, setAdminAvatars] = useState<AvatarItem[]>([]);
  const [editingAvatar, setEditingAvatar] = useState<AvatarItem | null>(null);
  const [avatarName, setAvatarName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarReqLevel, setAvatarReqLevel] = useState(1);
  const [avatarSaveSuccess, setAvatarSaveSuccess] = useState(false);
  const [isAddingAvatar, setIsAddingAvatar] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Category Admin State
  const [selectedCategoryToEdit, setSelectedCategoryToEdit] = useState<any>(null);
  const [catTitle, setCatTitle] = useState("");
  const [catEmoji, setCatEmoji] = useState("");
  const [catDescription, setCatDescription] = useState("");
  const [catColorClass, setCatColorClass] = useState("bg-purple-500");
  const [catGradientClass, setCatGradientClass] = useState("from-purple-400 to-purple-600");
  const [categorySaveSuccess, setCategorySaveSuccess] = useState(false);

  useEffect(() => {
    setAdminAvatars(getAvatars());
    async function initAdminData() {
      const dbCategories = await fetchCategories();
      if (dbCategories.length > 0) {
        setCategoriesList(dbCategories);
      } else {
        const savedCategories = localStorage.getItem("custom-categories");
        if (savedCategories) setCategoriesList(JSON.parse(savedCategories));
      }
    }
    initAdminData();
  }, []);

  const COLOR_PRESETS = [
    { name: "Violet", colorClass: "bg-purple-500", gradientClass: "from-purple-400 to-purple-600" },
    { name: "Bleu", colorClass: "bg-blue-500", gradientClass: "from-blue-400 to-blue-600" },
    { name: "Jaune", colorClass: "bg-yellow-500", gradientClass: "from-yellow-400 to-yellow-600" },
    { name: "Rouge", colorClass: "bg-red-500", gradientClass: "from-red-400 to-red-600" },
    { name: "Vert Émeraude", colorClass: "bg-emerald-500", gradientClass: "from-emerald-400 to-emerald-600" },
    { name: "Orange", colorClass: "bg-orange-500", gradientClass: "from-orange-400 to-orange-600" },
    { name: "Rose", colorClass: "bg-pink-500", gradientClass: "from-pink-400 to-pink-600" },
    { name: "Indigo", colorClass: "bg-indigo-500", gradientClass: "from-indigo-400 to-indigo-600" }
  ];

  const selectCategoryForEditing = (cat: any) => {
    setSelectedCategoryToEdit(cat);
    setCatTitle(cat.title);
    setCatEmoji(cat.emoji);
    setCatDescription(cat.description || "");
    setCatColorClass(cat.colorClass || "bg-purple-500");
    setCatGradientClass(cat.gradientClass || "from-purple-400 to-purple-600");
    setCategorySaveSuccess(false);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryToEdit) return;

    const updatedCategory = {
      ...selectedCategoryToEdit,
      title: catTitle,
      emoji: catEmoji,
      description: catDescription,
      colorClass: catColorClass,
      gradientClass: catGradientClass,
    };

    const updatedList = categoriesList.map((c) => {
      if (c.id === selectedCategoryToEdit.id) {
        return updatedCategory;
      }
      return c;
    });

    setCategoriesList(updatedList);
    localStorage.setItem("custom-categories", JSON.stringify(updatedList));

    try {
      await adminUpsertCategory(updatedCategory);
    } catch (err) {
      console.error("Error persisting category to Supabase:", err);
    }
    
    // Also save a custom event to notify other windows
    window.dispatchEvent(new Event("storage"));
    
    setCategorySaveSuccess(true);
    setTimeout(() => setCategorySaveSuccess(false), 3000);
  };

  // --- WIZARD FORM STATE (from original page) ---
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [isEditingQuizId, setIsEditingQuizId] = useState<string | null>(null);
  const [isCreatingNewQuiz, setIsCreatingNewQuiz] = useState(false);

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("films");
  const [badgeReward, setBadgeReward] = useState("");
  const [difficulty, setDifficulty] = useState<"Facile" | "Moyen" | "Difficile">("Moyen");
  const [duration, setDuration] = useState("5 min");
  const [selectedTheme, setSelectedTheme] = useState(CARD_THEMES[2]);
  const [quizCoverUrl, setQuizCoverUrl] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      title: "",
      voteQuestion: "",
      options: [
        { id: "opt-1", text: "", percentage: 50 },
        { id: "opt-2", text: "", percentage: 50 }
      ]
    }
  ]);

  const [uploadingForQuizCover, setUploadingForQuizCover] = useState(false);
  const [uploadProgressForQuizCover, setUploadProgressForQuizCover] = useState(0);
  const [uploadingForOptionId, setUploadingForOptionId] = useState<string | null>(null);
  const [uploadProgressForOption, setUploadProgressForOption] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- BACK-OFFICE MANAGE STATES ---
  const [users, setUsers] = useState(INITIAL_USERS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [quizStats, setQuizStats] = useState(INITIAL_QUIZ_STATS);

  // Dashboard chart controllers
  const [chartMetric, setChartMetric] = useState<"new_users" | "active_users" | "quizzes_played">("new_users");
  const [chartPeriod, setChartPeriod] = useState<"7d" | "30d" | "custom">("7d");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Map state
  const [selectedCity, setSelectedCity] = useState<typeof CITIES_DATA[number] | null>(CITIES_DATA[0]);

  // Users filter states
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userFilterStatus, setUserFilterStatus] = useState<"all" | "Actif" | "Suspendu" | "Supprimé">("all");
  const [userFilterTime, setUserFilterTime] = useState<"all" | "new" | "inactive">("all");
  const [userSortBy, setUserSortBy] = useState<"joinDate" | "lastActive" | "completedQuizzes">("joinDate");

  // Selected entities for detail screens
  const [selectedUserDetail, setSelectedUserDetail] = useState<AdminUser | null>(null);
  const [selectedQuizStats, setSelectedQuizStats] = useState<QuizStat | null>(null);

  // Admin action triggers
  const [actionConfirm, setActionConfirm] = useState<{ type: "suspend" | "delete" | "reactivate"; userId: string } | null>(null);
  const [editingUserFields, setEditingUserFields] = useState<{ id: string; username: string; email: string } | null>(null);

  // New Quiz Management states
  const [selectedDetailTab, setSelectedDetailTab] = useState<"stats" | "summary">("stats");
  const [quizActionConfirm, setQuizActionConfirm] = useState<{ type: "delete"; quizId: string; title: string } | null>(null);
  const [activeOptionUploadId, setActiveOptionUploadId] = useState<string | null>(null);
  const [isAdminCinematicOpen, setIsAdminCinematicOpen] = useState(false);
  const optionFileInputRef = useRef<HTMLInputElement>(null);

  // Load custom quizzes, categories & real Supabase users on mount
  useEffect(() => {
    loadLocalQuizzes();
    const savedCategories = localStorage.getItem("custom-categories");
    if (savedCategories) {
      setCategoriesList(JSON.parse(savedCategories));
    }

    async function loadRealUsers() {
      const realProfiles = await fetchAdminUsers();
      if (realProfiles && realProfiles.length > 0) {
        const mappedUsers: AdminUser[] = realProfiles.map((p) => ({
          id: p.id,
          username: p.username || "Membre JustVote",
          email: p.username.toLowerCase().includes("akmeos") 
            ? "titouan.kerneis.pro@gmail.com" 
            : `${p.username.toLowerCase()}@justvote.fr`,
          joinDate: "2026-08-01",
          lastActive: "Aujourd'hui",
          completedQuizzes: p.quizzes_completed || 0,
          status: "Actif",
          region: "France",
          startedQuizzes: (p.quizzes_completed || 0) + 2,
          completionRate: 92,
          timeSpent: "2h 45m",
          lastQuiz: "Pokémon",
        }));
        setUsers(mappedUsers);
      }
    }
    loadRealUsers();
  }, []);

  const loadLocalQuizzes = () => {
    try {
      const deletedIds: string[] = JSON.parse(localStorage.getItem("deleted-quiz-ids") || "[]");
      const localQuizzes = localStorage.getItem("custom-quizzes");
      const parsed: Quiz[] = localQuizzes ? JSON.parse(localQuizzes) : [];
      
      const allQuizzes = [...mockQuizzes, ...parsed];
      const activeQuizzes = allQuizzes.filter(q => !deletedIds.includes(q.id));
      
      const mappedStats: QuizStat[] = activeQuizzes.map((q) => {
        const initialStat = INITIAL_QUIZ_STATS.find(i => i.id === q.id);
        const isCustomized = parsed.some(p => p.id === q.id);
        
        if (initialStat && !isCustomized) {
          return initialStat;
        }
        
        let localQuestions: QuizQuestion[] = [];
        try {
          const savedQ = localStorage.getItem("custom-questions");
          const parsedQ: Record<string, QuizQuestion[]> = savedQ ? JSON.parse(savedQ) : {};
          if (parsedQ[q.id]) {
            localQuestions = parsedQ[q.id];
          }
        } catch(e) {
          console.error(e);
        }

        const questionsCount = q.questionsCount || localQuestions.length || 1;
        const dropOffArray = Array.from({ length: questionsCount }, (_, i) => {
          return Math.max(100 - i * 8, 50);
        });

        const dropOffDetailArray: DropOffItem[] = Array.from({ length: questionsCount }, (_, i) => {
          const quest = localQuestions[i];
          const questTitle = quest?.title || `Question ${i + 1}`;
          const topOpt = quest?.options?.[0]?.text || "Option A";
          const dist: Record<string, number> = {};
          if (quest?.options) {
            quest.options.forEach((o) => {
              dist[o.text] = o.percentage || 50;
            });
          } else {
            dist["Option A"] = 50;
            dist["Option B"] = 50;
          }

          return {
            question: `Question ${i + 1}`,
            title: questTitle,
            answers: q.participantsCount || 42,
            top: topOpt,
            distribution: dist,
            time: "9.2s",
            dropAfter: i === questionsCount - 1 ? "0%" : "6%"
          };
        });

        const isDraft = (q.status as string) === "Brouillon" || initialStat?.status === "Brouillon" || (q.status === "not_played" && q.id.includes("copy"));

        return {
          id: q.id,
          title: q.title,
          status: isDraft ? "Brouillon" : "Publié",
          date: new Date().toISOString().split("T")[0],
          starts: q.participantsCount || 0,
          completions: Math.floor((q.participantsCount || 0) * 0.74),
          completionRate: 74,
          avgTime: q.estimatedDuration || "5 min",
          shares: Math.floor((q.participantsCount || 0) * 0.15),
          dropOff: dropOffArray,
          dropOffDetail: dropOffDetailArray
        };
      });

      // Avoid duplicate IDs
      const uniqueStats: QuizStat[] = [];
      mappedStats.forEach(stat => {
        if (!uniqueStats.some(s => s.id === stat.id)) {
          uniqueStats.push(stat);
        }
      });

      setQuizStats(uniqueStats);
    } catch (e) {
      console.error("Failed to load local quizzes in admin dashboard", e);
    }
  };

  const handleDeleteQuiz = (quizId: string) => {
    try {
      const deletedIds = JSON.parse(localStorage.getItem("deleted-quiz-ids") || "[]");
      if (!deletedIds.includes(quizId)) {
        deletedIds.push(quizId);
        localStorage.setItem("deleted-quiz-ids", JSON.stringify(deletedIds));
      }
      
      const localQuizzes = localStorage.getItem("custom-quizzes");
      if (localQuizzes) {
        const parsed = JSON.parse(localQuizzes);
        const filtered = parsed.filter((q: any) => q.id !== quizId);
        localStorage.setItem("custom-quizzes", JSON.stringify(filtered));
      }
      
      loadLocalQuizzes();
      if (selectedQuizStats?.id === quizId) {
        setSelectedQuizStats(null);
      }
      setQuizActionConfirm(null);
    } catch(e) {
      console.error(e);
    }
  };

  const handleDuplicateQuiz = (quiz: QuizStat) => {
    try {
      const local = localStorage.getItem("custom-quizzes");
      const parsed = local ? JSON.parse(local) : [];
      const found = [...mockQuizzes, ...parsed].find(q => q.id === quiz.id);
      
      if (!found) return;
      
      let quizQuestionsList: QuizQuestion[] = [];
      try {
        const savedQ = localStorage.getItem("custom-questions");
        const parsedQ = savedQ ? JSON.parse(savedQ) : {};
        if (parsedQ[quiz.id]) {
          quizQuestionsList = parsedQ[quiz.id];
        }
      } catch(e) {
        console.error(e);
      }
      
      if (quizQuestionsList.length === 0) {
        quizQuestionsList = quiz.dropOffDetail.map((detail, index) => ({
          id: index + 1,
          title: detail.title,
          voteQuestion: "Quel est ton avis ?",
          options: Object.entries(detail.distribution).map(([text, pct]) => ({
            id: `opt-${Math.random().toString(36).substring(2, 11)}`,
            text: text,
            percentage: pct
          }))
        }));
      }
      
      const newId = `${found.id}-copy-${Date.now()}`;
      const duplicatedQuiz: Quiz = {
        ...found,
        id: newId,
        title: `${found.title} (Copie)`,
        participantsCount: 0,
        status: "not_played"
      };
      
      const updated = [duplicatedQuiz, ...parsed];
      localStorage.setItem("custom-quizzes", JSON.stringify(updated));
      
      try {
        const savedQ = localStorage.getItem("custom-questions");
        const parsedQ = savedQ ? JSON.parse(savedQ) : {};
        parsedQ[newId] = quizQuestionsList;
        localStorage.setItem("custom-questions", JSON.stringify(parsedQ));
      } catch(e) {
        console.error(e);
      }
      
      loadLocalQuizzes();
    } catch(e) {
      console.error(e);
    }
  };

  // --- CSV Export Helper ---
  const handleCSVExport = (type: "users" | "quizzes") => {
    let dataToExport: Record<string, string | number>[] = [];
    let filename = "";

    if (type === "users") {
      dataToExport = users.map(u => ({
        ID: u.id,
        Pseudonyme: u.username,
        Email: u.email,
        DateInscription: u.joinDate,
        DerniereConnexion: u.lastActive,
        QuizTermines: u.completedQuizzes,
        Statut: u.status,
        Region: u.region,
        TauxCompletion: `${u.completionRate}%`
      }));
      filename = "justvote_utilisateurs";
    } else {
      dataToExport = quizStats.map(q => ({
        ID: q.id,
        Titre: q.title,
        Statut: q.status,
        DatePublication: q.date,
        Commences: q.starts,
        Termines: q.completions,
        TauxCompletion: `${q.completionRate}%`,
        TempsMoyen: q.avgTime,
        Partages: q.shares
      }));
      filename = "justvote_quiz_performance";
    }

    if (dataToExport.length === 0) return;
    
    const headers = Object.keys(dataToExport[0]).join(",");
    const rows = dataToExport.map(row => 
      Object.values(row).map(val => {
        const strVal = String(val).replace(/"/g, '""');
        return `"${strVal}"`;
      }).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Admin User Actions ---
  const executeUserAction = () => {
    if (!actionConfirm) return;
    const { type, userId } = actionConfirm;

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        if (type === "suspend") return { ...u, status: "Suspendu" };
        if (type === "reactivate") return { ...u, status: "Actif" };
        if (type === "delete") return { ...u, status: "Supprimé" };
      }
      return u;
    }));

    if (selectedUserDetail && selectedUserDetail.id === userId) {
      setSelectedUserDetail(prev => {
        if (!prev) return null;
        if (type === "suspend") return { ...prev, status: "Suspendu" };
        if (type === "reactivate") return { ...prev, status: "Actif" };
        if (type === "delete") return { ...prev, status: "Supprimé" };
        return prev;
      });
    }

    const actionText = type === "suspend" 
      ? `Compte suspendu par l'admin : @${users.find(u => u.id === userId)?.username}` 
      : type === "delete" 
      ? `Compte supprimé par l'admin : @${users.find(u => u.id === userId)?.username}`
      : `Compte réactivé par l'admin : @${users.find(u => u.id === userId)?.username}`;

    setActivities(prev => [
      { id: Date.now(), text: actionText, time: "Inst.", type: "suspension" },
      ...prev
    ]);

    setActionConfirm(null);
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserFields) return;

    setUsers(prev => prev.map(u => {
      if (u.id === editingUserFields.id) {
        return { ...u, username: editingUserFields.username, email: editingUserFields.email };
      }
      return u;
    }));

    if (selectedUserDetail && selectedUserDetail.id === editingUserFields.id) {
      setSelectedUserDetail(prev => prev ? { ...prev, username: editingUserFields.username, email: editingUserFields.email } : null);
    }

    setEditingUserFields(null);
  };

  // --- Filtering & Sorting Users List ---
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    
    const matchesStatus = userFilterStatus === "all" || u.status === userFilterStatus;

    let matchesTime = true;
    if (userFilterTime === "new") {
      matchesTime = u.joinDate >= "2026-07-20";
    } else if (userFilterTime === "inactive") {
      matchesTime = u.lastActive < "2026-07-25";
    }

    return matchesSearch && matchesStatus && matchesTime;
  }).sort((a, b) => {
    if (userSortBy === "completedQuizzes") {
      return b.completedQuizzes - a.completedQuizzes;
    }
    if (userSortBy === "lastActive") {
      return b.lastActive.localeCompare(a.lastActive);
    }
    return b.joinDate.localeCompare(a.joinDate);
  });

  // --- Template loaders (retained from original page) ---
  const loadMovieTemplate = () => {
    setTitle("Les Super-Héros au Cinéma");
    setTagline("Devine les préférences des Français sur l'univers Marvel et DC !");
    setDescription("De Spider-Man à Batman, la France a choisi ses champions. Teste ton affinité avec la communauté geek française !");
    setCategoryId("pop-culture");
    setBadgeReward("Oracle Comics");
    setDifficulty("Moyen");
    setDuration("4 min");
    setSelectedTheme(CARD_THEMES[0]);
    setQuizCoverUrl("https://images.unsplash.com/photo-1546561892-65bf811416b9?w=400&q=80");
    setIsTrending(true);

    setQuestions([
      {
        id: 1,
        title: "Le super-héros ultime",
        voteQuestion: "Lequel t'inspire le plus ?",
        options: [
          { id: "sh-1", text: "Spider-Man", imageUrl: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=400&q=80", percentage: 58 },
          { id: "sh-2", text: "Batman", imageUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80", percentage: 42 }
        ]
      },
      {
        id: 2,
        title: "Marvel vs DC Comics",
        voteQuestion: "Quel univers domine selon toi ?",
        options: [
          { id: "univ-1", text: "Marvel Cinematic Universe", imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80", percentage: 67 },
          { id: "univ-2", text: "DC Extended Universe", imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80", percentage: 33 }
        ]
      }
    ]);
  };

  const loadPokemonTemplate = () => {
    setTitle("Quiz Pokémon Légendaire : Gen 2");
    setTagline("Lugia ou Ho-Oh ? Qui est le roi d'Or et Argent ?");
    setDescription("Explore la nostalgie de Johto ! Devine les votes de la communauté sur les Pokémon mythiques de la deuxième génération.");
    setCategoryId("pokemon");
    setBadgeReward("Héros de Johto");
    setDifficulty("Difficile");
    setDuration("6 min");
    setSelectedTheme(CARD_THEMES[1]);
    setQuizCoverUrl("");
    setIsTrending(false);

    setQuestions([
      {
        id: 1,
        title: "L'oiseau légendaire ultime de Johto",
        voteQuestion: "Qui sauves-tu en premier ?",
        options: [
          { id: "pk2-1", text: "Lugia", pokemonId: 249, percentage: 65 },
          { id: "pk2-2", text: "Ho-Oh", pokemonId: 250, percentage: 35 }
        ]
      },
      {
        id: 2,
        title: "Le chien légendaire le plus charismatique",
        voteQuestion: "Lequel intègres-tu dans ton équipe ?",
        options: [
          { id: "dog-1", text: "Suicune", pokemonId: 245, percentage: 52 },
          { id: "dog-2", text: "Raikou", pokemonId: 243, percentage: 20 },
          { id: "dog-3", text: "Entei", pokemonId: 244, percentage: 28 }
        ]
      }
    ]);
  };

  const loadBlankTemplate = () => {
    setTitle("");
    setTagline("");
    setDescription("");
    setCategoryId("films");
    setBadgeReward("");
    setDifficulty("Moyen");
    setDuration("5 min");
    setSelectedTheme(CARD_THEMES[2]);
    setQuizCoverUrl("");
    setIsNew(true);
    setIsTrending(false);
    setQuestions([
      {
        id: 1,
        title: "",
        voteQuestion: "",
        options: [
          { id: `opt-${Math.random().toString(36).substring(2, 11)}`, text: "", percentage: 50 },
          { id: `opt-${Math.random().toString(36).substring(2, 11)}`, text: "", percentage: 50 }
        ]
      }
    ]);
    setValidationError(null);
  };

  // --- Wizard Logic hooks (image selection, option adjustments) ---
  const triggerSimulatedUpload = (type: "cover" | string) => {
    if (type === "cover") {
      setUploadingForQuizCover(true);
      setUploadProgressForQuizCover(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgressForQuizCover(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const randomStock = STOCK_IMAGES[Math.floor(Math.random() * STOCK_IMAGES.length)];
            setQuizCoverUrl(randomStock.url);
            setUploadingForQuizCover(false);
          }, 300);
        }
      }, 150);
    } else {
      setUploadingForOptionId(type);
      setUploadProgressForOption(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        setUploadProgressForOption(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const randomStock = STOCK_IMAGES[Math.floor(Math.random() * STOCK_IMAGES.length)];
            updateOptionImage(type, randomStock.url);
            setUploadingForOptionId(null);
          }, 300);
        }
      }, 120);
    }
  };

  const handleRealFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "cover" | string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);

    if (type === "cover") {
      setUploadingForQuizCover(true);
      setUploadProgressForQuizCover(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgressForQuizCover(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setQuizCoverUrl(localUrl);
          setUploadingForQuizCover(false);
        }
      }, 80);
    } else {
      setUploadingForOptionId(type);
      setUploadProgressForOption(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgressForOption(progress);
        if (progress >= 100) {
          clearInterval(interval);
          updateOptionImage(type, localUrl);
          setUploadingForOptionId(null);
        }
      }, 60);
    }
  };

  const updateOptionImage = (optionId: string, url: string) => {
    setQuestions(prev => prev.map(q => ({
      ...q,
      options: q.options.map(opt => opt.id === optionId ? { ...opt, imageUrl: url, pokemonId: undefined } : opt)
    })));
  };

  const updateOptionPokemonId = (optionId: string, val: string) => {
    const pId = parseInt(val);
    setQuestions(prev => prev.map(q => ({
      ...q,
      options: q.options.map(opt => opt.id === optionId ? { ...opt, pokemonId: isNaN(pId) ? undefined : pId, imageUrl: undefined } : opt)
    })));
  };

  const updateOptionText = (optionId: string, text: string) => {
    setQuestions(prev => prev.map(q => ({
      ...q,
      options: q.options.map(opt => opt.id === optionId ? { ...opt, text } : opt)
    })));
  };

  const updateOptionPercentage = (optionId: string, percentageVal: string) => {
    const pct = parseInt(percentageVal);
    setQuestions(prev => prev.map(q => ({
      ...q,
      options: q.options.map(opt => opt.id === optionId ? { ...opt, percentage: isNaN(pct) ? 0 : pct } : opt)
    })));
  };

  const addOption = (questionId: number) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        if (q.options.length >= 4) return q;
        const newOpt: QuizOption = {
          id: `opt-${Math.random().toString(36).substring(2, 11)}`,
          text: `Option ${q.options.length + 1}`,
          percentage: 0
        };
        return { ...q, options: [...q.options, newOpt] };
      }
      return q;
    }));
  };

  const deleteOption = (questionId: number, optionId: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        if (q.options.length <= 2) return q;
        return { ...q, options: q.options.filter(opt => opt.id !== optionId) };
      }
      return q;
    }));
  };

  const addQuestion = () => {
    const newQ: QuizQuestion = {
      id: questions.length + 1,
      title: "Nouvelle question",
      voteQuestion: "Quel est ton avis ?",
      options: [
        { id: `opt-${Math.random().toString(36).substring(2, 11)}`, text: "Option A", percentage: 50 },
        { id: `opt-${Math.random().toString(36).substring(2, 11)}`, text: "Option B", percentage: 50 }
      ]
    };
    setQuestions([...questions, newQ]);
  };

  const deleteQuestion = (questionId: number) => {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter(q => q.id !== questionId).map((q, idx) => ({ ...q, id: idx + 1 })));
  };

  const updateQuestionFields = (questionId: number, fields: Partial<QuizQuestion>) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, ...fields } : q));
  };

  const validateStep = (stepNumber: 1 | 2 | 3) => {
    if (stepNumber === 1) {
      if (!title.trim()) return "Le titre du quiz est requis.";
      if (!tagline.trim()) return "Le slogan court est requis.";
      if (!description.trim()) return "La description longue est requise.";
    }
    if (stepNumber === 2) {
      for (const q of questions) {
        if (!q.title.trim()) return `La question ${q.id} a besoin d'un titre.`;
        if (q.options.length < 2) return `La question ${q.id} doit avoir au moins 2 options.`;
        for (const opt of q.options) {
          if (!opt.text.trim()) return `L'option de la question ${q.id} ne peut pas être vide.`;
        }
      }
    }
    return null;
  };

  const handleNextStep = () => {
    setValidationError(null);
    const error = validateStep(activeStep);
    if (error) {
      setValidationError(error);
      return;
    }
    if (activeStep < 3) {
      setActiveStep(prev => (prev === 1 ? 2 : 3) as 1 | 2 | 3);
    }
  };

  const handlePublish = () => {
    setValidationError(null);
    const error = validateStep(2);
    if (error) {
      setValidationError(error);
      setActiveStep(2);
      return;
    }

    const quizId = isEditingQuizId || title.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newQuiz: Quiz = {
      id: quizId,
      categoryId,
      title,
      tagline,
      description,
      questionsCount: questions.length,
      estimatedDuration: duration,
      difficulty,
      participantsCount: Math.floor(Math.random() * 50) + 20,
      pointsReward: questions.length * 15,
      badgeReward: badgeReward.trim() ? badgeReward : undefined,
      status: "not_played",
      isNew,
      isTrending,
      imageUrl: quizCoverUrl || (categoryId === "pokemon" ? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" : undefined),
      cardBgClass: selectedTheme.bgClass,
      textColorClass: selectedTheme.textClass,
      badgeBgClass: selectedTheme.id === "yellow-amber" ? "bg-yellow-950/15 text-yellow-950 border-yellow-950/10" : "bg-white/20 text-white border-white/10",
      themeColorClass: selectedTheme.id === "yellow-amber" ? "bg-yellow-950 text-white hover:bg-yellow-900" : "bg-white text-gray-800 hover:bg-gray-50",
      textMutedClass: selectedTheme.id === "yellow-amber" ? "text-yellow-900" : "text-white/80"
    };

    const localQuizzes = localStorage.getItem("custom-quizzes");
    const parsedQuizzes = localQuizzes ? JSON.parse(localQuizzes) : [];
    const updatedQuizzes = [newQuiz, ...parsedQuizzes.filter((q: Quiz) => q.id !== quizId)];
    localStorage.setItem("custom-quizzes", JSON.stringify(updatedQuizzes));

    const localQuestions = localStorage.getItem("custom-questions");
    const parsedQuestions = localQuestions ? JSON.parse(localQuestions) : {};
    parsedQuestions[quizId] = questions;
    localStorage.setItem("custom-questions", JSON.stringify(parsedQuestions));

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsCreatingNewQuiz(false);
      setIsEditingQuizId(null);
      loadLocalQuizzes();
    }, 1500);
  };

  const handleEditQuizClick = (quiz: QuizStat) => {
    const local = localStorage.getItem("custom-quizzes");
    const parsed = local ? JSON.parse(local) : [];
    const found = [...mockQuizzes, ...parsed].find(q => q.id === quiz.id);

    let localQuestions: QuizQuestion[] = [];
    try {
      const savedQ = localStorage.getItem("custom-questions");
      const parsedQ: Record<string, QuizQuestion[]> = savedQ ? JSON.parse(savedQ) : {};
      if (parsedQ[quiz.id]) {
        localQuestions = parsedQ[quiz.id];
      }
    } catch(e) {
      console.error(e);
    }

    if (localQuestions.length === 0) {
      localQuestions = quiz.dropOffDetail.map((detail, index) => ({
        id: index + 1,
        title: detail.title,
        voteQuestion: "Quel est ton avis ?",
        options: Object.entries(detail.distribution).map(([text, pct]) => ({
          id: `opt-${Math.random().toString(36).substring(2, 11)}`,
          text: text,
          percentage: pct
        }))
      }));
    }

    setIsEditingQuizId(quiz.id);
    setTitle(found?.title || quiz.title);
    setTagline(found?.tagline || (quiz.title + " - Édition"));
    setDescription(found?.description || "Modifier ce quiz.");
    setCategoryId(found?.categoryId || "films");
    setBadgeReward(found?.badgeReward || "");
    setDifficulty(found?.difficulty || "Moyen");
    setDuration(found?.estimatedDuration || "5 min");
    
    // Theme matching
    const themeMatch = CARD_THEMES.find(t => t.bgClass === found?.cardBgClass) || CARD_THEMES[2];
    setSelectedTheme(themeMatch);
    setQuizCoverUrl(found?.imageUrl || "");
    setIsNew(found?.isNew ?? true);
    setIsTrending(found?.isTrending ?? false);

    setQuestions(localQuestions);
    setActiveStep(1);
    setIsCreatingNewQuiz(true);
  };

  // --- SVG evolution chart helpers ---
  const activeMetricPoints = CHART_DATA[chartMetric][chartPeriod === "30d" ? "30d" : "7d"];
  const activeMetricLabels = CHART_DATA[chartMetric][chartPeriod === "30d" ? "labels_30d" : "labels_7d"];

  const getSvgPath = (points: number[], width: number, height: number) => {
    if (points.length === 0) return "";
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    return points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 50) - 25;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  };
  const getSvgAreaPath = (points: number[], width: number, height: number) => {
    const linePath = getSvgPath(points, width, height);
    if (!linePath) return "";
    return `${linePath} L ${width},${height} L 0,${height} Z`;
  };

  const isAdmin = profile?.role === "admin" || user?.email === "titouan.kerneis.pro@gmail.com";

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-orange-600 text-white rounded-[28px] flex items-center justify-center shadow-xl shadow-amber-500/20 mb-6">
          <ShieldAlert size={40} />
        </div>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          Espace Administrateur Réglé & Sécurisé 🔐
        </h2>

        <p className="text-slate-600 max-w-md font-medium text-sm mb-6 leading-relaxed">
          {user ? (
            <>Connecté en tant que <span className="font-extrabold text-slate-800">{user.email}</span>. Ce compte est un compte Joueur. Seul l&apos;Administrateur a accès à cette section.</>
          ) : (
            <>Veuillez vous connecter avec votre compte **Administrateur** pour gérer les quiz, catégories et statistiques.</>
          )}
        </p>

        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 max-w-md text-xs font-semibold mb-6 flex items-start gap-3 text-left">
          <Sparkles size={20} className="shrink-0 text-amber-600 mt-0.5" />
          <div>
            <span className="font-extrabold block text-amber-950 mb-0.5">ℹ️ Comment avoir le rôle Admin ?</span>
            Le **tout premier compte créé** sur l&apos;application devient automatiquement l&apos;Administrateur unique avec accès complet !
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 active:scale-95 transition-all"
          >
            <LogIn size={18} />
            <span>{user ? "Changer de compte" : "Se connecter / S'inscrire"}</span>
          </button>
        </div>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      
      {/* HEADER TOP NAVIGATION PANEL */}
      <header className="w-full bg-white border-b border-gray-100 px-6 py-4 shrink-0 shadow-sm relative z-20">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-soft">
              <span className="text-lg font-black tracking-tighter">JV</span>
            </div>
            <div>
              <h1 className="text-md font-black text-gray-800 tracking-tight">Just Vote</h1>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Back-office 🛠️</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {([
              { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
              { id: "users", label: "Utilisateurs", icon: Users },
              { id: "quizzes", label: "Administration des Quiz", icon: Settings },
              { id: "categories", label: "Catégories", icon: Grid },
              { id: "avatars", label: "Avatars par défaut", icon: ImageIcon },
              { id: "stats", label: "Statistiques", icon: TrendingUp }
            ] as const).map((item) => {
              const IconComponent = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsCreatingNewQuiz(false);
                    setIsEditingQuizId(null);
                    setSelectedUserDetail(null);
                    setSelectedQuizStats(null);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black tracking-wide whitespace-nowrap transition-all cursor-pointer",
                    active 
                      ? "bg-primary text-white shadow-md shadow-primary/10 scale-102"
                      : "text-gray-500 hover:text-primary hover:bg-gray-50"
                  )}
                >
                  <IconComponent size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] w-full mx-auto space-y-8">
        
        {/* 1. TABLEAU DE BORD (DASHBOARD TAB) */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">Vue générale</h2>
                <p className="text-gray-400 font-semibold text-xs mt-0.5">Synthèse et croissance de l&apos;application Just Vote.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setIsAdminCinematicOpen(true)}
                  className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <Play size={14} className="fill-current text-white" />
                  <span>Tester Cinématique Joueur 🎬</span>
                </button>
                <button 
                  onClick={() => handleCSVExport("users")}
                  className="bg-white hover:bg-gray-50 text-gray-700 font-extrabold px-4 py-2.5 rounded-2xl text-xs border border-gray-200 shadow-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <Download size={14} /> Exporter rapports
                </button>
              </div>
            </div>

            {/* PREMIÈRE LIGNE : Six cartes principaux indicateurs colorées et dynamiques */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Utilisateurs", value: users.length.toString(), sub: "Membres inscrits en base", icon: Users, bg: "bg-gradient-to-br from-blue-50/70 via-blue-50/20 to-white border-blue-100/70", text: "text-blue-900", subColor: "text-blue-600", iconBg: "bg-blue-100/60 text-blue-600" },
                { label: "Nouveaux inscrits", value: "86", sub: "Semaine en cours", icon: UserPlus, bg: "bg-gradient-to-br from-emerald-50/70 via-emerald-50/20 to-white border-emerald-100/70", text: "text-emerald-900", subColor: "text-emerald-600", iconBg: "bg-emerald-100/60 text-emerald-600" },
                { label: "Utilisateurs actifs", value: "532", sub: "Derniers 7 jours", icon: TrendingUp, bg: "bg-gradient-to-br from-purple-50/70 via-purple-50/20 to-white border-purple-100/70", text: "text-purple-900", subColor: "text-purple-600", iconBg: "bg-purple-100/60 text-purple-600" },
                { label: "Quiz commencés", value: "4 210", sub: "Cumulé plateforme", icon: Play, bg: "bg-gradient-to-br from-orange-50/70 via-orange-50/20 to-white border-orange-100/70", text: "text-orange-900", subColor: "text-orange-600", iconBg: "bg-orange-100/60 text-orange-600" },
                { label: "Quiz terminés", value: "3 116", sub: "Taux élevé", icon: Award, bg: "bg-gradient-to-br from-pink-50/70 via-pink-50/20 to-white border-pink-100/70", text: "text-pink-900", subColor: "text-pink-600", iconBg: "bg-pink-100/60 text-pink-600" },
                { label: "Taux complétion", value: "74 %", sub: "Moyenne générale", icon: Zap, bg: "bg-gradient-to-br from-cyan-50/70 via-cyan-50/20 to-white border-cyan-100/70", text: "text-cyan-900", subColor: "text-cyan-600", iconBg: "bg-cyan-100/60 text-cyan-600" }
              ].map((card, idx) => {
                const IconComponent = card.icon;
                return (
                  <div key={idx} className={cn("p-4 rounded-[24px] border shadow-soft flex flex-col justify-between min-h-[110px] transition-all hover:shadow-float hover:-translate-y-1 duration-300", card.bg)}>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider block">{card.label}</span>
                      <div className={cn("p-1.5 rounded-xl shrink-0 flex items-center justify-center", card.iconBg)}>
                        <IconComponent size={12} className={card.icon === Play ? "fill-current" : ""} />
                      </div>
                    </div>
                    <div className="my-1">
                      <span className={cn("text-xl md:text-2xl font-black tracking-tight", card.text)}>{card.value}</span>
                    </div>
                    <span className={cn("text-[9px] font-bold block mt-auto", card.subColor)}>{card.sub}</span>
                  </div>
                );
              })}
            </div>

            {/* DEUXIÈME LIGNE : Graphique d'évolution à gauche + Carte interactive à droite */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Graphic Column */}
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft lg:col-span-2 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Évolution de l&apos;activité</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">Consulte l&apos;évolution de la plateforme sur une période donnée.</p>
                  </div>
                  
                  {/* Period Switcher */}
                  <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 p-1 rounded-xl">
                    <button 
                      onClick={() => setChartPeriod("7d")}
                      className={cn("px-2.5 py-1.5 rounded-lg text-[10px] font-black tracking-wide cursor-pointer transition-all", chartPeriod === "7d" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400")}
                    >
                      7J
                    </button>
                    <button 
                      onClick={() => setChartPeriod("30d")}
                      className={cn("px-2.5 py-1.5 rounded-lg text-[10px] font-black tracking-wide cursor-pointer transition-all", chartPeriod === "30d" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400")}
                    >
                      30J
                    </button>
                    <button 
                      onClick={() => setChartPeriod("custom")}
                      className={cn("px-2.5 py-1.5 rounded-lg text-[10px] font-black tracking-wide cursor-pointer transition-all", chartPeriod === "custom" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400")}
                    >
                      Perso.
                    </button>
                  </div>
                </div>

                {/* Metric Selector Tabs */}
                <div className="flex gap-2">
                  {[
                    { id: "new_users", label: "Nouveaux utilisateurs" },
                    { id: "active_users", label: "Utilisateurs actifs" },
                    { id: "quizzes_played", label: "Quiz réalisés" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setChartMetric(tab.id as "new_users" | "active_users" | "quizzes_played")}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-[10px] font-black transition-all border cursor-pointer",
                        chartMetric === tab.id 
                          ? "bg-primary/5 text-primary border-primary/20"
                          : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Custom Period Input Form */}
                {chartPeriod === "custom" && (
                  <div className="p-3 bg-gray-50 rounded-2xl flex items-center gap-3 animate-in fade-in duration-300">
                    <Calendar size={14} className="text-gray-400" />
                    <div className="flex items-center gap-2 text-xs">
                      <input 
                        type="date" 
                        value={customStartDate || "2026-07-01"} 
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="bg-white border border-gray-200 px-2 py-1 rounded" 
                      />
                      <span className="text-gray-400">au</span>
                      <input 
                        type="date" 
                        value={customEndDate || "2026-08-01"}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="bg-white border border-gray-200 px-2 py-1 rounded" 
                      />
                    </div>
                  </div>
                )}

                {/* Render Interactive SVG Chart */}
                <div className="relative pt-4 w-full h-[180px]">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>

                    <line x1="0" y1="30" x2="500" y2="30" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="130" x2="500" y2="130" stroke="#f3f4f6" strokeWidth="1" />

                    <path
                      d={getSvgAreaPath(activeMetricPoints, 500, 180)}
                      fill="url(#chartGradient)"
                    />

                    <path
                      d={getSvgPath(activeMetricPoints, 500, 180)}
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {activeMetricPoints.map((val, idx) => {
                      const x = (idx / (activeMetricPoints.length - 1)) * 500;
                      const min = Math.min(...activeMetricPoints);
                      const max = Math.max(...activeMetricPoints);
                      const range = max - min || 1;
                      const y = 180 - ((val - min) / range) * 130 - 25;

                      return (
                        <g key={idx} className="group/dot cursor-pointer">
                          <circle
                            cx={x}
                            cy={y}
                            r="4"
                            className="fill-primary stroke-white stroke-2 drop-shadow-sm hover:r-6 hover:fill-primary-dark transition-all"
                          />
                          <title>{`Valeur : ${val} (${activeMetricLabels[idx]})`}</title>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="flex justify-between px-1 text-[8px] font-bold text-gray-400">
                  <span>{activeMetricLabels[0]}</span>
                  <span>{activeMetricLabels[Math.floor(activeMetricLabels.length / 2)]}</span>
                  <span>{activeMetricLabels[activeMetricLabels.length - 1]}</span>
                </div>
              </div>

              {/* France Map Column (High-fidelity matching Trends page) */}
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft space-y-4">
                <div className="pb-3 border-b border-gray-100 flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Carte utilisateur (Villes)</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">Sélectionne un point sur la carte pour voir ses statistiques.</p>
                  </div>
                  <MapPin className="text-primary shrink-0" size={16} />
                </div>

                <div className="flex justify-center py-2 relative">
                  <div className="relative w-full max-w-[200px] aspect-square flex items-center justify-center">
                    <svg viewBox="0 0 1024 1024" className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-visible">
                      <defs>
                        <linearGradient id="franceMapGradAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f8fafc" />
                          <stop offset="100%" stopColor="#e2e8f0" />
                        </linearGradient>
                      </defs>

                      {/* Main France Map Outline with premium gradient */}
                      <g transform="translate(0, 1024) scale(0.1, -0.1)" fill="url(#franceMapGradAdmin)" stroke="#cbd5e1" strokeWidth={15}>
                        <path d={mainlandPath} />
                        <path d={corsicaPath} />
                      </g>

                      {/* Dots representing precise survey answers */}
                      {CITIES_DATA.map((p, idx) => {
                        const isSelected = selectedCity?.id === p.id;

                        return (
                          <g 
                            key={idx}
                            className="cursor-pointer group"
                            onClick={() => setSelectedCity(p)}
                          >
                            {/* Large invisible circle to make hover zone generous and easy */}
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={55}
                              fill="transparent"
                              className="pointer-events-auto"
                            />

                            {/* Glowing Outer Ring */}
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={isSelected ? 32 : 24}
                              fill="none"
                              stroke="#8B5CF6"
                              strokeWidth={isSelected ? 8 : 4}
                              className={cn("transition-all duration-300 pointer-events-none", isSelected ? "opacity-40" : "opacity-20 group-hover:opacity-30")}
                            />
                            
                            {/* Pulsing ring for selected */}
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={isSelected ? 42 : 32}
                              fill="none"
                              stroke="#8B5CF6"
                              strokeWidth={2}
                              className={cn("animate-ping pointer-events-none", isSelected ? "opacity-20" : "opacity-0 group-hover:opacity-10")}
                              style={{ animationDuration: "3s" }}
                            />

                            {/* Core Dot */}
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={isSelected ? 18 : 13}
                              fill="#8B5CF6"
                              className="transition-all duration-300 shadow-sm pointer-events-none"
                            />
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {selectedCity ? (
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-gray-800">📍 {selectedCity.name}</span>
                      <span className="text-[9px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-md">
                        {selectedCity.users} membres
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-500">
                      <div>Nouveaux : <span className="text-emerald-600">+{selectedCity.newUsers}</span></div>
                      <div>Actifs : <span className="text-gray-800">{selectedCity.activeUsers}</span></div>
                      <div>Quiz terminés : <span className="text-gray-800">{selectedCity.quizzes}</span></div>
                      <div>Populaire : <span className="text-primary font-black">{selectedCity.popularQuiz}</span></div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-center text-gray-400 py-3">Clique sur un point de la carte pour voir ses statistiques.</p>
                )}
              </div>

            </div>

            {/* TROISIÈME LIGNE : Quiz populaires à gauche + Activité récente à droite */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft lg:col-span-2 space-y-4">
                <div className="pb-3 border-b border-gray-100 flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Quiz les plus populaires</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">Classement par volume de participations et taux de réussite.</p>
                  </div>
                  <TrendingUp className="text-primary shrink-0" size={16} />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-black tracking-wider uppercase text-[9px] bg-gray-50/50">
                        <th className="py-2.5 px-3 rounded-l-xl">Quiz</th>
                        <th className="py-2.5 px-3">Quiz commencés</th>
                        <th className="py-2.5 px-3">Complétion</th>
                        <th className="py-2.5 px-3 rounded-r-xl">Temps moyen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-bold text-gray-700">
                      {[
                        { title: "Pokémon", starts: "1 520", completion: "81 %", time: "1 min 34", emoji: "⚡️", bg: "bg-yellow-100 text-yellow-800" },
                        { title: "Cinéma", starts: "850", completion: "69 %", time: "1 min 52", emoji: "🎬", bg: "bg-red-100 text-red-800" },
                        { title: "Séries TV", starts: "620", completion: "76 %", time: "1 min 41", emoji: "📺", bg: "bg-purple-100 text-purple-800" }
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/30">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-xs shadow-sm font-semibold shrink-0 select-none", item.bg)}>
                                {item.emoji}
                              </span>
                              <span className="font-black text-gray-900">{item.title}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">{item.starts}</td>
                          <td className="py-3 px-3 text-emerald-600">{item.completion}</td>
                          <td className="py-3 px-3">{item.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft space-y-4">
                <div className="pb-3 border-b border-gray-100 flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Activité récente</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">Événements en direct sur la plateforme.</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                </div>

                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                  {activities.map((item) => (
                    <div key={item.id} className="flex items-start gap-2.5 text-[11px] leading-relaxed">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        item.type === "suspension" ? "bg-red-500" :
                        item.type === "publish" ? "bg-emerald-500" :
                        item.type === "milestone" ? "bg-purple-500" : "bg-primary"
                      )} />
                      <div className="flex-1 font-semibold text-gray-600">
                        {item.text}
                      </div>
                      <span className="text-[9px] text-gray-400 font-bold shrink-0">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. GESTION DES UTILISATEURS (USERS TAB) */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">Utilisateurs</h2>
                <p className="text-gray-400 font-semibold text-xs mt-0.5">Modération et fiche détaillée des membres inscrits.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleCSVExport("users")}
                  className="bg-white hover:bg-gray-50 text-gray-700 font-extrabold px-4 py-2.5 rounded-2xl text-xs border border-gray-200 shadow-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <Download size={14} /> Exporter CSV
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200/80 px-3.5 py-2.5 rounded-2xl flex-1 max-w-md">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par pseudonyme ou email..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs font-semibold text-gray-800 placeholder:text-gray-400 outline-none w-full"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                
                <select
                  value={userFilterStatus}
                  onChange={(e) => setUserFilterStatus(e.target.value as "all" | "Actif" | "Suspendu" | "Supprimé")}
                  className="bg-white border border-gray-200 px-3 py-2.5 rounded-2xl text-xs font-black text-gray-700 outline-none cursor-pointer"
                >
                  <option value="all">Statut : Tous</option>
                  <option value="Actif">Actifs</option>
                  <option value="Suspendu">Suspendus</option>
                  <option value="Supprimé">Supprimés</option>
                </select>

                <select
                  value={userFilterTime}
                  onChange={(e) => setUserFilterTime(e.target.value as "all" | "new" | "inactive")}
                  className="bg-white border border-gray-200 px-3 py-2.5 rounded-2xl text-xs font-black text-gray-700 outline-none cursor-pointer"
                >
                  <option value="all">Période : Tous</option>
                  <option value="new">Nouveaux cette semaine</option>
                  <option value="inactive">Inactifs récents</option>
                </select>

                <select
                  value={userSortBy}
                  onChange={(e) => setUserSortBy(e.target.value as "joinDate" | "lastActive" | "completedQuizzes")}
                  className="bg-white border border-gray-200 px-3 py-2.5 rounded-2xl text-xs font-black text-gray-700 outline-none cursor-pointer"
                >
                  <option value="joinDate">Trier : Date d&apos;inscription</option>
                  <option value="lastActive">Trier : Dernière connexion</option>
                  <option value="completedQuizzes">Trier : Quiz réalisés</option>
                </select>

              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-soft lg:col-span-2 overflow-hidden space-y-2 p-5">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide block mb-3">Membres trouvés ({filteredUsers.length})</span>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-black tracking-wider uppercase text-[9px] bg-gray-50/50">
                        <th className="py-2.5 px-3 rounded-l-xl">Pseudo</th>
                        <th className="py-2.5 px-3">E-mail</th>
                        <th className="py-2.5 px-3">Inscription</th>
                        <th className="py-2.5 px-3">Dernière Conn.</th>
                        <th className="py-2.5 px-3">Quiz</th>
                        <th className="py-2.5 px-3 rounded-r-xl">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
                      {filteredUsers.map((user) => (
                        <tr 
                          key={user.id} 
                          onClick={() => setSelectedUserDetail(user)}
                          className={cn(
                            "hover:bg-gray-50/50 cursor-pointer transition-colors",
                            selectedUserDetail?.id === user.id ? "bg-primary/5" : ""
                          )}
                        >
                          <td className="py-3.5 px-3 font-black text-gray-900">{user.username}</td>
                          <td className="py-3.5 px-3">{user.email}</td>
                          <td className="py-3.5 px-3">{user.joinDate}</td>
                          <td className="py-3.5 px-3">{user.lastActive}</td>
                          <td className="py-3.5 px-3">{user.completedQuizzes}</td>
                          <td className="py-3.5 px-3">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] font-black uppercase border",
                              user.status === "Actif" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
                              user.status === "Suspendu" ? "bg-amber-50 border-amber-200 text-amber-800" :
                              "bg-rose-50 border-rose-200 text-rose-800"
                            )}>
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft space-y-5">
                <div className="pb-3 border-b border-gray-100">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Fiche utilisateur</h3>
                  <p className="text-[10px] text-gray-400 font-semibold">Informations détaillées et modération.</p>
                </div>

                {selectedUserDetail ? (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-gray-800">@{selectedUserDetail.username}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-black uppercase border",
                          selectedUserDetail.status === "Actif" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
                          selectedUserDetail.status === "Suspendu" ? "bg-amber-50 border-amber-200 text-amber-800" :
                          "bg-rose-50 border-rose-200 text-rose-800"
                        )}>
                          {selectedUserDetail.status}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-gray-400 block">{selectedUserDetail.email}</span>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-bold">Création du compte :</span>
                        <span className="text-gray-800 font-black">{selectedUserDetail.joinDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-bold">Dernière activité :</span>
                        <span className="text-gray-800 font-black">{selectedUserDetail.lastActive}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-bold">Région :</span>
                        <span className="text-gray-800 font-black">{selectedUserDetail.region}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200/50 pt-2">
                        <span className="text-gray-400 font-bold">Quiz commencés :</span>
                        <span className="text-gray-800 font-black">{selectedUserDetail.startedQuizzes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-bold">Quiz terminés :</span>
                        <span className="text-gray-800 font-black">{selectedUserDetail.completedQuizzes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-bold">Taux de complétion :</span>
                        <span className="text-emerald-700 font-black">{selectedUserDetail.completionRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-bold">Temps total passé :</span>
                        <span className="text-gray-800 font-black">{selectedUserDetail.timeSpent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-bold">Dernier quiz :</span>
                        <span className="text-primary font-black">{selectedUserDetail.lastQuiz}</span>
                      </div>
                    </div>

                    {editingUserFields?.id === selectedUserDetail.id ? (
                      <form onSubmit={handleEditUserSubmit} className="space-y-3 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase">Pseudonyme</label>
                          <input 
                            type="text"
                            value={editingUserFields.username}
                            onChange={(e) => setEditingUserFields(prev => prev ? { ...prev, username: e.target.value } : null)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase">Adresse E-mail</label>
                          <input 
                            type="email"
                            value={editingUserFields.email}
                            onChange={(e) => setEditingUserFields(prev => prev ? { ...prev, email: e.target.value } : null)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-bold"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button 
                            type="submit"
                            className="bg-primary text-white font-extrabold px-3 py-1.5 rounded-lg text-[10px]"
                          >
                            Valider
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setEditingUserFields(null)}
                            className="text-gray-400 text-[10px]"
                          >
                            Annuler
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setEditingUserFields({ id: selectedUserDetail.id, username: selectedUserDetail.username, email: selectedUserDetail.email })}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold px-3 py-2 rounded-xl text-[10px] transition-all cursor-pointer"
                        >
                          Modifier infos ✏️
                        </button>

                        {selectedUserDetail.status === "Actif" ? (
                          <button
                            onClick={() => setActionConfirm({ type: "suspend", userId: selectedUserDetail.id })}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-extrabold px-3 py-2 rounded-xl text-[10px] transition-all cursor-pointer border border-amber-100"
                          >
                            Suspendre 🔒
                          </button>
                        ) : (
                          <button
                            onClick={() => setActionConfirm({ type: "reactivate", userId: selectedUserDetail.id })}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold px-3 py-2 rounded-xl text-[10px] transition-all cursor-pointer border border-emerald-100"
                          >
                            Réactiver 🔓
                          </button>
                        )}

                        <button
                          onClick={() => setActionConfirm({ type: "delete", userId: selectedUserDetail.id })}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold px-3 py-2 rounded-xl text-[10px] transition-all cursor-pointer border border-rose-100"
                        >
                          Supprimer 🗑️
                        </button>
                      </div>
                    )}

                  </div>
                ) : (
                  <p className="text-[11px] text-center text-gray-400 py-6">Sélectionne un utilisateur dans la liste pour voir sa fiche et exécuter des actions.</p>
                )}
              </div>

            </div>

            {/* CONFIRMATION OVERLAY MODAL */}
            {actionConfirm && (
              <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white p-6 rounded-[32px] max-w-sm w-full space-y-4 border border-gray-100 shadow-xl">
                  <div className="flex items-center gap-3 text-rose-600">
                    <AlertTriangle size={24} />
                    <h4 className="text-sm font-black uppercase tracking-wider">Confirmation requise</h4>
                  </div>
                  <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                    Es-tu sûr de vouloir {
                      actionConfirm.type === "suspend" ? "suspendre temporairement" : 
                      actionConfirm.type === "delete" ? "supprimer définitivement" : "réactiver"
                    } le compte de <span className="font-extrabold text-gray-800">@{users.find(u => u.id === actionConfirm.userId)?.username}</span> ? Cette action prend effet immédiatement.
                  </p>
                  <div className="flex gap-2.5 pt-2">
                    <button
                      onClick={executeUserAction}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs cursor-pointer active:scale-95 transition-all flex-1"
                    >
                      Oui, confirmer
                    </button>
                    <button
                      onClick={() => setActionConfirm(null)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold px-4 py-2.5 rounded-xl text-xs cursor-pointer active:scale-95 transition-all flex-1"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 3. SUIVI & CRÉATION DES QUIZ (QUIZZES TAB) */}
        {activeTab === "quizzes" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {isCreatingNewQuiz ? (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <button
                    onClick={() => {
                      setIsCreatingNewQuiz(false);
                      setIsEditingQuizId(null);
                    }}
                    className="hover:bg-gray-50 text-gray-600 font-extrabold px-3 py-2 rounded-xl text-xs transition-all border border-gray-200 flex items-center gap-1.5 active:scale-95"
                  >
                    <ArrowLeft size={14} /> Annuler et retourner au back-office
                  </button>

                  <div className="flex items-center gap-1.5 bg-surface border border-gray-200/80 p-1.5 rounded-2xl shadow-soft">
                    <span className="text-[9px] font-black text-gray-400 px-2 uppercase tracking-wide">Modèles :</span>
                    <button 
                      onClick={loadMovieTemplate}
                      className="hover:bg-red-50 hover:text-red-700 text-gray-600 font-extrabold px-3 py-1.5 rounded-xl text-xs cursor-pointer active:scale-95"
                    >
                      Films 🎬
                    </button>
                    <button 
                      onClick={loadPokemonTemplate}
                      className="hover:bg-yellow-50 hover:text-yellow-700 text-gray-600 font-extrabold px-3 py-1.5 rounded-xl text-xs cursor-pointer active:scale-95"
                    >
                      Pokémon ⚡️
                    </button>
                    <button 
                      onClick={loadBlankTemplate}
                      className="hover:bg-gray-100 hover:text-gray-800 text-gray-600 font-extrabold px-3 py-1.5 rounded-xl text-xs cursor-pointer active:scale-95"
                    >
                      Vierge 📄
                    </button>
                  </div>
                </div>

                <div className="bg-surface p-4 rounded-3xl border border-gray-100 shadow-soft flex items-center justify-between gap-4">
                  {([
                    { step: 1, label: "1. Identité 📝", activeClass: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20" },
                    { step: 2, label: "2. Questions ❓", activeClass: "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/20" },
                    { step: 3, label: "3. Publication 🚀", activeClass: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20" }
                  ] as const).map((item) => (
                    <button
                      key={item.step}
                      disabled={item.step > activeStep && validateStep(activeStep) !== null}
                      onClick={() => {
                        setValidationError(null);
                        setActiveStep(item.step);
                      }}
                      className={cn(
                        "flex-1 text-center py-3 rounded-2xl text-xs font-black transition-all tracking-wider uppercase cursor-pointer active:scale-98 disabled:opacity-50",
                        activeStep === item.step
                          ? item.activeClass
                          : "text-gray-400 hover:text-primary bg-gray-50 border border-gray-100 hover:bg-gray-100/80"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {validationError && (
                  <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3 animate-in shake duration-300">
                    <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="text-sm font-black text-rose-950">Erreur de validation</h4>
                      <p className="text-xs text-rose-800/90 mt-1">{validationError}</p>
                    </div>
                  </div>
                )}

                {/* STEP 1: IDENTITY */}
                {activeStep === 1 && (
                  <div className="bg-surface p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-soft space-y-6 animate-in fade-in duration-300">
                    <div className="border-b border-gray-100 pb-4">
                      <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                        <Settings className="text-primary" /> {isEditingQuizId ? `Modifier le Quiz : ${title}` : "Étape 1 : Identité et Esthétique du Quiz"}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1">Définis l&apos;aspect général et les métadonnées de ton quiz.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Titre du Quiz</label>
                        <input 
                          type="text"
                          placeholder="Ex: Les Chef-d'œuvres de Nolan"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full bg-surface-muted border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Slogan Court</label>
                        <input 
                          type="text"
                          placeholder="Ex: Devine les films qui ont marqué la France !"
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
                          className="w-full bg-surface-muted border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Description longue</label>
                        <textarea 
                          rows={3}
                          placeholder="Décris le contenu du quiz..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full bg-surface-muted border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-primary resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Catégorie</label>
                        <select
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          className="w-full bg-surface-muted border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:border-primary cursor-pointer"
                        >
                          {categoriesList.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.emoji} {cat.title}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Badge Récompense</label>
                        <input 
                          type="text"
                          placeholder="Ex: Expert Ciné"
                          value={badgeReward}
                          onChange={(e) => setBadgeReward(e.target.value)}
                          className="w-full bg-surface-muted border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Difficulté</label>
                        <select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value as "Facile" | "Moyen" | "Difficile")}
                          className="w-full bg-surface-muted border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 outline-none cursor-pointer"
                        >
                          <option value="Facile">🟢 Facile</option>
                          <option value="Moyen">🟡 Moyen</option>
                          <option value="Difficile">🔴 Difficile</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Durée Estimée</label>
                        <input 
                          type="text"
                          placeholder="Ex: 5 min"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full bg-surface-muted border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 outline-none"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Design de la Carte (Thème)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                          {CARD_THEMES.map((theme) => (
                            <button
                              key={theme.id}
                              onClick={() => setSelectedTheme(theme)}
                              type="button"
                              className={cn(
                                "p-3 rounded-2xl border text-center transition-all duration-300 text-xs font-black tracking-wide cursor-pointer relative",
                                theme.bgClass,
                                theme.textClass,
                                selectedTheme.id === theme.id ? "ring-2 ring-primary ring-offset-2 scale-102" : "opacity-80 hover:opacity-100"
                              )}
                            >
                              {theme.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Cover Image Uploader selection */}
                      <div className="space-y-3 md:col-span-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Illustration de Couverture</label>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 rounded-[24px] p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] group"
                          >
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => handleRealFileChange(e, "cover")}
                            />
                            {uploadingForQuizCover ? (
                              <div className="space-y-2 w-full text-center">
                                <span className="text-[10px] font-black text-primary">{uploadProgressForQuizCover}%</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="text-gray-300 group-hover:text-primary mb-1" size={24} />
                                <span className="text-xs font-bold text-gray-600 block">Charger illustration</span>
                              </>
                            )}
                          </div>

                          <div className="bg-surface-muted p-4 rounded-[24px] border border-gray-200 flex flex-col justify-between">
                            {quizCoverUrl ? (
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={quizCoverUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                                <button onClick={() => setQuizCoverUrl("")} className="text-[10px] font-bold text-rose-500 hover:underline">Supprimer</button>
                              </div>
                            ) : (
                              <div className="text-gray-400 text-xs py-3 text-center">Aucune couverture</div>
                            )}

                            <div className="mt-2">
                              <span className="text-[9px] font-bold text-gray-400 block mb-1">Stocks libres :</span>
                              <div className="flex gap-1 overflow-x-auto">
                                {STOCK_IMAGES.map((img, idx) => (
                                  <button key={idx} type="button" onClick={() => setQuizCoverUrl(img.url)} className="bg-white text-gray-600 font-bold px-2 py-0.5 rounded text-[9px] border whitespace-nowrap">
                                    {img.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-100">
                      <button
                        onClick={handleNextStep}
                        className="bg-primary hover:bg-primary-dark text-white font-extrabold px-8 py-3.5 rounded-2xl text-xs shadow-md flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                      >
                        Étape suivante (Questions) <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: QUESTIONS */}
                {activeStep === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-soft space-y-6">
                      <div className="border-b border-gray-100 pb-4 flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                            <HelpCircle className="text-primary" /> Étape 2 : Édition des Questions ({questions.length})
                          </h3>
                          <p className="text-gray-400 text-xs mt-1">Crée ou modifie les questions de ton quiz et leurs options associées.</p>
                        </div>
                        <button
                          onClick={addQuestion}
                          className="bg-primary hover:bg-primary-dark text-white font-black px-4 py-2.5 rounded-2xl text-xs flex items-center gap-1 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                        >
                          <Plus size={14} /> Ajouter question
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                        {/* Côté gauche : Liste des questions (Question Navigator) */}
                        <div className="lg:col-span-1 lg:sticky lg:top-[90px] space-y-4 bg-gradient-to-br from-primary-light/5 to-primary-dark/5 p-5 rounded-3xl border border-primary-light/10 shadow-sm">
                          <span className="text-[10px] font-black text-primary-dark uppercase tracking-widest block mb-2">Question Navigator 🧭</span>
                          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none max-h-[350px] lg:overflow-y-auto pr-1">
                            {questions.map((q, idx) => (
                              <button
                                key={q.id}
                                onClick={() => {
                                  document.getElementById(`question-card-${q.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-2xl text-[11px] font-extrabold text-left transition-all border border-gray-200/60 bg-white hover:border-primary/50 text-gray-700 hover:text-primary active:scale-95 shrink-0 whitespace-nowrap shadow-sm hover:shadow-md cursor-pointer"
                              >
                                <span className="w-5 h-5 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shrink-0">
                                  {idx + 1}
                                </span>
                                <span className="truncate max-w-[120px] lg:max-w-none">
                                  {q.title.trim() || `Question ${idx + 1}`}
                                </span>
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={addQuestion}
                            className="w-full mt-2 bg-white hover:bg-primary/5 text-primary font-black py-2.5 rounded-2xl text-[11px] border border-primary/20 flex items-center justify-center gap-1 active:scale-95 transition-all shadow-sm cursor-pointer"
                          >
                            <Plus size={12} /> Nouvelle Question
                          </button>
                        </div>

                        {/* Côté droit : Formulaires des questions */}
                        <div className="lg:col-span-3 space-y-6">
                          {questions.map((q, idx) => {
                            // Define alternating color accents for cards to make them pop!
                            const accentColors = [
                              "border-t-primary shadow-primary/5 hover:border-primary/40",
                              "border-t-secondary shadow-secondary/5 hover:border-secondary/40",
                              "border-t-pink-500 shadow-pink-500/5 hover:border-pink-500/40"
                            ];
                            const accentClass = accentColors[idx % accentColors.length];

                            return (
                              <div 
                                key={q.id} 
                                id={`question-card-${q.id}`} 
                                className={cn(
                                  "p-6 rounded-[28px] bg-white border-2 border-gray-100 border-t-[6px] shadow-soft relative space-y-5 scroll-mt-24 transition-all duration-300",
                                  accentClass
                                )}
                              >
                                <button 
                                  onClick={() => deleteQuestion(q.id)}
                                  disabled={questions.length <= 1}
                                  className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 disabled:opacity-30 cursor-pointer transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-black text-primary block uppercase">Question {idx + 1}</span>
                                    <input 
                                      type="text"
                                      value={q.title}
                                      onChange={(e) => updateQuestionFields(q.id, { title: e.target.value })}
                                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:bg-white focus:border-primary transition-all outline-none"
                                      placeholder="Intitulé de la question..."
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-400 block uppercase">Invite de vote</span>
                                    <input 
                                      type="text"
                                      value={q.voteQuestion}
                                      onChange={(e) => updateQuestionFields(q.id, { voteQuestion: e.target.value })}
                                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:bg-white focus:border-primary transition-all outline-none"
                                      placeholder="Ex: Qui préfères-tu ?"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide">Options de réponse (2 min, 4 max)</span>
                                    <button 
                                      onClick={() => addOption(q.id)} 
                                      disabled={q.options.length >= 4} 
                                      className="text-[10px] font-black uppercase text-primary hover:underline disabled:opacity-30"
                                    >
                                      + Ajouter Option
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {q.options.map((opt) => (
                                      <div key={opt.id} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col gap-3 relative hover:bg-white hover:border-primary/20 transition-all duration-300">
                                        <button onClick={() => deleteOption(q.id, opt.id)} disabled={q.options.length <= 2} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 disabled:opacity-20 cursor-pointer transition-colors">
                                          <Trash2 size={12} />
                                        </button>
                                        
                                        <div className="space-y-1">
                                          <span className="text-[9px] text-gray-400 font-bold block">Texte de l&apos;option</span>
                                          <input 
                                            type="text"
                                            value={opt.text}
                                            onChange={(e) => updateOptionText(opt.id, e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:border-primary outline-none"
                                            placeholder="Texte..."
                                          />
                                        </div>

                                        <div className="space-y-2 border-t border-gray-100 pt-2">
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200/50">
                                              {uploadingForOptionId === opt.id ? (
                                                <span className="text-[9px] font-black text-primary">{uploadProgressForOption}%</span>
                                              ) : opt.pokemonId ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${opt.pokemonId}.png`} alt="" className="object-contain w-full h-full" />
                                              ) : opt.imageUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={opt.imageUrl} alt="" className="object-cover w-full h-full" />
                                              ) : (
                                                <ImageIcon className="text-gray-300" size={14} />
                                              )}
                                            </div>

                                            <div className="flex-1">
                                              {categoryId === "pokemon" ? (
                                                <input
                                                  type="number"
                                                  placeholder="N° Pokemon ID"
                                                  value={opt.pokemonId || ""}
                                                  onChange={(e) => updateOptionPokemonId(opt.id, e.target.value)}
                                                  className="w-full bg-white border border-gray-200 rounded px-1.5 py-1 text-[10px] font-bold"
                                                />
                                              ) : (
                                                <div className="flex flex-col gap-1 w-full">
                                                  <div className="flex gap-1.5 items-center">
                                                    <button 
                                                      type="button" 
                                                      onClick={() => {
                                                        const input = document.getElementById(`file-input-${opt.id}`);
                                                        input?.click();
                                                      }} 
                                                      className="bg-primary/5 text-primary text-[8px] font-black px-2 py-0.5 rounded border border-primary/10 cursor-pointer hover:bg-primary/10"
                                                    >
                                                      Uploader
                                                    </button>
                                                    <input 
                                                      type="file" 
                                                      id={`file-input-${opt.id}`} 
                                                      className="hidden" 
                                                      accept="image/*" 
                                                      onChange={(e) => handleRealFileChange(e, opt.id)} 
                                                    />
                                                    <button 
                                                      type="button" 
                                                      onClick={() => triggerSimulatedUpload(opt.id)} 
                                                      className="bg-gray-50 text-gray-500 text-[8px] font-bold px-1.5 py-0.5 rounded border border-gray-200/60 cursor-pointer hover:bg-gray-100"
                                                    >
                                                      Démo
                                                    </button>
                                                  </div>
                                                  <input 
                                                    type="text"
                                                    placeholder="Ou URL image..."
                                                    value={opt.imageUrl || ""}
                                                    onChange={(e) => updateOptionImage(opt.id, e.target.value)}
                                                    className="w-full bg-white border border-gray-200 rounded px-1.5 py-0.5 text-[8px]"
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-soft">
                      <button onClick={() => setActiveStep(1)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold px-6 py-3 rounded-xl text-xs cursor-pointer">
                        Retour
                      </button>
                      <button onClick={handleNextStep} className="bg-primary hover:bg-primary-dark text-white font-extrabold px-8 py-3 rounded-xl text-xs shadow-md cursor-pointer">
                        Continuer
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: DEPLOYMENT */}
                {activeStep === 3 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-soft space-y-6">
                      <div className="border-b border-gray-100 pb-4">
                        <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                          <Eye className="text-primary" /> Étape 3 : Aperçu en Direct et Publication
                        </h3>
                      </div>
                      
                      {/* Step 3: Deployment card preview matching user dashboard card */}
                      <div className="flex justify-center p-6 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        {(() => {
                          const cat = categoriesList.find((c) => c.id === categoryId);
                          const isDarkBg = selectedTheme.bgClass && !selectedTheme.bgClass.includes("bg-white") && !selectedTheme.bgClass.includes("border-gray");
                          return (
                            <div className="w-80">
                              <div
                                className={cn(
                                  "p-6 rounded-[32px] border shadow-soft flex flex-col justify-between min-h-[220px] transition-all hover:shadow-float duration-300 relative overflow-hidden group w-full text-left",
                                  selectedTheme.bgClass || "bg-white border-gray-100"
                                )}
                              >
                                {/* Background image preview */}
                                {quizCoverUrl ? (
                                  <div className="absolute right-0 bottom-0 w-28 h-28 opacity-25 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={quizCoverUrl} alt="" className="w-full h-full object-contain object-bottom-right" />
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
                                  
                                  <div
                                    className={cn(
                                      "px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md shrink-0 flex items-center gap-1 cursor-default select-none",
                                      isDarkBg 
                                        ? "bg-white text-gray-900" 
                                        : "bg-primary text-white"
                                    )}
                                  >
                                    <Play size={10} className="fill-current" />
                                    <span>Jouer</span>
                                  </div>
                                </div>

                                {/* Header */}
                                <div className="space-y-1.5 mt-3 relative z-10">
                                  <h4 className={cn(
                                    "font-extrabold text-lg leading-tight pr-28 text-balance",
                                    isDarkBg ? "text-white" : "text-gray-800"
                                  )}>
                                    {formatFrenchTypography(title || "Nouveau Quiz")}
                                  </h4>
                                  <p className={cn(
                                    "text-xs leading-normal line-clamp-3 pr-28 text-balance",
                                    isDarkBg ? "text-white/80" : "text-gray-400"
                                  )}>
                                    {formatFrenchTypography(tagline || "Le slogan...")}
                                  </p>
                                </div>

                                {/* Actions & info */}
                                <div className="relative z-10 pt-4 mt-4 flex items-center justify-between gap-2">
                                  <div className={cn(
                                    "flex flex-wrap items-center gap-2 text-[9px] font-bold",
                                    isDarkBg ? "text-white/70" : "text-gray-400"
                                  )}>
                                    <span className="flex items-center gap-0.5"><Clock size={10} /> {duration || "5 min"}</span>
                                    <span>•</span>
                                    <span>{difficulty || "Moyen"}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-0.5"><Users size={10} /> 0</span>
                                  </div>
                                  
                                  {/* Spacer to prevent metadata text wrapping/overlapping the bottom-right image/emoji */}
                                  <div className="w-20 shrink-0 pointer-events-none" />
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-soft">
                      <button onClick={() => setActiveStep(2)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold px-6 py-3 rounded-xl text-xs cursor-pointer">
                        Retour
                      </button>
                      <button 
                        onClick={handlePublish}
                        disabled={saveSuccess}
                        className={cn("font-black px-8 py-3.5 rounded-xl text-xs text-white", saveSuccess ? "bg-emerald-600" : "bg-primary hover:bg-primary-dark")}
                      >
                        {saveSuccess ? "Publié avec succès !" : "Mettre en ligne 🚀"}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              // Quiz Manager List & Statistics View
              <div className="space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">Gestion des Quiz</h2>
                    <p className="text-gray-400 font-semibold text-xs mt-0.5">Suivi de la complétion et édition des quiz de l&apos;application.</p>
                  </div>
                  <button 
                    onClick={() => {
                      loadBlankTemplate();
                      setIsCreatingNewQuiz(true);
                    }}
                    className="bg-primary hover:bg-primary-dark text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus size={14} /> Créer un nouveau quiz
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-soft lg:col-span-2 space-y-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide block">Liste des Quiz ({quizStats.length})</span>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-black tracking-wider uppercase text-[9px] bg-gray-50/50">
                            <th className="py-2.5 px-3 rounded-l-xl">Quiz</th>
                            <th className="py-2.5 px-3">Statut</th>
                            <th className="py-2.5 px-3">Date</th>
                            <th className="py-2.5 px-3">Participants</th>
                            <th className="py-2.5 px-3">Complétion</th>
                            <th className="py-2.5 px-3">T. Moyen</th>
                            <th className="py-2.5 px-3 rounded-r-xl">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-bold text-gray-700">
                          {quizStats.map((quiz) => (
                            <tr 
                              key={quiz.id}
                              onClick={() => setSelectedQuizStats(quiz)}
                              className={cn(
                                "hover:bg-gray-50/50 cursor-pointer transition-colors",
                                selectedQuizStats?.id === quiz.id ? "bg-primary/5" : ""
                              )}
                            >
                              <td className="py-3 px-3 font-black text-gray-900">{quiz.title}</td>
                              <td className="py-3 px-3">
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-[9px] font-black uppercase border",
                                  quiz.status === "Publié" ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-amber-50 border-amber-100 text-amber-800"
                                )}>
                                  {quiz.status}
                                </span>
                              </td>
                              <td className="py-3 px-3">{quiz.date}</td>
                              <td className="py-3 px-3">{quiz.starts}</td>
                              <td className="py-3 px-3 text-emerald-600">{quiz.completionRate}%</td>
                              <td className="py-3 px-3">{quiz.avgTime}</td>
                              <td className="py-3 px-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <button 
                                  onClick={() => handleEditQuizClick(quiz)}
                                  className="p-1 hover:bg-gray-100 rounded-lg text-primary transition-colors cursor-pointer"
                                  title="Modifier"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                </button>
                                <button 
                                  onClick={() => handleDuplicateQuiz(quiz)}
                                  className="p-1 hover:bg-gray-100 rounded-lg text-indigo-600 transition-colors cursor-pointer"
                                  title="Dupliquer"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>
                                </button>
                                <button 
                                  onClick={() => {
                                    setQuizActionConfirm({ type: "delete", quizId: quiz.id, title: quiz.title });
                                  }}
                                  className="p-1 hover:bg-red-50 rounded-lg text-red-500 transition-colors cursor-pointer"
                                  title="Supprimer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft space-y-6">
                    <div className="pb-3 border-b border-gray-100">
                      <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">
                        {selectedQuizStats && selectedDetailTab === "summary" ? "Résumé du Quiz" : "Statistiques de performance"}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-semibold">
                        {selectedQuizStats && selectedDetailTab === "summary" 
                          ? "Fiche technique, description et structure des questions." 
                          : "Taux de complétion et abandons par question."}
                      </p>
                    </div>

                    {selectedQuizStats ? (
                      <div className="space-y-6">
                        
                        {/* Tab Selector */}
                        <div className="flex gap-1.5 p-1 bg-gray-50 border border-gray-100 rounded-2xl">
                          <button
                            type="button"
                            onClick={() => setSelectedDetailTab("stats")}
                            className={cn(
                              "flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                              selectedDetailTab === "stats" 
                                ? "bg-white text-gray-900 shadow-soft" 
                                : "text-gray-400 hover:text-gray-600"
                            )}
                          >
                            Statistiques
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedDetailTab("summary")}
                            className={cn(
                              "flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                              selectedDetailTab === "summary" 
                                ? "bg-white text-gray-900 shadow-soft" 
                                : "text-gray-400 hover:text-gray-600"
                            )}
                          >
                            Résumé Global
                          </button>
                        </div>

                        {selectedDetailTab === "summary" ? (
                          <div className="space-y-5 animate-in fade-in duration-300">
                            {/* Miniature Quiz Card Preview */}
                            {(() => {
                              const local = localStorage.getItem("custom-quizzes");
                              const parsed = local ? JSON.parse(local) : [];
                              const foundQuiz = [...mockQuizzes, ...parsed].find(q => q.id === selectedQuizStats.id);
                              const cat = categoriesList.find(c => c.id === foundQuiz?.categoryId);

                              return (
                                <>
                                  <div className="space-y-2">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Aperçu de la carte :</span>
                                    <div className={cn(
                                      "p-5 rounded-3xl border shadow-soft flex flex-col justify-between min-h-[140px] relative overflow-hidden text-white",
                                      foundQuiz?.cardBgClass || "bg-gradient-to-br from-indigo-600 to-purple-700"
                                    )}>
                                      {foundQuiz?.imageUrl ? (
                                        <div className="absolute right-0 bottom-0 w-24 h-24 opacity-35 pointer-events-none">
                                          <img src={foundQuiz.imageUrl} alt="" className="w-full h-full object-contain object-bottom-right" />
                                        </div>
                                      ) : (
                                        <div className="absolute right-2 bottom-2 text-6xl opacity-25">{cat?.emoji || "🍿"}</div>
                                      )}
                                      <div className="relative z-10 space-y-1">
                                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-md inline-block">
                                          {cat?.title || "Quiz"}
                                        </span>
                                        <h4 className="font-extrabold text-sm leading-tight text-white">{foundQuiz?.title || selectedQuizStats.title}</h4>
                                        <p className="text-[10px] text-white/80 leading-normal line-clamp-2">{foundQuiz?.tagline || ""}</p>
                                      </div>
                                      <div className="relative z-10 border-t border-white/10 pt-2 text-[9px] font-bold flex justify-between text-white/70">
                                        <span>{foundQuiz?.estimatedDuration || "5 min"}</span>
                                        <span>{foundQuiz?.difficulty || "Moyen"}</span>
                                        <span>{selectedQuizStats.dropOffDetail.length} questions</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Metadata List */}
                                  <div className="space-y-2 pt-2 border-t border-gray-100">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Fiche Technique :</span>
                                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-600">
                                      <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100/50">
                                        <span className="text-[8px] font-black text-gray-400 uppercase block">Catégorie</span>
                                        <span className="text-gray-900">{cat?.emoji} {cat?.title || "Inconnue"}</span>
                                      </div>
                                      <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100/50">
                                        <span className="text-[8px] font-black text-gray-400 uppercase block">Difficulté</span>
                                        <span className="text-gray-900">{foundQuiz?.difficulty || "Moyen"}</span>
                                      </div>
                                      <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100/50">
                                        <span className="text-[8px] font-black text-gray-400 uppercase block">Durée Estimée</span>
                                        <span className="text-gray-900">{foundQuiz?.estimatedDuration || "5 min"}</span>
                                      </div>
                                      <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100/50">
                                        <span className="text-[8px] font-black text-gray-400 uppercase block">Badge Récompense</span>
                                        <span className="text-gray-900 truncate block">{foundQuiz?.badgeReward || "Aucun"}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Description */}
                                  <div className="space-y-1.5 pt-2 border-t border-gray-100">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Description longue :</span>
                                    <p className="text-[10px] leading-relaxed text-gray-500 bg-gray-50 p-3 rounded-2xl border border-gray-100/50">
                                      {foundQuiz?.description || "Aucune description fournie."}
                                    </p>
                                  </div>

                                  {/* Structure des Questions */}
                                  <div className="space-y-3 pt-2 border-t border-gray-100">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Questions & Options ({selectedQuizStats.dropOffDetail.length}) :</span>
                                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                                      {selectedQuizStats.dropOffDetail.map((item, idx) => (
                                        <div key={idx} className="p-3 bg-gray-50 rounded-2xl border border-gray-100/50 space-y-2">
                                          <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black text-primary uppercase">Question {idx + 1}</span>
                                          </div>
                                          <div className="text-[10px] font-black text-gray-800 leading-tight">{item.title}</div>
                                          
                                          <div className="space-y-1 pt-1.5">
                                            {Object.entries(item.distribution).map(([optName, pct]) => (
                                              <div key={optName} className="flex justify-between items-center text-[10px] font-bold text-gray-600 bg-white px-2 py-1.5 rounded-lg border border-gray-100">
                                                <span>{optName}</span>
                                                <span className="text-primary text-[9px] font-black">{pct}%</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        ) : (
                          <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="space-y-1.5">
                              <h4 className="text-base font-black text-gray-900">{selectedQuizStats.title}</h4>
                              <span className="text-[10px] text-gray-400 font-bold block">Publié le {selectedQuizStats.date} • {selectedQuizStats.shares} partages</span>
                            </div>

                            <div className="space-y-3">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide block">Abandon par question :</span>
                              <div className="space-y-2">
                                {selectedQuizStats.dropOffDetail.map((item, idx) => {
                                  const pctRemaining = selectedQuizStats.dropOff[idx] || 100;
                                  return (
                                    <div key={idx} className="space-y-1">
                                      <div className="flex justify-between text-[10px] font-bold text-gray-600">
                                        <span>{item.question} : <span className="text-gray-900">{item.title}</span></span>
                                        <span>{pctRemaining}% restants</span>
                                      </div>
                                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div 
                                          className="bg-primary h-full rounded-full transition-all duration-500" 
                                          style={{ width: `${pctRemaining}%` }}
                                        />
                                      </div>
                                      <div className="flex justify-between text-[8px] font-bold text-gray-400">
                                        <span>Réponses : {item.answers}</span>
                                        <span className="text-rose-500">Abandon après Q : {item.dropAfter}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="space-y-4 pt-3 border-t border-gray-100">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide block">Résultats détaillés des votes :</span>
                              
                              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                                {selectedQuizStats.dropOffDetail.map((item, idx) => (
                                  <div key={idx} className="p-3 bg-gray-50 rounded-2xl border border-gray-100/50 space-y-2">
                                    <span className="text-[9px] font-black text-primary uppercase">{item.question}</span>
                                    <div className="text-[10px] font-black text-gray-800 leading-tight">{item.title}</div>
                                    <div className="text-[9px] font-bold text-gray-500">Top : <span className="text-gray-900 font-black">{item.top}</span></div>
                                    
                                    <div className="space-y-1.5 pt-1">
                                      {Object.entries(item.distribution).map(([opt, pct]) => (
                                        <div key={opt} className="text-[9px]">
                                          <div className="flex justify-between font-bold text-gray-600">
                                            <span>{opt}</span>
                                            <span>{pct}%</span>
                                          </div>
                                          <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-gray-100">
                                            <div className="bg-primary h-full rounded-full" style={{ width: `${pct}%` }} />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="text-[8px] font-bold text-gray-400 flex justify-between pt-1 border-t border-gray-200/40">
                                      <span>Temps de rép. : {item.time}</span>
                                      <span>Abandon : {item.dropAfter}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    ) : (
                      <p className="text-[11px] text-center text-gray-400 py-8">Sélectionne un quiz dans la liste de gauche pour consulter ses abandons et ses statistiques.</p>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* QUIZ CONFIRMATION OVERLAY MODAL */}
            {quizActionConfirm && (
              <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white p-6 rounded-[32px] max-w-sm w-full space-y-4 border border-gray-100 shadow-xl">
                  <div className="flex items-center gap-3 text-rose-600">
                    <AlertTriangle size={24} />
                    <h4 className="text-sm font-black uppercase tracking-wider">Supprimer le Quiz</h4>
                  </div>
                  <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                    Es-tu sûr de vouloir supprimer définitivement le quiz <span className="font-extrabold text-gray-800">"{quizActionConfirm.title}"</span> ? Cette action est irréversible et retirera immédiatement le quiz du site public.
                  </p>
                  <div className="flex gap-2.5 pt-2">
                    <button
                      onClick={() => handleDeleteQuiz(quizActionConfirm.quizId)}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs cursor-pointer active:scale-95 transition-all flex-1"
                    >
                      Oui, supprimer
                    </button>
                    <button
                      onClick={() => setQuizActionConfirm(null)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold px-4 py-2.5 rounded-xl text-xs cursor-pointer active:scale-95 transition-all flex-1"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 4. STATISTIQUES SECTION (STATS TAB) */}
        {activeTab === "stats" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">Statistiques Globales</h2>
                <p className="text-gray-400 font-semibold text-xs mt-0.5">Analyses consolidées et performances des abandons.</p>
              </div>
              <button 
                onClick={() => handleCSVExport("quizzes")}
                className="bg-white hover:bg-gray-50 text-gray-700 font-extrabold px-4 py-2.5 rounded-2xl text-xs border border-gray-200 shadow-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Download size={14} /> Exporter Rapport Quiz
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft space-y-4">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Taux de complétion et Abandon Moyen</h3>
                <p className="text-[10px] text-gray-400 font-semibold">Taux moyen d&apos;abandons enregistré question après question.</p>
                
                <div className="space-y-3.5 pt-2">
                  {[
                    { label: "Question 1 (Engagement)", pct: "100%", drop: "0% d'abandon" },
                    { label: "Question 2 (Début)", pct: "94.5%", drop: "5.5% d'abandon" },
                    { label: "Question 3 (Milieu)", pct: "88.3%", drop: "6.2% d'abandon" },
                    { label: "Question 4 (Fin)", pct: "77.5%", drop: "10.8% d'abandon" },
                    { label: "Question 5 (Terminé)", pct: "74.0%", drop: "3.5% d'abandon" }
                  ].map((step, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-600">{step.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-700">{step.pct}</span>
                        <span className="text-rose-500 text-[10px]">{step.drop}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft space-y-4">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Durée moyenne et engagement</h3>
                <p className="text-[10px] text-gray-400 font-semibold">Temps passé par partie et engagement général.</p>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-bold">Temps moyen de réponse :</span>
                    <span className="text-gray-800 font-black">9.8 secondes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-bold">Temps moyen par session :</span>
                    <span className="text-gray-800 font-black">1 min 42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-bold">Partages par partie :</span>
                    <span className="text-gray-800 font-black">15.5 % des joueurs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-bold">Nouveaux abonnés :</span>
                    <span className="text-emerald-600 font-black">+14.2 % / mois</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
        
        {/* 5. ADMINISTRATION DES CATÉGORIES SECTION (CATEGORIES TAB) */}
        {activeTab === "categories" && (
          <div className="space-y-6 animate-in fade-in duration-700">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">Administration des Catégories</h2>
              <p className="text-gray-400 font-semibold text-xs mt-0.5">Personnalise les thèmes, titres, logos et descriptions des catégories de quiz.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left pane: Category Grid */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft space-y-4">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Sélectionne une catégorie</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categoriesList.map((cat) => {
                      const isSelected = selectedCategoryToEdit?.id === cat.id;
                      const theme = getCategoryUnselectedTheme(cat.colorClass);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => selectCategoryForEditing(cat)}
                          className={cn(
                            "p-5 rounded-3xl border text-left transition-all duration-300 relative overflow-hidden group cursor-pointer w-full flex flex-col justify-between min-h-[130px] hover:shadow-float",
                            theme.bg,
                            theme.hoverBg,
                            isSelected 
                              ? "border-primary ring-2 ring-primary/20 shadow-md" 
                              : theme.border
                          )}
                        >
                          <div className="flex justify-between items-start w-full relative z-10">
                            <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                              {cat.emoji || "❓"}
                            </span>
                            <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full border", theme.pill)}>
                              {cat.id}
                            </span>
                          </div>
                          
                          <div className="mt-4 relative z-10">
                            <h4 className={cn("font-extrabold text-sm", theme.title)}>{cat.title}</h4>
                            <p className={cn("text-[10px] line-clamp-1 mt-1 font-semibold", theme.desc)}>
                              {cat.description || "Aucune description renseignée."}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right pane: Customization Form */}
              <div className="lg:col-span-7">
                {selectedCategoryToEdit ? (
                  <form onSubmit={handleSaveCategory} className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-soft space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest block">Configuration en direct</span>
                        <h3 className="text-lg font-black text-gray-800">
                          Modifier la catégorie <span className="text-primary">{selectedCategoryToEdit.title}</span>
                        </h3>
                      </div>
                      <span className="text-4xl">{catEmoji || "❓"}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Nom de la catégorie</label>
                        <input
                          type="text"
                          required
                          value={catTitle}
                          onChange={(e) => setCatTitle(e.target.value)}
                          className="w-full bg-surface-muted border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:border-primary transition-all"
                          placeholder="Ex: Pokémon, Cinéma..."
                        />
                      </div>

                      {/* Emoji */}
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Logo (Emoji)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            maxLength={4}
                            value={catEmoji}
                            onChange={(e) => setCatEmoji(e.target.value)}
                            className="w-20 bg-surface-muted border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-center text-gray-700 outline-none focus:border-primary transition-all"
                            placeholder="🍿"
                          />
                          <div className="flex gap-1.5 items-center overflow-x-auto py-1">
                            {["🍿", "🎮", "⚡️", "🎬", "📺", "👥", "🍳", "🧠", "🔮", "🌍"].map((emoji) => (
                              <button
                                type="button"
                                key={emoji}
                                onClick={() => setCatEmoji(emoji)}
                                className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-150 flex items-center justify-center text-sm hover:scale-110 active:scale-95 transition-all cursor-pointer"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">
                        Texte de présentation / Description
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={catDescription}
                        onChange={(e) => setCatDescription(e.target.value)}
                        className="w-full bg-surface-muted border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-primary transition-all resize-none leading-relaxed"
                        placeholder="Saisis la description complète qui s'affichera lors du clic sur la catégorie..."
                      />
                    </div>

                    {/* Color Theme Selector */}
                    <div className="space-y-3">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Thème de couleur</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {COLOR_PRESETS.map((preset) => {
                          const isPresetActive = catColorClass === preset.colorClass;
                          return (
                            <button
                              type="button"
                              key={preset.name}
                              onClick={() => {
                                setCatColorClass(preset.colorClass);
                                setCatGradientClass(preset.gradientClass);
                              }}
                              className={cn(
                                "flex items-center gap-2 p-2.5 rounded-2xl border text-left transition-all cursor-pointer",
                                isPresetActive
                                  ? "border-primary bg-primary/5 font-extrabold text-primary"
                                  : "border-gray-100 hover:bg-gray-50 text-gray-500 font-semibold"
                              )}
                            >
                              <span className={cn("w-4 h-4 rounded-full shadow-sm shrink-0", preset.colorClass)}></span>
                              <span className="text-[10px] tracking-tight truncate">{preset.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Live Preview Block */}
                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Aperçu en direct (Dashboard & Page de catégorie)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-3xl border border-gray-150">
                        {/* Dashboard card preview */}
                        <div className="space-y-2">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Bulle du Dashboard :</span>
                          <div className={cn("h-[140px] rounded-3xl p-5 shadow-soft border border-gray-100 flex flex-col justify-between relative overflow-hidden bg-white text-left select-none")}>
                            <div className={cn("absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-20", catColorClass)}></div>
                            <div className="flex justify-between items-start">
                              <span className="text-3xl">{catEmoji || "❓"}</span>
                            </div>
                            <h4 className="font-extrabold text-gray-800 text-sm relative z-10">{catTitle || "Titre..."}</h4>
                          </div>
                        </div>

                        {/* Category Header Preview */}
                        <div className="space-y-2">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">En-tête de catégorie :</span>
                          <div className="h-[140px] rounded-3xl p-4 shadow-soft border border-gray-100 bg-white flex flex-col justify-center gap-2 overflow-hidden text-left select-none relative">
                            <div className={cn("absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl opacity-15", catColorClass)}></div>
                            <div className="flex items-center gap-3 relative z-10">
                              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-155 flex items-center justify-center text-lg shadow-sm">
                                {catEmoji || "❓"}
                              </div>
                              <h4 className="font-extrabold text-gray-800 text-xs truncate max-w-[120px]">{catTitle || "Titre..."}</h4>
                            </div>
                            <p className="text-gray-400 text-[9px] line-clamp-3 leading-relaxed relative z-10 mt-1">
                              {catDescription || "Description..."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => selectCategoryForEditing(selectedCategoryToEdit)}
                        className="text-gray-400 hover:text-gray-600 text-xs font-black uppercase tracking-wider cursor-pointer"
                      >
                        Réinitialiser
                      </button>

                      <div className="flex items-center gap-3">
                        {categorySaveSuccess && (
                          <span className="text-emerald-600 text-xs font-bold animate-pulse">
                            Enregistré avec succès ! ✨
                          </span>
                        )}
                        <button
                          type="submit"
                          className="bg-primary hover:bg-primary-dark text-white font-extrabold px-6 py-3 rounded-full text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          Enregistrer les modifications
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-soft h-full min-h-[350px] flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-gray-50 border border-gray-150 flex items-center justify-center text-3xl shadow-sm">
                      🛠️
                    </div>
                    <div className="space-y-1 max-w-sm">
                      <h4 className="font-extrabold text-gray-800 text-sm">Aucune catégorie sélectionnée</h4>
                      <p className="text-gray-400 text-xs font-semibold leading-relaxed">
                        Choisis une catégorie à gauche pour commencer à personnaliser ses logos, thèmes colorés, et textes de présentation.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 6. AVATARS PAR DÉFAUT (AVATARS TAB) */}
        {activeTab === "avatars" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">Avatars de profil par défaut 🎨</h2>
                <p className="text-gray-400 font-semibold text-xs mt-0.5">
                  Gère la liste des avatars proposés aux nouveaux utilisateurs lors de leur première connexion.
                </p>
              </div>
              <button 
                onClick={() => {
                  setEditingAvatar(null);
                  setAvatarName("");
                  setAvatarUrl("");
                  setAvatarReqLevel(1);
                  setIsAddingAvatar(true);
                }}
                className="bg-primary hover:bg-primary-dark text-white font-extrabold px-5 py-3 rounded-2xl text-xs shadow-md shadow-primary/20 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Plus size={16} /> Ajouter un Avatar
              </button>
            </div>

            {/* Avatars Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {adminAvatars.map((avatar) => (
                <div key={avatar.id} className="bg-white p-4 rounded-[28px] border border-gray-100 shadow-soft flex flex-col items-center justify-between space-y-3 relative group hover:shadow-float transition-all">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-50 border border-gray-150 p-1 flex items-center justify-center shrink-0">
                    <img src={avatar.url} alt={avatar.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-extrabold text-sm text-gray-800">{avatar.name}</h4>
                    <span className="text-[10px] font-bold text-gray-400 block mt-0.5">Niveau déblocage : {avatar.requiredLevel}</span>
                  </div>
                  <div className="flex items-center gap-2 w-full pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setEditingAvatar(avatar);
                        setAvatarName(avatar.name);
                        setAvatarUrl(avatar.url);
                        setAvatarReqLevel(avatar.requiredLevel);
                        setIsAddingAvatar(true);
                      }}
                      className="flex-1 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-extrabold text-[10px] rounded-xl border border-gray-200 transition-all"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        const updated = adminAvatars.filter(a => a.id !== avatar.id);
                        setAdminAvatars(updated);
                        saveAvatars(updated);
                      }}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add/Edit Avatar Modal */}
            {isAddingAvatar && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-float max-w-md w-full p-6 space-y-6 relative animate-in fade-in zoom-in-95">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-gray-800">
                      {editingAvatar ? "Modifier l'Avatar" : "Ajouter un nouvel Avatar"}
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold">
                      Renseigne l&apos;URL de l&apos;illustration et le niveau minimum requis.
                    </p>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!avatarName.trim() || !avatarUrl.trim()) return;

                    let updated: AvatarItem[];
                    if (editingAvatar) {
                      updated = adminAvatars.map(a => a.id === editingAvatar.id ? { ...a, name: avatarName.trim(), url: avatarUrl.trim(), requiredLevel: avatarReqLevel } : a);
                    } else {
                      const newAv: AvatarItem = {
                        id: `avatar-${Date.now()}`,
                        name: avatarName.trim(),
                        url: avatarUrl.trim(),
                        requiredLevel: avatarReqLevel,
                        bgClass: "bg-purple-50/70 border-purple-100"
                      };
                      updated = [...adminAvatars, newAv];
                    }

                    setAdminAvatars(updated);
                    saveAvatars(updated);
                    setIsAddingAvatar(false);
                  }} className="space-y-4">

                    {/* Hidden file input */}
                    <input 
                      type="file" 
                      ref={avatarFileInputRef} 
                      onChange={handleAvatarFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />

                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Nom de l&apos;Avatar</label>
                      <input 
                        type="text" 
                        required 
                        value={avatarName} 
                        onChange={(e) => setAvatarName(e.target.value)} 
                        placeholder="Ex: Lucario, Rondoudou..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-primary"
                      />
                    </div>

                    {/* Image Upload from Device */}
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Illustration de l&apos;Avatar</label>
                      
                      <button
                        type="button"
                        onClick={() => avatarFileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-white text-primary flex items-center justify-center transition-all">
                          <Upload size={18} />
                        </div>
                        <div className="text-center">
                          <span className="text-xs font-black text-primary block">Choisir un fichier depuis mon appareil 📱/💻</span>
                          <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">Glisser-déposer ou cliquer pour parcourir (PNG, WEBP, SVG)</span>
                        </div>
                      </button>
                    </div>

                    {/* Optional URL Input */}
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Ou coller une URL d&apos;image</label>
                      <input 
                        type="text" 
                        value={avatarUrl} 
                        onChange={(e) => setAvatarUrl(e.target.value)} 
                        placeholder="https://..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Niveau requis pour débloquer</label>
                      <input 
                        type="number" 
                        min={1} 
                        max={50} 
                        value={avatarReqLevel} 
                        onChange={(e) => setAvatarReqLevel(parseInt(e.target.value) || 1)} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-primary"
                      />
                    </div>

                    {avatarUrl && (
                      <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-full overflow-hidden border bg-white p-1 shrink-0 flex items-center justify-center">
                            <img src={avatarUrl} alt="Aperçu" className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-gray-800 block">Aperçu de l&apos;image</span>
                            <span className="text-[9px] text-emerald-600 font-bold block">✓ Image chargée avec succès</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAvatarUrl("")}
                          className="text-gray-400 hover:text-rose-500 text-xs font-bold p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setIsAddingAvatar(false)}
                        className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={!avatarName.trim() || !avatarUrl.trim()}
                        className="bg-primary hover:bg-primary-dark text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <OnboardingCinematicModal
        isOpen={isAdminCinematicOpen}
        onClose={() => setIsAdminCinematicOpen(false)}
        isAdminPreview={true}
      />
    </div>
  );
}
