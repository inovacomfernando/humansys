
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DynamicBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export const DynamicBadge: React.FC<DynamicBadgeProps> = ({ 
  children, 
  variant = 'secondary', 
  className = '' 
}) => {
  return (
    <Badge 
      variant={variant} 
      className={`
        ${className}
        animate-pulse
        bg-gradient-to-r from-blue-500 to-purple-600 
        text-white
        shadow-lg
        border-0
        hover:animate-none
        hover:scale-105
        transition-all
        duration-300
        relative
        overflow-hidden
        before:absolute
        before:inset-0
        before:bg-gradient-to-r
        before:from-transparent
        before:via-white/20
        before:to-transparent
        before:translate-x-[-100%]
      `}
    >
      {children}
    </Badge>
  );
};
