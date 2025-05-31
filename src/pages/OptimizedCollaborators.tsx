import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Pause,
  RefreshCw
} from 'lucide-react';
import { useOptimizedCollaborators } from '@/hooks/useOptimizedCollaborators';
import { CollaboratorCard } from '@/components/collaborators/CollaboratorCard';
import { SmartLoadingIndicator } from '@/components/common/SmartLoadingIndicator';
import { SkeletonCards } from '@/components/common/SkeletonCards';

interface SimpleNewCollaboratorDialog {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const SimpleNewCollaboratorDialog: React.FC<SimpleNewCollaboratorDialog> = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    location: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ name: '', email: '', role: '', department: '', phone: '', location: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">Novo Colaborador</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Cargo"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Departamento"
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Telefone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Localização"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const OptimizedCollaborators = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'vacation'>('all');
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  const {
    collaborators,
    stats,
    loadingState,
    error,
    createCollaborator,
    refresh,
    isUsingCache
  } = useOptimizedCollaborators();

  const filteredCollaborators = collaborators.filter(collaborator => {
    const matchesSearch = collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collaborator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collaborator.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collaborator.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || collaborator.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'vacation': return <Pause className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'vacation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCreateCollaborator = async (collaboratorData: any) => {
    const result = await createCollaborator(collaboratorData);
    if (result) {
      setIsNewDialogOpen(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Colaboradores</h1>
            <p className="text-muted-foreground">
              Gerencie sua equipe de forma inteligente e eficiente
            </p>
            {isUsingCache && (
              <Badge variant="outline" className="mt-2">
                <AlertCircle className="h-3 w-3 mr-1" />
                Modo offline - dados em cache
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={refresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button onClick={() => setIsNewDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Colaborador
            </Button>
          </div>
        </div>

        {/* Loading Indicator */}
        {loadingState.isLoading && (
          <SmartLoadingIndicator 
            stage={loadingState.currentStage}
            progress={loadingState.progress}
          />
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">colaboradores</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inativos</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Férias</CardTitle>
              <Pause className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.vacation}</div>
              <p className="text-xs text-muted-foreground">em período de férias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.departments}</div>
              <p className="text-xs text-muted-foreground">áreas ativas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros e Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome, email, cargo ou departamento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {['all', 'active', 'inactive', 'vacation'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status as any)}
                    className="flex items-center gap-1"
                  >
                    {status !== 'all' && getStatusIcon(status)}
                    {status === 'all' ? 'Todos' : 
                     status === 'active' ? 'Ativos' :
                     status === 'inactive' ? 'Inativos' : 'Férias'}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Erro ao carregar colaboradores</span>
              </div>
              <p className="text-red-600 mt-1">{error}</p>
              <Button onClick={refresh} variant="outline" size="sm" className="mt-3">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Collaborators List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Lista de Colaboradores</CardTitle>
                <CardDescription>
                  {filteredCollaborators.length} de {collaborators.length} colaboradores
                </CardDescription>
              </div>
              <Badge variant="outline">
                <Filter className="h-3 w-3 mr-1" />
                {filteredCollaborators.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loadingState.isLoading && loadingState.currentStage === 'collaborators' ? (
              <SkeletonCards count={6} />
            ) : filteredCollaborators.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Nenhum colaborador encontrado' 
                    : 'Nenhum colaborador cadastrado'
                  }
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece adicionando seu primeiro colaborador'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button onClick={() => setIsNewDialogOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Colaborador
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCollaborators.map((collaborator) => (
                  <CollaboratorCard
                    key={collaborator.id}
                    collaborator={collaborator}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* New Collaborator Dialog */}
        <SimpleNewCollaboratorDialog
          isOpen={isNewDialogOpen}
          onClose={() => setIsNewDialogOpen(false)}
          onSubmit={handleCreateCollaborator}
        />
      </div>
    </DashboardLayout>
  );
};
