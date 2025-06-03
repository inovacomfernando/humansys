
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
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const handleRedirection = async () => {
      // Wait for auth to load
      if (isLoading || redirecting) return;

      // If not authenticated, show landing page
      if (!user) {
        setShowLanding(true);
        return;
      }

      setRedirecting(true);

      try {
        // Always redirect to regular dashboard first
        // Users can navigate to founder dashboard manually if they have the role
        navigate('/app/dashboard', { replace: true });
      } catch (error) {
        console.log('Redirecting to default dashboard due to error');
        navigate('/app/dashboard', { replace: true });
      } finally {
        setRedirecting(false);
      }
    };

    handleRedirection();
  }, [user, isLoading, navigate, redirecting]);

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
