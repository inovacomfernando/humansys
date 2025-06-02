import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  MessageSquare,
  BarChart3,
  Settings,
  Eye,
  Lightbulb,
  Cpu,
  Database,
  Activity,
  CheckCircle,
  Bot,
  Play,
  Pause
} from 'lucide-react';

export const BrainsysIAO = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const handleExecutePrompt = () => {
    if (!aiPrompt.trim()) return;

    setIsProcessing(true);
    setProcessingProgress(0);

    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setAiResponse(`Análise processada com sucesso!\n\nPrompt: "${aiPrompt}"\n\nResultado: Sistema de IA analisou a solicitação e gerou insights relevantes baseados nos dados organizacionais disponíveis.`);
          setAiPrompt('');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Brainsys IAO V.1</h1>
                  <p className="text-purple-100 text-lg mb-3">
                    Orquestrador de Inteligência Organizacional Avançada
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      <Activity className="h-3 w-3 mr-1" />
                      Sistema Online
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      <Cpu className="h-3 w-3 mr-1" />
                      IA Preditiva v2.1
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      <Database className="h-3 w-3 mr-1" />
                      ML Learning
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-200">Powered by</div>
                <div className="text-xl font-bold">Claude 3.5 Sonnet</div>
                <div className="text-xs text-purple-300">API Integration</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Brain className="h-5 w-5 text-green-600 mr-2" />
                  IA Core
                </span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 mb-1">ONLINE</div>
              <div className="text-sm text-green-600 mb-2">Sistema operacional</div>
              <Progress value={98} className="h-2" />
              <div className="text-xs text-green-500 mt-1">98% uptime</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 mb-1">24</div>
              <div className="text-sm text-blue-600 mb-2">Módulos ativos</div>
              <Progress value={85} className="h-2" />
              <div className="text-xs text-blue-500 mt-1">85% utilização</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Lightbulb className="h-5 w-5 text-purple-600 mr-2" />
                Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700 mb-1">1,847</div>
              <div className="text-sm text-purple-600 mb-2">Gerados este mês</div>
              <Progress value={92} className="h-2" />
              <div className="text-xs text-purple-500 mt-1">+23% vs mês anterior</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Target className="h-5 w-5 text-orange-600 mr-2" />
                Precisão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-700 mb-1">94.7%</div>
              <div className="text-sm text-orange-600 mb-2">Acurácia preditiva</div>
              <Progress value={94.7} className="h-2" />
              <div className="text-xs text-orange-500 mt-1">Benchmark: 89.2%</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="console" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="console" className="flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <span>Console IA</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Insights</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="console" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Console de Comando IA Avançado
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled={isProcessing}
                  >
                    {isProcessing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isProcessing ? 'Processando...' : 'Análise Completa'}
                  </Button>
                </CardTitle>
                <CardDescription>
                  Interface direta com o núcleo de IA para comandos avançados e análises personalizadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prompt ou Comando IA</label>
                  <Textarea 
                    placeholder="Ex: Analise padrões de turnover por departamento e gere predições para os próximos 6 meses..."
                    className="min-h-[120px]"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                </div>

                {isProcessing && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center">
                        <Cpu className="h-4 w-4 mr-2 animate-spin" />
                        Processando com IA...
                      </span>
                      <span className="text-sm text-muted-foreground">{processingProgress}%</span>
                    </div>
                    <Progress value={processingProgress} className="mb-2" />
                    <div className="text-xs text-muted-foreground">
                      Analisando dados • Aplicando machine learning • Gerando insights
                    </div>
                  </div>
                )}

                {aiResponse && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center mb-2">
                      <Brain className="h-4 w-4 text-purple-600 mr-2" />
                      <span className="font-medium text-sm">Resposta da IA</span>
                    </div>
                    <div className="text-sm whitespace-pre-wrap text-gray-700">
                      {aiResponse}
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full"
                  onClick={handleExecutePrompt}
                  disabled={isProcessing || !aiPrompt.trim()}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Executar Prompt IA
                </Button>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAiPrompt("Analise padrões de produtividade por equipe")}
                  >
                    📊 Produtividade
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAiPrompt("Identifique colaboradores em risco de turnover")}
                  >
                    ⚠️ Risco Churn
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAiPrompt("Gere relatório de engagement dos últimos 30 dias")}
                  >
                    💡 Engagement
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAiPrompt("Otimize alocação de recursos humanos")}
                  >
                    🎯 Otimização
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Insights Inteligentes</CardTitle>
                <CardDescription>
                  Análises e recomendações baseadas em IA para otimização organizacional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Risco de Turnover Detectado</h4>
                      <Badge className="bg-red-100 text-red-800">Alta Prioridade</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      IA identificou 3 colaboradores com alta probabilidade de saída nos próximos 60 dias.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Confiança: 87%</span>
                      <Button size="sm">Ver Detalhes</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Oportunidade de Produtividade</h4>
                      <Badge className="bg-blue-100 text-blue-800">Média Prioridade</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Análise sugere redistribuição de tarefas para aumento de 23% na eficiência.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Confiança: 92%</span>
                      <Button size="sm">Implementar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Avançados com IA</CardTitle>
                <CardDescription>
                  Métricas e análises preditivas baseadas em machine learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Métricas de Performance IA</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Precisão Preditiva</span>
                          <span className="text-sm text-purple-600">94.7%</span>
                        </div>
                        <Progress value={94.7} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Velocidade de Processamento</span>
                          <span className="text-sm text-blue-600">2.3s média</span>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Dados Processados</h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-700">2.4M</div>
                        <div className="text-sm text-blue-600">Registros</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-700">847</div>
                        <div className="text-sm text-green-600">Padrões</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema IA</CardTitle>
                <CardDescription>
                  Configure parâmetros avançados e personalize o comportamento do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Threshold de Confiança (%)</label>
                    <Input type="number" defaultValue="85" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Frequência de Análise (horas)</label>
                    <Input type="number" defaultValue="24" className="mt-1" />
                  </div>
                  <Button className="w-full mt-6">
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BrainsysIAO;