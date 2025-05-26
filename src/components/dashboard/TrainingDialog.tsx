
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { useTrainings } from '@/hooks/useTrainings';
import { useSystemLogs } from '@/hooks/useSystemLogs';

export const TrainingDialog = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    instructor: ''
  });
  const { createTraining } = useTrainings();
  const { logInfo } = useSystemLogs();

  // Validação em tempo real
  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      errors.push('Título deve ter pelo menos 3 caracteres');
    }
    
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      errors.push('Descrição deve ter pelo menos 10 caracteres');
    }
    
    if (!formData.duration.trim()) {
      errors.push('Duração é obrigatória');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erros quando o usuário começar a digitar
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleSubmit = async () => {
    // Validar formulário
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      logInfo('Tentativa de submissão de formulário de treinamento', 'TrainingDialog.handleSubmit', formData);
      
      const success = await createTraining(formData);
      
      if (success) {
        resetForm();
        setOpen(false);
      }
    } catch (error) {
      console.error('Erro durante submissão:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', duration: '', instructor: '' });
    setValidationErrors([]);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  const isFormValid = formData.title.trim().length >= 3 && 
                     formData.description.trim().length >= 10 && 
                     formData.duration.trim().length > 0;

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
        
        {validationErrors.length > 0 && (
          <div className="bg-destructive/15 border border-destructive/20 rounded-md p-3">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Erros de validação:</span>
            </div>
            <ul className="mt-2 text-sm text-destructive">
              {validationErrors.map((error, index) => (
                <li key={index} className="ml-4">• {error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título do Curso *</Label>
            <Input 
              id="title" 
              placeholder="Digite o título do curso"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={isSubmitting}
              className={validationErrors.some(e => e.includes('Título')) ? 'border-destructive' : ''}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea 
              id="description" 
              placeholder="Descreva o conteúdo do curso..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              disabled={isSubmitting}
              className={validationErrors.some(e => e.includes('Descrição')) ? 'border-destructive' : ''}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="duration">Duração *</Label>
            <Input 
              id="duration" 
              placeholder="Ex: 8 horas, 2 semanas..."
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              disabled={isSubmitting}
              className={validationErrors.some(e => e.includes('Duração')) ? 'border-destructive' : ''}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="instructor">Instrutor</Label>
            <Input 
              id="instructor" 
              placeholder="Nome do instrutor"
              value={formData.instructor}
              onChange={(e) => handleInputChange('instructor', e.target.value)}
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
            disabled={isSubmitting || !isFormValid}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Criando...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Criar Treinamento
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
