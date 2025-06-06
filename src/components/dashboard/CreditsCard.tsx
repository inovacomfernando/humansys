
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

  // Handle credits as either number or object
  const creditsData = typeof credits === 'number' 
    ? { total_credits: credits, used_credits: 0, remaining_credits: credits, plan_type: 'trial' as const }
    : credits || { total_credits: 100, used_credits: 0, remaining_credits: 100, plan_type: 'trial' as const };

  const isTrialMode = creditsData.plan_type === 'trial';

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
                {isTrialMode ? '∞' : creditsData.remaining_credits}
              </div>
              <p className="text-xs text-muted-foreground">
                {isTrialMode 
                  ? 'Ilimitado (Teste Grátis)' 
                  : `de ${creditsData.total_credits} créditos`
                }
              </p>
            </div>
            <Badge variant="secondary" className="bg-blue-500">
              Teste Grátis
            </Badge>
          </div>
          
          {!isTrialMode && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Utilizados: {creditsData.used_credits}</span>
                <span>Restantes: {creditsData.remaining_credits}</span>
              </div>
              <Progress value={(creditsData.used_credits / creditsData.total_credits) * 100} className="h-2" />
            </div>
          )}

          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>
              {isTrialMode 
                ? 'Cadastros ilimitados durante o teste' 
                : 'Cada colaborador usa 1 crédito'
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
