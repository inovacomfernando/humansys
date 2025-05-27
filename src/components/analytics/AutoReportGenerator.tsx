
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  Send,
  Settings,
  BarChart3
} from 'lucide-react';

export const AutoReportGenerator: React.FC = () => {
  const reports = [
    {
      id: '1',
      title: 'Relatório Semanal de RH',
      description: 'Resumo executivo das métricas de recursos humanos',
      schedule: 'Toda segunda às 9h',
      lastGenerated: '21/01/2024',
      recipients: ['diretoria@empresa.com', 'rh@empresa.com'],
      status: 'Ativo'
    },
    {
      id: '2',
      title: 'Analytics de Treinamento',
      description: 'Performance e ROI dos programas de capacitação',
      schedule: 'Quinzenal',
      lastGenerated: '15/01/2024',
      recipients: ['treinamento@empresa.com'],
      status: 'Ativo'
    },
    {
      id: '3',
      title: 'Dashboard de Engajamento',
      description: 'Métricas de satisfação e retenção por departamento',
      schedule: 'Mensal',
      lastGenerated: '01/01/2024',
      recipients: ['gestores@empresa.com'],
      status: 'Pausado'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Estatísticas de Relatórios */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relatórios Ativos</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +2 este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviados</CardTitle>
            <Send className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Abertura</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              Média geral
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3min</div>
            <p className="text-xs text-muted-foreground">
              Geração automática
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Geração Rápida */}
      <Card>
        <CardHeader>
          <CardTitle>Gerar Relatório Instantâneo</CardTitle>
          <CardDescription>
            Crie relatórios personalizados sob demanda com IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="h-20 flex flex-col items-center space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span>Dashboard Executivo</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <FileText className="h-6 w-6" />
              <span>Relatório de RH</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <Send className="h-6 w-6" />
              <span>Análise Personalizada</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Relatórios Programados */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Programados</CardTitle>
          <CardDescription>
            Automação inteligente de relatórios e insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium">{report.title}</h4>
                      <Badge variant={report.status === 'Ativo' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {report.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{report.schedule}</span>
                      </span>
                      <span>Último: {report.lastGenerated}</span>
                      <span>{report.recipients.length} destinatários</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Template */}
      <Card>
        <CardHeader>
          <CardTitle>Templates Inteligentes</CardTitle>
          <CardDescription>
            Personalize o conteúdo e formato dos seus relatórios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Seções Incluídas</h4>
              <div className="space-y-1">
                {[
                  'Resumo Executivo',
                  'Métricas de Performance',
                  'Análise de Tendências',
                  'Recomendações de IA',
                  'Alertas e Riscos'
                ].map((section) => (
                  <label key={section} className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">{section}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Formato de Saída</h4>
              <select className="w-full p-2 border rounded mb-2">
                <option>PDF Executivo</option>
                <option>Apresentação PowerPoint</option>
                <option>Dashboard Interativo</option>
                <option>Email HTML</option>
              </select>
              
              <h4 className="font-medium">Idioma dos Insights</h4>
              <select className="w-full p-2 border rounded">
                <option>Português (Técnico)</option>
                <option>Português (Executivo)</option>
                <option>Inglês</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
