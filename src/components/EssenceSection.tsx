import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EssenceSection() {
  return (
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-32 items-center">
        <div className="space-y-8">
          <span className="inline-block bg-secondary-fixed text-on-secondary-fixed-variant px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            Nossa Essência
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary leading-tight">
            Um espaço para eventos com arquitetura que respira o campo.
          </h2>
          <p className="text-lg md:text-xl text-on-surface-variant font-light leading-relaxed">
            O Rancho Branco nasceu do desejo de harmonizar a grandiosidade da natureza com a sofisticação da arquitetura clássica. Cada detalhe, das vigas de madeira nobre ao mármore das varandas, foi pensado para emoldurar momentos que se tornam eternos. Aqui, o tempo desacelera para dar lugar à celebração.
          </p>
          <div className="pt-8">
            <Link 
              to="/galeria"
              className="inline-flex items-center gap-2 text-primary font-semibold border-b border-primary/20 pb-1 hover:border-primary transition-all group"
            >
              Conheça nossos espaços
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -top-8 -left-8 w-64 h-64 bg-secondary-fixed/30 rounded-full blur-3xl -z-10"></div>
          <img
            className="w-full h-auto rounded-xl shadow-ambient transform md:rotate-2 hover:rotate-0 transition-transform duration-700"
            alt="Deck de celebração do Rancho Branco com vista para a natureza"
            src="/deck-celebracao-rancho-branco.webp"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
