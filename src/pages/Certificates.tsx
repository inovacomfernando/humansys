
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Award, Download, Eye, Calendar, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Certificates = () => {
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const { toast } = useToast();

  const [certificateForm, setCertificateForm] = useState({
    template: '',
    collaborator: '',
    course: '',
    date: new Date().toISOString().split('T')[0]
  });

  const templates = [
    { id: '1', name: 'Certificado de Conclusão' },
    { id: '2', name: 'Certificado de Excelência' },
    { id: '3', name: 'Certificado de Participação' }
  ];

  const collaborators = [
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Santos' },
    { id: '3', name: 'Pedro Costa' }
  ];

  const handleGenerateCertificate = () => {
    if (!certificateForm.template || !certificateForm.collaborator || !certificateForm.course) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Certificado gerado",
      description: "Certificado foi gerado com sucesso e está pronto para download.",
    });

    setCertificateForm({
      template: '',
      collaborator: '',
      course: '',
      date: new Date().toISOString().split('T')[0]
    });
    setGenerateDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Certificados</h1>
            <p className="text-muted-foreground">
              Gerencie e visualize certificados de conclusão de cursos
            </p>
          </div>
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

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificados</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Certificado de Liderança</CardTitle>
                  <p className="text-sm text-muted-foreground">João Silva • Concluído em 15/01/2024</p>
                </div>
                <Badge className="bg-green-500">Emitido</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizar
                </Button>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Certificado de Segurança</CardTitle>
                  <p className="text-sm text-muted-foreground">Maria Santos • Concluído em 10/01/2024</p>
                </div>
                <Badge className="bg-green-500">Emitido</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizar
                </Button>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
