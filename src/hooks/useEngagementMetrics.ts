
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCollaborators } from '@/hooks/useCollaborators';

interface EngagementMetrics {
  overallScore: number;
  participationRate: number;
  satisfactionScore: number;
  goalCompletionRate: number;
}

interface DepartmentScore {
  name: string;
  score: number;
  collaborators: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export const useEngagementMetrics = () => {
  const { user } = useAuth();
  const { collaborators } = useCollaborators();
  const [metrics, setMetrics] = useState<EngagementMetrics>({
    overallScore: 84,
    participationRate: 92,
    satisfactionScore: 78,
    goalCompletionRate: 67
  });
  
  const [departmentScores, setDepartmentScores] = useState<DepartmentScore[]>([]);
  const [trends, setTrends] = useState<Array<{ date: string; value: number }>>([]);

  const calculateEngagementMetrics = () => {
    // Agrupar colaboradores por departamento
    const deptGroups = collaborators.reduce((acc, collab) => {
      if (!acc[collab.department]) {
        acc[collab.department] = [];
      }
      acc[collab.department].push(collab);
      return acc;
    }, {} as Record<string, any[]>);

    // Calcular scores por departamento
    const deptScores: DepartmentScore[] = Object.entries(deptGroups).map(([dept, collabs]) => {
      const baseScore = 70 + Math.random() * 25; // Score base entre 70-95
      
      // Properly type the trend assignment
      const randomValue = Math.random();
      let trend: 'up' | 'down' | 'stable';
      if (randomValue > 0.6) {
        trend = 'up';
      } else if (randomValue > 0.3) {
        trend = 'stable';
      } else {
        trend = 'down';
      }
      
      const change = Math.floor(Math.random() * 10) + 1;
      
      return {
        name: dept,
        score: Math.round(baseScore),
        collaborators: collabs.length,
        trend,
        change
      };
    }).sort((a, b) => b.score - a.score);

    setDepartmentScores(deptScores);

    // Gerar dados de tendência
    const trendData = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      
      trendData.push({
        date: date.toISOString().split('T')[0],
        value: 75 + Math.random() * 15 + i * 2 // Tendência crescente
      });
    }
    setTrends(trendData);
  };

  useEffect(() => {
    if (user && collaborators.length > 0) {
      calculateEngagementMetrics();
    }
  }, [user, collaborators]);

  return {
    metrics,
    departmentScores,
    trends
  };
};
