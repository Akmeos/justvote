export interface QuizOption {
  id: string;
  text: string;
  pokemonId?: number;
  imageUrl?: string;
  percentage: number;
}

export interface QuizQuestion {
  id: number;
  title: string;
  voteQuestion: string;
  options: QuizOption[];
  categoryTag?: string;
}

export const quizQuestions: Record<string, QuizQuestion[]> = {
  "pokemon-gen1": [
    {
      id: 1,
      title: "Tu n’en gardes qu’un",
      voteQuestion: "Qui sauves-tu ?",
      options: [
        { id: "pikachu", text: "Pikachu", pokemonId: 25, percentage: 32 },
        { id: "dracaufeu", text: "Dracaufeu", pokemonId: 6, percentage: 48 },
        { id: "evoli", text: "Évoli", pokemonId: 133, percentage: 20 }
      ]
    },
    {
      id: 2,
      title: "Le vrai meilleur starter",
      voteQuestion: "Tu pars avec qui ?",
      options: [
        { id: "salameche", text: "Salamèche", pokemonId: 4, percentage: 54 },
        { id: "carapuce", text: "Carapuce", pokemonId: 7, percentage: 28 },
        { id: "bulbizarre", text: "Bulbizarre", pokemonId: 1, percentage: 18 }
      ]
    },
    {
      id: 3,
      title: "Un seul mérite sa popularité",
      voteQuestion: "Lequel mérite vraiment son succès ?",
      options: [
        { id: "lucario", text: "Lucario", pokemonId: 448, percentage: 15 },
        { id: "amphinobi", text: "Amphinobi", pokemonId: 658, percentage: 28 },
        { id: "ectoplasma", text: "Ectoplasma", pokemonId: 94, percentage: 22 },
        { id: "dracaufeu", text: "Dracaufeu", pokemonId: 6, percentage: 35 }
      ]
    },
    {
      id: 4,
      title: "Le duel ultime",
      voteQuestion: "Qui gagne le combat ?",
      options: [
        { id: "mewtwo", text: "Mewtwo", pokemonId: 150, percentage: 68 },
        { id: "arceus", text: "Arceus", pokemonId: 493, percentage: 32 }
      ]
    },
    {
      id: 5,
      title: "Tu dois en supprimer un",
      voteQuestion: "Qui disparaît pour toujours ?",
      options: [
        { id: "pikachu", text: "Pikachu", pokemonId: 25, percentage: 42 },
        { id: "evoli", text: "Évoli", pokemonId: 133, percentage: 18 },
        { id: "dracaufeu", text: "Dracaufeu", pokemonId: 6, percentage: 40 }
      ]
    },
    {
      id: 6,
      title: "Tu dois vivre avec lui",
      voteQuestion: "Qui devient ton colocataire ?",
      options: [
        { id: "ronflex", text: "Ronflex", pokemonId: 143, percentage: 41 },
        { id: "psykokwak", text: "Psykokwak", pokemonId: 54, percentage: 24 },
        { id: "miaouss", text: "Miaouss", pokemonId: 52, percentage: 10 },
        { id: "evoli", text: "Évoli", pokemonId: 133, percentage: 25 }
      ]
    },
    {
      id: 7,
      title: "Le plus surcoté",
      voteQuestion: "Qui ne mérite pas autant de succès ?",
      options: [
        { id: "pikachu", text: "Pikachu", pokemonId: 25, percentage: 30 },
        { id: "dracaufeu", text: "Dracaufeu", pokemonId: 6, percentage: 45 },
        { id: "lucario", text: "Lucario", pokemonId: 448, percentage: 15 },
        { id: "amphinobi", text: "Amphinobi", pokemonId: 658, percentage: 10 }
      ]
    },
    {
      id: 8,
      title: "Ton équipe est menée 5 à 0",
      voteQuestion: "Qui envoies-tu pour renverser le combat ?",
      options: [
        { id: "dracaufeu", text: "Dracaufeu", pokemonId: 6, percentage: 35 },
        { id: "mewtwo", text: "Mewtwo", pokemonId: 150, percentage: 42 },
        { id: "rayquaza", text: "Rayquaza", pokemonId: 384, percentage: 18 },
        { id: "carchacrok", text: "Carchacrok", pokemonId: 443, percentage: 5 }
      ]
    },
    {
      id: 9,
      title: "Quel vote te ferait le plus juger ?",
      voteQuestion: "Quelle opinion assumes-tu le plus ?",
      options: [
        { id: "magicarpe", text: "Magicarpe est le meilleur", pokemonId: 129, percentage: 38 },
        { id: "pikachu_insupportable", text: "Pikachu est insupportable", pokemonId: 25, percentage: 22 },
        { id: "nouveaux_meilleurs", text: "Les nouveaux Pokémon sont meilleurs", pokemonId: 906, percentage: 12 },
        { id: "dracaufeu_banal", text: "Dracaufeu est banal", pokemonId: 6, percentage: 28 }
      ]
    },
    {
      id: 10,
      title: "La finale",
      voteQuestion: "Qui représente le mieux Pokémon ?",
      options: [
        { id: "pikachu", text: "Pikachu", pokemonId: 25, percentage: 46 },
        { id: "dracaufeu", text: "Dracaufeu", pokemonId: 6, percentage: 32 },
        { id: "evoli", text: "Évoli", pokemonId: 133, percentage: 12 },
        { id: "mewtwo", text: "Mewtwo", pokemonId: 150, percentage: 10 }
      ]
    }
  ],
  "films-cultes": [
    {
      id: 1,
      title: "Le chef-d'œuvre de Christopher Nolan",
      voteQuestion: "Lequel t'a le plus marqué ?",
      options: [
        { id: "inception", text: "Inception", imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80", percentage: 42 },
        { id: "interstellar", text: "Interstellar", imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80", percentage: 58 }
      ]
    },
    {
      id: 2,
      title: "Le duel des méchants iconiques",
      voteQuestion: "Quel antagoniste est le plus légendaire ?",
      options: [
        { id: "joker", text: "Le Joker (The Dark Knight)", imageUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80", percentage: 65 },
        { id: "vader", text: "Dark Vador (Star Wars)", imageUrl: "https://images.unsplash.com/photo-1546561892-65bf811416b9?w=400&q=80", percentage: 35 }
      ]
    },
    {
      id: 3,
      title: "La comédie française culte",
      voteQuestion: "Laquelle connais-tu par cœur ?",
      options: [
        { id: "asterix", text: "Mission Cléopâtre", imageUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80", percentage: 48 },
        { id: "diner-cons", text: "Le Dîner de Cons", imageUrl: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400&q=80", percentage: 37 },
        { id: "cite-peur", text: "La Cité de la Peur", imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80", percentage: 15 }
      ]
    },
    {
      id: 4,
      title: "La larme à l'œil assurée",
      voteQuestion: "Quel film te brise le cœur à chaque fois ?",
      options: [
        { id: "ligne-verte", text: "La Ligne Verte", imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80", percentage: 52 },
        { id: "titanic", text: "Titanic", imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&q=80", percentage: 34 },
        { id: "roi-lion", text: "Le Roi Lion", imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80", percentage: 14 }
      ]
    },
    {
      id: 5,
      title: "La trilogie suprême",
      voteQuestion: "Quelle saga est au-dessus du lot ?",
      options: [
        { id: "sda", text: "Le Seigneur des Anneaux", imageUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80", percentage: 61 },
        { id: "sw", text: "Star Wars (Original)", imageUrl: "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=400&q=80", percentage: 27 },
        { id: "matrix", text: "Matrix", imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80", percentage: 12 }
      ]
    },
    {
      id: 6,
      title: "Le thriller psychologique",
      voteQuestion: "Lequel t'a le plus retourné la tête ?",
      options: [
        { id: "shutter-island", text: "Shutter Island", imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80", percentage: 45 },
        { id: "fight-club", text: "Fight Club", imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&q=80", percentage: 38 },
        { id: "silence-agneaux", text: "Le Silence des Agneaux", imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80", percentage: 17 }
      ]
    },
    {
      id: 7,
      title: "Le meilleur Pixar de l'histoire",
      voteQuestion: "Quel est ton favori ultime ?",
      options: [
        { id: "toy-story", text: "Toy Story", imageUrl: "https://images.unsplash.com/photo-1602757793758-28980cdb2d40?w=400&q=80", percentage: 33 },
        { id: "ratatouille", text: "Ratatouille", imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80", percentage: 41 },
        { id: "monstres-cie", text: "Monstres & Cie", imageUrl: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=400&q=80", percentage: 26 }
      ]
    },
    {
      id: 8,
      title: "Le film d'action référence",
      voteQuestion: "Devant lequel tu ne t'ennuies jamais ?",
      options: [
        { id: "gladiator", text: "Gladiator", imageUrl: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80", percentage: 52 },
        { id: "mad-max", text: "Mad Max: Fury Road", imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80", percentage: 30 },
        { id: "kill-bill", text: "Kill Bill: Vol. 1", imageUrl: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&q=80", percentage: 18 }
      ]
    },
    {
      id: 9,
      title: "L'horreur à l'état pur",
      voteQuestion: "Quel classique te terrifie le plus ?",
      options: [
        { id: "shining", text: "Shining", imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80", percentage: 45 },
        { id: "exorciste", text: "L'Exorciste", imageUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=400&q=80", percentage: 35 },
        { id: "alien", text: "Alien", imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80", percentage: 20 }
      ]
    },
    {
      id: 10,
      title: "Le chef-d'œuvre absolu de l'animation",
      voteQuestion: "Lequel a la plus belle poésie ?",
      options: [
        { id: "chihiro", text: "Le Voyage de Chihiro", imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80", percentage: 56 },
        { id: "princesse-mononoke", text: "Princesse Mononoké", imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&q=80", percentage: 44 }
      ]
    }
  ]
};
