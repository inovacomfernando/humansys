
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Badge, Achievement, OnboardingProgress, GamificationStats } from '@/types/gamification';

const DEFAULT_BADGES: Badge[] = [
  {
    id: 'first-steps',
    name: 'Primeiros Passos',
    description: 'Complete suas primeiras 3 etapas',
    icon: '🚀',
    color: 'bg-blue-500',
    category: 'milestone',
    criteria: { type: 'steps_completed', value: 3 }
  },
  {
    id: 'halfway-hero',
    name: 'Meio Caminho',
    description: 'Complete 50% do onboarding',
    icon: '⭐',
    color: 'bg-yellow-500',
    category: 'milestone',
    criteria: { type: 'steps_completed', value: 50 }
  },
  {
    id: 'onboarding-champion',
    name: 'Campeão do Onboarding',
    description: 'Complete 100% do processo',
    icon: '🏆',
    color: 'bg-gold-500',
    category: 'milestone',
    criteria: { type: 'steps_completed', value: 100 }
  },
  {
    id: 'speed-runner',
    name: 'Velocista',
    description: 'Complete o onboarding em menos de 3 dias',
    icon: '⚡',
    color: 'bg-purple-500',
    category: 'speed',
    criteria: { type: 'time_to_complete', value: 3 }
  },
  {
    id: 'perfectionist',
    name: 'Perfeccionista',
    description: 'Complete todas as etapas sem pular nenhuma',
    icon: '💎',
    color: 'bg-green-500',
    category: 'quality',
    criteria: { type: 'perfect_score', value: 100 }
  },
  {
    id: 'team-player',
    name: 'Jogador de Equipe',
    description: 'Participe de todas as reuniões de integração',
    icon: '🤝',
    color: 'bg-indigo-500',
    category: 'engagement',
    criteria: { type: 'help_others', value: 1 }
  }
];

export const useGamification = () => {
  const [badges] = useState<Badge[]>(DEFAULT_BADGES);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<GamificationStats>({
    totalBadges: 0,
    recentAchievements: [],
    leaderboardPosition: 1,
    overallScore: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const checkBadgeEligibility = (progress: OnboardingProgress, processData: any) => {
    const newAchievements: Achievement[] = [];
    
    badges.forEach(badge => {
      const alreadyEarned = achievements.some(a => a.badge_id === badge.id);
      if (alreadyEarned) return;

      let eligible = false;
      
      switch (badge.criteria.type) {
        case 'steps_completed':
          if (badge.criteria.value <= 50) {
            eligible = progress.completed_steps >= badge.criteria.value;
          } else {
            eligible = progress.progress_percentage >= badge.criteria.value;
          }
          break;
        case 'time_to_complete':
          if (processData.status === 'completed') {
            const startDate = new Date(processData.start_date);
            const endDate = new Date();
            const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
            eligible = daysDiff <= badge.criteria.value;
          }
          break;
        case 'perfect_score':
          eligible = progress.progress_percentage === 100 && progress.completed_steps === progress.total_steps;
          break;
        case 'help_others':
          eligible = progress.completed_steps >= 4; // Assumindo que reuniões são etapas 4+
          break;
      }

      if (eligible) {
        const achievement: Achievement = {
          id: `achievement_${Date.now()}_${Math.random()}`,
          badge_id: badge.id,
          user_id: user?.id || '',
          earned_at: new Date().toISOString(),
          process_id: progress.process_id
        };
        newAchievements.push(achievement);
      }
    });

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      
      // Mostrar toast para novos badges
      newAchievements.forEach(achievement => {
        const badge = badges.find(b => b.id === achievement.badge_id);
        if (badge) {
          toast({
            title: "🎉 Novo Badge Conquistado!",
            description: `${badge.icon} ${badge.name} - ${badge.description}`
          });
        }
      });
      
      return newAchievements;
    }
    
    return [];
  };

  const calculateProgress = (processData: any, steps: any[]): OnboardingProgress => {
    const totalSteps = steps.length;
    const completedSteps = steps.filter(step => step.completed).length;
    const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    
    const earnedBadges = badges.filter(badge => 
      achievements.some(achievement => achievement.badge_id === badge.id)
    );

    return {
      id: `progress_${processData.id}`,
      process_id: processData.id,
      total_steps: totalSteps,
      completed_steps: completedSteps,
      progress_percentage: progressPercentage,
      badges_earned: earnedBadges,
      current_streak: completedSteps,
      estimated_completion: calculateEstimatedCompletion(processData, progressPercentage),
      gamification_score: calculateGamificationScore(completedSteps, earnedBadges.length)
    };
  };

  const calculateEstimatedCompletion = (processData: any, progressPercentage: number) => {
    const startDate = new Date(processData.start_date);
    const now = new Date();
    const daysElapsed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    
    if (progressPercentage === 0) {
      const estimatedDate = new Date(now);
      estimatedDate.setDate(estimatedDate.getDate() + 7); // Default 7 days
      return estimatedDate.toISOString();
    }
    
    const totalEstimatedDays = Math.ceil((daysElapsed / progressPercentage) * 100);
    const remainingDays = totalEstimatedDays - daysElapsed;
    
    const estimatedDate = new Date(now);
    estimatedDate.setDate(estimatedDate.getDate() + Math.max(remainingDays, 0));
    
    return estimatedDate.toISOString();
  };

  const calculateGamificationScore = (completedSteps: number, badgesCount: number) => {
    return (completedSteps * 10) + (badgesCount * 50);
  };

  const updateStats = () => {
    setStats({
      totalBadges: achievements.length,
      recentAchievements: achievements.slice(-3),
      leaderboardPosition: Math.floor(Math.random() * 10) + 1, // Mock leaderboard
      overallScore: achievements.length * 50 + (achievements.length * 10)
    });
  };

  useEffect(() => {
    if (user) {
      updateStats();
      setIsLoading(false);
    }
  }, [user, achievements]);

  return {
    badges,
    achievements,
    stats,
    isLoading,
    checkBadgeEligibility,
    calculateProgress,
    updateStats
  };
};
