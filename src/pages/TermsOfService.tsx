
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Shield, Users, CreditCard } from 'lucide-react';

export const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-4">
              Termos de Uso
            </h1>
            <p className="text-xl text-muted-foreground">
              Última atualização: 1º de dezembro de 2024
            </p>
          </div>

          <div className="grid gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Aceitação dos Termos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ao acessar e utilizar a plataforma HumanSys, você concorda com estes Termos de Uso 
                  e nossa Política de Privacidade. Se não concordar com qualquer parte destes termos, 
                  não utilize nossos serviços.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Descrição do Serviço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  A HumanSys é uma plataforma SaaS (Software as a Service) para gestão de recursos humanos 
                  que oferece:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Gestão completa de colaboradores</li>
                  <li>Sistema de onboarding com gamificação</li>
                  <li>Analytics preditivas com Inteligência Artificial</li>
                  <li>Sistema de feedback 360° e avaliações</li>
                  <li>Plataforma de treinamentos e certificações</li>
                  <li>Progressive Web App (PWA) para acesso móvel</li>
                  <li>Dashboards executivos com insights automáticos</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Responsabilidades do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Uso Adequado:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Utilizar a plataforma apenas para fins legítimos de gestão de RH</li>
                    <li>Manter a confidencialidade das credenciais de acesso</li>
                    <li>Não compartilhar conta com terceiros não autorizados</li>
                    <li>Respeitar os direitos de propriedade intelectual</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Dados e Conteúdo:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Garantir que possui autorização para inserir dados de colaboradores</li>
                    <li>Manter dados atualizados e precisos</li>
                    <li>Cumprir com a LGPD e demais regulamentações aplicáveis</li>
                    <li>Realizar backups regulares de dados críticos</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Planos e Pagamentos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Planos Disponíveis:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li><strong>Inicial:</strong> R$ 79/mês ou R$ 790/ano - Até 10 colaboradores</li>
                    <li><strong>Em Crescimento:</strong> R$ 149/mês ou R$ 1.490/ano - Até 50 colaboradores</li>
                    <li><strong>Profissional:</strong> R$ 299/mês ou R$ 2.990/ano - Colaboradores ilimitados</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Condições de Pagamento:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Teste grátis de 30 dias para todos os planos</li>
                    <li>Pagamento mensal ou anual antecipado</li>
                    <li>Desconto de 17% no plano anual</li>
                    <li>Cancelamento a qualquer momento</li>
                    <li>Reembolso proporcional em caso de cancelamento</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disponibilidade e Suporte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">SLA (Service Level Agreement):</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Uptime garantido de 99,9% ao mês</li>
                    <li>Janelas de manutenção programadas com aviso prévio</li>
                    <li>Backup automático diário dos dados</li>
                    <li>Recuperação de desastres em até 4 horas</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Níveis de Suporte:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li><strong>Inicial:</strong> Suporte por email em horário comercial</li>
                    <li><strong>Em Crescimento:</strong> Suporte prioritário com chat</li>
                    <li><strong>Profissional:</strong> Suporte 24/7 com gerente dedicado</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Propriedade Intelectual</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>A HumanSys detém todos os direitos sobre a plataforma e tecnologia</li>
                  <li>Algoritmos de IA e machine learning são propriedade exclusiva da HumanSys</li>
                  <li>Cliente mantém propriedade dos dados inseridos na plataforma</li>
                  <li>Logos, marcas e design são protegidos por direitos autorais</li>
                  <li>É proibida a engenharia reversa ou tentativa de cópia da plataforma</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limitação de Responsabilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  A HumanSys não se responsabiliza por:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Decisões de RH baseadas nos insights fornecidos pela IA</li>
                  <li>Danos indiretos ou perda de lucros</li>
                  <li>Problemas de conectividade de internet do cliente</li>
                  <li>Uso inadequado da plataforma pelos usuários</li>
                  <li>Violações de dados causadas por negligência do cliente</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Nossa responsabilidade máxima é limitada ao valor pago pelo cliente nos 
                  últimos 12 meses.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rescisão e Cancelamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Cancelamento pelo Cliente:</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Cancelamento a qualquer momento através da plataforma</li>
                      <li>Acesso mantido até o final do período pago</li>
                      <li>Exportação de dados disponível por 30 dias após cancelamento</li>
                      <li>Reembolso proporcional em casos específicos</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Rescisão pela HumanSys:</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Violação dos termos de uso</li>
                      <li>Atividade fraudulenta ou ilegal</li>
                      <li>Inadimplência por mais de 30 dias</li>
                      <li>Aviso prévio de 30 dias será fornecido quando possível</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contato e Foro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Contato para Questões Legais:</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="font-semibold">HumanSys Tecnologia Ltda.</p>
                      <p className="text-muted-foreground">Email: legal@humansys.com.br</p>
                      <p className="text-muted-foreground">Telefone: (11) 9999-9999</p>
                      <p className="text-muted-foreground">CNPJ: 00.000.000/0001-00</p>
                      <p className="text-muted-foreground">Endereço: Rua Exemplo, 123 - São Paulo, SP</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Estes termos são regidos pelas leis brasileiras. O foro da comarca de São Paulo/SP 
                    é eleito para dirimir quaisquer controvérsias decorrentes deste acordo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Estes termos podem ser atualizados periodicamente. Mudanças significativas serão 
              comunicadas com 30 dias de antecedência.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
