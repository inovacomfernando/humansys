
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MigrationStatus {
  isComplete: boolean;
  needsGamification: boolean;
  needsOnboarding: boolean;
  needsPreferences: boolean;
  migratedAt?: string;
}

export const useUserMigration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
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
      
      // Verificar se já foi migrado anteriormente
      const migrationRecord = localStorage.getItem('@humansys:migration-status');
      const migrationData = migrationRecord ? JSON.parse(migrationRecord) : null;

      const status: MigrationStatus = {
        isComplete: !!(migrationData?.isComplete || (hasGamificationData && hasSeenUpdates && hasPreferences)),
        needsGamification: !hasGamificationData,
        needsOnboarding: !hasSeenUpdates,
        needsPreferences: !hasPreferences,
        migratedAt: migrationData?.migratedAt
      };

      setMigrationStatus(status);
    } catch (error) {
      console.error('Erro ao verificar status de migração:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeGamificationData = async (retroactivePoints?: number) => {
    if (!user) return;

    try {
      // Pontos iniciais para usuários existentes com bonus retroativos
      const initialPoints = retroactivePoints || 100;
      
      // Determinar nível baseado nos pontos
      const level = calculateLevelFromPoints(initialPoints);
      const nextLevelThreshold = level * 1000;
      const currentLevelThreshold = (level - 1) * 1000;
      const nextLevelProgress = Math.floor(
        ((initialPoints - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100
      );

      // Inicializar dados de gamificação para usuários existentes
      const gamificationData = {
        totalPoints: initialPoints,
        totalBadges: 0,
        currentStreak: 0,
        longestStreak: 0,
        rank: 0,
        level,
        nextLevelProgress,
        recentAchievements: [],
        welcomeBonus: true
      };

      localStorage.setItem(`@humansys:gamification-${user.id}`, JSON.stringify(gamificationData));
      
      // Marcar como migrado
      setMigrationStatus(prev => ({ ...prev, needsGamification: false }));
      
      toast({
        title: "🎮 Gamificação Ativada!",
        description: `Você recebeu ${initialPoints} pontos iniciais!`,
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao inicializar gamificação:', error);
      return false;
    }
  };
  
  const calculateLevelFromPoints = (points: number): number => {
    return Math.max(1, Math.floor(points / 1000) + 1);
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
      const { data: existingProcesses, error: fetchError } = await supabase
        .from('onboarding_processes')
        .select('id')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      // Se não há processos, criar um template básico
      if (!existingProcesses || existingProcesses.length === 0) {
        // Buscar colaboradores existentes
        const { data: collaborators, error: colError } = await supabase
          .from('collaborators')
          .select('id, name, department, role')
          .eq('user_id', user.id)
          .limit(5); // Criar para os primeiros 5 colaboradores

        if (colError) throw colError;

        if (collaborators && collaborators.length > 0) {
          let pointsAwarded = 0;
          
          for (const collaborator of collaborators) {
            const { data: newProcess, error: processError } = await supabase
              .from('onboarding_processes')
              .insert({
                user_id: user.id,
                collaborator_id: collaborator.id,
                position: collaborator.role || 'Colaborador',
                department: collaborator.department || 'Geral',
                start_date: new Date().toISOString().split('T')[0],
                status: 'completed', // Marcar como concluído para usuários existentes
                progress: 100,
                current_step: 'Concluído'
              })
              .select('id')
              .single();

            if (processError) {
              console.error('Erro ao criar processo:', processError);
              continue;
            }

            if (newProcess) {
              // Criar etapas padrão usando função RPC
              await supabase.rpc('create_default_onboarding_steps', {
                process_id: newProcess.id
              });

              // Marcar todas as etapas como concluídas
              await supabase
                .from('onboarding_steps')
                .update({ completed: true })
                .eq('onboarding_process_id', newProcess.id);
              
              // Incrementar pontos retroativos
              pointsAwarded += 200; // 200 pontos por cada onboarding retroativo
            }
          }
          
          // Adicionar pontos de gamificação retroativos
          if (pointsAwarded > 0) {
            await initializeGamificationData(pointsAwarded);
            
            toast({
              title: "✨ Onboarding Retroativo Criado!",
              description: `Você recebeu ${pointsAwarded} pontos pelos processos passados.`,
            });
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
      let totalPoints = 0;
      
      // Primeiro criar processos de onboarding para ter pontos retroativos
      await createDefaultOnboardingProcesses();
      
      // Processos existentes dão pontos retroativos
      const { data: processes } = await supabase
        .from('onboarding_processes')
        .select('id')
        .eq('user_id', user.id);
      
      totalPoints += (processes?.length || 0) * 200;
      
      // Colaboradores existentes também dão pontos
      const { data: collaborators } = await supabase
        .from('collaborators')
        .select('id')
        .eq('user_id', user.id);
      
      totalPoints += (collaborators?.length || 0) * 50;
      
      // Documentos existentes também dão pontos
      const { data: documents } = await supabase
        .from('documents')
        .select('id')
        .eq('user_id', user.id);
      
      totalPoints += (documents?.length || 0) * 25;

      if (migrationStatus.needsGamification) {
        success = success && await initializeGamificationData(Math.max(totalPoints, 100));
      }

      if (migrationStatus.needsPreferences) {
        success = success && await initializeDefaultPreferences();
      }

      if (success) {
        // Salvar status da migração
        const migrationData = {
          isComplete: true,
          migratedAt: new Date().toISOString(),
          retroactivePoints: totalPoints,
          userId: user.id
        };
        
        localStorage.setItem('@humansys:migration-status', JSON.stringify(migrationData));
        
        setMigrationStatus(prev => ({ 
          ...prev, 
          isComplete: true,
          needsGamification: false,
          needsPreferences: false,
          migratedAt: migrationData.migratedAt
        }));
        
        // Marcar que viu as atualizações
        localStorage.setItem('@humansys:update-banner-v2.5.0', 'true');
        
        toast({
          title: "✅ Migração Concluída!",
          description: "Seu sistema foi atualizado com todas as novas funcionalidades.",
        });
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
