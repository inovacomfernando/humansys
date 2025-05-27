
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Monitor, LogOut, Settings, User, Loader2, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  showAuth?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showAuth = true }) => {
  const { theme, effectiveTheme, setTheme, companyLogo } = useTheme();
  const { user, signOut, isLoggingOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const getUserName = () => {
    if (!user) return '';
    return user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';
  };

  const getUserAvatar = () => {
    return user?.user_metadata?.avatar_url || '';
  };

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log('Starting aggressive logout...');
      
      // Clear everything immediately (before API call)
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear query cache
      if (window.queryCache) {
        window.queryCache.clear();
      }
      
      // Show immediate feedback
      toast({
        title: "Saindo...",
        description: "Redirecionando para login.",
      });
      
      // Call logout API
      await signOut();
      
      // Force navigation immediately
      window.location.href = '/login';
      
    } catch (error: any) {
      console.error('Logout error:', error);
      
      // Even with error, force cleanup and redirect
      localStorage.clear();
      sessionStorage.clear();
      if (window.queryCache) {
        window.queryCache.clear();
      }
      window.location.href = '/login';
    }
  };

  const getThemeIcon = () => {
    if (theme === 'auto') return Monitor;
    return effectiveTheme === 'light' ? Moon : Sun;
  };

  const ThemeIcon = getThemeIcon();

  // Check if we're on authentication-related pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          {companyLogo ? (
            <img 
              src={companyLogo} 
              alt="Humansys" 
              className="h-12 w-auto cursor-pointer transition-transform duration-200 hover:scale-105" 
              onClick={() => navigate('/')}
            />
          ) : (
            <div 
              className="flex items-center space-x-2 cursor-pointer group" 
              onClick={() => navigate('/')}
            >
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="font-bold text-xl transition-colors duration-200">Humansys</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Home Button - only show on auth pages or when logged in */}
          {(isAuthPage || user) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="transition-all duration-200 hover:scale-105"
              disabled={isLoggingOut}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          )}

          {/* Theme Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 transition-all duration-200 hover:scale-110"
                disabled={isLoggingOut}
              >
                <ThemeIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border border-border">
              <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
                <Sun className="mr-2 h-4 w-4" />
                Claro
                {theme === 'light' && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
                <Moon className="mr-2 h-4 w-4" />
                Escuro
                {theme === 'dark' && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('auto')} className="cursor-pointer">
                <Monitor className="mr-2 h-4 w-4" />
                Automático
                {theme === 'auto' && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {showAuth && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-9 w-9 rounded-full transition-all duration-200 hover:scale-110"
                  disabled={isLoggingOut}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage 
                      src={getUserAvatar()} 
                      alt={getUserName()}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <AvatarFallback>
                      {isLoggingOut ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        getUserName().charAt(0).toUpperCase()
                      )}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background border border-border" align="end">
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer" disabled={isLoggingOut}>
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer" disabled={isLoggingOut}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer" disabled={isLoggingOut}>
                  {isLoggingOut ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  {isLoggingOut ? 'Saindo...' : 'Sair'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : showAuth ? (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate('/login')} className="transition-all duration-200 hover:scale-105">
                Entrar
              </Button>
              <Button onClick={() => navigate('/trial')} className="transition-all duration-200 hover:scale-105">
                Teste Grátis
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
