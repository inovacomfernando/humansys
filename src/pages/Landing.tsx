
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserPlus,
  MessageSquare,
  Target,
  BookOpen,
  Award,
  FileText,
  BarChart3,
  Check,
  Star,
  Zap,
  Shield,
  Sparkles,
  Linkedin,
  Instagram,
  Facebook,
  Github
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: UserPlus,
      title: 'Onboarding Inteligente',
      description: 'Processo estruturado de integração de novos colaboradores com acompanhamento automático.',
      path: '/onboarding'
    },
    {
      icon: Users,
      title: 'Gestão de Colaboradores',
      description: 'Controle completo do quadro de funcionários, estagiários e terceiros.',
      path: '/collaborators'
    },
    {
      icon: MessageSquare,
      title: 'Feedback 360°',
      description: 'Sistema completo de feedbacks e avaliações de performance.',
      path: '/feedback'
    },
    {
      icon: Target,
      title: 'Metas & PDI',
      description: 'Plano de Desenvolvimento Individual com controle de metas e indicadores.',
      path: '/goals'
    },
    {
      icon: BookOpen,
      title: 'Treinamentos',
      description: 'Plataforma de cursos e capacitação com certificação automática.',
      path: '/training'
    },
    {
      icon: Award,
      title: 'Certificações',
      description: 'Emissão automática de certificados após conclusão dos treinamentos.',
      path: '/certificates'
    },
    {
      icon: BarChart3,
      title: 'Pesquisas de Clima',
      description: 'Análise de cultura organizacional e clima empresarial.',
      path: '/surveys'
    },
    {
      icon: FileText,
      title: 'Gestão Documental',
      description: 'Gestão eletrônica de documentos com segurança e compliance.',
      path: '/documents'
    }
  ];

  const benefits = [
    'Redução de 70% no tempo de onboarding',
    'Aumento de 45% na retenção de talentos',
    'Melhoria de 60% na comunicação interna',
    'Economia de 50% em processos manuais'
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Diretora de RH',
      company: 'TechCorp',
      content: 'Revolucionou nossa gestão de pessoas. O ROI foi impressionante já no primeiro mês.',
      rating: 5
    },
    {
      name: 'João Santos',
      role: 'CEO',
      company: 'StartupXYZ',
      content: 'Ferramenta indispensável para escalar nossa equipe com qualidade.',
      rating: 5
    }
  ];

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Github, href: '#', label: 'GitHub' }
  ];

  const handleFeatureClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center animate-fade-in">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              Solução Completa de RH
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Transforme sua
              <span className="text-primary"> Gestão de Pessoas</span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground md:text-2xl">
              Plataforma completa para recrutamento, onboarding, desenvolvimento e gestão de talentos. 
              Tudo que você precisa em um só lugar.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/trial')}
              >
                <Zap className="mr-2 h-5 w-5" />
                Começar Teste Grátis
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/login')}
              >
                Fazer Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl">
              Funcionalidades Completas
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Todas as ferramentas que você precisa para uma gestão de RH eficiente
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="relative group hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleFeatureClick(feature.path)}
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold md:text-4xl">
                Resultados Comprovados
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Empresas que usam nossa solução veem resultados imediatos
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl">
              Cases de Sucesso
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Veja o que nossos clientes estão dizendo
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} - {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-primary">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center text-white">
            <h2 className="text-3xl font-bold md:text-4xl">
              Pronto para Começar?
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Junte-se a centenas de empresas que já transformaram sua gestão de RH
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-6"
                onClick={() => navigate('/trial')}
              >
                <Shield className="mr-2 h-5 w-5" />
                Teste Grátis por 30 Dias
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary"
                onClick={() => navigate('/plans')}
              >
                Ver Planos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/features" className="hover:text-primary">Funcionalidades</a></li>
                <li><a href="/pricing" className="hover:text-primary">Preços</a></li>
                <li><a href="/integrations" className="hover:text-primary">Integrações</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/about" className="hover:text-primary">Sobre</a></li>
                <li><a href="/careers" className="hover:text-primary">Carreiras</a></li>
                <li><a href="/blog" className="hover:text-primary">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/documentation" className="hover:text-primary">Documentação</a></li>
                <li><a href="/help" className="hover:text-primary">Ajuda</a></li>
                <li><a href="/contact" className="hover:text-primary">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/privacy" className="hover:text-primary">Política de Privacidade</a></li>
                <li><a href="/terms" className="hover:text-primary">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              &copy; 2024 RH System. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
