
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

export const Blog = () => {
  const posts = [
    {
      id: 1,
      title: 'O Futuro do RH: Tendências para 2024',
      excerpt: 'Descubra as principais tendências que irão moldar a gestão de recursos humanos nos próximos anos.',
      author: 'Maria Silva',
      date: '15 de Janeiro, 2024',
      category: 'Tendências',
      readTime: '5 min',
      image: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'Como Implementar um Processo de Onboarding Eficaz',
      excerpt: 'Guia completo para criar um processo de integração que realmente funciona.',
      author: 'João Santos',
      date: '10 de Janeiro, 2024',
      category: 'Onboarding',
      readTime: '8 min',
      image: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'Feedback 360: Revolucionando a Avaliação de Performance',
      excerpt: 'Entenda como o feedback 360 pode transformar a cultura da sua empresa.',
      author: 'Ana Costa',
      date: '5 de Janeiro, 2024',
      category: 'Performance',
      readTime: '6 min',
      image: '/placeholder.svg'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-muted-foreground">
              Insights, dicas e tendências sobre gestão de pessoas
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video bg-muted rounded-t-lg"></div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <User className="mr-1 h-4 w-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {post.date}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Quer receber nossos artigos?</h2>
            <p className="text-muted-foreground mb-6">
              Assine nossa newsletter e receba conteúdos exclusivos sobre RH
            </p>
            <div className="flex max-w-md mx-auto gap-2">
              <input 
                type="email" 
                placeholder="Seu email" 
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                Assinar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
