
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Plus, Users, FileText, Brain, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobVacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  status: 'open' | 'closed' | 'draft';
  applications: number;
  postedDate: string;
  description: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  status: 'novo' | 'triagem' | 'entrevista' | 'aprovado' | 'reprovado';
  score: number;
  resumeUrl?: string;
  appliedDate: string;
}

export const OptimizedRecruitment = () => {
  const [isCreatingVacancy, setIsCreatingVacancy] = useState(false);
  const { toast } = useToast();
  
  // Mock data
  const vacancies: JobVacancy[] = [
    {
      id: '1',
      title: 'Desenvolvedor Full Stack Senior',
      department: 'Tecnologia',
      location: 'São Paulo, SP',
      type: 'full-time',
      status: 'open',
      applications: 25,
      postedDate: '2024-01-15',
      description: 'Procuramos um desenvolvedor experiente em React e Node.js'
    },
    {
      id: '2',
      title: 'Designer UX/UI',
      department: 'Design',
      location: 'Remote',
      type: 'full-time',
      status: 'open',
      applications: 12,
      postedDate: '2024-01-10',
      description: 'Designer criativo com experiência em Figma e prototipação'
    }
  ];

  const candidates: Candidate[] = [
    {
      id: '1',
      name: 'Ana Costa',
      email: 'ana.costa@email.com',
      position: 'Desenvolvedor Full Stack Senior',
      status: 'aprovado',
      score: 95,
      appliedDate: '2024-01-20'
    },
    {
      id: '2',
      name: 'Carlos Mendes',
      email: 'carlos.mendes@email.com',
      position: 'Desenvolvedor Full Stack Senior',
      status: 'entrevista',
      score: 85,
      appliedDate: '2024-01-18'
    },
    {
      id: '3',
      name: 'Lucia Silva',
      email: 'lucia.silva@email.com',
      position: 'Designer UX/UI',
      status: 'triagem',
      score: 78,
      appliedDate: '2024-01-16'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'closed': return 'bg-red-500';
      case 'draft': return 'bg-yellow-500';
      case 'aprovado': return 'bg-green-500';
      case 'reprovado': return 'bg-red-500';
      case 'entrevista': return 'bg-blue-500';
      case 'triagem': return 'bg-yellow-500';
      case 'novo': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Aberta';
      case 'closed': return 'Fechada';
      case 'draft': return 'Rascunho';
      case 'aprovado': return 'Aprovado';
      case 'reprovado': return 'Reprovado';
      case 'entrevista': return 'Entrevista';
      case 'triagem': return 'Triagem';
      case 'novo': return 'Novo';
      default: return status;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleCreateVacancy = () => {
    toast({
      title: "Vaga criada com sucesso!",
      description: "A nova vaga foi publicada e está ativa.",
    });
    setIsCreatingVacancy(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Recrutamento e Seleção</h1>
            <p className="text-muted-foreground">
              Gerencie vagas e candidatos com IA para triagem inteligente
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vagas Ativas</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vacancies.filter(v => v.status === 'open').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidatos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{candidates.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Processo</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {candidates.filter(c => c.status === 'triagem' || c.status === 'entrevista').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">IA Ativa</CardTitle>
              <Brain className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">ON</div>
              <p className="text-xs text-muted-foreground">Triagem automática</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="vacancies" className="space-y-4">
          <TabsList>
            <TabsTrigger value="vacancies">Vagas</TabsTrigger>
            <TabsTrigger value="candidates">Candidatos</TabsTrigger>
            <TabsTrigger value="ai-settings">Configuração IA</TabsTrigger>
          </TabsList>

          <TabsContent value="vacancies">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Vagas Disponíveis</h2>
                <Dialog open={isCreatingVacancy} onOpenChange={setIsCreatingVacancy}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Vaga
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Vaga</DialogTitle>
                      <DialogDescription>
                        Preencha as informações da nova vaga
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="job-title">Título da Vaga</Label>
                        <Input id="job-title" placeholder="Ex: Desenvolvedor Full Stack" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="department">Departamento</Label>
                          <Input id="department" placeholder="Tecnologia" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="location">Localização</Label>
                          <Input id="location" placeholder="São Paulo, SP" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Descreva a vaga, requisitos e responsabilidades..."
                          rows={4}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreatingVacancy(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateVacancy}>
                        Criar Vaga
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {vacancies.map((vacancy) => (
                  <Card key={vacancy.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{vacancy.title}</CardTitle>
                          <CardDescription>
                            {vacancy.department} • {vacancy.location}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{vacancy.type}</Badge>
                          <div className={`h-3 w-3 rounded-full ${getStatusColor(vacancy.status)}`} />
                          <span className="text-sm">{getStatusText(vacancy.status)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{vacancy.applications} candidatos</span>
                          <span>Publicada em {new Date(vacancy.postedDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Ver Candidatos</Button>
                          <Button size="sm">Editar</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="candidates">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Candidatos</h2>
              
              <div className="grid gap-4">
                {candidates.map((candidate) => (
                  <Card key={candidate.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{candidate.name}</CardTitle>
                          <CardDescription>{candidate.email}</CardDescription>
                          <p className="text-sm text-muted-foreground mt-1">
                            Aplicou para: {candidate.position}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getScoreColor(candidate.score)}`}>
                              {candidate.score}%
                            </div>
                            <p className="text-xs text-muted-foreground">Score IA</p>
                          </div>
                          <Badge className={getStatusColor(candidate.status)}>
                            {getStatusText(candidate.status)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          Aplicou em {new Date(candidate.appliedDate).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Ver Currículo
                          </Button>
                          <Button variant="outline" size="sm">
                            Agendar Entrevista
                          </Button>
                          <Button size="sm">
                            Avaliar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  Configurações da IA
                </CardTitle>
                <CardDescription>
                  Configure os parâmetros da triagem inteligente de currículos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Critérios de Triagem</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Experiência mínima (anos)</span>
                      <Input type="number" defaultValue="2" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Score mínimo para aprovação</span>
                      <Input type="number" defaultValue="70" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Palavras-chave obrigatórias</span>
                      <Input placeholder="React, Node.js, JavaScript" className="w-64" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Categorização Automática</h4>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Score 90-100%:</span>
                      <Badge className="bg-green-500">Perfil Alinhado</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Score 70-89%:</span>
                      <Badge className="bg-yellow-500">Perfil em Potencial</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Score 0-69%:</span>
                      <Badge className="bg-red-500">Sem Perfil</Badge>
                    </div>
                  </div>
                </div>

                <Button onClick={() => toast({ title: "Configurações salvas!" })}>
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
