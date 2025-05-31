
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicBadge } from '@/components/landing/DynamicBadge';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  isNew?: boolean;
  realImpact?: {
    metric: string;
    example: string;
    benefit: string;
  };
  onClick: (path: string) => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  path,
  isNew = false,
  realImpact,
  onClick
}) => {
  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 relative overflow-hidden"
      onClick={() => onClick(path)}
    >
      {isNew && (
        <div className="absolute top-2 right-2">
          <DynamicBadge>Novo</DynamicBadge>
        </div>
      )}
      
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="text-center">
        <CardDescription className="text-sm mb-4">
          {description}
        </CardDescription>
        
        {realImpact && (
          <div className="space-y-2 text-xs text-muted-foreground border-t pt-3">
            <div className="font-medium text-primary">{realImpact.metric}</div>
            <div>{realImpact.example}</div>
            <div className="font-medium">{realImpact.benefit}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
