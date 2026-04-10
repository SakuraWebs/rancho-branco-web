import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Mail, MapPin, Phone, Share2 } from 'lucide-react';
import type { ContactMapRef } from '../components/ContactMap';
import SEO from '../components/SEO';

const ContactMap = lazy(() => import('../components/ContactMap'));

export default function Contato() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const contactMapRef = useRef<ContactMapRef>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsMapVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Pre-load when within 200px of viewport
    );

    if (mapContainerRef.current) {
      observer.observe(mapContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCenterMap = () => {
    if (contactMapRef.current) {
      contactMapRef.current.centerMap();
    }
  };

  const handleShare = async () => {
    const shareUrl = `https://maps.google.com/?q=-30.892359,-55.474898`;
    const shareData = {
      title: 'Rancho Branco',
      text: 'Confira a localização do Rancho Branco no Google Maps!',
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copiado para a área de transferência!');
      } catch (err) {
        console.error('Erro ao copiar:', err);
      }
    }
  };

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'O e-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Insira um e-mail válido.';
    }
    if (!formData.mensagem.trim()) {
      newErrors.mensagem = 'A mensagem é obrigatória.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        await fetch("https://formsubmit.co/ajax/contato@ranchobranco.com.br", {
          method: "POST",
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: "Novo contato pelo site",
            ...formData
          })
        });
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ nome: '', email: '', mensagem: '' });
        }, 3000);
      } catch (error) {
        console.error("Erro ao enviar formulário", error);
        alert("Ocorreu um erro ao enviar a mensagem. Tente novamente mais tarde.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <>
      <SEO 
        title="Contato Rancho Branco | Espaço para Eventos em Santana do Livramento" 
        description="Entre em contato com o Rancho Branco, o melhor espaço para eventos em Santana do Livramento. Agende sua visita, solicite orçamentos e tire suas dúvidas conosco."
        canonical="https://ranchobranco.com.br/contato"
      />
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-surface min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6">Fale Conosco</h1>
          <p className="text-lg text-on-surface-variant font-light max-w-2xl mx-auto">
            Estamos à disposição para tirar suas dúvidas e ajudar a planejar o seu próximo evento inesquecível.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <div className="bg-surface-container-lowest p-10 md:p-16 rounded-3xl shadow-ambient border border-outline-variant/20">
            <h2 className="text-2xl font-serif text-primary mb-8">Informações de Contato</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-secondary shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-primary mb-1">Endereço</h3>
                  <a href="https://share.google/ksvoohUL6zBN9iJyS" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant font-light hover:text-primary transition-colors">
                    R. Jose Fernandes Mendes, 2330 - Armour<br/>Sant'Ana do Livramento - RS, 97575-552
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-secondary shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-primary mb-1">WhatsApp</h3>
                  <a href="https://wa.me/5555981727725" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant font-light hover:text-primary transition-colors">
                    +55 55 98172-7725
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-secondary shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-primary mb-1">E-mail</h3>
                  <a href="mailto:contato@ranchobranco.com.br" className="text-on-surface-variant font-light hover:text-primary transition-colors">
                    contato@ranchobranco.com.br
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-outline-variant/20">
              <h3 className="font-bold text-primary mb-4">Horário de Atendimento</h3>
              <p className="text-on-surface-variant font-light">Segunda a Sexta: 09h às 18h<br/>Sábados: 09h às 13h (Apenas com agendamento)</p>
            </div>
          </div>

          {/* Simple Contact Form */}
          <div className="bg-surface-container-low p-10 md:p-16 rounded-3xl relative overflow-hidden">
            {isSubmitted ? (
              <div className="absolute inset-0 bg-primary flex flex-col items-center justify-center text-white p-8 text-center z-10 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-serif mb-2">Mensagem Enviada!</h3>
                <p className="text-white/80 font-light">Agradecemos o seu contato. Retornaremos em breve.</p>
              </div>
            ) : null}
            
            <h2 className="text-2xl font-serif text-primary mb-8">Envie uma Mensagem</h2>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nome" className="block text-base font-bold text-primary mb-3">Nome Completo</label>
                <input 
                  type="text" 
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`w-full bg-surface-container-highest border rounded-xl px-5 py-4 text-base focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-colors outline-none ${errors.nome ? 'border-red-500 focus:ring-red-500' : 'border-transparent'}`}
                  placeholder="Seu nome"
                  aria-invalid={!!errors.nome}
                  aria-describedby={errors.nome ? "nome-error" : undefined}
                />
                {errors.nome && <p id="nome-error" className="text-red-500 text-sm mt-2 font-medium">{errors.nome}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-base font-bold text-primary mb-3">E-mail</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-surface-container-highest border rounded-xl px-5 py-4 text-base focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-colors outline-none ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-transparent'}`}
                  placeholder="seu@email.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && <p id="email-error" className="text-red-500 text-sm mt-2 font-medium">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="mensagem" className="block text-base font-bold text-primary mb-3">Mensagem</label>
                <textarea 
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full bg-surface-container-highest border rounded-xl px-5 py-4 text-base focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-colors outline-none resize-none ${errors.mensagem ? 'border-red-500 focus:ring-red-500' : 'border-transparent'}`}
                  placeholder="Como podemos ajudar?"
                  aria-invalid={!!errors.mensagem}
                  aria-describedby={errors.mensagem ? "mensagem-error" : undefined}
                ></textarea>
                {errors.mensagem && <p id="mensagem-error" className="text-red-500 text-sm mt-2 font-medium">{errors.mensagem}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="satin-button text-on-primary px-8 py-4 rounded-full font-label text-base font-medium w-full shadow-ambient hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  'Enviar Mensagem'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
            <div>
              <h2 className="text-3xl font-serif text-primary mb-2">Como Chegar</h2>
              <p className="text-on-surface-variant font-light">Estamos localizados em uma área de fácil acesso.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleShare}
                type="button"
                className="bg-surface-container-highest text-primary px-5 py-2.5 rounded-full text-sm font-bold hover:bg-surface-container-high transition-colors flex items-center gap-2 shadow-sm border border-outline-variant/20 focus:ring-2 focus:ring-offset-2 focus:ring-primary outline-none"
                aria-label="Compartilhar localização no Google Maps"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar
              </button>
              <button 
                onClick={handleCenterMap}
                type="button"
                className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-primary outline-none"
                aria-label="Centralizar mapa e mostrar informações do Rancho Branco"
              >
                <MapPin className="w-4 h-4" />
                Centralizar Mapa
              </button>
            </div>
          </div>
          <div ref={mapContainerRef} className="rounded-3xl overflow-hidden shadow-ambient border border-outline-variant/20 h-[400px] md:h-[500px] relative z-0 w-full bg-surface-container-highest">
            {isMapVisible ? (
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-on-surface-variant animate-pulse">Carregando mapa...</div>}>
                <ContactMap ref={contactMapRef} />
              </Suspense>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant">Carregando mapa...</div>
            )}
          </div>
        </div>

        {/* Ambiance Gallery */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-primary mb-4">Conheça Nossa Atmosfera</h2>
            <p className="text-on-surface-variant font-light">Um vislumbre dos momentos inesquecíveis que aguardam por você.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "/deck-celebracao-rancho-branco.webp",
              "/gramado-eventos-campo-livramento.webp",
              "/1.1.jpeg",
              "/1.2.jpeg"
            ].map((photo, index) => (
              <div key={index} className="relative group overflow-hidden rounded-xl aspect-square shadow-ambient">
                <img
                  src={photo}
                  alt={`Atmosfera Rancho Branco ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
