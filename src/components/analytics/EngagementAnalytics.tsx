
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { 
  Users, 
  Heart, 
  MessageSquare, 
  Target,
  TrendingUp,
  Award
} from 'lucide-react';
import { useEngagementMetrics } from '@/hooks/useEngagementMetrics';

export const EngagementAnalytics: React.FC = () => {
  const { metrics, departmentScores, trends } = useEngagementMetrics();

  return (
    <div className="space-y-6">
      {/* Métricas de Engajamento */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Geral</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">84%</div>
            <p className="text-xs text-muted-foreground">
              +5% vs mês anterior
            </p>
            <Progress value={84} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participação</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">92%</div>
            <p className="text-xs text-muted-foreground">
              Atividades do mês
            </p>
            <Progress value={92} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedback Positivo</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">78%</div>
            <p className="text-xs text-muted-foreground">
              Satisfação colaboradores
            </p>
            <Progress value={78} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Atingidas</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">67%</div>
            <p className="text-xs text-muted-foreground">
              Objetivos concluídos
            </p>
            <Progress value={67} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Evolução do Engajamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Evolução do Engajamento</span>
            </CardTitle>
            <CardDescription>
              Tendência dos últimos 6 meses por departamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart 
              data={trends} 
              type="area" 
              color="#22c55e"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Ranking por Departamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Ranking Departamental</span>
            </CardTitle>
            <CardDescription>
              Score de engajamento por área
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentScores.map((dept, index) => (
              <div key={dept.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-amber-600' : 'bg-slate-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{dept.name}</p>
                    <p className="text-sm text-muted-foreground">{dept.collaborators} colaboradores</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{dept.score}%</p>
                  <Badge variant={dept.trend === 'up' ? 'default' : dept.trend === 'down' ? 'destructive' : 'secondary'}>
                    {dept.trend === 'up' ? '+' : dept.trend === 'down' ? '-' : '='}{dept.change}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Análise Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Análise Comportamental</CardTitle>
          <CardDescription>
            Insights sobre padrões de engajamento identificados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Padrão Descoberto</h4>
              <p className="text-sm text-blue-700">
                Colaboradores que participam de treinamentos têm 40% mais engajamento
              </p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Correlação Positiva</h4>
              <p className="text-sm text-green-700">
                Feedback regular aumenta satisfação em 25% em média
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">Oportunidade</h4>
              <p className="text-sm text-orange-700">
                Departamentos com mentoria têm 30% menos turnover
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
