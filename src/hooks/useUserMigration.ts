
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface MigrationStatus {
  isComplete: boolean;
  needsGamification: boolean;
  needsOnboarding: boolean;
  needsPreferences: boolean;
}

export const useUserMigration = () => {
  const { user } = useAuth();
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({
    isComplete: false,
    needsGamification: false,
    needsOnboarding: false,
    needsPreferences: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkMigrationStatus();
    }
  }, [user]);

  const checkMigrationStatus = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Verificar se o usuário já tem dados de gamificação
      const hasGamificationData = localStorage.getItem(`@humansys:gamification-${user.id}`);
      
      // Verificar se o usuário viu as novidades
      const hasSeenUpdates = localStorage.getItem('@humansys:update-banner-v2.5.0');
      
      // Verificar se tem preferências salvas
      const hasPreferences = localStorage.getItem('@humansys:theme') || localStorage.getItem('@humansys:brand-colors');

      const status: MigrationStatus = {
        isComplete: !!(hasGamificationData && hasSeenUpdates && hasPreferences),
        needsGamification: !hasGamificationData,
        needsOnboarding: !hasSeenUpdates,
        needsPreferences: !hasPreferences
      };

      setMigrationStatus(status);
    } catch (error) {
      console.error('Erro ao verificar status de migração:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeGamificationData = async () => {
    if (!user) return;

    try {
      // Inicializar dados de gamificação para usuários existentes
      const gamificationData = {
        totalPoints: 100, // Pontos iniciais para usuários existentes
        totalBadges: 0,
        currentStreak: 0,
        longestStreak: 0,
        rank: 0,
        level: 1,
        nextLevelProgress: 0,
        recentAchievements: [],
        welcomeBonus: true
      };

      localStorage.setItem(`@humansys:gamification-${user.id}`, JSON.stringify(gamificationData));
      
      // Marcar como migrado
      setMigrationStatus(prev => ({ ...prev, needsGamification: false }));
      
      return true;
    } catch (error) {
      console.error('Erro ao inicializar gamificação:', error);
      return false;
    }
  };

  const initializeDefaultPreferences = async () => {
    if (!user) return;

    try {
      // Configurar preferências padrão
      if (!localStorage.getItem('@humansys:theme')) {
        localStorage.setItem('@humansys:theme', 'light');
      }

      if (!localStorage.getItem('@humansys:brand-colors')) {
        const defaultColors = {
          primary: '#22c55e',
          secondary: '#16a34a'
        };
        localStorage.setItem('@humansys:brand-colors', JSON.stringify(defaultColors));
      }

      if (!localStorage.getItem('@humansys:company-logo')) {
        localStorage.setItem('@humansys:company-logo', 'https://i.imgur.com/xXvzC69.png');
      }

      setMigrationStatus(prev => ({ ...prev, needsPreferences: false }));
      return true;
    } catch (error) {
      console.error('Erro ao inicializar preferências:', error);
      return false;
    }
  };

  const createDefaultOnboardingProcesses = async () => {
    if (!user) return;

    try {
      // Verificar se já existem processos de onboarding
      const { data: existingProcesses } = await supabase
        .from('onboarding_processes')
        .select('id')
        .eq('user_id', user.id);

      // Se não há processos, criar um template básico
      if (!existingProcesses || existingProcesses.length === 0) {
        // Buscar colaboradores existentes
        const { data: collaborators } = await supabase
          .from('collaborators')
          .select('id, name, department, role')
          .eq('user_id', user.id)
          .limit(5); // Criar para os primeiros 5 colaboradores

        if (collaborators && collaborators.length > 0) {
          for (const collaborator of collaborators) {
            const { data: newProcess } = await supabase
              .from('onboarding_processes')
              .insert({
                user_id: user.id,
                collaborator_id: collaborator.id,
                position: collaborator.role,
                department: collaborator.department,
                start_date: new Date().toISOString().split('T')[0],
                status: 'completed', // Marcar como concluído para usuários existentes
                progress: 100
              })
              .select('id')
              .single();

            // Criar etapas padrão
            if (newProcess) {
              await supabase.rpc('create_default_onboarding_steps', {
                process_id: newProcess.id
              });

              // Marcar todas as etapas como concluídas
              await supabase
                .from('onboarding_steps')
                .update({ completed: true })
                .eq('onboarding_process_id', newProcess.id);
            }
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Erro ao criar processos de onboarding:', error);
      return false;
    }
  };

  const runFullMigration = async () => {
    if (!user) return false;

    setIsLoading(true);
    try {
      let success = true;

      if (migrationStatus.needsGamification) {
        success = success && await initializeGamificationData();
      }

      if (migrationStatus.needsPreferences) {
        success = success && await initializeDefaultPreferences();
      }

      // Sempre criar processos de onboarding se necessário
      await createDefaultOnboardingProcesses();

      if (success) {
        setMigrationStatus(prev => ({ 
          ...prev, 
          isComplete: true,
          needsGamification: false,
          needsPreferences: false 
        }));
      }

      return success;
    } catch (error) {
      console.error('Erro durante migração completa:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    migrationStatus,
    isLoading,
    initializeGamificationData,
    initializeDefaultPreferences,
    createDefaultOnboardingProcesses,
    runFullMigration,
    checkMigrationStatus
  };
};
