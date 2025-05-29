
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Landing } from '@/pages/Landing';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    const handleRedirection = async () => {
      // Wait for auth to load
      if (isLoading) return;

      // If not authenticated, show landing page
      if (!user) {
        setShowLanding(true);
        return;
      }

      try {
        // Check if user has founder role
        const { data: founderRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'founder')
          .maybeSingle();
        
        if (founderRole) {
          navigate('/founder/dashboard', { replace: true });
        } else {
          navigate('/app/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        navigate('/app/dashboard', { replace: true });
      }
    };

    handleRedirection();
  }, [user, isLoading, navigate]);

  // Show landing page for non-authenticated users
  if (showLanding) {
    return <Landing />;
  }

  // Show loading for authenticated users while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  );
};

export default Index;
