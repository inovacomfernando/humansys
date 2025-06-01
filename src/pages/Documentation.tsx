
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book, Video, Download, ExternalLink, Brain, Trophy, Smartphone, CreditCard } from 'lucide-react';

export const Documentation = () => {
  const sections = [
    {
      title: "Primeiros Passos",
      description: "Guias essenciais para começar",
      items: [
        { title: "Configuração Inicial", type: "guide", difficulty: "Iniciante" },
        { title: "Importação de Colaboradores", type: "guide", difficulty: "Iniciante" },
        { title: "Configuração de Permissões", type: "guide", difficulty: "Intermediário" },
        { title: "Tour pela Plataforma", type: "video", difficulty: "Iniciante" }
      ]
    },
    {
      title: "Gestão de Colaboradores",
      description: "Como gerenciar seu quadro de pessoal",
      items: [
        { title: "Cadastro de Colaboradores", type: "guide", difficulty: "Iniciante" },
        { title: "Organização por Departamentos", type: "guide", difficulty: "Iniciante" },
        { title: "Relatórios de Pessoal", type: "guide", difficulty: "Intermediário" },
        { title: "Exportação de Dados", type: "guide", difficulty: "Avançado" }
      ]
    },
    {
      title: "Sistema de Onboarding",
      description: "Integração eficiente de novos colaboradores",
      items: [
        { title: "Criação de Processos", type: "guide", difficulty: "Intermediário" },
        { title: "Gamificação no Onboarding", type: "guide", difficulty: "Intermediário", isNew: true },
        { title: "Templates de Onboarding", type: "guide", difficulty: "Iniciante" },
        { title: "Acompanhamento de Progresso", type: "video", difficulty: "Iniciante" }
      ]
    },
    {
      title: "Inteligência Artificial",
      description: "Aproveitando o poder da IA para RH",
      items: [
        { title: "Analytics Preditivas", type: "guide", difficulty: "Avançado", isNew: true },
        { title: "Previsão de Turnover", type: "guide", difficulty: "Avançado", isNew: true },
        { title: "Insights Automáticos", type: "video", difficulty: "Intermediário", isNew: true },
        { title: "Configuração da IA", type: "guide", difficulty: "Avançado", isNew: true }
      ]
    },
    {
      title: "Sistema de Gamificação",
      description: "Engajando colaboradores com jogos",
      items: [
        { title: "Configuração de Badges", type: "guide", difficulty: "Intermediário", isNew: true },
        { title: "Sistema de Pontos", type: "guide", difficulty: "Iniciante", isNew: true },
        { title: "Leaderboards e Rankings", type: "guide", difficulty: "Intermediário", isNew: true },
        { title: "Campanhas de Engajamento", type: "video", difficulty: "Avançado", isNew: true }
      ]
    },
    {
      title: "Aplicativo Mobile (PWA)",
      description: "Acesso móvel e offline",
      items: [
        { title: "Instalação do PWA", type: "guide", difficulty: "Iniciante", isNew: true },
        { title: "Funcionalidades Offline", type: "guide", difficulty: "Iniciário", isNew: true },
        { title: "Sincronização de Dados", type: "guide", difficulty: "Avançado", isNew: true },
        { title: "Demo do App Mobile", type: "video", difficulty: "Iniciante", isNew: true }
      ]
    },
    {
      title: "Sistema de Créditos",
      description: "Gestão e controle de créditos para colaboradores",
      items: [
        { title: "Como Funcionam os Créditos", type: "guide", difficulty: "Iniciante", isNew: true },
        { title: "Gerenciamento de Créditos", type: "guide", difficulty: "Iniciante", isNew: true },
        { title: "Upgrade de Planos", type: "guide", difficulty: "Intermediário", isNew: true },
        { title: "Relatórios de Uso", type: "guide", difficulty: "Intermediário", isNew: true },
        { title: "Histórico de Transações", type: "guide", difficulty: "Avançado", isNew: true }
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-100 text-green-800';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800';
      case 'Avançado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <Book className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'download': return <Download className="h-4 w-4" />;
      default: return <Book className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-4">
              Documentação
            </h1>
            <p className="text-xl text-muted-foreground">
              Guias completos para aproveitar ao máximo a plataforma HumanSys
            </p>
          </div>

          {/* Novidades em Destaque */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 font-medium text-purple-700 mb-2">
                  <Brain className="h-5 w-5" />
                  <span>Guias de IA</span>
                  <Badge className="bg-purple-100 text-purple-800">Novo</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Aprenda a usar analytics preditivas e insights automáticos para transformar seu RH.
                </p>
                <Button variant="outline" size="sm">
                  Ver Guias de IA
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-100">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 font-medium text-yellow-700 mb-2">
                  <Trophy className="h-5 w-5" />
                  <span>Gamificação</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Novo</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure badges, pontos e rankings para engajar sua equipe.
                </p>
                <Button variant="outline" size="sm">
                  Configurar Gamificação
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-50 to-sky-50 border-blue-100">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 font-medium text-blue-700 mb-2">
                  <Smartphone className="h-5 w-5" />
                  <span>App Mobile</span>
                  <Badge className="bg-blue-100 text-blue-800">Novo</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Instale o PWA e acesse a plataforma offline no celular.
                </p>
                <Button variant="outline" size="sm">
                  Instalar PWA
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 font-medium text-green-700 mb-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Sistema de Créditos</span>
                  <Badge className="bg-green-100 text-green-800">Novo</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Entenda como funciona o sistema de créditos para cadastro de colaboradores.
                </p>
                <Button variant="outline" size="sm">
                  Ver Documentação
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Seções de Documentação */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {section.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 text-primary">
                            {getTypeIcon(item.type)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{item.title}</h4>
                              {item.isNew && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs">Novo</Badge>
                              )}
                            </div>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getDifficultyColor(item.difficulty)}`}
                            >
                              {item.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recursos Adicionais */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Recursos Adicionais</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="text-center">
                  <Video className="h-10 w-10 text-primary mx-auto mb-4" />
                  <CardTitle>Webinars</CardTitle>
                  <CardDescription>
                    Sessões ao vivo sobre novidades e melhores práticas
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline">Ver Próximos Webinars</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Download className="h-10 w-10 text-primary mx-auto mb-4" />
                  <CardTitle>Templates</CardTitle>
                  <CardDescription>
                    Downloads de templates para onboarding e avaliações
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline">Baixar Templates</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <ExternalLink className="h-10 w-10 text-primary mx-auto mb-4" />
                  <CardTitle>API Documentation</CardTitle>
                  <CardDescription>
                    Documentação técnica para desenvolvedores
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline">Acessar API Docs</Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Seção Especial: Sistema de Créditos */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-800">Como Funciona o Sistema de Créditos</CardTitle>
                <CardDescription className="text-green-700">
                  Sistema transparente e flexível para gestão de colaboradores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium text-green-800">🎯 Conceito Simples</h4>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li>• <strong>1 Crédito = 1 Colaborador</strong> cadastrado</li>
                      <li>• Créditos são consumidos apenas no momento do cadastro</li>
                      <li>• Não há limite de tempo para usar os créditos</li>
                      <li>• Histórico completo de uso disponível</li>
                    </ul>
                    
                    <h4 className="font-medium text-green-800 mt-6">📊 Planos Disponíveis</h4>
                    <div className="space-y-1 text-sm text-green-700">
                      <div className="flex justify-between">
                        <span>Inicial:</span>
                        <Badge className="bg-green-100 text-green-800">10 créditos</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Crescimento:</span>
                        <Badge className="bg-blue-100 text-blue-800">50 créditos</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Profissional:</span>
                        <Badge className="bg-purple-100 text-purple-800">500 créditos</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Teste Grátis:</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Ilimitado</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-green-800">⚙️ Gerenciamento</h4>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li>• Visualize créditos disponíveis no Dashboard</li>
                      <li>• Configure alertas quando créditos estiverem baixos</li>
                      <li>• Acesse em Configurações → Aba Créditos</li>
                      <li>• Upgrade automático disponível a qualquer momento</li>
                    </ul>
                    
                    <h4 className="font-medium text-green-800 mt-6">📈 Controle e Relatórios</h4>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li>• Histórico completo de transações</li>
                      <li>• Relatórios de uso por período</li>
                      <li>• Projeções baseadas no uso atual</li>
                      <li>• Alertas inteligentes personalizáveis</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-white rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">💡 Dica Importante</h4>
                  <p className="text-sm text-green-700">
                    Durante o <strong>teste grátis de 30 dias</strong>, você tem créditos ilimitados para 
                    cadastrar quantos colaboradores precisar. Aproveite este período para 
                    configurar toda sua equipe e conhecer todas as funcionalidades!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Final */}
          <div className="text-center mt-16">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold mb-4">
                  Precisa de Ajuda Personalizada?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Nossa equipe de especialistas está pronta para ajudar você a implementar 
                  as melhores práticas em sua empresa.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg">
                    Agendar Consultoria
                  </Button>
                  <Button variant="outline" size="lg">
                    Contatar Suporte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
