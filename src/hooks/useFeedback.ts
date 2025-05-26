import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFeedbacks = async () => {
    if (!user) {
      console.log('Usuário não autenticado, limpando lista de feedbacks');
      setFeedbacks([]);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Buscando feedbacks para usuário:', user.id);
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('feedbacks')
        .select(`
          *,
          collaborator:collaborators(name, email)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro Supabase ao buscar feedbacks:', error);
        throw error;
      }
      
      console.log('Feedbacks carregados:', data?.length || 0);
      
      // Garantir que os dados estão no formato correto
      const formattedData = (data || []).map((item: any) => ({
        ...item,
        type: item.type as 'performance' | '360' | 'peer' | 'recognition' | 'improvement',
        status: item.status as 'sent' | 'pending' | 'completed',
        notification_method: item.notification_method as 'email' | 'notification' | 'both',
      }));
      
      setFeedbacks(formattedData);
    } catch (error) {
      console.error('Erro ao carregar feedbacks:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os feedbacks.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('useFeedback: useEffect executado, user.id:', user?.id);
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
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .insert([{
          ...feedbackData,
          user_id: user.id,
          from_user_id: user.id,
        }])
        .select(`
          *,
          collaborator:collaborators(name, email)
        `)
        .single();

      if (error) throw error;

      const formattedData = {
        ...data,
        type: data.type as 'performance' | '360' | 'peer' | 'recognition' | 'improvement',
        status: data.status as 'sent' | 'pending' | 'completed',
        notification_method: data.notification_method as 'email' | 'notification' | 'both',
      };

      setFeedbacks(prev => [formattedData, ...prev]);
      toast({
        title: "Sucesso",
        description: "Feedback enviado com sucesso."
      });
      
      return formattedData;
    } catch (error) {
      console.error('Erro ao criar feedback:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o feedback.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateFeedback = async (id: string, updates: Partial<Feedback>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select(`
          *,
          collaborator:collaborators(name, email)
        `)
        .single();

      if (error) throw error;

      const formattedData = {
        ...data,
        type: data.type as 'performance' | '360' | 'peer' | 'recognition' | 'improvement',
        status: data.status as 'sent' | 'pending' | 'completed',
        notification_method: data.notification_method as 'email' | 'notification' | 'both',
      };

      setFeedbacks(prev => 
        prev.map(f => f.id === id ? { ...f, ...formattedData } : f)
      );

      toast({
        title: "Sucesso",
        description: "Feedback atualizado com sucesso."
      });

      return formattedData;
    } catch (error) {
      console.error('Erro ao atualizar feedback:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o feedback.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    feedbacks,
    isLoading,
    createFeedback,
    updateFeedback,
    refetch: fetchFeedbacks
  };
};
