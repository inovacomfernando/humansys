
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
      content: `👋 Olá! Sou seu IA Assistant personalizado do HumanSys. Estou aqui para ajudar você com insights sobre desenvolvimento, PDI, treinamentos e muito mais!`,
      timestamp: new Date(),
      suggestions: [
        'Como posso melhorar minha performance?',
        'Quais treinamentos são recomendados para mim?',
        'Como desenvolver meu plano de carreira?',
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

    // Análise de contexto baseada no perfil
    if (message.includes('performance') || message.includes('desempenho')) {
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
              onClick={() => handleSuggestionClick('Quais treinamentos preciso fazer?')}
              className="text-xs"
            >
              <BookOpen className="h-3 w-3 mr-1" />
              Treinamentos
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
              onClick={() => handleSuggestionClick('Análise do meu perfil DISC')}
              className="text-xs"
            >
              <Brain className="h-3 w-3 mr-1" />
              DISC
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
