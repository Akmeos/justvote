export interface AvatarItem {
  id: string;
  name: string;
  url: string;
  requiredLevel: number;
  bgClass: string;
  pokemonId?: number;
}

export const DEFAULT_AVATARS: AvatarItem[] = [
  { id: "pikachu", name: "Pikachu", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", requiredLevel: 1, bgClass: "bg-yellow-50/70 border-yellow-100", pokemonId: 25 },
  { id: "evoli", name: "Évoli", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png", requiredLevel: 1, bgClass: "bg-amber-50/70 border-amber-100", pokemonId: 133 },
  { id: "bulbizarre", name: "Bulbizarre", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png", requiredLevel: 1, bgClass: "bg-emerald-50/70 border-emerald-100", pokemonId: 1 },
  { id: "salameche", name: "Salamèche", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png", requiredLevel: 1, bgClass: "bg-orange-50/70 border-orange-100", pokemonId: 4 },
  { id: "carapuce", name: "Carapuce", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png", requiredLevel: 1, bgClass: "bg-cyan-50/70 border-cyan-100", pokemonId: 7 },
  { id: "tortank", name: "Tortank", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png", requiredLevel: 5, bgClass: "bg-blue-50/70 border-blue-100", pokemonId: 9 },
  { id: "ectoplasma", name: "Ectoplasma", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png", requiredLevel: 8, bgClass: "bg-purple-50/70 border-purple-100", pokemonId: 94 },
  { id: "dracaufeu", name: "Dracaufeu", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png", requiredLevel: 10, bgClass: "bg-red-50/70 border-red-100", pokemonId: 6 },
  { id: "ronflex", name: "Ronflex", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png", requiredLevel: 12, bgClass: "bg-cyan-50/70 border-cyan-100", pokemonId: 143 },
  { id: "mewtwo", name: "Mewtwo", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png", requiredLevel: 15, bgClass: "bg-indigo-50/70 border-indigo-100", pokemonId: 150 }
];

export function getAvatars(): AvatarItem[] {
  if (typeof window === "undefined") return DEFAULT_AVATARS;
  try {
    const saved = localStorage.getItem("custom-avatars");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error reading custom avatars:", e);
  }
  return DEFAULT_AVATARS;
}

export function saveAvatars(avatars: AvatarItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("custom-avatars", JSON.stringify(avatars));
  window.dispatchEvent(new CustomEvent("avatars-updated"));
}

export function getRandomAvatar(): AvatarItem {
  const avatars = getAvatars();
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex] || DEFAULT_AVATARS[0];
}
