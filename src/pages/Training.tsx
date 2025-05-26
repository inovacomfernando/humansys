
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
import { TrainingControls } from '@/components/training/TrainingControls';

export const Training = () => {
  const { handleStartCourse, handleViewCourse, handleStatsClick } = useTrainingActions();
  const { trainings, isLoading, error, isUsingCache, refetch, forceRefresh } = useTrainings();

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
