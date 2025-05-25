import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Plus, Star, TrendingUp, Users, Mail, Bell } from 'lucide-react';
import { AdvancedFeedbackDialog } from '@/components/feedback/AdvancedFeedbackDialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface FeedbackItem {
  id: string;
  fromUser: string;
  toUser: string;
  type: 'performance' | '360' | 'peer' | 'self';
  status: 'pending' | 'completed' | 'overdue';
  rating?: number;
  content?: string;
  createdDate: string;
  dueDate?: string;
  subject?: string;
  toEmail?: string;
  urgent?: boolean;
  sendEmail?: boolean;
  sendNotification?: boolean;
  anonymous?: boolean;
}

export const Feedback = () => {
  const [isCreatingFeedback, setIsCreatingFeedback] = useState(false);
  const [feedbacks] = useLocalStorage('feedbacks', []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'sent': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const getFeedbackTypeLabel = (type: string) => {
    const types: any = {
      'performance': 'Performance',
      '360': '360°',
      'peer': 'Entre Pares',
      'recognition': 'Reconhecimento',
      'improvement': 'Melhoria'
    };
    return types[type] || type;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Feedback</h1>
            <p className="text-muted-foreground">
              Sistema de avaliação e feedback contínuo
            </p>
          </div>
          
          <Button onClick={() => setIsCreatingFeedback(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Feedback
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{feedbacks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enviados</CardTitle>
              <Badge className="bg-blue-500 text-xs">→</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedbacks.filter((f: any) => f.status === 'sent').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Badge className="bg-yellow-500 text-xs">!</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedbacks.filter((f: any) => f.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedbacks.length > 0 
                  ? (feedbacks.reduce((acc: number, f: any) => acc + (f.rating || 0), 0) / feedbacks.filter((f: any) => f.rating).length || 0).toFixed(1)
                  : '0.0'}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sent" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sent">Enviados</TabsTrigger>
            <TabsTrigger value="received">Recebidos</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
          </TabsList>

          <TabsContent value="sent">
            <div className="space-y-4">
              {feedbacks.filter((f: any) => f.fromUser === 'Você').map((feedback: any) => (
                <Card key={feedback.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {feedback.toUser.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">Para: {feedback.toUser}</CardTitle>
                          <CardDescription>{feedback.subject}</CardDescription>
                          {feedback.toEmail && (
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                              <Mail className="h-3 w-3 mr-1" />
                              {feedback.toEmail}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{getFeedbackTypeLabel(feedback.type)}</Badge>
                        <Badge className={getStatusColor(feedback.status)}>
                          {feedback.status === 'sent' ? 'Enviado' : 
                           feedback.status === 'pending' ? 'Pendente' : 'Concluído'}
                        </Badge>
                        {feedback.urgent && (
                          <Badge variant="destructive" className="text-xs">Urgente</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {feedback.rating && (
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-sm font-medium">Avaliação:</span>
                        <div className="flex">{renderStars(feedback.rating)}</div>
                        <span className="text-sm text-muted-foreground">({feedback.rating}/5)</span>
                      </div>
                    )}
                    {feedback.content && (
                      <p className="text-sm mb-3">{feedback.content}</p>
                    )}
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Enviado em {new Date(feedback.createdDate).toLocaleDateString('pt-BR')}</span>
                      <div className="flex items-center space-x-2">
                        {feedback.sendEmail && <Mail className="h-4 w-4" />}
                        {feedback.sendNotification && <Bell className="h-4 w-4" />}
                        {feedback.anonymous && <span className="text-xs">Anônimo</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {feedbacks.filter((f: any) => f.fromUser === 'Você').length === 0 && (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Nenhum feedback enviado</h3>
                      <p className="text-muted-foreground mb-4">Comece enviando feedback para seus colegas</p>
                      <Button onClick={() => setIsCreatingFeedback(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Enviar Primeiro Feedback
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="received">
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <Card key={feedback.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {feedback.fromUser.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">De: {feedback.fromUser}</CardTitle>
                          <CardDescription>Para: {feedback.toUser}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{feedback.type}</Badge>
                        <Badge className={getStatusColor(feedback.status)}>
                          {feedback.status === 'completed' ? 'Concluído' : 
                           feedback.status === 'pending' ? 'Pendente' : 'Atrasado'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {feedback.rating && (
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-sm font-medium">Avaliação:</span>
                        <div className="flex">{renderStars(feedback.rating)}</div>
                      </div>
                    )}
                    {feedback.content && (
                      <p className="text-sm mb-3">{feedback.content}</p>
                    )}
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Criado em {new Date(feedback.createdDate).toLocaleDateString('pt-BR')}</span>
                      {feedback.dueDate && (
                        <span>Prazo: {new Date(feedback.dueDate).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Performance</span>
                      <span>{Math.round((feedbacks.filter((f: any) => f.type === 'performance').length / feedbacks.length || 0) * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>360°</span>
                      <span>{Math.round((feedbacks.filter((f: any) => f.type === '360').length / feedbacks.length || 0) * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Entre Pares</span>
                      <span>{Math.round((feedbacks.filter((f: any) => f.type === 'peer').length / feedbacks.length || 0) * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reconhecimento</span>
                      <span>{Math.round((feedbacks.filter((f: any) => f.type === 'recognition').length / feedbacks.length || 0) * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas Gerais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-lg font-bold text-green-500">{feedbacks.length}</p>
                      <p className="text-sm text-muted-foreground">Total de feedbacks</p>
                    </div>
                    <div className="text-center">
                      <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-lg font-bold text-yellow-500">
                        {feedbacks.filter((f: any) => f.rating).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Com avaliação</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <AdvancedFeedbackDialog 
          open={isCreatingFeedback}
          onOpenChange={setIsCreatingFeedback}
        />
      </div>
    </DashboardLayout>
  );
};
