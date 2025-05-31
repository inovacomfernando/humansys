
export interface UserCredits {
  id: string;
  user_id: string;
  plan_type: 'inicial' | 'crescimento' | 'profissional' | 'trial';
  total_credits: number;
  used_credits: number;
  remaining_credits: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  type: 'used' | 'added' | 'reset';
  amount: number;
  description: string;
  created_at: string;
}

export const PLAN_CREDITS = {
  inicial: 10,
  crescimento: 50,
  profissional: 500,
  trial: 999999 // Ilimitado para teste
};
