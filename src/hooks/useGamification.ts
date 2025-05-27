
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GamificationStats, Badge, UserAchievement, LeaderboardEntry } from '@/types/gamification';

export const useGamification = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<GamificationStats>({
    totalPoints: 0,
    totalBadges: 0,
    currentStreak: 0,
    longestStreak: 0,
    rank: 0,
    level: 1,
    nextLevelProgress: 0,
    recentAchievements: []
  });
  
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - em produção, isso viria da API
  useEffect(() => {
    const loadGamificationData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock badges
      const mockBadges: Badge[] = [
        {
          id: '1',
          name: 'Primeira Meta',
          description: 'Complete sua primeira meta',
          icon: 'target',
          color: 'bg-blue-500',
          category: 'milestone',
          criteria: { type: 'goals_completed', value: 1 },
          rarity: 'common'
        },
        {
          id: '2',
          name: 'Velocista',
          description: 'Complete um treinamento em menos de 2 horas',
          icon: 'zap',
          color: 'bg-yellow-500',
          category: 'speed',
          criteria: { type: 'training_finished', value: 1 },
          rarity: 'rare'
        },
        {
          id: '3',
          name: 'Perfeccionista',
          description: 'Obtenha nota máxima em 3 treinamentos',
          icon: 'star',
          color: 'bg-purple-500',
          category: 'quality',
          criteria: { type: 'perfect_score', value: 3 },
          rarity: 'epic'
        },
        {
          id: '4',
          name: 'Mentor',
          description: 'Ajude 5 colegas com feedback positivo',
          icon: 'users',
          color: 'bg-green-500',
          category: 'engagement',
          criteria: { type: 'help_others', value: 5 },
          rarity: 'legendary'
        }
      ];
      
      // Mock user achievements
      const mockAchievements: UserAchievement[] = [
        {
          id: '1',
          badge_id: '1',
          user_id: user?.id || '',
          earned_at: new Date().toISOString()
        }
      ];
      
      // Mock stats
      const mockStats: GamificationStats = {
        totalPoints: 1250,
        totalBadges: 1,
        currentStreak: 5,
        longestStreak: 12,
        rank: 8,
        level: 3,
        nextLevelProgress: 65,
        recentAchievements: mockAchievements
      };
      
      // Mock leaderboard
      const mockLeaderboard: LeaderboardEntry[] = [
        {
          user_id: '1',
          name: 'Ana Silva',
          points: 2840,
          badges_count: 8,
          rank: 1,
          department: 'Tecnologia'
        },
        {
          user_id: '2',
          name: 'Carlos Santos',
          points: 2650,
          badges_count: 7,
          rank: 2,
          department: 'Marketing'
        },
        {
          user_id: '3',
          name: 'Maria Oliveira',
          points: 2450,
          badges_count: 6,
          rank: 3,
          department: 'Vendas'
        },
        {
          user_id: '4',
          name: 'João Costa',
          points: 2100,
          badges_count: 5,
          rank: 4,
          department: 'RH'
        },
        {
          user_id: '5',
          name: 'Pedro Lima',
          points: 1890,
          badges_count: 4,
          rank: 5,
          department: 'Financeiro'
        }
      ];
      
      setBadges(mockBadges);
      setUserAchievements(mockAchievements);
      setStats(mockStats);
      setLeaderboard(mockLeaderboard);
      setIsLoading(false);
    };

    if (user) {
      loadGamificationData();
    }
  }, [user]);

  const checkForNewAchievements = async (action: string, value?: number) => {
    // Simular verificação de novas conquistas
    console.log('Checking achievements for action:', action, 'value:', value);
    
    // Em produção, isso faria uma chamada para a API para verificar
    // se o usuário desbloqueou novos badges baseado na ação realizada
  };

  const awardPoints = async (points: number, reason: string) => {
    console.log(`Awarding ${points} points for: ${reason}`);
    
    // Atualizar pontuação local (em produção, enviaria para API)
    setStats(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + points
    }));
  };

  return {
    stats,
    badges,
    userAchievements,
    leaderboard,
    isLoading,
    checkForNewAchievements,
    awardPoints
  };
};
