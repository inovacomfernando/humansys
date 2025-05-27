
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CalendarPlus, 
  Clock, 
  Users, 
  Brain, 
  Calendar as CalendarIcon,
  Video,
  MapPin,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal
} from 'lucide-react';
import { MeetingCalendar } from '@/components/meetings/MeetingCalendar';
import { MeetingScheduleDialog } from '@/components/meetings/MeetingScheduleDialog';
import { Meeting } from '@/types/meetings';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Meetings = () => {
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  // Mock meetings data
  const upcomingMeetings: Meeting[] = [
    {
      id: '1',
      title: 'Onboarding - João Silva',
      description: 'Primeira reunião de integração',
      start_time: '2024-01-25T10:00:00Z',
      end_time: '2024-01-25T11:00:00Z',
      type: 'onboarding',
      status: 'confirmed',
      location: 'Sala de Reuniões A',
      organizer_id: '1',
      participants: [],
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      title: 'Feedback Mensal - Maria Santos',
      description: 'Reunião de feedback e avaliação',
      start_time: '2024-01-25T14:00:00Z',
      end_time: '2024-01-25T15:00:00Z',
      type: 'feedback',
      status: 'scheduled',
      meeting_url: 'https://meet.google.com/abc-defg-hij',
      organizer_id: '1',
      participants: [],
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '3',
      title: 'Treinamento de Segurança',
      description: 'Sessão de treinamento obrigatório',
      start_time: '2024-01-26T09:00:00Z',
      end_time: '2024-01-26T10:30:00Z',
      type: 'training',
      status: 'confirmed',
      location: 'Auditório Principal',
      organizer_id: '1',
      participants: [],
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    }
  ];

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    console.log('Meeting clicked:', meeting);
  };

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date);
    setScheduleDialogOpen(true);
  };

  const getTypeColor = (type: Meeting['type']) => {
    const colors = {
      onboarding: 'bg-blue-500',
      feedback: 'bg-green-500',
      training: 'bg-purple-500',
      general: 'bg-gray-500'
    };
    return colors[type];
  };

  const getStatusColor = (status: Meeting['status']) => {
    const colors = {
      scheduled: 'bg-yellow-500',
      confirmed: 'bg-green-500',
      cancelled: 'bg-red-500',
      completed: 'bg-gray-500'
    };
    return colors[status];
  };

  const getStatusText = (status: Meeting['status']) => {
    const texts = {
      scheduled: 'Agendado',
      confirmed: 'Confirmado',
      cancelled: 'Cancelado',
      completed: 'Concluído'
    };
    return texts[status];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Reuniões</h1>
            <p className="text-muted-foreground">
              Gerencie reuniões com agendamento inteligente
            </p>
          </div>
          <Button onClick={() => setScheduleDialogOpen(true)}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Agendar Reunião
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoje</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">reuniões agendadas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">reuniões programadas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">IA Otimizada</CardTitle>
              <Brain className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">taxa de sucesso</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">pessoas envolvidas</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="upcoming">Próximas Reuniões</TabsTrigger>
            <TabsTrigger value="smart">Agendamento IA</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <MeetingCalendar
              meetings={upcomingMeetings}
              onMeetingClick={handleMeetingClick}
              onDateClick={handleDateClick}
            />
          </TabsContent>

          <TabsContent value="upcoming">
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <Card key={meeting.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{meeting.title}</CardTitle>
                        <CardDescription>{meeting.description}</CardDescription>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>
                              {format(new Date(meeting.start_time), 'dd/MM/yyyy', { locale: ptBR })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {format(new Date(meeting.start_time), 'HH:mm', { locale: ptBR })} - {' '}
                              {format(new Date(meeting.end_time), 'HH:mm', { locale: ptBR })}
                            </span>
                          </div>
                          {meeting.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{meeting.location}</span>
                            </div>
                          )}
                          {meeting.meeting_url && (
                            <div className="flex items-center space-x-1">
                              <Video className="h-4 w-4" />
                              <span>Online</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTypeColor(meeting.type)}>
                          {meeting.type}
                        </Badge>
                        <Badge className={getStatusColor(meeting.status)}>
                          {getStatusText(meeting.status)}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="smart">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>Agendamento com IA</span>
                </CardTitle>
                <CardDescription>
                  Use inteligência artificial para otimizar seus agendamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-medium">Otimização Automática</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Encontra os melhores horários baseado na disponibilidade
                    </p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <h3 className="font-medium">Detecção de Conflitos</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Identifica e resolve conflitos de agendamento automaticamente
                    </p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-medium">Múltiplos Participantes</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Considera a disponibilidade de todos os participantes
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button onClick={() => setScheduleDialogOpen(true)}>
                    <Brain className="h-4 w-4 mr-2" />
                    Iniciar Agendamento Inteligente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <MeetingScheduleDialog
          open={scheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
        />
      </div>
    </DashboardLayout>
  );
};
