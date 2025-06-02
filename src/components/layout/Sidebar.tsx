
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Brain,
  Search,
  Zap,
  TrendingUp,
  Shield,
  ChevronDown,
  ChevronRight,
  Activity,
  Database,
  Bot,
  Sparkles,
  Building,
  UserCheck,
  GraduationCap,
  LineChart
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

interface MenuSection {
  title: string;
  icon: React.ComponentType<any>;
  items: MenuItem[];
  collapsible?: boolean;
}

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  badge?: string;
  badgeColor?: string;
  description?: string;
  isNew?: boolean;
  isPro?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isFounder, setIsFounder] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['core', 'management']);
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

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionKey) 
        ? prev.filter(key => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const getMenuSections = (): MenuSection[] => {
    const isFounderPath = location.pathname.startsWith('/founder');

    if (isFounderPath && isFounder) {
      return [
        {
          title: 'Founder Suite',
          icon: Crown,
          items: [
            { icon: Crown, label: 'Dashboard Founder', path: '/founder/dashboard', badge: 'Pro', badgeColor: 'bg-yellow-500', description: 'Métricas estratégicas' },
            { icon: Home, label: 'Dashboard Principal', path: '/app/dashboard', description: 'Visão operacional' },
          ]
        }
      ];
    }

    const sections: MenuSection[] = [
      {
        title: 'Core',
        icon: Activity,
        items: [
          { icon: Home, label: 'Dashboard', path: '/app/dashboard', description: 'Visão geral da empresa' },
          ...(isFounder ? [{ 
            icon: Crown, 
            label: 'Dashboard Founder', 
            path: '/founder/dashboard', 
            badge: 'Pro', 
            badgeColor: 'bg-yellow-500',
            description: 'Métricas estratégicas',
            isPro: true
          }] : []),
        ]
      },
      {
        title: 'Gestão de Pessoas',
        icon: Users,
        items: [
          { icon: Users, label: 'Colaboradores', path: '/app/collaborators', description: 'Gestão completa da equipe' },
          { icon: UserPlus, label: 'Recrutamento', path: '/app/recruitment', description: 'Processo seletivo' },
          { icon: Briefcase, label: 'Onboarding', path: '/app/onboarding', description: 'Integração de novos membros' },
          { icon: UserCheck, label: 'Feedback', path: '/app/feedback', description: 'Avaliações e feedback' },
        ]
      },
      {
        title: 'Desenvolvimento',
        icon: TrendingUp,
        items: [
          { icon: Calendar, label: 'Reuniões 1:1', path: '/app/meetings', description: 'Acompanhamento individual' },
          { icon: Target, label: 'Metas & PDI', path: '/app/goals', description: 'Objetivos e desenvolvimento' },
          { icon: BookOpen, label: 'Treinamentos', path: '/app/training', description: 'Capacitação da equipe' },
          { icon: Award, label: 'Certificados', path: '/app/certificates', description: 'Reconhecimentos e certificações' },
        ]
      },
      {
        title: 'Inteligência & Analytics',
        icon: Brain,
        items: [
          { icon: Brain, label: 'Análise DISC', path: '/app/disc', badge: 'IA', badgeColor: 'bg-purple-500', description: 'Perfil comportamental com IA', isNew: true },
          { icon: ClipboardList, label: 'Pesquisas', path: '/app/surveys', description: 'Engajamento e satisfação' },
          { icon: BarChart3, label: 'Analytics', path: '/app/analytics', description: 'Relatórios avançados' },
        ]
      },
      {
        title: 'Documentação & Config',
        icon: Settings,
        items: [
          { icon: FileText, label: 'Documentos', path: '/app/documents', description: 'Gestão de documentos' },
          { icon: Settings, label: 'Configurações', path: '/app/settings', description: 'Personalização do sistema' },
        ]
      }
    ];

    return sections;
  };

  const menuSections = getMenuSections();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn(
      "relative flex flex-col h-full bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 border-r border-green-200 dark:border-green-700 transition-all duration-300 shadow-lg",
      collapsed ? "w-16" : "w-72",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-green-200 dark:border-green-700 bg-green-50/50 dark:bg-green-800/50 backdrop-blur-sm">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-green-900 dark:text-white">HumanSys</h2>
              <p className="text-xs text-green-600 dark:text-green-400">RH Inteligente</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 hover:bg-green-100 dark:hover:bg-green-700"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Search Bar */}
      {!collapsed && (
        <div className="p-3 border-b border-green-200 dark:border-green-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
            <input
              type="text"
              placeholder="Buscar funcionalidade..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-green-100 dark:bg-green-800 border border-green-200 dark:border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
            />
          </div>
        </div>
      )}

      {/* Menu Sections */}
      <ScrollArea className="flex-1 px-2 py-3">
        <div className="space-y-2">
          {menuSections.map((section) => {
            const SectionIcon = section.icon;
            const isExpanded = expandedSections.includes(section.title.toLowerCase().replace(/\s+/g, ''));
            const sectionKey = section.title.toLowerCase().replace(/\s+/g, '');

            return (
              <div key={section.title} className="space-y-1">
                {/* Section Header */}
                {!collapsed && (
                  <Button
                    variant="ghost"
                    onClick={() => toggleSection(sectionKey)}
                    className="w-full justify-between h-8 px-3 text-xs font-medium text-green-600 dark:text-green-300 hover:text-green-900 dark:hover:text-white hover:bg-green-100 dark:hover:bg-green-700"
                  >
                    <div className="flex items-center gap-2">
                      <SectionIcon className="h-4 w-4" />
                      {section.title}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </Button>
                )}

                {/* Section Items */}
                {(collapsed || isExpanded) && (
                  <div className={cn("space-y-1", !collapsed && "ml-2")}>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      
                      return (
                        <div key={item.path} className="relative group">
                          <Button
                            variant={active ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start h-10 text-sm relative overflow-hidden transition-all duration-200",
                              collapsed ? "justify-center px-2" : "px-3",
                              active 
                                ? "bg-gradient-to-r from-green-500/10 to-emerald-50 dark:from-green-500/20 dark:to-emerald-900/20 text-green-600 border-l-2 border-green-500 shadow-sm" 
                                : "hover:bg-green-100 dark:hover:bg-green-700 text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-white",
                              item.isPro && "relative"
                            )}
                            onClick={() => navigate(item.path)}
                          >
                            <Icon className={cn(
                              "h-4 w-4 flex-shrink-0",
                              !collapsed && "mr-3",
                              active && "text-green-600"
                            )} />
                            
                            {!collapsed && (
                              <div className="flex-1 text-left">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{item.label}</span>
                                  <div className="flex items-center gap-1">
                                    {item.isNew && (
                                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    )}
                                    {item.badge && (
                                      <Badge 
                                        className={cn(
                                          "text-white text-xs px-2 py-0.5 h-5",
                                          item.badgeColor || "bg-primary"
                                        )}
                                      >
                                        {item.badge}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                {item.description && (
                                  <p className="text-xs text-green-500 dark:text-green-400 mt-0.5">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            )}

                            {item.isPro && !collapsed && (
                              <Sparkles className="absolute top-1 right-1 h-3 w-3 text-yellow-500" />
                            )}
                          </Button>

                          {/* Tooltip for collapsed state */}
                          {collapsed && (
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-green-900 dark:bg-green-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                              <div className="font-medium">{item.label}</div>
                              {item.description && (
                                <div className="text-xs text-green-300 mt-1">{item.description}</div>
                              )}
                              <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-green-900 dark:border-r-green-700" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {!collapsed && <Separator className="my-2 bg-green-200 dark:bg-green-700" />}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-green-200 dark:border-green-700 bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-800 dark:to-emerald-700">
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-green-800 rounded-lg shadow-sm">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-green-900 dark:text-white">IA Assistant</div>
              <div className="text-xs text-green-600 dark:text-green-400">Online e pronto para ajudar</div>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};
