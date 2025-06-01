import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Zap, Brain, Trophy, Video, Smartphone, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Changelog = () => {
  const navigate = useNavigate();

  const updates = [
    {
      version: '3.3.0',
      date: '2024-01-20',
      type: 'major' as const,
      title: 'Análise de Perfil DISC com IA',
      description: 'Sistema completo de análise comportamental DISC com insights de inteligência artificial, gamificação e relatórios avançados.',
      features: [
        {
          icon: Brain,
          title: 'Análise DISC Inteligente',
          description: 'Questionário de 12 perguntas com análise comportamental avançada'
        },
        {
          icon: Trophy,
          title: 'Gamificação DISC',
          description: 'Sistema de badges, níveis e conquistas para análises comportamentais'
        },
        {
          icon: FileText,
          title: 'Relatórios em HTML',
          description: 'Relatórios detalhados exportáveis com insights de IA'
        },
        {
          icon: Users,
          title: 'Perfis Comportamentais',
          description: 'Identificação de estilos D, I, S, C com recomendações personalizadas'
        }
      ],
      impacts: [
        'Identificação precisa de perfis comportamentais',
        'Formação de equipes mais eficientes',
        'Desenvolvimento personalizado de lideranças',
        'Otimização da comunicação interna baseada em perfis'
      ],
      testimonial: {
        text: "A análise DISC nos ajudou a entender melhor nossa equipe e formar times mais complementares. Os insights de IA são incríveis!",
        author: "Maria Santos",
        role: "Diretora de RH, InnovaCorp"
      }
    },
    {
      version: '3.2.0',
      date: '2024-01-15',
      type: 'major' as const,
      title: 'Founder Dashboard com IA Preditiva',
      description: 'Dashboard exclusivo para founders com métricas SaaS avançadas, previsões de churn e IA preditiva para otimização de negócios.',
      features: [
        {
          icon: Crown,
          title: 'Founder Dashboard Premium',
          description: 'Interface dedicada com métricas de negócio em tempo real'
        },
        {
          icon: Brain,
          title: 'IA Preditiva para SaaS',
          description: 'Previsões de churn, MRR e otimizações automáticas'
        },
        {
          icon: TrendingUp,
          title: 'Métricas SaaS Completas',
          description: 'MRR, ARR, Churn Rate, LTV/CAC, NRR e mais'
        },
        {
          icon: DollarSign,
          title: 'Análise de Receita',
          description: 'Forecasting inteligente e análise de tendências'
        }
      ],
      impacts: [
        'Visibilidade 360° do negócio em tempo real',
        'Decisões estratégicas baseadas em dados e IA',
        'Previsões de receita com 90% de precisão',
        'Identificação automática de oportunidades de crescimento'
      ],
      testimonial: {
        text: "O Founder Dashboard mudou completamente como vejo meu negócio. As previsões de IA me ajudaram a identificar problemas antes que acontecessem.",
        author: "Carlos Silva",
        role: "CEO, TechCorp"
      }
    },
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