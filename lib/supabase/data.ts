import { createClient } from './client';
import { Category, Quiz } from '@/lib/mockData';
import { QuizQuestion, QuizOption } from '@/lib/quizQuestions';

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
  equipped_title: string;
  points: number;
  level: number;
  current_streak: number;
  max_streak: number;
  quizzes_completed: number;
  affinity_score: number;
  role?: string;
}

// 1. Fetch Categories
export async function fetchCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true });

  if (error || !data || data.length === 0) {
    console.error('Error fetching categories from Supabase:', error);
    return [];
  }

  return data.map((c) => ({
    id: c.id,
    title: c.title,
    emoji: c.emoji,
    description: c.description,
    colorClass: c.color_class,
    gradientClass: c.gradient_class,
    totalQuizzes: c.total_quizzes,
    userProgression: 0,
  }));
}

// 2. Fetch Quizzes
export async function fetchQuizzes(): Promise<Quiz[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .order('created_at', { ascending: true });

  if (error || !data || data.length === 0) {
    console.error('Error fetching quizzes from Supabase:', error);
    return [];
  }

  return data.map((q) => ({
    id: q.id,
    categoryId: q.category_id,
    title: q.title,
    tagline: q.tagline,
    description: q.description,
    questionsCount: q.questions_count,
    estimatedDuration: q.estimated_duration,
    difficulty: q.difficulty as 'Facile' | 'Moyen' | 'Difficile',
    participantsCount: q.participants_count,
    pointsReward: q.points_reward,
    badgeReward: q.badge_reward || undefined,
    status: 'not_played',
    isPopular: q.is_popular,
    isTrending: q.is_trending,
    isNew: q.is_new,
    imageUrl: q.image_url || undefined,
    cardBgClass: q.card_bg_class || undefined,
    badgeBgClass: q.badge_bg_class || undefined,
    themeColorClass: q.theme_color_class || undefined,
    textColorClass: q.text_color_class || undefined,
    textMutedClass: q.text_muted_class || undefined,
  }));
}

// 3. Fetch Quiz Questions & Options with Real-Time Vote Percentages
export async function fetchQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
  const supabase = createClient();
  const { data: questionsData, error: qError } = await supabase
    .from('questions')
    .select('*, options(*)')
    .eq('quiz_id', quizId)
    .order('question_order', { ascending: true });

  if (qError || !questionsData || questionsData.length === 0) {
    console.error(`Error fetching questions for quiz ${quizId}:`, qError);
    return [];
  }

  return questionsData.map((q: any, index: number) => {
    const rawOptions = q.options || [];
    const totalVotes = rawOptions.reduce((acc: number, opt: any) => acc + (opt.votes_count || 0), 0);

    const options: QuizOption[] = rawOptions.map((opt: any) => {
      const percentage = totalVotes > 0 ? Math.round((opt.votes_count / totalVotes) * 100) : 0;
      return {
        id: opt.id,
        text: opt.text,
        pokemonId: opt.pokemon_id || undefined,
        imageUrl: opt.image_url || undefined,
        percentage: percentage,
      };
    });

    return {
      id: index + 1,
      dbId: q.id,
      title: q.title,
      voteQuestion: q.vote_question,
      options: options,
      categoryTag: q.category_tag || undefined,
    };
  });
}

// 4. Submit Vote
export async function submitVote(
  userId: string | null,
  quizId: string,
  questionDbId: string,
  optionId: string
) {
  const supabase = createClient();
  const { error } = await supabase.rpc('record_vote', {
    p_user_id: userId,
    p_quiz_id: quizId,
    p_question_id: questionDbId,
    p_option_id: optionId,
  });

  if (error) {
    console.error('Error recording vote in Supabase:', error);
  }
}

import { User } from '@supabase/supabase-js';

// 5. Fetch User Profile
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as UserProfile;
}

// 5b. Ensure & Sync User Profile with OAuth Metadata
export async function ensureUserProfile(user: User): Promise<UserProfile> {
  const supabase = createClient();

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const googleAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const googleName = user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.username;

  if (existingProfile) {
    if ((googleAvatar && (!existingProfile.avatar_url || existingProfile.avatar_url.includes('PokeAPI'))) || (googleName && existingProfile.username.startsWith('User_'))) {
      const updates: Partial<UserProfile> = {};
      if (googleAvatar) updates.avatar_url = googleAvatar;
      if (googleName) updates.username = googleName;

      const { data: updated } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (updated) return updated as UserProfile;
    }
    return existingProfile as UserProfile;
  }

  // Create new profile for OAuth user
  const username = googleName || (user.email ? user.email.split('@')[0] : 'Akmeos');
  const avatarUrl = googleAvatar || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png";

  const newProfile = {
    id: user.id,
    username: username,
    avatar_url: avatarUrl,
    equipped_title: 'Oracle Légendaire 🔮',
    points: 100,
    level: 1,
    current_streak: 1,
    max_streak: 1,
    quizzes_completed: 0,
    affinity_score: 78,
  };

  const { data: createdProfile, error: createErr } = await supabase
    .from('profiles')
    .insert(newProfile)
    .select()
    .single();

  if (createErr || !createdProfile) {
    console.error('Error auto-creating profile:', createErr);
    return newProfile as UserProfile;
  }

  return createdProfile as UserProfile;
}

// 6. Update User Profile
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile in Supabase:', error);
    return null;
  }
  return data as UserProfile;
}

// 7. Fetch Leaderboard
export async function fetchLeaderboard(): Promise<UserProfile[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('points', { ascending: false })
    .limit(50);

  if (error || !data) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
  return data as UserProfile[];
}

// 7b. Fetch All Users for Admin Panel
export async function fetchAdminUsers(): Promise<UserProfile[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('points', { ascending: false });

  if (error || !data) {
    console.error('Error fetching admin users from Supabase:', error);
    return [];
  }
  return data as UserProfile[];
}

// 8. Submit Quiz Proposal
export async function submitQuizProposal(proposal: {
  userId?: string;
  title: string;
  categoryId: string;
  description: string;
  questionsData: any[];
}) {
  const supabase = createClient();
  const { error } = await supabase.from('proposed_quizzes').insert({
    user_id: proposal.userId || null,
    title: proposal.title,
    category_id: proposal.categoryId,
    description: proposal.description,
    questions_data: proposal.questionsData,
  });

  if (error) {
    console.error('Error submitting quiz proposal:', error);
    throw error;
  }
}

// 9. Admin CRUD: Upsert Category
export async function adminUpsertCategory(category: Category) {
  const supabase = createClient();
  const { error } = await supabase.from('categories').upsert({
    id: category.id,
    title: category.title,
    emoji: category.emoji,
    description: category.description,
    color_class: category.colorClass,
    gradient_class: category.gradientClass || 'from-indigo-400 to-indigo-600',
    total_quizzes: category.totalQuizzes || 0,
  });

  if (error) {
    console.error('Error saving category to Supabase:', error);
    throw error;
  }
}

// 10. Admin CRUD: Delete Category
export async function adminDeleteCategory(categoryId: string) {
  const supabase = createClient();
  const { error } = await supabase.from('categories').delete().eq('id', categoryId);

  if (error) {
    console.error('Error deleting category from Supabase:', error);
    throw error;
  }
}

// 11. Admin CRUD: Upsert Quiz
export async function adminUpsertQuiz(quiz: Quiz) {
  const supabase = createClient();
  const { error } = await supabase.from('quizzes').upsert({
    id: quiz.id,
    category_id: quiz.categoryId,
    title: quiz.title,
    tagline: quiz.tagline,
    description: quiz.description,
    questions_count: quiz.questionsCount,
    estimated_duration: quiz.estimatedDuration,
    difficulty: quiz.difficulty,
    participants_count: quiz.participantsCount || 0,
    points_reward: quiz.pointsReward || 100,
    badge_reward: quiz.badgeReward,
    is_popular: quiz.isPopular || false,
    is_trending: quiz.isTrending || false,
    is_new: quiz.isNew || false,
    image_url: quiz.imageUrl,
    card_bg_class: quiz.cardBgClass,
    badge_bg_class: quiz.badgeBgClass,
    theme_color_class: quiz.themeColorClass,
    text_color_class: quiz.textColorClass,
    text_muted_class: quiz.textMutedClass,
  });

  if (error) {
    console.error('Error saving quiz to Supabase:', error);
    throw error;
  }
}

// 12. Admin CRUD: Delete Quiz
export async function adminDeleteQuiz(quizId: string) {
  const supabase = createClient();
  const { error } = await supabase.from('quizzes').delete().eq('id', quizId);

  if (error) {
    console.error('Error deleting quiz from Supabase:', error);
    throw error;
  }
}
