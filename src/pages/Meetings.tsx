
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Users, Video, MapPin } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  participant: string;
  date: string;
  time: string;
  duration: number;
  type: 'one-on-one' | 'team' | 'feedback';
  status: 'scheduled' | 'completed' | 'cancelled';
  location?: string;
  notes?: string;
}

export const Meetings = () => {
  const meetings: Meeting[] = [
    {
      id: '1',
      title: '1:1 com João Silva',
      participant: 'João Silva',
      date: '2024-01-25',
      time: '14:00',
      duration: 60,
      type: 'one-on-one',
      status: 'scheduled',
      location: 'Sala de Reunião 1'
    },
    {
      id: '2',
      title: 'Feedback Trimestral - Maria',
      participant: 'Maria Santos',
      date: '2024-01-23',
      time: '10:00',
      duration: 45,
      type: 'feedback',
      status: 'completed',
      notes: 'Excelente desempenho no último trimestre'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">1:1 Meetings</h1>
            <p className="text-muted-foreground">
              Gerencie reuniões individuais e acompanhamento de equipe
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Agendar Reunião
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {meetings.filter(m => m.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendadas</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {meetings.filter(m => m.status === 'scheduled').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45min</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {meetings.map((meeting) => (
            <Card key={meeting.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{meeting.title}</CardTitle>
                    <CardDescription>Com {meeting.participant}</CardDescription>
                  </div>
                  <Badge variant={meeting.status === 'completed' ? 'default' : 'secondary'}>
                    {meeting.status === 'completed' ? 'Concluída' : 'Agendada'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(meeting.date).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {meeting.time} ({meeting.duration}min)
                    </div>
                    {meeting.location && (
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        {meeting.location}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {meeting.status === 'scheduled' && (
                      <Button variant="outline" size="sm">
                        <Video className="mr-2 h-4 w-4" />
                        Iniciar
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      {meeting.status === 'completed' ? 'Ver Notas' : 'Editar'}
                    </Button>
                  </div>
                </div>
                {meeting.notes && (
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <p className="text-sm">{meeting.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
