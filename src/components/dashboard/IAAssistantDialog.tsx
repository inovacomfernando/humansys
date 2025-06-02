
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Brain,
  Target,
  BookOpen,
  Users,
  TrendingUp,
  Lightbulb,
  MessageSquare,
  Loader2,
  Star,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  insights?: {
    type: 'development' | 'training' | 'integration' | 'performance';
    title: string;
    description: string;
    action?: string;
  }[];
}

interface UserProfile {
  name: string;
  position: string;
  department: string;
  seniority_level: string;
  skills: string[];
  goals: any[];
  trainings: any[];
  performance_score?: number;
  disc_profile?: string;
}

interface IAAssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const IAAssistantDialog: React.FC<IAAssistantDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carregar perfil do usuário
  useEffect(() => {
    if (open && user?.id) {
      loadUserProfile();
      initializeConversation();
    }
  }, [open, user?.id]);

  // Auto scroll para o final das mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadUserProfile = async () => {
    try {
      // Buscar dados do colaborador
      const { data: collaborator } = await supabase
        .from('collaborators')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      // Buscar metas
      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('collaborator_id', collaborator?.id)
        .eq('status', 'active');

      // Buscar treinamentos
      const { data: trainings } = await supabase
        .from('training_enrollments')
        .select(`
          *,
          trainings:training_id(*)
        `)
        .eq('collaborator_id', collaborator?.id);

      // Buscar perfil DISC
      const { data: discProfile } = await supabase
        .from('disc_assessments')
        .select('result_summary')
        .eq('collaborator_id', collaborator?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setUserProfile({
        name: collaborator?.name || user?.email?.split('@')[0] || 'Usuário',
        position: collaborator?.position || 'Não informado',
        department: collaborator?.department || 'Não informado',
        seniority_level: collaborator?.seniority_level || 'junior',
        skills: collaborator?.skills || [],
        goals: goals || [],
        trainings: trainings || [],
        performance_score: collaborator?.performance_score || 75,
        disc_profile: discProfile?.result_summary
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const initializeConversation = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `👋 Olá! Sou seu IA Assistant especializado em RH e Desenvolvimento de Pessoas do HumanSys. 

🎯 **Minhas Especialidades:**
• Recrutamento e Seleção Estratégica
• Saúde Mental no Trabalho
• Retenção de Talentos
• Desenvolvimento de Pessoas & PDI
• People Analytics & Predição de Churn

Estou aqui para te ajudar com insights personalizados baseados no seu perfil e nas melhores práticas de gestão de pessoas!`,
      timestamp: new Date(),
      suggestions: [
        'Como melhorar minha performance?',
        'Estratégias de retenção de talentos',
        'Desenvolver meu plano de carreira',
        'Saúde mental no trabalho',
        'Recrutamento e seleção eficaz',
        'Análise do meu perfil DISC'
      ]
    };

    setMessages([welcomeMessage]);
  };

  const generatePersonalizedResponse = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    let response = '';
    let insights: any[] = [];
    let suggestions: string[] = [];

    // EXPERTISE EM RECRUTAMENTO E SELEÇÃO
    if (message.includes('recrutamento') || message.includes('seleção') || message.includes('contratar') || message.includes('vaga') || message.includes('candidato')) {
      response = `👥 **RECRUTAMENTO E SELEÇÃO ESTRATÉGICO**\n\n`;
      response += `Como especialista em atração de talentos, vou te ajudar com o processo completo:\n\n`;
      
      if (message.includes('time to hire') || message.includes('tempo')) {
        response += `⏱️ **Time to Hire Otimizado:**\n`;
        response += `• Meta ideal: 15-30 dias para posições técnicas\n`;
        response += `• Use ATS para automatizar triagem inicial\n`;
        response += `• Estruture pipeline com 4-5 etapas máximo\n`;
        response += `• Feedback em até 5 dias úteis (obrigatório)\n\n`;
      } else if (message.includes('entrevista')) {
        response += `🎯 **Entrevista por Competências:**\n`;
        response += `• Construa scorecard específico por competência\n`;
        response += `• Use método STAR (Situação, Tarefa, Ação, Resultado)\n`;
        response += `• Avalie fit cultural além de skills técnicas\n`;
        response += `• Panel de entrevistas para reduzir viés\n\n`;
      } else {
        response += `📋 **Processo Estruturado:**\n`;
        response += `1. **Atração:** Persona de candidato ideal definida\n`;
        response += `2. **Triagem:** ATS + scorecard por competência\n`;
        response += `3. **Entrevista:** Técnica + comportamental + fit cultural\n`;
        response += `4. **Testes:** Aptidão + perfil DISC integrado\n`;
        response += `5. **Feedback:** Máximo 5 dias úteis\n`;
        response += `6. **Admissão:** Onboarding estruturado\n\n`;
      }

      insights.push({
        type: 'training',
        title: 'KPIs de Recrutamento',
        description: 'Time to hire, Quality of hire, Candidate NPS, Taxa de conversão',
        action: 'Ver métricas do pipeline'
      });

      suggestions = [
        'Como reduzir time to hire?',
        'Estruturar entrevista por competências',
        'Melhorar candidate experience',
        'Aumentar diversidade no pipeline',
        'Como medir quality of hire?'
      ];
    }
    
    // EXPERTISE EM SAÚDE MENTAL NO TRABALHO
    else if (message.includes('saúde mental') || message.includes('burnout') || message.includes('estresse') || message.includes('ansiedade') || message.includes('psicológico') || message.includes('bem-estar')) {
      response = `🧠 **SAÚDE MENTAL NO TRABALHO**\n\n`;
      response += `Como especialista em bem-estar organizacional, reconheço a importância crítica da saúde emocional:\n\n`;
      
      if (message.includes('burnout')) {
        response += `🔥 **Prevenção e Gestão do Burnout:**\n`;
        response += `• Identifique sinais precoces: fadiga crônica, cinismo, baixa eficácia\n`;
        response += `• Implemente pausas obrigatórias e limites de carga horária\n`;
        response += `• Ofereça flexibilidade e autonomia no trabalho\n`;
        response += `• Fortaleça rede de apoio e comunicação aberta\n\n`;
      } else if (message.includes('programa') || message.includes('eap')) {
        response += `📞 **Programa de Apoio ao Empregado (EAP):**\n`;
        response += `• Escuta psicológica confidencial 24/7\n`;
        response += `• Orientação financeira e jurídica\n`;
        response += `• Apoio em crises familiares ou pessoais\n`;
        response += `• Workshops preventivos sobre resiliência\n\n`;
      } else {
        response += `🌟 **Iniciativas Integradas:**\n`;
        response += `• **Preventivas:** Meditação, workshops de gestão emocional\n`;
        response += `• **Interventivas:** EAP, escuta psicológica, apoio em crises\n`;
        response += `• **Culturais:** Lideranças treinadas em acolhimento empático\n`;
        response += `• **Ambientais:** Espaços de descompressão, horários flexíveis\n\n`;
      }

      insights.push({
        type: 'performance',
        title: 'Indicadores de Bem-estar',
        description: 'Absenteísmo emocional, uso de terapia, retenção em equipes críticas',
        action: 'Monitorar saúde mental da equipe'
      });

      suggestions = [
        'Como identificar burnout na equipe?',
        'Implementar programa de bem-estar',
        'Treinar liderança para acolhimento',
        'Métricas de saúde mental organizacional',
        'Como promover equilíbrio vida-trabalho?'
      ];
    }
    
    // EXPERTISE EM RETENÇÃO DE TALENTOS
    else if (message.includes('retenção') || message.includes('turnover') || message.includes('rotatividade') || message.includes('sair da empresa') || message.includes('demissão')) {
      response = `🎯 **RETENÇÃO ESTRATÉGICA DE TALENTOS**\n\n`;
      response += `Como especialista em people analytics, vou te ajudar a construir uma estratégia de retenção data-driven:\n\n`;
      
      if (message.includes('turnover') || message.includes('rotatividade')) {
        response += `📊 **Análise de Turnover:**\n`;
        response += `• **Turnover Geral:** Meta < 15% ao ano\n`;
        response += `• **Turnover Voluntário:** Foco principal de ação\n`;
        response += `• **Por Senioridade:** Juniores (maior), Seniors (crítico)\n`;
        response += `• **Por Departamento:** Identifique hotspots\n\n`;
        response += `🔍 **Fatores de Risco:**\n`;
        response += `• Falta de crescimento (35% das saídas)\n`;
        response += `• Relacionamento com gestor (25%)\n`;
        response += `• Compensação inadequada (20%)\n`;
        response += `• Cultura/ambiente tóxico (20%)\n\n`;
      } else {
        response += `🚀 **Estratégias de Retenção:**\n`;
        response += `• **Career Pathing:** PDI estruturado + mentoria\n`;
        response += `• **Reconhecimento:** Feedback contínuo + recompensas\n`;
        response += `• **Desenvolvimento:** Trilhas de aprendizado personalizadas\n`;
        response += `• **Engajamento:** Projetos desafiadores + autonomia\n`;
        response += `• **Cultura:** Valores vividos + comunicação transparente\n\n`;
      }

      insights.push({
        type: 'development',
        title: 'Predição de Churn',
        description: 'Use IA para identificar colaboradores em risco de saída',
        action: 'Ver análise preditiva'
      });

      suggestions = [
        'Como reduzir turnover voluntário?',
        'Identificar colaboradores em risco',
        'Estruturar programa de retenção',
        'KPIs de engajamento e satisfação',
        'Exit interview estruturada'
      ];
    }
    
    // EXPERTISE EM DESENVOLVIMENTO DE PESSOAS
    else if (message.includes('desenvolvimento') || message.includes('pdi') || message.includes('carreira') || message.includes('crescimento') || message.includes('promoção')) {
      response = `🌱 **DESENVOLVIMENTO ESTRATÉGICO DE PESSOAS**\n\n`;
      response += `Como especialista em people development, vou estruturar um plano completo para ${userProfile?.name || 'você'}:\n\n`;
      
      if (userProfile?.position && userProfile?.seniority_level) {
        response += `📍 **Seu Perfil Atual:**\n`;
        response += `• Posição: ${userProfile.position}\n`;
        response += `• Senioridade: ${userProfile.seniority_level}\n`;
        response += `• Departamento: ${userProfile.department}\n\n`;
      }

      response += `🎯 **PDI Estruturado:**\n`;
      response += `• **Assessment 360°:** Competências técnicas + comportamentais\n`;
      response += `• **Gap Analysis:** Onde está vs. onde quer chegar\n`;
      response += `• **Trilha de Desenvolvimento:** 70% experiência + 20% mentoria + 10% treinamento\n`;
      response += `• **Milestones:** Metas SMART com revisões trimestrais\n\n`;

      if (userProfile?.seniority_level === 'junior') {
        response += `🌟 **Foco para Júnior:**\n`;
        response += `• Fundamentos técnicos sólidos\n`;
        response += `• Soft skills: comunicação e trabalho em equipe\n`;
        response += `• Mentoría com profissional senior\n`;
        response += `• Projetos de complexidade crescente\n\n`;
      } else if (userProfile?.seniority_level === 'pleno') {
        response += `⭐ **Foco para Pleno:**\n`;
        response += `• Liderança técnica e de pequenos projetos\n`;
        response += `• Habilidades de negociação e influência\n`;
        response += `• Mentoria reversa (ensinar juniores)\n`;
        response += `• Especialização técnica ou gestão\n\n`;
      } else {
        response += `🏆 **Foco para Senior:**\n`;
        response += `• Liderança estratégica e visão de negócio\n`;
        response += `• Desenvolvimento de outros líderes\n`;
        response += `• Inovação e transformação organizacional\n`;
        response += `• Network externo e representação da empresa\n\n`;
      }

      insights.push({
        type: 'development',
        title: 'Aceleração de Carreira',
        description: 'Plano personalizado baseado em seu perfil e objetivos',
        action: 'Criar PDI detalhado'
      });

      suggestions = [
        'Como acelerar minha promoção?',
        'Competências mais valorizadas',
        'Programa de mentoria interna',
        'Mobilidade horizontal vs vertical',
        'Como ser reconhecido pela liderança?'
      ];
    }

    // Análise de contexto baseada no perfil original
    else if (message.includes('performance') || message.includes('desempenho')) {
      response = `📊 Baseado no seu perfil, vejo que você está em ${userProfile?.position} no departamento de ${userProfile?.department}. `;
      
      if (userProfile?.performance_score && userProfile.performance_score < 80) {
        response += `Sua performance atual está em ${userProfile.performance_score}%. Recomendo focar em desenvolvimento de competências técnicas.`;
        insights.push({
          type: 'performance',
          title: 'Oportunidade de Melhoria',
          description: 'Identifiquei áreas onde você pode elevar sua performance',
          action: 'Ver plano de desenvolvimento'
        });
      } else {
        response += `Excelente! Sua performance está acima da média (${userProfile?.performance_score}%). Continue assim!`;
      }

      suggestions = [
        'Como definir metas SMART?',
        'Feedback dos meus superiores',
        'Comparar com benchmarks da empresa'
      ];
    }
    
    else if (message.includes('treinamento') || message.includes('capacitação')) {
      response = `🎓 Baseado no seu perfil de ${userProfile?.seniority_level} em ${userProfile?.position}, recomendo os seguintes treinamentos:\n\n`;
      
      if (userProfile?.seniority_level === 'junior') {
        response += `• Fundamentos de liderança\n• Comunicação eficaz\n• Gestão de tempo\n• Técnicas de apresentação`;
      } else if (userProfile?.seniority_level === 'pleno') {
        response += `• Liderança avançada\n• Gestão de projetos\n• Negociação\n• Coaching e mentoria`;
      } else {
        response += `• Liderança estratégica\n• Inovação e transformação digital\n• Gestão de mudanças\n• Desenvolvimento de talentos`;
      }

      insights.push({
        type: 'training',
        title: 'Trilha de Aprendizado Personalizada',
        description: 'Cursos selecionados especificamente para seu perfil e objetivos',
        action: 'Ver treinamentos recomendados'
      });

      suggestions = [
        'Cronograma de estudos personalizado',
        'Certificações importantes para minha área',
        'Como aplicar o aprendizado no trabalho'
      ];
    }
    
    else if (message.includes('carreira') || message.includes('pdi') || message.includes('desenvolvimento')) {
      response = `🚀 Seu Plano de Desenvolvimento Individual deve focar em:\n\n`;
      
      if (userProfile?.goals && userProfile.goals.length > 0) {
        response += `✅ Vi que você tem ${userProfile.goals.length} meta(s) ativa(s). Ótimo!\n\n`;
      }

      response += `**Próximos Passos Recomendados:**\n`;
      response += `• Desenvolver competências de ${userProfile?.department}\n`;
      response += `• Ampliar network interno\n`;
      response += `• Buscar projetos de maior visibilidade\n`;
      response += `• Construir conhecimento em inovação`;

      insights.push({
        type: 'development',
        title: 'Roadmap de Carreira',
        description: 'Caminho estruturado para sua evolução profissional',
        action: 'Criar PDI detalhado'
      });

      suggestions = [
        'Como acelerar minha promoção?',
        'Competências mais valorizadas na empresa',
        'Oportunidades de mobilidade interna'
      ];
    }
    
    else if (message.includes('disc') || message.includes('perfil') || message.includes('comportamental')) {
      if (userProfile?.disc_profile) {
        response = `🧠 Seu perfil DISC mostra características interessantes!\n\n`;
        response += `Baseado na análise: ${userProfile.disc_profile}\n\n`;
        response += `**Recomendações personalizadas:**\n`;
        response += `• Aproveite seus pontos fortes naturais\n`;
        response += `• Desenvolva áreas de melhoria identificadas\n`;
        response += `• Adapte seu estilo de comunicação conforme a situação`;
      } else {
        response = `🧠 Ainda não temos seu perfil DISC completo. Recomendo fazer a avaliação para insights mais precisos!`;
        
        insights.push({
          type: 'development',
          title: 'Análise DISC Pendente',
          description: 'Complete sua avaliação para receber insights comportamentais',
          action: 'Fazer análise DISC'
        });
      }

      suggestions = [
        'Como usar meu perfil DISC no trabalho?',
        'Compatibilidade com minha equipe',
        'Adaptar estilo de liderança'
      ];
    }
    
    else if (message.includes('equipe') || message.includes('time') || message.includes('integração')) {
      response = `👥 Para melhor integração com sua equipe em ${userProfile?.department}:\n\n`;
      response += `• Participe ativamente das reuniões de equipe\n`;
      response += `• Compartilhe conhecimentos e aprenda com colegas\n`;
      response += `• Proponha iniciativas colaborativas\n`;
      response += `• Busque feedback regular do seu gestor`;

      insights.push({
        type: 'integration',
        title: 'Estratégias de Integração',
        description: 'Formas eficazes de se conectar melhor com sua equipe',
        action: 'Ver dicas de relacionamento'
      });

      suggestions = [
        'Como dar feedback construtivo?',
        'Resolver conflitos na equipe',
        'Fortalecer relacionamentos profissionais'
      ];
    }
    
    else {
      response = `🤔 Entendi! Baseado no seu perfil, posso ajudar você com várias áreas do seu desenvolvimento profissional. Em que gostaria de focar hoje?`;
      
      suggestions = [
        'Análise da minha performance atual',
        'Plano de carreira personalizado',
        'Treinamentos recomendados',
        'Insights do meu perfil DISC',
        'Dicas de integração com a equipe'
      ];
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      suggestions,
      insights
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simular processamento da IA
    setTimeout(() => {
      const assistantResponse = generatePersonalizedResponse(inputValue);
      setMessages(prev => [...prev, assistantResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>IA Assistant</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Online
                </Badge>
              </div>
              <DialogDescription className="text-left">
                Assistente inteligente personalizado para seu desenvolvimento
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                  <Card className={`${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <CardContent className="p-3">
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                      
                      {/* Insights */}
                      {message.insights && message.insights.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.insights.map((insight, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                              <div className="flex items-center gap-2 mb-1">
                                <Lightbulb className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium text-sm">{insight.title}</span>
                              </div>
                              <p className="text-xs opacity-90 mb-2">{insight.description}</p>
                              {insight.action && (
                                <Button size="sm" variant="outline" className="text-xs h-7">
                                  {insight.action}
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 bg-white/10 border-white/20 hover:bg-white/20"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className={`text-xs text-muted-foreground mt-1 ${
                    message.type === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <Card className="bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Analisando seu perfil e gerando resposta...
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t pt-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua pergunta sobre desenvolvimento, treinamentos, carreira..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick('Como está minha performance?')}
              className="text-xs"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Performance
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick('Estratégias de retenção de talentos')}
              className="text-xs"
            >
              <Users className="h-3 w-3 mr-1" />
              Retenção
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick('Como desenvolver minha carreira?')}
              className="text-xs"
            >
              <Target className="h-3 w-3 mr-1" />
              Carreira
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick('Saúde mental no trabalho')}
              className="text-xs"
            >
              <Brain className="h-3 w-3 mr-1" />
              Bem-estar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick('Recrutamento e seleção eficaz')}
              className="text-xs"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Recrutamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
