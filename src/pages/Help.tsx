import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  Video, 
  MessageSquare,
  Brain,
  Users,
  Target,
  Award,
  Crown,
  Shield,
  TrendingUp,
  Settings,
  Zap,
  FileText,
  Lightbulb,
  HeadphonesIcon,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const quickLinks = [
    {
      icon: Brain,
      title: 'Como usar a Análise DISC com IA',
      description: 'Guia completo para aplicar e interpretar avaliações DISC',
      category: 'IA & Analytics',
      isNew: true,
      path: '/app/disc'
    },
    {
      icon: Crown,
      title: 'Founder Dashboard',
      description: 'Métricas SaaS e insights para tomada de decisão',
      category: 'Founder',
      isPro: true,
      path: '/founder/dashboard'
    },
    {
      icon: Users,
      title: 'Gerenciamento de Usuários',
      description: 'Como cadastrar e gerenciar permissões de colaboradores',
      category: 'Gestão',
      path: '/app/settings'
    },
    {
      icon: Target,
      title: 'Configurar Metas & PDI',
      description: 'Definir objetivos e planos de desenvolvimento',
      category: 'Desenvolvimento',
      path: '/app/goals'
    },
    {
      icon: Award,
      title: 'Sistema de Gamificação',
      description: 'Badges, rankings e conquistas para engajamento',
      category: 'Engajamento',
      isNew: true,
      path: '/app/dashboard'
    },
    {
      icon: Shield,
      title: 'Segurança e Proteção',
      description: 'Configurações de segurança e proteção de dados',
      category: 'Segurança',
      path: '/app/security-management'
    }
  ];

  const categories = [
    {
      id: 'getting-started',
      title: 'Primeiros Passos',
      icon: Zap,
      description: 'Configure sua conta e comece a usar',
      articles: [
        { title: 'Configuração inicial da conta', time: '5 min' },
        { title: 'Cadastrando seus primeiros colaboradores', time: '8 min' },
        { title: 'Configurando permissões de usuário', time: '6 min' },
        { title: 'Integrando com sistemas existentes', time: '12 min' }
      ]
    },
    {
      id: 'ia-analytics',
      title: 'IA & Analytics',
      icon: Brain,
      description: 'Inteligência artificial e análises avançadas',
      articles: [
        { title: 'Brainsys IAO V.1: Guia completo', time: '15 min', isNew: true },
        { title: 'Análise DISC com IA: Como aplicar', time: '10 min', isNew: true },
        { title: 'Interpretando relatórios de IA', time: '8 min' },
        { title: 'Analytics preditivos: Configuração', time: '12 min' }
      ]
    },
    {
      id: 'people-management',
      title: 'Gestão de Pessoas',
      icon: Users,
      description: 'Colaboradores, recrutamento e desenvolvimento',
      articles: [
        { title: 'Gestão completa de colaboradores', time: '10 min' },
        { title: 'Processo de recrutamento inteligente', time: '12 min' },
        { title: 'Onboarding estruturado', time: '8 min' },
        { title: 'Feedback 360° e avaliações', time: '15 min' }
      ]
    },
    {
      id: 'development',
      title: 'Desenvolvimento',
      icon: Target,
      description: 'Treinamentos, metas e crescimento',
      articles: [
        { title: 'Criando treinamentos eficazes', time: '12 min' },
        { title: 'Definindo metas SMART', time: '8 min' },
        { title: 'PDI: Plano de desenvolvimento', time: '10 min' },
        { title: 'Trilhas de carreira', time: '15 min' }
      ]
    },
    {
      id: 'founder',
      title: 'Founder Suite',
      icon: Crown,
      description: 'Ferramentas exclusivas para founders',
      articles: [
        { title: 'Dashboard Founder: Visão geral', time: '8 min', isPro: true },
        { title: 'Análise de churn e retenção', time: '12 min', isPro: true },
        { title: 'Métricas SaaS essenciais', time: '10 min', isPro: true },
        { title: 'Forecasting inteligente', time: '15 min', isPro: true }
      ]
    },
    {
      id: 'security',
      title: 'Segurança',
      icon: Shield,
      description: 'Proteção e compliance',
      articles: [
        { title: 'Configurações de segurança', time: '8 min' },
        { title: 'Proteção contra vazamentos', time: '10 min' },
        { title: 'Auditoria e logs', time: '6 min' },
        { title: 'Compliance LGPD', time: '12 min' }
      ]
    }
  ];

  const supportChannels = [
    {
      icon: MessageSquare,
      title: 'Chat ao Vivo',
      description: 'Suporte imediato com nossa equipe',
      availability: 'Seg-Sex, 8h às 18h',
      action: 'Iniciar Chat'
    },
    {
      icon: Video,
      title: 'Sessão de Onboarding',
      description: 'Agende uma sessão personalizada',
      availability: 'Agendamento flexível',
      action: 'Agendar'
    },
    {
      icon: HeadphonesIcon,
      title: 'Suporte por Email',
      description: 'Envie sua dúvida detalhada',
      availability: 'Resposta em 2h úteis',
      action: 'Enviar Email'
    },
    {
      icon: BookOpen,
      title: 'Base de Conhecimento',
      description: 'Documentação completa',
      availability: 'Disponível 24/7',
      action: 'Acessar Docs'
    }
  ];

  const filteredQuickLinks = quickLinks.filter(link =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />

      <div className="container py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl mb-6">
            Central de <span className="text-green-600">Ajuda</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Encontre respostas, tutoriais e suporte especializado para 
            aproveitar ao máximo a HumanSys.
          </p>

          {/* Busca */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar ajuda, tutoriais, dúvidas..."
              className="pl-12 pr-4 py-3 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Links Rápidos */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Acesso Rápido</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(link.path)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{link.title}</CardTitle>
                          {link.isNew && (
                            <Badge className="bg-green-500 text-white text-xs">NOVO</Badge>
                          )}
                          {link.isPro && (
                            <Badge className="bg-yellow-500 text-white text-xs">PRO</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{link.category}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm">{link.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Conteúdo Principal */}
        <Tabs defaultValue="articles" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Artigos
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Vídeos
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Suporte
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
          </TabsList>

          {/* Artigos */}
          <TabsContent value="articles">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-green-600" />
                        </div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                      </div>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.articles.map((article, articleIndex) => (
                          <div key={articleIndex} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{article.title}</p>
                                {article.isNew && (
                                  <Badge className="bg-green-500 text-white text-xs">NOVO</Badge>
                                )}
                                {article.isPro && (
                                  <Badge className="bg-yellow-500 text-white text-xs">PRO</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{article.time} de leitura</p>
                            </div>
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Vídeos */}
          <TabsContent value="videos">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-100 rounded-t-lg flex items-center justify-center">
                  <Video className="h-12 w-12 text-green-600" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">Introdução à HumanSys</CardTitle>
                  <CardDescription>Visão geral da plataforma e principais funcionalidades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">12 min</span>
                    <Button variant="outline" size="sm">Assistir</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-indigo-100 rounded-t-lg flex items-center justify-center">
                  <Brain className="h-12 w-12 text-purple-600" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">Brainsys IAO V.1 em Ação</CardTitle>
                  <CardDescription>Como usar nossa IA para análises comportamentais</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">15 min</span>
                      <Badge className="bg-purple-500 text-white text-xs">NOVO</Badge>
                    </div>
                    <Button variant="outline" size="sm">Assistir</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-yellow-100 to-orange-100 rounded-t-lg flex items-center justify-center">
                  <Crown className="h-12 w-12 text-yellow-600" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">Founder Dashboard</CardTitle>
                  <CardDescription>Métricas SaaS e insights estratégicos para founders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">18 min</span>
                      <Badge className="bg-yellow-500 text-white text-xs">PRO</Badge>
                    </div>
                    <Button variant="outline" size="sm">Assistir</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Suporte */}
          <TabsContent value="support">
            <div className="grid md:grid-cols-2 gap-6">
              {supportChannels.map((channel, index) => {
                const Icon = channel.icon;
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{channel.title}</CardTitle>
                          <p className="text-sm text-green-600">{channel.availability}</p>
                        </div>
                      </div>
                      <CardDescription>{channel.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">{channel.action}</Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Perguntas Frequentes</CardTitle>
                  <CardDescription>Respostas para as dúvidas mais comuns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Como funciona o sistema de créditos?</h4>
                    <p className="text-sm text-muted-foreground">
                      Cada usuário cadastrado na plataforma consome 1 crédito. Os créditos são renovados mensalmente 
                      conforme seu plano e não acumulam entre períodos. Durante o teste grátis, você tem acesso 
                      a créditos ilimitados por 14 dias.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">A análise DISC com IA é confiável?</h4>
                    <p className="text-sm text-muted-foreground">
                      Nossa IA foi treinada com milhares de perfis DISC validados por psicólogos organizacionais. 
                      A precisão é superior a 94% e os relatórios são revisados por especialistas em comportamento humano.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Posso integrar com meu sistema atual de RH?</h4>
                    <p className="text-sm text-muted-foreground">
                      Sim! Oferecemos APIs robustas e integrações nativas com os principais sistemas de RH do mercado. 
                      Nossa equipe técnica pode ajudar na implementação personalizada.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Como funciona a gamificação?</h4>
                    <p className="text-sm text-muted-foreground">
                      O sistema de gamificação inclui badges, rankings, conquistas e pontuação em tempo real. 
                      Cada ação na plataforma gera pontos, incentivando o engajamento e criando competições saudáveis.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Meus dados estão seguros?</h4>
                    <p className="text-sm text-muted-foreground">
                      Sim! Utilizamos criptografia de ponta, proteção contra vazamentos, watermarks em documentos 
                      e estamos em conformidade com a LGPD. Seus dados são protegidos com os mais altos padrões de segurança.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Final */}
        <div className="text-center mt-16">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-8">
              <Lightbulb className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Ainda tem dúvidas?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Nossa equipe de especialistas está sempre pronta para ajudar. 
                Entre em contato conosco para suporte personalizado.
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => navigate('/contact')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Falar com Suporte
                </Button>
                <Button variant="outline" onClick={() => navigate('/app/documentation')}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Ver Documentação
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};