import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Users,
  UserPlus,
  MessageSquare,
  Target,
  BookOpen,
  Award,
  FileText,
  BarChart3,
  Settings,
  Menu,
  Home,
  Calendar,
  Briefcase,
  Crown,
  ClipboardList,
  Brain
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isFounder, setIsFounder] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check founder role
  useEffect(() => {
    const checkFounderRole = async () => {
      if (!user?.id) return;

      try {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'founder')
          .maybeSingle();

        setIsFounder(!!data);
      } catch (error) {
        console.error('Error checking founder role:', error);
      }
    };

    checkFounderRole();
  }, [user?.id]);

  const getMenuItems = () => {
    const isFounderPath = location.pathname.startsWith('/founder');

    if (isFounderPath && isFounder) {
      return [
        { icon: Crown, label: 'Dashboard Founder', path: '/founder/dashboard' },
        { icon: Home, label: 'Dashboard Principal', path: '/app/dashboard' },
      ];
    }

    return [
      { icon: Home, label: 'Dashboard', path: '/app/dashboard' },
      ...(isFounder ? [{ icon: Crown, label: 'Dashboard Founder', path: '/founder/dashboard' }] : []),
      { icon: Users, label: 'Colaboradores', path: '/app/collaborators' },
      { icon: UserPlus, label: 'Recrutamento', path: '/app/recruitment' },
      { icon: Briefcase, label: 'Onboarding', path: '/app/onboarding' },
      { icon: MessageSquare, label: 'Feedback', path: '/app/feedback' },
      { icon: Calendar, label: 'Reuniões 1:1', path: '/app/meetings' },
      { icon: Target, label: 'Metas & PDI', path: '/app/goals' },
      { icon: BookOpen, label: 'Treinamentos', path: '/app/training' },
      { icon: Award, label: 'Certificados', path: '/app/certificates' },
      { icon: ClipboardList, label: 'Pesquisas', path: '/app/surveys' },
      { icon: Brain, label: 'Análise DISC', path: '/app/disc', badge: 'Novo' },
      { icon: BarChart3, label: 'Analytics', path: '/app/analytics' },
      { icon: FileText, label: 'Documentos', path: '/app/documents' },
      { icon: Settings, label: 'Configurações', path: '/app/settings' },
    ];
  };

  const menuItems = getMenuItems();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn(
      "relative flex flex-col h-full bg-card border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Toggle Button */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {location.pathname.startsWith('/founder') && isFounder && (
              <Crown className="h-5 w-5 text-yellow-500" />
            )}
            Menu
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-10 relative",
                collapsed && "justify-center"
              )}
              onClick={() => navigate(item.path)}
            >
              <Icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge && (
                <Badge className="ml-auto bg-green-500 text-white">
                  {item.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};