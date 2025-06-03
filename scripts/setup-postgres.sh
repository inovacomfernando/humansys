
#!/bin/bash

echo "🗄️ Configurando PostgreSQL local..."

# Parar qualquer instância existente
pkill -f postgres || true

# Criar diretório de dados se não existir
mkdir -p /tmp/postgres-data

# Inicializar banco se necessário
if [ ! -f /tmp/postgres-data/PG_VERSION ]; then
    echo "Inicializando novo cluster PostgreSQL..."
    initdb -D /tmp/postgres-data
    
    # Configurar postgres.conf
    echo "port = 5432" >> /tmp/postgres-data/postgresql.conf
    echo "listen_addresses = 'localhost'" >> /tmp/postgres-data/postgresql.conf
    echo "max_connections = 100" >> /tmp/postgres-data/postgresql.conf
    
    # Configurar pg_hba.conf para permitir conexões locais
    echo "local   all             all                                     trust" > /tmp/postgres-data/pg_hba.conf
    echo "host    all             all             127.0.0.1/32            trust" >> /tmp/postgres-data/pg_hba.conf
    echo "host    all             all             ::1/128                 trust" >> /tmp/postgres-data/pg_hba.conf
fi

# Iniciar PostgreSQL
echo "Iniciando PostgreSQL..."
postgres -D /tmp/postgres-data &
POSTGRES_PID=$!

# Aguardar PostgreSQL iniciar
sleep 3

# Verificar se PostgreSQL está rodando
if ! pg_isready -h localhost -p 5432; then
    echo "❌ Falha ao iniciar PostgreSQL"
    exit 1
fi

echo "✅ PostgreSQL iniciado com sucesso (PID: $POSTGRES_PID)"

# Criar banco de dados se não existir
if ! psql -h localhost -p 5432 -U postgres -lqt | cut -d \| -f 1 | grep -qw humansys; then
    echo "Criando banco de dados humansys..."
    createdb -h localhost -p 5432 -U postgres humansys
fi

# Executar script de inicialização
if [ -f "scripts/init-db.sql" ]; then
    echo "Executando script de inicialização do banco..."
    psql -h localhost -p 5432 -U postgres -d humansys -f scripts/init-db.sql
fi

echo "🎉 Configuração do PostgreSQL concluída!"
echo "Conexão: postgresql://postgres@localhost:5432/humansys"
