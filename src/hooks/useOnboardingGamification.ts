
import { useState, useEffect } from 'react';
import { OnboardingStep } from './useOnboarding';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  criteria: {
    type: string;
    value: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Achievement {
  id: string;
  badge_id: string;
  earned_at: string;
  points_awarded: number;
}

export interface OnboardingProgress {
  progress_percentage: number;
  completed_steps: number;
  total_steps: number;
  badges_earned: Badge[];
  gamification_score: number;
  current_streak: number;
  estimated_completion: string;
  next_milestone?: Badge;
  performance_rating: 'excellent' | 'good' | 'average' | 'needs_improvement';
  time_spent_minutes: number;
}

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

export const useOnboardingGamification = (processId: string, steps: OnboardingStep[]) => {
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (processId && steps.length > 0) {
      calculateProgress();
    }
  }, [processId, steps]);

  const calculateProgress = async () => {
    try {
      setIsLoading(true);

      const completedSteps = steps.filter(step => step.completed).length;
      const totalSteps = steps.length;
      const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

      // Calcular pontuação de gamificação
      const basePoints = completedSteps * 100;
      const bonusPoints = progressPercentage >= 100 ? 500 : 0;
      const totalScore = basePoints + bonusPoints;

      // Determinar rating de performance
      let performanceRating: 'excellent' | 'good' | 'average' | 'needs_improvement';
      if (progressPercentage >= 90) performanceRating = 'excellent';
      else if (progressPercentage >= 70) performanceRating = 'good';
      else if (progressPercentage >= 50) performanceRating = 'average';
      else performanceRating = 'needs_improvement';

      // Calcular streak atual
      const calculateStreak = () => {
        let streak = 0;
        for (let i = steps.length - 1; i >= 0; i--) {
          if (steps[i].completed) {
            streak++;
          } else {
            break;
          }
        }
        return streak;
      };

      // Estimar data de conclusão
      const calculateEstimatedCompletion = (progress: number) => {
        if (progress >= 100) return new Date().toISOString();
        const remainingSteps = totalSteps - completedSteps;
        const daysToComplete = remainingSteps * 2; // 2 dias por etapa estimado
        return new Date(Date.now() + daysToComplete * 24 * 60 * 60 * 1000).toISOString();
      };

      // Verificar badges conquistados
      const earnedBadges = onboardingBadges.filter(badge => {
        switch (badge.criteria.type) {
          case 'steps_completed':
            return completedSteps >= badge.criteria.value;
          case 'progress_percentage':
            return progressPercentage >= badge.criteria.value;
          case 'speed_completion':
            return completedSteps >= badge.criteria.value && progressPercentage > 75;
          case 'perfect_completion':
            return progressPercentage === 100 && completedSteps === totalSteps;
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
        total_steps: totalSteps,
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

      // Verificar novas conquistas
      await checkForNewAchievements(earnedBadges);

    } catch (error) {
      console.error('Erro ao calcular progresso de gamificação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkForNewAchievements = async (earnedBadges: Badge[]) => {
    try {
      const currentAchievementIds = achievements.map(a => a.badge_id);
      const newBadges = earnedBadges.filter(badge => !currentAchievementIds.includes(badge.id));

      if (newBadges.length > 0) {
        const newAchievements = newBadges.map(badge => ({
          id: `achievement-${Date.now()}-${badge.id}`,
          badge_id: badge.id,
          earned_at: new Date().toISOString(),
          points_awarded: getPointsForBadge(badge.rarity)
        }));

        setAchievements(prev => [...prev, ...newAchievements]);
        console.log('Novas conquistas desbloqueadas:', newAchievements);
      }
    } catch (error) {
      console.error('Erro ao verificar novas conquistas:', error);
    }
  };

  const getPointsForBadge = (rarity: Badge['rarity']): number => {
    switch (rarity) {
      case 'common': return 50;
      case 'rare': return 100;
      case 'epic': return 250;
      case 'legendary': return 500;
      default: return 50;
    }
  };

  const awardBonusPoints = async (points: number, reason: string) => {
    try {
      console.log(`Bonus points awarded: ${points} - ${reason}`);
      
      if (progress) {
        setProgress(prev => prev ? {
          ...prev,
          gamification_score: prev.gamification_score + points
        } : prev);
      }
    } catch (error) {
      console.error('Erro ao conceder pontos bônus:', error);
    }
  };

  const refetch = async () => {
    await calculateProgress();
  };

  return {
    progress,
    achievements,
    availableBadges,
    isLoading,
    awardBonusPoints,
    refetch
  };
};
