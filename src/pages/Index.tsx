
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const { isValidating, isAuthenticated, user } = useAuthGuard(false); // Não requer auth para esta página

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isAuthenticated || !user || isValidating) return;

      try {
        // Check if user has founder role
        const { data: founderRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'founder')
          .maybeSingle();
        
        if (founderRole) {
          navigate('/founder-dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        navigate('/dashboard', { replace: true });
      }
    };

    // Se não está autenticado e não está validando, ir para login
    if (!isValidating && !isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    // Se está autenticado, verificar role
    if (isAuthenticated && user) {
      checkUserRole();
    }
  }, [user, isAuthenticated, isValidating, navigate]);

  // Mostrar loading enquanto valida
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">
          {isValidating ? 'Validando sessão...' : 'Carregando sistema...'}
        </p>
      </div>
    </div>
  );
};

export default Index;
