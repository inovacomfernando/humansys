
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Brain, Trophy, Target, Heart, Zap } from 'lucide-react';

export const About = () => {
  const values = [
    {
      icon: Brain,
      title: "Inovação",
      description: "Utilizamos as mais avançadas tecnologias de IA para revolucionar a gestão de pessoas."
    },
    {
      icon: Heart,
      title: "Pessoas em Primeiro Lugar",
      description: "Acreditamos que colaboradores engajados são a chave para o sucesso de qualquer empresa."
    },
    {
      icon: Target,
      title: "Resultados Mensuráveis",
      description: "Fornecemos insights e métricas que geram impacto real nos resultados do seu negócio."
    },
    {
      icon: Trophy,
      title: "Excelência",
      description: "Buscamos constantemente a melhoria contínua em tudo que fazemos."
    }
  ];

  const team = [
    {
      name: "Ana Silva",
      role: "CEO & Fundadora",
      description: "15 anos de experiência em RH e tecnologia, ex-diretora de pessoas em startups unicórnio."
    },
    {
      name: "Carlos Santos",
      role: "CTO",
      description: "Especialista em IA e Machine Learning, PhD em Ciência da Computação pela USP."
    },
    {
      name: "Maria Oliveira",
      role: "Head de Produto",
      description: "10 anos desenvolvendo produtos de RH, especialista em UX e experiência do usuário."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-20">
        {/* Hero Section */}
        <div className="mx-auto max-w-4xl text-center mb-20">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-6">
            Sobre a HumanSys
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transformamos a gestão de pessoas através da tecnologia, criando ambientes de trabalho 
            mais engajados e produtivos com o poder da Inteligência Artificial.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid gap-12 lg:grid-cols-2 mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">Nossa Missão</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Democratizar o acesso a ferramentas avançadas de gestão de pessoas, permitindo que 
              empresas de todos os tamanhos possam identificar, desenvolver e reter seus melhores talentos.
            </p>
            <p className="text-lg text-muted-foreground">
              Utilizamos Inteligência Artificial para prever tendências, gamificação para engajar 
              colaboradores e tecnologia PWA para garantir acesso em qualquer lugar e momento.
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-lg">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Empresas Atendidas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50k+</div>
                <div className="text-sm text-muted-foreground">Colaboradores Gerenciados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">85%</div>
                <div className="text-sm text-muted-foreground">Precisão na Previsão de Turnover</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">60%</div>
                <div className="text-sm text-muted-foreground">Redução na Rotatividade</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Valores</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Nossa Equipe</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {team.map((member, index) => (
              <Card key={index}>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription className="font-medium text-primary">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-8">
              <Zap className="h-12 w-12 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">
                Pronto para Transformar seu RH?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Junte-se às centenas de empresas que já revolucionaram sua gestão de pessoas 
                com nossa plataforma de IA e gamificação.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => window.location.href = '/plans'}>
                  Começar Teste Grátis
                </Button>
                <Button variant="outline" size="lg" onClick={() => window.location.href = '/contact'}>
                  Falar com Especialista
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
