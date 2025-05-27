
import { supabase } from '@/integrations/supabase/client';
import { RecentActivity } from '@/types/dashboard';

export const fetchRecentActivities = async (userId: string): Promise<RecentActivity[]> => {
  const { data: activities, error } = await supabase
    .from('system_activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  
  return activities || [];
};

export const logActivity = async (
  userId: string,
  type: string,
  description: string,
  entityType?: string,
  entityId?: string
): Promise<void> => {
  await supabase
    .from('system_activities')
    .insert([{
      type,
      description,
      entity_type: entityType,
      entity_id: entityId,
      user_id: userId
    }]);
};
