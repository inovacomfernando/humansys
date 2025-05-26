
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useTrainingActions } from '@/hooks/useTrainingActions';
import { useTrainings } from '@/hooks/useTrainings';
import { useTrainingEnrollments } from '@/hooks/useTrainingEnrollments';
import { TrainingDialog } from '@/components/dashboard/TrainingDialog';
import { TrainingEnrollmentDialog } from '@/components/training/TrainingEnrollmentDialog';
import { TrainingStats } from '@/components/training/TrainingStats';
import { TrainingGrid } from '@/components/training/TrainingGrid';
import { EmptyTrainingState } from '@/components/training/EmptyTrainingState';
import { LoadingState } from '@/components/training/LoadingState';
import { ErrorState } from '@/components/training/ErrorState';
import { TrainingControls } from '@/components/training/TrainingControls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Play, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Training = () => {
  const { handleStartCourse, handleViewCourse, handleStatsClick } = useTrainingActions();
  const { trainings, isLoading, error, isUsingCache, refetch, forceRefresh } = useTrainings();
  const { getEnrollmentsByTraining } = useTrainingEnrollments();

  if (isLoading && trainings.length === 0) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Treinamentos</h1>
            <p className="text-muted-foreground">
              Gerencie cursos e desenvolvimento de competências
            </p>
          </div>
          <TrainingDialog />
        </div>

        <TrainingControls
          isLoading={isLoading}
          isUsingCache={isUsingCache}
          error={error}
          onForceRefresh={forceRefresh}
        />

        <TrainingStats trainings={trainings} onStatsClick={handleStatsClick} />

        {error && trainings.length === 0 ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : trainings.length === 0 ? (
          <EmptyTrainingState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trainings.map((training) => {
              const enrollments = getEnrollmentsByTraining(training.id);
              const participantCount = enrollments.length;
              
              return (
                <Card key={training.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{training.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mb-2">
                          {training.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>⏱️ {training.duration}</span>
                          {training.instructor && (
                            <span>👨‍🏫 {training.instructor}</span>
                          )}
                        </div>
                      </div>
                      <Badge variant={training.status === 'active' ? 'default' : 'secondary'}>
                        {training.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-1 h-4 w-4" />
                        {participantCount} participante{participantCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        size="sm" 
                        onClick={() => handleStartCourse(training.id, training.title)}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Iniciar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewCourse(training.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Detalhes
                      </Button>
                      <TrainingEnrollmentDialog 
                        trainingId={training.id} 
                        trainingTitle={training.title}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
