
-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários (simulando auth.users do Supabase)
CREATE TABLE IF NOT EXISTS auth_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de colaboradores
CREATE TABLE IF NOT EXISTS collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth_users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'inactive', 'vacation')) DEFAULT 'active',
    phone TEXT,
    location TEXT,
    join_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, email)
);

-- Tabela de créditos do usuário
CREATE TABLE IF NOT EXISTS user_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth_users(id) ON DELETE CASCADE,
    plan_type TEXT CHECK (plan_type IN ('trial', 'inicial', 'crescimento', 'profissional')) DEFAULT 'trial',
    total_credits INTEGER DEFAULT 999999,
    used_credits INTEGER DEFAULT 0,
    remaining_credits INTEGER DEFAULT 999999,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Tabela de transações de crédito
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth_users(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('used', 'added', 'reset')) NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_status ON collaborators(status);
CREATE INDEX IF NOT EXISTS idx_collaborators_email ON collaborators(email);
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);

-- Inserir usuário de teste
INSERT INTO auth_users (id, email) VALUES 
('5b43d42f-f5e1-46bf-9a95-e6de48163a81', 'oriento.suporte@proton.me')
ON CONFLICT (email) DO NOTHING;

-- Inserir colaboradores de teste
INSERT INTO collaborators (user_id, name, email, role, department) VALUES 
('5b43d42f-f5e1-46bf-9a95-e6de48163a81', 'Amanda Motta', 'amanda.motta@company.com', 'Desenvolvedora', 'Tecnologia'),
('5b43d42f-f5e1-46bf-9a95-e6de48163a81', 'João Ramalho', 'joao.ramalho@company.com', 'Analista', 'Marketing')
ON CONFLICT (user_id, email) DO NOTHING;

-- Inserir créditos iniciais
INSERT INTO user_credits (user_id) VALUES 
('5b43d42f-f5e1-46bf-9a95-e6de48163a81')
ON CONFLICT (user_id) DO NOTHING;

NOTIFY pg_notify('tables_created', 'Todas as tabelas foram criadas com sucesso!');
