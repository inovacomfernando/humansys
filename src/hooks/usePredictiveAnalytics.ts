
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCollaborators } from '@/hooks/useCollaborators';
import { useDocuments } from '@/hooks/useDocuments';

interface Prediction {
  type: string;
  value: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: number;
  category: string;
}

interface PredictiveData {
  predictions: {
    turnover: Prediction;
    performance: Prediction;
    training_demand: Prediction;
    recommendations: Recommendation[];
  };
  trends: Array<{ date: string; value: number; prediction?: boolean }>;
  risks: Array<{ type: string; level: 'high' | 'medium' | 'low'; description: string }>;
}

export const usePredictiveAnalytics = () => {
  const { user } = useAuth();
  const { collaborators } = useCollaborators();
  const { documents } = useDocuments();
  const [data, setData] = useState<PredictiveData>({
    predictions: {
      turnover: { type: 'turnover', value: 15, confidence: 82, trend: 'up' },
      performance: { type: 'performance', value: 12, confidence: 78, trend: 'up' },
      training_demand: { type: 'training', value: 68, confidence: 85, trend: 'up' },
      recommendations: []
    },
    trends: [],
    risks: []
  });

  const generatePredictions = () => {
    // Simulação de algoritmos de ML baseados nos dados reais
    const totalCollaborators = collaborators.length;
    const totalDocuments = documents.length;
    
    // Cálculo de risco de turnover baseado em padrões
    const turnoverRisk = Math.min(25, Math.max(5, (30 - totalCollaborators) * 0.8));
    
    // Previsão de performance baseada em engajamento
    const performanceGrowth = Math.min(20, Math.max(-5, totalDocuments * 0.5 + Math.random() * 10));
    
    // Demanda de treinamento baseada em crescimento
    const trainingDemand = Math.min(100, Math.max(20, totalCollaborators * 2.5 + Math.random() * 20));

    // Gerar tendências para os próximos 6 meses
    const trends = [];
    const baseValue = 100;
    for (let i = 0; i < 12; i++) {
      const isHistorical = i < 6;
      const variation = (Math.random() - 0.5) * 20;
      const trend = baseValue + (i * 2) + variation;
      
      trends.push({
        date: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.max(0, trend),
        prediction: !isHistorical
      });
    }

    // Gerar recomendações baseadas nos dados
    const recommendations: Recommendation[] = [
      {
        id: '1',
        title: 'Programa de Retenção',
        description: 'Implementar programa personalizado para colaboradores em risco de turnover',
        priority: 'high',
        impact: 85,
        category: 'retention'
      },
      {
        id: '2',
        title: 'Expansão de Treinamentos',
        description: 'Aumentar oferta de cursos técnicos baseado na alta demanda prevista',
        priority: 'medium',
        impact: 70,
        category: 'training'
      },
      {
        id: '3',
        title: 'Feedback Estruturado',
        description: 'Intensificar ciclos de feedback para melhorar engajamento',
        priority: 'medium',
        impact: 65,
        category: 'engagement'
      }
    ];

    // Identificar riscos
    const risks = [
      {
        type: 'Turnover Alto',
        level: turnoverRisk > 20 ? 'high' : turnoverRisk > 10 ? 'medium' : 'low' as 'high' | 'medium' | 'low',
        description: 'Risco elevado de perda de colaboradores chave'
      },
      {
        type: 'Sobrecarga Treinamentos',
        level: trainingDemand > 80 ? 'high' : 'medium' as 'high' | 'medium' | 'low',
        description: 'Capacidade de treinamento pode ficar sobrecarregada'
      }
    ];

    setData({
      predictions: {
        turnover: { type: 'turnover', value: turnoverRisk, confidence: 82, trend: 'up' },
        performance: { type: 'performance', value: performanceGrowth, confidence: 78, trend: 'up' },
        training_demand: { type: 'training', value: trainingDemand, confidence: 85, trend: 'up' },
        recommendations
      },
      trends,
      risks
    });
  };

  useEffect(() => {
    if (user && collaborators.length > 0) {
      generatePredictions();
    }
  }, [user, collaborators, documents]);

  return data;
};
