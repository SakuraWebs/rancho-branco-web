import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Camera, MapPin } from 'lucide-react';

const tourImages = [
  {
    src: "/rancho-branco-vista-panoramica-santana-do-livramento.jpeg",
    title: "Vista Panorâmica",
    description: "Visão ampla da nossa sede campestre imersa na natureza da fronteira."
  },
  {
    src: "/1.2.jpeg",
    title: "O Pórtico de Entrada",
    description: "Nossa recepção rústica que dá as boas-vindas aos seus convidados."
  },
  {
    src: "/1.1.jpeg",
    title: "O Caminho Iluminado",
    description: "Trilha cercada de verde que guia ao salão principal."
  },
  {
    src: "/escadaria-entrada-salao-de-festas-rancho-branco.jpeg",
    title: "A Escadaria",
    description: "A clássica escadaria de pedras rodeada de flores."
  },
  {
    src: "/jardim-e-cenario-para-eventos-ao-ar-livre.jpeg",
    title: "Jardins ao Ar Livre",
    description: "Espaços perfeitamente esculpidos para cerimônias ao pôr do sol."
  },
  {
    src: "/rancho-branco-casa-de-eventos-area-externa.jpeg",
    title: "Área de Convivência",
    description: "Amplo gramado com quiosques integrados à arquitetura rústica."
  },
  {
    src: "/espaco-churrasqueira-parrilla-rancho-branco.jpeg",
    title: "Espaço Parrilla",
    description: "Churrasqueira típica para um verdadeiro assado campeiro."
  },
  {
    src: "/vista-do-lago-e-natureza-rancho-branco.jpeg",
    title: "O Lago",
    description: "Nosso lago sereno que reflete a beleza do Pampa."
  },
  {
    src: "/local-para-casamentos-e-cerimonias-na-fronteira.jpeg",
    title: "Cenário Rústico",
    description: "O charme inconfundível da madeira e da tradição."
  }
];

export default function VirtualTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => setCurrentIndex((prev) => (prev + 1) % tourImages.length), []);
  const prevSlide = useCallback(() => setCurrentIndex((prev) => (prev - 1 + tourImages.length) % tourImages.length), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextSlide, prevSlide]);

  const openTour = (index = 0) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeTour = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <button 
        onClick={() => openTour()}
        className="group relative overflow-hidden bg-black/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-label font-semibold shadow-ambient flex items-center justify-center gap-3 transition-all hover:bg-black/40 hover:scale-105 w-full sm:w-auto"
      >
        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
        <Camera className="w-5 h-5 relative z-10" />
        <span className="relative z-10 text-base md:text-lg">Iniciar Tour Virtual</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center"
          >
            {/* Header controls */}
            <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center text-white z-50">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-white/70" />
                <span className="font-serif tracking-widest text-sm uppercase text-white/70 hidden sm:inline-block">Tour Virtual Rancho Branco</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-white/50 text-sm">
                  {currentIndex + 1} / {tourImages.length}
                </span>
                <button onClick={closeTour} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button 
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/20 hover:bg-white/10 rounded-full text-white transition-all hover:-translate-x-1 z-50 backdrop-blur-sm border border-white/10"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/20 hover:bg-white/10 rounded-full text-white transition-all hover:translate-x-1 z-50 backdrop-blur-sm border border-white/10"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Image Container */}
            <div className="relative w-full max-w-6xl h-[100svh] md:h-[80vh] px-12 sm:px-16 flex flex-col items-center justify-center" onClick={closeTour}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="relative w-full h-full flex flex-col items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img 
                    src={tourImages[currentIndex].src} 
                    alt={tourImages[currentIndex].title}
                    className="max-w-full max-h-[70%] sm:max-h-[85%] object-contain rounded-lg shadow-2xl drop-shadow-2xl select-none"
                    draggable={false}
                  />
                  
                  {/* Caption box */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute bottom-8 sm:bottom-0 inset-x-4 sm:inset-x-auto sm:w-[600px] bg-black/70 backdrop-blur-md border border-white/10 p-5 sm:p-6 rounded-2xl text-center sm:transform sm:translate-y-1/2 shadow-2xl"
                  >
                    <h3 className="text-xl sm:text-2xl font-serif text-white mb-2">{tourImages[currentIndex].title}</h3>
                    <p className="text-white/70 font-light text-sm sm:text-base leading-relaxed">
                      {tourImages[currentIndex].description}
                    </p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
