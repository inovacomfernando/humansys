
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ActivityItemProps {
  id: number;
  type: string;
  title: string;
  time: string;
  status: string;
  onViewDetails?: (id: number) => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  id,
  type,
  title,
  time,
  status,
  onViewDetails
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'active': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-start justify-between space-x-3 group">
      <div className="flex items-start space-x-3 flex-1">
        <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(status)}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium hover:text-primary cursor-pointer">
            {title}
          </p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onViewDetails?.(id)}
      >
        Ver
      </Button>
    </div>
  );
};
