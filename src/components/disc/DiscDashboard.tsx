
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DiscProfile, DiscGamification } from '@/types/disc';
import { discService } from '@/services/discService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Plus, 
  TrendingUp, 
  Trophy, 
  Star,
  Calendar,
  Download,
  Eye
} from 'lucide-react';

interface DiscDashboardProps {
  onStartAssessment: () => void;
  onViewProfile: (profile: DiscProfile) => void;
}

export const DiscDashboard: React.FC<DiscDashboardProps> = ({
  onStartAssessment,
  onViewProfile
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<DiscProfile[]>([]);
  const [gamification, setGamification] = useState<DiscGamification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfiles();
  }, [user]);

  const loadUserProfiles = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const userProfiles = await discService.getUserProfiles(user.id);
      setProfiles(userProfiles);

      if (userProfiles.length > 0) {
        const latestProfile = userProfiles[0];
        const gamificationData = discService.generateGamificationData(latestProfile);
        setGamification(gamificationData);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os perfis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStyleColor = (style: string) => {
    const colors = {
      D: 'bg-red-500 text-white',
      I: 'bg-yellow-500 text-white',
      S: 'bg-green-500 text-white',
      C: 'bg-blue-500 text-white'
    };
    return colors[style as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const getStyleName = (style: string) => {
    const names = {
      D: 'Dominante',
      I: 'Influente',
      S: 'Estável',
      C: 'Consciencioso'
    };
    return names[style as keyof typeof names] || style;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Análise DISC
          </h1>
          <p className="text-muted-foreground">
            Descubra e desenvolva seu perfil comportamental
          </p>
        </div>
        <Button onClick={onStartAssessment} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Nova Análise
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Análises Realizadas</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profiles.length}</div>
            <p className="text-xs text-muted-foreground">
              {profiles.length > 0 ? 'Evolução mapeada' : 'Comece sua jornada'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfil Atual</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profiles.length > 0 ? profiles[0].primary_style : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              {profiles.length > 0 ? getStyleName(profiles[0].primary_style) : 'Realize uma análise'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nível</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gamification?.level || 0}</div>
            <p className="text-xs text-muted-foreground">
              {gamification?.experience_points || 0} XP
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges</CardTitle>
            <Star className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gamification?.badges.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Conquistas desbloqueadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gamification Panel */}
      {gamification && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-600" />
              Progresso e Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Nível {gamification.level}</span>
                <span className="text-sm text-muted-foreground">
                  {gamification.experience_points} / {(gamification.level + 1) * 100} XP
                </span>
              </div>
              <Progress 
                value={(gamification.experience_points / ((gamification.level + 1) * 100)) * 100} 
                className="h-2"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {gamification.badges.map((badge) => (
                <Badge key={badge.id} className={`${badge.color === 'purple' ? 'bg-purple-500' : `bg-${badge.color}-500`} text-white`}>
                  <Star className="h-3 w-3 mr-1" />
                  {badge.name}
                </Badge>
              ))}
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              {gamification.achievements.map((achievement) => (
                <div key={achievement.id} className="p-3 bg-white border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{achievement.title}</span>
                    <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                      {achievement.points} XP
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  <Progress 
                    value={(achievement.progress / achievement.max_progress) * 100} 
                    className="h-1"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Profiles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Histórico de Análises
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profiles.length > 0 ? (
            <div className="space-y-3">
              {profiles.slice(0, 5).map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${getStyleColor(profile.primary_style)} flex items-center justify-center font-bold`}>
                      {profile.primary_style}
                    </div>
                    <div>
                      <div className="font-medium">
                        Perfil {getStyleName(profile.primary_style)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(profile.completed_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onViewProfile(profile)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma análise realizada</h3>
              <p className="text-muted-foreground mb-4">
                Comece sua jornada de autoconhecimento com uma análise DISC
              </p>
              <Button onClick={onStartAssessment}>
                <Plus className="h-4 w-4 mr-2" />
                Realizar Primeira Análise
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Button variant="outline" className="justify-start h-auto p-4">
              <Brain className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Análise Comparativa</div>
                <div className="text-sm text-muted-foreground">
                  Compare diferentes períodos
                </div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <TrendingUp className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Plano de Desenvolvimento</div>
                <div className="text-sm text-muted-foreground">
                  Baseado no seu perfil
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
