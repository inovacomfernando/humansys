
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
  role: string;
  department: string;
  email: string;
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

      setUserProfile({
        name: collaborator?.name || user?.email?.split('@')[0] || 'Usuário',
        role: collaborator?.role || 'Não informado',
        department: collaborator?.department || 'Não informado',
        email: collaborator?.email || user?.email || 'N/A'
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Set default profile
      setUserProfile({
        name: user?.email?.split('@')[0] || 'Usuário',
        role: 'Usuário',
        department: 'Geral',
        email: user?.email || 'N/A'
      });
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
• Equilíbrio Vida-Trabalho (Work-Life Balance)
• Retenção de Talentos
• Desenvolvimento de Pessoas & PDI
• People Analytics & Predição de Churn

Estou aqui para te ajudar com insights personalizados baseados no seu perfil e nas melhores práticas de gestão de pessoas!`,
      timestamp: new Date(),
      suggestions: [
        'Como melhorar minha performance?',
        'Estratégias de retenção de talentos',
        'Equilíbrio vida e trabalho',
        'Desenvolver meu plano de carreira',
        'Saúde mental no trabalho',
        'Recrutamento e seleção eficaz'
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
      
      response += `📋 **Processo Estruturado:**\n`;
      response += `1. **Atração:** Persona de candidato ideal definida\n`;
      response += `2. **Triagem:** ATS + scorecard por competência\n`;
      response += `3. **Entrevista:** Técnica + comportamental + fit cultural\n`;
      response += `4. **Testes:** Aptidão + perfil comportamental\n`;
      response += `5. **Feedback:** Máximo 5 dias úteis\n`;
      response += `6. **Admissão:** Onboarding estruturado\n\n`;

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
    
    // EXPERTISE EM EQUILÍBRIO VIDA-TRABALHO
    else if (message.includes('equilíbrio') || message.includes('vida e trabalho') || message.includes('work-life') || message.includes('balance')) {
      response = `⚖️ **EQUILÍBRIO VIDA-TRABALHO**\n\n`;
      response += `Como especialista em bem-estar organizacional, reconheço que o equilíbrio vida-trabalho é fundamental:\n\n`;
      
      response += `🎯 **Estratégias Eficazes:**\n`;
      response += `• **Gestão de Tempo:** Use técnica Pomodoro e bloqueie tempos para vida pessoal\n`;
      response += `• **Estabeleça Limites:** Defina horários claros de trabalho e desconexão\n`;
      response += `• **Priorização:** Use matriz de Eisenhower (urgente vs importante)\n`;
      response += `• **Delegação:** Identifique tarefas que podem ser redistribuídas\n`;
      response += `• **Autocuidado:** Reserve tempo para exercícios, hobbies e descanso\n\n`;

      suggestions = [
        'Como estabelecer limites saudáveis?',
        'Técnicas de gestão de tempo eficazes',
        'Políticas de flexibilidade na empresa',
        'Como desconectar do trabalho?',
        'Sinais de desequilíbrio vida-trabalho'
      ];
    }
    
    // Resposta genérica baseada no perfil
    else {
      response = `🤔 Entendi! Baseado no seu perfil, posso ajudar você com várias áreas do seu desenvolvimento profissional. Em que gostaria de focar hoje?`;
      
      suggestions = [
        'Análise da minha performance atual',
        'Plano de carreira personalizado',
        'Treinamentos recomendados',
        'Dicas de integração com a equipe',
        'Estratégias de retenção de talentos'
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick('Como ter equilíbrio vida e trabalho?')}
              className="text-xs"
            >
              <Target className="h-3 w-3 mr-1" />
              Work-Life Balance
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
