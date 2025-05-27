
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Bell, 
  Clock, 
  Users, 
  TrendingDown,
  CheckCircle,
  X
} from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'info' | 'success' | 'error';
  priority: 'high' | 'medium' | 'low';
  category: string;
  timestamp: string;
  actionRequired: boolean;
}

export const SmartAlerts: React.FC = () => {
  const alerts: Alert[] = [
    {
      id: '1',
      title: 'Risco de Turnover Detectado',
      description: 'Ana Silva (TI) apresenta padrão de baixo engajamento. Sugestão: agendar 1:1 urgente.',
      type: 'warning',
      priority: 'high',
      category: 'Retenção',
      timestamp: '2 min atrás',
      actionRequired: true
    },
    {
      id: '2',
      title: 'Deadline de Treinamento Próximo',
      description: 'Treinamento de Segurança expira em 3 dias para 8 colaboradores.',
      type: 'warning',
      priority: 'medium',
      category: 'Treinamento',
      timestamp: '15 min atrás',
      actionRequired: true
    },
    {
      id: '3',
      title: 'Meta de Onboarding Atingida',
      description: '95% dos novos colaboradores completaram onboarding em menos de 5 dias.',
      type: 'success',
      priority: 'low',
      category: 'Onboarding',
      timestamp: '1 hora atrás',
      actionRequired: false
    },
    {
      id: '4',
      title: 'Queda na Participação',
      description: 'Departamento de Vendas teve 30% menos participação em atividades esta semana.',
      type: 'error',
      priority: 'high',
      category: 'Engajamento',
      timestamp: '2 horas atrás',
      actionRequired: true
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'error': return <X className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-orange-200 bg-orange-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'success': return 'border-green-200 bg-green-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">Alta</Badge>;
      case 'medium': return <Badge variant="default">Média</Badge>;
      default: return <Badge variant="secondary">Baixa</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumo de Alertas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3 nas últimas 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">
              Requer ação imediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2h</div>
            <p className="text-xs text-muted-foreground">
              Resolução de alertas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Resolução</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">87%</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Alertas */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas Inteligentes</CardTitle>
          <CardDescription>
            Sistema de detecção automática de anomalias e oportunidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 border rounded-lg ${getAlertColor(alert.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{alert.title}</h4>
                        {getPriorityBadge(alert.priority)}
                        <Badge variant="outline">{alert.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alert.timestamp}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {alert.actionRequired && (
                      <Button size="sm" variant="outline">
                        Ação
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Alertas */}
      <Card>
        <CardHeader>
          <CardTitle>Configurar Alertas</CardTitle>
          <CardDescription>
            Personalize quando e como receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Categorias Monitoradas</h4>
              <div className="space-y-1">
                {['Turnover', 'Performance', 'Treinamento', 'Onboarding'].map((category) => (
                  <label key={category} className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Frequência de Notificações</h4>
              <select className="w-full p-2 border rounded">
                <option>Imediato</option>
                <option>Diário (9h)</option>
                <option>Semanal (Segunda)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
