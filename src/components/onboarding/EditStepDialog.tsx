
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Edit, Save, X, Video, FileText, Users, Briefcase } from 'lucide-react';
import { OnboardingStep } from '@/hooks/useOnboarding';

interface EditStepDialogProps {
  step: OnboardingStep | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (stepData: Partial<OnboardingStep>) => void;
}

export const EditStepDialog: React.FC<EditStepDialogProps> = ({
  step,
  open,
  onOpenChange,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: step?.title || '',
    description: '',
    type: 'task',
    videoUrl: '',
    required: true,
    estimatedTime: '30',
    dueDate: ''
  });

  React.useEffect(() => {
    if (step) {
      setFormData({
        title: step.title,
        description: '',
        type: 'task',
        videoUrl: '',
        required: true,
        estimatedTime: '30',
        dueDate: ''
      });
    }
  }, [step]);

  const handleSave = () => {
    onSave({
      ...step,
      title: formData.title,
    });
    onOpenChange(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'document': return FileText;
      case 'meeting': return Users;
      case 'task': return Briefcase;
      default: return FileText;
    }
  };

  if (!step) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Editar Etapa</span>
          </DialogTitle>
          <DialogDescription>
            Customize os detalhes desta etapa do onboarding
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Básicas</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Etapa</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Documentação Pessoal"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Etapa</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Tarefa</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="video">
                      <div className="flex items-center space-x-2">
                        <Video className="h-4 w-4" />
                        <span>Vídeo</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="document">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Documento</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="meeting">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Reunião</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o que o colaborador deve fazer nesta etapa..."
                rows={3}
              />
            </div>
          </div>

          {/* Conteúdo Multimídia */}
          {formData.type === 'video' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Conteúdo de Vídeo</h3>
              
              <div className="space-y-2">
                <Label htmlFor="videoUrl">URL do Vídeo</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-sm text-muted-foreground">
                  Suporte para YouTube, Vimeo e links diretos de vídeo
                </p>
              </div>
            </div>
          )}

          {/* Configurações */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Tempo Estimado (min)</Label>
                <Input
                  id="estimatedTime"
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                  placeholder="30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Prazo</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={formData.required}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: checked }))}
              />
              <Label htmlFor="required">Etapa obrigatória</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
