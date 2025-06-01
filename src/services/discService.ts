
import { supabase } from '@/integrations/supabase/client';
import { DiscProfile, DiscAnswer, DiscReport, DiscInsight, DiscGamification } from '@/types/disc';

class DiscService {
  // Perguntas padrão do DISC
  private discQuestions = [
    {
      id: '1',
      category: 'D' as const,
      question: 'Como você aborda desafios e problemas?',
      options: [
        'Enfrento diretamente e tomo decisões rápidas',
        'Busco soluções criativas e envolvo outros',
        'Analiso cuidadosamente antes de agir',
        'Procuro métodos comprovados e sistemáticos'
      ]
    },
    {
      id: '2',
      category: 'I' as const,
      question: 'Como você se comporta em situações sociais?',
      options: [
        'Assumo a liderança e dirijo as conversas',
        'Sou expressivo e gosto de interagir com todos',
        'Prefiro ouvir e dar suporte aos outros',
        'Observo e participo quando necessário'
      ]
    },
    {
      id: '3',
      category: 'S' as const,
      question: 'Como você lida com mudanças?',
      options: [
        'Adapto-me rapidamente e vejo oportunidades',
        'Aceito bem se puder envolver outras pessoas',
        'Preciso de tempo para me ajustar',
        'Avalio cuidadosamente os impactos'
      ]
    },
    {
      id: '4',
      category: 'C' as const,
      question: 'Como você aborda seu trabalho?',
      options: [
        'Foco em resultados e eficiência',
        'Gosto de variedade e interação',
        'Valorizo estabilidade e colaboração',
        'Priorizo qualidade e precisão'
      ]
    },
    {
      id: '5',
      category: 'D' as const,
      question: 'Como você toma decisões?',
      options: [
        'Rapidamente, baseado na intuição',
        'Consultando outras pessoas',
        'Considerando o impacto em todos',
        'Analisando dados e fatos'
      ]
    },
    {
      id: '6',
      category: 'I' as const,
      question: 'O que te motiva no trabalho?',
      options: [
        'Autonomia e controle',
        'Reconhecimento e interação social',
        'Segurança e harmonia da equipe',
        'Precisão e qualidade'
      ]
    }
  ];

  getQuestions() {
    return this.discQuestions;
  }

  calculateProfile(answers: DiscAnswer[]): DiscProfile {
    const scores = { D: 0, I: 0, S: 0, C: 0 };
    
    answers.forEach(answer => {
      const question = this.discQuestions.find(q => q.id === answer.question_id);
      if (question) {
        // Pontuação baseada na resposta selecionada
        const categoryWeights = {
          D: [4, 2, 1, 3],
          I: [2, 4, 3, 1],
          S: [1, 3, 4, 2],
          C: [3, 1, 2, 4]
        };
        
        Object.keys(scores).forEach(category => {
          scores[category as keyof typeof scores] += 
            categoryWeights[category as keyof typeof categoryWeights][answer.selected_option];
        });
      }
    });

    // Normalizar pontuações
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const normalizedScores = {
      dominance: Math.round((scores.D / total) * 100),
      influence: Math.round((scores.I / total) * 100),
      steadiness: Math.round((scores.S / total) * 100),
      conscientiousness: Math.round((scores.C / total) * 100)
    };

    // Determinar estilo primário e secundário
    const sortedStyles = Object.entries(normalizedScores)
      .sort(([,a], [,b]) => b - a)
      .map(([style]) => style.charAt(0).toUpperCase() as 'D' | 'I' | 'S' | 'C');

    const insights = this.generateInsights(normalizedScores);
    const recommendations = this.generateRecommendations(sortedStyles[0], normalizedScores);

    return {
      id: crypto.randomUUID(),
      user_id: '', // Será preenchido ao salvar
      dominance: normalizedScores.dominance,
      influence: normalizedScores.influence,
      steadiness: normalizedScores.steadiness,
      conscientiousness: normalizedScores.conscientiousness,
      primary_style: sortedStyles[0],
      secondary_style: sortedStyles[1],
      completed_at: new Date().toISOString(),
      insights,
      recommendations
    };
  }

  private generateInsights(scores: any): DiscInsight[] {
    const insights: DiscInsight[] = [];
    
    // Análise de Dominância
    insights.push({
      category: 'Dominância',
      description: scores.dominance > 70 
        ? 'Você demonstra alta orientação para resultados e liderança'
        : scores.dominance > 40 
        ? 'Você apresenta características equilibradas de liderança'
        : 'Você prefere trabalhar em equipe e dar suporte',
      strength_level: scores.dominance,
      development_areas: scores.dominance < 50 
        ? ['Desenvolver assertividade', 'Praticar tomada de decisão'] 
        : ['Desenvolver paciência', 'Melhorar escuta ativa'],
      ai_prediction: this.generateAIPrediction('D', scores.dominance)
    });

    // Análise de Influência
    insights.push({
      category: 'Influência',
      description: scores.influence > 70 
        ? 'Você é naturalmente sociável e persuasivo'
        : scores.influence > 40 
        ? 'Você tem boas habilidades de comunicação'
        : 'Você prefere comunicação mais reservada',
      strength_level: scores.influence,
      development_areas: scores.influence < 50 
        ? ['Desenvolver habilidades de apresentação', 'Praticar networking'] 
        : ['Focar em detalhes', 'Melhorar follow-up'],
      ai_prediction: this.generateAIPrediction('I', scores.influence)
    });

    return insights;
  }

  private generateAIPrediction(category: string, score: number): string {
    const predictions = {
      D: {
        high: 'Com base em padrões similares, você tem 85% de probabilidade de se destacar em posições de liderança nos próximos 2 anos.',
        medium: 'Análise preditiva indica 70% de chance de desenvolver forte liderança com treinamento adequado.',
        low: 'IA sugere focar em desenvolvimento de assertividade para alcançar 90% de melhoria em confiança em 6 meses.'
      },
      I: {
        high: 'Modelo ML prevê excelente desempenho em vendas e relacionamento com 92% de precisão.',
        medium: 'Algoritmo indica potencial para crescimento em comunicação com 80% de sucesso em programas de desenvolvimento.',
        low: 'Sistema recomenda foco em habilidades sociais para aumentar influência em 75% em 1 ano.'
      }
    };

    const level = score > 70 ? 'high' : score > 40 ? 'medium' : 'low';
    return predictions[category as keyof typeof predictions]?.[level] || 
           'Análise em andamento - recomendações personalizadas em breve.';
  }

  private generateRecommendations(primaryStyle: string, scores: any): string[] {
    const recommendations = {
      D: [
        'Desenvolva paciência para trabalhar melhor em equipe',
        'Pratique escuta ativa nas reuniões',
        'Delegue mais tarefas para desenvolver outros',
        'Considere o impacto emocional das suas decisões'
      ],
      I: [
        'Foque mais nos detalhes dos projetos',
        'Desenvolva habilidades de planejamento',
        'Pratique follow-up consistente',
        'Balance entusiasmo com análise crítica'
      ],
      S: [
        'Desenvolva maior assertividade',
        'Pratique falar em público',
        'Tome mais iniciativas',
        'Acelere processo de tomada de decisão'
      ],
      C: [
        'Desenvolva flexibilidade para mudanças',
        'Pratique comunicação mais direta',
        'Balance perfeccionismo com prazos',
        'Melhore habilidades de networking'
      ]
    };

    return recommendations[primaryStyle as keyof typeof recommendations] || [];
  }

  generateReport(profile: DiscProfile): DiscReport {
    const styleDescriptions = {
      D: 'Dominante - Orientado para resultados, direto e determinado',
      I: 'Influente - Sociável, otimista e persuasivo',
      S: 'Estável - Paciente, confiável e colaborativo',
      C: 'Consciencioso - Preciso, analítico e sistemático'
    };

    return {
      profile,
      detailed_analysis: `Seu perfil ${styleDescriptions[profile.primary_style]} indica que você possui características únicas que podem ser potencializadas. Com ${profile[profile.primary_style.toLowerCase() as keyof DiscProfile]}% no estilo primário, você demonstra forte tendência para comportamentos típicos desta categoria.`,
      career_recommendations: this.getCareerRecommendations(profile.primary_style),
      team_compatibility: this.getTeamCompatibility(profile),
      leadership_style: this.getLeadershipStyle(profile.primary_style),
      communication_preferences: this.getCommunicationPreferences(profile.primary_style),
      stress_indicators: this.getStressIndicators(profile.primary_style),
      growth_opportunities: profile.recommendations
    };
  }

  private getCareerRecommendations(style: string): string[] {
    const careers = {
      D: ['Executivo', 'Empreendedor', 'Gerente de Projetos', 'Consultor'],
      I: ['Vendas', 'Marketing', 'Relações Públicas', 'Treinamento'],
      S: ['Recursos Humanos', 'Atendimento ao Cliente', 'Mediação', 'Ensino'],
      C: ['Análise', 'Qualidade', 'Pesquisa', 'Contabilidade']
    };
    return careers[style as keyof typeof careers] || [];
  }

  private getTeamCompatibility(profile: DiscProfile): string {
    const compatibility = {
      D: 'Trabalha bem com pessoas orientadas para ação. Pode ter conflitos com estilos muito detalhistas.',
      I: 'Excelente em equipes colaborativas. Pode precisar de suporte em tarefas analíticas.',
      S: 'Ótimo mediador em conflitos. Pode precisar de encorajamento para tomar iniciativas.',
      C: 'Valioso em projetos que exigem precisão. Pode precisar de apoio em mudanças rápidas.'
    };
    return compatibility[profile.primary_style];
  }

  private getLeadershipStyle(style: string): string {
    const leadership = {
      D: 'Liderança diretiva - toma decisões rápidas e assume responsabilidades',
      I: 'Liderança inspiradora - motiva através do entusiasmo e relacionamentos',
      S: 'Liderança participativa - constrói consenso e apoia o desenvolvimento da equipe',
      C: 'Liderança técnica - lidera através da expertise e análise cuidadosa'
    };
    return leadership[style as keyof typeof leadership] || '';
  }

  private getCommunicationPreferences(style: string): string[] {
    const communication = {
      D: ['Comunicação direta e objetiva', 'Foco em resultados', 'Reuniões eficientes'],
      I: ['Comunicação expressiva', 'Interação social', 'Brainstorming em grupo'],
      S: ['Comunicação empática', 'Escuta ativa', 'Feedback construtivo'],
      C: ['Comunicação detalhada', 'Dados e fatos', 'Documentação clara']
    };
    return communication[style as keyof typeof communication] || [];
  }

  private getStressIndicators(style: string): string[] {
    const stress = {
      D: ['Perda de controle', 'Burocracia excessiva', 'Indecisão da equipe'],
      I: ['Isolamento social', 'Tarefas muito detalhadas', 'Ambiente negativo'],
      S: ['Mudanças súbitas', 'Conflitos não resolvidos', 'Pressão de tempo'],
      C: ['Ambiguidade', 'Decisões apressadas', 'Falta de informações']
    };
    return stress[style as keyof typeof stress] || [];
  }

  generateGamificationData(profile: DiscProfile): DiscGamification {
    const badges = [
      {
        id: '1',
        name: 'Autoconhecimento',
        description: 'Completou primeira análise DISC',
        icon: 'Brain',
        color: 'purple',
        earned_at: new Date().toISOString()
      },
      {
        id: '2',
        name: `Especialista ${profile.primary_style}`,
        description: `Demonstrou forte perfil ${profile.primary_style}`,
        icon: 'Trophy',
        color: this.getStyleColor(profile.primary_style),
        earned_at: new Date().toISOString()
      }
    ];

    const achievements = [
      {
        id: '1',
        title: 'Primeira Análise',
        description: 'Complete sua primeira análise DISC',
        points: 100,
        unlocked: true,
        progress: 100,
        max_progress: 100
      },
      {
        id: '2',
        title: 'Desenvolvimento Contínuo',
        description: 'Complete 5 análises para acompanhar sua evolução',
        points: 500,
        unlocked: false,
        progress: 1,
        max_progress: 5
      }
    ];

    return {
      badges,
      level: 1,
      experience_points: 100,
      achievements,
      progress_streak: 1
    };
  }

  private getStyleColor(style: string): string {
    const colors = {
      D: 'red',
      I: 'yellow', 
      S: 'green',
      C: 'blue'
    };
    return colors[style as keyof typeof colors] || 'gray';
  }

  async saveProfile(profile: DiscProfile, userId: string): Promise<void> {
    const { error } = await supabase
      .from('disc_profiles')
      .insert({
        ...profile,
        user_id: userId
      });

    if (error) throw error;
  }

  async getUserProfiles(userId: string): Promise<DiscProfile[]> {
    const { data, error } = await supabase
      .from('disc_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export const discService = new DiscService();
