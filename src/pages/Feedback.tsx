
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Plus, Star, TrendingUp, Users, Send } from 'lucide-react';

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
}

export const Feedback = () => {
  const [isCreatingFeedback, setIsCreatingFeedback] = useState(false);

  const feedbacks: FeedbackItem[] = [
    {
      id: '1',
      fromUser: 'Maria Santos',
      toUser: 'João Silva',
      type: 'performance',
      status: 'completed',
      rating: 4,
      content: 'Excelente trabalho no projeto. Demonstrou grande conhecimento técnico.',
      createdDate: '2024-01-15',
      dueDate: '2024-01-20'
    },
    {
      id: '2',
      fromUser: 'Carlos Mendes',
      toUser: 'Ana Costa',
      type: '360',
      status: 'pending',
      createdDate: '2024-01-18',
      dueDate: '2024-01-25'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
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
          
          <Dialog open={isCreatingFeedback} onOpenChange={setIsCreatingFeedback}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Feedback
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enviar Feedback</DialogTitle>
                <DialogDescription>
                  Envie um feedback para um colaborador
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Para</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um colaborador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="joao">João Silva</SelectItem>
                      <SelectItem value="maria">Maria Santos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Tipo de Feedback</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="360">360°</SelectItem>
                      <SelectItem value="peer">Entre Pares</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Comentários</Label>
                  <Textarea placeholder="Digite seu feedback..." rows={4} />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreatingFeedback(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsCreatingFeedback(false)}>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Badge className="bg-yellow-500 text-xs">!</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedbacks.filter(f => f.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedbacks.filter(f => f.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="received" className="space-y-4">
          <TabsList>
            <TabsTrigger value="received">Recebidos</TabsTrigger>
            <TabsTrigger value="sent">Enviados</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
          </TabsList>

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

          <TabsContent value="sent">
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum feedback enviado</h3>
                  <p className="text-muted-foreground">Comece enviando feedback para seus colegas</p>
                </div>
              </CardContent>
            </Card>
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
                      <span>50%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>360°</span>
                      <span>30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Entre Pares</span>
                      <span>20%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tendência Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-500">+15%</p>
                    <p className="text-sm text-muted-foreground">Crescimento este mês</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
