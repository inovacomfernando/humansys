
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  isNew?: boolean;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend = 0,
  isNew = false,
  onClick
}) => {
  const trendDirection = trend >= 0 ? 'up' : 'down';
  const trendColor = trend >= 0 ? 'text-green-600' : 'text-red-600';
  const trendSymbol = trend >= 0 ? '+' : '';

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-shadow ${onClick ? 'hover:bg-muted/50' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <span>{title}</span>
          {isNew && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              Novo
            </Badge>
          )}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className={trendColor}>
            {trendSymbol}{Math.abs(trend)}%
          </span>
          {' '}em relação ao mês anterior
        </p>
      </CardContent>
    </Card>
  );
};
