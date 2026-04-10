import { ArrowRight, LayoutGrid, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import EssenceSection from '../components/EssenceSection';

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Rancho Branco",
    "image": "https://ranchobranco.com.br/logo.webp",
    "@id": "https://ranchobranco.com.br",
    "url": "https://ranchobranco.com.br",
    "telephone": "+5555999999999",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Zona Rural",
      "addressLocality": "Santana do Livramento",
      "addressRegion": "RS",
      "postalCode": "97570-000",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -30.8911,
      "longitude": -55.5328
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://www.facebook.com/ranchobranco",
      "https://www.instagram.com/ranchobranco"
    ]
  };

  return (
    <>
      <SEO 
        title="Local para Casamentos em Santana do Livramento | Rancho Branco" 
        description="O Rancho Branco é o melhor local para casamentos em Santana do Livramento. Oferecemos um espaço para eventos corporativos em Santana do Livramento e somos o local ideal para festas e aniversário."
        canonical="https://ranchobranco.com.br/"
      />
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      {/* Hero Section */}
      <header className="relative min-h-[100svh] flex items-center justify-center pt-24 pb-12">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover object-[20%_30%] md:object-[center_30%] brightness-[0.65] contrast-[1.15]"
            alt="lush green landscape of a luxury brazilian countryside estate with rolling hills and elegant white colonial architecture at sunrise"
            src="/gramado-eventos-campo-livramento.webp"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40"></div>
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-5xl mt-8 md:mt-12">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-tighter mb-8 md:mb-10 leading-[1.1] drop-shadow-xl">
            Um refúgio atemporal em meio à natureza
          </h1>
          <Link to="/orcamento" className="bg-surface-container-lowest text-primary px-8 py-4 md:px-10 md:py-5 rounded-full font-label text-base md:text-lg font-semibold shadow-ambient hover:scale-105 transition-transform inline-block">
            Comece sua história aqui
          </Link>
        </div>
      </header>

      {/* 'A Essência' Section */}
      <EssenceSection />

      {/* Gallery 'Os Cenários' */}
      <section id="cenarios" className="py-32 px-6 md:px-12 lg:px-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary mb-6">Cenários Exclusivos para Casamentos e Eventos</h2>
              <p className="text-on-surface-variant max-w-md text-lg font-light leading-relaxed">
                Descubra os recantos mais icônicos do Rancho, onde a luz e a terra se encontram em harmonia.
              </p>
            </div>
            <Link to="/galeria" className="text-primary font-label font-bold flex items-center gap-2 group">
              Ver Galeria Completa
              <LayoutGrid className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 relative group overflow-hidden rounded-xl h-[400px] md:h-[500px]">
              <img
                className="w-full h-full object-cover object-[center_60%] transition-transform duration-1000 group-hover:scale-105"
                alt="Pórtico de entrada rústico do Rancho Branco com telhado de palha, cerca branca e placa de madeira com o nome do local, cercado por árvores altas"
                src="/1.2.jpeg"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8 md:p-12">
                <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-3xl font-serif mb-3">O Pórtico</h3>
                  <p className="font-light opacity-90 text-lg">Onde a experiência e a exclusividade do Rancho Branco começam.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 relative group overflow-hidden rounded-xl h-[400px] md:h-[500px]">
              <img
                className="w-full h-full object-cover object-[center_70%] transition-transform duration-1000 group-hover:scale-105"
                alt="Caminho de pedras cercado por gramado e plantas tropicais levando à entrada rústica e iluminada do salão principal do Rancho Branco"
                src="/1.1.jpeg"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-serif mb-3">O Caminho Principal</h3>
                  <p className="font-light opacity-90">Uma entrada acolhedora e rústica que guia seus convidados para momentos inesquecíveis.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase mb-6 block">Depoimentos</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary">Memórias de casamentos e eventos no Rancho Branco.</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-surface-container-lowest p-10 rounded-xl shadow-ambient border border-outline-variant/20 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-secondary mb-8">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-on-surface-variant font-light italic mb-10 leading-relaxed text-lg">
                  "O casamento dos meus sonhos não poderia ter acontecido em outro lugar. A paz que se sente sob aquelas árvores é indescritível."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    alt="portrait of a smiling elegant woman in her 30s with soft natural lighting"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL9-Zt-Lb9iDveg9tRIVQeqveGAmwiDv6QacZ_ldO8LQzWWKeGC0rIlSVyw4SVAduvTZzxbbFdnqfq85PM_EbXVqt6S3ETGFpD6jfQ4gyffursWKDr6nbChZ0SBqbS0v2LOHtNO3o_i8_QaO1QGlwDlfc5ZkHrEXu4fTX-ZzSGYi8g2KCU_udF5hn3t2BAflwjRQm3bn8yYE_rVBHb4opX71zWmkA52aMo_D_IoWlJHprpvZOoeuSn-EWuuW7cKQEY1foZ3IJz5iNQ"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="font-bold text-primary">Helena Silveira</p>
                  <p className="text-sm text-on-surface-variant">Noiva, Setembro 2023</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-surface-container-lowest p-10 rounded-xl shadow-ambient border border-outline-variant/20 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-secondary mb-8">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-on-surface-variant font-light italic mb-10 leading-relaxed text-lg">
                  "Para nossos eventos corporativos, buscávamos exclusividade e foco. O Rancho Branco entregou excelência em cada detalhe operacional."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    alt="professional middle-aged man in a linen shirt looking confident"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD89cgkTD1QlBlq1-Y3vLry9g_da-s76f4E6arAFvioBT6os7QSDeSQrobXCWL_IKpQ3RLAo-BMZiHJy6hSfdwuzEd1pnWlECBIx3DEibPdThg6lEbzoAIaFM6MigFb4Jn2hl-AsPWknynE6V-ffFYIIEENsRE1FbswU-WyaDfacwxefcmfOzv4eAsdgNCFm5mOaU-9F97nwPUHzccnKCGocG3rTeRHmhxkKVluZ3BUW7B3QkdoKujnZ399P3FRT1msI_mbKu4H5m11"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="font-bold text-primary">Ricardo Mendes</p>
                  <p className="text-sm text-on-surface-variant">Diretor Criativo</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-surface-container-lowest p-10 rounded-xl shadow-ambient border border-outline-variant/20 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-secondary mb-8">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-on-surface-variant font-light italic mb-10 leading-relaxed text-lg">
                  "A iluminação da piscina à noite cria uma atmosfera que raramente vi em outros lugares. É verdadeiramente mágico."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    alt="relaxed portrait of a young man with a slight smile in soft lighting"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC522brxPEY3rKBxgTdp8aOg0P4dKFTtIDw_C3oksPVmVzf7iO5TXW2l5M2_9t5zpUMdm0_oekQhe5jgCReFd0lMkzSxKwl1GaGKs091n6ynht_uQp1LHkqUiJV-fzdnhs92uZN7EsmTcZkdjKIB3aFEpBYs4o9YFxxlWLrsRvEm831zpDuKTpvyBoiDgmOdnoLvFxZvyk9IZvjP0M2gLdAhfgvWdShId8Xwd-wSW2BKKr8j_JYkmGgEGijLekEq96X71Bb4O_JIsdM"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="font-bold text-primary">André Costa</p>
                  <p className="text-sm text-on-surface-variant">Anfitrião</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
