import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import SEO from '../components/SEO';

export default function Orcamento() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    tipoEvento: '',
    data: '',
    convidados: '',
    origem: '',
    mensagem: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) newErrors.nome = 'O nome é obrigatório.';
    if (!formData.telefone.trim()) newErrors.telefone = 'O telefone é obrigatório.';
    
    if (!formData.email.trim()) {
      newErrors.email = 'O e-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Insira um e-mail válido.';
    }
    
    if (!formData.tipoEvento) newErrors.tipoEvento = 'Selecione o tipo de evento.';
    if (!formData.data) newErrors.data = 'A data prevista é obrigatória.';
    
    if (!formData.convidados) {
      newErrors.convidados = 'Informe o número de convidados.';
    } else if (parseInt(formData.convidados) < 10) {
      newErrors.convidados = 'O número mínimo é de 10 convidados.';
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
            _subject: "Nova solicitação de orçamento",
            ...formData
          })
        });
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            nome: '', telefone: '', email: '', tipoEvento: '', 
            data: '', convidados: '', origem: '', mensagem: ''
          });
        }, 3000);
      } catch (error) {
        console.error("Erro ao enviar formulário", error);
        alert("Ocorreu um erro ao enviar a solicitação. Tente novamente mais tarde.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-surface min-h-screen">
      <SEO 
        title="Solicitar Orçamento | Planeje seu Evento no Rancho Branco" 
        description="Peça um orçamento personalizado para seu casamento ou evento no Rancho Branco. Nossa equipe entrará em contato com a melhor proposta para você."
        canonical="https://ranchobranco.com.br/orcamento"
      />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase mb-4 block">Comece a planejar</span>
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6">Solicitar Orçamento</h1>
          <p className="text-lg text-on-surface-variant font-light">
            Preencha o formulário abaixo com os detalhes do seu evento. Nossa equipe entrará em contato em até 24 horas com uma proposta personalizada.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-8 md:p-16 rounded-3xl shadow-ambient border border-outline-variant/20 relative overflow-hidden">
          {isSubmitted ? (
            <div className="absolute inset-0 bg-primary flex flex-col items-center justify-center text-white p-8 text-center z-10 animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <Mail className="w-10 h-10" />
              </div>
              <h3 className="text-4xl font-serif mb-4">Solicitação Enviada!</h3>
              <p className="text-white/80 font-light text-lg max-w-md">
                Recebemos os detalhes do seu evento. Nossa equipe preparará uma proposta personalizada e entrará em contato em até 24 horas.
              </p>
            </div>
          ) : null}

          <form className="space-y-8" onSubmit={handleSubmit} noValidate>
            
            {/* Dados Pessoais */}
            <div>
              <h2 className="text-xl font-serif text-primary mb-6 border-b border-outline-variant/20 pb-2">Dados Pessoais</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nome" className="block text-sm font-bold text-primary mb-2">Nome Completo</label>
                  <input 
                    type="text" 
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className={`w-full bg-surface-container-highest border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-colors outline-none ${errors.nome ? 'border-red-500 focus:ring-red-500' : 'border-transparent'}`} 
                    required
                    aria-required="true"
                    aria-invalid={!!errors.nome}
                    aria-describedby={errors.nome ? "nome-error" : undefined}
                  />
                  {errors.nome && <p id="nome-error" className="text-red-500 text-xs mt-1.5 font-medium" role="alert">{errors.nome}</p>}
                </div>
                <div>
                  <label htmlFor="telefone" className="block text-sm font-bold text-primary mb-2">Telefone / WhatsApp</label>
                  <input 
                    type="tel" 
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className={`w-full bg-surface-container-highest border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-colors outline-none ${errors.telefone ? 'border-red-500 focus:ring-red-500' : 'border-transparent'}`} 
                    required
                    aria-required="true"
                    aria-invalid={!!errors.telefone}
                    aria-describedby={errors.telefone ? "telefone-error" : undefined}
                  />
                  {errors.telefone && <p id="telefone-error" className="text-red-500 text-xs mt-1.5 font-medium" role="alert">{errors.telefone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-bold text-primary mb-2">E-mail</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-surface-container-highest border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-colors outline-none ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-transparent'}`} 
                    required
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && <p id="email-error" className="text-red-500 text-xs mt-1.5 font-medium" role="alert">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Detalhes do Evento */}
            <div>
              <h2 className="text-xl font-serif text-primary mb-6 border-b border-outline-variant/20 pb-2">Detalhes do Evento</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="tipoEvento" className="block text-sm font-bold text-primary mb-2">Tipo de Evento</label>
                  <select 
                    id="tipoEvento"
                    name="tipoEvento"
                    value={formData.tipoEvento}
                    onChange={handleChange}
                    className={`w-full bg-surface-container-highest border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-colors outline-none appearance-none ${errors.tipoEvento ? 'border-red-500 focus:ring-red-500' : 'border-transparent'}`}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.tipoEvento}
                    aria-describedby={errors.tipoEvento ? "tipoEvento-error" : undefined}
                  >
                    <option value="">Selecione...</option>
                    <option value="casamento">Casamento</option>
                    <option value="social">Evento Social (Aniversário, Formatura)</option>
                    <option value="corporativo">Evento Corporativo</option>
                    <option value="outro">Outro</option>
                  </select>
                  {errors.tipoEvento && <p id="tipoEvento-error" className="text-red-500 text-xs mt-1.5 font-medium" role="alert">{errors.tipoEvento}</p>}
                </div>
                <div>
                  <label htmlFor="data" className="block text-sm font-bold text-primary mb-2">Data Prevista</label>
                  <input 
                    type="date" 
                    id="data"
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    className={`w-full bg-surface-container-highest border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-colors outline-none text-on-surface-variant ${errors.data ? 'border-red-500 focus:ring-red-500' : 'border-transparent'}`} 
                    required
                    aria-required="true"
                    aria-invalid={!!errors.data}
                    aria-describedby={errors.data ? "data-error" : undefined}
                  />
                  {errors.data && <p id="data-error" className="text-red-500 text-xs mt-1.5 font-medium" role="alert">{errors.data}</p>}
                </div>
                <div>
                  <label htmlFor="convidados" className="block text-sm font-bold text-primary mb-2">Número Estimado de Convidados</label>
                  <input 
                    type="number" 
                    id="convidados"
                    min="10" 
                    name="convidados"
                    value={formData.convidados}
                    onChange={handleChange}
                    className={`w-full bg-surface-container-highest border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-colors outline-none ${errors.convidados ? 'border-red-500 focus:ring-red-500' : 'border-transparent'}`} 
                    required
                    aria-required="true"
                    aria-invalid={!!errors.convidados}
                    aria-describedby={errors.convidados ? "convidados-error" : undefined}
                  />
                  {errors.convidados && <p id="convidados-error" className="text-red-500 text-xs mt-1.5 font-medium" role="alert">{errors.convidados}</p>}
                </div>
                <div>
                  <label htmlFor="origem" className="block text-sm font-bold text-primary mb-2">Como nos conheceu?</label>
                  <select 
                    id="origem"
                    name="origem"
                    value={formData.origem}
                    onChange={handleChange}
                    className="w-full bg-surface-container-highest border border-transparent rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-colors outline-none appearance-none"
                  >
                    <option value="">Selecione...</option>
                    <option value="instagram">Instagram</option>
                    <option value="google">Google</option>
                    <option value="indicacao">Indicação</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="mensagem" className="block text-sm font-bold text-primary mb-2">Mensagem Adicional (Opcional)</label>
                  <textarea 
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    rows={4} 
                    className="w-full bg-surface-container-highest border border-transparent rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-colors outline-none resize-none" 
                    placeholder="Conte-nos um pouco mais sobre o que você imagina para o seu evento..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" disabled={isSubmitting} className="satin-button text-on-primary px-10 py-5 rounded-full font-label text-lg font-semibold w-full shadow-ambient hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  'Enviar Solicitação'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
