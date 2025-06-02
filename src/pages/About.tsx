import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Users, 
  Target, 
  Award, 
  Sparkles, 
  Crown,
  Shield,
  TrendingUp,
  Zap,
  Heart,
  Building,
  Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'IA Avançada Integrada',
      description: 'Brainsys IAO V.1 com análise DISC inteligente, insights preditivos e automação completa',
      isNew: true
    },
    {
      icon: Crown,
      title: 'Founder Dashboard',
      description: 'Métricas SaaS exclusivas, análise de churn e forecasting para founders',
      isPro: true
    },
    {
      icon: Users,
      title: 'Gestão Completa de Pessoas',
      description: 'Do recrutamento ao offboarding, com sistema de créditos e permissões avançadas'
    },
    {
      icon: Award,
      title: 'Gamificação Total',
      description: 'Sistema de badges, rankings e conquistas para maximizar o engajamento'
    },
    {
      icon: Shield,
      title: 'Segurança Empresarial',
      description: 'Proteção contra vazamentos, watermarks e monitoramento em tempo real'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Preditivos',
      description: 'Machine Learning para previsão de tendências e tomada de decisão estratégica'
    }
  ];

  const stats = [
    { number: '500+', label: 'Empresas Atendidas' },
    { number: '50k+', label: 'Colaboradores Gerenciados' },
    { number: '99.9%', label: 'Uptime Garantido' },
    { number: '24/7', label: 'Suporte Especializado' }
  ];

  const team = [
    {
      name: 'Equipe de IA',
      role: 'Desenvolvimento de Inteligência Artificial',
      description: 'Especialistas em ML e processamento de linguagem natural'
    },
    {
      name: 'Equipe de Produto',
      role: 'UX/UI e Product Management',
      description: 'Focados na melhor experiência do usuário'
    },
    {
      name: 'Equipe de RH',
      role: 'Consultoria Especializada',
      description: 'Profissionais com décadas de experiência em gestão de pessoas'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />

      <div className="container py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl mb-6">
            Sobre a <span className="text-green-600">HumanSys</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Revolucionamos a gestão de pessoas com inteligência artificial avançada, 
            oferecendo a plataforma mais completa e inovadora do mercado.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/plans')}>
              <Zap className="h-4 w-4 mr-2" />
              Começar Agora
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/app/documentation')}>
              <Lightbulb className="h-4 w-4 mr-2" />
              Ver Documentação
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Nossa Missão */}
        <div className="mb-16">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">Nossa Missão</h2>
                <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
                  Democratizar o acesso a ferramentas avançadas de gestão de pessoas, 
                  permitindo que empresas de todos os tamanhos tenham acesso à tecnologia 
                  de ponta para desenvolver seus colaboradores e maximizar resultados.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Brain className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Inovação Contínua</h3>
                  <p className="text-sm text-muted-foreground">
                    Sempre na vanguarda da tecnologia, implementando IA e ML de forma prática
                  </p>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Foco nas Pessoas</h3>
                  <p className="text-sm text-muted-foreground">
                    Entendemos que o sucesso das empresas começa com pessoas engajadas
                  </p>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Resultados Mensuráveis</h3>
                  <p className="text-sm text-muted-foreground">
                    Todas nossas funcionalidades são baseadas em métricas e dados concretos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Principais Funcionalidades */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Funcionalidades Principais
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="relative hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        {feature.isNew && (
                          <Badge className="bg-green-500 text-white text-xs">NOVO</Badge>
                        )}
                        {feature.isPro && (
                          <Badge className="bg-yellow-500 text-white text-xs">PRO</Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Nossa Equipe */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Nossa Equipe</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-green-600 font-medium">{member.role}</p>
                    </div>
                  </div>
                  <CardDescription>{member.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">
                Pronto para Revolucionar seu RH?
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Junte-se a centenas de empresas que já transformaram 
                sua gestão de pessoas com a HumanSys.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" onClick={() => navigate('/plans')}>
                  <Zap className="h-4 w-4 mr-2" />
                  Testar Grátis
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/contact')}>
                  Falar com Consultor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};