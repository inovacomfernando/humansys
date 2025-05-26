
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { useTrainingForm } from '@/hooks/useTrainingForm';
import { ValidationErrors } from './training/ValidationErrors';
import { TrainingFormFields } from './training/TrainingFormFields';
import { TrainingDialogActions } from './training/TrainingDialogActions';

export const TrainingDialog = () => {
  const [open, setOpen] = useState(false);
  const {
    formData,
    isSubmitting,
    validationErrors,
    isFormValid,
    handleInputChange,
    handleSubmit,
    resetForm
  } = useTrainingForm();

  const handleFormSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
      setOpen(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    console.log('Dialog open state changed:', newOpen);
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <BookOpen className="mr-2 h-4 w-4" />
          Novo Treinamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Treinamento</DialogTitle>
          <DialogDescription>
            Configure um novo curso de treinamento para os colaboradores
          </DialogDescription>
        </DialogHeader>
        
        <ValidationErrors errors={validationErrors} />
        
        <TrainingFormFields 
          formData={formData}
          validationErrors={validationErrors}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
        />
        
        <TrainingDialogActions
          isSubmitting={isSubmitting}
          isFormValid={isFormValid}
          onCancel={() => handleOpenChange(false)}
          onSubmit={handleFormSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
