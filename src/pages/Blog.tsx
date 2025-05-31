
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Brain, Trophy, TrendingUp } from 'lucide-react';

export const Blog = () => {
  const posts = [
    {
      title: "Como a IA está Revolucionando o RH em 2024",
      excerpt: "Descubra como a Inteligência Artificial pode prever turnover e otimizar a gestão de talentos na sua empresa.",
      author: "Ana Silva",
      date: "2024-12-01",
      readTime: "5 min",
      category: "Inteligência Artificial",
      icon: Brain,
      featured: true
    },
    {
      title: "Gamificação no RH: Engajando Colaboradores",
      excerpt: "Estratégias práticas para implementar gamificação e aumentar o engajamento da sua equipe em até 45%.",
      author: "Carlos Santos",
      date: "2024-11-28",
      readTime: "7 min",
      category: "Gamificação",
      icon: Trophy,
      featured: true
    },
    {
      title: "Onboarding Digital: Melhores Práticas",
      excerpt: "Como reduzir o tempo de integração de novos colaboradores em 70% com processos digitais estruturados.",
      author: "Maria Oliveira",
      date: "2024-11-25",
      readTime: "6 min",
      category: "Onboarding",
      icon: TrendingUp,
      featured: false
    },
    {
      title: "PWA para RH: Gestão Mobile que Funciona",
      excerpt: "Por que Progressive Web Apps são o futuro da gestão de RH e como implementar na sua empresa.",
      author: "João Costa",
      date: "2024-11-22",
      readTime: "4 min",
      category: "Tecnologia",
      icon: Brain,
      featured: false
    },
    {
      title: "Analytics Preditivas: Prevenindo Turnover",
      excerpt: "Como usar dados e machine learning para identificar colaboradores em risco de saída.",
      author: "Ana Silva",
      date: "2024-11-20",
      readTime: "8 min",
      category: "Analytics",
      icon: TrendingUp,
      featured: false
    },
    {
      title: "Feedback 360°: Transformando Comunicação",
      excerpt: "Implementando um sistema de feedback eficaz que melhora o clima organizacional.",
      author: "Pedro Almeida",
      date: "2024-11-18",
      readTime: "5 min",
      category: "Feedback",
      icon: Trophy,
      featured: false
    }
  ];

  const categories = ["Todos", "Inteligência Artificial", "Gamificação", "Onboarding", "Tecnologia", "Analytics", "Feedback"];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-4">
              Blog HumanSys
            </h1>
            <p className="text-xl text-muted-foreground">
              Insights, tendências e melhores práticas em gestão de pessoas
            </p>
          </div>

          {/* Filtros por Categoria */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "Todos" ? "default" : "outline"}
                size="sm"
                className="mb-2"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Posts em Destaque */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Em Destaque</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {posts.filter(post => post.featured).map((post, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                    <post.icon className="h-16 w-16 text-primary" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <CardTitle className="text-xl hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.readTime} de leitura</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Ler mais
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Todos os Posts */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Todos os Artigos</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.filter(post => !post.featured).map((post, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">{post.category}</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <CardTitle className="text-lg hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold mb-4">
                  Receba Insights Exclusivos
                </h3>
                <p className="text-muted-foreground mb-6">
                  Assine nossa newsletter e receba as últimas tendências em RH, 
                  IA e gestão de pessoas diretamente no seu email.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Seu melhor email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <Button>
                    Assinar Newsletter
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
