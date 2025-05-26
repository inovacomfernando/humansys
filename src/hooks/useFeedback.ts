
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';

export interface Feedback {
  id: string;
  from_user_id: string;
  to_collaborator_id: string;
  type: 'performance' | '360' | 'peer' | 'recognition' | 'improvement';
  subject: string;
  content: string;
  rating?: number;
  status: 'sent' | 'pending' | 'completed';
  anonymous: boolean;
  urgent: boolean;
  send_email: boolean;
  send_notification: boolean;
  notification_method: 'email' | 'notification' | 'both';
  created_at: string;
  collaborator?: {
    name: string;
    email: string;
  };
}

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { executeQuery } = useSupabaseQuery();

  const fetchFeedbacks = async () => {
    console.log('useFeedback: Iniciando fetchFeedbacks');
    console.log('useFeedback: User ID:', user?.id);

    if (!user?.id) {
      console.log('useFeedback: Usuário não autenticado, limpando feedbacks');
      setFeedbacks([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await executeQuery<Feedback[]>(
      () => supabase
        .from('feedbacks')
        .select(`
          *,
          collaborator:collaborators(name, email)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      { maxRetries: 3, requireAuth: true, timeout: 8000 }
    );

    if (result && Array.isArray(result)) {
      const formattedData: Feedback[] = result.map((item: any) => ({
        ...item,
        type: item.type as 'performance' | '360' | 'peer' | 'recognition' | 'improvement',
        status: item.status as 'sent' | 'pending' | 'completed',
        notification_method: item.notification_method as 'email' | 'notification' | 'both',
      }));
      
      setFeedbacks(formattedData);
      setError(null);
      console.log('useFeedback: Feedbacks carregados com sucesso:', formattedData.length);
    } else {
      setFeedbacks([]);
      setError('Falha ao carregar feedbacks');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    console.log('useFeedback: useEffect executado, user?.id:', user?.id);
    fetchFeedbacks();
  }, [user?.id]);

  const createFeedback = async (feedbackData: {
    to_collaborator_id: string;
    type: 'performance' | '360' | 'peer' | 'recognition' | 'improvement';
    subject: string;
    content: string;
    rating?: number;
    anonymous: boolean;
    urgent: boolean;
    send_email: boolean;
    send_notification: boolean;
    notification_method: 'email' | 'notification' | 'both';
  }) => {
    if (!user?.id) return;

    const dataToInsert = {
      ...feedbackData,
      user_id: user.id,
      from_user_id: user.id,
    };

    const result = await executeQuery(
      () => supabase
        .from('feedbacks')
        .insert([dataToInsert])
        .select(`
          *,
          collaborator:collaborators(name, email)
        `)
        .single(),
      { maxRetries: 2, requireAuth: true, timeout: 5000 }
    );

    if (result) {
      const typedResult = result as any;
      const formattedData: Feedback = {
        ...typedResult,
        type: typedResult.type as 'performance' | '360' | 'peer' | 'recognition' | 'improvement',
        status: typedResult.status as 'sent' | 'pending' | 'completed',
        notification_method: typedResult.notification_method as 'email' | 'notification' | 'both',
      };

      setFeedbacks(prev => [formattedData, ...prev]);
      toast({
        title: "Sucesso",
        description: "Feedback enviado com sucesso."
      });
      
      return formattedData;
    }
  };

  const updateFeedback = async (id: string, updates: Partial<Feedback>) => {
    if (!user?.id) return;

    const result = await executeQuery(
      () => supabase
        .from('feedbacks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select(`
          *,
          collaborator:collaborators(name, email)
        `)
        .single(),
      { maxRetries: 2, requireAuth: true, timeout: 5000 }
    );

    if (result) {
      const typedResult = result as any;
      const formattedData: Feedback = {
        ...typedResult,
        type: typedResult.type as 'performance' | '360' | 'peer' | 'recognition' | 'improvement',
        status: typedResult.status as 'sent' | 'pending' | 'completed',
        notification_method: typedResult.notification_method as 'email' | 'notification' | 'both',
      };

      setFeedbacks(prev => 
        prev.map(f => f.id === id ? { ...f, ...formattedData } : f)
      );

      toast({
        title: "Sucesso",
        description: "Feedback atualizado com sucesso."
      });

      return formattedData;
    }
  };

  return {
    feedbacks,
    isLoading,
    error,
    createFeedback,
    updateFeedback,
    refetch: fetchFeedbacks
  };
};
