
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen } from 'lucide-react';
import { useTrainings } from '@/hooks/useTrainings';

export const TrainingDialog = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [training, setTraining] = useState({
    title: '',
    description: '',
    duration: '',
    instructor: ''
  });
  const { createTraining } = useTrainings();

  const handleCreateTraining = async () => {
    // Validação básica
    if (!training.title.trim() || !training.description.trim() || !training.duration.trim()) {
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      const success = await createTraining({
        title: training.title.trim(),
        description: training.description.trim(),
        duration: training.duration.trim(),
        instructor: training.instructor.trim() || undefined
      });
      
      if (success) {
        // Resetar formulário e fechar dialog
        setTraining({ title: '', description: '', duration: '', instructor: '' });
        setOpen(false);
      }
    } catch (error) {
      console.error('Error in handleCreateTraining:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      setOpen(newOpen);
      if (!newOpen) {
        // Resetar formulário ao fechar
        setTraining({ title: '', description: '', duration: '', instructor: '' });
      }
    }
  };

  const isFormValid = training.title.trim() && training.description.trim() && training.duration.trim();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="justify-start h-auto p-4">
          <BookOpen className="mr-2 h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Novo Treinamento</div>
            <div className="text-xs text-muted-foreground">Criar curso</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Treinamento</DialogTitle>
          <DialogDescription>
            Configure um novo curso de treinamento para os colaboradores
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título do Curso *</Label>
            <Input 
              id="title" 
              placeholder="Digite o título do curso"
              value={training.title}
              onChange={(e) => setTraining({...training, title: e.target.value})}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea 
              id="description" 
              placeholder="Descreva o conteúdo do curso..."
              value={training.description}
              onChange={(e) => setTraining({...training, description: e.target.value})}
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="duration">Duração *</Label>
            <Input 
              id="duration" 
              placeholder="Ex: 8 horas, 2 semanas..."
              value={training.duration}
              onChange={(e) => setTraining({...training, duration: e.target.value})}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="instructor">Instrutor</Label>
            <Input 
              id="instructor" 
              placeholder="Nome do instrutor"
              value={training.instructor}
              onChange={(e) => setTraining({...training, instructor: e.target.value})}
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateTraining}
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? 'Criando...' : 'Criar Treinamento'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
