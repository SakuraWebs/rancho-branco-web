import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, MapPin, Wine, Utensils, Phone, ArrowRight, Award, Sparkles, Share2, Star, ChevronLeft, ChevronRight, X } from 'lucide-react';
import SEO from '../components/SEO';

export default function SegundoTerroirTradicao() {
  const [searchParams] = useSearchParams();
  const carousel2Ref = React.useRef<HTMLDivElement>(null);
  const carousel1Ref = React.useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [activeGallery, setActiveGallery] = React.useState<'2edicao' | '1edicao' | 'experiencia' | null>(null);

  const gallery2Edicao = [
    { type: 'video', src: '/apresentacao-lirica-ao-vivo-deck-rancho-branco.mp4', alt: 'Apresentação lírica de Getúlio Vares no deck' },
    { type: 'image', src: '/carlos-lukes-sommelier-caves-do-pampa-rancho-branco.jpeg', alt: 'Carlos Lukes sommelier Caves do Pampa' },
    { type: 'image', src: '/mesa-gastronomica-recepcao-terroir-e-tradicao-rancho-branco.jpeg', alt: 'Mesa gastronômica completa' },
    { type: 'image', src: '/figos-com-roquefort-gastronomia-clenia-reis-rancho-branco.jpeg', alt: 'Figos recheados com roquefort' },
    { type: 'image', src: '/mesa-antepastos-buffet-sunset-primavera-rancho-branco.jpeg', alt: 'Buffet de antepastos e flores' },
    { type: 'image', src: '/tartaletes-presunto-parma-alta-gastronomia-livramento.jpeg', alt: 'Tartaletes de presunto cru' },
    { type: 'image', src: '/mesa-degustacao-favo-mel-queijos-rancho-branco.jpeg', alt: 'Mesa com favo de mel puro e queijos' }
  ];

  const gallery1Edicao = [
    { type: 'image', src: '/convidados-almoco-harmonizado-vinhos-rancho-branco.jpeg', alt: 'Convidados no almoço harmonizado' },
    { type: 'image', src: '/degustacao-azeite-viridi-recepcao-eventos.jpeg', alt: 'Degustação azeite Viridi' },
    { type: 'image', src: '/chef-juliano-parrilla-fogo-de-chao-eventos.jpeg', alt: 'Chef Juliano na parrilla' },
    { type: 'video', src: '/apresentacao-violino-eventos-rancho-branco.mp4', alt: 'Apresentação violino eventos' },
    { type: 'image', src: '/selecao-vinhos-campanha-gaucha-caves-do-pampa.jpeg', alt: 'Seleção vinhos Campanha Gaúcha' },
    { type: 'image', src: '/decoracao-salao-rustico-casamentos-eventos.jpeg', alt: 'Decoração salão rústico' },
    { type: 'image', src: '/musica-ao-vivo-eventos-acusticos-fronteira.jpeg', alt: 'Música ao vivo acústico' },
    { type: 'image', src: '/fachada-iluminada-salao-rustico-rancho-branco.jpeg', alt: 'Fachada iluminada' }
  ];

  const experienciaItems = [
    { src: "/clenia-reis-gastronomia-2-terroir-tradicao.jpg", alt: "Clenia Reis (Gastronomia & Eventos)" },
    { src: "/caves-do-pampa-vinhos-2-terroir-tradicao.jpg", alt: "Caves do Pampa" },
    { src: "/agencia-corticeiras-receptivo-2-terroir-tradicao.jpg", alt: "Agência Corticeiras (Turismo Receptivo)" }
  ];

  const currentGallery = activeGallery === '2edicao' 
    ? gallery2Edicao 
    : activeGallery === '1edicao' 
    ? gallery1Edicao 
    : experienciaItems;

  useEffect(() => {
    const mediaParam = searchParams.get('media');
    if (mediaParam) {
      const index2 = gallery2Edicao.findIndex(item => item.src === `/${mediaParam}`);
      if (index2 !== -1) {
        setActiveGallery('2edicao');
        setCurrentImageIndex(index2);
        setLightboxOpen(true);
        return;
      }
      const index1 = gallery1Edicao.findIndex(item => item.src === `/${mediaParam}`);
      if (index1 !== -1) {
        setActiveGallery('1edicao');
        setCurrentImageIndex(index1);
        setLightboxOpen(true);
        return;
      }
    }
  }, [searchParams]);

  const openLightbox = (index: number, gallery: '2edicao' | '1edicao' | 'experiencia') => {
    setActiveGallery(gallery);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setActiveGallery(null);
  };

  const prevLightboxItem = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? currentGallery.length - 1 : prev - 1));
  };

  const nextLightboxItem = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev === currentGallery.length - 1 ? 0 : prev + 1));
  };

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 336; // w-80 (320px) + gap-4 (16px)
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const whatsappUrl = "https://wa.me/5555999195460?text=Ol%C3%A1!%20Vi%20as%20fotos%20do%202%C2%BA%20Terroir%20e%20Tradi%C3%A7%C3%A3o%20e%20gostaria%20de%20solicitar%20um%20or%C3%A7amento.";

  return (
    <div className="bg-[#FCF3EA] text-[#13214D] min-h-screen font-sans">
      <SEO 
        title="2º Terroir & Tradição - Sunset de Primavera | Rancho Branco" 
        description="O 2º Terroir e Tradição (Sunset de Primavera) foi uma experiência enogastronômica inesquecível realizada em 17 de Outubro de 2026 no Rancho Branco. Relembre os melhores momentos com alta gastronomia por Clenia Reis e vinhos da Campanha Gaúcha pela Caves do Pampa."
        canonical="https://ranchobranco.com.br/eventos/2-terroir-e-tradicao"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": "Aftermovie 2º Terroir & Tradição - Sunset de Primavera",
            "description": "Vídeo oficial do evento enogastronômico de primavera no Rancho Branco, em Santana do Livramento/RS. Apresentando alta gastronomia por Clenia Reis, vinhos da Caves do Pampa e apresentação musical lírica de Getúlio Vares.",
            "uploadDate": "2026-10-18",
            "contentUrl": "https://ranchobranco.com.br/aftermovie-sunset-primavera-eventos-rancho-branco.mp4",
            "thumbnailUrl": "https://ranchobranco.com.br/convidados-almoco-harmonizado-vinhos-rancho-branco.jpeg"
          })
        }}
      />

      {/* Font imports for extreme elegance */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
        
        .font-cinzel {
          font-family: 'Cinzel', serif;
        }
        .font-greatvibes {
          font-family: 'Great Vibes', cursive;
        }
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      {/* Hero Section - Split Layout */}
      <section className="relative pt-36 pb-16 lg:pt-48 lg:pb-24 overflow-hidden border-b border-[#13214D]/5">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-radial-gradient from-[#FCF3EA] via-[#FCF3EA] to-[#eaddd0]/40 opacity-70 z-0" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Elegant Copy & Details */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 bg-[#a33845]/10 border border-[#a33845]/20 px-4 py-1.5 rounded-full"
                >
                  <Sparkles size={14} className="text-[#a33845]" />
                  <span className="text-[#a33845] font-cinzel text-xs font-bold tracking-widest uppercase">
                    2º Terroir & Tradição • Sunset de Primavera
                  </span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-4xl sm:text-5xl md:text-7xl font-cinzel text-[#13214D] font-bold tracking-tight leading-tight"
                >
                  2º Terroir <br />
                  <span className="text-[#a33845] font-greatvibes font-normal text-5xl sm:text-6xl md:text-8xl lowercase block -mt-2 -mb-2">
                    e
                  </span>
                  Tradição
                </motion.h1>
              </div>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-[#13214D]/80 font-playfair font-light leading-relaxed text-justify"
              >
                O 2º Terroir e Tradição (Sunset de Primavera) foi uma experiência enogastronômica inesquecível, que celebrou a alta gastronomia, os vinhos da Campanha Gaúcha e os grandes encontros da primavera. Sob a condução gastronômica de Clenia Reis, curadoria de rótulos da Caves do Pampa e acolhimento da Agência Corticeiras, vivemos uma tarde memorável no cenário do Rancho Branco.
              </motion.p>

              {/* Event Metadata Cards */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/40 flex items-start gap-3 shadow-sm">
                  <div className="p-2.5 bg-[#a33845]/10 text-[#a33845] rounded-xl">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-cinzel font-bold text-[#13214D]/55 block">Data &amp; Horário</span>
                    <span className="font-playfair text-base font-bold text-[#13214D]">17 de Outubro de 2026</span>
                    <span className="text-xs text-[#13214D]/70 block">Sábado, às 11h30</span>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/40 flex items-start gap-3 shadow-sm">
                  <div className="p-2.5 bg-[#a33845]/10 text-[#a33845] rounded-xl">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-cinzel font-bold text-[#13214D]/55 block">Localização</span>
                    <span className="font-playfair text-base font-bold text-[#13214D]">Rancho Branco</span>
                    <span className="text-xs text-[#13214D]/70 block">Santana do Livramento/RS</span>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/40 flex items-start gap-3 shadow-sm">
                  <div className="p-2.5 bg-[#a33845]/10 text-[#a33845] rounded-xl">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-cinzel font-bold text-[#13214D]/55 block">Formato</span>
                    <span className="font-playfair text-base font-bold text-[#13214D]">Sunset de Primavera</span>
                    <span className="text-xs text-[#13214D]/70 block">Experiência ao ar livre e salão</span>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/40 flex items-start gap-3 shadow-sm">
                  <div className="p-2.5 bg-[#BA8D49]/10 text-[#BA8D49] rounded-xl">
                    <Award size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-cinzel font-bold text-[#13214D]/55 block">Experiência</span>
                    <span className="font-playfair text-base font-bold text-[#13214D]">Alta Gastronomia &amp; Vinhos</span>
                    <span className="text-xs text-[#13214D]/70 block">Rótulos premiados e antepastos finos</span>
                  </div>
                </div>
              </motion.div>

              {/* Booking CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              >
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#a33845] hover:bg-[#4a121a] text-white px-8 py-4 rounded-full font-cinzel font-bold text-xs tracking-widest uppercase transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Phone size={16} /> Realize seu evento no Rancho Branco
                </a>
                <a 
                  href="#galeria"
                  className="bg-white hover:bg-[#f6e5d4] text-[#13214D] border border-[#13214D]/20 px-8 py-4 rounded-full font-cinzel font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                >
                  Ver Como Foi <ArrowRight size={14} />
                </a>
              </motion.div>
            </div>

            {/* Right Column: Main Invitation Poster */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative max-w-sm sm:max-w-md w-full bg-white p-4 rounded-3xl shadow-2xl border-4 border-[#FCF3EA] overflow-hidden"
              >
                {/* Decorative golden accent strip inside */}
                <div className="absolute inset-2 border border-[#BA8D49]/20 rounded-2xl pointer-events-none" />
                
                <img
                  src="/convite-2-terroir-tradicao-sunset-primavera.jpg"
                  alt="Convite 2º Terroir & Tradição - Sunset de Primavera no Rancho Branco"
                  className="w-full h-auto rounded-xl object-contain shadow-inner relative z-10 hover:scale-[1.01] transition-transform duration-500"
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Immersive Concept & Real Place Gallery */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[#a33845] font-cinzel text-xs font-bold tracking-widest uppercase block">
            O Cenário Perfeito
          </span>
          <h2 className="text-3xl md:text-5xl font-cinzel text-[#13214D] font-bold">
            Conexão, Natureza e Tradição
          </h2>
          <div className="w-16 h-[1.5px] bg-[#BA8D49] mx-auto" />
          <p className="font-playfair text-[#13214D]/80 text-lg leading-relaxed pt-2">
            O Rancho Branco não é apenas uma sede; é um recanto de paz, emoldurado por coxilhas, lagos e árvores nativas da fronteira gaúcha. Veja os espaços que preparamos para tornar o seu dia inesquecível.
          </p>
        </div>

        {/* Dynamic Bento Photo Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Panorama: Big Header Card */}
          <div className="md:col-span-8 group relative overflow-hidden rounded-3xl shadow-lg aspect-video md:aspect-[21/9]">
            <img 
              src="/rancho-branco-vista-panoramica-santana-do-livramento.jpeg" 
              alt="Vista Panorâmica do Rancho Branco em Santana do Livramento"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8">
              <span className="text-[#BA8D49] text-xs font-cinzel font-semibold tracking-wider uppercase">Sede Campestre</span>
              <h3 className="text-white text-xl md:text-3xl font-cinzel font-bold mt-1">Sinfonia Visual do Pampa Gaúcho</h3>
            </div>
          </div>

          {/* Side Card: Lakeside */}
          <div className="md:col-span-4 group relative overflow-hidden rounded-3xl shadow-lg aspect-square md:aspect-auto">
            <img 
              src="/vista-do-lago-e-natureza-rancho-branco.jpeg" 
              alt="Vista do lago e natureza exuberante do Rancho Branco"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <span className="text-[#BA8D49] text-xs font-cinzel font-semibold tracking-wider uppercase">Ambiente Natural</span>
              <h3 className="text-white text-lg font-cinzel font-bold mt-1">O Lago e a Brisa</h3>
            </div>
          </div>

          {/* Bottom Card 1: Garden seating */}
          <div className="md:col-span-4 group relative overflow-hidden rounded-3xl shadow-lg aspect-square">
            <img 
              src="/jardim-e-cenario-para-eventos-ao-ar-livre.jpeg" 
              alt="Jardins esculpidos para casamentos e eventos ao ar livre"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <span className="text-[#BA8D49] text-xs font-cinzel font-semibold tracking-wider uppercase">Recepção ao Ar Livre</span>
              <h3 className="text-white text-lg font-cinzel font-bold mt-1">Cenários Floridos e Acolhedores</h3>
            </div>
          </div>

          {/* Bottom Card 2: Lawn and pool landscape */}
          <div className="md:col-span-4 group relative overflow-hidden rounded-3xl shadow-lg aspect-square">
            <img 
              src="/rancho-branco-casa-de-eventos-area-externa.jpeg" 
              alt="Área externa com gramado e quiosques do Rancho Branco"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <span className="text-[#BA8D49] text-xs font-cinzel font-semibold tracking-wider uppercase">Arquitetura Integrada</span>
              <h3 className="text-white text-lg font-cinzel font-bold mt-1">Espaços Amplos para Convivência</h3>
            </div>
          </div>

          {/* Bottom Card 3: Wedding setup view */}
          <div className="md:col-span-4 group relative overflow-hidden rounded-3xl shadow-lg aspect-square">
            <img 
              src="/local-para-casamentos-e-cerimonias-na-fronteira.jpeg" 
              alt="Local rústico-chique de casamentos na fronteira do RS"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <span className="text-[#BA8D49] text-xs font-cinzel font-semibold tracking-wider uppercase">Casamentos e Festas</span>
              <h3 className="text-white text-lg font-cinzel font-bold mt-1">O Charme da Cerca de Madeira</h3>
            </div>
          </div>

        </div>
      </section>

      {/* Experiencia Section (Replaces Menu Steps) */}
      <section id="experiencia" className="py-24 px-6 md:px-12 lg:px-24 bg-white border-y border-[#13214D]/5 relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-cinzel text-[#13214D] font-bold">Os Pilares do Sunset de Primavera</h2>
            <div className="w-24 h-[1.5px] bg-[#BA8D49] mx-auto mt-6" />
            <p className="font-playfair text-lg text-[#13214D]/70 max-w-3xl mx-auto mt-4">
              Três marcas de excelência unidas no Rancho Branco para proporcionar um encontro com personalidade, categoria e história.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Pilares */}
            {[
              {
                title: "Clenia Reis",
                tag: "Gastronomia & Eventos",
                subtitle: "Alta gastronomia com elegância.",
                description: "Com anos de experiência em gastronomia e eventos, Clenia Reis assina uma culinária criativa que une clássicos à gastronomia moderna com total elegância. No 2º Terroir & Tradição, conduz a experiência gastronômica do encontro. Sabor e elegância à mesa.",
                img: experienciaItems[0].src,
                alt: experienciaItems[0].alt,
                icon: Utensils,
                index: 0
              },
              {
                title: "Caves do Pampa",
                tag: "Vinhos Finos",
                subtitle: "A casa dos vinhos da Campanha Gaúcha na internet.",
                description: "A Caves do Pampa conecta todo o Brasil aos vinhos da Campanha Gaúcha, com curadoria especializada e atendimento de excelência. No 2º Terroir & Tradição, assina a seleção dos rótulos que acompanham a experiência. Curadoria que aproxima o Brasil dos vinhos da Campanha.",
                img: experienciaItems[1].src,
                alt: experienciaItems[1].alt,
                icon: Wine,
                index: 1
              },
              {
                title: "Agência Corticeiras",
                tag: "Turismo Receptivo",
                subtitle: "Experiências no Pampa com acolhimento e conexão.",
                description: "A Agência Corticeiras é uma agência receptiva especializada em oferecer experiências no Pampa, na fronteira entre Sant'Ana do Livramento e Rivera. Com atenção aos detalhes e foco na experiência do cliente, é responsável pelas relações comerciais e pelo acolhimento do evento.",
                img: experienciaItems[2].src,
                alt: experienciaItems[2].alt,
                icon: MapPin,
                index: 2
              }
            ].map((pilar, idx) => {
              const Icon = pilar.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-[#FCF3EA]/50 rounded-3xl overflow-hidden border border-[#13214D]/5 shadow-sm group hover:shadow-md transition-all flex flex-col h-full"
                >
                  <div 
                    className="relative aspect-square cursor-pointer overflow-hidden"
                    onClick={() => openLightbox(pilar.index, 'experiencia')}
                  >
                    <img 
                      src={pilar.img} 
                      alt={pilar.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-[#13214D]/0 group-hover:bg-[#13214D]/10 transition-colors z-10 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-[#13214D] p-3 rounded-full backdrop-blur-sm shadow-lg">
                        <Sparkles size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[#a33845] font-cinzel text-[10px] font-bold tracking-widest uppercase bg-[#a33845]/10 px-3 py-1 rounded-full">
                        {pilar.tag}
                      </span>
                      <Icon size={20} className="text-[#13214D]/30" />
                    </div>
                    <h3 className="text-2xl font-cinzel font-bold text-[#13214D] mb-2">{pilar.title}</h3>
                    <p className="font-cinzel text-sm text-[#13214D]/60 font-semibold mb-4">{pilar.subtitle}</p>
                    <p className="font-playfair text-[#13214D]/80 leading-relaxed text-justify flex-1">
                      {pilar.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Aftermovie Oficial */}
      <section id="aftermovie" className="py-24 bg-white border-b border-[#13214D]/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <span className="text-[#a33845] font-cinzel text-xs font-bold tracking-widest uppercase block">
              O Filme do Evento
            </span>
            <h2 className="text-3xl md:text-4xl font-cinzel text-[#13214D] font-bold">
              A Atmosfera do Sunset
            </h2>
            <div className="w-16 h-[1.5px] bg-[#BA8D49] mx-auto" />
            <p className="font-playfair text-[#13214D]/80 text-lg leading-relaxed max-w-2xl mx-auto">
              Dê o play e sinta a energia do nosso encontro de primavera.
            </p>
          </motion.div>

          <div className="max-w-xs sm:max-w-sm mx-auto mt-12 overflow-hidden rounded-[2rem] shadow-2xl border-8 border-[#FCF3EA] bg-black relative z-10 aspect-[9/16] flex items-center justify-center">
            <video 
              src="/aftermovie-sunset-primavera-eventos-rancho-branco.mp4" 
              controls 
              playsInline 
              preload="metadata"
              className="w-full h-full object-cover rounded-[1.5rem]" 
            />
          </div>
        </div>
      </section>

      {/* Sistema de Galerias Históricas Duplas */}
      <section id="galeria" className="py-20 bg-[#FCF3EA] border-b border-[#13214D]/5">
        <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
          
          {/* Bloco 1: 2º Terroir & Tradição */}
          <div className="space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4 px-6"
            >
              <span className="text-[#a33845] font-cinzel text-xs font-bold tracking-widest uppercase block">Galeria</span>
              <h2 className="text-3xl md:text-5xl font-cinzel text-[#13214D] font-bold">Como foi o 2º Terroir &amp; Tradição</h2>
              <div className="w-16 h-[1.5px] bg-[#BA8D49] mx-auto" />
              <p className="font-playfair text-[#13214D]/80 text-lg leading-relaxed max-w-2xl mx-auto">
                Reviva os melhores momentos do Sunset de Primavera, com a alta gastronomia de Clenia Reis, a seleção da Caves do Pampa e a marcante apresentação lírica de Getúlio Vares ao entardecer.
              </p>
            </motion.div>
            
            <div className="relative group px-2 sm:px-6">
              <button 
                onClick={() => scrollCarousel(carousel2Ref, 'left')}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-[#13214D] p-2 rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                aria-label="Anterior"
              >
                <ChevronLeft size={24} />
              </button>

              <motion.div 
                ref={carousel2Ref}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-6"
              >
                {gallery2Edicao.map((item, index) => (
                  <div 
                    key={index} 
                    className="snap-center shrink-0 w-80 h-96 relative cursor-pointer group rounded-lg overflow-hidden shadow-md"
                    onClick={() => openLightbox(index, '2edicao')}
                  >
                    <div className="absolute inset-0 bg-[#13214D]/0 group-hover:bg-[#13214D]/20 transition-colors z-10 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-[#13214D] p-3 rounded-full backdrop-blur-sm shadow-lg">
                        <Sparkles size={20} />
                      </div>
                    </div>
                    {item.type === 'image' ? (
                      <img src={item.src} alt={item.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <video src={item.src} autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                  </div>
                ))}
              </motion.div>

              <button 
                onClick={() => scrollCarousel(carousel2Ref, 'right')}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-[#13214D] p-2 rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                aria-label="Próximo"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Bloco 2: 1º Terroir & Tradição */}
          <div className="space-y-12 mt-20 md:mt-24 pt-16 border-t border-[#13214D]/10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-3 px-6"
            >
              <span className="text-[#BA8D49] font-cinzel text-xs font-bold tracking-widest uppercase block">Edição Histórica</span>
              <h3 className="text-2xl md:text-3xl font-cinzel text-[#13214D] font-bold">Relembre o 1º Terroir &amp; Tradição</h3>
              <div className="w-12 h-[1.5px] bg-[#BA8D49] mx-auto" />
              <p className="font-playfair text-[#13214D]/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                A edição de inverno que deu início à nossa jornada enogastronômica.
              </p>
            </motion.div>
            
            <div className="relative group px-2 sm:px-6">
              <button 
                onClick={() => scrollCarousel(carousel1Ref, 'left')}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-[#13214D] p-2 rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                aria-label="Anterior"
              >
                <ChevronLeft size={24} />
              </button>

              <motion.div 
                ref={carousel1Ref}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-6"
              >
                {gallery1Edicao.map((item, index) => (
                  <div 
                    key={index} 
                    className="snap-center shrink-0 w-80 h-96 relative cursor-pointer group rounded-lg overflow-hidden shadow-md"
                    onClick={() => openLightbox(index, '1edicao')}
                  >
                    <div className="absolute inset-0 bg-[#13214D]/0 group-hover:bg-[#13214D]/20 transition-colors z-10 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-[#13214D] p-3 rounded-full backdrop-blur-sm shadow-lg">
                        <Sparkles size={20} />
                      </div>
                    </div>
                    {item.type === 'image' ? (
                      <img src={item.src} alt={item.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <video src={item.src} autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                  </div>
                ))}
              </motion.div>

              <button 
                onClick={() => scrollCarousel(carousel1Ref, 'right')}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-[#13214D] p-2 rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                aria-label="Próximo"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Event Realization Block */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#FCF3EA] to-[#dfd1c3]/30 relative overflow-hidden">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-16 shadow-2xl border border-white relative overflow-hidden">
          
          {/* Elegant gold corner borders */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#BA8D49]/30 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#BA8D49]/30 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#BA8D49]/30 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#BA8D49]/30 rounded-br-xl pointer-events-none" />

          <div className="text-center space-y-6">
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl font-cinzel text-[#13214D] font-bold"
            >
              Realize Seu Evento no Rancho Branco
            </motion.h2>

            <p className="font-playfair text-lg text-[#13214D]/75 max-w-xl mx-auto">
              Transforme a sua comemoração ou encontro corporativo em um momento inesquecível em nosso recanto de paz, emoldurado pela natureza.
            </p>

            {/* Real WhatsApp Reservation Link */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4 pt-8 flex flex-col items-center"
            >
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#a33845] hover:bg-[#4a121a] text-white px-10 py-5 rounded-full font-cinzel font-bold text-xs tracking-widest uppercase transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Phone size={16} /> Solicitar Orçamento
              </a>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-16 px-6 md:px-12 bg-[#13214D] text-[#FCF3EA] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/1.1.jpeg')] bg-cover bg-center opacity-10" />
        <div className="max-w-3xl mx-auto relative z-10 text-center space-y-6">
          <h2 className="text-3xl font-cinzel font-bold mb-4">Como foi sua experiência?</h2>
          <p className="font-playfair text-lg opacity-80 mb-8 max-w-xl mx-auto">
            Gostaríamos muito de saber o que você achou do 2º Terroir e Tradição. O seu feedback nos ajuda a criar experiências cada vez mais incríveis.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/eventos/2-terroir-e-tradicao/feedback"
              className="w-full sm:w-auto bg-[#BA8D49] text-white px-8 py-4 rounded-full font-cinzel font-bold text-xs tracking-widest uppercase transition-all shadow-lg hover:bg-[#a07638] flex items-center justify-center gap-2"
            >
              <Star size={16} /> Deixar Meu Feedback
            </a>
            <a 
              href={`https://wa.me/?text=${encodeURIComponent('Olá! Gostaríamos de saber como foi sua experiência no 2º Terroir e Tradição. Por favor, deixe seu feedback neste link: https://ranchobranco.com.br/eventos/2-terroir-e-tradicao/feedback')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-transparent border border-[#BA8D49]/50 text-[#BA8D49] hover:bg-[#BA8D49]/10 px-8 py-4 rounded-full font-cinzel font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2"
              title="Compartilhar link de feedback no WhatsApp"
            >
              <Share2 size={16} /> Enviar via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox / Gallery Full Screen Modal */}
      {lightboxOpen && activeGallery && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md" onClick={closeLightbox}>
          {/* Close button */}
          <button 
            className="absolute top-6 right-6 z-50 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 p-3 rounded-full backdrop-blur-sm transition-all"
            onClick={closeLightbox}
            aria-label="Sair"
          >
            <X size={24} />
          </button>

          {/* Previous button */}
          <button 
            className="absolute left-4 md:left-8 z-50 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 p-4 rounded-full backdrop-blur-sm transition-all"
            onClick={prevLightboxItem}
            aria-label="Imagem Anterior"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Current Media */}
          <div className="w-full h-full p-4 md:p-12 flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl max-h-[85vh] flex items-center justify-center"
            >
              {currentGallery[currentImageIndex]?.type === 'video' ? (
                <video 
                  src={currentGallery[currentImageIndex].src} 
                  autoPlay 
                  controls
                  playsInline 
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <img 
                  src={currentGallery[currentImageIndex]?.src} 
                  alt={currentGallery[currentImageIndex]?.alt} 
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
              )}
            </motion.div>
            
            {/* Caption */}
            <div className="text-white/80 font-playfair mt-6 text-center max-w-2xl px-4 flex flex-col items-center">
              <p className="text-sm md:text-base">{currentGallery[currentImageIndex]?.alt}</p>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-xs opacity-50">{currentImageIndex + 1} / {currentGallery.length}</span>
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(`Olha que lindo o evento Terroir e Tradição no Rancho Branco: https://ranchobranco.com.br/eventos/2-terroir-e-tradicao?media=${currentGallery[currentImageIndex]?.src.replace('/', '')}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-full font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center gap-2"
                >
                  <Share2 size={14} /> WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Next button */}
          <button 
            className="absolute right-4 md:right-8 z-50 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 p-4 rounded-full backdrop-blur-sm transition-all"
            onClick={nextLightboxItem}
            aria-label="Próxima Imagem"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
}
