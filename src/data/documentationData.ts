
import { DocumentationItem } from '@/types/documentation';
import {
  BookOpen,
  DollarSign,
  TrendingUp,
  Target,
  AlertTriangle,
  BarChart3,
  Users,
  Settings,
  FileText,
  CheckCircle,
  Lightbulb,
  Shield,
  Zap,
  Globe,
  MessageSquare,
  Trophy,
  Clock,
  Heart
} from 'lucide-react';

export const documentationData: DocumentationItem[] = [
  {
    id: 'manual-sistema-completo',
    title: 'Manual Completo do Sistema',
    description: 'Guia completo para usar todas as funcionalidades da plataforma RH',
    category: 'manual-sistema',
    categoryLabel: 'Manual do Sistema',
    icon: BookOpen,
    estimatedReadTime: 15,
    lastUpdated: '2024-01-15',
    downloadUrl: '/docs/manual-sistema.pdf',
    content: [
      {
        title: 'Primeiros Passos',
        description: 'Como configurar e começar a usar o sistema',
        icon: Settings,
        items: [
          'Criação de conta e configuração inicial',
          'Configuração de departamentos e cargos',
          'Importação de dados de colaboradores',
          'Personalização da interface'
        ]
      },
      {
        title: 'Gestão de Colaboradores',
        description: 'Administre informações e dados dos seus colaboradores',
        icon: Users,
        items: [
          'Cadastro e edição de colaboradores',
          'Organização por departamentos',
          'Controle de status e situações',
          'Histórico e documentos'
        ]
      },
      {
        title: 'Relatórios e Analytics',
        description: 'Extraia insights valiosos dos seus dados',
        icon: BarChart3,
        items: [
          'Relatórios de performance',
          'Dashboards executivos',
          'Métricas de engajamento',
          'Exportação de dados'
        ]
      }
    ]
  },
  {
    id: 'estrategias-vendas',
    title: 'Estratégias de Vendas B2B',
    description: 'Metodologias e processos para maximizar vendas corporativas',
    category: 'vendas',
    categoryLabel: 'Manual de Vendas',
    icon: DollarSign,
    estimatedReadTime: 12,
    lastUpdated: '2024-01-10',
    content: [
      {
        title: 'Qualificação de Leads',
        description: 'Como identificar e qualificar prospects ideais',
        icon: Target,
        items: [
          'Critérios de ICP (Ideal Customer Profile)',
          'Framework BANT (Budget, Authority, Need, Timeline)',
          'Técnicas de descoberta de dor',
          'Scorecard de qualificação'
        ]
      },
      {
        title: 'Processo de Vendas',
        description: 'Metodologia estruturada para fechar negócios',
        icon: CheckCircle,
        items: [
          'Mapeamento da jornada do cliente',
          'Scripts de abordagem e apresentação',
          'Tratamento de objeções comuns',
          'Técnicas de fechamento'
        ]
      },
      {
        title: 'Follow-up e Relacionamento',
        description: 'Mantenha relacionamentos duradouros com clientes',
        icon: Heart,
        items: [
          'Cronograma de follow-up estruturado',
          'Estratégias de upsell e cross-sell',
          'Programa de fidelização',
          'Gestão de reclamações e suporte'
        ]
      }
    ]
  },
  {
    id: 'marketing-digital',
    title: 'Marketing Digital para RH Tech',
    description: 'Estratégias de marketing específicas para o setor de RH e tecnologia',
    category: 'marketing',
    categoryLabel: 'Manual de Marketing',
    icon: TrendingUp,
    estimatedReadTime: 10,
    lastUpdated: '2024-01-08',
    content: [
      {
        title: 'Content Marketing',
        description: 'Criação de conteúdo relevante para RH',
        icon: FileText,
        items: [
          'Calendário editorial mensal',
          'Templates de posts para LinkedIn',
          'E-books e whitepapers sobre RH',
          'Cases de sucesso e depoimentos'
        ]
      },
      {
        title: 'Campanhas Digitais',
        description: 'Estratégias de mídia paga e orgânica',
        icon: Globe,
        items: [
          'Campanhas no LinkedIn Ads',
          'Google Ads para palavras-chave de RH',
          'Email marketing segmentado',
          'Webinars e eventos online'
        ]
      },
      {
        title: 'SEO e Presença Online',
        description: 'Otimização para mecanismos de busca',
        icon: Zap,
        items: [
          'Palavras-chave relevantes para RH',
          'Otimização de landing pages',
          'Link building com sites de RH',
          'Google My Business otimizado'
        ]
      }
    ]
  },
  {
    id: 'proposta-valor-unica',
    title: 'Proposta de Valor Única',
    description: 'Diferenciais competitivos e benefícios únicos da nossa solução',
    category: 'proposta-valor',
    categoryLabel: 'Proposta de Valor',
    icon: Trophy,
    estimatedReadTime: 8,
    lastUpdated: '2024-01-12',
    content: [
      {
        title: 'Diferenciais Tecnológicos',
        description: 'O que nos torna únicos no mercado',
        icon: Lightbulb,
        items: [
          'IA integrada para análise preditiva',
          'Interface intuitiva e user-friendly',
          'Integração com 50+ sistemas',
          'Segurança enterprise com ISO 27001'
        ]
      },
      {
        title: 'Benefícios Quantificáveis',
        description: 'Resultados mensuráveis para nossos clientes',
        icon: BarChart3,
        items: [
          'Redução de 60% no tempo de processos de RH',
          'Aumento de 40% no engajamento dos colaboradores',
          'ROI médio de 300% em 12 meses',
          'Diminuição de 80% em retrabalho administrativo'
        ]
      },
      {
        title: 'Suporte e Acompanhamento',
        description: 'Compromisso com o sucesso do cliente',
        icon: Shield,
        items: [
          'Customer Success dedicado',
          'Onboarding personalizado',
          'Suporte 24/7 em português',
          'Treinamentos mensais gratuitos'
        ]
      }
    ]
  },
  {
    id: 'dores-empresas-rh',
    title: 'Principais Dores das Empresas em RH',
    description: 'Problemas comuns que nossa solução resolve efetivamente',
    category: 'dores-empresas',
    categoryLabel: 'Dores das Empresas',
    icon: AlertTriangle,
    estimatedReadTime: 7,
    lastUpdated: '2024-01-05',
    content: [
      {
        title: 'Gestão Manual e Ineficiente',
        description: 'Processos manuais que consomem tempo excessivo',
        icon: Clock,
        items: [
          'Planilhas desatualizadas e descentralizadas',
          'Retrabalho constante em tarefas administrativas',
          'Dificuldade em encontrar informações rapidamente',
          'Erros humanos em cálculos e relatórios'
        ]
      },
      {
        title: 'Falta de Visibilidade e Controle',
        description: 'Ausência de dados para tomada de decisão',
        icon: BarChart3,
        items: [
          'Impossibilidade de gerar relatórios em tempo real',
          'Falta de métricas de performance e engajamento',
          'Dificuldade em identificar tendências e padrões',
          'Ausência de dashboards executivos'
        ]
      },
      {
        title: 'Comunicação e Engajamento',
        description: 'Desafios na comunicação interna',
        icon: MessageSquare,
        items: [
          'Feedback esporádico e pouco estruturado',
          'Baixo engajamento dos colaboradores',
          'Dificuldade em manter equipes alinhadas',
          'Falta de transparência nos processos'
        ]
      }
    ]
  },
  {
    id: 'benchmarks-mercado',
    title: 'Benchmarks e Dados de Mercado',
    description: 'Estatísticas e comparativos do setor de RH e tecnologia',
    category: 'benchmarks',
    categoryLabel: 'Benchmarks',
    icon: BarChart3,
    estimatedReadTime: 6,
    lastUpdated: '2024-01-03',
    externalUrl: 'https://rh-insights.com/benchmarks',
    content: [
      {
        title: 'Mercado de HR Tech no Brasil',
        description: 'Dados atualizados sobre o crescimento do setor',
        icon: TrendingUp,
        items: [
          'Mercado de R$ 2,3 bilhões em 2024',
          'Crescimento de 25% ao ano',
          '78% das empresas investem em digitalização do RH',
          'ROI médio de 280% em soluções de RH'
        ]
      },
      {
        title: 'Comparativo com Concorrentes',
        description: 'Nossa posição no mercado nacional',
        icon: Trophy,
        items: [
          'Top 3 em satisfação do cliente (NPS 72)',
          '40% mais rápido que a concorrência',
          'Preço 30% mais competitivo',
          'Única solução com IA nativa'
        ]
      },
      {
        title: 'Tendências para 2024-2025',
        description: 'Para onde o mercado está caminhando',
        icon: Globe,
        items: [
          'IA e automação em 85% das empresas',
          'People Analytics como diferencial',
          'Employee Experience prioritário',
          'Integração com ferramentas de produtividade'
        ]
      }
    ]
  }
];
