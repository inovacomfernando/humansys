import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, UserPlus, Search, Mail, Phone, MapPin, 
  AlertCircle, RefreshCw, Wifi, WifiOff, Clock, 
  CloudOff
} from 'lucide-react';
import { useCollaboratorsFixed } from '@/hooks/useCollaboratorsFixed';
import { useToast } from '@/hooks/use-toast';

export const OptimizedCollaboratorsFixed = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);
  const { toast } = useToast();
  
  const {
    collaborators,
    isLoading,
    error,
    createCollaborator,
    refetch,
    isOnline,
    pendingSync
  } = useCollaboratorsFixed();

  const [newCollaborator, setNewCollaborator] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    location: ''
  });

  const handleAddCollaborator = async () => {
    if (!newCollaborator.name || !newCollaborator.email || !newCollaborator.role || !newCollaborator.department) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const result = await createCollaborator({
      ...newCollaborator,
      status: 'active' as const
    });

    if (result) {
      setNewCollaborator({ name: '', email: '', role: '', department: '', phone: '', location: '' });
      setIsAddingCollaborator(false);
    }
  };

  const getNetworkStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-4 w-4 text-red-500" />;
    if (pendingSync > 0) return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
    return <Wifi className="h-4 w-4 text-green-500" />;
  };

  const getNetworkStatusText = () => {
    if (!isOnline) return 'Offline';
    if (pendingSync > 0) return `Sincronizando (${pendingSync})`;
    return 'Conectado';
  };

  const filteredCollaborators = collaborators.filter(collaborator =>
    collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collaborator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collaborator.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collaborator.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: collaborators.length,
    active: collaborators.filter(c => c.status === 'active').length,
    inactive: collaborators.filter(c => c.status === 'inactive').length,
    vacation: collaborators.filter(c => c.status === 'vacation').length,
    departments: new Set(collaborators.map(c => c.department)).size
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'vacation': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'vacation': return 'Férias';
      default: return 'Desconhecido';
    }
  };

  if (isLoading && collaborators.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando colaboradores...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Colaboradores</h1>
            <p className="text-muted-foreground">
              Gerencie todos os colaboradores da empresa
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getNetworkStatusIcon()}
              <span className="text-sm text-muted-foreground">
                {getNetworkStatusText()}
              </span>
            </div>
            
            <Dialog open={isAddingCollaborator} onOpenChange={setIsAddingCollaborator}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Novo Colaborador
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Colaborador</DialogTitle>
                  <DialogDescription>
                    Preencha as informações do novo colaborador
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input 
                      id="name" 
                      placeholder="Digite o nome completo"
                      value={newCollaborator.name}
                      onChange={(e) => setNewCollaborator({...newCollaborator, name: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Digite o email"
                      value={newCollaborator.email}
                      onChange={(e) => setNewCollaborator({...newCollaborator, email: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Cargo *</Label>
                    <Input 
                      id="role" 
                      placeholder="Digite o cargo"
                      value={newCollaborator.role}
                      onChange={(e) => setNewCollaborator({...newCollaborator, role: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Departamento *</Label>
                    <Input 
                      id="department" 
                      placeholder="Digite o departamento"
                      value={newCollaborator.department}
                      onChange={(e) => setNewCollaborator({...newCollaborator, department: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      placeholder="Digite o telefone"
                      value={newCollaborator.phone}
                      onChange={(e) => setNewCollaborator({...newCollaborator, phone: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Localização</Label>
                    <Input 
                      id="location" 
                      placeholder="Digite a localização"
                      value={newCollaborator.location}
                      onChange={(e) => setNewCollaborator({...newCollaborator, location: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingCollaborator(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddCollaborator}>
                    Adicionar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Alertas de conectividade */}
        {!isOnline && (
          <Alert>
            <CloudOff className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Modo offline ativo. Dados serão sincronizados quando reconectar.</span>
              <Button variant="outline" size="sm" onClick={refetch}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Reconectar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {pendingSync > 0 && (
          <Alert>
            <RefreshCw className="h-4 w-4" />
            <AlertDescription>
              {pendingSync} operação(ões) aguardando sincronização...
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={refetch}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Tentar Novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Férias</CardTitle>
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.vacation}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.departments}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Colaboradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email, cargo ou departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Colaboradores */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCollaborators.map((collaborator) => (
            <Card key={collaborator.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {collaborator.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{collaborator.name}</h3>
                      <p className="text-sm text-muted-foreground">{collaborator.role}</p>
                    </div>
                  </div>
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(collaborator.status)}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Badge variant="secondary">{collaborator.department}</Badge>
                  <Badge variant="outline">{getStatusText(collaborator.status)}</Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="mr-2 h-3 w-3" />
                    {collaborator.email}
                  </div>
                  {collaborator.phone && (
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="mr-2 h-3 w-3" />
                      {collaborator.phone}
                    </div>
                  )}
                  {collaborator.location && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 h-3 w-3" />
                      {collaborator.location}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCollaborators.length === 0 && !isLoading && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum colaborador encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'Tente ajustar sua busca' : 'Comece adicionando seu primeiro colaborador'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsAddingCollaborator(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Adicionar Primeiro Colaborador
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};
