
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'milestone' | 'speed' | 'quality' | 'engagement' | 'goal' | 'training';
  criteria: {
    type: 'goals_completed' | 'training_finished' | 'feedback_received' | 'perfect_score' | 'help_others' | 'streak_days';
    value: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  id: string;
  badge_id: string;
  user_id: string;
  earned_at: string;
  progress?: number;
}

export interface GamificationStats {
  totalPoints: number;
  totalBadges: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  level: number;
  nextLevelProgress: number;
  recentAchievements: UserAchievement[];
}

export interface LeaderboardEntry {
  user_id: string;
  name: string;
  avatar_url?: string;
  points: number;
  badges_count: number;
  rank: number;
  department?: string;
}

export interface GoalProgress {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  progress_percentage: number;
  due_date: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  milestones: GoalMilestone[];
}

export interface GoalMilestone {
  id: string;
  title: string;
  target_value: number;
  completed: boolean;
  completed_at?: string;
}
