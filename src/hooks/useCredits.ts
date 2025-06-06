
import { useState, useEffect, useCallback } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // First try to get from cache
      const cachedCredits = localStorage.getItem(`credits_${user.id}`);
      const cacheTimestamp = localStorage.getItem(`credits_timestamp_${user.id}`);
      const isRecentCache = cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 60000; // 1 minute

      if (cachedCredits && isRecentCache) {
        const parsedCredits = JSON.parse(cachedCredits);
        setCredits(parsedCredits);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116' || error.code === '42P01') {
          // Table doesn't exist or permission denied, use default
          const defaultCredits: UserCredits = {
            id: 'default',
            user_id: user.id,
            plan_type: 'trial',
            total_credits: 999999,
            used_credits: 0,
            remaining_credits: 999999,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setCredits(defaultCredits);
          localStorage.setItem(`credits_${user.id}`, JSON.stringify(defaultCredits));
          localStorage.setItem(`credits_timestamp_${user.id}`, Date.now().toString());
        } else if (error.code === 'PGRST406') {
          // No rows found, create default user credits
          try {
            const { error: insertError } = await supabase
              .from('user_credits')
              .insert({ 
                user_id: user.id, 
                plan_type: 'trial',
                total_credits: 999999,
                used_credits: 0,
                remaining_credits: 999999
              });

            if (!insertError) {
              const defaultCredits: UserCredits = {
                id: 'new',
                user_id: user.id,
                plan_type: 'trial',
                total_credits: 999999,
                used_credits: 0,
                remaining_credits: 999999,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              setCredits(defaultCredits);
              localStorage.setItem(`credits_${user.id}`, JSON.stringify(defaultCredits));
              localStorage.setItem(`credits_timestamp_${user.id}`, Date.now().toString());
            }
          } catch (insertErr) {
            console.log('Insert error:', insertErr);
            // Use default
            const defaultCredits: UserCredits = {
              id: 'fallback',
              user_id: user.id,
              plan_type: 'trial',
              total_credits: 999999,
              used_credits: 0,
              remaining_credits: 999999,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setCredits(defaultCredits);
            localStorage.setItem(`credits_${user.id}`, JSON.stringify(defaultCredits));
          }
        } else {
          throw error;
        }
      } else {
        setCredits(data);
        // Cache the result
        localStorage.setItem(`credits_${user.id}`, JSON.stringify(data));
        localStorage.setItem(`credits_timestamp_${user.id}`, Date.now().toString());
      }
    } catch (err) {
      console.error('Error fetching credits:', err);
      setError('Erro ao carregar créditos');
      // Use cached value if available
      const cachedCredits = localStorage.getItem(`credits_${user.id}`);
      if (cachedCredits) {
        setCredits(JSON.parse(cachedCredits));
      } else {
        const defaultCredits: UserCredits = {
          id: 'error-fallback',
          user_id: user.id,
          plan_type: 'trial',
          total_credits: 999999,
          used_credits: 0,
          remaining_credits: 999999,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setCredits(defaultCredits);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const addTransaction = useCallback(async (amount: number, type: string, description?: string) => {
    if (!user?.id || !credits) return false;

    try {
      // Update credits optimistically
      const newCredits = {
        ...credits,
        remaining_credits: credits.remaining_credits + amount,
        used_credits: credits.used_credits - amount
      };
      setCredits(newCredits);

      // Cache the new value immediately
      localStorage.setItem(`credits_${user.id}`, JSON.stringify(newCredits));
      localStorage.setItem(`credits_timestamp_${user.id}`, Date.now().toString());

      // Try to save to database
      const { error } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount,
          type,
          description
        });

      if (error) {
        console.log('Transaction save error:', error);
        // Save transaction to local storage as backup
        const transactionId = `transaction_${Date.now()}_${Math.random()}`;
        const transaction = {
          user_id: user.id,
          amount,
          type,
          description,
          created_at: new Date().toISOString(),
          synced: false
        };
        localStorage.setItem(transactionId, JSON.stringify(transaction));
      }

      return true;
    } catch (err) {
      console.error('Error adding transaction:', err);
      // Revert optimistic update
      setCredits(credits);
      localStorage.setItem(`credits_${user.id}`, JSON.stringify(credits));
      return false;
    }
  }, [user?.id, credits]);

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

      // Registrar usuário como admin na organização se não existir
      await supabase
        .from('organization_users')
        .upsert({
          user_id: user.id,
          admin_user_id: user.id,
          role: 'admin',
          status: 'active'
        }, {
          onConflict: 'user_id,admin_user_id'
        });

      await fetchCredits();

      toast({
        title: "Créditos atualizados",
        description: `Você agora tem ${newTotalCredits} créditos para cadastro de usuários`,
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

    if (credits.remaining_credits <= 0 && credits.plan_type !== 'trial') {
      toast({
        title: "Créditos esgotados",
        description: "Você não tem mais créditos disponíveis para cadastrar colaboradores",
        variant: "destructive",
      });
      return false;
    }

    try {
      const newRemainingCredits = credits.remaining_credits - 1;
      const newUsedCredits = credits.used_credits + 1;

      const { error } = await supabase
        .from('user_credits')
        .update({
          remaining_credits: newRemainingCredits,
          used_credits: newUsedCredits,
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
  }, [user?.id, fetchCredits]);

  return {
    credits,
    transactions,
    isLoading,
    updateCredits,
    useCredit,
    refetchCredits: fetchCredits,
    addTransaction,
    error,
  };
};
