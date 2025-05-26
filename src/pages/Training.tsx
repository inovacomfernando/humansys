
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useTrainingActions } from '@/hooks/useTrainingActions';
import { useTrainings } from '@/hooks/useTrainings';
import { TrainingDialog } from '@/components/dashboard/TrainingDialog';
import { TrainingStats } from '@/components/training/TrainingStats';
import { TrainingGrid } from '@/components/training/TrainingGrid';
import { EmptyTrainingState } from '@/components/training/EmptyTrainingState';
import { LoadingState } from '@/components/training/LoadingState';
import { ErrorState } from '@/components/training/ErrorState';

export const Training = () => {
  const { handleStartCourse, handleViewCourse, handleStatsClick } = useTrainingActions();
  const { trainings, isLoading, error, refetch } = useTrainings();

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error) {
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

          <ErrorState error={error} onRetry={refetch} />
        </div>
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

        <TrainingStats trainings={trainings} onStatsClick={handleStatsClick} />

        {trainings.length === 0 ? (
          <EmptyTrainingState />
        ) : (
          <TrainingGrid 
            trainings={trainings}
            onStartCourse={handleStartCourse}
            onViewCourse={handleViewCourse}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
