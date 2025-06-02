
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  Target,
  MessageSquare,
  FileQuestion,
  FileText,
  Award,
  UserPlus,
  Brain,
  BarChart3,
  UserCheck
} from 'lucide-react';

interface UserPermissions {
  dashboard: boolean;
  colaboradores: boolean;
  treinamentos: boolean;
  reunioes: boolean;
  metas: boolean;
  feedbacks: boolean;
  pesquisas: boolean;
  documentos: boolean;
  certificados: boolean;
  onboarding: boolean;
  disc: boolean;
  analytics: boolean;
  recruitment: boolean;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
  last_sign_in_at?: string;
  status: 'active' | 'inactive';
  password?: string;
  permissions?: UserPermissions;
}

interface PermissionsFormProps {
  user: User;
  onSave: (permissions: UserPermissions) => void;
  onCancel: () => void;
}

const permissionsList = [
  {
    key: 'dashboard' as keyof UserPermissions,
    label: 'Dashboard',
    description: 'Acesso ao painel principal',
    icon: LayoutDashboard,
    category: 'Principal'
  },
  {
    key: 'colaboradores' as keyof UserPermissions,
    label: 'Colaboradores',
    description: 'Gerenciar equipe e perfis',
    icon: Users,
    category: 'Gestão'
  },
  {
    key: 'treinamentos' as keyof UserPermissions,
    label: 'Treinamentos',
    description: 'Acessar e criar treinamentos',
    icon: GraduationCap,
    category: 'Desenvolvimento'
  },
  {
    key: 'reunioes' as keyof UserPermissions,
    label: 'Reuniões',
    description: 'Agendar e participar de reuniões',
    icon: Calendar,
    category: 'Comunicação'
  },
  {
    key: 'metas' as keyof UserPermissions,
    label: 'Metas',
    description: 'Definir e acompanhar objetivos',
    icon: Target,
    category: 'Gestão'
  },
  {
    key: 'feedbacks' as keyof UserPermissions,
    label: 'Feedbacks',
    description: 'Dar e receber feedbacks',
    icon: MessageSquare,
    category: 'Comunicação'
  },
  {
    key: 'pesquisas' as keyof UserPermissions,
    label: 'Pesquisas',
    description: 'Criar e responder pesquisas',
    icon: FileQuestion,
    category: 'Engajamento'
  },
  {
    key: 'documentos' as keyof UserPermissions,
    label: 'Documentos',
    description: 'Gerenciar documentos',
    icon: FileText,
    category: 'Recursos'
  },
  {
    key: 'certificados' as keyof UserPermissions,
    label: 'Certificados',
    description: 'Gerar e visualizar certificados',
    icon: Award,
    category: 'Desenvolvimento'
  },
  {
    key: 'onboarding' as keyof UserPermissions,
    label: 'Onboarding',
    description: 'Processos de integração',
    icon: UserPlus,
    category: 'Recursos'
  },
  {
    key: 'disc' as keyof UserPermissions,
    label: 'DISC',
    description: 'Avaliações comportamentais',
    icon: Brain,
    category: 'Desenvolvimento'
  },
  {
    key: 'analytics' as keyof UserPermissions,
    label: 'Analytics',
    description: 'Relatórios e análises avançadas',
    icon: BarChart3,
    category: 'Análise'
  },
  {
    key: 'recruitment' as keyof UserPermissions,
    label: 'Recrutamento',
    description: 'Processos seletivos',
    icon: UserCheck,
    category: 'Gestão'
  }
];

export const PermissionsForm: React.FC<PermissionsFormProps> = ({ user, onSave, onCancel }) => {
  const [permissions, setPermissions] = useState<UserPermissions>(
    user.permissions || {
      dashboard: true,
      colaboradores: false,
      treinamentos: false,
      reunioes: false,
      metas: false,
      feedbacks: false,
      pesquisas: false,
      documentos: false,
      certificados: false,
      onboarding: false,
      disc: false,
      analytics: false,
      recruitment: false,
    }
  );

  const handlePermissionChange = (key: keyof UserPermissions, checked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const selectAllInCategory = (category: string, checked: boolean) => {
    const categoryPermissions = permissionsList.filter(p => p.category === category);
    const newPermissions = { ...permissions };
    
    categoryPermissions.forEach(permission => {
      if (permission.key !== 'dashboard') { // Dashboard sempre fica como está
        newPermissions[permission.key] = checked;
      }
    });
    
    setPermissions(newPermissions);
  };

  const categories = Array.from(new Set(permissionsList.map(p => p.category)));

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        {categories.map(category => {
          const categoryPermissions = permissionsList.filter(p => p.category === category);
          const allChecked = categoryPermissions.every(p => permissions[p.key]);
          const someChecked = categoryPermissions.some(p => permissions[p.key]);

          return (
            <Card key={category} className="h-fit">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{category}</CardTitle>
                  {category !== 'Principal' && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={allChecked}
                        ref={(ref) => {
                          if (ref) ref.indeterminate = someChecked && !allChecked;
                        }}
                        onCheckedChange={(checked) => selectAllInCategory(category, checked as boolean)}
                      />
                      <Label htmlFor={`category-${category}`} className="text-xs">
                        Todos
                      </Label>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {categoryPermissions.map(permission => {
                    const Icon = permission.icon;
                    const isDisabled = permission.key === 'dashboard' && user.role === 'admin';
                    
                    return (
                      <div key={permission.key} className="flex items-start space-x-2">
                        <Checkbox
                          id={permission.key}
                          checked={permissions[permission.key]}
                          disabled={isDisabled}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.key, checked as boolean)
                          }
                          className="mt-1"
                        />
                        <div className="flex items-start space-x-2 flex-1 min-w-0">
                          <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <Label 
                              htmlFor={permission.key} 
                              className={`text-sm font-medium block ${isDisabled ? 'text-muted-foreground' : ''}`}
                            >
                              {permission.label}
                            </Label>
                            <p className="text-xs text-muted-foreground leading-tight">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end space-x-2 pt-3 border-t sticky bottom-0 bg-background">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={() => onSave(permissions)}>
          Salvar Permissões
        </Button>
      </div>
    </div>
  );
};
