
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

  // Integração com gamificação
  const { 
    progress, 
    availableBadges, 
    achievements, 
    awardBonusPoints, 
    refetch: refetchGamification 
  } = useOnboardingGamification(process?.id || '', steps);

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
    } catch (error) {
      console.error('Erro ao carregar etapas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as etapas do onboarding.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStep = async (stepId: string, currentCompleted: boolean) => {
    try {
      await updateStepStatus(stepId, !currentCompleted, process.id);
      await loadSteps();
      
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
    loadSteps();
    refetchGamification();
  };

  const handleVideoComplete = (stepTitle: string) => {
    // Award bonus for completing video
    awardBonusPoints(25, `Vídeo assistido: ${stepTitle}`);
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
                <span>Onboarding - {process.collaborator?.name}</span>
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
          
          <Tabs defaultValue="progress" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="progress">
                Progresso & Gamificação
                {achievements.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {achievements.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="steps">Etapas Interativas</TabsTrigger>
              <TabsTrigger value="feedback">Feedback & Vídeos</TabsTrigger>
            </TabsList>
            
            <div className="overflow-auto max-h-[calc(95vh-280px)]">
              <TabsContent value="progress" className="space-y-6 mt-6">
                {progress && (
                  <GamificationPanel
                    progress={progress}
                    achievements={achievements}
                    availableBadges={availableBadges}
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
                {/* Vídeos de Onboarding com Gamificação */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center space-x-2">
                    <Video className="h-5 w-5" />
                    <span>Vídeos de Onboarding</span>
                  </h3>
                  
                  <div className="grid gap-4">
                    <VideoPlayer
                      url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      title="Bem-vindo à Empresa"
                      onComplete={() => handleVideoComplete('Bem-vindo à Empresa')}
                    />
                    
                    <VideoPlayer
                      url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      title="Cultura e Valores"
                      onComplete={() => handleVideoComplete('Cultura e Valores')}
                    />
                    
                    <VideoPlayer
                      url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      title="Políticas de Segurança"
                      onComplete={() => handleVideoComplete('Políticas de Segurança')}
                    />
                  </div>
                </div>

                {/* Sistema de Feedback Melhorado */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Feedback em Tempo Real</span>
                  </h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">Pontos Fortes</h4>
                      <p className="text-sm text-green-700">
                        {progress?.performance_rating === 'excellent' 
                          ? 'Excelente progresso! Mantendo alta performance em todas as etapas.'
                          : progress?.performance_rating === 'good'
                          ? 'Bom progresso! Continue assim para alcançar a excelência.'
                          : 'Continue se esforçando para melhorar sua performance.'
                        }
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">Próximos Passos</h4>
                      <p className="text-sm text-blue-700">
                        {progress?.next_milestone 
                          ? `Próxima conquista: ${progress.next_milestone.name}`
                          : 'Todas as conquistas desbloqueadas!'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>

            <div className="flex justify-between items-center pt-4 border-t mt-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Iniciado em {new Date(process.start_date).toLocaleDateString('pt-BR')}
                  {progress && <span className="ml-2">• Tempo dedicado: {progress.time_spent_minutes} minutos</span>}
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
