
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, Users, Clock, Award } from 'lucide-react';
import { useTrainingActions } from '@/hooks/useTrainingActions';

export const Training = () => {
  const { handleStartCourse, handleViewCourse, handleCreateCourse, handleStatsClick } = useTrainingActions();

  const courses = [
    {
      id: '1',
      title: 'Liderança e Gestão',
      duration: '8 horas',
      modules: 12,
      participants: 15,
      status: 'Ativo',
      type: 'regular'
    },
    {
      id: '2',
      title: 'Segurança da Informação',
      duration: '4 horas',
      modules: 6,
      participants: 45,
      status: 'Obrigatório',
      type: 'mandatory'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Treinamentos</h1>
            <p className="text-muted-foreground">
              Gerencie cursos e desenvolvimento de competências
            </p>
          </div>
          <Button onClick={handleCreateCourse}>
            <BookOpen className="mr-2 h-4 w-4" />
            Novo Curso
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleStatsClick('cursos ativos')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleStatsClick('participantes')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleStatsClick('concluídos')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <Award className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleStatsClick('horas totais')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas Totais</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342h</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {course.duration} • {course.modules} módulos
                    </p>
                  </div>
                  <Badge variant={course.type === 'mandatory' ? 'secondary' : 'default'}>
                    {course.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {course.participants} participantes
                  </span>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewCourse(course.id)}
                    >
                      Detalhes
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleStartCourse(course.id, course.title)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Iniciar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
