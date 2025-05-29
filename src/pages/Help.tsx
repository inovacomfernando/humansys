
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { ChevronDown, Search, HelpCircle, Book, MessageSquare, Video } from 'lucide-react';

export const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      question: "Como criar meu primeiro colaborador?",
      answer: "Acesse o menu 'Colaboradores' e clique em 'Adicionar Colaborador'. Preencha os dados básicos como nome, email, cargo e departamento."
    },
    {
      question: "Como configurar templates de certificados?",
      answer: "No menu 'Certificados', clique em 'Novo Template' e configure o design, campos automáticos e tipo de certificado desejado."
    },
    {
      question: "Como agendar reuniões 1:1?",
      answer: "Vá até 'Reuniões 1:1' no menu e clique em 'Agendar Reunião'. Selecione o colaborador, data, horário e tipo de reunião."
    },
    {
      question: "Como interpretar os analytics do dashboard founder?",
      answer: "O dashboard founder mostra métricas de receita, churn, health score dos clientes e engagement. Cada card tem tooltips explicativos."
    },
    {
      question: "Como dar feedback estruturado?",
      answer: "Use o menu 'Feedback' para criar feedbacks 360°, definir tipo, urgência e método de notificação do colaborador."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Central de Ajuda</h1>
            <p className="text-xl text-muted-foreground">
              Encontre respostas para suas dúvidas sobre a plataforma
            </p>
          </div>

          {/* Busca */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por dúvidas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categorias de Ajuda */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Documentação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Guias completos sobre todas as funcionalidades
                </p>
                <a href="/documentation" className="text-primary hover:underline">
                  Ver Documentação →
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Tutoriais em Vídeo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Aprenda assistindo nossos vídeos explicativos
                </p>
                <a href="https://youtube.com" target="_blank" className="text-primary hover:underline">
                  Ver Vídeos →
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Suporte Direto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Fale diretamente com nossa equipe de suporte
                </p>
                <a href="/contact" className="text-primary hover:underline">
                  Entrar em Contato →
                </a>
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="h-6 w-6" />
              Perguntas Frequentes
            </h2>
            
            {filteredFaqs.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Nenhuma pergunta encontrada para "{searchTerm}"
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredFaqs.map((faq, index) => (
                <Collapsible key={index}>
                  <Card>
                    <CollapsibleTrigger className="w-full">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-left text-lg">{faq.question}</CardTitle>
                        <ChevronDown className="h-4 w-4" />
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
