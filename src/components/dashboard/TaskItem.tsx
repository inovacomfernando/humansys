
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Task {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
}

interface TaskItemProps {
  task: Task;
  onView?: (id: number) => void;
  onMarkComplete?: (id: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
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
          {task.title}
        </p>
        <div className="flex items-center space-x-2 mt-1">
          <Badge 
            variant={getPriorityVariant(task.priority)}
            className="text-xs"
          >
            {getPriorityText(task.priority)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {task.deadline}
          </span>
        </div>
      </div>
      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onView?.(task.id)}
        >
          Ver
        </Button>
        <Button 
          size="sm"
          onClick={() => onMarkComplete?.(task.id)}
        >
          Concluir
        </Button>
      </div>
    </div>
  );
};
