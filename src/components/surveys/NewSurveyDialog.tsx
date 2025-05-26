
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const NewSurveyDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    target: '',
    deadline: '',
    anonymous: false
  });

  const handleCreateSurvey = () => {
    if (!formData.title || !formData.type || !formData.target) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Simular criação da pesquisa
    toast({
      title: "Pesquisa criada",
      description: `Pesquisa "${formData.title}" foi criada com sucesso.`,
    });

    setFormData({
      title: '',
      description: '',
      type: '',
      target: '',
      deadline: '',
      anonymous: false
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Pesquisa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Pesquisa</DialogTitle>
          <DialogDescription>
            Configure uma nova pesquisa para sua equipe
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título da Pesquisa *</Label>
            <Input 
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Pesquisa de Satisfação 2024"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva o objetivo da pesquisa..."
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Tipo de Pesquisa *</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({...formData, type: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="satisfaction">Satisfação</SelectItem>
                <SelectItem value="engagement">Engajamento</SelectItem>
                <SelectItem value="climate">Clima Organizacional</SelectItem>
                <SelectItem value="feedback">Feedback 360°</SelectItem>
                <SelectItem value="custom">Personalizada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Público Alvo *</Label>
            <Select 
              value={formData.target} 
              onValueChange={(value) => setFormData({...formData, target: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o público" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os colaboradores</SelectItem>
                <SelectItem value="management">Apenas gestores</SelectItem>
                <SelectItem value="department">Departamento específico</SelectItem>
                <SelectItem value="custom">Seleção personalizada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="deadline">Prazo para Resposta</Label>
            <Input 
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreateSurvey}>
            Criar Pesquisa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
