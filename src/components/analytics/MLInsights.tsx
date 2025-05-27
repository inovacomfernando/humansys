
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users,
  Lightbulb,
  Zap
} from 'lucide-react';

export const MLInsights: React.FC = () => {
  const predictionData = [
    { date: '2024-02-01', value: 78, prediction: true },
    { date: '2024-02-15', value: 82, prediction: true },
    { date: '2024-03-01', value: 85, prediction: true },
    { date: '2024-03-15', value: 88, prediction: true },
    { date: '2024-04-01', value: 91, prediction: true },
    { date: '2024-04-15', value: 89, prediction: true }
  ];

  const clusters = [
    {
      name: 'Grupo Alto Performance',
      size: 23,
      characteristics: ['Alta produtividade', 'Engajamento alto', 'Baixo risco turnover'],
      color: 'bg-green-500'
    },
    {
      name: 'Grupo Em Desenvolvimento',
      size: 31,
      characteristics: ['Performance média', 'Potencial de crescimento', 'Necessita mentoria'],
      color: 'bg-blue-500'
    },
    {
      name: 'Grupo Risco',
      size: 12,
      characteristics: ['Baixo engajamento', 'Performance inconsistente', 'Alto risco turnover'],
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas de ML */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisão do Modelo</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">91.2%</div>
            <p className="text-xs text-muted-foreground">
              Últimas 1000 previsões
            </p>
            <Progress value={91} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Padrões Detectados</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">47</div>
            <p className="text-xs text-muted-foreground">
              Correlações significativas
            </p>
            <Progress value={78} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insights Gerados</CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">23</div>
            <p className="text-xs text-muted-foreground">
              Esta semana
            </p>
            <Progress value={85} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automação</CardTitle>
            <Zap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94%</div>
            <p className="text-xs text-muted-foreground">
              Processos automatizados
            </p>
            <Progress value={94} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Previsões Futuras */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Previsões 6 Meses</span>
            </CardTitle>
            <CardDescription>
              Projeções baseadas em machine learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart 
              data={predictionData} 
              type="line" 
              color="#8b5cf6"
              height={300}
            />
            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded">
              <p className="text-sm text-purple-700">
                <strong>IA Prevê:</strong> Crescimento de 15% na performance geral 
                dos colaboradores nos próximos 6 meses, com maior impacto no Q2.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Clustering de Colaboradores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Segmentação Inteligente</span>
            </CardTitle>
            <CardDescription>
              Agrupamento automático por comportamento e performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {clusters.map((cluster, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${cluster.color}`}></div>
                    <h4 className="font-medium">{cluster.name}</h4>
                  </div>
                  <Badge variant="secondary">{cluster.size} pessoas</Badge>
                </div>
                <div className="space-y-1">
                  {cluster.characteristics.map((char, charIndex) => (
                    <p key={charIndex} className="text-xs text-muted-foreground">
                      • {char}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Descobertas de IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Descobertas da IA</span>
          </CardTitle>
          <CardDescription>
            Insights automáticos descobertos pelos algoritmos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Correlação Forte (r=0.87)</span>
              </div>
              <p className="text-sm text-blue-700">
                Colaboradores que participam de {'>'}3 treinamentos/ano têm 40% menos 
                probabilidade de deixar a empresa no próximo ano.
              </p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Padrão Temporal</span>
              </div>
              <p className="text-sm text-green-700">
                Feedback dado nas primeiras 2 semanas do mês tem 60% mais impacto 
                positivo na performance do colaborador.
              </p>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800">Predição Comportamental</span>
              </div>
              <p className="text-sm text-purple-700">
                Colaboradores que fazem perguntas em reuniões têm 25% mais chance 
                de serem promovidos nos próximos 12 meses.
              </p>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800">Otimização Detectada</span>
              </div>
              <p className="text-sm text-orange-700">
                Reuniões 1:1 com duração de 20-30 minutos geram 35% mais 
                engajamento que reuniões mais longas ou mais curtas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações do Modelo */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Machine Learning</CardTitle>
          <CardDescription>
            Ajuste os parâmetros dos algoritmos de análise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Sensibilidade de Detecção</label>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs">Baixa</span>
                  <Progress value={70} className="flex-1" />
                  <span className="text-xs">Alta</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Janela de Predição</label>
                <select className="w-full p-2 border rounded mt-1">
                  <option>30 dias</option>
                  <option>90 dias</option>
                  <option>6 meses</option>
                  <option>1 ano</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Atualização do Modelo</label>
                <select className="w-full p-2 border rounded mt-1">
                  <option>Tempo real</option>
                  <option>Diário</option>
                  <option>Semanal</option>
                  <option>Mensal</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Variáveis Consideradas</label>
                <div className="mt-1 space-y-1">
                  {['Performance', 'Engajamento', 'Feedback', 'Treinamentos'].map((variable) => (
                    <label key={variable} className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">{variable}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
