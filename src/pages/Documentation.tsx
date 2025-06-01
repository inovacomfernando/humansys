
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book, Video, Download, ExternalLink, Brain, Trophy, Smartphone, CreditCard } from 'lucide-react';

export const Documentation = () => {
  const sections = [
    {
      title: "Primeiros Passos",
      description: "Guias essenciais para começar",
      items: [
        { title: "Configuração Inicial", type: "guide", difficulty: "Iniciante" },
        { title: "Importação de Colaboradores", type: "guide", difficulty: "Iniciante" },
        { title: "Configuração de Permissões", type: "guide", difficulty: "Intermediário" },
        { title: "Tour pela Plataforma", type: "video", difficulty: "Iniciante" }
      ]
    },
    {
      title: "Gestão de Colaboradores",
      description: "Como gerenciar seu quadro de pessoal",
      items: [
        { title: "Cadastro de Colaboradores", type: "guide", difficulty: "Iniciante" },
        { title: "Organização por Departamentos", type: "guide", difficulty: "Iniciante" },
        { title: "Relatórios de Pessoal", type: "guide", difficulty: "Intermediário" },
        { title: "Exportação de Dados", type: "guide", difficulty: "Avançado" }
      ]
    },
    {
      title: "Sistema de Onboarding",
      description: "Integração eficiente de novos colaboradores",
      items: [
        { title: "Criação de Processos", type: "guide", difficulty: "Intermediário" },
        { title: "Gamificação no Onboarding", type: "guide", difficulty: "Intermediário", isNew: true },
        { title: "Templates de Onboarding", type: "guide", difficulty: "Iniciante" },
        { title: "Acompanhamento de Progresso", type: "video", difficulty: "Iniciante" }
      ]
    },
    {
      title: "Inteligência Artificial",
      description: "Aproveitando o poder da IA para RH",
      items: [
        { title: "Analytics Preditivas", type: "guide", difficulty: "Avançado", isNew: true },
        { title: "Previsão de Turnover", type: "guide", difficulty: "Avançado", isNew: true },
        { title: "Insights Automáticos", type: "video", difficulty: "Intermediário", isNew: true },
        { title: "Configuração da IA", type: "guide", difficulty: "Avançado", isNew: true }
      ]
    },
    {
      title: "Sistema de Gamificação",
      description: "Engajando colaboradores com jogos",
      items: [
        { title: "Configuração de Badges", type: "guide", difficulty: "Intermediário", isNew: true },
        { title: "Sistema de Pontos", type: "guide", difficulty: "Iniciante", isNew: true },
        { title: "Leaderboards e Rankings", type: "guide", difficulty: "Intermediário", isNew: true },
        { title: "Campanhas de Engajamento", type: "video", difficulty: "Avançado", isNew: true }
      ]
    },
    {
      title: "Aplicativo Mobile (PWA)",
      description: "Acesso móvel e offline",
      items: [
        { title: "Instalação do PWA", type: "guide", difficulty: "Iniciante", isNew: true },
        { title: "Funcionalidades Offline", type: "guide", difficulty: "Iniciário", isNew: true },
        { title: "Sincronização de Dados", type: "guide", difficulty: "Avançado", isNew: true },
        { title: "Demo do App Mobile", type: "video", difficulty: "Iniciante", isNew: true }
      ]
    },
    {
      title: "Sistema de Créditos",
      description: "Gestão e controle de créditos para colaboradores",
      items: [
        { title: "Como Funcionam os Créditos", type: "guide", difficulty: "Iniciante", isNew: true },
        { title: "Gerenciamento de Créditos", type: "guide", difficulty: "Iniciante", isNew: true },
        { title: "Upgrade de Planos", type: "guide", difficulty: "Intermediário", isNew: true },
        { title: "Relatórios de Uso", type: "guide", difficulty: "Intermediário", isNew: true },
        { title: "Histórico de Transações", type: "guide", difficulty: "Avançado", isNew: true }
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-100 text-green-800';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800';
      case 'Avançado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <Book className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'download': return <Download className="h-4 w-4" />;
      default: return <Book className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-4">
              Documentação
            </h1>
            <p className="text-xl text-muted-foreground">
              Guias completos para aproveitar ao máximo a plataforma HumanSys
            </p>
          </div>

          {/* Novidades em Destaque */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 font-medium text-purple-700 mb-2">
                  <Brain className="h-5 w-5" />
                  <span>Guias de IA</span>
                  <Badge className="bg-purple-100 text-purple-800">Novo</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Aprenda a usar analytics preditivas e insights automáticos para transformar seu RH.
                </p>
                <Button variant="outline" size="sm">
                  Ver Guias de IA
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-100">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 font-medium text-yellow-700 mb-2">
                  <Trophy className="h-5 w-5" />
                  <span>Gamificação</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Novo</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure badges, pontos e rankings para engajar sua equipe.
                </p>
                <Button variant="outline" size="sm">
                  Configurar Gamificação
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-50 to-sky-50 border-blue-100">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 font-medium text-blue-700 mb-2">
                  <Smartphone className="h-5 w-5" />
                  <span>App Mobile</span>
                  <Badge className="bg-blue-100 text-blue-800">Novo</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Instale o PWA e acesse a plataforma offline no celular.
                </p>
                <Button variant="outline" size="sm">
                  Instalar PWA
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 font-medium text-green-700 mb-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Sistema de Créditos</span>
                  <Badge className="bg-green-100 text-green-800">Novo</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Entenda como funciona o sistema de créditos para cadastro de colaboradores.
                </p>
                <Button variant="outline" size="sm">
                  Ver Documentação
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Seções de Documentação */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {section.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 text-primary">
                            {getTypeIcon(item.type)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{item.title}</h4>
                              {item.isNew && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs">Novo</Badge>
                              )}
                            </div>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getDifficultyColor(item.difficulty)}`}
                            >
                              {item.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recursos Adicionais */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Recursos Adicionais</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="text-center">
                  <Video className="h-10 w-10 text-primary mx-auto mb-4" />
                  <CardTitle>Webinars</CardTitle>
                  <CardDescription>
                    Sessões ao vivo sobre novidades e melhores práticas
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline">Ver Próximos Webinars</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Download className="h-10 w-10 text-primary mx-auto mb-4" />
                  <CardTitle>Templates</CardTitle>
                  <CardDescription>
                    Downloads de templates para onboarding e avaliações
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline">Baixar Templates</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <ExternalLink className="h-10 w-10 text-primary mx-auto mb-4" />
                  <CardTitle>API Documentation</CardTitle>
                  <CardDescription>
                    Documentação técnica para desenvolvedores
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline">Acessar API Docs</Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Seção Especial: Sistema de Créditos */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-800">Como Funciona o Sistema de Créditos</CardTitle>
                <CardDescription className="text-green-700">
                  Sistema transparente e flexível para gestão de colaboradores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium text-green-800">🎯 Conceito Simples</h4>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li>• <strong>1 Crédito = 1 Colaborador</strong> cadastrado</li>
                      <li>• Créditos são consumidos apenas no momento do cadastro</li>
                      <li>• Não há limite de tempo para usar os créditos</li>
                      <li>• Histórico completo de uso disponível</li>
                    </ul>
                    
                    <h4 className="font-medium text-green-800 mt-6">📊 Planos Disponíveis</h4>
                    <div className="space-y-1 text-sm text-green-700">
                      <div className="flex justify-between">
                        <span>Inicial:</span>
                        <Badge className="bg-green-100 text-green-800">10 créditos</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Crescimento:</span>
                        <Badge className="bg-blue-100 text-blue-800">50 créditos</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Profissional:</span>
                        <Badge className="bg-purple-100 text-purple-800">500 créditos</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Teste Grátis:</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Ilimitado</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-green-800">⚙️ Gerenciamento</h4>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li>• Visualize créditos disponíveis no Dashboard</li>
                      <li>• Configure alertas quando créditos estiverem baixos</li>
                      <li>• Acesse em Configurações → Aba Créditos</li>
                      <li>• Upgrade automático disponível a qualquer momento</li>
                    </ul>
                    
                    <h4 className="font-medium text-green-800 mt-6">📈 Controle e Relatórios</h4>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li>• Histórico completo de transações</li>
                      <li>• Relatórios de uso por período</li>
                      <li>• Projeções baseadas no uso atual</li>
                      <li>• Alertas inteligentes personalizáveis</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-white rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">💡 Dica Importante</h4>
                  <p className="text-sm text-green-700">
                    Durante o <strong>teste grátis de 30 dias</strong>, você tem créditos ilimitados para 
                    cadastrar quantos colaboradores precisar. Aproveite este período para 
                    configurar toda sua equipe e conhecer todas as funcionalidades!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Final */}
          <div className="text-center mt-16">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold mb-4">
                  Precisa de Ajuda Personalizada?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Nossa equipe de especialistas está pronta para ajudar você a implementar 
                  as melhores práticas em sua empresa.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg">
                    Agendar Consultoria
                  </Button>
                  <Button variant="outline" size="lg">
                    Contatar Suporte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Users, 
  Trophy, 
  BookOpen, 
  FileText,
  Video,
  MessageSquare,
  Target,
  Award,
  Zap,
  Crown,
  TrendingUp,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Documentation = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'Análise DISC',
      description: 'Sistema completo de análise de perfil comportamental com IA',
      path: '/app/disc',
      isNew: true,
      category: 'Recursos Humanos'
    },
    {
      icon: Crown,
      title: 'Founder Dashboard',
      description: 'Métricas estratégicas de negócio com IA preditiva',
      path: '/app/founder/dashboard',
      isNew: true,
      category: 'Analytics'
    },
    {
      icon: Trophy,
      title: 'Gamificação',
      description: 'Sistema de badges, conquistas e ranking',
      path: '/app/dashboard',
      isNew: true,
      category: 'Engajamento'
    },
    {
      icon: Users,
      title: 'Gestão de Colaboradores',
      description: 'Controle completo do quadro de funcionários',
      path: '/app/collaborators',
      category: 'Recursos Humanos'
    },
    {
      icon: UserPlus,
      title: 'Onboarding',
      description: 'Processo estruturado de integração',
      path: '/app/onboarding',
      category: 'Recursos Humanos'
    },
    {
      icon: MessageSquare,
      title: 'Feedback 360°',
      description: 'Sistema completo de feedbacks e avaliações',
      path: '/app/feedback',
      category: 'Avaliação'
    },
    {
      icon: Target,
      title: 'Metas & PDI',
      description: 'Plano de Desenvolvimento Individual',
      path: '/app/goals',
      category: 'Desenvolvimento'
    },
    {
      icon: Video,
      title: 'Treinamentos',
      description: 'Plataforma de cursos com certificação',
      path: '/app/training',
      category: 'Educação'
    }
  ];

  const discGuide = [
    {
      step: 1,
      title: 'Acesse a Análise DISC',
      description: 'No menu principal, clique em "Análise DISC" ou acesse pelo dashboard.',
      icon: Brain
    },
    {
      step: 2,
      title: 'Inicie o Questionário',
      description: 'Clique em "Nova Análise" para começar o questionário de 12 perguntas.',
      icon: FileText
    },
    {
      step: 3,
      title: 'Responda com Honestidade',
      description: 'Escolha as opções que melhor descrevem seu comportamento natural.',
      icon: Users
    },
    {
      step: 4,
      title: 'Receba Seu Relatório',
      description: 'Visualize seus resultados com insights de IA e recomendações personalizadas.',
      icon: Award
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              Documentação
            </h1>
            <p className="text-muted-foreground">
              Guias completos e documentação das funcionalidades da plataforma
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="disc">Análise DISC</TabsTrigger>
            <TabsTrigger value="features">Funcionalidades</TabsTrigger>
            <TabsTrigger value="api">API & Integrações</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bem-vindo à Humansys</CardTitle>
                <CardDescription>
                  Uma plataforma completa de gestão de recursos humanos com inteligência artificial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  A Humansys é uma solução moderna que combina gestão de RH tradicional com 
                  tecnologias avançadas como inteligência artificial, gamificação e análise comportamental.
                </p>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-5 w-5 text-green-600" />
                        <span className="font-medium">IA Avançada</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Análise preditiva de turnover e insights comportamentais
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Gamificação</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Sistema de badges e conquistas para engajar colaboradores
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">Analytics</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Métricas em tempo real e relatórios automatizados
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disc" className="space-y-6">
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-indigo-600" />
                  Análise de Perfil DISC
                  <Badge className="bg-indigo-500">Nova Funcionalidade</Badge>
                </CardTitle>
                <CardDescription>
                  Descubra e desenvolva o perfil comportamental dos seus colaboradores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">O que é a Análise DISC?</h3>
                  <p className="text-muted-foreground mb-4">
                    A análise DISC é uma ferramenta de avaliação comportamental que identifica quatro estilos 
                    principais de personalidade: Dominante, Influente, Estável e Consciencioso. Nossa implementação 
                    utiliza inteligência artificial para fornecer insights mais profundos e precisos.
                  </p>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-red-200 bg-red-50">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-xl font-bold text-red-600">D</span>
                        </div>
                        <h4 className="font-medium">Dominante</h4>
                        <p className="text-xs text-muted-foreground">Direto, decidido, orientado para resultados</p>
                      </CardContent>
                    </Card>

                    <Card className="border-yellow-200 bg-yellow-50">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-xl font-bold text-yellow-600">I</span>
                        </div>
                        <h4 className="font-medium">Influente</h4>
                        <p className="text-xs text-muted-foreground">Sociável, otimista, persuasivo</p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-xl font-bold text-green-600">S</span>
                        </div>
                        <h4 className="font-medium">Estável</h4>
                        <p className="text-xs text-muted-foreground">Paciente, confiável, colaborativo</p>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-xl font-bold text-blue-600">C</span>
                        </div>
                        <h4 className="font-medium">Consciencioso</h4>
                        <p className="text-xs text-muted-foreground">Preciso, analítico, sistemático</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Como Fazer a Análise</h3>
                  <div className="space-y-4">
                    {discGuide.map((step) => (
                      <div key={step.step} className="flex gap-4 p-4 border rounded-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <step.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Passo {step.step}: {step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={() => navigate('/app/disc')} size="lg">
                    <Brain className="h-5 w-5 mr-2" />
                    Fazer Análise DISC
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      onClick={() => navigate(feature.path)}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex flex-col gap-1">
                        {feature.isNew && (
                          <Badge className="bg-green-500 text-white text-xs">
                            Novo
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {feature.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg">
                      {feature.title}
                    </CardTitle>
                    <CardDescription>
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full">
                      Acessar <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API e Integrações</CardTitle>
                <CardDescription>
                  Documentação técnica para integrações e uso da API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Em Desenvolvimento</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    A documentação da API estará disponível em breve. 
                    Entre em contato conosco para mais informações sobre integrações.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
