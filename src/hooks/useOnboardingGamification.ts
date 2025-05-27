import { cacheTTLs } from '@/config/cacheConfig';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingProgress, Badge, Achievement } from '@/types/gamification';
import { OnboardingStep } from '@/hooks/useOnboarding';
import { supabase } from '@/lib/supabaseClient';

export const useOnboardingGamification = (processId: string, steps: OnboardingStep[]) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ... (onboardingBadges igual)

  useEffect(() => {
    if (user && processId && steps.length > 0) {
      calculateProgress();
      loadExistingAchievements();
    }
  }, [user, processId, steps]);

  // Buscar conquistas do Supabase
  const loadExistingAchievements = async () => {
    if (!user?.id || !processId) return;
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', user.id)
      .eq('process_id', processId);
    if (data) setAchievements(data);
  };

  // Salvar conquistas no Supabase
  const saveAchievements = async (updatedAchievements: Achievement[]) => {
    if (!user?.id || !processId) return;
    // Use upsert para inserir ou atualizar
    await supabase
      .from('achievements')
      .upsert(updatedAchievements.map(a => ({
        ...a,
        user_id: user.id,
        process_id: processId,
      })));
  };

  const calculateProgress = () => {
    setIsLoading(true);

    // ... (igual ao seu cálculo original)

    setProgress(progressData);
    setAvailableBadges(onboardingBadges);
    setIsLoading(false);

    // Verificar novas conquistas
    checkForNewAchievements(earnedBadges);
  };

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
        process_id,
        earned_at: new Date().toISOString(),
        badge
      }));

      const updatedAchievements = [...achievements, ...newAchievements];
      setAchievements(updatedAchievements);

      // Salvar no Supabase
      await saveAchievements(updatedAchievements);
      // Atualizar pontuação global...
      await updateGlobalGamificationScore(newAchievements);
    }
  };

  // Exemplo de salvar pontuação global no Supabase
  const updateGlobalGamificationScore = async (newAchievements: Achievement[]) => {
    if (!user) return;
    // Pegue dados atuais:
    const { data, error } = await supabase
      .from('gamification')
      .select('*')
      .eq('user_id', user.id)
      .single();
    let currentData = data || {
      user_id: user.id,
      totalPoints: 100,
      totalBadges: 0,
      // outros campos...
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
      // outros campos...
    };

    await supabase
      .from('gamification')
      .upsert([updatedData]);
  };

  // ...awardBonusPoints também pode ser adaptado para usar Supabase...

  return {
    progress,
    availableBadges,
    achievements,
    isLoading,
    awardBonusPoints: async (points: number, reason: string) => {
      // Atualizar score global no supabase
      if (!user) return;
      const { data } = await supabase
        .from('gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();
      let currentData = data || { user_id: user.id, totalPoints: 100 };
      const updatedData = { ...currentData, totalPoints: currentData.totalPoints + points };
      await supabase.from('gamification').upsert([updatedData]);
      setProgress(prev => prev ? { ...prev, gamification_score: prev.gamification_score + points } : null);
    },
    refetch: calculateProgress
  };
};
