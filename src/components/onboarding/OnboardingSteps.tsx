
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
  Play
} from 'lucide-react';
import { OnboardingStep } from '@/hooks/useOnboarding';
import { cn } from '@/lib/utils';

interface OnboardingStepsProps {
  steps: OnboardingStep[];
  onStepToggle: (stepId: string, completed: boolean) => void;
  progressPercentage: number;
  isLoading?: boolean;
}

export const OnboardingSteps: React.FC<OnboardingStepsProps> = ({
  steps,
  onStepToggle,
  progressPercentage,
  isLoading = false
}) => {
  const getStepIcon = (index: number, completed: boolean) => {
    const icons = [FileText, Play, Users, Briefcase, Play, Users];
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Etapas do Onboarding</span>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Star className="h-3 w-3" />
            <span>{progressPercentage}% Concluído</span>
          </Badge>
        </CardTitle>
        <Progress value={progressPercentage} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step, index);
          const points = getStepPoints(index, step.completed);
          
          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center space-x-4 p-4 rounded-lg border transition-all",
                step.completed && "bg-green-50 border-green-200",
                status === 'available' && !step.completed && "bg-blue-50 border-blue-200 hover:bg-blue-100",
                status === 'locked' && "bg-gray-50 border-gray-200 opacity-60"
              )}
            >
              {/* Step Number */}
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                step.completed && "bg-green-500 text-white",
                status === 'available' && !step.completed && "bg-blue-500 text-white",
                status === 'locked' && "bg-gray-300 text-gray-600"
              )}>
                {step.completed ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step Icon */}
              <div className="flex-shrink-0">
                {getStepIcon(index, step.completed)}
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <h4 className={cn(
                  "font-medium",
                  step.completed && "text-green-700",
                  status === 'available' && !step.completed && "text-blue-700",
                  status === 'locked' && "text-gray-500"
                )}>
                  {step.title}
                </h4>
                
                <div className="flex items-center space-x-3 mt-1">
                  {step.completed && (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      +{points} pontos
                    </Badge>
                  )}
                  
                  {status === 'available' && !step.completed && (
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {points} pontos disponíveis
                    </Badge>
                  )}
                  
                  {status === 'locked' && (
                    <Badge variant="outline" className="text-gray-500 border-gray-200">
                      Bloqueado
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0">
                {status === 'available' && (
                  <Button
                    size="sm"
                    variant={step.completed ? "outline" : "default"}
                    onClick={() => onStepToggle(step.id, step.completed)}
                    className={cn(
                      "transition-all",
                      step.completed && "hover:bg-red-50 hover:border-red-200 hover:text-red-600"
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
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
