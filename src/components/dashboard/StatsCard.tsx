import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  description?: string;
  trend?: number;
  isNew?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  description,
  trend = 0,
  isNew = false
}) => {
  const getTrendColor = (trendValue: number) => {
    if (trendValue > 0) return 'text-green-600';
    if (trendValue < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendBgColor = (trendValue: number) => {
    if (trendValue > 0) return 'bg-green-50 border-green-200';
    if (trendValue < 0) return 'bg-red-50 border-red-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-gray-100 bg-white/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
          {isNew && (
            <Badge className="bg-purple-500 text-white text-xs">Novo</Badge>
          )}
        </div>
        <div className={`p-2 rounded-lg ${getTrendBgColor(trend)}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
        {(trend !== 0 || change) && (
          <div className="flex items-center space-x-2">
            {trend > 0 && <TrendingUp className="h-4 w-4 text-green-600" />}
            {trend < 0 && <TrendingDown className="h-4 w-4 text-red-600" />}
            <Badge 
              variant="secondary" 
              className={`text-xs ${getTrendColor(trend)} ${getTrendBgColor(trend)}`}
            >
              {change || `${trend > 0 ? '+' : ''}${trend}%`}
            </Badge>
          </div>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-2">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};