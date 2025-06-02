
-- Tabela de usuários de autenticação (se não existir)
CREATE TABLE IF NOT EXISTS auth_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de colaboradores
CREATE TABLE IF NOT EXISTS collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'vacation')),
  phone TEXT,
  location TEXT,
  skills TEXT[] DEFAULT '{}',
  join_date DATE DEFAULT CURRENT_DATE,
  hire_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de treinamentos
CREATE TABLE IF NOT EXISTS trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_hours INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de atividades do dashboard
CREATE TABLE IF NOT EXISTS dashboard_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de créditos do usuário
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  credits INTEGER DEFAULT 1000,
  used_credits INTEGER DEFAULT 0,
  last_reset DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de logs de segurança
CREATE TABLE IF NOT EXISTS security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas RLS (Row Level Security)
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para colaboradores
CREATE POLICY "Users can view their own collaborators" ON collaborators
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own collaborators" ON collaborators
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collaborators" ON collaborators
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collaborators" ON collaborators
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para treinamentos
CREATE POLICY "Users can view their own trainings" ON trainings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trainings" ON trainings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trainings" ON trainings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trainings" ON trainings
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para atividades
CREATE POLICY "Users can view their own activities" ON dashboard_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities" ON dashboard_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para créditos
CREATE POLICY "Users can view their own credits" ON user_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits" ON user_credits
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para logs de segurança
CREATE POLICY "Users can view their own security logs" ON security_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own security logs" ON security_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_department ON collaborators(department);
CREATE INDEX IF NOT EXISTS idx_collaborators_status ON collaborators(status);
CREATE INDEX IF NOT EXISTS idx_trainings_user_id ON trainings(user_id);
CREATE INDEX IF NOT EXISTS idx_trainings_status ON trainings(status);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON dashboard_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON dashboard_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at DESC);
