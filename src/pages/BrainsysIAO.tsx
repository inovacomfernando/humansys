
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
  Activity
} from 'lucide-react';

export const BrainsysIAO = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [aiStatus, setAiStatus] = useState('active');
  
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
    }, 5000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-xl p-8 text-white">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23a855f7\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/30">
                <Brain className="h-10 w-10 text-white animate-bounce" style={{ animationDuration: '2s' }} />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Brainsys IAO V.1</h1>
                <p className="text-purple-100 text-lg mb-2">
                  Orquestrador de Inteligência Organizacional Avançada
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    <Activity className="h-3 w-3 mr-1" />
                    Sistema Ativo
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    <Cpu className="h-3 w-3 mr-1" />
                    IA Preditiva
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    <Database className="h-3 w-3 mr-1" />
                    ML Learning
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-200 mb-1">Powered by</div>
              <div className="text-xl font-bold">Anthropic API</div>
              <div className="text-xs text-purple-300">Claude 3.5 Sonnet</div>
            </div>
          </div>
        </div>

        {/* Main Control Panel */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Brain className="h-5 w-5 text-green-600 mr-2" />
                IA Core Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 mb-1">ONLINE</div>
              <div className="text-sm text-green-600">Sistema operacional</div>
              <Progress value={98} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Network className="h-5 w-5 text-blue-600 mr-2" />
                Conexões Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 mb-1">24</div>
              <div className="text-sm text-blue-600">Módulos integrados</div>
              <Progress value={85} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Lightbulb className="h-5 w-5 text-purple-600 mr-2" />
                Insights Gerados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700 mb-1">1,247</div>
              <div className="text-sm text-purple-600">Este mês</div>
              <Progress value={92} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 text-orange-600 mr-2" />
                Precisão IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-700 mb-1">94.7%</div>
              <div className="text-sm text-orange-600">Acurácia média</div>
              <Progress value={94.7} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="console" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="console">Console IA</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="predictions">Predições</TabsTrigger>
            <TabsTrigger value="memory">Memória</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="console" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Console de Comando IA
                  </span>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleStartAnalysis}
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isProcessing ? 'Pausar' : 'Iniciar Análise'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Interface direta com o núcleo de IA para comandos avançados e análises personalizadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Comando ou Pergunta</label>
                  <Textarea 
                    placeholder="Ex: Analise o padrão de turnover dos últimos 6 meses e preveja tendências para o próximo trimestre..."
                    className="min-h-[100px]"
                  />
                </div>
                
                {isProcessing && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Processando com IA...</span>
                      <span className="text-sm text-muted-foreground">{processingProgress}%</span>
                    </div>
                    <Progress value={processingProgress} className="mb-2" />
                    <div className="text-xs text-muted-foreground">
                      Analisando dados contextuais e aplicando machine learning...
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Zap className="h-4 w-4 mr-2" />
                    Executar Análise IA
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
              </CardContent>
            </Card>

            {/* Quick Insights */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Eye className="h-5 w-5 text-blue-600 mr-2" />
                    Insight em Tempo Real
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border">
                      <div className="font-medium text-blue-900 mb-1">
                        🎯 Padrão Detectado
                      </div>
                      <div className="text-sm text-blue-700">
                        Colaboradores do setor de TI apresentam 23% mais engajamento 
                        quando participam de treinamentos técnicos semanais.
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border">
                      <div className="font-medium text-green-900 mb-1">
                        💡 Recomendação IA
                      </div>
                      <div className="text-sm text-green-700">
                        Implementar programa de mentoria pode reduzir turnover em 31% 
                        baseado em análise preditiva dos dados comportamentais.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Award className="h-5 w-5 text-purple-600 mr-2" />
                    Performance IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Precisão Preditiva</span>
                        <span className="text-sm text-purple-600">94.7%</span>
                      </div>
                      <Progress value={94.7} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Confiabilidade</span>
                        <span className="text-sm text-purple-600">96.2%</span>
                      </div>
                      <Progress value={96.2} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Velocidade</span>
                        <span className="text-sm text-purple-600">89.1%</span>
                      </div>
                      <Progress value={89.1} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Avançados com IA</CardTitle>
                <CardDescription>
                  Análises profundas e insights preditivos baseados em machine learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 text-purple-500 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-lg font-semibold mb-2">Analytics IA em Desenvolvimento</h3>
                  <p className="text-muted-foreground">
                    Funcionalidades avançadas de analytics com IA serão disponibilizadas em breve
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions">
            <Card>
              <CardHeader>
                <CardTitle>Predições e Forecasting</CardTitle>
                <CardDescription>
                  Previsões baseadas em dados históricos e algoritmos de machine learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-lg font-semibold mb-2">Módulo de Predições</h3>
                  <p className="text-muted-foreground">
                    Sistema de predições avançadas em desenvolvimento
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="memory">
            <Card>
              <CardHeader>
                <CardTitle>Memória Contextual</CardTitle>
                <CardDescription>
                  Sistema de memória longa e contextual para aprendizado contínuo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Database className="h-16 w-16 text-green-500 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-lg font-semibold mb-2">Memória Contextual</h3>
                  <p className="text-muted-foreground">
                    Sistema de memória e contexto organizacional em desenvolvimento
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema IA</CardTitle>
                <CardDescription>
                  Configure parâmetros avançados do sistema de inteligência artificial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 text-gray-500 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-lg font-semibold mb-2">Configurações Avançadas</h3>
                  <p className="text-muted-foreground">
                    Painel de configurações do sistema IA em desenvolvimento
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
