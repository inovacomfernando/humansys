
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useAuthDebug } from '@/hooks/useAuthDebug';

export const AuthDebugPanel = () => {
  const { debugInfo, refreshDebug } = useAuthDebug();

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Debug de Autenticação
              {debugInfo.isConnected ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </CardTitle>
            <CardDescription>
              Status da autenticação e conectividade - {debugInfo.lastChecked}
            </CardDescription>
          </div>
          <Button onClick={refreshDebug} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Frontend User</h4>
            <div className="p-3 bg-muted rounded-lg">
              {debugInfo.frontendUser ? (
                <div className="space-y-1">
                  <p className="text-sm"><strong>ID:</strong> {debugInfo.frontendUser.id}</p>
                  <p className="text-sm"><strong>Email:</strong> {debugInfo.frontendUser.email}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum usuário no frontend</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Supabase User</h4>
            <div className="p-3 bg-muted rounded-lg">
              {debugInfo.supabaseUser ? (
                <div className="space-y-1">
                  <p className="text-sm"><strong>ID:</strong> {debugInfo.supabaseUser.id}</p>
                  <p className="text-sm"><strong>Email:</strong> {debugInfo.supabaseUser.email}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum usuário no Supabase</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Status da Sessão</h4>
          <div className="flex gap-2">
            <Badge variant={debugInfo.session ? "default" : "destructive"}>
              {debugInfo.session ? "Ativa" : "Inativa"}
            </Badge>
            <Badge variant={debugInfo.isConnected ? "default" : "destructive"}>
              {debugInfo.isConnected ? "Conectado" : "Desconectado"}
            </Badge>
          </div>
        </div>

        {debugInfo.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Erros Detectados
            </h4>
            <div className="space-y-1">
              {debugInfo.errors.map((error, index) => (
                <div key={index} className="p-2 bg-red-50 text-red-700 rounded text-sm">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {debugInfo.session && (
          <div className="space-y-2">
            <h4 className="font-medium">Detalhes da Sessão</h4>
            <div className="p-3 bg-muted rounded-lg">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(debugInfo.session, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
