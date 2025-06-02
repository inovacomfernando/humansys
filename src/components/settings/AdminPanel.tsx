import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Database,
  UserPlus,
  Mail,
  User,
  Eye,
  EyeOff
} from 'lucide-react';
import { executeQuery, setupTables } from '@/lib/replit-db';

interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

interface Collaborator {
  id: number;
  name: string;
  email: string;
  position?: string;
  department?: string;
  status: string;
}

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  // Estados para criação de usuário
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Estados para criação de colaborador
  const [newCollaborator, setNewCollaborator] = useState({
    name: '',
    email: '',
    position: '',
    department: ''
  });

  useEffect(() => {
    initializeDatabase();
    loadData();
  }, []);

  const initializeDatabase = async () => {
    try {
      await setupTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      toast({
        title: "Erro de Banco",
        description: "Falha ao inicializar o banco de dados",
        variant: "destructive",
      });
    }
  };

  const loadData = async () => {
    try {
      // Carregar usuários
      const usersResult = await executeQuery('SELECT id, email, name, created_at FROM users ORDER BY created_at DESC');
      setUsers(usersResult.rows);

      // Carregar colaboradores
      const collaboratorsResult = await executeQuery('SELECT * FROM collaborators ORDER BY created_at DESC');
      setCollaborators(collaboratorsResult.rows);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const createUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Iniciando criação de usuário:', { email: newUser.email, name: newUser.name });

      // Verificar se o usuário já existe
      const existingUser = await executeQuery('SELECT id FROM users WHERE email = $1', [newUser.email]);

      if (existingUser.rows.length > 0) {
        toast({
          title: "Usuário já existe",
          description: "Este email já está cadastrado",
          variant: "destructive",
        });
        return;
      }

      // Criar usuário (em produção, você deve fazer hash da senha)
      const result = await executeQuery(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
        [newUser.name, newUser.email, newUser.password] // Em produção, use hash da senha
      );

      const userId = result.rows[0].id;

      // Criar créditos iniciais para o usuário
      await executeQuery(
        'INSERT INTO user_credits (user_id, credits, plan) VALUES ($1, $2, $3)',
        [userId, 100, 'trial']
      );

      toast({
        title: "Usuário criado",
        description: `Usuário ${newUser.name} criado com sucesso`,
      });

      setNewUser({ name: '', email: '', password: '' });
      loadData();

    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro ao criar usuário",
        description: "Não foi possível criar o usuário",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCollaborator = async () => {
    if (!newCollaborator.name || !newCollaborator.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e email são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Buscar um usuário para associar (assumindo que existe pelo menos um)
      const usersResult = await executeQuery('SELECT id FROM users LIMIT 1');

      if (usersResult.rows.length === 0) {
        toast({
          title: "Erro",
          description: "É necessário ter pelo menos um usuário cadastrado",
          variant: "destructive",
        });
        return;
      }

      const userId = usersResult.rows[0].id;

      await executeQuery(
        'INSERT INTO collaborators (user_id, name, email, position, department) VALUES ($1, $2, $3, $4, $5)',
        [userId, newCollaborator.name, newCollaborator.email, newCollaborator.position, newCollaborator.department]
      );

      toast({
        title: "Colaborador criado",
        description: `Colaborador ${newCollaborator.name} criado com sucesso`,
      });

      setNewCollaborator({ name: '', email: '', position: '', department: '' });
      loadData();

    } catch (error) {
      console.error('Erro ao criar colaborador:', error);
      toast({
        title: "Erro ao criar colaborador",
        description: "Não foi possível criar o colaborador",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [isTestingDB, setIsTestingDB] = useState(false);
  const testDatabaseConnection = async () => {
    setIsTestingDB(true);
    try {
      const { executeQuery } = await import('@/lib/replit-db');
      const result = await executeQuery('SELECT 1 as test');
      console.log('Teste de conexão:', result);

      toast({
        title: "Conexão bem-sucedida",
        description: "PostgreSQL está funcionando corretamente",
      });
    } catch (error) {
      console.error('Erro no teste:', error);
      toast({
        title: "Erro de conexão",
        description: "Falha ao conectar com PostgreSQL",
        variant: "destructive",
      });
    } finally {
      setIsTestingDB(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Este painel é destinado apenas para administradores. Use com cuidado.
        </AlertDescription>
      </Alert>

      {/* Teste de Conexão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Conexão com PostgreSQL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Banco PostgreSQL do Replit configurado e funcionando
            </p>
            <Button onClick={testDatabaseConnection} variant="outline">
              Testar Conexão
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Criar Usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Criar Novo Usuário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Nome completo</Label>
              <Input
                id="user-name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Nome do usuário"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="email@empresa.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-password">Senha inicial</Label>
              <div className="relative">
                <Input
                  id="user-password"
                  type={showPassword ? "text" : "password"}
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Senha temporária"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <Button 
            onClick={createUser} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Criando...' : 'Criar Usuário'}
          </Button>
        </CardContent>
      </Card>

      {/* Criar Colaborador */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Criar Colaborador
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="collab-name">Nome</Label>
              <Input
                id="collab-name"
                value={newCollaborator.name}
                onChange={(e) => setNewCollaborator({ ...newCollaborator, name: e.target.value })}
                placeholder="Nome do colaborador"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collab-email">Email</Label>
              <Input
                id="collab-email"
                type="email"
                value={newCollaborator.email}
                onChange={(e) => setNewCollaborator({ ...newCollaborator, email: e.target.value })}
                placeholder="email@empresa.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="collab-position">Cargo</Label>
                <Input
                  id="collab-position"
                  value={newCollaborator.position}
                  onChange={(e) => setNewCollaborator({ ...newCollaborator, position: e.target.value })}
                  placeholder="Cargo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collab-department">Departamento</Label>
                <Input
                  id="collab-department"
                  value={newCollaborator.department}
                  onChange={(e) => setNewCollaborator({ ...newCollaborator, department: e.target.value })}
                  placeholder="Departamento"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={createCollaborator} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Criando...' : 'Criar Colaborador'}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.length === 0 ? (
              <p className="text-muted-foreground">Nenhum usuário cadastrado</p>
            ) : (
              users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant="secondary">ID: {user.id}</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Colaboradores */}
      <Card>
        <CardHeader>
          <CardTitle>Colaboradores Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {collaborators.length === 0 ? (
              <p className="text-muted-foreground">Nenhum colaborador cadastrado</p>
            ) : (
              collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{collaborator.name}</p>
                    <p className="text-sm text-muted-foreground">{collaborator.email}</p>
                    {collaborator.position && (
                      <p className="text-xs text-muted-foreground">{collaborator.position}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={collaborator.status === 'active' ? 'default' : 'secondary'}>
                      {collaborator.status}
                    </Badge>
                    <Badge variant="outline">ID: {collaborator.id}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};