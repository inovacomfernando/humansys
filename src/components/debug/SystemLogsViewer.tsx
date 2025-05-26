
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Info, AlertTriangle, Bug, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SystemLog, LogLevel } from '@/hooks/useSystemLogs';

const LogLevelIcon = ({ level }: { level: LogLevel }) => {
  switch (level) {
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'debug':
      return <Bug className="h-4 w-4 text-gray-500" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const LogLevelBadge = ({ level }: { level: LogLevel }) => {
  const variants = {
    error: 'destructive',
    warning: 'default',
    info: 'secondary',
    debug: 'outline'
  } as const;

  return (
    <Badge variant={variants[level] || 'secondary'}>
      {level.toUpperCase()}
    </Badge>
  );
};

export const SystemLogsViewer = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'all'>('all');
  const { user } = useAuth();

  const fetchLogs = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      let query = supabase
        .from('system_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (levelFilter !== 'all') {
        query = query.eq('level', levelFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar logs:', error);
        return;
      }

      setLogs(data || []);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user?.id, levelFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatDetails = (details: any) => {
    if (!details) return null;
    try {
      const parsed = typeof details === 'string' ? JSON.parse(details) : details;
      return JSON.stringify(parsed, null, 2);
    } catch {
      return String(details);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Logs do Sistema
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={levelFilter} onValueChange={(value) => setLevelFilter(value as LogLevel | 'all')}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="error">Erro</SelectItem>
                <SelectItem value="warning">Aviso</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              {isLoading ? 'Carregando logs...' : 'Nenhum log encontrado'}
            </p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LogLevelIcon level={log.level} />
                    <LogLevelBadge level={log.level} />
                    <span className="text-sm font-medium">{log.source}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(log.created_at)}
                  </span>
                </div>
                <p className="text-sm">{log.message}</p>
                {log.details && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground">
                      Detalhes
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                      {formatDetails(log.details)}
                    </pre>
                  </details>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
