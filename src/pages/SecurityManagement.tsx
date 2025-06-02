
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SecurityDashboard } from '@/components/security/SecurityDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, Eye, AlertTriangle, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SecurityManagement = () => {
  const { toast } = useToast();
  const [securitySettings, setSecuritySettings] = useState({
    blockDevTools: true,
    blockRightClick: true,
    blockScreenshots: true,
    blockCopyPaste: true,
    watermarkEnabled: true,
    rateLimitEnabled: true,
    realTimeMonitoring: true,
    autoBlock: true,
    alertsEnabled: true
  });

  const updateSetting = (key: keyof typeof securitySettings, value: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Configuração Atualizada",
      description: `${key} foi ${value ? 'ativado' : 'desativado'}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Shield className="mr-3 h-8 w-8" />
              Gerenciamento de Segurança
            </h1>
            <p className="text-muted-foreground">
              Monitoramento e proteção avançada do sistema
            </p>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
            <TabsTrigger value="policies">Políticas</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Configurações de Proteção
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Proteções Ativas</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="blockDevTools">Bloquear DevTools</Label>
                        <p className="text-sm text-muted-foreground">
                          Impede abertura do console de desenvolvedor
                        </p>
                      </div>
                      <Switch
                        id="blockDevTools"
                        checked={securitySettings.blockDevTools}
                        onCheckedChange={(checked) => updateSetting('blockDevTools', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="blockRightClick">Bloquear Clique Direito</Label>
                        <p className="text-sm text-muted-foreground">
                          Desabilita menu de contexto
                        </p>
                      </div>
                      <Switch
                        id="blockRightClick"
                        checked={securitySettings.blockRightClick}
                        onCheckedChange={(checked) => updateSetting('blockRightClick', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="blockScreenshots">Detectar Screenshots</Label>
                        <p className="text-sm text-muted-foreground">
                          Alerta sobre tentativas de captura
                        </p>
                      </div>
                      <Switch
                        id="blockScreenshots"
                        checked={securitySettings.blockScreenshots}
                        onCheckedChange={(checked) => updateSetting('blockScreenshots', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="blockCopyPaste">Bloquear Copiar/Colar</Label>
                        <p className="text-sm text-muted-foreground">
                          Impede cópia de conteúdo
                        </p>
                      </div>
                      <Switch
                        id="blockCopyPaste"
                        checked={securitySettings.blockCopyPaste}
                        onCheckedChange={(checked) => updateSetting('blockCopyPaste', checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Monitoramento</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="watermarkEnabled">Marca d'água</Label>
                        <p className="text-sm text-muted-foreground">
                          Adiciona identificação visual
                        </p>
                      </div>
                      <Switch
                        id="watermarkEnabled"
                        checked={securitySettings.watermarkEnabled}
                        onCheckedChange={(checked) => updateSetting('watermarkEnabled', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="rateLimitEnabled">Rate Limiting</Label>
                        <p className="text-sm text-muted-foreground">
                          Limita requisições por minuto
                        </p>
                      </div>
                      <Switch
                        id="rateLimitEnabled"
                        checked={securitySettings.rateLimitEnabled}
                        onCheckedChange={(checked) => updateSetting('rateLimitEnabled', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="realTimeMonitoring">Monitoramento Tempo Real</Label>
                        <p className="text-sm text-muted-foreground">
                          Análise contínua de atividades
                        </p>
                      </div>
                      <Switch
                        id="realTimeMonitoring"
                        checked={securitySettings.realTimeMonitoring}
                        onCheckedChange={(checked) => updateSetting('realTimeMonitoring', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoBlock">Bloqueio Automático</Label>
                        <p className="text-sm text-muted-foreground">
                          Bloqueia IPs suspeitos automaticamente
                        </p>
                      </div>
                      <Switch
                        id="autoBlock"
                        checked={securitySettings.autoBlock}
                        onCheckedChange={(checked) => updateSetting('autoBlock', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Atenção:</strong> Algumas proteções podem afetar a experiência do usuário. 
                Teste cuidadosamente antes de ativar em produção.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alertas de Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Alto Risco:</strong> 15 tentativas de acesso via DevTools nas últimas 24h
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-yellow-200 bg-yellow-50">
                    <Eye className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <strong>Médio Risco:</strong> IP 192.168.1.100 com múltiplas tentativas de screenshot
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-blue-200 bg-blue-50">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Info:</strong> Sistema de proteção ativo e funcionando normalmente
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Políticas de Segurança</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <h4>1. Política de Acesso</h4>
                  <ul>
                    <li>Todas as tentativas de acesso não autorizado são registradas</li>
                    <li>IPs com 5+ violações são bloqueados automaticamente por 24h</li>
                    <li>Tentativas de bypass resultam em bloqueio permanente</li>
                  </ul>

                  <h4>2. Monitoramento</h4>
                  <ul>
                    <li>Logs são mantidos por 90 dias</li>
                    <li>Atividades suspeitas geram alertas em tempo real</li>
                    <li>Análise de comportamento por IA para detecção de anomalias</li>
                  </ul>

                  <h4>3. Proteção de Dados</h4>
                  <ul>
                    <li>Conteúdo protegido contra cópia e extração</li>
                    <li>Marca d'água com identificação do usuário</li>
                    <li>Bloqueio de ferramentas de desenvolvimento</li>
                  </ul>

                  <h4>4. Compliance</h4>
                  <ul>
                    <li>Conformidade com LGPD e GDPR</li>
                    <li>Auditoria regular de segurança</li>
                    <li>Relatórios de segurança mensais</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
