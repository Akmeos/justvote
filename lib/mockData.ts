export interface Category {
  id: string;
  title: string;
  emoji: string;
  description: string;
  colorClass: string;
  gradientClass: string;
  totalQuizzes: number;
  userProgression: number; // Percentage (e.g. 60)
}

export interface Quiz {
  id: string;
  categoryId: string;
  title: string;
  tagline: string;
  description: string;
  questionsCount: number;
  estimatedDuration: string; // e.g. "5 min"
  difficulty: "Facile" | "Moyen" | "Difficile";
  participantsCount: number;
  pointsReward: number;
  badgeReward?: string;
  status: "not_played" | "in_progress" | "completed";
  userProgress?: number; // e.g. 40 (percentage or current question index)
  userScore?: number; // e.g. 120 points
  isPopular?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  isFavorite?: boolean;
  imageUrl?: string;
  cardBgClass?: string;
  badgeBgClass?: string;
  themeColorClass?: string;
  textColorClass?: string;
  textMutedClass?: string;
}

export const mockCategories: Category[] = [
  {
    id: "pokemon",
    title: "Pokémon",
    emoji: "⚡️",
    description: "Devine les préférences des dresseurs français sur les créatures, les versions de jeux et les combats légendaires !",
    colorClass: "bg-yellow-500",
    gradientClass: "from-yellow-400 to-yellow-600",
    totalQuizzes: 12,
    userProgression: 45,
  },
  {
    id: "pop-culture",
    title: "Pop Culture",
    emoji: "🍿",
    description: "Mèmes, tendances internet et moments cultes des années 90 à aujourd'hui. Es-tu dans le coup ?",
    colorClass: "bg-purple-500",
    gradientClass: "from-purple-400 to-purple-600",
    totalQuizzes: 18,
    userProgression: 20,
  },
  {
    id: "gaming",
    title: "Gaming",
    emoji: "🎮",
    description: "Des consoles rétro aux jeux compétitifs modernes. Qu'en pense la communauté des joueurs ?",
    colorClass: "bg-blue-500",
    gradientClass: "from-blue-400 to-blue-600",
    totalQuizzes: 15,
    userProgression: 60,
  },
  {
    id: "films",
    title: "Films",
    emoji: "🎬",
    description: "Classiques du cinéma, blockbusters et réalisateurs cultes. Sauras-tu deviner le box-office des cœurs ?",
    colorClass: "bg-red-500",
    gradientClass: "from-red-400 to-red-600",
    totalQuizzes: 10,
    userProgression: 10,
  },
  {
    id: "series-tv",
    title: "Séries TV",
    emoji: "📺",
    description: "Des sitcoms cultes aux drames intenses de Netflix et d'ailleurs. Quel est l'avis majoritaire ?",
    colorClass: "bg-emerald-500",
    gradientClass: "from-emerald-400 to-emerald-600",
    totalQuizzes: 14,
    userProgression: 35,
  },
  {
    id: "societe",
    title: "Société",
    emoji: "👥",
    description: "Débats publics, modes de vie et grandes questions d'actualité. Qu'en pense le citoyen Just Vote ?",
    colorClass: "bg-orange-500",
    gradientClass: "from-orange-400 to-orange-600",
    totalQuizzes: 8,
    userProgression: 30,
  },
  {
    id: "gastronomie",
    title: "Gastronomie",
    emoji: "🍳",
    description: "Plats préférés, habitudes culinaires et débats de table animés. Es-tu un vrai gourmet ?",
    colorClass: "bg-pink-500",
    gradientClass: "from-pink-400 to-pink-600",
    totalQuizzes: 6,
    userProgression: 0,
  }
];

export const mockQuizzes: Quiz[] = [
  // Pokémon Quizzes
  {
    id: "pokemon-power",
    categoryId: "pokemon",
    title: "Le grand débat Pokémon",
    tagline: "Sauras-tu deviner les choix des fans français sur les monstres les plus puissants ?",
    description: "Du starter ultime au légendaire le plus charismatique, compare ton opinion et tes prédictions avec le reste des dresseurs de France.",
    questionsCount: 10,
    estimatedDuration: "5 min",
    difficulty: "Moyen",
    participantsCount: 24390,
    pointsReward: 150,
    badgeReward: "Expert Pokémon",
    status: "not_played",
    isPopular: true,
    isTrending: true,
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png", // Charizard
    cardBgClass: "bg-gradient-to-br from-orange-500 to-amber-600 border-orange-400/80 shadow-orange-500/20",
    badgeBgClass: "bg-white/20 text-white border-white/10",
    themeColorClass: "bg-white text-orange-600 hover:bg-orange-50 hover:text-orange-700",
    textColorClass: "text-white",
    textMutedClass: "text-orange-100/90"
  },
  {
    id: "pokemon-gen1",
    categoryId: "pokemon",
    title: "Génération 1 : Le Nostalgie Tour",
    tagline: "Bleu, Rouge, Jaune... Quelle version a marqué la France pour toujours ?",
    description: "Retour à Kanto ! Redécouvre les premiers choix des joueurs : starters, badges, et musiques inoubliables.",
    questionsCount: 8,
    estimatedDuration: "4 min",
    difficulty: "Facile",
    participantsCount: 18450,
    pointsReward: 100,
    badgeReward: "Pionnier de Kanto",
    status: "in_progress",
    userProgress: 50, // 50% completed (e.g. 4/8 questions)
    isTrending: true,
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", // Pikachu
    cardBgClass: "bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-300/80 shadow-yellow-400/20",
    badgeBgClass: "bg-yellow-950/15 text-yellow-950 border-yellow-950/10",
    themeColorClass: "bg-yellow-950 text-white hover:bg-yellow-900",
    textColorClass: "text-yellow-950",
    textMutedClass: "text-yellow-900"
  },
  {
    id: "pokemon-legends",
    categoryId: "pokemon",
    title: "Les Pokémon Légendaires",
    tagline: "Mewtwo, Rayquaza, Arceus... Quel dieu Pokémon domine l'esprit des Français ?",
    description: "Un quiz divin pour mesurer ta connaissance des légendes et deviner qui est le favori du public.",
    questionsCount: 12,
    estimatedDuration: "7 min",
    difficulty: "Difficile",
    participantsCount: 12200,
    pointsReward: 200,
    badgeReward: "Maître des Légendes",
    status: "completed",
    userScore: 180,
    isPopular: true,
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png", // Mewtwo
    cardBgClass: "bg-gradient-to-br from-indigo-600 to-purple-700 border-indigo-500/80 shadow-indigo-600/20",
    badgeBgClass: "bg-white/20 text-white border-white/10",
    themeColorClass: "bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700",
    textColorClass: "text-white",
    textMutedClass: "text-indigo-100/90"
  },
  {
    id: "pokemon-spin-offs",
    categoryId: "pokemon",
    title: "Les jeux dérivés Pokémon",
    tagline: "Donjon Mystère, Pokémon GO ou Snap ? Quel spin-off est le roi ?",
    description: "Quiz rapide sur l'univers étendu de Pokémon en dehors de la série principale.",
    questionsCount: 6,
    estimatedDuration: "3 min",
    difficulty: "Facile",
    participantsCount: 5400,
    pointsReward: 80,
    status: "not_played",
    isNew: true,
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png", // Bulbasaur
    cardBgClass: "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400/80 shadow-emerald-500/20",
    badgeBgClass: "bg-white/20 text-white border-white/10",
    themeColorClass: "bg-white text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700",
    textColorClass: "text-white",
    textMutedClass: "text-emerald-100/90"
  },
  {
    id: "pokemon-shinies",
    categoryId: "pokemon",
    title: "La folie des Pokémon Shiny",
    tagline: "Dracaufeu noir ou Léviator rouge ? Devine le Shiny le plus convoité !",
    description: "Une plongée dans le monde des couleurs alternatives. Sauras-tu prédire le vote majoritaire ?",
    questionsCount: 10,
    estimatedDuration: "5 min",
    difficulty: "Moyen",
    participantsCount: 9600,
    pointsReward: 150,
    badgeReward: "Chasseur d'Étoiles",
    status: "not_played",
    isFavorite: true,
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png", // Lugia
    cardBgClass: "bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-400/80 shadow-cyan-500/20",
    badgeBgClass: "bg-white/20 text-white border-white/10",
    themeColorClass: "bg-white text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700",
    textColorClass: "text-white",
    textMutedClass: "text-cyan-100/90"
  },
  {
    id: "pop-culture-memes",
    categoryId: "pop-culture",
    title: "L'âge d'or des Mèmes",
    tagline: "De 'Rickroll' à 'Doge', devine les mèmes préférés des Français !",
    description: "Les mèmes façonnent internet. Quel mème fait le plus rire la communauté ?",
    questionsCount: 10,
    estimatedDuration: "5 min",
    difficulty: "Facile",
    participantsCount: 31200,
    pointsReward: 120,
    status: "not_played",
    isPopular: true,
    isTrending: true,
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png", // Jigglypuff
    cardBgClass: "bg-gradient-to-br from-pink-500 to-purple-600 border-pink-400/80 shadow-pink-500/20",
    badgeBgClass: "bg-white/20 text-white border-white/10",
    themeColorClass: "bg-white text-pink-600 hover:bg-pink-50 hover:text-pink-700",
    textColorClass: "text-white",
    textMutedClass: "text-pink-100/90"
  },
  {
    id: "gaming-consoles",
    categoryId: "gaming",
    title: "La guerre des Consoles",
    tagline: "PlayStation, Xbox ou Nintendo ? Devine le favori ultime !",
    description: "Le grand débat qui divise les salons. Que pensent réellement les joueurs français ?",
    questionsCount: 10,
    estimatedDuration: "5 min",
    difficulty: "Moyen",
    participantsCount: 42100,
    pointsReward: 150,
    badgeReward: "Gamer Ultime",
    status: "not_played",
    isPopular: true,
    isTrending: true,
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/137.png", // Porygon
    cardBgClass: "bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400/80 shadow-blue-500/20",
    badgeBgClass: "bg-white/20 text-white border-white/10",
    themeColorClass: "bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700",
    textColorClass: "text-white",
    textMutedClass: "text-blue-100/90"
  },
  {
    id: "films-cultes",
    categoryId: "films",
    title: "Les Films Cultes",
    tagline: "Devine les films qui ont marqué la France pour toujours !",
    description: "Des classiques intemporels aux blockbusters légendaires, compare tes opinions avec les cinéphiles français.",
    questionsCount: 10,
    estimatedDuration: "5 min",
    difficulty: "Moyen",
    participantsCount: 28900,
    pointsReward: 150,
    badgeReward: "Expert Ciné",
    status: "not_played",
    isPopular: true,
    isTrending: true,
    imageUrl: "https://image.tmdb.org/t/p/w500/edv5CZv2jV9svMRfyuh67HokOI0.jpg",
    cardBgClass: "bg-gradient-to-br from-red-600 to-rose-700 border-red-500/80 shadow-red-600/20",
    badgeBgClass: "bg-white/20 text-white border-white/10",
    themeColorClass: "bg-white text-red-600 hover:bg-red-50 hover:text-red-700",
    textColorClass: "text-white",
    textMutedClass: "text-red-100/90"
  }
];
