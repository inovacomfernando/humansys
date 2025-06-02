
#!/bin/bash

echo "🚀 Configurando PostgreSQL local no Replit..."

# Instalar PostgreSQL
apt-get update
apt-get install -y postgresql postgresql-contrib

# Inicializar cluster PostgreSQL
sudo -u postgres initdb -D /var/lib/postgresql/data

# Iniciar serviço PostgreSQL
sudo -u postgres pg_ctl -D /var/lib/postgresql/data -l /var/lib/postgresql/logfile start

# Criar usuário e banco
sudo -u postgres createuser --superuser replit
sudo -u postgres createdb humansys_db

# Configurar senha para o usuário
sudo -u postgres psql -c "ALTER USER replit PASSWORD 'humansys123';"

echo "✅ PostgreSQL configurado com sucesso!"
echo "📊 Banco: humansys_db"
echo "👤 Usuário: replit"
echo "🔑 Senha: humansys123"
echo "🔗 URL: postgresql://replit:humansys123@localhost:5432/humansys_db"
