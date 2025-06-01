
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { replitStorage } from '@/services/replitStorageService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database, RefreshCw, Trash2, Download, Upload } from 'lucide-react';

export const StorageDebugPanel = () => {
  const [storageFiles, setStorageFiles] = useState<string[]>([]);
  const [collaboratorCount, setCollaboratorCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const refreshData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const files = await replitStorage.listAllFiles();
      const collaborators = await replitStorage.loadCollaborators(user.id);
      
      setStorageFiles(files);
      setCollaboratorCount(collaborators.length);
      
      toast({
        title: "Dados atualizados",
        description: `${files.length} arquivos, ${collaborators.length} colaboradores`
      });
    } catch (error) {
      console.error('Error refreshing storage data:', error);
    }
    setIsLoading(false);
  };

  const exportData = async () => {
    if (!user?.id) return;
    
    try {
      const collaborators = await replitStorage.loadCollaborators(user.id);
      const data = JSON.stringify(collaborators, null, 2);
      
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `colaboradores_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export realizado",
        description: "Dados exportados com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro no export",
        description: "Falha ao exportar dados",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    refreshData();
  }, [user?.id]);

  if (!user) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5" />
          Replit Object Storage - Debug
        </CardTitle>
        <CardDescription>
          Monitoramento do sistema de persistência local
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Estatísticas</h4>
            <div className="space-y-2">
              <Badge variant="secondary">
                Colaboradores: {collaboratorCount}
              </Badge>
              <Badge variant="outline">
                Arquivos: {storageFiles.length}
              </Badge>
              <Badge variant={collaboratorCount > 0 ? "default" : "destructive"}>
                Status: {collaboratorCount > 0 ? "Dados encontrados" : "Sem dados"}
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Ações</h4>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                disabled={isLoading}
                className="w-full"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportData}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar Dados
              </Button>
            </div>
          </div>
        </div>

        {storageFiles.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Arquivos no Storage</h4>
            <div className="text-sm space-y-1 max-h-32 overflow-y-auto">
              {storageFiles.map((file, index) => (
                <div key={index} className="text-muted-foreground">
                  📁 {file}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>🔐 User ID: {user.id}</p>
          <p>📂 Storage Key: collaborators_{user.id}.json</p>
          <p>⏰ Última atualização: {new Date().toLocaleTimeString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};
