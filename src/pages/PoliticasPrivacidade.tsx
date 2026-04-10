import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function PoliticasPrivacidade() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
      <SEO 
        title="Políticas de Privacidade | Rancho Branco" 
        description="Leia as políticas de privacidade do Rancho Branco e saiba como protegemos seus dados pessoais de acordo com a LGPD."
        canonical="https://ranchobranco.com.br/politicas-de-privacidade"
      />
      <h1 className="text-4xl md:text-5xl font-serif text-primary mb-8">Políticas de Privacidade</h1>
      <div className="prose prose-lg text-on-surface-variant font-light max-w-none">
        <p className="mb-8">Última atualização: Abril de 2024</p>
        
        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">1. Introdução</h2>
        <p className="mb-6">O Rancho Branco valoriza a sua privacidade e está comprometido em proteger os seus dados pessoais. Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos suas informações quando você visita nosso site, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>
        
        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">2. Dados que Coletamos</h2>
        <p className="mb-4">Podemos coletar os seguintes dados pessoais:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Dados de Contato:</strong> Nome, e-mail, telefone, quando você preenche nossos formulários de orçamento ou contato.</li>
          <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador, páginas visitadas e tempo gasto em nosso site, coletados através de cookies.</li>
        </ul>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">3. Uso dos Dados</h2>
        <p className="mb-4">Utilizamos seus dados para:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Responder a solicitações de orçamento e mensagens.</li>
          <li>Melhorar a experiência de navegação em nosso site.</li>
          <li>Enviar comunicações sobre nossos serviços, caso você tenha consentido.</li>
          <li>Cumprir obrigações legais.</li>
        </ul>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">4. Compartilhamento de Dados</h2>
        <p className="mb-6">Não vendemos ou alugamos seus dados pessoais. Podemos compartilhar informações com prestadores de serviços de tecnologia que nos auxiliam a operar o site, sempre sob rigorosos acordos de confidencialidade.</p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">5. Seus Direitos (LGPD)</h2>
        <p className="mb-4">Você tem o direito de:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Confirmar a existência de tratamento de dados.</li>
          <li>Acessar seus dados.</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
          <li>Solicitar a exclusão de seus dados.</li>
          <li>Revogar o consentimento a qualquer momento.</li>
        </ul>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">6. Contato</h2>
        <p className="mb-6">Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato conosco através do e-mail: <strong>contato@ranchobranco.com.br</strong>.</p>
      </div>
    </div>
  );
}
