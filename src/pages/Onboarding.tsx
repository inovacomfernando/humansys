
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, User, FileText, Briefcase, Users, Play } from 'lucide-react';

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

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'training' | 'meeting' | 'task';
  completed: boolean;
  dueDate?: string;
}

export const Onboarding = () => {
  // Mock data
  const onboardingProcesses: OnboardingProcess[] = [
    {
      id: '1',
      collaboratorName: 'João Silva',
      position: 'Desenvolvedor Senior',
      department: 'Tecnologia',
      startDate: '2024-01-22',
      progress: 75,
      status: 'in-progress',
      currentStep: 'Treinamento de Segurança'
    },
    {
      id: '2',
      collaboratorName: 'Maria Santos',
      position: 'Analista de Marketing',
      department: 'Marketing',
      startDate: '2024-01-20',
      progress: 100,
      status: 'completed',
      currentStep: 'Concluído'
    }
  ];

  const defaultSteps: OnboardingStep[] = [
    {
      id: '1',
      title: 'Documentação Pessoal',
      description: 'Envio de documentos pessoais e contratuais',
      type: 'document',
      completed: true
    },
    {
      id: '2',
      title: 'Apresentação da Empresa',
      description: 'Conhecer a história, missão e valores da empresa',
      type: 'training',
      completed: true
    },
    {
      id: '3',
      title: 'Reunião com Gestor',
      description: 'Primeira reunião com o gestor direto',
      type: 'meeting',
      completed: true,
      dueDate: '2024-01-23'
    },
    {
      id: '4',
      title: 'Treinamento de Segurança',
      description: 'Curso obrigatório sobre políticas de segurança',
      type: 'training',
      completed: false,
      dueDate: '2024-01-25'
    },
    {
      id: '5',
      title: 'Setup do Ambiente',
      description: 'Configuração de equipamentos e acessos',
      type: 'task',
      completed: false,
      dueDate: '2024-01-24'
    },
    {
      id: '6',
      title: 'Integração com a Equipe',
      description: 'Conhecer os colegas de trabalho',
      type: 'meeting',
      completed: false,
      dueDate: '2024-01-26'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'not-started': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'in-progress': return 'Em Andamento';
      case 'not-started': return 'Não Iniciado';
      default: return status;
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'training': return Play;
      case 'meeting': return Users;
      case 'task': return Briefcase;
      default: return FileText;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Onboarding</h1>
          <p className="text-muted-foreground">
            Gerencie o processo de integração de novos colaboradores
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {onboardingProcesses.filter(p => p.status === 'in-progress').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {onboardingProcesses.filter(p => p.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onboardingProcesses.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Processos Ativos</TabsTrigger>
            <TabsTrigger value="template">Modelo de Onboarding</TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="space-y-4">
              {onboardingProcesses.filter(p => p.status !== 'completed').map((process) => (
                <Card key={process.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{process.collaboratorName}</CardTitle>
                        <CardDescription>
                          {process.position} • {process.department}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground mt-1">
                          Iniciado em {new Date(process.startDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge className={getStatusColor(process.status)}>
                        {getStatusText(process.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progresso</span>
                        <span className="text-sm text-muted-foreground">{process.progress}%</span>
                      </div>
                      <Progress value={process.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">
                          <strong>Etapa atual:</strong> {process.currentStep}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                        <Button size="sm">
                          Acompanhar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="template">
            <Card>
              <CardHeader>
                <CardTitle>Modelo de Onboarding Padrão</CardTitle>
                <CardDescription>
                  Configure as etapas padrão do processo de integração
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {defaultSteps.map((step, index) => {
                    const Icon = getStepIcon(step.type);
                    return (
                      <div key={step.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                          {step.dueDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Prazo: {new Date(step.dueDate).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline">
                          {step.type === 'document' && 'Documento'}
                          {step.type === 'training' && 'Treinamento'}
                          {step.type === 'meeting' && 'Reunião'}
                          {step.type === 'task' && 'Tarefa'}
                        </Badge>
                        {step.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline">
                    Adicionar Etapa
                  </Button>
                  <Button>
                    Salvar Modelo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <div className="space-y-4">
              {onboardingProcesses.filter(p => p.status === 'completed').map((process) => (
                <Card key={process.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{process.collaboratorName}</CardTitle>
                        <CardDescription>
                          {process.position} • {process.department}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground mt-1">
                          Concluído • Iniciado em {new Date(process.startDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge className="bg-green-500">Concluído</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <Progress value={100} className="h-2 w-32" />
                        <p className="text-sm text-muted-foreground mt-1">100% concluído</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver Relatório
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
