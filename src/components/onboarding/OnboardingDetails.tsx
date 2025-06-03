
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Video, MessageSquare, Trophy, Sparkles } from 'lucide-react';
import { useOnboarding, OnboardingStep, OnboardingProcess } from '@/hooks/useOnboarding';
import { useToast } from '@/hooks/use-toast';

// Componentes placeholder para evitar erros de importação
const GamificationPanel = ({ progress, availableBadges, achievements }: any) => (
  <div className="p-4 border rounded-lg">
    <h3 className="font-medium mb-2">Gamificação</h3>
    <p className="text-sm text-muted-foreground">Painel de gamificação em desenvolvimento</p>
  </div>
);

const OnboardingSteps = ({ steps, onStepToggle, onStepEdit, progressPercentage, isLoading }: any) => (
  <div className="space-y-4">
    {isLoading ? (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    ) : (
      steps && steps.length > 0 ? (
        steps.map((step: OnboardingStep) => (
          <div key={step.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={step.completed}
                onChange={() => onStepToggle(step.id, step.completed)}
                className="rounded"
              />
              <div>
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {step.type === 'document' && 'Documento'}
                {step.type === 'training' && 'Treinamento'}
                {step.type === 'meeting' && 'Reunião'}
                {step.type === 'task' && 'Tarefa'}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => onStepEdit(step)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma etapa encontrada</p>
        </div>
      )
    )}
  </div>
);

const EditStepDialog = ({ step, open, onOpenChange, onSave }: any) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Etapa</DialogTitle>
        <DialogDescription>
          Modifique as informações da etapa do onboarding
        </DialogDescription>
      </DialogHeader>
      <div className="p-4">
        <p>Editor de etapa em desenvolvimento</p>
        <Button onClick={() => onOpenChange(false)} className="mt-4">
          Fechar
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

const VideoPlayer = ({ videoUrl, onComplete }: any) => (
  <div className="p-4 border rounded-lg">
    <p className="text-sm text-muted-foreground">Player de vídeo em desenvolvimento</p>
    {videoUrl && <p className="text-xs mt-2">URL: {videoUrl}</p>}
  </div>
);

interface OnboardingDetailsProps {
  process: OnboardingProcess | null;
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

  // Validação de segurança no início
  if (!process || typeof process !== 'object') {
    return null;
  }

  // Mock gamification data
  const mockGamificationData = {
    progress: { level: 1, xp: 150, nextLevelXp: 300 },
    availableBadges: [],
    achievements: []
  };

  useEffect(() => {
    if (process?.id && open) {
      loadSteps();
    }
  }, [process?.id, open]);

  const loadSteps = async () => {
    if (!process?.id || typeof process.id !== 'string') {
      setSteps([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const processSteps = await getProcessSteps(process.id);
      const validSteps = Array.isArray(processSteps) ? processSteps.filter(step => 
        step && typeof step === 'object' && step.id
      ) : [];
      setSteps(validSteps);
    } catch (error) {
      console.error('Erro ao carregar etapas:', error);
      setSteps([]);
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
      
      if (!currentCompleted) {
        toast({
          title: "🎉 Etapa Concluída!",
          description: "Parabéns pelo progresso!",
        });
      }
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
  };

  const handleVideoComplete = (stepTitle: string) => {
    toast({
      title: "📹 Vídeo Concluído!",
      description: `Vídeo "${stepTitle}" assistido com sucesso!`,
    });
  };

  // Validação final antes da renderização
  if (!process || !process.id) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{process.collaborator?.name || 'Colaborador'}</span>
              <Badge className={`ml-2 ${
                process.status === 'completed' ? 'bg-green-500' :
                process.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500'
              }`}>
                {process.status === 'completed' ? 'Concluído' :
                 process.status === 'in-progress' ? 'Em Andamento' : 'Não Iniciado'}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {process.position} • {process.department}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="steps">Etapas</TabsTrigger>
              <TabsTrigger value="gamification">Gamificação</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Informações do Colaborador</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nome:</strong> {process.collaborator?.name || 'N/A'}</p>
                      <p><strong>Email:</strong> {process.collaborator?.email || 'N/A'}</p>
                      <p><strong>Cargo:</strong> {process.position || 'N/A'}</p>
                      <p><strong>Departamento:</strong> {process.department || 'N/A'}</p>
                      <p><strong>Data de Início:</strong> {
                        process.start_date ? new Date(process.start_date).toLocaleDateString('pt-BR') : 'N/A'
                      }</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Progresso do Onboarding</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>{process.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${process.progress || 0}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Etapa Atual: {process.current_step || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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

            <TabsContent value="gamification" className="mt-6">
              <GamificationPanel
                progress={mockGamificationData.progress}
                availableBadges={mockGamificationData.availableBadges}
                achievements={mockGamificationData.achievements}
              />
            </TabsContent>

            <TabsContent value="feedback" className="mt-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Feedback do Colaborador</h3>
                  <p className="text-sm text-muted-foreground">
                    Sistema de feedback em desenvolvimento
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {editStep && (
        <EditStepDialog
          step={editStep}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSaveStep}
        />
      )}
    </>
  );
};
