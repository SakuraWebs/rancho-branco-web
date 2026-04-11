import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Facebook, Youtube, Mail, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoImage from '../assets/logo.webp';

export default function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowCookieBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowCookieBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowCookieBanner(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'O Espaço', path: '/' },
    { name: 'Sobre Nós', path: '/sobre-nos' },
    { name: 'Casamentos', path: '/casamentos' },
    { name: 'Eventos', path: '/eventos' },
    { name: 'Contato', path: '/contato' },
  ];

  // Pages that don't have a hero image at the top need a solid nav immediately
  const needsSolidNav = ['/contato', '/orcamento', '/galeria', '/politicas-de-privacidade', '/termos-de-uso'].includes(location.pathname);
  const isSolidNav = isScrolled || needsSolidNav;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isSolidNav ? 'bg-surface/90 backdrop-blur-xl shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="flex justify-between items-center px-6 md:px-12 w-full max-w-7xl mx-auto">
          <Link to="/" className="flex items-center relative">
            <h1 className="sr-only">Rancho Branco</h1>
            {/* Subtle tight white glow acting as a text-shadow/outline for the logo */}
            <div className={`absolute inset-0 bg-white/70 blur-md rounded-full scale-110 transition-opacity duration-300 ${!isSolidNav ? 'opacity-100' : 'opacity-0'}`}></div>
            <img 
              src={logoImage} 
              alt="Rancho Branco" 
              className="relative h-16 md:h-24 w-auto object-contain mix-blend-multiply"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative font-serif tracking-tight transition-colors duration-300 py-1 ${
                    isSolidNav
                      ? isActive ? 'text-primary font-medium' : 'text-primary/70 hover:text-primary font-light'
                      : isActive ? 'text-white font-medium' : 'text-white/80 hover:text-white font-light'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="desktop-nav-indicator"
                      className={`absolute -bottom-1 left-0 right-0 h-[2px] rounded-full ${isSolidNav ? 'bg-primary' : 'bg-white'}`}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:block">
            <Link to="/orcamento" className="satin-button text-on-primary px-8 py-3 rounded-full font-label text-sm font-medium transition-transform hover:scale-105 shadow-ambient inline-block">
              Solicitar Orçamento
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden ${isSolidNav ? 'text-primary' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden absolute top-full left-0 w-full bg-surface/95 backdrop-blur-xl border-b border-outline-variant/20 shadow-ambient overflow-hidden"
            >
              <div className="py-6 px-6 flex flex-col gap-6">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`font-serif text-xl transition-all duration-300 flex items-center ${
                        isActive 
                          ? 'text-primary font-medium pl-4 border-l-[3px] border-primary' 
                          : 'text-on-surface-variant font-light hover:pl-2'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                <Link to="/orcamento" className="satin-button text-on-primary px-6 py-4 rounded-full font-label text-base font-medium mt-4 w-full shadow-ambient text-center">
                  Solicitar Orçamento
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-surface py-16 px-6 md:px-12 rounded-t-3xl md:rounded-t-[3rem] mt-12">
        <div className="max-w-7xl mx-auto">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 items-start mb-16">
            {/* Logo & Tagline - Left aligned */}
            <div className="lg:col-span-4 flex flex-col items-start">
              <Link to="/" className="inline-block mb-6" aria-label="Página inicial do Rancho Branco">
                <img 
                  src={logoImage} 
                  alt="Rancho Branco" 
                  className="h-24 md:h-32 w-auto object-contain mix-blend-screen invert opacity-90"
                />
              </Link>
              <p className="text-white/90 font-light text-xs max-w-sm leading-relaxed">
                Onde a sofisticação encontra a natureza. Celebrações inesquecíveis em um refúgio atemporal.
              </p>
            </div>

            {/* Nossos Serviços */}
            <div className="lg:col-span-2 flex flex-col items-start">
              <h4 className="text-white font-serif text-base mb-5">Nossos Serviços</h4>
              <div className="flex flex-col gap-3 text-[10px] uppercase tracking-widest font-medium text-white">
                <Link className="hover:text-white hover:underline decoration-white/50 underline-offset-4 transition-all" to="/casamentos">Casamentos</Link>
                <Link className="hover:text-white hover:underline decoration-white/50 underline-offset-4 transition-all" to="/eventos">Eventos</Link>
              </div>
            </div>

            {/* Links Legais */}
            <div className="lg:col-span-3 flex flex-col items-start lg:items-center">
              <div className="w-full lg:w-auto">
                <h4 className="text-white font-serif text-base mb-5">Legal</h4>
                <div className="flex flex-col gap-3 text-[10px] uppercase tracking-widest font-medium text-white">
                  <Link className="hover:text-white hover:underline decoration-white/50 underline-offset-4 transition-all" to="/politicas-de-privacidade">Políticas de Privacidade</Link>
                  <Link className="hover:text-white hover:underline decoration-white/50 underline-offset-4 transition-all" to="/termos-de-uso">Termos de Uso</Link>
                </div>
              </div>
            </div>

            {/* Action & Social */}
            <div className="lg:col-span-3 flex flex-col items-start lg:items-end">
              <Link to="/orcamento" className="bg-surface-container-lowest text-primary px-6 py-3 rounded-full font-label text-xs font-bold shadow-lg hover:scale-105 transition-all duration-300 inline-block mb-8 text-center w-full lg:w-auto">
                Solicitar Orçamento
              </Link>
              <div className="flex gap-5">
                <a href="https://www.instagram.com/ranchobrancolvto" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" aria-hidden="true" />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61583613280624" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" aria-hidden="true" />
                </a>
                <a href="https://www.youtube.com/@RanchoBranco" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors" aria-label="YouTube">
                  <Youtube className="w-5 h-5" aria-hidden="true" />
                </a>
                <a href="mailto:contato@ranchobranco.com.br" className="text-white/80 hover:text-white transition-colors" aria-label="Enviar E-mail">
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section: Copyright & Developer */}
          <div className="pt-8 border-t border-white/20 flex flex-col items-center justify-center gap-1.5 text-[10px] md:text-xs text-white/80 font-light text-center w-full">
            <p className="text-center">
              © {new Date().getFullYear()} Rancho Branco. Todos os direitos reservados.
            </p>
            <p className="text-center">
              Web developer - <a href="https://wa.me/5555991812505" target="_blank" rel="noopener noreferrer" className="hover:text-white underline decoration-white/30 underline-offset-2 transition-colors" aria-label="Falar com o desenvolvedor Enrique Fernández via WhatsApp">Enrique Fernández</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 bg-primary text-on-primary rounded-full shadow-ambient hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Voltar ao topo"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* LGPD Cookie Banner */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="fixed bottom-8 left-4 md:left-8 z-50 w-[calc(100%-2rem)] md:w-[400px] bg-surface p-6 rounded-2xl shadow-2xl border border-outline-variant/20"
          >
            <h3 className="text-lg font-serif text-primary mb-2">Sua Privacidade</h3>
            <p className="text-sm text-on-surface-variant font-light mb-6 leading-relaxed">
              Utilizamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdo. Ao continuar navegando, você concorda com a nossa{' '}
              <Link to="/politicas-de-privacidade" className="text-primary underline underline-offset-2 hover:text-primary/80">
                Política de Privacidade
              </Link>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={acceptCookies}
                className="flex-1 bg-primary text-on-primary py-2.5 rounded-full font-label text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Aceitar
              </button>
              <button
                onClick={declineCookies}
                className="flex-1 bg-surface-container-high text-on-surface py-2.5 rounded-full font-label text-sm font-semibold hover:bg-surface-container-highest transition-colors"
              >
                Recusar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
