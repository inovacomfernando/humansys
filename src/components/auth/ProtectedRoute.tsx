import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true,
  requiredRole 
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não requer autenticação e está autenticado, redirecionar
  if (!requireAuth && user) {
    return <Navigate to="/app/dashboard" replace />;
  }

  // Se requer autenticação e não está autenticado, redirecionar para login
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar role se necessário
  if (requiredRole && user) {
    const userRole = user.user_metadata?.role || 'user';
    if (userRole !== requiredRole) {
      return <Navigate to="/app/dashboard" replace />;
    }
  }

  return <>{children}</>;
};