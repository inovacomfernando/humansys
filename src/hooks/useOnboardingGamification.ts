
const onboardingBadges: Badge[] = [
  {
    id: 'first-step',
    name: 'Primeiro Passo',
    description: 'Complete sua primeira etapa do onboarding',
    icon: '🚀',
    color: 'bg-blue-500',
    category: 'milestone',
    criteria: { type: 'steps_completed', value: 1 },
    rarity: 'common'
  },
  {
    id: 'halfway-hero',
    name: 'Herói da Metade',
    description: 'Complete 50% do onboarding',
    icon: '⭐',
    color: 'bg-yellow-500',
    category: 'milestone',
    criteria: { type: 'progress_percentage', value: 50 },
    rarity: 'rare'
  },
  {
    id: 'speed-runner',
    name: 'Velocista',
    description: 'Complete 3 etapas em menos de 30 minutos',
    icon: '⚡',
    color: 'bg-purple-500',
    category: 'speed',
    criteria: { type: 'speed_completion', value: 3 },
    rarity: 'epic'
  },
  {
    id: 'onboarding-champion',
    name: 'Campeão do Onboarding',
    description: 'Complete todo o processo de onboarding',
    icon: '🏆',
    color: 'bg-green-500',
    category: 'milestone',
    criteria: { type: 'progress_percentage', value: 100 },
    rarity: 'legendary'
  },
  {
    id: 'perfectionist',
    name: 'Perfeccionista',
    description: 'Complete todas as etapas sem erros',
    icon: '💎',
    color: 'bg-indigo-500',
    category: 'quality',
    criteria: { type: 'perfect_completion', value: 1 },
    rarity: 'legendary'
  }
];

import { cacheTTLs } from '@/cacheConfig';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingProgress, Badge, Achievement } from '@/types/gamification';
import { OnboardingStep } from '@/hooks/useOnboarding';
import { supabase } from '@/lib/supabaseClient';

export const useOnboardingGamification = (processId: string, steps: OnboardingStep[]) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [availableBadges, setAvailableBadges] = useState<Badge[]>(onboardingBadges);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega achievements do Supabase primeiro, depois calcula progresso
  useEffect(() => {
    if (user && processId && steps.length > 0) {
      (async () => {
        setIsLoading(true);
        await loadExistingAchievements();
        await calculateProgress();
        setIsLoading(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, processId, steps.length]);

  // Busca conquistas do Supabase
  const loadExistingAchievements = async () => {
    if (!user?.id || !processId) return;
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', user.id)
      .eq('process_id', processId);

    if (error) {
      console.error('Erro ao buscar conquistas:', error);
      setAchievements([]);
      return;
    }
    setAchievements((data || []) as Achievement[]);
  };

  // Salva apenas novas conquistas no Supabase
  const saveAchievements = async (newAchievements: Achievement[]) => {
    if (!user?.id || !processId || newAchievements.length === 0) return;
    const { error } = await supabase
      .from('achievements')
      .upsert(newAchievements.map(a => ({
        ...a,
        user_id: user.id,
        process_id: processId,
      })));
    if (error) {
      console.error('Erro ao salvar conquistas:', error);
    }
  };

  // Calcula progresso e badges
  const calculateProgress = async () => {
    const completedSteps = steps.filter(s => s.completed).length;
    const progressPercentage = Math.round((completedSteps / steps.length) * 100);

    let baseScore = completedSteps * 50;
    const timeBonus = progressPercentage > 50 ? 100 : 0;
    const perfectionBonus = progressPercentage === 100 ? 200 : 0;
    const totalScore = baseScore + timeBonus + perfectionBonus;

    let performanceRating: 'excellent' | 'good' | 'average' | 'needs_improvement';
    if (progressPercentage >= 90) performanceRating = 'excellent';
    else if (progressPercentage >= 70) performanceRating = 'good';
    else if (progressPercentage >= 50) performanceRating = 'average';
    else performanceRating = 'needs_improvement';

    const earnedBadges = onboardingBadges.filter(badge => {
      switch (badge.criteria.type) {
        case 'steps_completed':
          return completedSteps >= badge.criteria.value;
        case 'progress_percentage':
          return progressPercentage >= badge.criteria.value;
        case 'speed_completion':
          return completedSteps >= badge.criteria.value && progressPercentage > 75;
        case 'perfect_completion':
          return progressPercentage === 100 && completedSteps === steps.length;
        default:
          return false;
      }
    });

    const nextBadge = onboardingBadges.find(badge =>
      !earnedBadges.some(earned => earned.id === badge.id)
    );

    const progressData: OnboardingProgress = {
      progress_percentage: progressPercentage,
      completed_steps: completedSteps,
      total_steps: steps.length,
      badges_earned: earnedBadges,
      gamification_score: totalScore,
      current_streak: calculateStreak(),
      estimated_completion: calculateEstimatedCompletion(progressPercentage),
      next_milestone: nextBadge,
      performance_rating: performanceRating,
      time_spent_minutes: Math.round(completedSteps * 15)
    };

    setProgress(progressData);
    setAvailableBadges(onboardingBadges);

    // Verifica novas conquistas
    await checkForNewAchievements(earnedBadges);
  };

  const calculateStreak = (): number => {
    let streak = 0;
    for (const step of steps) {
      if (step.completed) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const calculateEstimatedCompletion = (currentProgress: number): string => {
    const remainingProgress = 100 - currentProgress;
    const estimatedDays = Math.ceil(remainingProgress / 20);
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + estimatedDays);
    return completionDate.toISOString();
  };

  // Checa e salva apenas novas conquistas
  const checkForNewAchievements = async (earnedBadges: Badge[]) => {
    const existingAchievementIds = achievements.map(a => a.badge_id);
    const newBadges = earnedBadges.filter(badge =>
      !existingAchievementIds.includes(badge.id)
    );
    if (newBadges.length > 0) {
      const newAchievements: Achievement[] = newBadges.map(badge => ({
        id: `${processId}-${badge.id}-${Date.now()}`,
        badge_id: badge.id,
        user_id: user?.id || '',
        process_id: processId,
        earned_at: new Date().toISOString(),
        badge
      }));
      setAchievements(prev => [...prev, ...newAchievements]);
      await saveAchievements(newAchievements);
      await updateGlobalGamificationScore(newAchievements);
    }
  };

  // Atualiza score global no Supabase
  const updateGlobalGamificationScore = async (newAchievements: Achievement[]) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('gamification')
      .select('*')
      .eq('user_id', user.id)
      .single();
    let currentData = data || {
      user_id: user.id,
      totalPoints: 100,
      totalBadges: 0
    };
    const bonusPoints = newAchievements.reduce((total, achievement) => {
      switch (achievement.badge.rarity) {
        case 'common': return total + 50;
        case 'rare': return total + 100;
        case 'epic': return total + 200;
        case 'legendary': return total + 500;
        default: return total;
      }
    }, 0);

    const updatedData = {
      ...currentData,
      totalPoints: currentData.totalPoints + bonusPoints,
      totalBadges: currentData.totalBadges + newAchievements.length,
    };
    const { error: upsertError } = await supabase
      .from('gamification')
      .upsert([updatedData]);
    if (upsertError) {
      console.error('Erro ao atualizar gamification:', upsertError);
    }
  };

  // Bonus manual
  const awardBonusPoints = async (points: number, reason: string) => {
    if (!user) return;
    const { data } = await supabase
      .from('gamification')
      .select('*')
      .eq('user_id', user.id)
      .single();
    let currentData = data || { user_id: user.id, totalPoints: 100 };
    const updatedData = { ...currentData, totalPoints: currentData.totalPoints + points };
    const { error } = await supabase.from('gamification').upsert([updatedData]);
    if (error) {
      console.error('Erro ao dar pontos bônus:', error);
    }
    setProgress(prev => prev ? { ...prev, gamification_score: prev.gamification_score + points } : null);
  };

  return {
    progress,
    availableBadges,
    achievements,
    isLoading,
    awardBonusPoints,
    refetch: async () => {
      setIsLoading(true);
      await loadExistingAchievements();
      await calculateProgress();
      setIsLoading(false);
    }
  };
};
