
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminPanel } from '@/components/settings/AdminPanel';
import { PermissionsForm } from '@/components/settings/PermissionsForm';
import { SystemDebugPanel } from '@/components/settings/SystemDebugPanel';
import { UserManagementDialog } from '@/components/settings/UserManagementDialog';
import { CertificateTemplates } from '@/components/settings/CertificateTemplates';
import { Button } from '@/components/ui/button';
import { Users, Shield, Database, FileText, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const [userManagementOpen, setUserManagementOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema, usuários e permissões
          </p>
        </div>

        <Tabs defaultValue="admin" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="admin">
              <Users className="h-4 w-4 mr-2" />
              Admin
            </TabsTrigger>
            <TabsTrigger value="permissions">
              <Shield className="h-4 w-4 mr-2" />
              Permissões
            </TabsTrigger>
            <TabsTrigger value="certificates">
              <FileText className="h-4 w-4 mr-2" />
              Certificados
            </TabsTrigger>
            <TabsTrigger value="system">
              <Database className="h-4 w-4 mr-2" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="general">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Geral
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admin">
            <AdminPanel />
          </TabsContent>

          <TabsContent value="permissions">
            <PermissionsForm />
          </TabsContent>

          <TabsContent value="certificates">
            <CertificateTemplates />
          </TabsContent>

          <TabsContent value="system">
            <SystemDebugPanel />
          </TabsContent>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Configure as preferências gerais do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Button 
                    onClick={() => setUserManagementOpen(true)}
                    variant="outline" 
                    className="h-24 flex flex-col items-center justify-center space-y-2"
                  >
                    <Users className="h-8 w-8" />
                    <span>Gerenciar Usuários</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col items-center justify-center space-y-2"
                  >
                    <Shield className="h-8 w-8" />
                    <span>Segurança</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <UserManagementDialog
          open={userManagementOpen}
          onOpenChange={setUserManagementOpen}
        />
      </div>
    </DashboardLayout>
  );
}
