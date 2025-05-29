
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Plus, Video, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Meetings = () => {
  const { toast } = useToast();
  const [meetings, setMeetings] = useState([
    {
      id: '1',
      title: 'Reunião 1:1 - João Silva',
      date: '2024-01-25',
      time: '14:00',
      duration: '30 min',
      type: 'one-on-one',
      location: 'Sala de Reuniões A',
      participants: ['João Silva'],
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Feedback Trimestral - Ana Costa',
      date: '2024-01-26',
      time: '10:00',
      duration: '45 min',
      type: 'feedback',
      location: 'Online - Google Meet',
      participants: ['Ana Costa'],
      status: 'scheduled'
    }
  ]);

  const handleScheduleMeeting = () => {
    toast({
      title: "Agendar Reunião",
      description: "Funcionalidade de agendamento será implementada em breve."
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'one-on-one': return Users;
      case 'feedback': return Users;
      case 'team': return Users;
      default: return Calendar;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Reuniões 1:1</h1>
            <p className="text-muted-foreground">
              Gerencie reuniões individuais e feedback com colaboradores
            </p>
          </div>
          <Button onClick={handleScheduleMeeting}>
            <Plus className="mr-2 h-4 w-4" />
            Agendar Reunião
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">reuniões agendadas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Realizadas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">neste mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">aguardando</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Comparecimento</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-muted-foreground">média mensal</p>
            </CardContent>
          </Card>
        </div>

        {/* Próximas Reuniões */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Próximas Reuniões</h3>
          
          {meetings.map((meeting) => {
            const TypeIcon = getTypeIcon(meeting.type);
            return (
              <Card key={meeting.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <TypeIcon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{meeting.title}</CardTitle>
                        <Badge variant={getStatusColor(meeting.status)}>
                          {meeting.status === 'scheduled' ? 'Agendada' : 
                           meeting.status === 'completed' ? 'Realizada' : 'Cancelada'}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(meeting.date).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {meeting.time} ({meeting.duration})
                        </div>
                        <div className="flex items-center gap-1">
                          {meeting.location.includes('Online') ? (
                            <Video className="h-4 w-4" />
                          ) : (
                            <MapPin className="h-4 w-4" />
                          )}
                          {meeting.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Participantes:</span>
                      {meeting.participants.map((participant, index) => (
                        <Badge key={index} variant="outline">
                          {participant}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        {meeting.location.includes('Online') ? 'Entrar' : 'Ver Detalhes'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};
