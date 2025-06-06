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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Moon, Sun, Monitor, LogOut, Settings, User, Loader2, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  showAuth?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showAuth = true }) => {
  const navigate = useNavigate();
  const { user, signOut, isLoggingOut } = useAuth();
  const { theme, effectiveTheme, setTheme, companyLogo } = useTheme();
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
      console.log('Starting logout...');

      // Clear everything immediately (before API call)
      localStorage.clear();
      sessionStorage.clear();

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
        <div className="flex items-center space-x-8">
          {companyLogo ? (
            <img 
              src={companyLogo} 
              alt="Humansys" 
              className="h-16 w-auto cursor-pointer transition-transform duration-200 hover:scale-105" 
              onClick={() => navigate('/')}
            />
          ) : (
            <div 
              className="flex items-center space-x-3 cursor-pointer group" 
              onClick={() => navigate('/')}
            >
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="font-bold text-2xl transition-colors duration-200">Humansys</span>
            </div>
          )}

          {/* Product Navigation - only show on landing page */}
          {location.pathname === '/' && !user && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    Produto
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/app/dashboard"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Humansys
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Plataforma completa de gestão de RH com IA
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href="/app/dashboard"
                          >
                            <div className="text-sm font-medium leading-none">Funcionalidades</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Explore todas as funcionalidades do sistema
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href="/plans"
                          >
                            <div className="text-sm font-medium leading-none">Preços</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Conheça nossos planos e preços
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href="/changelog"
                          >
                            <div className="text-sm font-medium leading-none">Novidades</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Veja as últimas atualizações
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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
                <DropdownMenuItem onClick={() => navigate('/app/settings?tab=profile')} className="cursor-pointer" disabled={isLoggingOut}>
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
