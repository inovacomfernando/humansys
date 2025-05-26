
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users } from 'lucide-react';

export const Careers = () => {
  const jobs = [
    {
      id: 1,
      title: 'Desenvolvedor Frontend React',
      department: 'Tecnologia',
      location: 'São Paulo, SP',
      type: 'CLT',
      level: 'Pleno',
      description: 'Procuramos um desenvolvedor React para integrar nossa equipe de produto.',
      requirements: ['React', 'TypeScript', 'Tailwind CSS', 'Git']
    },
    {
      id: 2,
      title: 'Analista de RH',
      department: 'Recursos Humanos',
      location: 'Remoto',
      type: 'CLT',
      level: 'Júnior',
      description: 'Oportunidade para atuar na área de gestão de pessoas em uma empresa inovadora.',
      requirements: ['Psicologia/RH', 'Recrutamento', 'Excel', 'Comunicação']
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Rio de Janeiro, RJ',
      type: 'PJ',
      level: 'Senior',
      description: 'Buscamos um designer experiente para liderar projetos de interface.',
      requirements: ['Figma', 'Design System', 'Prototipagem', 'User Research']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Carreiras</h1>
            <p className="text-xl text-muted-foreground">
              Faça parte da nossa equipe e ajude a transformar a gestão de RH
            </p>
          </div>

          <div className="grid gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="mt-2">{job.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{job.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      {job.department}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {job.type}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Requisitos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button>Candidatar-se</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Não encontrou a vaga ideal?</h2>
            <p className="text-muted-foreground mb-6">
              Envie seu currículo e entraremos em contato quando surgir uma oportunidade
            </p>
            <Button variant="outline">Enviar Currículo</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
