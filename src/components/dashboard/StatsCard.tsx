import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  description,
  trend = 'neutral'
}) => {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendBgColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'bg-green-50 border-green-200';
      case 'down': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-gray-100 bg-white/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${getTrendBgColor(trend)}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
        {change && (
          <div className="flex items-center space-x-2">
            {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
            {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
            <Badge 
              variant="secondary" 
              className={`text-xs ${getTrendColor(trend)} ${getTrendBgColor(trend)}`}
            >
              {change}
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