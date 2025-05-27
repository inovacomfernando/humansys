
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { 
  BarChart3, 
  Clock, 
  Target, 
  TrendingUp,
  Zap,
  Users
} from 'lucide-react';

export const ProductivityAnalytics: React.FC = () => {
  const productivityData = [
    { date: '2024-01-15', value: 78 },
    { date: '2024-01-16', value: 82 },
    { date: '2024-01-17', value: 85 },
    { date: '2024-01-18', value: 88 },
    { date: '2024-01-19', value: 84 },
    { date: '2024-01-20', value: 90 },
    { date: '2024-01-21', value: 92 }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas de Produtividade */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtividade Geral</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">89%</div>
            <p className="text-xs text-muted-foreground">
              +7% vs mês anterior
            </p>
            <Progress value={89} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">6.2h</div>
            <p className="text-xs text-muted-foreground">
              Trabalho focado/dia
            </p>
            <Progress value={78} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiência</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">94%</div>
            <p className="text-xs text-muted-foreground">
              Tarefas completadas
            </p>
            <Progress value={94} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Colaboração</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">82%</div>
            <p className="text-xs text-muted-foreground">
              Projetos em equipe
            </p>
            <Progress value={82} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de Tendência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Tendência Semanal</span>
            </CardTitle>
            <CardDescription>
              Evolução da produtividade nos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart 
              data={productivityData} 
              type="line" 
              color="#3b82f6"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Top Performers</span>
            </CardTitle>
            <CardDescription>
              Colaboradores com melhor performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Maria Santos', score: 96, department: 'TI' },
              { name: 'João Silva', score: 94, department: 'Marketing' },
              { name: 'Ana Costa', score: 92, department: 'Vendas' },
              { name: 'Pedro Oliveira', score: 89, department: 'TI' }
            ].map((performer, index) => (
              <div key={performer.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{performer.name}</p>
                    <p className="text-sm text-muted-foreground">{performer.department}</p>
                  </div>
                </div>
                <Badge variant="secondary">{performer.score}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
