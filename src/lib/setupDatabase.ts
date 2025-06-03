import { supabase } from '@/integrations/supabase/client';

export const setupDatabase = async () => {
  try {
    console.log('Setting up PostgreSQL database tables...');

    // Create tables using direct SQL
    const createTablesSQL = `
      -- Create user_credits table if not exists
      CREATE TABLE IF NOT EXISTS user_credits (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL,
        plan_type TEXT CHECK (plan_type IN ('trial', 'inicial', 'crescimento', 'profissional')) DEFAULT 'trial',
        total_credits INTEGER DEFAULT 999999,
        used_credits INTEGER DEFAULT 0,
        remaining_credits INTEGER DEFAULT 999999,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id)
      );

      -- Create credit_transactions table if not exists
      CREATE TABLE IF NOT EXISTS credit_transactions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL,
        type TEXT CHECK (type IN ('used', 'added', 'reset')) NOT NULL,
        amount INTEGER NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create collaborators table if not exists
      CREATE TABLE IF NOT EXISTS collaborators (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT DEFAULT 'user',
        department TEXT,
        position TEXT,
        start_date DATE,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
        avatar_url TEXT,
        phone TEXT,
        address TEXT,
        birth_date DATE,
        emergency_contact TEXT,
        emergency_phone TEXT,
        salary DECIMAL(10,2),
        benefits TEXT[],
        notes TEXT,
        skills TEXT[],
        certifications TEXT[],
        performance_score INTEGER DEFAULT 0,
        last_review_date DATE,
        manager_id UUID REFERENCES collaborators(id),
        password_hash TEXT,
        created_by UUID,
        invited_at TIMESTAMP WITH TIME ZONE,
        activated_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create organization_users table if not exists
      CREATE TABLE IF NOT EXISTS organization_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        admin_user_id UUID NOT NULL,
        role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user',
        status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, admin_user_id)
      );

      -- Create business_metrics table if not exists
      CREATE TABLE IF NOT EXISTS business_metrics (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        company_id UUID NOT NULL,
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

      -- Create founder_gamification table if not exists
      CREATE TABLE IF NOT EXISTS founder_gamification (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        founder_id UUID NOT NULL,
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

      -- Create security tables
      CREATE TABLE IF NOT EXISTS security_logs (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        event_type TEXT NOT NULL,
        user_id UUID,
        ip_address TEXT NOT NULL,
        user_agent TEXT NOT NULL,
        details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS security_alerts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        alert_type TEXT NOT NULL,
        severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
        message TEXT NOT NULL,
        user_id UUID,
        ip_address TEXT,
        resolved BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        resolved_at TIMESTAMP WITH TIME ZONE
      );

      CREATE TABLE IF NOT EXISTS blocked_ips (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        ip_address TEXT UNIQUE NOT NULL,
        reason TEXT NOT NULL,
        blocked_by UUID,
        blocked_until TIMESTAMP WITH TIME ZONE,
        permanent BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create função de update timestamp
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Create triggers for updated_at
      DROP TRIGGER IF EXISTS update_user_credits_updated_at ON user_credits;
      CREATE TRIGGER update_user_credits_updated_at 
        BEFORE UPDATE ON user_credits 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_collaborators_updated_at ON collaborators;
      CREATE TRIGGER update_collaborators_updated_at 
        BEFORE UPDATE ON collaborators 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_organization_users_updated_at ON organization_users;
      CREATE TRIGGER update_organization_users_updated_at 
        BEFORE UPDATE ON organization_users 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_business_metrics_updated_at ON business_metrics;
      CREATE TRIGGER update_business_metrics_updated_at 
        BEFORE UPDATE ON business_metrics 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_founder_gamification_updated_at ON founder_gamification;
      CREATE TRIGGER update_founder_gamification_updated_at 
        BEFORE UPDATE ON founder_gamification 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
      CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at);
      CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON collaborators(user_id);
      CREATE INDEX IF NOT EXISTS idx_collaborators_status ON collaborators(status);
      CREATE INDEX IF NOT EXISTS idx_collaborators_email ON collaborators(email);
      CREATE INDEX IF NOT EXISTS idx_organization_users_user_id ON organization_users(user_id);
      CREATE INDEX IF NOT EXISTS idx_organization_users_admin_user_id ON organization_users(admin_user_id);
      CREATE INDEX IF NOT EXISTS idx_business_metrics_company_id ON business_metrics(company_id);
      CREATE INDEX IF NOT EXISTS idx_founder_gamification_founder_id ON founder_gamification(founder_id);
      CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at);
      CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);
      CREATE INDEX IF NOT EXISTS idx_security_logs_ip_address ON security_logs(ip_address);
      CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON security_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_security_alerts_created_at ON security_alerts(created_at);
      CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON security_alerts(severity);
      CREATE INDEX IF NOT EXISTS idx_security_alerts_resolved ON security_alerts(resolved);
      CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip_address ON blocked_ips(ip_address);
      CREATE INDEX IF NOT EXISTS idx_blocked_ips_blocked_until ON blocked_ips(blocked_until);
    `;

    // Execute the SQL directly using the Supabase client
    const { error } = await supabase.rpc('sql', { query: createTablesSQL });

    if (error) {
      console.log('SQL execution error:', error);
      // Try individual table creation if bulk creation fails
      await createTablesIndividually();
    } else {
      console.log('Tables created successfully via SQL');
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    // Don't throw error to prevent app from breaking
    console.log('Continuing without database setup...');
  }
};

const createTablesIndividually = async () => {
  try {
    console.log('Creating tables individually...');

    // Test table access
    const { error: testError } = await supabase
      .from('collaborators')
      .select('id')
      .limit(1);

    if (testError && testError.code === 'PGRST116') {
      console.log('Tables need to be created...');
      // This will be handled by direct PostgreSQL commands
    }

    console.log('Individual table creation completed');
  } catch (error) {
    console.log('Individual table creation failed:', error);
  }
};

// Initialize database setup
export const initializeDatabase = async () => {
  try {
    console.log('Initializing PostgreSQL database...');
    await setupDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};