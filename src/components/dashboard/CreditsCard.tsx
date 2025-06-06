
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

  // Simple fallback for credits display
  const creditsValue = typeof credits === 'number' ? credits : 100;
  const isTrialMode = true; // Assuming trial mode for now

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
                {isTrialMode ? '∞' : creditsValue}
              </div>
              <p className="text-xs text-muted-foreground">
                {isTrialMode 
                  ? 'Ilimitado (Teste Grátis)' 
                  : `de ${creditsValue} créditos`
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
                <span>Utilizados: 0</span>
                <span>Restantes: {creditsValue}</span>
              </div>
              <Progress value={0} className="h-2" />
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
