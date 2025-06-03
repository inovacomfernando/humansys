
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  PlayCircle, 
  Star,
  FileText,
  Users,
  Briefcase,
  Play,
  Edit,
  Video,
  Trophy,
  Zap,
  Target
} from 'lucide-react';
import { OnboardingStep } from '@/hooks/useOnboarding';
import { cn } from '@/lib/utils';

interface OnboardingStepsProps {
  steps: OnboardingStep[];
  onStepToggle: (stepId: string, completed: boolean) => void;
  onStepEdit?: (step: OnboardingStep) => void;
  progressPercentage: number;
  isLoading?: boolean;
}

export const OnboardingSteps: React.FC<OnboardingStepsProps> = ({
  steps,
  onStepToggle,
  onStepEdit,
  progressPercentage,
  isLoading = false
}) => {
  const getStepIcon = (index: number, completed: boolean) => {
    const icons = [FileText, Play, Users, Briefcase, Video, Trophy];
    const IconComponent = icons[index % icons.length];
    
    if (completed) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    
    return <IconComponent className="h-5 w-5 text-muted-foreground" />;
  };

  const getStepStatus = (step: OnboardingStep, index: number) => {
    if (step.completed) return 'completed';
    if (index === 0 || steps[index - 1]?.completed) return 'available';
    return 'locked';
  };

  const getStepPoints = (index: number, completed: boolean) => {
    const basePoints = (index + 1) * 10;
    return completed ? basePoints : 0;
  };

  const getCompletionAnimation = (completed: boolean) => {
    return completed ? 'animate-[scale-in_0.3s_ease-out]' : '';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Etapas do Onboarding</span>
          </div>
          <Badge variant="secondary" className="flex items-center space-x-1 bg-white/80">
            <Star className="h-3 w-3" />
            <span>{progressPercentage}% Concluído</span>
          </Badge>
        </CardTitle>
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {steps.filter(s => s.completed).length} de {steps.length} etapas concluídas
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 p-6">
        {steps.map((step, index) => {
          const status = getStepStatus(step, index);
          const points = getStepPoints(index, step.completed);
          
          return (
            <div
              key={step.id}
              className={cn(
                "group relative flex items-center space-x-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-md",
                step.completed && "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm",
                status === 'available' && !step.completed && "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300",
                status === 'locked' && "bg-gray-50 border-gray-200 opacity-60",
                getCompletionAnimation(step.completed)
              )}
            >
              {/* Progress Indicator */}
              <div className="relative">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-300",
                  step.completed && "bg-green-500 text-white scale-110",
                  status === 'available' && !step.completed && "bg-blue-500 text-white",
                  status === 'locked' && "bg-gray-300 text-gray-600"
                )}>
                  {step.completed ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                {/* Gamification Effect */}
                {step.completed && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                      <Star className="h-2 w-2 text-yellow-800" />
                    </div>
                  </div>
                )}
              </div>

              {/* Step Icon */}
              <div className="flex-shrink-0">
                {getStepIcon(index, step.completed)}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={cn(
                      "font-medium transition-colors",
                      step.completed && "text-green-700",
                      status === 'available' && !step.completed && "text-blue-700",
                      status === 'locked' && "text-gray-500"
                    )}>
                      {step.title}
                    </h4>
                    
                    <div className="flex items-center space-x-3 mt-2">
                      {/* Status Badge */}
                      {step.completed && (
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                          <Trophy className="h-3 w-3 mr-1" />
                          +{points} pontos
                        </Badge>
                      )}
                      
                      {status === 'available' && !step.completed && (
                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                          <Zap className="h-3 w-3 mr-1" />
                          {points} pontos disponíveis
                        </Badge>
                      )}
                      
                      {status === 'locked' && (
                        <Badge variant="outline" className="text-gray-500 border-gray-200">
                          <Clock className="h-3 w-3 mr-1" />
                          Bloqueado
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {/* Edit Button */}
                {onStepEdit && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onStepEdit(step)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                
                {/* Action Button */}
                {status === 'available' && (
                  <Button
                    size="sm"
                    variant={step.completed ? "outline" : "default"}
                    onClick={() => onStepToggle(step.id, step.completed)}
                    className={cn(
                      "transition-all duration-300",
                      step.completed && "hover:bg-red-50 hover:border-red-200 hover:text-red-600",
                      !step.completed && "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    )}
                  >
                    {step.completed ? (
                      <>
                        <Circle className="h-4 w-4 mr-1" />
                        Desfazer
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Iniciar
                      </>
                    )}
                  </Button>
                )}
                
                {status === 'locked' && (
                  <Button size="sm" variant="ghost" disabled>
                    <Clock className="h-4 w-4 mr-1" />
                    Aguardando
                  </Button>
                )}
              </div>

              {/* Completion Effect */}
              {step.completed && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-2 right-2 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, FileText, Play, Users, Briefcase, Edit } from 'lucide-react';
import { OnboardingStep } from '@/hooks/useOnboarding';

interface OnboardingStepsProps {
  steps: OnboardingStep[];
  onStepToggle: (stepId: string, currentCompleted: boolean) => void;
  onStepEdit: (step: OnboardingStep) => void;
  progressPercentage: number;
  isLoading: boolean;
}

export const OnboardingSteps = ({ 
  steps, 
  onStepToggle, 
  onStepEdit, 
  progressPercentage, 
  isLoading 
}: OnboardingStepsProps) => {
  const getStepIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'training': return Play;
      case 'meeting': return Users;
      case 'task': return Briefcase;
      default: return FileText;
    }
  };

  const getStepStatusBadge = (step: OnboardingStep) => {
    if (step.completed) {
      return <Badge className="bg-green-500">Concluído</Badge>;
    }
    if (step.status === 'in-progress') {
      return <Badge className="bg-blue-500">Em Andamento</Badge>;
    }
    return <Badge variant="outline">Pendente</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!steps || steps.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma etapa encontrada</h3>
            <p className="text-muted-foreground">Este processo ainda não possui etapas configuradas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Progresso Geral</span>
            <span className="text-2xl font-bold">{progressPercentage}%</span>
          </CardTitle>
          <CardDescription>
            {steps.filter(s => s.completed).length} de {steps.length} etapas concluídas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Steps List */}
      <div className="space-y-4">
        {steps
          .sort((a, b) => a.order - b.order)
          .map((step) => {
            const Icon = getStepIcon(step.type);
            
            return (
              <Card key={step.id} className={`transition-all ${step.completed ? 'bg-green-50 border-green-200' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        step.completed ? 'bg-green-500 text-white' : 'bg-muted'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {step.description}
                        </CardDescription>
                        {step.due_date && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Prazo: {new Date(step.due_date).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                        {step.completed_at && (
                          <p className="text-xs text-green-600 mt-2">
                            Concluído em: {new Date(step.completed_at).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStepStatusBadge(step)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStepEdit(step)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge variant="outline">
                        {step.type === 'document' && 'Documento'}
                        {step.type === 'training' && 'Treinamento'}
                        {step.type === 'meeting' && 'Reunião'}
                        {step.type === 'task' && 'Tarefa'}
                      </Badge>
                    </div>
                    <Button
                      variant={step.completed ? "outline" : "default"}
                      size="sm"
                      onClick={() => onStepToggle(step.id, step.completed || false)}
                    >
                      {step.completed ? 'Marcar como Pendente' : 'Marcar como Concluído'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};
