
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingProgress, Badge, Achievement } from '@/types/gamification';
import { OnboardingStep } from '@/hooks/useOnboarding';

export const useOnboardingGamification = (processId: string, steps: OnboardingStep[]) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Badges disponíveis no onboarding
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

  useEffect(() => {
    if (user && processId && steps.length > 0) {
      calculateProgress();
      loadExistingAchievements();
    }
  }, [user, processId, steps]);

  const calculateProgress = () => {
    setIsLoading(true);

    const completedSteps = steps.filter(s => s.completed).length;
    const progressPercentage = Math.round((completedSteps / steps.length) * 100);
    
    // Calcular pontuação base
    let baseScore = completedSteps * 50; // 50 pontos por etapa
    
    // Bonus por velocidade (simulado)
    const timeBonus = progressPercentage > 50 ? 100 : 0;
    
    // Bonus por perfeição (simulado)
    const perfectionBonus = progressPercentage === 100 ? 200 : 0;
    
    const totalScore = baseScore + timeBonus + perfectionBonus;

    // Determinar performance rating
    let performanceRating: 'excellent' | 'good' | 'average' | 'needs_improvement';
    if (progressPercentage >= 90) performanceRating = 'excellent';
    else if (progressPercentage >= 70) performanceRating = 'good';
    else if (progressPercentage >= 50) performanceRating = 'average';
    else performanceRating = 'needs_improvement';

    // Calcular badges earned baseado no progresso
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

    // Próximo marco
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
      time_spent_minutes: Math.round(completedSteps * 15) // Simulado: 15 min por etapa
    };

    setProgress(progressData);
    setAvailableBadges(onboardingBadges);
    setIsLoading(false);

    // Verificar novas conquistas
    checkForNewAchievements(earnedBadges);
  };

  const calculateStreak = (): number => {
    // Simular sequência baseada em etapas consecutivas completadas
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
    const estimatedDays = Math.ceil(remainingProgress / 20); // 20% por dia estimado
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + estimatedDays);
    return completionDate.toISOString();
  };

  const loadExistingAchievements = () => {
    // Carregar conquistas existentes do localStorage
    const savedAchievements = localStorage.getItem(`@humansys:achievements-${user?.id}-${processId}`);
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  };

  const checkForNewAchievements = (earnedBadges: Badge[]) => {
    const existingAchievementIds = achievements.map(a => a.badge_id);
    const newBadges = earnedBadges.filter(badge => 
      !existingAchievementIds.includes(badge.id)
    );

    if (newBadges.length > 0) {
      const newAchievements: Achievement[] = newBadges.map(badge => ({
        id: `${processId}-${badge.id}-${Date.now()}`,
        badge_id: badge.id,
        user_id: user?.id || '',
        earned_at: new Date().toISOString(),
        badge
      }));

      const updatedAchievements = [...achievements, ...newAchievements];
      setAchievements(updatedAchievements);
      
      // Salvar no localStorage
      localStorage.setItem(
        `@humansys:achievements-${user?.id}-${processId}`, 
        JSON.stringify(updatedAchievements)
      );

      // Atualizar pontuação global de gamificação
      updateGlobalGamificationScore(newAchievements);
    }
  };

  const updateGlobalGamificationScore = (newAchievements: Achievement[]) => {
    if (!user) return;

    const gamificationData = localStorage.getItem(`@humansys:gamification-${user.id}`);
    const currentData = gamificationData ? JSON.parse(gamificationData) : {
      totalPoints: 100,
      totalBadges: 0,
      currentStreak: 0,
      longestStreak: 0,
      rank: 0,
      level: 1,
      nextLevelProgress: 0,
      recentAchievements: []
    };

    // Adicionar pontos pelas novas conquistas
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
      recentAchievements: [...newAchievements, ...currentData.recentAchievements].slice(0, 5)
    };

    localStorage.setItem(`@humansys:gamification-${user.id}`, JSON.stringify(updatedData));
  };

  const awardBonusPoints = (points: number, reason: string) => {
    if (!user || !progress) return;

    setProgress(prev => prev ? {
      ...prev,
      gamification_score: prev.gamification_score + points
    } : null);

    // Atualizar pontuação global também
    const gamificationData = localStorage.getItem(`@humansys:gamification-${user.id}`);
    if (gamificationData) {
      const currentData = JSON.parse(gamificationData);
      const updatedData = {
        ...currentData,
        totalPoints: currentData.totalPoints + points
      };
      localStorage.setItem(`@humansys:gamification-${user.id}`, JSON.stringify(updatedData));
    }
  };

  return {
    progress,
    availableBadges,
    achievements,
    isLoading,
    awardBonusPoints,
    refetch: calculateProgress
  };
};
