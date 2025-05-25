
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
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
  Briefcase
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Colaboradores', path: '/collaborators' },
    { icon: UserPlus, label: 'Recrutamento', path: '/recruitment' },
    { icon: Briefcase, label: 'Onboarding', path: '/onboarding' },
    { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
    { icon: Calendar, label: '1:1 Meetings', path: '/meetings' },
    { icon: Target, label: 'Metas & PDI', path: '/goals' },
    { icon: BookOpen, label: 'Treinamentos', path: '/training' },
    { icon: Award, label: 'Certificados', path: '/certificates' },
    { icon: BarChart3, label: 'Pesquisas', path: '/surveys' },
    { icon: FileText, label: 'Documentos', path: '/documents' },
  ];

  const adminItems = [
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

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
          <h2 className="text-lg font-semibold">Menu</h2>
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
                "w-full justify-start h-10",
                collapsed && "justify-center"
              )}
              onClick={() => navigate(item.path)}
            >
              <Icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      {/* Admin Section */}
      {user?.role === 'admin' && (
        <div className="border-t p-2 space-y-1">
          {adminItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-10",
                  collapsed && "justify-center"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};
