import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function TermosUso() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
      <SEO 
        title="Termos de Uso | Rancho Branco" 
        description="Conheça os termos de uso do site do Rancho Branco e as condições de utilização dos nossos serviços online."
        canonical="https://ranchobranco.com.br/termos-de-uso"
      />
      <h1 className="text-4xl md:text-5xl font-serif text-primary mb-8">Termos de Uso</h1>
      <div className="prose prose-lg text-on-surface-variant font-light max-w-none">
        <p className="mb-8">Última atualização: Abril de 2024</p>
        
        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">1. Aceitação dos Termos</h2>
        <p className="mb-6">Ao acessar e utilizar o site do Rancho Branco, você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve utilizar nosso site.</p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">2. Uso do Site</h2>
        <p className="mb-6">Você concorda em usar o site apenas para fins legais e de maneira que não infrinja os direitos de, restrinja ou iniba o uso e o aproveitamento do site por qualquer terceiro.</p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">3. Propriedade Intelectual</h2>
        <p className="mb-6">Todo o conteúdo presente neste site, incluindo textos, gráficos, logotipos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, é de propriedade do Rancho Branco ou de seus fornecedores de conteúdo e é protegido por leis de direitos autorais.</p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">4. Limitação de Responsabilidade</h2>
        <p className="mb-6">O Rancho Branco não será responsável por quaisquer danos diretos, indiretos, incidentais, consequenciais ou punitivos resultantes do seu acesso ou uso deste site. As informações fornecidas no site são para fins informativos gerais.</p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">5. Links para Sites de Terceiros</h2>
        <p className="mb-6">Nosso site pode conter links para sites de terceiros. Não temos controle sobre o conteúdo ou práticas de privacidade desses sites e não assumimos qualquer responsabilidade por eles.</p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">6. Modificações dos Termos</h2>
        <p className="mb-6">O Rancho Branco reserva-se o direito de revisar estes Termos de Uso a qualquer momento sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses Termos de Uso.</p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">7. Legislação Aplicável</h2>
        <p className="mb-6">Estes termos e condições são regidos e interpretados de acordo com as leis do Brasil, e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.</p>
      </div>
    </div>
  );
}
