
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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    instructor: ''
  });
  const { createTraining } = useTrainings();

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.duration) {
      return;
    }

    setIsSubmitting(true);
    
    const success = await createTraining(formData);
    
    if (success) {
      setFormData({ title: '', description: '', duration: '', instructor: '' });
      setOpen(false);
    }
    
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', duration: '', instructor: '' });
  };

  const handleOpenChange = (newOpen: boolean) => {
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
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea 
              id="description" 
              placeholder="Descreva o conteúdo do curso..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="duration">Duração *</Label>
            <Input 
              id="duration" 
              placeholder="Ex: 8 horas, 2 semanas..."
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="instructor">Instrutor</Label>
            <Input 
              id="instructor" 
              placeholder="Nome do instrutor"
              value={formData.instructor}
              onChange={(e) => setFormData({...formData, instructor: e.target.value})}
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
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title || !formData.description || !formData.duration}
          >
            {isSubmitting ? 'Criando...' : 'Criar Treinamento'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
