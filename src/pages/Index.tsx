import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Landing } from '@/pages/Landing';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      setShowLanding(true);
      return;
    }

    // Se autenticado, redirecionar para dashboard
    navigate('/app/dashboard', { replace: true });
  }, [user, isLoading, navigate]);

  if (showLanding) {
    return <Landing />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
};

export default Index;