import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Users,
  FileText,
  Target,
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  Crown,
  Brain,
  GraduationCap,
  Award,
  Calendar,
  UserCheck,
  FileCheck,
  Building,
  Search,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  ownerOnly?: boolean;
  category?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
    category: 'principal'
  },
  {
    title: 'Colaboradores',
    href: '/collaborators',
    icon: <Users className="h-4 w-4" />,
    category: 'gestao'
  },
  {
    title: 'Treinamentos',
    href: '/training',
    icon: <GraduationCap className="h-4 w-4" />,
    category: 'desenvolvimento'
  },
  {
    title: 'Metas',
    href: '/goals',
    icon: <Target className="h-4 w-4" />,
    category: 'desenvolvimento'
  },
  {
    title: 'Certificados',
    href: '/modern-certificates',
    icon: <Award className="h-4 w-4" />,
    category: 'desenvolvimento'
  },
  {
    title: 'Pesquisas',
    href: '/modern-surveys',
    icon: <FileCheck className="h-4 w-4" />,
    category: 'feedback'
  },
  {
    title: 'Reuniões',
    href: '/meetings',
    icon: <Calendar className="h-4 w-4" />,
    category: 'gestao'
  },
  {
    title: 'Onboarding',
    href: '/onboarding',
    icon: <UserCheck className="h-4 w-4" />,
    category: 'gestao'
  },
  {
    title: 'Documentos',
    href: '/documents',
    icon: <FileText className="h-4 w-4" />,
    category: 'conhecimento'
  },
  {
    title: 'DISC',
    href: '/disc',
    icon: <Brain className="h-4 w-4" />,
    badge: 'IA',
    category: 'inteligencia'
  },
  {
    title: 'Feedback',
    href: '/feedback',
    icon: <MessageSquare className="h-4 w-4" />,
    category: 'feedback'
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="h-4 w-4" />,
    category: 'inteligencia'
  },
  {
    title: 'Brainsys IAO',
    href: '/brainsys-iao',
    icon: <Brain className="h-4 w-4" />,
    badge: 'BETA',
    category: 'inteligencia'
  },
  {
    title: 'Founder Dashboard',
    href: '/founder-dashboard',
    icon: <Building className="h-4 w-4" />,
    ownerOnly: true,
    category: 'founder'
  },
];

const categoryLabels = {
  principal: 'Principal',
  gestao: 'Gestão de Pessoas',
  desenvolvimento: 'Desenvolvimento',
  feedback: 'Feedback & Pesquisas',
  conhecimento: 'Base de Conhecimento',
  inteligencia: 'Inteligência & Analytics',
  founder: 'Founder'
};

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const isOwner = user?.email === 'amanda@vendasimples.com.br';

  const filteredItems = sidebarItems.filter(item => {
    if (item.ownerOnly && !isOwner) return false;
    if (searchTerm) {
      return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category || 'outros';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, SidebarItem[]>);

  const toggleCategory = (category: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  return (
    <div className="w-72 border-r bg-white/50 backdrop-blur-md supports-[backdrop-filter]:bg-white/40">
      <div className="flex h-full flex-col">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Buscar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <nav className="px-3 pb-4">
            {searchTerm ? (
              <div className="space-y-1">
                {filteredItems.map((item) => (
                  <Link key={item.href} to={item.href}>
                    <Button
                      variant={location.pathname === item.href ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start h-10 transition-all duration-200",
                        location.pathname === item.href 
                          ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-2 border-blue-500 text-blue-700" 
                          : "hover:bg-gray-50"
                      )}
                    >
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs bg-blue-100 text-blue-700">
                          {item.badge}
                        </Badge>
                      )}
                      {item.ownerOnly && (
                        <Crown className="ml-auto h-3 w-3 text-yellow-600" />
                      )}
                    </Button>
                  </Link>
                ))}
              </div>
            ) : (
              Object.entries(groupedItems).map(([category, items]) => {
                const isCollapsed = collapsedCategories.has(category);
                return (
                  <div key={category} className="mb-4">
                    <Button
                      variant="ghost"
                      onClick={() => toggleCategory(category)}
                      className="w-full justify-between h-8 px-2 mb-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                    >
                      <span>{categoryLabels[category as keyof typeof categoryLabels] || category}</span>
                      {isCollapsed ? (
                        <ChevronRight className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>

                    {!isCollapsed && (
                      <div className="space-y-1 ml-2">
                        {items.map((item) => (
                          <Link key={item.href} to={item.href}>
                            <Button
                              variant={location.pathname === item.href ? "secondary" : "ghost"}
                              className={cn(
                                "w-full justify-start h-9 transition-all duration-200",
                                location.pathname === item.href 
                                  ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-2 border-blue-500 text-blue-700" 
                                  : "hover:bg-gray-50"
                              )}
                            >
                              {item.icon}
                              <span className="ml-3 text-sm">{item.title}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="ml-auto text-xs bg-blue-100 text-blue-700">
                                  {item.badge}
                                </Badge>
                              )}
                              {item.ownerOnly && (
                                <Crown className="ml-auto h-3 w-3 text-yellow-600" />
                              )}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    )}

                    {category !== 'founder' && <Separator className="mt-3" />}
                  </div>
                );
              })
            )}
          </nav>
        </div>

        <div className="border-t bg-gray-50/50 p-3">
          <Link to="/settings">
            <Button
              variant={location.pathname === '/settings' ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start transition-all duration-200",
                location.pathname === '/settings' 
                  ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-2 border-blue-500 text-blue-700"
                  : "hover:bg-gray-50"
              )}
            >
              <Settings className="h-4 w-4" />
              <span className="ml-3">Configurações</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};