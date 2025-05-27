
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Video, MessageSquare } from 'lucide-react';
import { useOnboarding, OnboardingStep } from '@/hooks/useOnboarding';
import { useGamification } from '@/hooks/useGamification';
import { GamificationPanel } from './GamificationPanel';
import { OnboardingSteps } from './OnboardingSteps';
import { EditStepDialog } from './EditStepDialog';
import { VideoPlayer } from './VideoPlayer';
import { OnboardingProgress } from '@/types/gamification';

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
  const [gamificationProgress, setGamificationProgress] = useState<OnboardingProgress | null>(null);
  const [editStep, setEditStep] = useState<OnboardingStep | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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

  const handleEditStep = (step: OnboardingStep) => {
    setEditStep(step);
    setEditDialogOpen(true);
  };

  const handleSaveStep = (stepData: Partial<OnboardingStep>) => {
    // Implementar lógica de salvamento
    console.log('Salvando etapa:', stepData);
    loadSteps();
  };

  if (!process) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Onboarding - {process.collaborator?.name}</span>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </DialogTitle>
            <DialogDescription>
              {process.position} • {process.department}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="progress" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="progress">Progresso & Gamificação</TabsTrigger>
              <TabsTrigger value="steps">Etapas Interativas</TabsTrigger>
              <TabsTrigger value="feedback">Feedback & Videos</TabsTrigger>
            </TabsList>
            
            <div className="overflow-auto max-h-[calc(95vh-250px)]">
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
                  onStepEdit={handleEditStep}
                  progressPercentage={process.progress}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="feedback" className="mt-6 space-y-6">
                {/* Video Integration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center space-x-2">
                    <Video className="h-5 w-5" />
                    <span>Vídeos de Onboarding</span>
                  </h3>
                  
                  <VideoPlayer
                    url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    title="Bem-vindo à Empresa"
                    onComplete={() => console.log('Vídeo concluído')}
                  />
                </div>

                {/* Real-time Feedback */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Feedback em Tempo Real</span>
                  </h3>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      O sistema de feedback permite que o colaborador avalie cada etapa e forneça comentários instantâneos.
                    </p>
                  </div>
                </div>
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

      <EditStepDialog
        step={editStep}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveStep}
      />
    </>
  );
};
