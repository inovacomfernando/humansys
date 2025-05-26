
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, PlayCircle, Download, ExternalLink } from 'lucide-react';

export const Documentation = () => {
  const sections = [
    {
      title: 'Primeiros Passos',
      description: 'Aprenda a configurar e usar o sistema pela primeira vez',
      items: [
        'Configuração inicial',
        'Criação de usuários',
        'Personalização da interface',
        'Importação de dados'
      ]
    },
    {
      title: 'Gestão de Colaboradores',
      description: 'Gerencie informações e dados dos seus colaboradores',
      items: [
        'Cadastro de colaboradores',
        'Organização por departamentos',
        'Controle de status',
        'Relatórios personalizados'
      ]
    },
    {
      title: 'Processo de Onboarding',
      description: 'Configure processos de integração eficazes',
      items: [
        'Criação de templates',
        'Definição de etapas',
        'Acompanhamento de progresso',
        'Automatização de tarefas'
      ]
    },
    {
      title: 'Sistema de Feedback',
      description: 'Implemente cultura de feedback na sua empresa',
      items: [
        'Configuração de ciclos',
        'Feedback 360°',
        'Avaliações de performance',
        'Relatórios de desenvolvimento'
      ]
    }
  ];

  const resources = [
    {
      title: 'Guia de Instalação',
      description: 'PDF com instruções completas',
      type: 'PDF',
      action: 'Download'
    },
    {
      title: 'Vídeo Tutorial',
      description: 'Walkthrough completo do sistema',
      type: 'Vídeo',
      action: 'Assistir'
    },
    {
      title: 'API Reference',
      description: 'Documentação técnica da API',
      type: 'Web',
      action: 'Acessar'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Documentação</h1>
            <p className="text-xl text-muted-foreground">
              Tudo que você precisa saber para usar o RH System
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mb-12">
            {sections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    {section.title}
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                        <a href="#" className="hover:text-primary transition-colors">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recursos Adicionais</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {resources.map((resource, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      {resource.type === 'PDF' && <Download className="mr-2 h-4 w-4" />}
                      {resource.type === 'Vídeo' && <PlayCircle className="mr-2 h-4 w-4" />}
                      {resource.type === 'Web' && <ExternalLink className="mr-2 h-4 w-4" />}
                      {resource.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Precisa de Ajuda?</h2>
            <p className="text-muted-foreground mb-6">
              Nossa equipe de suporte está pronta para ajudar você
            </p>
            <div className="flex justify-center gap-4">
              <Button>Contatar Suporte</Button>
              <Button variant="outline">Agendar Demo</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
