
import React from 'react';
import { Header } from '@/components/layout/Header';

export const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-12">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h1>Política de Privacidade</h1>
          <p className="lead">
            Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais.
          </p>

          <h2>1. Informações que Coletamos</h2>
          <p>
            Coletamos informações que você nos fornece diretamente, como quando você cria uma conta, 
            preenche formulários ou entra em contato conosco.
          </p>

          <h3>1.1 Informações Pessoais</h3>
          <ul>
            <li>Nome completo</li>
            <li>Endereço de email</li>
            <li>Informações de contato</li>
            <li>Dados profissionais</li>
          </ul>

          <h3>1.2 Informações de Uso</h3>
          <ul>
            <li>Logs de acesso</li>
            <li>Dados de navegação</li>
            <li>Informações do dispositivo</li>
            <li>Endereço IP</li>
          </ul>

          <h2>2. Como Usamos suas Informações</h2>
          <p>Utilizamos suas informações para:</p>
          <ul>
            <li>Fornecer e melhorar nossos serviços</li>
            <li>Processar suas solicitações</li>
            <li>Enviar comunicações importantes</li>
            <li>Personalizar sua experiência</li>
            <li>Garantir a segurança da plataforma</li>
          </ul>

          <h2>3. Compartilhamento de Informações</h2>
          <p>
            Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
            exceto nas seguintes circunstâncias:
          </p>
          <ul>
            <li>Com seu consentimento explícito</li>
            <li>Para cumprir obrigações legais</li>
            <li>Para proteger nossos direitos e segurança</li>
            <li>Com fornecedores de serviços essenciais</li>
          </ul>

          <h2>4. Segurança dos Dados</h2>
          <p>
            Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger 
            suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
          </p>

          <h2>5. Seus Direitos</h2>
          <p>Você tem o direito de:</p>
          <ul>
            <li>Acessar suas informações pessoais</li>
            <li>Corrigir dados incorretos</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Portabilidade dos dados</li>
            <li>Revogar consentimentos</li>
          </ul>

          <h2>6. Retenção de Dados</h2>
          <p>
            Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os 
            propósitos descritos nesta política ou conforme exigido por lei.
          </p>

          <h2>7. Cookies</h2>
          <p>
            Utilizamos cookies e tecnologias similares para melhorar sua experiência, 
            analisar o uso do site e personalizar conteúdo.
          </p>

          <h2>8. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta Política de Privacidade ocasionalmente. Notificaremos você 
            sobre mudanças significativas através do email ou da plataforma.
          </p>

          <h2>9. Contato</h2>
          <p>
            Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco:
          </p>
          <ul>
            <li>Email: privacy@rhsystem.com</li>
            <li>Telefone: (11) 9999-9999</li>
            <li>Endereço: Rua da Empresa, 123, São Paulo - SP</li>
          </ul>

          <p>
            <strong>Última atualização:</strong> Janeiro de 2024
          </p>
        </div>
      </div>
    </div>
  );
};
