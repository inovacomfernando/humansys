
import { Training } from '@/types/training';

export const convertToTraining = (data: any): Training => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    duration: data.duration,
    instructor: data.instructor,
    status: data.status === 'inactive' ? 'inactive' : 'active',
    participants: data.participants || 0,
    user_id: data.user_id,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};
