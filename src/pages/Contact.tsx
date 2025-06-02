import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare,
  Users,
  Zap,
  Building,
  Crown,
  Brain,
  Headphones,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    employees: '',
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Mensagem enviada com sucesso!",
      description: "Nossa equipe entrará em contato em até 2 horas úteis.",
    });

    setFormData({
      name: '',
      email: '',
      company: '',
      employees: '',
      subject: '',
      message: '',
      priority: 'normal'
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Principal',
      value: 'contato@humansys.com.br',
      description: 'Resposta em até 2 horas úteis'
    },
    {
      icon: Phone,
      title: 'WhatsApp Business',
      value: '+55 (11) 99999-9999',
      description: 'Atendimento imediato'
    },
    {
      icon: MapPin,
      title: 'Endereço',
      value: 'São Paulo, SP - Brasil',
      description: 'Atendimento presencial com agendamento'
    },
    {
      icon: Clock,
      title: 'Horário de Atendimento',
      value: 'Seg-Sex: 8h às 18h',
      description: 'Suporte 24/7 para clientes Premium'
    }
  ];

  const supportOptions = [
    {
      icon: MessageSquare,
      title: 'Suporte Técnico',
      description: 'Problemas com a plataforma, integrações ou funcionalidades',
      action: 'Abrir Ticket',
      priority: 'high'
    },
    {
      icon: Users,
      title: 'Consultoria em RH',
      description: 'Estratégias de gestão de pessoas e implementação',
      action: 'Agendar Consulta',
      priority: 'normal'
    },
    {
      icon: Crown,
      title: 'Enterprise & Custom',
      description: 'Soluções personalizadas para grandes empresas',
      action: 'Falar com Especialista',
      priority: 'high'
    },
    {
      icon: Brain,
      title: 'IA & Analytics',
      description: 'Dúvidas sobre análise DISC, relatórios e insights',
      action: 'Consultor IA',
      priority: 'normal'
    }
  ];

  const subjects = [
    'Dúvidas sobre Planos',
    'Suporte Técnico',
    'Consultoria Especializada',
    'Integração e API',
    'Treinamento da Equipe',
    'Enterprise Solutions',
    'Parceria Comercial',
    'Feedback do Produto',
    'Outros'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />

      <div className="container py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl mb-6">
            Entre em <span className="text-green-600">Contato</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nossa equipe está pronta para ajudar você a transformar 
            a gestão de pessoas da sua empresa.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Formulário de Contato */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Envie sua Mensagem
                </CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo e nossa equipe entrará em contato rapidamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Nome da sua empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employees">Número de Colaboradores</Label>
                      <Select value={formData.employees} onValueChange={(value) => setFormData(prev => ({ ...prev, employees: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o porte" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 colaboradores</SelectItem>
                          <SelectItem value="11-50">11-50 colaboradores</SelectItem>
                          <SelectItem value="51-200">51-200 colaboradores</SelectItem>
                          <SelectItem value="201-500">201-500 colaboradores</SelectItem>
                          <SelectItem value="500+">Mais de 500 colaboradores</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto *</Label>
                      <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o assunto" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Prioridade</Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Descreva sua necessidade ou dúvida..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                    {!isSubmitting && <Zap className="h-4 w-4 ml-2" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Informações de Contato */}
          <div className="space-y-6">
            {/* Contato Direto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  Contato Direto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{info.title}</h4>
                        <p className="text-sm font-medium text-green-600">{info.value}</p>
                        <p className="text-xs text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Opções de Suporte */}
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Suporte</CardTitle>
                <CardDescription>
                  Escolha o canal mais adequado para sua necessidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-green-600 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{option.title}</h4>
                            {option.priority === 'high' && (
                              <Badge variant="secondary" className="text-xs">
                                Prioritário
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            {option.description}
                          </p>
                          <Button variant="outline" size="sm" className="w-full">
                            {option.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Garantias */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Nossas Garantias
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Resposta em até 2 horas úteis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Suporte especializado em RH</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Consultoria gratuita no primeiro contato</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Acompanhamento pós-implementação</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};