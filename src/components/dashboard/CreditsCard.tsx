
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useCredits } from '@/hooks/useCredits';
import { Coins, Users, TrendingUp } from 'lucide-react';

export const CreditsCard = () => {
  const { credits, isLoading } = useCredits();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="h-2 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Fallback data se não houver créditos
  const defaultCredits = {
    plan_type: 'trial' as const,
    total_credits: 999999,
    used_credits: 0,
    remaining_credits: 999999
  };

  const creditsData = credits || defaultCredits;

  const progressPercentage = creditsData.total_credits > 0 
    ? ((creditsData.total_credits - creditsData.remaining_credits) / creditsData.total_credits) * 100
    : 0;
  
  const planLabels = {
    trial: 'Teste Grátis',
    inicial: 'Inicial',
    crescimento: 'Em Crescimento',
    profissional: 'Profissional'
  };

  const planColors = {
    trial: 'bg-blue-500',
    inicial: 'bg-green-500',
    crescimento: 'bg-purple-500',
    profissional: 'bg-gold-500'
  };

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Créditos Disponíveis</CardTitle>
        <Coins className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {creditsData.plan_type === 'trial' ? '∞' : creditsData.remaining_credits}
              </div>
              <p className="text-xs text-muted-foreground">
                {creditsData.plan_type === 'trial' 
                  ? 'Ilimitado (Teste Grátis)' 
                  : `de ${creditsData.total_credits} créditos`
                }
              </p>
            </div>
            <Badge variant="secondary" className={planColors[creditsData.plan_type]}>
              {planLabels[creditsData.plan_type]}
            </Badge>
          </div>
          
          {creditsData.plan_type !== 'trial' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Utilizados: {creditsData.used_credits}</span>
                <span>Restantes: {creditsData.remaining_credits}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}

          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>
              {creditsData.plan_type === 'trial' 
                ? 'Cadastros ilimitados durante o teste' 
                : 'Cada colaborador usa 1 crédito'
              }
            </span>
          </div>

          {creditsData.remaining_credits <= 5 && creditsData.plan_type !== 'trial' && (
            <div className="flex items-center space-x-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
              <TrendingUp className="h-3 w-3" />
              <span>Poucos créditos restantes! Considere fazer upgrade.</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
