
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Landing } from './Landing';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [showLanding, setShowLanding] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const handleRedirection = async () => {
      console.log('🚀 Iniciando redirecionamento...', { 
        isLoading, 
        redirecting, 
        userEmail: user?.email 
      });

      // Aguardar carregamento da autenticação
      if (isLoading || redirecting) {
        console.log('⏳ Aguardando carregamento...');
        return;
      }

      // Se não está autenticado, mostrar landing page
      if (!user) {
        console.log('👤 Usuário não autenticado, mostrando landing');
        setShowLanding(true);
        return;
      }

      console.log('✅ Usuário autenticado, redirecionando para dashboard');
      setRedirecting(true);

      try {
        // Pequeno delay para garantir que tudo esteja carregado
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('📍 Redirecionando para /app/dashboard');
        navigate('/app/dashboard', { replace: true });
      } catch (error) {
        console.error('❌ Erro no redirecionamento:', error);
        navigate('/app/dashboard', { replace: true });
      } finally {
        setRedirecting(false);
      }
    };

    handleRedirection();
  }, [user, isLoading, navigate, redirecting]);

  // Mostrar landing page para usuários não autenticados
  if (showLanding) {
    console.log('🏠 Exibindo landing page');
    return <Landing />;
  }

  // Mostrar loading para usuários autenticados enquanto redireciona
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">
          {isLoading ? 'Verificando autenticação...' : 'Redirecionando para dashboard...'}
        </p>
      </div>
    </div>
  );
};

export default Index;
