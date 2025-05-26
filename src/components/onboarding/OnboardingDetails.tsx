
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Play } from 'lucide-react';
import { useOnboarding, OnboardingStep } from '@/hooks/useOnboarding';

interface OnboardingDetailsProps {
  process: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OnboardingDetails = ({ process, open, onOpenChange }: OnboardingDetailsProps) => {
  const { getProcessSteps, updateStepStatus } = useOnboarding();
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStep = async (stepId: string, currentCompleted: boolean) => {
    try {
      await updateStepStatus(stepId, !currentCompleted, process.id);
      // Recarregar etapas para refletir mudanças
      await loadSteps();
    } catch (error) {
      console.error('Erro ao atualizar etapa:', error);
    }
  };

  if (!process) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Onboarding - {process.collaborator?.name}</DialogTitle>
          <DialogDescription>
            {process.position} • {process.department}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progresso Geral</span>
              <span className="text-sm text-muted-foreground">{process.progress}%</span>
            </div>
            <Progress value={process.progress} className="h-2" />
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Etapas do Onboarding</h4>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
                    <span className="text-xs font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{step.title}</h5>
                  </div>
                  <Button
                    size="sm"
                    variant={step.completed ? "default" : "outline"}
                    onClick={() => toggleStep(step.id, step.completed)}
                  >
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
