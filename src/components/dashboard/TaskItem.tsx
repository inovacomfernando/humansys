
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TaskItemProps {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  onView?: (id: number) => void;
  onMarkComplete?: (id: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  id,
  title,
  priority,
  deadline,
  onView,
  onMarkComplete
}) => {
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Baixa';
    }
  };

  return (
    <div className="flex items-center justify-between group">
      <div className="flex-1">
        <p className="text-sm font-medium hover:text-primary cursor-pointer">
          {title}
        </p>
        <div className="flex items-center space-x-2 mt-1">
          <Badge 
            variant={getPriorityVariant(priority)}
            className="text-xs"
          >
            {getPriorityText(priority)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {deadline}
          </span>
        </div>
      </div>
      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onView?.(id)}
        >
          Ver
        </Button>
        <Button 
          size="sm"
          onClick={() => onMarkComplete?.(id)}
        >
          Concluir
        </Button>
      </div>
    </div>
  );
};
