
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'founder' | 'admin' | 'user';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  requiredRole 
}) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);

  useEffect(() => {
    const validateAccess = async () => {
      console.log('🔍 Validando acesso...', { requireAuth, user: user?.email });

      // Se autenticação não é necessária, permitir acesso
      if (!requireAuth) {
        console.log('✅ Acesso liberado (sem auth necessária)');
        setIsValidating(false);
        return;
      }

      // Se não há usuário, redirecionar para login
      if (!user) {
        console.log('❌ Usuário não encontrado, redirecionando para login');
        navigate('/login', { replace: true });
        return;
      }

      try {
        // Verificar validade da sessão
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          console.log('❌ Sessão inválida, redirecionando para login');
          localStorage.clear();
          sessionStorage.clear();
          navigate('/login', { replace: true });
          return;
        }

        console.log('✅ Sessão válida para:', session.user.email);

        // Verificar role se necessário
        if (requiredRole) {
          console.log('🔍 Verificando role:', requiredRole);
          
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', requiredRole)
            .maybeSingle();
          
          if (!roleData) {
            console.log('❌ Role insuficiente, redirecionando para dashboard');
            navigate('/app/dashboard', { replace: true });
            return;
          }
          
          console.log('✅ Role validada:', requiredRole);
          setHasRequiredRole(true);
        }

        console.log('✅ Acesso autorizado');
        setIsValidating(false);
      } catch (error) {
        console.error('❌ Erro na validação de acesso:', error);
        navigate('/login', { replace: true });
      }
    };

    // Só validar quando não estiver carregando auth
    if (!isLoading) {
      validateAccess();
    }
  }, [user, isLoading, requireAuth, requiredRole, navigate]);

  // Mostrar loading enquanto valida
  if (isLoading || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {isLoading ? 'Carregando...' : 'Validando acesso...'}
          </p>
        </div>
      </div>
    );
  }

  // Renderizar filhos se todas as validações passaram
  return <>{children}</>;
};
