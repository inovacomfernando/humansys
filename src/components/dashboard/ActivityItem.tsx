
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Activity {
  id: string;
  type: string;
  description: string;
  created_at: string;
  entity_type?: string;
  entity_id?: string;
}

interface ActivityItemProps {
  activity: Activity;
  onViewDetails?: (id: string) => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  onViewDetails
}) => {
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_created': return 'bg-green-500';
      case 'feedback_sent': return 'bg-blue-500';
      case 'training_completed': return 'bg-purple-500';
      case 'goal_achieved': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora há pouco';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="flex items-start justify-between space-x-3 group">
      <div className="flex items-start space-x-3 flex-1">
        <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium hover:text-primary cursor-pointer">
            {activity.description}
          </p>
          <p className="text-xs text-muted-foreground">{formatDate(activity.created_at)}</p>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onViewDetails?.(activity.id)}
      >
        Ver
      </Button>
    </div>
  );
};
