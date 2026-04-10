import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Share2, X, Facebook, Twitter, Link as LinkIcon, MessageCircle, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SEO from '../components/SEO';

export default function Eventos() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentShareImage, setCurrentShareImage] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const photos = [
    "/eventos-carlos-eduardo-4.jpeg",
    "/eventos-carlos-eduardo-5.jpeg",
    "/eventos-carlos-eduardo-6.jpeg"
  ];

  const handleShareClick = (e: React.MouseEvent, photo: string) => {
    e.stopPropagation();
    setCurrentShareImage(photo);
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setCurrentShareImage(null);
  };

  const openViewer = (index: number) => {
    setCurrentIndex(index);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const copyToClipboard = () => {
    if (currentShareImage) {
      const shareUrl = window.location.origin + currentShareImage;
      navigator.clipboard.writeText(shareUrl);
      alert('Link copiado para a área de transferência!');
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <SEO 
        title="Espaço para Casamentos e Eventos em Santana do Livramento | Rancho Branco" 
        description="O Rancho Branco é o cenário perfeito para casamentos, festas de aniversário e eventos corporativos em Santana do Livramento. Sofisticação e natureza para sua celebração."
        canonical="https://ranchobranco.com.br/eventos"
      />
      {/* Hero Section */}
      <header className="relative h-[60vh] flex items-center justify-center pt-24">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover brightness-[0.6]"
            alt="Elegant event setup"
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <span className="text-white/80 font-bold tracking-[0.3em] text-xs uppercase mb-6 block">Momentos Únicos</span>
          <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tighter mb-6 leading-tight">
            Eventos Sociais
          </h1>
          <p className="text-xl text-white/90 font-light max-w-2xl mx-auto">
            Celebrações inesquecíveis que marcam épocas e reúnem pessoas queridas.
          </p>
        </div>
      </header>

      {/* Content Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-surface-container-low overflow-hidden">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-primary mb-8 leading-tight">
            A arte de receber bem.
          </h2>
          <p className="text-lg text-on-surface-variant font-light leading-relaxed">
            Seja um aniversário, bodas, formaturas ou confraternizações familiares, o Rancho Branco oferece espaços versáteis que se adaptam ao tamanho e ao estilo da sua celebração. Nossa arquitetura clássica serve como uma tela em branco para a sua criatividade.
          </p>
        </div>

        {/* Interactive Carousel */}
        <div className="relative max-w-7xl mx-auto group">
          <div 
            ref={carouselRef}
            className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {photos.map((photo, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex-none w-[85vw] md:w-[45vw] lg:w-[30vw] aspect-[4/5] md:aspect-[3/4] relative rounded-2xl overflow-hidden snap-center cursor-pointer group/item shadow-ambient"
                onClick={() => openViewer(index)}
              >
                <img
                  src={photo}
                  alt={`Event moment ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white scale-90 group-hover/item:scale-100 transition-transform">
                    <Maximize2 size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Carousel Controls */}
          <button 
            onClick={() => scrollCarousel('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md text-primary shadow-lg flex items-center justify-center hover:bg-white transition-all z-10 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scrollCarousel('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md text-primary shadow-lg flex items-center justify-center hover:bg-white transition-all z-10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            aria-label="Próximo"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* Video Gallery Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-primary mb-6">A Atmosfera do Rancho</h2>
            <p className="text-lg text-on-surface-variant font-light max-w-2xl mx-auto">
              Sinta a energia dos eventos realizados em nosso espaço através de pequenos recortes em vídeo.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "6Lk3T2rLJVg", "CgMj1qNJj0c", "-oD4xZhbkOI",
              "yk2yy3tAV0o", "DLQI6kOOyac", "gLvJN3JXyDU"
            ].map((id) => (
              <div key={id} className="rounded-3xl overflow-hidden shadow-ambient border border-outline-variant/20 relative aspect-[9/16] bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${id}`}
                  title="Rancho Branco Event Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore More Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-primary mb-12 text-center">Explore Mais</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Link to="/casamentos" className="relative group overflow-hidden rounded-2xl aspect-video block">
              <img src="/casamento-nara-leco-1.jpg" alt="Casamentos" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <h3 className="text-3xl font-serif text-white">Casamentos</h3>
              </div>
            </Link>
            <Link to="/sobre-nos" className="relative group overflow-hidden rounded-2xl aspect-video block">
              <img src="/sobre-nos-olga-enzo.webp" alt="Sobre Nós" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <h3 className="text-3xl font-serif text-white">Nossa História</h3>
              </div>
            </Link>
          </div>
          
          <div className="mt-24 text-center">
            <Link to="/orcamento" className="satin-button text-on-primary px-10 py-5 rounded-full font-label text-lg font-semibold shadow-ambient hover:scale-105 transition-transform inline-block">
              Planeje seu Evento
            </Link>
          </div>
        </div>
      </section>

      {/* Full Screen Image Viewer */}
      <AnimatePresence>
        {isViewerOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center"
          >
            <button 
              onClick={closeViewer}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 z-20"
            >
              <X size={32} />
            </button>

            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
              <motion.img
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                src={photos[currentIndex]}
                alt="Event Gallery Full View"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />

              {/* Navigation Arrows */}
              <button 
                onClick={prevImage}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4"
              >
                <ChevronLeft size={48} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4"
              >
                <ChevronRight size={48} />
              </button>

              {/* Share Button in Viewer */}
              <button 
                onClick={(e) => handleShareClick(e, photos[currentIndex])}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-2 transition-all border border-white/20"
              >
                <Share2 size={20} />
                <span className="text-sm font-medium">Compartilhar</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeShareModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
                <h3 className="font-serif text-2xl text-primary">Compartilhar</h3>
                <button onClick={closeShareModal} className="text-on-surface-variant hover:text-primary transition-colors" aria-label="Fechar modal de compartilhamento">
                  <X size={24} aria-hidden="true" />
                </button>
              </div>
              
              <div className="p-6">
                {currentShareImage && (
                  <div className="mb-6 rounded-xl overflow-hidden aspect-video">
                    <img src={currentShareImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="grid grid-cols-4 gap-4">
                  <a 
                    href={`https://api.whatsapp.com/send?text=Veja%20esta%20foto%20incr%C3%ADvel%20do%20Rancho%20Branco:%20${encodeURIComponent(window.location.origin + (currentShareImage || ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                      <MessageCircle size={24} />
                    </div>
                    <span className="text-xs font-medium text-on-surface-variant">WhatsApp</span>
                  </a>
                  
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + (currentShareImage || ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center group-hover:bg-[#1877F2] group-hover:text-white transition-colors">
                      <Facebook size={24} />
                    </div>
                    <span className="text-xs font-medium text-on-surface-variant">Facebook</span>
                  </a>
                  
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + (currentShareImage || ''))}&text=Veja%20esta%20foto%20incr%C3%ADvel%20do%20Rancho%20Branco!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center group-hover:bg-[#1DA1F2] group-hover:text-white transition-colors">
                      <Twitter size={24} />
                    </div>
                    <span className="text-xs font-medium text-on-surface-variant">Twitter</span>
                  </a>
                  
                  <button 
                    onClick={copyToClipboard}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <LinkIcon size={24} />
                    </div>
                    <span className="text-xs font-medium text-on-surface-variant">Copiar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
