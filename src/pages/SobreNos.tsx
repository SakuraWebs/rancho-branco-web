import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function SobreNos() {
  return (
    <>
      <SEO 
        title="Nossa História | Rancho Branco - Tradição e Elegância no Campo" 
        description="Conheça a trajetória do Rancho Branco em Santana do Livramento. Uma propriedade centenária transformada no espaço de eventos mais charmoso da Campanha Gaúcha."
        canonical="https://ranchobranco.com.br/sobre-nos"
      />
      {/* Hero Section */}
      <header className="relative h-[60vh] flex items-center justify-center pt-24">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover brightness-[0.6]"
            alt="Beautiful landscape of Rancho Branco"
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <span className="text-white/80 font-bold tracking-[0.3em] text-xs uppercase mb-6 block">Nossa História</span>
          <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tighter mb-6 leading-tight">
            Sobre Nós
          </h1>
          <p className="text-xl text-white/90 font-light max-w-2xl mx-auto">
            Tradição, natureza e um compromisso inabalável com a criação de memórias eternas.
          </p>
        </div>
      </header>

      {/* Content Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-surface">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Text Column */}
          <div className="lg:col-span-7">
            <h2 className="text-3xl md:text-5xl font-serif text-primary mb-6 leading-tight">
              A História do Rancho Branco: Onde o tempo desacelera.
            </h2>
            <h3 className="text-xl md:text-2xl text-primary/80 font-serif italic mb-8">
              "De nossa família para a sua: o espaço para eventos mais charmoso da Campanha Gaúcha abre suas portas."
            </h3>

            <div className="space-y-8 text-lg text-on-surface-variant font-light leading-relaxed">
              <p>
                O Rancho Branco não é apenas um espaço para eventos; é um refúgio idealizado para celebrar a vida em sua forma mais pura. Nascido do amor pela terra e pela arquitetura clássica, nossa propriedade foi cuidadosamente desenhada para integrar a sofisticação ao ambiente natural. Cada árvore plantada, cada pedra colocada e cada salão erguido carrega a nossa missão: oferecer um cenário impecável onde as suas histórias mais importantes possam ser vividas e lembradas para sempre.
              </p>

              <div>
                <h4 className="text-primary font-serif text-2xl mb-3">Raízes Profundas em Santana do Livramento</h4>
                <p>
                  O Rancho Branco não nasceu como um local de eventos; ele nasceu e permanece sendo um lar. Localizado no histórico Cerro do Armour, em Santana do Livramento, esta propriedade centenária carrega em suas paredes de pedra e em seu madeiramento original as memórias vivas de gerações. Para Olga, este solo é sagrado: foi aqui, na casa de seus pais, que ela cresceu, vendo a vida florescer sob as mesmas árvores que hoje adornam os jardins.
                </p>
              </div>

              <div>
                <h4 className="text-primary font-serif text-2xl mb-3">Arquitetura Clássica e Preservação Histórica</h4>
                <p>
                  A arquitetura da nossa sede remonta ao período colonial, evocando a estética atemporal das estâncias europeias. Cada detalhe foi preservado com cuidado meticuloso: das paredes brancas texturizadas abraçadas pela hera madura até o nosso icônico brasão em azulejaria. Não somos um espaço comercial padronizado; somos uma propriedade rural autêntica que mantém o charme rústico inconfundível.
                </p>
              </div>

              <div>
                <h4 className="text-primary font-serif text-2xl mb-3">Um Convite para o seu Casamento ou Evento</h4>
                <p>
                  Recentemente, decidimos que uma energia tão única — uma energia que acolhe e abraça cada visitante — merecia ser compartilhada. Abrimos as portas do Rancho Branco para que ele se torne o cenário dos seus novos inícios. Seja em uma cerimônia grandiosa no campo aberto ou em um jantar íntimo sob a copa das árvores do nosso bosque, o Rancho Branco é a "tela em branco" sofisticada para quem busca celebrar o amor com privacidade e alma.
                </p>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="relative rounded-2xl overflow-hidden shadow-ambient">
              <img
                className="w-full h-auto object-cover"
                alt="Olga e seu filho Enzo, responsáveis pelo Rancho Branco"
                src="/sobre-nos-olga-enzo.webp"
              />
            </div>
            <div className="mt-6 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm">
              <p className="font-serif text-primary text-lg italic text-center">
                "Na foto, Olga e seu filho, Enzo, representam a alma deste lugar."
              </p>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="max-w-sm mx-auto mt-24 rounded-3xl overflow-hidden shadow-ambient border border-outline-variant/20 relative aspect-[9/16] bg-black">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/gLvJN3JXyDU"
            title="Rancho Branco Tour"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>

        <div className="mt-24 text-center">
          <Link to="/orcamento" className="satin-button text-on-primary px-10 py-5 rounded-full font-label text-lg font-semibold shadow-ambient hover:scale-105 transition-transform inline-block">
            Venha nos Conhecer
          </Link>
        </div>
      </section>
    </>
  );
}
