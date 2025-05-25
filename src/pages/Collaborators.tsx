
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, UserPlus, Search, Filter, Mail, Phone, MapPin } from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'vacation';
  avatar?: string;
  phone?: string;
  location?: string;
  joinDate: string;
}

export const Collaborators = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);
  
  // Mock data - em produção viria de uma API
  const collaborators: Collaborator[] = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@empresa.com',
      role: 'Desenvolvedor Senior',
      department: 'Tecnologia',
      status: 'active',
      phone: '(11) 99999-9999',
      location: 'São Paulo, SP',
      joinDate: '2023-01-15'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      role: 'Gerente de Projetos',
      department: 'Gestão',
      status: 'active',
      phone: '(11) 88888-8888',
      location: 'Rio de Janeiro, RJ',
      joinDate: '2022-08-20'
    },
    {
      id: '3',
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@empresa.com',
      role: 'Designer UX/UI',
      department: 'Design',
      status: 'vacation',
      phone: '(11) 77777-7777',
      location: 'Belo Horizonte, MG',
      joinDate: '2023-03-10'
    }
  ];

  const filteredCollaborators = collaborators.filter(collaborator =>
    collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collaborator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collaborator.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collaborator.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" placeholder="Digite o nome completo" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Digite o email" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input id="role" placeholder="Digite o cargo" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Input id="department" placeholder="Digite o departamento" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingCollaborator(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsAddingCollaborator(false)}>
                  Adicionar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collaborators.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {collaborators.filter(c => c.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Férias</CardTitle>
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {collaborators.filter(c => c.status === 'vacation').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(collaborators.map(c => c.department)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
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

        {/* Collaborators List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCollaborators.map((collaborator) => (
            <Card key={collaborator.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
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
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    Ver Perfil
                  </Button>
                  <Button size="sm">
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
