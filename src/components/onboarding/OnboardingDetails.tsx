
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface OnboardingDetailsProps {
  process: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OnboardingDetails = ({ process, open, onOpenChange }: OnboardingDetailsProps) => {
  const [onboardingProcesses, setOnboardingProcesses] = useLocalStorage('onboarding-processes', []);
  const { toast } = useToast();

  const defaultSteps = [
    { id: '1', title: 'Documentação Pessoal', completed: false },
    { id: '2', title: 'Apresentação da Empresa', completed: false },
    { id: '3', title: 'Reunião com Gestor', completed: false },
    { id: '4', title: 'Treinamento de Segurança', completed: false },
    { id: '5', title: 'Setup do Ambiente', completed: false },
    { id: '6', title: 'Integração com a Equipe', completed: false }
  ];

  const [steps, setSteps] = useState(defaultSteps);

  const toggleStep = (stepId: string) => {
    const updatedSteps = steps.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );
    setSteps(updatedSteps);

    const completedSteps = updatedSteps.filter(step => step.completed).length;
    const progress = Math.round((completedSteps / updatedSteps.length) * 100);
    
    const updatedProcesses = onboardingProcesses.map((p: any) => 
      p.id === process.id 
        ? { 
            ...p, 
            progress,
            status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started',
            currentStep: progress === 100 ? 'Concluído' : updatedSteps.find(s => !s.completed)?.title || 'Concluído'
          } 
        : p
    );
    
    setOnboardingProcesses(updatedProcesses);

    toast({
      title: "Etapa atualizada",
      description: `Progresso: ${progress}%`,
    });
  };

  if (!process) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Onboarding - {process.collaboratorName}</DialogTitle>
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
            {steps.map((step, index) => (
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
                  onClick={() => toggleStep(step.id)}
                >
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">
                Iniciado em {new Date(process.startDate).toLocaleDateString('pt-BR')}
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
