
import React, { useState, useEffect } from 'react';
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
  Users,
  Award,
  Settings,
  Eye,
  Lightbulb,
  Cpu,
  Database,
  Network,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Bot,
  Radar,
  GitBranch,
  Layers
} from 'lucide-react';

export const BrainsysIAO = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [aiStatus, setAiStatus] = useState('active');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [insights, setInsights] = useState([
    {
      id: 1,
      type: 'prediction',
      title: 'Risco de Turnover Detectado',
      description: 'IA identificou 3 colaboradores com alta probabilidade de saída nos próximos 60 dias.',
      confidence: 87,
      priority: 'high',
      timestamp: new Date()
    },
    {
      id: 2,
      type: 'optimization',
      title: 'Oportunidade de Produtividade',
      description: 'Análise sugere redistribuição de tarefas no setor comercial para aumento de 23% na eficiência.',
      confidence: 92,
      priority: 'medium',
      timestamp: new Date()
    },
    {
      id: 3,
      type: 'recommendation',
      title: 'Programa de Mentoria',
      description: 'Implementação de mentoria pode reduzir tempo de onboarding em 31% baseado em dados similares.',
      confidence: 78,
      priority: 'low',
      timestamp: new Date()
    }
  ]);
  
  useEffect(() => {
    // Simulate AI processing animation
    const interval = setInterval(() => {
      if (isProcessing) {
        setProcessingProgress(prev => (prev >= 100 ? 0 : prev + 2));
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleStartAnalysis = () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate analysis completion
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingProgress(100);
      setAiResponse(`Análise completa realizada. Identificados 3 padrões relevantes:

1. **Padrão de Engagement**: Colaboradores com >5 interações semanais apresentam 67% menos chance de churn
2. **Predição Salarial**: Modelo sugere ajuste salarial médio de 8.5% para retenção otimizada  
3. **Cluster de Performance**: Identificados 2 grupos distintos de alta performance com características específicas

**Recomendações Imediatas:**
- Implementar programa de reconhecimento focado em micro-feedbacks
- Ajustar carga de trabalho do time de desenvolvimento
- Criar trilha de carreira personalizada para top performers`);
    }, 5000);
  };

  const handleExecutePrompt = () => {
    if (!aiPrompt.trim()) return;
    
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate AI response
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingProgress(100);
      setAiResponse(`Baseado na sua consulta: "${aiPrompt}"

**Análise IA:**
- Processamento de 1.247 registros organizacionais
- Aplicação de algoritmos de ML para padrões comportamentais
- Cross-referência com benchmarks do setor

**Insights Gerados:**
- Correlação identificada entre variáveis solicitadas
- Predições baseadas em dados históricos
- Recomendações personalizadas para sua organização

*Esta é uma simulação. A implementação real integrará com APIs de IA avançada.*`);
      setAiPrompt('');
    }, 3000);
  };

  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Média</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800 border-green-200">Baixa</Badge>;
    }
  };

  const renderInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction':
        return <Radar className="h-5 w-5 text-blue-600" />;
      case 'optimization':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      default:
        return <Lightbulb className="h-5 w-5 text-purple-600" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Advanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-xl p-8 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-30"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/30">
                  <Brain className="h-12 w-12 text-white animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Brainsys IAO V.1
                </h1>
                <p className="text-purple-100 text-xl mb-3">
                  Orquestrador de Inteligência Organizacional Avançada
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1">
                    <Activity className="h-3 w-3 mr-1" />
                    Sistema Online
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1">
                    <Cpu className="h-3 w-3 mr-1" />
                    IA Preditiva v2.1
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-3 py-1">
                    <Database className="h-3 w-3 mr-1" />
                    ML Learning
                  </Badge>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 px-3 py-1">
                    <Layers className="h-3 w-3 mr-1" />
                    Memória Contextual
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="text-sm text-purple-200">Powered by</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Claude 3.5 Sonnet
              </div>
              <div className="text-xs text-purple-300">Anthropic API Integration</div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-purple-200">Latência: 120ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-shadow">
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
              <Progress value={98.7} className="h-2" />
              <div className="text-xs text-green-500 mt-1">98.7% uptime</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Network className="h-5 w-5 text-blue-600 mr-2" />
                  Conexões
                </span>
                <Activity className="h-4 w-4 text-blue-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 mb-1">24</div>
              <div className="text-sm text-blue-600 mb-2">Módulos ativos</div>
              <Progress value={85.2} className="h-2" />
              <div className="text-xs text-blue-500 mt-1">12ms latência média</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Lightbulb className="h-5 w-5 text-purple-600 mr-2" />
                  Insights
                </span>
                <Sparkles className="h-4 w-4 text-purple-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700 mb-1">1,847</div>
              <div className="text-sm text-purple-600 mb-2">Gerados este mês</div>
              <Progress value={92.3} className="h-2" />
              <div className="text-xs text-purple-500 mt-1">+23% vs mês anterior</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Target className="h-5 w-5 text-orange-600 mr-2" />
                  Precisão
                </span>
                <Award className="h-4 w-4 text-orange-600" />
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
          <TabsList className="grid w-full grid-cols-6 h-12">
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
            <TabsTrigger value="predictions" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Predições</span>
            </TabsTrigger>
            <TabsTrigger value="memory" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Memória</span>
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
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleStartAnalysis}
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isProcessing ? 'Pausar' : 'Análise Completa'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Interface direta com o núcleo de IA para comandos avançados, análises personalizadas e processamento de linguagem natural
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prompt ou Comando IA</label>
                  <Textarea 
                    placeholder="Ex: Analise padrões de turnover por departamento e gere predições para os próximos 6 meses considerando sazonalidade e performance..."
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
                      Analisando dados contextuais • Aplicando machine learning • Gerando insights preditivos
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

                <div className="flex space-x-2">
                  <Button 
                    className="flex-1"
                    onClick={handleExecutePrompt}
                    disabled={isProcessing || !aiPrompt.trim()}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Executar Prompt IA
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4" />
                    Upload Data
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setAiPrompt("Analise padrões de produtividade por equipe")}>
                    📊 Produtividade
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAiPrompt("Identifique colaboradores em risco de turnover")}>
                    ⚠️ Risco Churn
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAiPrompt("Gere relatório de engagement dos últimos 30 dias")}>
                    💡 Engagement
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAiPrompt("Otimize alocação de recursos humanos")}>
                    🎯 Otimização
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-1">
              {insights.map((insight) => (
                <Card key={insight.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        {renderInsightIcon(insight.type)}
                        <span className="ml-2">{insight.title}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {renderPriorityBadge(insight.priority)}
                        <Badge variant="outline">
                          {insight.confidence}% confiança
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {insight.timestamp.toLocaleString()}
                      </span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Ver Detalhes
                        </Button>
                        <Button size="sm">
                          Aplicar Ação
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Avançados com IA</CardTitle>
                <CardDescription>
                  Análises profundas e insights preditivos baseados em machine learning e processamento de dados em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Métricas de Performance IA</h3>
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
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Confiabilidade do Sistema</span>
                          <span className="text-sm text-green-600">99.1%</span>
                        </div>
                        <Progress value={99.1} className="h-2" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Dados Processados (Último Mês)</h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-700">2.4M</div>
                        <div className="text-sm text-blue-600">Registros analisados</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-700">847</div>
                        <div className="text-sm text-green-600">Padrões identificados</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-700">156</div>
                        <div className="text-sm text-purple-600">Predições geradas</div>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-700">93%</div>
                        <div className="text-sm text-orange-600">Taxa de acerto</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions">
            <Card>
              <CardHeader>
                <CardTitle>Predições e Forecasting IA</CardTitle>
                <CardDescription>
                  Previsões baseadas em dados históricos, algoritmos de machine learning e análise preditiva avançada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                        Alertas Críticos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-700 mb-2">3</div>
                      <div className="text-sm text-red-600 mb-3">
                        Colaboradores com alta probabilidade de churn (>80%)
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <TrendingUp className="h-5 w-5 text-yellow-600 mr-2" />
                        Tendências
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-700 mb-2">+12%</div>
                      <div className="text-sm text-yellow-600 mb-3">
                        Aumento previsto em produtividade nos próximos 3 meses
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Ver Projeção
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        Oportunidades
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-700 mb-2">7</div>
                      <div className="text-sm text-green-600 mb-3">
                        Oportunidades de otimização identificadas pela IA
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Implementar
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="memory">
            <Card>
              <CardHeader>
                <CardTitle>Memória Contextual e Aprendizado</CardTitle>
                <CardDescription>
                  Sistema de memória organizacional para aprendizado contínuo e contextualização de decisões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-4">Base de Conhecimento</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm">Políticas Organizacionais</span>
                        <Badge>847 registros</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm">Histórico de Decisões</span>
                        <Badge>1,234 decisões</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm">Padrões Identificados</span>
                        <Badge>156 padrões</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="text-sm">Contexto Situacional</span>
                        <Badge>2,891 contextos</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Aprendizado Contínuo</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Adaptação de Modelos</span>
                          <span className="text-sm text-blue-600">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Integração de Feedback</span>
                          <span className="text-sm text-green-600">87%</span>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Refinamento Contextual</span>
                          <span className="text-sm text-purple-600">94%</span>
                        </div>
                        <Progress value={94} className="h-2" />
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
                  Configure parâmetros avançados, thresholds de IA e personalize o comportamento do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Parâmetros de IA</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Threshold de Confiança (%)</label>
                        <Input type="number" defaultValue="85" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Frequência de Análise (horas)</label>
                        <Input type="number" defaultValue="24" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Profundidade de Análise</label>
                        <select className="w-full mt-1 p-2 border rounded-md">
                          <option>Básica</option>
                          <option selected>Avançada</option>
                          <option>Profunda</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Notificações e Alertas</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Alertas de Risco</span>
                        <input type="checkbox" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Insights Automáticos</span>
                        <input type="checkbox" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Relatórios Semanais</span>
                        <input type="checkbox" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Predições de Tendência</span>
                        <input type="checkbox" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <Button className="w-full">
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
