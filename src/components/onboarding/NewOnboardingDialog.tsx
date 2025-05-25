
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface OnboardingProcess {
  id: string;
  collaboratorName: string;
  position: string;
  department: string;
  startDate: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  currentStep: string;
}

export const NewOnboardingDialog = () => {
  const [open, setOpen] = useState(false);
  const [collaborators] = useLocalStorage('collaborators', []);
  const [onboardingProcesses, setOnboardingProcesses] = useLocalStorage('onboarding-processes', []);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    collaboratorId: '',
    position: '',
    department: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleCreateOnboarding = () => {
    if (!formData.collaboratorId || !formData.position || !formData.department) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    const selectedCollaborator = collaborators.find((c: any) => c.id === formData.collaboratorId);
    
    const newProcess: OnboardingProcess = {
      id: Date.now().toString(),
      collaboratorName: selectedCollaborator?.name || 'Colaborador',
      position: formData.position,
      department: formData.department,
      startDate: formData.startDate,
      progress: 0,
      status: 'not-started',
      currentStep: 'Documentação Pessoal'
    };

    setOnboardingProcesses([...onboardingProcesses, newProcess]);
    setFormData({
      collaboratorId: '',
      position: '',
      department: '',
      startDate: new Date().toISOString().split('T')[0]
    });
    setOpen(false);

    toast({
      title: "Onboarding criado",
      description: "Processo de onboarding iniciado com sucesso.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
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
              onValueChange={(value) => setFormData({...formData, collaboratorId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um colaborador" />
              </SelectTrigger>
              <SelectContent>
                {collaborators.map((collaborator: any) => (
                  <SelectItem key={collaborator.id} value={collaborator.id}>
                    {collaborator.name}
                  </SelectItem>
                ))}
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
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="department">Departamento</Label>
            <Input 
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              placeholder="Digite o departamento"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="start-date">Data de Início</Label>
            <Input 
              id="start-date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreateOnboarding}>
            Criar Onboarding
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
