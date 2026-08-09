"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ChevronLeft, 
  Award, 
  ArrowRight, 
  RefreshCw, 
  Flame, 
  Share2, 
  TrendingUp, 
  AlertCircle 
} from "lucide-react";
import { mockQuizzes, Quiz } from "@/lib/mockData";
import { cn } from "@/lib/utils";

import { quizQuestions, QuizQuestion } from "@/lib/quizQuestions";
import { useEffect } from "react";
import { fetchQuizQuestions, submitVote, fetchQuizzes } from "@/lib/supabase/data";
import { useAuth } from "@/components/auth/AuthProvider";

export default function QuizPlayPage() {
  const params = useParams();
  const quizId = params.id as string;
  const { user } = useAuth();

  // Game States
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [step, setStep] = useState<"vote" | "reveal">("vote");
  const [userVote, setUserVote] = useState<string | null>(null);

  // Score stats
  const [scorePoints, setScorePoints] = useState(0);
  const [predictionsCorrect, setPredictionsCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  
  // Game over state
  const [isGameOver, setIsGameOver] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function initQuiz() {
      // 1. Get Quiz
      const dbQuizzes = await fetchQuizzes();
      const foundQuiz = dbQuizzes.find((q) => q.id === quizId);
      if (foundQuiz) {
        setQuiz(foundQuiz);
      } else {
        const deletedIds = JSON.parse(localStorage.getItem("deleted-quiz-ids") || "[]");
        const localQuizzes = localStorage.getItem("custom-quizzes");
        const parsedQuizzes = localQuizzes ? JSON.parse(localQuizzes) : [];
        const mergedQuizzes = [...mockQuizzes, ...parsedQuizzes].filter((q) => !deletedIds.includes(q.id));
        setQuiz(mergedQuizzes.find((q) => q.id === quizId) || mergedQuizzes[0]);
      }

      // 2. Get Questions from Supabase
      const dbQuestions = await fetchQuizQuestions(quizId);
      if (dbQuestions && dbQuestions.length > 0) {
        setQuestions(dbQuestions);
      } else {
        const localQuestions = localStorage.getItem("custom-questions");
        const parsedQuestions = localQuestions ? JSON.parse(localQuestions) : {};
        const mergedQuestions = { ...quizQuestions, ...parsedQuestions };
        setQuestions(mergedQuestions[quizId] || mergedQuestions["pokemon-gen1"]);
      }
    }

    initQuiz();
  }, [quizId]);

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Helper to fetch PokeAPI official artwork
  const getPokemonImageUrl = (pokemonId: number) => {
    if (pokemonId === 906) {
      return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/906.png";
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  };

  // Find majority option
  const getMajorityOption = (q: QuizQuestion) => {
    return q.options.reduce((max, option) => option.percentage > max.percentage ? option : max, q.options[0]);
  };

  const majorityOption = getMajorityOption(currentQuestion);
  const isCorrectGuess = userVote === majorityOption.id;

  const handleVoteSelect = (optionId: string) => {
    if (step !== "vote") return;
    setUserVote(optionId);

    if (currentQuestion && (currentQuestion as any).dbId) {
      submitVote(user?.id || null, quizId, (currentQuestion as any).dbId, optionId);
    }

    // Calculate if they guessed the majority (France's opinion)
    const isCorrect = optionId === majorityOption.id;
    if (isCorrect) {
      setPredictionsCorrect((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak);
      }
      setScorePoints((prev) => prev + 20); // 20 PI per correct guess
    } else {
      setStreak(0);
    }

    setStep("reveal");
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setUserVote(null);
      setStep("vote");
    } else {
      setIsGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserVote(null);
    setStep("vote");
    setScorePoints(0);
    setPredictionsCorrect(0);
    setStreak(0);
    setIsGameOver(false);
  };

  const handleShare = () => {
    const text = `J’ai vu juste sur les votes de la France ${predictionsCorrect} fois sur ${questions.length} sur Just Vote ! Viens tester tes intuitions ⚡️`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (isGameOver) {
    const predictionSuccess = Math.round((predictionsCorrect / questions.length) * 100);

    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
        {/* Result Header */}
        <div className="text-center space-y-3">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
            Quiz terminé 🎉
          </span>
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Tu as compris la France à <span className="text-primary">{predictionSuccess}%</span>
          </h2>
          <p className="text-gray-500 font-medium text-lg">
            {predictionsCorrect} votes en accord avec la majorité sur 10
          </p>
          <p className="text-sm text-gray-400 max-w-lg mx-auto text-balance">
            {quizId === "films-cultes" 
              ? `Tu as choisi le film favori de la communauté française ${predictionsCorrect} fois sur ${questions.length} dans cette session.`
              : `Tu as choisi le Pokémon favori de la communauté française ${predictionsCorrect} fois sur ${questions.length} dans cette session.`}
          </p>
        </div>

        {/* Bento Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Profile Card */}
          <div className="bg-surface p-6 rounded-[32px] border border-gray-100 shadow-soft flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Ton profil d&apos;opinion</span>
              <h3 className="text-2xl font-black text-primary mb-3">
                {predictionSuccess >= 70 ? "L’oracle communautaire" : predictionSuccess >= 40 ? "L’observateur équilibré" : "L’esprit rebelle"}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {predictionSuccess >= 70 
                  ? "Incroyable ! Tu ressens parfaitement les tendances et les préférences de la communauté française."
                  : predictionSuccess >= 40 
                  ? "Tu es globalement en phase avec la majorité, tout en conservant une touche de choix personnels uniques."
                  : "Tu as des opinions très singulières qui se démarquent nettement du grand public. Un vrai passionné indépendant !"}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs font-extrabold text-primary bg-primary/5 px-3 py-2 rounded-xl self-start">
              <Flame size={14} className="fill-current" /> Série max : {maxStreak} questions d&apos;affilée
            </div>
          </div>

          {/* Badge Card */}
          <div className={cn(
            "p-6 rounded-[32px] border relative overflow-hidden shadow-float min-h-[220px] flex flex-col justify-between text-white",
            quiz.cardBgClass || "bg-gradient-to-br from-primary to-primary-dark"
          )}>
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div>
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/10 self-start block w-fit mb-4">
                Récompense débloquée
              </span>
              <h3 className="text-2xl font-black">{quiz.badgeReward || "Dresseur d'Opinions"}</h3>
              <p className="text-white/80 text-xs mt-2 max-w-[200px]">
                Badge ajouté à ton profil !
              </p>
            </div>

            <div className="flex justify-between items-end mt-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Score</span>
                <span className="text-3xl font-black">{scorePoints} PI</span>
              </div>
              
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md">
                <Award size={36} className="text-white" />
              </div>
            </div>
          </div>

          {/* Interesting Facts Bento Column */}
          <div className="md:col-span-2 bg-surface p-6 rounded-[32px] border border-gray-100 shadow-soft space-y-6">
            <h4 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" /> Anecdotes marquantes de ta partie
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Rare Vote */}
              <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-100/50 space-y-2">
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Ton vote le plus rare</span>
                <p className="text-sm font-black text-orange-950">
                  {quizId === "films-cultes" ? "Tu as sauvé Dark Vador." : "Tu as supprimé Pikachu."}
                </p>
                <p className="text-xs text-orange-800/80">
                  {quizId === "films-cultes" ? "Seulement 35 % des cinéphiles ont fait de même." : "Seulement 6 % des joueurs ont fait le même choix."}
                </p>
              </div>

              {/* Best Intuition */}
              <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100/50 space-y-2">
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">Ta meilleure intuition</span>
                <p className="text-sm font-black text-purple-950">
                  {quizId === "films-cultes" ? "Interstellar comme chef-d'œuvre." : "Dracaufeu comme Pokémon surcoté."}
                </p>
                <p className="text-xs text-purple-800/80">
                  {quizId === "films-cultes" ? "Tu as vu juste sur la préférence française pour Nolan." : "Tu as vu juste sur la domination de la bête de feu."}
                </p>
              </div>

              {/* Debate Maker */}
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100/50 space-y-2">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">La réponse qui va faire débat</span>
                <p className="text-sm font-black text-blue-950">
                  {quizId === "films-cultes" ? "48 % pour Mission Cléopâtre." : "54 % pour Salamèche."}
                </p>
                <p className="text-xs text-blue-800/80">
                  {quizId === "films-cultes" ? "Le film d'Alain Chabat reste indétrônable." : "La France le préfère largement à Carapuce et Bulbizarre."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface p-6 rounded-[28px] border border-gray-100 shadow-soft">
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={handleRestart}
              className="flex-1 md:flex-none bg-surface-muted hover:bg-gray-100 text-gray-700 font-extrabold px-6 py-3.5 rounded-2xl text-sm transition-all border border-gray-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <RefreshCw size={16} /> Rejouer
            </button>
            <button
              onClick={handleShare}
              className="flex-1 md:flex-none bg-primary hover:bg-primary-dark text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <Share2 size={16} /> {copied ? "Copié !" : "Partager mon score"}
            </button>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
          >
            Retourner au tableau de bord
          </Link>
        </div>

        {/* Retention Banner */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-950 p-8 rounded-[36px] text-white relative overflow-hidden shadow-float">
          {/* Background visuals */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-light">Défi suivant</span>
              <h3 className="text-xl font-black">
                {quizId === "films-cultes" ? "Le Quiz Pokémon Originel ⚡️" : "La France a déjà voté sur les films 🎬"}
              </h3>
              <p className="text-xs text-white/70 max-w-md">
                {quizId === "films-cultes" 
                  ? "Es-tu capable de retrouver les Pokémon préférés de la communauté ? Viens tester ton instinct !"
                  : "Es-tu capable de deviner les goûts cinématographiques de la communauté ? Teste tes intuitions tout de suite !"}
              </p>
            </div>
            <Link 
              href={quizId === "films-cultes" ? "/quizzes/pokemon-gen1/play" : "/quizzes/films-cultes/play"}
              className="bg-white hover:bg-gray-50 text-indigo-950 font-black px-6 py-3.5 rounded-2xl text-xs transition-all tracking-wider uppercase text-center active:scale-95"
            >
              {quizId === "films-cultes" ? "Jouer au Quiz Pokémon" : "Deviner les films"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-300 pb-10">
      
      {/* Header Info & Progress Bar (Compact & Single-Row) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100/50">
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <Link 
            href={`/quizzes/${quiz.id}`}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary transition-colors"
          >
            <ChevronLeft size={16} /> Retour
          </Link>
          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">
            <Flame size={12} className="fill-current text-orange-500" />
            Série : {streak}
          </div>
        </div>
        
        {/* Compact Progress Bar */}
        <div className="flex-1 max-w-xs sm:max-w-md w-full flex items-center gap-2.5">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-black text-gray-400 whitespace-nowrap">
            Q. {currentQuestion.id} / {questions.length}
          </span>
        </div>
      </div>

      {/* Main Question Box */}
      <div className={cn(
        "p-5 md:p-6 rounded-[24px] space-y-4 md:space-y-5 relative overflow-hidden transition-all duration-500 shadow-xl",
        step === "vote" && "bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white",
        step === "reveal" && isCorrectGuess && "bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-950 text-white",
        step === "reveal" && !isCorrectGuess && "bg-gradient-to-br from-rose-600 via-red-700 to-rose-950 text-white"
      )}>
        
        {/* Decorative corner tag */}
        <div className="absolute top-0 right-0 bg-white/10 text-white/95 text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl">
          {quizId === "films-cultes" ? "Cinéma & Popcorn" : "Gen 1 & Spéciaux"}
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight">
            {currentQuestion.id}. {currentQuestion.title}
          </h2>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn(
              "text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider border bg-white/10 border-white/20",
              step === "reveal" && isCorrectGuess && "text-emerald-200 border-emerald-400/30",
              step === "reveal" && !isCorrectGuess && "text-rose-200 border-rose-400/30"
            )}>
              {step === "vote" ? "Choix & Prono" : isCorrectGuess ? "Félicitations !" : "Dommage"}
            </span>
            <p className="text-xs md:text-sm font-bold text-white/85">
              {step === "vote" ? currentQuestion.voteQuestion : 
               isCorrectGuess ? "Tu as vu juste sur la majorité de la France !" : 
               "Ton vote n'est pas celui qui a le plus convaincu la France."}
            </p>
          </div>
        </div>

        {/* Options Grid */}
        <div className={cn(
          "grid gap-4",
          currentQuestion.options.length === 2 && "grid-cols-2",
          currentQuestion.options.length === 3 && "grid-cols-3",
          currentQuestion.options.length === 4 && "grid-cols-2 md:grid-cols-4"
        )}>
          {currentQuestion.options.map((option) => {
            const isUserVote = userVote === option.id;
            const isMajority = option.percentage === Math.max(...currentQuestion.options.map(o => o.percentage));

            return (
              <button
                key={option.id}
                onClick={() => handleVoteSelect(option.id)}
                disabled={step === "reveal"}
                className={cn(
                  "flex flex-col items-center justify-between p-3 pt-5 pb-3 rounded-2xl border transition-all duration-500 h-[190px] md:h-[240px] relative overflow-hidden group select-none",
                  
                  // Vote State styling
                  step === "vote" && "bg-white/10 border-white/10 hover:bg-white/20 hover:scale-[1.03] hover:shadow-2xl hover:border-white/30",

                  // Reveal State (Success/Correct Choice highlights)
                  step === "reveal" && isCorrectGuess && cn(
                    isMajority 
                      ? "bg-white border-white text-emerald-950 scale-[1.03] shadow-2xl shadow-emerald-500/20" 
                      : "bg-white/5 border-white/5 text-white/50 opacity-60"
                  ),

                  // Reveal State (Failure/Incorrect Choice highlights)
                  step === "reveal" && !isCorrectGuess && cn(
                    isMajority 
                      ? "bg-white border-white text-rose-950 scale-[1.03] shadow-2xl shadow-rose-500/20" 
                      : isUserVote 
                        ? "bg-rose-950/40 border-rose-400 text-white shadow-lg" 
                        : "bg-white/5 border-white/5 text-white/50 opacity-60"
                  )
                )}
              >
                {/* Selection Badges overlay */}
                {step === "reveal" && (
                  <div className="absolute top-2 left-2 right-2 flex justify-between gap-1 pointer-events-none">
                    <div>
                      {isUserVote && (
                        <span className={cn(
                          "text-[8px] md:text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                          isMajority 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                            : "bg-rose-950/40 border-rose-500/30 text-rose-200"
                        )}>
                          ✔ Ton vote
                        </span>
                      )}
                    </div>
                    <div>
                      {isMajority && (
                        <span className={cn(
                          "text-[8px] md:text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm",
                          isCorrectGuess ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                        )}>
                          🏆 Gagnant
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Pokemon Image Frame (star of the card) */}
                <div className="w-full flex-1 flex items-center justify-center p-1 transition-transform duration-500 group-hover:scale-105 min-h-0">
                  <div className={cn(
                    "w-18 h-18 md:w-24 md:h-24 rounded-xl flex items-center justify-center p-1.5 transition-all duration-500 overflow-hidden",
                    step === "vote" && "bg-white/5 border border-white/10",
                    step === "reveal" && isMajority && (isCorrectGuess ? "bg-emerald-50" : "bg-rose-50"),
                    step === "reveal" && !isMajority && "bg-white/5 border border-white/5"
                  )}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={option.pokemonId ? getPokemonImageUrl(option.pokemonId) : (option.imageUrl || "")} 
                      alt={option.text}
                      className={cn(
                        "w-full h-full object-contain",
                        !option.pokemonId && "object-cover rounded-lg"
                      )}
                    />
                  </div>
                </div>

                {/* Option text */}
                <span className={cn(
                  "text-xs md:text-sm font-black tracking-wide block text-center mt-1",
                  step === "vote" && "text-white",
                  step === "reveal" && isMajority && (isCorrectGuess ? "text-emerald-950" : "text-rose-950"),
                  step === "reveal" && !isMajority && "text-white"
                )}>
                  {option.text}
                </span>

                {/* Live Percentage Reveal (compact row) */}
                {step === "reveal" ? (
                  <div className="w-full mt-2 space-y-1 animate-in fade-in duration-500">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-[800ms] ease-out",
                            isMajority ? (isCorrectGuess ? "bg-emerald-600" : "bg-rose-600") : "bg-white"
                          )}
                          style={{ width: `${option.percentage}%` }}
                        ></div>
                      </div>
                      <span className={cn(
                        "text-[10px] md:text-xs font-black tracking-wider whitespace-nowrap",
                        isMajority && isCorrectGuess ? "text-emerald-950" : isMajority && !isCorrectGuess ? "text-rose-950" : "text-white"
                      )}>
                        {option.percentage}%
                      </span>
                    </div>
                  </div>
                ) : (
                  // Height placeholder to prevent layout shift
                  <div className="h-[16px] w-full mt-2"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Small Elegant Summary Text */}
        {step === "reveal" && (
          <div className="text-center font-black text-sm md:text-base animate-in fade-in duration-500 pt-2 pb-1">
            {isCorrectGuess ? (
              <span className="text-emerald-100 flex items-center justify-center gap-1.5">
                ⚡️ Bien vu ! La France est d&apos;accord avec toi.
              </span>
            ) : (
              <span className="text-rose-100 flex items-center justify-center gap-1.5">
                ❌ La France a préféré {majorityOption.text}.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Centered Next Button sliding up from bottom */}
      <div className={cn(
        "w-full transition-all duration-500 transform flex justify-center mt-4",
        step === "reveal" ? "translate-y-0 opacity-100 scale-100" : "translate-y-6 opacity-0 pointer-events-none scale-95 h-0 overflow-hidden"
      )}>
        <button
          onClick={handleNext}
          className={cn(
            "w-full max-w-md font-black py-4 px-8 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98",
            isCorrectGuess 
              ? "bg-white text-emerald-950 hover:bg-emerald-50 border border-emerald-100" 
              : "bg-white text-rose-950 hover:bg-rose-50 border border-rose-100"
          )}
        >
          {currentQuestionIndex === questions.length - 1 ? "Voir les résultats" : "Question suivante"} <ArrowRight size={16} />
        </button>
      </div>

      {/* Discret Instructions */}
      <div className="flex items-center gap-1.5 justify-center text-xs font-bold text-gray-400">
        <AlertCircle size={14} />
        <span>Réponds à l&apos;instinct, sans chronomètre stressant ⏱️</span>
      </div>
    </div>
  );
}
