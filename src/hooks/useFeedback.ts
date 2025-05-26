
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
    if (!user?.id) {
      console.log('useFeedback: Usuário não autenticado, limpando lista de feedbacks');
      setFeedbacks([]);
      setIsLoading(false);
      return;
    }

    try {
      console.log('useFeedback: Buscando feedbacks para usuário:', user.id);
      setIsLoading(true);
      
      // Verificar autenticação Supabase
      const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !supabaseUser) {
        console.error('useFeedback: Erro de autenticação Supabase:', authError);
        throw new Error('Usuário não autenticado no Supabase');
      }
      
      console.log('useFeedback: Usuário autenticado no Supabase:', supabaseUser.id);
      
      const { data, error } = await supabase
        .from('feedbacks')
        .select(`
          *,
          collaborator:collaborators(name, email)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useFeedback: Erro Supabase ao buscar feedbacks:', {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      console.log('useFeedback: Query de feedbacks executada com sucesso');
      console.log('useFeedback: Feedbacks carregados:', data?.length || 0);
      
      // Garantir que os dados estão no formato correto
      const formattedData = (data || []).map((item: any) => ({
        ...item,
        type: item.type as 'performance' | '360' | 'peer' | 'recognition' | 'improvement',
        status: item.status as 'sent' | 'pending' | 'completed',
        notification_method: item.notification_method as 'email' | 'notification' | 'both',
      }));
      
      setFeedbacks(formattedData);
      console.log('useFeedback: Estado de feedbacks atualizado com', formattedData.length, 'feedbacks');
      
    } catch (error: any) {
      console.error('useFeedback: Erro completo ao carregar feedbacks:', {
        error,
        message: error?.message,
        stack: error?.stack,
        userId: user.id
      });
      
      toast({
        title: "Erro ao carregar feedbacks",
        description: error?.message || "Não foi possível carregar os feedbacks.",
        variant: "destructive"
      });
      
      setFeedbacks([]);
    } finally {
      setIsLoading(false);
      console.log('useFeedback: Processo de carregamento finalizado');
    }
  };

  useEffect(() => {
    console.log('useFeedback: useEffect executado');
    console.log('useFeedback: user?.id:', user?.id);
    
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
    if (!user?.id) {
      console.warn('useFeedback: Tentativa de criar feedback sem autenticação');
      return;
    }

    try {
      console.log('useFeedback: Criando feedback para usuário:', user.id);
      console.log('useFeedback: Dados do feedback:', feedbackData);
      
      const dataToInsert = {
        ...feedbackData,
        user_id: user.id,
        from_user_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('feedbacks')
        .insert([dataToInsert])
        .select(`
          *,
          collaborator:collaborators(name, email)
        `)
        .single();

      if (error) {
        console.error('useFeedback: Erro ao criar feedback:', {
          error,
          message: error.message,
          details: error.details
        });
        throw error;
      }

      console.log('useFeedback: Feedback criado com sucesso:', data);

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
    } catch (error: any) {
      console.error('useFeedback: Erro completo ao criar feedback:', {
        error,
        message: error?.message,
        stack: error?.stack
      });
      
      toast({
        title: "Erro",
        description: error?.message || "Não foi possível enviar o feedback.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateFeedback = async (id: string, updates: Partial<Feedback>) => {
    if (!user?.id) {
      console.warn('useFeedback: Tentativa de atualizar feedback sem autenticação');
      return;
    }

    try {
      console.log('useFeedback: Atualizando feedback:', id);
      
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

      if (error) {
        console.error('useFeedback: Erro ao atualizar feedback:', error);
        throw error;
      }

      console.log('useFeedback: Feedback atualizado com sucesso:', data);

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
    } catch (error: any) {
      console.error('useFeedback: Erro ao atualizar feedback:', error);
      toast({
        title: "Erro",
        description: error?.message || "Não foi possível atualizar o feedback.",
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
