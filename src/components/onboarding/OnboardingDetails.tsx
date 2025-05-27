
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useOnboarding, OnboardingStep } from '@/hooks/useOnboarding';
import { useGamification } from '@/hooks/useGamification';
import { GamificationPanel } from './GamificationPanel';
import { OnboardingSteps } from './OnboardingSteps';

interface OnboardingDetailsProps {
  process: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OnboardingDetails = ({ process, open, onOpenChange }: OnboardingDetailsProps) => {
  const { getProcessSteps, updateStepStatus } = useOnboarding();
  const { badges, achievements, checkBadgeEligibility, calculateProgress } = useGamification();
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gamificationProgress, setGamificationProgress] = useState(null);

  useEffect(() => {
    if (process?.id && open) {
      loadSteps();
    }
  }, [process?.id, open]);

  const loadSteps = async () => {
    if (!process?.id) return;
    
    setIsLoading(true);
    try {
      const processSteps = await getProcessSteps(process.id);
      setSteps(processSteps);
      
      // Calcular progresso da gamificação
      const progress = calculateProgress(process, processSteps);
      setGamificationProgress(progress);
      
      // Verificar novos badges
      checkBadgeEligibility(progress, process);
    } catch (error) {
      console.error('Erro ao carregar etapas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStep = async (stepId: string, currentCompleted: boolean) => {
    try {
      await updateStepStatus(stepId, !currentCompleted, process.id);
      await loadSteps(); // Recarregar para atualizar gamificação
    } catch (error) {
      console.error('Erro ao atualizar etapa:', error);
    }
  };

  if (!process) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Onboarding - {process.collaborator?.name}</DialogTitle>
          <DialogDescription>
            {process.position} • {process.department}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="progress" className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="progress">Progresso & Gamificação</TabsTrigger>
            <TabsTrigger value="steps">Etapas Detalhadas</TabsTrigger>
          </TabsList>
          
          <div className="overflow-auto max-h-[calc(90vh-200px)]">
            <TabsContent value="progress" className="space-y-6 mt-6">
              {gamificationProgress && (
                <GamificationPanel
                  progress={gamificationProgress}
                  achievements={achievements}
                  availableBadges={badges}
                />
              )}
            </TabsContent>

            <TabsContent value="steps" className="mt-6">
              <OnboardingSteps
                steps={steps}
                onStepToggle={toggleStep}
                progressPercentage={process.progress}
                isLoading={isLoading}
              />
            </TabsContent>
          </div>

          <div className="flex justify-between items-center pt-4 border-t mt-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Iniciado em {new Date(process.start_date).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <Badge className={
              process.status === 'completed' ? 'bg-green-500' :
              process.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500'
            }>
              {process.status === 'completed' ? 'Concluído' :
               process.status === 'in-progress' ? 'Em Andamento' : 'Não Iniciado'}
            </Badge>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
