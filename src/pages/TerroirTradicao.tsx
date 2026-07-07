import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Wine, Utensils, Music, Phone, AlertCircle, ArrowRight, Award, GlassWater, Landmark, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

export default function TerroirTradicao() {
  const menuSteps = [
    {
      step: "1º Passo",
      title: "Recepção de Boas-Vindas",
      chef: "Chef Clenia",
      description: "Mesa de aperitivos com degustação orientada do azeite de oliva Viridi acompanhado de pães e torradas artesanais, terrine caprese, caponata de berinjela, grissines crocantes e tradicionais brusquetas italianas.",
      pairing: "Espumante Miolo Seival Brut / Brut Rosé",
      icon: GlassWater
    },
    {
      step: "2º Passo",
      title: "A Entrada do Pampa",
      chef: "Chefs Juliano & Clenia",
      description: "Saborosa linguiça parrillera servida com farofa crocante de ervas aromáticas e bolinho de aipim recheado com charque legítimo da nossa região.",
      pairing: "Vinho Tinto Tosquia (Vinícola Campos de Cima)",
      icon: Utensils
    },
    {
      step: "3º Passo",
      title: "O Primeiro Prato Principal",
      chef: "Chef Juliano",
      description: "Assado de tira premium braseado com perfeição, acompanhado de legumes grelhados finalizados com o frescor do azeite de oliva extra virgem. Acompanhamentos: clássica salada russa e mix de folhas verdes com tomates confitados.",
      pairing: "Vinho Tinto Miolo Single Vineyard Cabernet Franc",
      icon: Award
    },
    {
      step: "4º Passo",
      title: "O Segundo Prato Principal",
      chef: "Chef Juliano",
      description: "Cordeiro da nossa terra, assado lentamente para derreter na boca, acompanhado de um arroz cremoso finalizado com castanhas crocantes.",
      pairing: "Vinho Tinto 'Experiência' Tannat (Vinícola Família Cheguhem)",
      icon: Utensils
    },
    {
      step: "5º Passo",
      title: "A Doce Finalização",
      chef: "Chef Clenia",
      description: "Creme Brûlée clássico, sedoso por dentro e finalizado com aquela inconfundível crosta de açúcar maçaricada na hora.",
      pairing: "Vinho Licoroso Miolo Late Harvest",
      icon: Wine
    }
  ];

  const whatsappUrl = "https://wa.me/5555999195460?text=Ol%C3%A1!%20Gostaria%20de%20reservar%20uma%20vaga%20para%20o%201%C2%BA%20Terroir%20%26%20Tradi%C3%A7%C3%A3o%20no%20Rancho%20Branco.";

  return (
    <div className="bg-[#FCF3EA] text-[#13214D] min-h-screen font-sans">
      <SEO 
        title="1º Terroir & Tradição - Evento de Enogastronomia | Rancho Branco" 
        description="Venha vivenciar uma experiência enogastronômica inesquecível no dia 18 de Julho de 2026 no Rancho Branco. Menu em 5 passos harmonizado com vinhos finos das Caves do Pampa."
        canonical="https://ranchobranco.com.br/eventos/terroir-e-tradicao"
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
      `}} />

      {/* Hero Section - Split Layout */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b border-[#13214D]/5">
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
                    Evento Exclusivo de Enogastronomia
                  </span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-4xl sm:text-5xl md:text-7xl font-cinzel text-[#13214D] font-bold tracking-tight leading-tight"
                >
                  1º Terroir <br />
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
                Venha viver um almoço harmonizado único com vinhos selecionados da Campanha Gaúcha, azeites de oliva finos e cortes nobres do Pampa, em uma curadoria especial realizada pela equipe de sommeliers da <strong>Caves do Pampa</strong> e chefs residentes.
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
                    <span className="font-playfair text-base font-bold text-[#13214D]">18 de Julho de 2026</span>
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
                    <Music size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-cinzel font-bold text-[#13214D]/55 block">Atração</span>
                    <span className="font-playfair text-base font-bold text-[#13214D]">Música ao Vivo</span>
                    <span className="text-xs text-[#13214D]/70 block">Repertório acústico elegante</span>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/40 flex items-start gap-3 shadow-sm">
                  <div className="p-2.5 bg-[#BA8D49]/10 text-[#BA8D49] rounded-xl">
                    <Award size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-cinzel font-bold text-[#13214D]/55 block">Experiência</span>
                    <span className="font-playfair text-base font-bold text-[#13214D]">Almoço 5 Passos</span>
                    <span className="text-xs text-[#13214D]/70 block">Rótulos premiados inclusos</span>
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
                  <Phone size={16} /> Reservar via WhatsApp
                </a>
                <a 
                  href="#cardapio"
                  className="bg-white hover:bg-[#f6e5d4] text-[#13214D] border border-[#13214D]/20 px-8 py-4 rounded-full font-cinzel font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                >
                  Ver Cardápio <ArrowRight size={14} />
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
                  src="/cartaz-evento-terroir-tradicao-rancho-branco.jpeg"
                  alt="Cartaz Oficial 1º Terroir e Tradição - Rancho Branco"
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

      {/* Feature Section: The Parrilla & Welcome Details */}
      <section className="bg-white py-20 border-y border-[#13214D]/5">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          
          {/* Parrilla Highlight: Cooking Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <motion.div 
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/3 border-4 border-[#FCF3EA]"
              >
                <img 
                  src="/espaco-churrasqueira-parrilla-rancho-branco.jpeg" 
                  alt="Espaço da Churrasqueira e Parrilla rústica do Rancho Branco" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <span className="text-[#a33845] font-cinzel text-xs font-bold tracking-widest uppercase block">O Fogo Sagrado</span>
              <h3 className="text-3xl md:text-4xl font-cinzel text-[#13214D] font-bold leading-tight">
                A Arte do Fogo e Assado Campeiro na Parrilla
              </h3>
              <p className="font-playfair text-lg text-[#13214D]/80 leading-relaxed text-justify">
                É neste charmoso pavilhão rústico de tijolos e madeira nobre que o <strong>Chef Juliano</strong> comandará as brasas da parrilla. Ele preparará o espetacular <em>assado de tira premium</em> e o tenro <em>cordeiro da nossa terra</em> sob fogo brando, selando os sucos naturais da carne com aromas de lenha selecionada, servidos quentes direto à sua mesa.
              </p>
              <div className="flex items-center gap-3 text-sm font-cinzel font-bold text-[#13214D]/70 bg-[#FCF3EA]/60 p-3 rounded-xl border border-[#13214D]/5 w-fit">
                <Utensils size={18} className="text-[#a33845]" />
                <span>Pratos Principais preparados na lenha ao vivo</span>
              </div>
            </div>
          </div>

          {/* Welcoming stairs Highlight */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[#a33845] font-cinzel text-xs font-bold tracking-widest uppercase block">As Boas-Vindas</span>
              <h3 className="text-3xl md:text-4xl font-cinzel text-[#13214D] font-bold leading-tight">
                A Escadaria das Margaridas e a Recepção
              </h3>
              <p className="font-playfair text-lg text-[#13214D]/80 leading-relaxed text-justify">
                Sua experiência iniciará subindo a clássica e romântica escadaria de pedra do Rancho Branco. Enfeitada por arbustos verdes e margaridas brancas que florescem harmoniosamente, ela conduz à elegante porta envidraçada do salão, onde a equipe da <strong>Agência Corticeiras</strong> e a <strong>Chef Clenia</strong> estarão de braços abertos para lhe servir a taça de boas-vindas com espumante gelado e brusquetas rústicas.
              </p>
              <div className="flex items-center gap-3 text-sm font-cinzel font-bold text-[#13214D]/70 bg-[#FCF3EA]/60 p-3 rounded-xl border border-[#13214D]/5 w-fit">
                <GlassWater size={18} className="text-[#a33845]" />
                <span>Recepção com espumante e azeite extra virgem</span>
              </div>
            </div>
            <div className="lg:col-span-5">
              <motion.div 
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/3 border-4 border-[#FCF3EA]"
              >
                <img 
                  src="/escadaria-entrada-salao-de-festas-rancho-branco.jpeg" 
                  alt="Escadaria rústica de pedras com margaridas brancas na recepção do Rancho Branco" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* Menu / Food & Wine Harmonization Section */}
      <section id="cardapio" className="py-24 px-6 md:px-12 lg:px-24 bg-[#FCF3EA] relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-20 space-y-4">
            <span className="text-[#a33845] font-cinzel text-xs font-bold tracking-widest uppercase block">Experiência Gastronômica</span>
            <h2 className="text-4xl md:text-6xl font-cinzel text-[#13214D] font-bold">O Almoço em 5 Passos</h2>
            <div className="w-24 h-[1.5px] bg-[#BA8D49] mx-auto mt-6" />
            <p className="font-playfair text-lg text-[#13214D]/70 max-w-2xl mx-auto">
              Cada passo foi concebido para expressar a tipicidade do nosso terroir gaúcho, unindo os chefs à taça.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left side: Cardapio flyer image */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <motion.div 
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative max-w-sm sm:max-w-md w-full bg-white p-4 rounded-3xl shadow-2xl border-4 border-white"
              >
                {/* Decorative border details inside */}
                <div className="absolute inset-2 border border-[#BA8D49]/20 rounded-2xl pointer-events-none" />
                <img
                  src="/cardapio-almoco-harmonizado-vinhos-campanha-gaucha.jpeg"
                  alt="Menu Impresso Oficial - 1º Terroir e Tradição no Rancho Branco"
                  className="w-full h-auto rounded-xl object-contain shadow-inner relative z-10"
                />
              </motion.div>
              <span className="font-playfair text-xs text-[#13214D]/60 italic mt-4 text-center">
                *Menu impresso oficial com detalhes de cada chef e vinícola participante.
              </span>
            </div>

            {/* Right side: Detailed interactive menu steps */}
            <div className="lg:col-span-7 space-y-10 pl-0 lg:pl-6">
              {menuSteps.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex gap-4 md:gap-6 bg-white/70 hover:bg-white/90 p-6 md:p-8 rounded-2xl shadow-sm border border-white/50 transition-all group"
                  >
                    <div className="hidden sm:flex flex-col items-center">
                      <div className="p-3.5 rounded-xl bg-[#a33845]/10 text-[#a33845] group-hover:bg-[#a33845] group-hover:text-white transition-colors duration-300">
                        <IconComponent size={24} />
                      </div>
                      <span className="text-xs uppercase font-cinzel font-bold text-[#13214D]/40 mt-3 whitespace-nowrap">
                        {item.step}
                      </span>
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* Mobile Step Badge and Header */}
                      <div className="flex sm:hidden justify-between items-center border-b border-[#13214D]/10 pb-2">
                        <span className="text-xs font-cinzel font-bold text-[#a33845]">
                          {item.step}
                        </span>
                        <span className="text-xs font-cinzel text-[#13214D]/60">
                          {item.chef}
                        </span>
                      </div>

                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-xl md:text-2xl font-cinzel font-bold text-[#13214D]">
                          {item.title}
                        </h3>
                        <span className="hidden sm:inline-block bg-[#13214D]/5 text-[#13214D]/80 text-xs font-cinzel font-semibold px-3 py-1 rounded-full border border-[#13214D]/10">
                          {item.chef}
                        </span>
                      </div>

                      <p className="font-playfair text-base text-[#13214D]/85 leading-relaxed text-justify">
                        {item.description}
                      </p>

                      {/* Wine Ribbon */}
                      <div className="bg-[#a33845]/5 hover:bg-[#a33845]/10 p-3.5 rounded-xl border-l-[3.5px] border-[#a33845] flex items-center gap-3 transition-colors">
                        <Wine size={18} className="text-[#a33845]" />
                        <div>
                          <span className="text-[10px] uppercase font-cinzel tracking-wider font-bold text-[#a33845] block">
                            Harmonização do Terroir:
                          </span>
                          <span className="font-playfair font-medium text-sm md:text-base text-[#13214D] block mt-0.5">
                            {item.pairing}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* Pricing & Reservation Block */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#FCF3EA] to-[#dfd1c3]/30 relative overflow-hidden">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-16 shadow-2xl border border-white relative overflow-hidden">
          
          {/* Elegant gold corner borders */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#BA8D49]/30 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#BA8D49]/30 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#BA8D49]/30 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#BA8D49]/30 rounded-br-xl pointer-events-none" />

          <div className="text-center space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-2 text-[#a33845]"
            >
              <AlertCircle size={18} />
              <span className="font-cinzel text-xs font-bold tracking-widest uppercase">
                Apenas 1º Lote - Vagas Limitadas
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl font-cinzel text-[#13214D] font-bold"
            >
              Reserve Seu Lugar no Banquete
            </motion.h2>

            <p className="font-playfair text-lg text-[#13214D]/75 max-w-xl mx-auto">
              As reservas estão sendo organizadas exclusivamente pela <strong>Agência Corticeiras</strong>. Garanta sua participação neste dia festivo de sabores e alta gastronomia.
            </p>

            {/* Price Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-[#FCF3EA] rounded-2xl p-6 sm:p-8 max-w-sm mx-auto border border-[#BA8D49]/20 shadow-sm"
            >
              <span className="text-[10px] uppercase font-cinzel tracking-wider font-bold text-[#13214D]/60 block mb-1">
                Valor do Convite Individual
              </span>
              <span className="text-4xl sm:text-5xl font-cinzel font-bold text-[#13214D] block">
                R$ 275,00
              </span>
              <span className="text-[11px] font-playfair italic text-[#a33845] mt-2 block font-medium">
                Almoço em 5 passos com harmonização inclusa.
              </span>
            </motion.div>

            {/* Real WhatsApp Reservation Link */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4 pt-4 flex flex-col items-center"
            >
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#a33845] hover:bg-[#4a121a] text-white px-10 py-5 rounded-full font-cinzel font-bold text-xs tracking-widest uppercase transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Phone size={16} /> Chamar Agência Corticeiras no WhatsApp
              </a>
              <span className="text-xs font-playfair text-[#13214D]/50 block">
                Dúvidas ou restrições alimentares? Fale com nosso atendimento no número: +55 (55) 99919-5460.
              </span>
            </motion.div>
          </div>

        </div>
      </section>
    </div>
  );
}
