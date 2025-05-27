
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ProgressBar } from '@/components/gamification/ProgressBar';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Play, 
  CheckCircle2,
  Award,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrainingData {
  id: string;
  title: string;
  description: string;
  instructor?: string;
  duration: string;
  participants: number;
  rating?: number;
  thumbnail?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  enrollment?: {
    status: 'not-enrolled' | 'enrolled' | 'in-progress' | 'completed';
    progress?: number;
    completed_at?: string;
  };
  badges_earned?: number;
  certificate_available?: boolean;
}

interface ModernTrainingCardProps {
  training: TrainingData;
  onEnroll?: (trainingId: string) => void;
  onContinue?: (trainingId: string) => void;
  onViewCertificate?: (trainingId: string) => void;
  className?: string;
}

export const ModernTrainingCard: React.FC<ModernTrainingCardProps> = ({
  training,
  onEnroll,
  onContinue,
  onViewCertificate,
  className
}) => {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'enrolled': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const renderActionButton = () => {
    const { enrollment } = training;
    
    if (!enrollment || enrollment.status === 'not-enrolled') {
      return (
        <Button 
          size="sm" 
          onClick={() => onEnroll?.(training.id)}
          className="w-full"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Inscrever-se
        </Button>
      );
    }
    
    if (enrollment.status === 'completed') {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-center text-green-600 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Concluído
          </div>
          {training.certificate_available && onViewCertificate && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewCertificate(training.id)}
              className="w-full"
            >
              <Award className="h-4 w-4 mr-2" />
              Ver Certificado
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <Button 
        size="sm" 
        onClick={() => onContinue?.(training.id)}
        className="w-full"
      >
        <Play className="h-4 w-4 mr-2" />
        Continuar
      </Button>
    );
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
      training.enrollment?.status === 'completed' && "bg-green-50 border-green-200",
      className
    )}>
      {/* Thumbnail/Header */}
      <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-600">
        {training.thumbnail ? (
          <img 
            src={training.thumbnail} 
            alt={training.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <BookOpen className="h-12 w-12 text-white/80" />
          </div>
        )}
        
        {/* Category Badge */}
        {training.category && (
          <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800">
            {training.category}
          </Badge>
        )}
        
        {/* Difficulty Badge */}
        {training.difficulty && (
          <Badge className={cn(
            "absolute top-3 right-3",
            getDifficultyColor(training.difficulty)
          )}>
            {training.difficulty}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{training.title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {training.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Training Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{training.duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{training.participants} alunos</span>
          </div>
        </div>

        {/* Instructor */}
        {training.instructor && (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs">
                {training.instructor.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">{training.instructor}</div>
              <div className="text-xs text-muted-foreground">Instrutor</div>
            </div>
          </div>
        )}

        {/* Rating */}
        {training.rating && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < training.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {training.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Progress (if enrolled) */}
        {training.enrollment && training.enrollment.status !== 'not-enrolled' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Progresso</span>
              <span className={getStatusColor(training.enrollment.status)}>
                {training.enrollment.status === 'completed' ? 'Concluído' : 
                 training.enrollment.status === 'in-progress' ? 'Em Andamento' : 'Inscrito'}
              </span>
            </div>
            {training.enrollment.progress !== undefined && (
              <ProgressBar
                value={training.enrollment.progress}
                color={training.enrollment.status === 'completed' ? 'green' : 'blue'}
                animated={training.enrollment.status === 'in-progress'}
              />
            )}
          </div>
        )}

        {/* Badges Earned */}
        {training.badges_earned && training.badges_earned > 0 && (
          <div className="flex items-center space-x-2 text-sm">
            <Award className="h-4 w-4 text-yellow-500" />
            <span>{training.badges_earned} badge{training.badges_earned > 1 ? 's' : ''} conquistado{training.badges_earned > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Action Button */}
        {renderActionButton()}
      </CardContent>
    </Card>
  );
};
