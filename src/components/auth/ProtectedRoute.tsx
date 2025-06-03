
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
      // If auth is not required, allow access
      if (!requireAuth) {
        setIsValidating(false);
        return;
      }

      // If no user, redirect to login
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      // Check session validity
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session || !session.expires_at || (session.expires_at * 1000) <= Date.now()) {
          console.log('Invalid session, redirecting to login');
          localStorage.clear();
          sessionStorage.clear();
          navigate('/login', { replace: true });
          return;
        }

        // Check role if required
        if (requiredRole) {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', requiredRole)
            .maybeSingle();
          
          if (!roleData) {
            navigate('/dashboard', { replace: true });
            return;
          }
          
          setHasRequiredRole(true);
        }

        setIsValidating(false);
      } catch (error) {
        console.error('Access validation error:', error);
        navigate('/login', { replace: true });
      }
    };

    if (!isLoading) {
      validateAccess();
    }
  }, [user, isLoading, requireAuth, requiredRole, navigate]);

  // Show loading while validating
  if (isLoading || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Validando acesso...</p>
        </div>
      </div>
    );
  }

  // Render children if all validations pass
  return <>{children}</>;
};
