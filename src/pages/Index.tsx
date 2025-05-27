
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isLoading && user) {
        try {
          // Check if user has founder role
          const { data: founderRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'founder')
            .maybeSingle();
          
          if (founderRole) {
            navigate('/founder-dashboard');
          } else {
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          navigate('/dashboard');
        }
      } else if (!isLoading && !user) {
        navigate('/');
      }
    };

    checkUserRole();
  }, [user, isLoading, navigate]);

  // Mostrar loading enquanto verifica autenticação
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando sistema...</p>
      </div>
    </div>
  );
};

export default Index;
