
```tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOnboarding } from '@/hooks/useOnboarding';

export const NewOnboardingDialog = () => {
  const [open, setOpen] = useState(false);
  const { collaborators, createProcess, isLoading } = useOnboarding();
  const { toast } = useToast();

  // Garantir que collaborators seja sempre um array
  const safeCollaborators = Array.isArray(collaborators) ? collaborators : [];

  const [formData, setFormData] = useState({
    collaboratorId: '',
    position: '',
    department: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleCreateOnboarding = async () => {
    if (!formData.collaboratorId || !formData.position || !formData.department) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createProcess({
        collaborator_id: formData.collaboratorId,
        position: formData.position,
        department: formData.department,
        start_date: formData.startDate
      });

      setFormData({
        collaboratorId: '',
        position: '',
        department: '',
        startDate: new Date().toISOString().split('T')[0]
      });
      setOpen(false);
    } catch (error) {
      console.error('Erro ao criar onboarding:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o onboarding",
        variant: "destructive"
      });
    }
  };

  const handleCollaboratorChange = (collaboratorId: string) => {
    const selectedCollaborator = safeCollaborators.find(c => c.id === collaboratorId);
    if (selectedCollaborator) {
      setFormData(prev => ({
        ...prev,
        collaboratorId,
        position: selectedCollaborator.role || prev.position,
        department: selectedCollaborator.department || prev.department
      }));
    } else {
      setFormData(prev => ({ ...prev, collaboratorId }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={isLoading}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Onboarding
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Onboarding</DialogTitle>
          <DialogDescription>
            Inicie um novo processo de integração para um colaborador
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Colaborador</Label>
            <Select 
              value={formData.collaboratorId} 
              onValueChange={handleCollaboratorChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um colaborador" />
              </SelectTrigger>
              <SelectContent>
                {safeCollaborators.length > 0 ? (
                  safeCollaborators.map((collaborator) => (
                    <SelectItem key={collaborator.id} value={collaborator.id}>
                      {collaborator.name} - {collaborator.role}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="loading" disabled>
                    {isLoading ? 'Carregando colaboradores...' : 'Nenhum colaborador disponível'}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="position">Cargo</Label>
            <Input 
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              placeholder="Digite o cargo"
              disabled={isLoading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="department">Departamento</Label>
            <Input 
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              placeholder="Digite o departamento"
              disabled={isLoading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="start-date">Data de Início</Label>
            <Input 
              id="start-date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleCreateOnboarding} disabled={isLoading}>
            {isLoading ? 'Criando...' : 'Criar Onboarding'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```
