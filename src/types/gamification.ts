
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'milestone' | 'speed' | 'quality' | 'engagement';
  criteria: {
    type: 'steps_completed' | 'time_to_complete' | 'perfect_score' | 'help_others';
    value: number;
  };
}

export interface Achievement {
  id: string;
  badge_id: string;
  user_id: string;
  earned_at: string;
  process_id?: string;
}

export interface OnboardingProgress {
  id: string;
  process_id: string;
  total_steps: number;
  completed_steps: number;
  progress_percentage: number;
  badges_earned: Badge[];
  current_streak: number;
  estimated_completion: string;
  gamification_score: number;
}

export interface GamificationStats {
  totalBadges: number;
  recentAchievements: Achievement[];
  leaderboardPosition: number;
  overallScore: number;
}
