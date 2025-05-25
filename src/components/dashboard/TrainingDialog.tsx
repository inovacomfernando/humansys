
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const TrainingDialog = () => {
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    title: '',
    description: '',
    duration: '',
    instructor: ''
  });
  const { toast } = useToast();

  const handleCreateTraining = () => {
    if (!training.title || !training.description || !training.duration) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Salvar treinamento no localStorage
    const trainings = JSON.parse(localStorage.getItem('trainings') || '[]');
    const newTraining = {
      id: Date.now().toString(),
      ...training,
      createdAt: new Date().toISOString(),
      status: 'active',
      participants: 0
    };
    trainings.push(newTraining);
    localStorage.setItem('trainings', JSON.stringify(trainings));

    setTraining({ title: '', description: '', duration: '', instructor: '' });
    setOpen(false);
    
    toast({
      title: "Treinamento criado",
      description: "Novo treinamento foi criado com sucesso.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="duration">Duração *</Label>
            <Input 
              id="duration" 
              placeholder="Ex: 8 horas, 2 semanas..."
              value={training.duration}
              onChange={(e) => setTraining({...training, duration: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="instructor">Instrutor</Label>
            <Input 
              id="instructor" 
              placeholder="Nome do instrutor"
              value={training.instructor}
              onChange={(e) => setTraining({...training, instructor: e.target.value})}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreateTraining}>
            Criar Treinamento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
