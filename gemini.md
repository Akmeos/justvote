# Just Vote - Application de Quiz d'Opinion Sociale Gamifiée

Ce document résume l'architecture, les fonctionnalités et les choix techniques du projet **Just Vote** pour servir de référence aux futurs développeurs et modèles d'IA (Gemini).

---

## 1. Description de l'Application

**Just Vote** est une application web optimisée pour mobile (*mobile-first*) qui permet aux utilisateurs de participer à des quiz d'opinion sociale et de comparer leurs réponses avec l'opinion publique nationale. L'application intègre des dynamiques de gamification (niveaux, points d'intuition, badges, classements et score d'affinité nationale) afin de créer une expérience utilisateur interactive et engageante.

---

## 2. Fonctionnalités Implémentées

### 📱 Interface Utilisateur & Navigation
* **Navigation Mobile (`MobileNav.tsx`)** : Barre de navigation fixe en bas de l'écran optimisée pour le pouce, organisée comme suit :
  1. **Tendances** (`/trends`, icône boussole 🧭)
  2. **Classement** (`/leaderboard`, icône trophée 🏆)
  3. **Accueil** / Tableau de bord (Bouton central Play `/dashboard` 🚀)
  4. **Proposer** (`/propose-quiz`, icône plus ➕)
  5. **Profil** (`/profile`, icône utilisateur 👤)
* **Design Bento Grid** : Agencement moderne en forme de tuiles (Bento) avec coins très arrondis (`rounded-[32px]`) et ombrages flottants (`shadow-float`).

### 👤 Page de Profil
* **En-tête Utilisateur** : Affiche l'avatar interactif (ex: Pikachu), le nom d'utilisateur, le niveau, ainsi qu'un badge de titre équipé (ex: « Oracle Légendaire 🔮 ») placé en haut à droite.
* **Barre de Progression de l'Intuition (PI)** : Barre horizontale positionnée au bas de l'en-tête montrant l'avancement vers le niveau suivant.
* **Score d'Affinité France** : Affiche le pourcentage d'alignement de l'utilisateur avec la moyenne nationale (ex: `78%`) avec un texte descriptif ajusté.
* **Tuiles Statistiques** : 4 cartes Bento centrées affichant les statistiques clés de l'utilisateur (Quiz complétés, Série maximale, Série actuelle, Total PI).

### 🛠️ Espace Administration (`/admin`)
* **Gestion des Quiz** : Création, modification et suppression de quiz.
* **Gestion des Options de Vote** : Ajout d'options de vote avec support d'upload d'images et calcul automatique des pourcentages d'opinion.
* **Gestion Dynamique des Catégories** : Un système complet basé sur le `localStorage` permettant aux administrateurs de créer, modifier et supprimer des catégories en temps réel (titres, emojis, classes de thèmes CSS). Ces modifications se répercutent instantanément sur le tableau de bord et les pages de quiz.

---

## 3. Structure des Fichiers Clés

```text
/Users/titouan/Documents/Applications SaaS/JustVote/
├── app/
│   ├── (app)/
│   │   ├── admin/             # Espace d'administration (quizzes, catégories)
│   │   ├── categories/        # Pages de quiz filtrés par catégorie
│   │   ├── dashboard/         # Tableau de bord principal (Bento grid, quiz recommandés)
│   │   ├── profile/           # Page profil utilisateur (statistiques et affinité)
│   │   ├── propose-quiz/      # Formulaire de proposition de quiz par les utilisateurs
│   │   ├── quizzes/           # Détail et interface de réponse à un quiz
│   │   ├── trends/            # Quiz populaires et tendances actuelles
│   │   └── layout.tsx         # Layout principal avec Sidebar (desktop) et MobileNav (mobile)
├── components/
│   ├── layout/
│   │   ├── MobileNav.tsx      # Navigation mobile
│   │   └── Sidebar.tsx        # Navigation desktop
│   └── ui/                    # Composants d'interface réutilisables (boutons, modales)
└── public/                    # Assets statiques (images, icônes)
```

---

## 4. Technologies Utilisées

* **Framework** : Next.js 14 (App Router)
* **Bibliothèque UI** : React 18
* **Stylisation (CSS)** : Tailwind CSS (approche mobile-first et classes utilitaires personnalisées comme `rounded-[32px]` et `shadow-float`)
* **Icônes** : `lucide-react`
* **Stockage Côté Client** : `localStorage` pour la persistence locale de la configuration dynamique des catégories sans base de données lourde à ce stade.

---

## 5. Choix de Conception & Design System

* **Esthétique Colorée & Sombre** : Utilisation de dégradés profonds (ex: `from-indigo-900 via-purple-900 to-indigo-950`) associés à des touches de couleurs vives pour les badges et les scores d'affinité.
* **Micro-interactions** : États hover et active soignés pour tous les boutons tactiles et les cartes bento afin de simuler une application native.
* **Layouts Compacts** : Optimisation de l'espace vertical sur mobile en éliminant les hauteurs minimales excessives et en groupant les informations de manière horizontale (ex: avatar à gauche, textes à droite).

---

## 6. Instructions pour les Futurs Modèles d'IA (Gemini)

Lors de la modification de ce codebase, merci de respecter les consignes suivantes :

1. **Préservation du Design System** : Toujours réutiliser les jetons de design du projet. N'ajoutez pas de styles ad-hoc si des classes existantes (`rounded-[32px]`, `shadow-float`, `surface`) peuvent être utilisées.
2. **Priorité Mobile-First** : Validez systématiquement chaque modification sur un viewport mobile (ex: `390x844`). Les cartes doivent être compactes, sans vide vertical excessif, et les textes longs ne doivent pas déborder ou provoquer de défilement horizontal.
3. **Synchronisation avec le LocalStorage** : Le système de catégories repose sur le `localStorage`. Assurez-vous que toute modification ou ajout de catégorie lise et écrive correctement dans la clé correspondante et gère le rendu côté client (évitement des erreurs d'hydratation Next.js).
4. **Maintenance du Code** : Avant de valider une tâche, lancez `npm run lint` et résolvez de manière proactive les erreurs de typage TypeScript ou les imports inutilisés.
