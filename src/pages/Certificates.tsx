
import React, { useState, Suspense, lazy } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Award, Download, Eye, Calendar, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCertificateTemplates } from '@/hooks/useCertificateTemplates';
import { useCollaborators } from '@/hooks/useCollaborators';

// Fix lazy loading import to use proper default export syntax
const CertificateTemplateDialog = lazy(() => import('@/components/certificates/CertificateTemplateDialog').then(module => ({ default: module.CertificateTemplateDialog })));

export const Certificates = () => {
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { templates, generateCertificate, deleteTemplate } = useCertificateTemplates();
  const { collaborators } = useCollaborators();

  const [certificateForm, setCertificateForm] = useState({
    template: '',
    collaborator: '',
    course: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleGenerateCertificate = async () => {
    if (!certificateForm.template || !certificateForm.collaborator) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione template e colaborador.",
        variant: "destructive"
      });
      return;
    }

    const success = await generateCertificate(
      certificateForm.template, 
      certificateForm.collaborator
    );

    if (success) {
      setCertificateForm({
        template: '',
        collaborator: '',
        course: '',
        date: new Date().toISOString().split('T')[0]
      });
      setGenerateDialogOpen(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (confirm('Tem certeza que deseja excluir este template?')) {
      await deleteTemplate(templateId);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Certificados</h1>
            <p className="text-muted-foreground">
              Gerencie templates e gere certificados de conclusão
            </p>
          </div>
          <div className="flex gap-2">
            <Suspense fallback={<div>Loading...</div>}>
              <CertificateTemplateDialog />
            </Suspense>
            <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Gerar Certificado
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Gerar Novo Certificado</DialogTitle>
                  <DialogDescription>
                    Configure os dados para gerar um novo certificado
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Template</Label>
                    <Select 
                      value={certificateForm.template} 
                      onValueChange={(value) => setCertificateForm({...certificateForm, template: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Colaborador</Label>
                    <Select 
                      value={certificateForm.collaborator} 
                      onValueChange={(value) => setCertificateForm({...certificateForm, collaborator: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o colaborador" />
                      </SelectTrigger>
                      <SelectContent>
                        {collaborators.map((collaborator) => (
                          <SelectItem key={collaborator.id} value={collaborator.id}>
                            {collaborator.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="course">Curso/Treinamento</Label>
                    <Input 
                      id="course"
                      value={certificateForm.course}
                      onChange={(e) => setCertificateForm({...certificateForm, course: e.target.value})}
                      placeholder="Nome do curso ou treinamento"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="date">Data de Conclusão</Label>
                    <Input 
                      id="date"
                      type="date"
                      value={certificateForm.date}
                      onChange={(e) => setCertificateForm({...certificateForm, date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setGenerateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleGenerateCertificate}>
                    Gerar Certificado
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.filter(t => t.active).length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Canva</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {templates.filter(t => t.template_url?.includes('canva.com')).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Colaboradores</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collaborators.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Templates de Certificados</h3>
          
          {templates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Award className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum template criado</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Crie seu primeiro template de certificado para começar.
                </p>
                <Suspense fallback={<div>Loading...</div>}>
                  <CertificateTemplateDialog />
                </Suspense>
              </CardContent>
            </Card>
          ) : (
            templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant={template.active ? 'default' : 'secondary'}>
                          {template.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                        {template.template_url?.includes('canva.com') && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Canva
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {template.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tipo: {template.type} • Criado em {new Date(template.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {template.template_url && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(template.template_url, '_blank')}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Ver Template
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
