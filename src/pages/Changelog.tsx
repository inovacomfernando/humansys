import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Zap, Brain, Trophy, Video, Smartphone, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Target, Sparkles, Alert, AlertTitle, AlertDescription } from 'lucide-react';

export const Changelog = () => {
  const navigate = useNavigate();

  const updates = [
    {
      version: "v2.5.0",
      date: "2024-12-20",
      type: "major",
      title: "Analytics Preditivas com IA",
      items: [
        {
          icon: Brain,
          title: "Machine Learning Insights",
          description: "IA para prever turnover e identificar talentos em risco",
          new: true
        },
        {
          icon: TrendingUp,
          title: "Analytics Avançadas",
          description: "Dashboard com métricas de produtividade e engajamento",
          new: true
        },
        {
          icon: Zap,
          title: "Alertas Inteligentes",
          description: "Notificações automáticas baseadas em padrões de comportamento",
          new: true
        }
      ]
    },
    {
      version: "v2.4.0",
      date: "2024-12-15",
      type: "major",
      title: "Sistema de Gamificação",
      items: [
        {
          icon: Trophy,
          title: "Badges e Conquistas",
          description: "Sistema completo de recompensas para engajamento",
          new: true
        },
        {
          icon: Star,
          title: "Ranking e Leaderboard",
          description: "Competição saudável entre colaboradores",
          new: true
        },
        {
          icon: CheckCircle,
          title: "Progresso Visual",
          description: "Barras de progresso e estatísticas detalhadas",
          new: true
        }
      ]
    },
    {
      version: "v2.3.0",
      date: "2024-12-10",
      type: "feature",
      title: "Experiência Mobile e PWA",
      items: [
        {
          icon: Smartphone,
          title: "Progressive Web App",
          description: "Aplicativo funciona offline e pode ser instalado",
          new: true
        },
        {
          icon: Video,
          title: "Player de Vídeo Integrado",
          description: "Reprodução de vídeos de treinamento com controles avançados",
          new: false
        }
      ]
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major': return 'bg-purple-500';
      case 'feature': return 'bg-blue-500';
      case 'fix': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />

      <div className="container py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-4">
              Novidades e Atualizações
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Fique por dentro de todas as melhorias e novas funcionalidades do HumanSys
            </p>
            <Button onClick={() => navigate('/dashboard')} size="lg">
              Explorar Funcionalidades
            </Button>
          </div>

          <div className="space-y-8">
        {/* Versão mais recente */}
        <Card className="border-emerald-500/30 bg-gradient-to-r from-emerald-50 to-green-50 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Brain className="h-6 w-6 text-emerald-600" />
                  v2.2.0 - Análise DISC com Inteligência Artificial
                  <Badge className="bg-emerald-500 text-white animate-pulse">
                    🚀 Lançamento
                  </Badge>
                </CardTitle>
                <CardDescription className="text-base">
                  {new Date().toLocaleDateString('pt-BR')}
                </CardDescription>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-sm border-emerald-300 text-emerald-700">
                  Inteligência Artificial
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-emerald-600" />
                  Análise DISC Revolucionária
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Primeira plataforma brasileira com DISC + IA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Identificação precisa dos 4 perfis comportamentais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Insights personalizados de desenvolvimento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Relatórios detalhados em PDF</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-600" />
                  Recursos Inteligentes
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Recomendações de carreira personalizadas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Análise de compatibilidade em equipes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Estilos de liderança identificados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Dashboard de gamificação DISC</span>
                  </li>
                </ul>
              </div>
            </div>

            <Alert className="border-emerald-200 bg-emerald-50">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <AlertTitle className="text-emerald-700">Oferta de Lançamento</AlertTitle>
              <AlertDescription className="text-emerald-600">
                Primeira análise DISC totalmente gratuita para todos os usuários! 
                Descubra seu perfil comportamental único com tecnologia de ponta.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Versão anterior */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  v2.1.0 - PWA e Otimizações Avançadas
                </CardTitle>
                <CardDescription className="text-base">
                  15 de Janeiro de 2025
                </CardDescription>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-sm">
                  Progressive Web App
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  Progressive Web App (PWA)
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Funciona offline com sincronização automática</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Instalação como app nativo no celular</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Notificações push para atualizações importantes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Performance 3x mais rápida</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  Otimizações de Performance
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Redução de 50% no tempo de carregamento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Infraestrutura Cloud otimizada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Servidores dedicados de alta performance</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {updates.map((update, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-3">
                        <Badge className={getTypeColor(update.type)}>
                          v{update.version}
                        </Badge>
                        <span>{update.title}</span>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Lançado em {new Date(update.date).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </div>
                    {update.type === 'major' && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Destaque
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {update.items.map((item, itemIndex) => {
                      const Icon = item.icon;
                      return (
                        <div key={itemIndex} className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium flex items-center space-x-2">
                              <span>{item.title}</span>
                              {item.new && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  Novo
                                </Badge>
                              )}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Próximas Atualizações
                </h3>
                <p className="text-muted-foreground mb-6">
                  Estamos trabalhando em ainda mais funcionalidades para melhorar sua experiência
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Brain className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium">IA Conversacional</h4>
                    <p className="text-sm text-muted-foreground">Chatbot para dúvidas de RH</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium">Relatórios Avançados</h4>
                    <p className="text-sm text-muted-foreground">Dashboard executivo personalizado</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Smartphone className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-medium">App Nativo</h4>
                    <p className="text-sm text-muted-foreground">Aplicativo para iOS e Android</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};