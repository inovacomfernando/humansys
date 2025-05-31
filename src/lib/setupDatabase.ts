import { supabase } from '@/integrations/supabase/client';

export const setupDatabase = async () => {
  try {
    console.log('Setting up database tables...');

    // Verificar se já existe configuração
    const { data: existingTables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    console.log('Existing tables:', existingTables);

    // Criar tabela de créditos se não existir
    const { error: creditsError } = await supabase.rpc('create_user_credits_table');
    if (creditsError && !creditsError.message.includes('already exists')) {
      console.log('Credits table creation result:', creditsError);
    }

    // Criar tabela de transações de créditos se não existir
    const { error: transactionsError } = await supabase.rpc('create_credit_transactions_table');
    if (transactionsError && !transactionsError.message.includes('already exists')) {
      console.log('Transactions table creation result:', transactionsError);
    }

    // Criar políticas de segurança
    await setupRLS();

    console.log('Database setup completed successfully');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
};

const setupRLS = async () => {
  try {
    // RLS para user_credits
    await supabase.rpc('setup_user_credits_rls');

    // RLS para credit_transactions
    await supabase.rpc('setup_credit_transactions_rls');

    console.log('RLS policies set up successfully');
  } catch (error) {
    console.log('RLS setup info:', error);
  }
};

// Função para criar tabelas via SQL
export const createTablesSQL = async () => {
  const sql = `
    -- Criar tabela user_credits se não existir
    CREATE TABLE IF NOT EXISTS user_credits (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      plan_type TEXT CHECK (plan_type IN ('trial', 'inicial', 'crescimento', 'profissional')) DEFAULT 'trial',
      total_credits INTEGER DEFAULT 999999,
      used_credits INTEGER DEFAULT 0,
      remaining_credits INTEGER DEFAULT 999999,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      UNIQUE(user_id)
    );

    -- Criar tabela credit_transactions se não existir
    CREATE TABLE IF NOT EXISTS credit_transactions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      type TEXT CHECK (type IN ('used', 'added', 'reset')) NOT NULL,
      amount INTEGER NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Criar função de update timestamp
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = timezone('utc'::text, now());
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Criar trigger para user_credits
    DROP TRIGGER IF EXISTS update_user_credits_updated_at ON user_credits;
    CREATE TRIGGER update_user_credits_updated_at 
      BEFORE UPDATE ON user_credits 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    -- Habilitar RLS
    ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
    ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

    -- Políticas RLS para user_credits
    DROP POLICY IF EXISTS "Users can view own credits" ON user_credits;
    CREATE POLICY "Users can view own credits" ON user_credits
      FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can update own credits" ON user_credits;
    CREATE POLICY "Users can update own credits" ON user_credits
      FOR UPDATE USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can insert own credits" ON user_credits;
    CREATE POLICY "Users can insert own credits" ON user_credits
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    -- Políticas RLS para credit_transactions
    DROP POLICY IF EXISTS "Users can view own transactions" ON credit_transactions;
    CREATE POLICY "Users can view own transactions" ON credit_transactions
      FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can insert own transactions" ON credit_transactions;
    CREATE POLICY "Users can insert own transactions" ON credit_transactions
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  `;

  const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
  if (error) {
    console.log('SQL execution info:', error);
  }

  return !error;
};

const createCreditTransactionsTable = async () => {
  try {
    console.log('Creating credit_transactions table...');
    const { data, error } = await supabase.rpc('create_credit_transactions_table');

    if (error) {
      console.log('Credits transactions table creation result:', error);
    } else {
      console.log('Credits transactions table created successfully');
    }
  } catch (error) {
    console.log('Transactions table creation result:', error);
  }
};

const createBusinessMetricsTable = async () => {
  try {
    console.log('Creating business_metrics table...');

    // Create business_metrics table
    const { error: tableError } = await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS business_metrics (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          company_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          mrr DECIMAL(12,2) DEFAULT 0,
          arr DECIMAL(12,2) DEFAULT 0,
          new_mrr DECIMAL(12,2) DEFAULT 0,
          expansion_mrr DECIMAL(12,2) DEFAULT 0,
          churned_mrr DECIMAL(12,2) DEFAULT 0,
          ltv DECIMAL(12,2) DEFAULT 0,
          cac DECIMAL(12,2) DEFAULT 0,
          churn_rate DECIMAL(5,2) DEFAULT 0,
          nrr DECIMAL(5,2) DEFAULT 0,
          burn_rate DECIMAL(12,2) DEFAULT 0,
          runway INTEGER DEFAULT 0,
          activation_rate DECIMAL(5,2) DEFAULT 0,
          trial_to_paid DECIMAL(5,2) DEFAULT 0,
          payback_period INTEGER DEFAULT 0,
          dau_mau DECIMAL(5,2) DEFAULT 0,
          support_tickets DECIMAL(5,2) DEFAULT 0,
          gross_margin DECIMAL(5,2) DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (tableError) {
      console.log('Business metrics table error:', tableError);
    } else {
      console.log('Business metrics table created successfully');
    }
  } catch (error) {
    console.log('Business metrics table creation error:', error);
  }
};

const createFounderGamificationTable = async () => {
  try {
    console.log('Creating founder_gamification table...');

    const { error: tableError } = await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS founder_gamification (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          founder_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          level INTEGER DEFAULT 1,
          xp INTEGER DEFAULT 0,
          next_level_xp INTEGER DEFAULT 1000,
          badges TEXT[] DEFAULT '{}',
          achievements JSONB DEFAULT '[]',
          leaderboard_position INTEGER DEFAULT 0,
          total_founders INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (tableError) {
      console.log('Founder gamification table error:', tableError);
    } else {
      console.log('Founder gamification table created successfully');
    }
  } catch (error) {
    console.log('Founder gamification table creation error:', error);
  }
};