
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle,
  Target,
  Zap
} from 'lucide-react';
import { usePredictiveAnalytics } from '@/hooks/usePredictiveAnalytics';

export const PredictiveAnalytics: React.FC = () => {
  const { predictions, trends, risks } = usePredictiveAnalytics();

  return (
    <div className="space-y-6">
      {/* Previsões Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risco de Turnover</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">15%</div>
            <p className="text-xs text-muted-foreground">
              3 colaboradores em risco alto
            </p>
            <Progress value={15} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Prevista</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12%</div>
            <p className="text-xs text-muted-foreground">
              Melhoria esperada próximos 3 meses
            </p>
            <Progress value={75} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demanda Treinamento</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">68</div>
            <p className="text-xs text-muted-foreground">
              Inscrições previstas este mês
            </p>
            <Progress value={68} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score de IA</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">87%</div>
            <p className="text-xs text-muted-foreground">
              Precisão das predições
            </p>
            <Progress value={87} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Análise de Tendências */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Tendências Preditivas</span>
            </CardTitle>
            <CardDescription>
              Projeções baseadas em dados históricos e padrões identificados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart 
              data={trends} 
              type="line" 
              color="#10b981"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Insights Automáticos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Insights Automáticos</span>
            </CardTitle>
            <CardDescription>
              Descobertas geradas pela IA baseadas nos seus dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Oportunidade Detectada</span>
              </div>
              <p className="text-sm text-green-700">
                Colaboradores do departamento de TI mostram 23% mais engajamento em treinamentos técnicos. 
                Considere expandir a oferta nesta área.
              </p>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800">Atenção Necessária</span>
              </div>
              <p className="text-sm text-orange-700">
                Taxa de conclusão de onboarding caiu 15% no último mês. 
                Revisar processo pode prevenir problemas de retenção.
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Padrão Identificado</span>
              </div>
              <p className="text-sm text-blue-700">
                Colaboradores com feedback regular têm 34% menos probabilidade de turnover. 
                Intensificar programa de feedback.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendações Baseadas em IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Recomendações Estratégicas</span>
          </CardTitle>
          <CardDescription>
            Ações sugeridas pela IA para otimizar resultados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {predictions.recommendations?.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                    {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Média' : 'Baixa'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{rec.impact}% impacto</span>
                </div>
                <h4 className="font-medium mb-2">{rec.title}</h4>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
