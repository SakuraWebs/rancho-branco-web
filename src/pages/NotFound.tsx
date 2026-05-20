import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO 
        title="Página Não Encontrada | Rancho Branco" 
        description="A página que você está procurando não existe."
        noindex={true}
      />
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center pt-24 px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-serif text-primary mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-light text-on-surface mb-6">Página não encontrada</h2>
        <p className="text-on-surface-variant max-w-md mx-auto mb-10">
          A página que você tentou acessar não existe, foi movida ou não está mais disponível.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-colors shadow-ambient hover:shadow-lg"
        >
          <Home size={20} />
          Voltar para o Início
        </Link>
      </div>
    </>
  );
}
