
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserCredits, CreditTransaction, PLAN_CREDITS } from '@/types/credits';
import { useToast } from '@/hooks/use-toast';

export const useCredits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);

  const fetchCredits = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      // Buscar créditos do usuário
      const { data: creditsData, error: creditsError } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (creditsError && creditsError.code !== 'PGRST116') {
        throw creditsError;
      }

      if (!creditsData) {
        // Criar registro inicial com plano trial
        const newCredits = {
          user_id: user.id,
          plan_type: 'trial' as const,
          total_credits: PLAN_CREDITS.trial,
          used_credits: 0,
          remaining_credits: PLAN_CREDITS.trial
        };

        const { data: insertedCredits, error: insertError } = await supabase
          .from('user_credits')
          .insert([newCredits])
          .select()
          .single();

        if (insertError) throw insertError;
        setCredits(insertedCredits);
      } else {
        setCredits(creditsData);
      }

      // Buscar histórico de transações
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
      } else {
        setTransactions(transactionsData || []);
      }

    } catch (error) {
      console.error('Error fetching credits:', error);
      toast({
        title: "Erro ao buscar créditos",
        description: "Não foi possível carregar informações de créditos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCredits = async (planType: 'inicial' | 'crescimento' | 'profissional') => {
    if (!user?.id) return false;

    try {
      const newTotalCredits = PLAN_CREDITS[planType];
      
      const { error } = await supabase
        .from('user_credits')
        .update({
          plan_type: planType,
          total_credits: newTotalCredits,
          remaining_credits: newTotalCredits,
          used_credits: 0,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Registrar transação
      await supabase
        .from('credit_transactions')
        .insert([{
          user_id: user.id,
          type: 'reset',
          amount: newTotalCredits,
          description: `Plano alterado para ${planType} - ${newTotalCredits} créditos`
        }]);

      await fetchCredits();
      
      toast({
        title: "Créditos atualizados",
        description: `Você agora tem ${newTotalCredits} créditos para cadastro de colaboradores`,
      });

      return true;
    } catch (error) {
      console.error('Error updating credits:', error);
      toast({
        title: "Erro ao atualizar créditos",
        description: "Não foi possível atualizar seus créditos",
        variant: "destructive",
      });
      return false;
    }
  };

  const useCredit = async (description: string = 'Cadastro de colaborador') => {
    if (!user?.id || !credits) return false;

    if (credits.remaining_credits <= 0) {
      toast({
        title: "Créditos esgotados",
        description: "Você não tem mais créditos disponíveis para cadastrar colaboradores",
        variant: "destructive",
      });
      return false;
    }

    try {
      const newUsedCredits = credits.used_credits + 1;
      const newRemainingCredits = credits.remaining_credits - 1;

      const { error } = await supabase
        .from('user_credits')
        .update({
          used_credits: newUsedCredits,
          remaining_credits: newRemainingCredits,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Registrar transação
      await supabase
        .from('credit_transactions')
        .insert([{
          user_id: user.id,
          type: 'used',
          amount: 1,
          description
        }]);

      await fetchCredits();
      return true;
    } catch (error) {
      console.error('Error using credit:', error);
      toast({
        title: "Erro ao usar crédito",
        description: "Não foi possível processar o uso do crédito",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchCredits();
    }
  }, [user?.id]);

  return {
    credits,
    transactions,
    isLoading,
    updateCredits,
    useCredit,
    refetchCredits: fetchCredits
  };
};
