
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

  if (!credits) return null;

  const progressPercentage = ((credits.total_credits - credits.remaining_credits) / credits.total_credits) * 100;
  
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
              <div className="text-2xl font-bold">{credits.remaining_credits}</div>
              <p className="text-xs text-muted-foreground">
                de {credits.total_credits} créditos
              </p>
            </div>
            <Badge variant="secondary" className={planColors[credits.plan_type]}>
              {planLabels[credits.plan_type]}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Utilizados: {credits.used_credits}</span>
              <span>Restantes: {credits.remaining_credits}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>Cada colaborador usa 1 crédito</span>
          </div>

          {credits.remaining_credits <= 5 && credits.plan_type !== 'trial' && (
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
