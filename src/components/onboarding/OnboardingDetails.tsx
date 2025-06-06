
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Video, MessageSquare, Trophy, Sparkles } from 'lucide-react';
import { useOnboarding, OnboardingStep } from '@/hooks/useOnboarding';
import { useOnboardingGamification } from '@/hooks/useOnboardingGamification';
import { GamificationPanel } from './GamificationPanel';
import { OnboardingSteps } from './OnboardingSteps';
import { EditStepDialog } from './EditStepDialog';
import { VideoPlayer } from './VideoPlayer';
import { useToast } from '@/hooks/use-toast';
import { OnboardingProgress, GamificationStats, LeaderboardEntry } from '@/types/gamification';

interface OnboardingDetailsProps {
  process: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OnboardingDetails = ({ process, open, onOpenChange }: OnboardingDetailsProps) => {
  const { getProcessSteps, updateStepStatus } = useOnboarding();
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editStep, setEditStep] = useState<OnboardingStep | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Integração com gamificação - with protection against process undefined
  const { 
    progress, 
    availableBadges, 
    achievements, 
    awardBonusPoints, 
    refetch: refetchGamification 
  } = useOnboardingGamification(process?.id || '', steps);

  const loadProcessSteps = async () => {
    if (!process?.id) {
      setSteps([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const processSteps = await getProcessSteps(process.id);
      setSteps(Array.isArray(processSteps) ? processSteps : []);
    } catch (error) {
      console.error('Erro ao carregar etapas:', error);
      setSteps([]);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as etapas do onboarding",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (process?.id && open) {
      loadProcessSteps();
    } else {
      setSteps([]);
      setIsLoading(false);
    }
  }, [process?.id, open]);

  const toggleStep = async (stepId: string, currentCompleted: boolean) => {
    if (!process?.id) {
      toast({
        title: "Erro",
        description: "Processo não encontrado",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateStepStatus(stepId, !currentCompleted, process.id);
      await loadProcessSteps();

      // Gamificação: Award bonus points for completing a step
      if (!currentCompleted) {
        awardBonusPoints(50, 'Etapa concluída');
        toast({
          title: "🎉 Etapa Concluída!",
          description: "+50 pontos de gamificação",
        });
      }

      // Atualizar dados de gamificação
      setTimeout(refetchGamification, 100);
    } catch (error) {
      console.error('Erro ao atualizar etapa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a etapa.",
        variant: "destructive"
      });
    }
  };

  const handleEditStep = (step: OnboardingStep) => {
    setEditStep(step);
    setEditDialogOpen(true);
  };

  const handleSaveStep = (stepData: Partial<OnboardingStep>) => {
    console.log('Salvando etapa:', stepData);
    loadProcessSteps();
    refetchGamification();
    toast({
      title: "Etapa atualizada",
      description: "As alterações foram salvas com sucesso",
    });
  };

  const handleVideoComplete = () => {
    // Award bonus for completing video
    awardBonusPoints(25, 'Vídeo assistido');
    toast({
      title: "📹 Vídeo Concluído!",
      description: "+25 pontos de gamificação",
    });
    refetchGamification();
  };

  if (!process) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span>Onboarding - {process.collaborator?.name || 'Colaborador'}</span>
                {progress && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    <Trophy className="h-3 w-3 mr-1" />
                    {progress.gamification_score} pontos
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </DialogTitle>
            <DialogDescription className="flex items-center justify-between">
              <span>{process.position} • {process.department}</span>
              {progress && progress.performance_rating === 'excellent' && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Performance Excelente
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="steps" className="h-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="steps">Etapas</TabsTrigger>
                <TabsTrigger value="gamification">
                  <Trophy className="h-4 w-4 mr-2" />
                  Gamificação
                </TabsTrigger>
                <TabsTrigger value="videos">
                  <Video className="h-4 w-4 mr-2" />
                  Vídeos
                </TabsTrigger>
                <TabsTrigger value="feedback">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Feedback
                </TabsTrigger>
              </TabsList>

              <TabsContent value="steps" className="mt-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <OnboardingSteps 
                    steps={steps}
                    onToggleStep={toggleStep}
                    onEditStep={handleEditStep}
                  />
                )}
              </TabsContent>

              <TabsContent value="gamification" className="mt-6">
                {progress && (
                  <GamificationPanel 
                    progress={progress}
                    achievements={achievements || []}
                    availableBadges={availableBadges || []}
                  />
                )}
              </TabsContent>

              <TabsContent value="videos" className="mt-6">
                <VideoPlayer 
                  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  title="Vídeo de Onboarding"
                  onComplete={handleVideoComplete}
                />
              </TabsContent>

              <TabsContent value="feedback" className="mt-6">
                <div className="p-6 text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Sistema de Feedback</h3>
                  <p>Em desenvolvimento</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
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
