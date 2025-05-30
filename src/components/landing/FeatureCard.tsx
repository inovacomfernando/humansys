
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  isNew?: boolean;
  realImpact: {
    metric: string;
    example: string;
    benefit: string;
  };
  onClick: (path: string) => void;
}

export const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  path, 
  isNew, 
  realImpact,
  onClick 
}: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="relative group cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-105 border-2"
      onClick={() => onClick(path)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Efeito de luz que corre nas bordas */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-[slide-x_2s_ease-in-out_infinite] border-2 border-primary/50 rounded-lg"></div>
      </div>
      
      {/* Luz de fundo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {isNew && (
        <Badge className="absolute -top-2 -right-2 bg-green-500 text-white z-10">
          Novo
        </Badge>
      )}
      
      <CardHeader className="relative z-10">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <CardDescription className="mb-4">
          {description}
        </CardDescription>
        
        {/* Exemplo de impacto real - aparece no hover */}
        <div className={`transform transition-all duration-500 ${
          isHovered 
            ? 'translate-y-0 opacity-100 max-h-32' 
            : 'translate-y-4 opacity-0 max-h-0'
        } overflow-hidden`}>
          <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
            <div className="text-sm font-semibold text-primary mb-1">
              {realImpact.metric}
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {realImpact.example}
            </div>
            <div className="text-xs font-medium text-green-600">
              ✓ {realImpact.benefit}
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Efeito de brilho adicional nas bordas */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-[slide-x_3s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-[slide-x_3s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-primary to-transparent animate-[slide-y_3s_ease-in-out_infinite]"></div>
        <div className="absolute right-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-primary to-transparent animate-[slide-y_3s_ease-in-out_infinite_reverse]"></div>
      </div>
    </Card>
  );
};
