
#!/bin/bash

echo "🚀 Configurando PostgreSQL local no Replit..."

# Verificar se PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "Instalando PostgreSQL..."
    apt-get update
    apt-get install -y postgresql postgresql-contrib
fi

# Verificar se cluster já existe
if [ ! -d "/var/lib/postgresql/data" ]; then
    echo "Criando cluster PostgreSQL..."
    sudo -u postgres initdb -D /var/lib/postgresql/data
fi

# Iniciar PostgreSQL
echo "Iniciando PostgreSQL..."
sudo -u postgres pg_ctl -D /var/lib/postgresql/data -l /var/lib/postgresql/logfile start

# Aguardar PostgreSQL ficar pronto
sleep 2

# Verificar se banco existe
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw humansys_db; then
    echo "Criando banco de dados..."
    sudo -u postgres createdb humansys_db
fi

# Verificar se usuário existe
if ! sudo -u postgres psql -c "\du" | grep -q replit; then
    echo "Criando usuário..."
    sudo -u postgres createuser --superuser replit
    sudo -u postgres psql -c "ALTER USER replit PASSWORD 'humansys123';"
fi

# Criar tabelas se necessário
if [ -f "create-tables.sql" ]; then
    echo "Criando tabelas..."
    sudo -u postgres psql -d humansys_db -f create-tables.sql
fi

echo "✅ PostgreSQL configurado com sucesso!"
echo "📊 Banco: humansys_db"
echo "👤 Usuário: replit"
echo "🔑 Senha: humansys123"
echo "🔗 URL: postgresql://replit:humansys123@localhost:5432/humansys_db"
