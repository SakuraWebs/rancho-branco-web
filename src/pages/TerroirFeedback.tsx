import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Heart, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import { db, collection, addDoc, serverTimestamp } from '../firebase';

export default function TerroirFeedback() {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [favorite, setFavorite] = useState('');
  const [comments, setComments] = useState('');
  const [name, setName] = useState('');
  const [recommend, setRecommend] = useState<boolean | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Por favor, avalie a experiência com estrelas.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'terroir_feedback'), {
        rating,
        favorite,
        comments,
        name: name || 'Anônimo',
        recommend,
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      alert('Houve um erro ao enviar seu feedback. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FCF3EA] flex items-center justify-center p-6 font-sans">
        <SEO title="Obrigado pelo seu Feedback | Rancho Branco" description="Agradecemos seu feedback sobre o evento 1º Terroir e Tradição." />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-[#13214D]/10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-serif text-[#13214D] font-bold mb-4">Agradecemos de Coração</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Seu feedback é fundamental para continuarmos aprimorando nossas experiências e celebrando a cultura do Pampa.
          </p>
          <a href="/" className="inline-block bg-[#13214D] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#1a2d6c] transition-colors">
            Voltar ao Início
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#FCF3EA] text-[#13214D] min-h-screen font-sans pt-24 pb-12 px-4 sm:px-6">
      <SEO 
        title="Feedback - 1º Terroir & Tradição | Rancho Branco" 
        description="Deixe seu feedback sobre a experiência enogastronômica 1º Terroir & Tradição no Rancho Branco."
      />

      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#BA8D49] font-bold mb-2">Sua Opinião</p>
          <h1 className="text-3xl font-serif font-bold text-[#13214D] mb-4">Como foi sua experiência?</h1>
          <p className="text-sm opacity-70">1º Terroir & Tradição - Rancho Branco</p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#13214D]/5 space-y-8"
        >
          {/* Rating */}
          <div className="text-center">
            <label className="block text-sm font-medium mb-4 text-[#13214D]">Avaliação Geral</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    size={36} 
                    className={`transition-colors ${
                      (hoveredStar || rating) >= star 
                        ? 'fill-[#BA8D49] text-[#BA8D49]' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Favorite part */}
          <div>
            <label className="block text-sm font-medium mb-3 text-[#13214D] flex items-center gap-2">
              <Heart size={16} className="text-[#a33845]" /> O que você mais gostou?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Vinhos', 'Assado / Carnes', 'Sobremesa', 'Ambiente', 'Música', 'Atendimento'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFavorite(item)}
                  className={`py-2 px-3 rounded-xl border text-sm transition-all ${
                    favorite === item 
                      ? 'border-[#BA8D49] bg-[#BA8D49]/10 text-[#BA8D49] font-bold'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-sm font-medium mb-3 text-[#13214D]">Recomendaria a um amigo?</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRecommend(true)}
                className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                  recommend === true 
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                Sim
              </button>
              <button
                type="button"
                onClick={() => setRecommend(false)}
                className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                  recommend === false 
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                Não
              </button>
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[#13214D] flex items-center gap-2">
              <MessageSquare size={16} className="opacity-60" /> Comentários e Sugestões
            </label>
            <textarea 
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#BA8D49]/30 outline-none transition-all resize-none text-sm"
              placeholder="Conte-nos um pouco mais sobre sua experiência..."
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[#13214D]">Seu Nome (Opcional)</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#BA8D49]/30 outline-none transition-all text-sm"
              placeholder="Como prefere ser chamado?"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full bg-[#13214D] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1a2d6c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Enviar Avaliação <Send size={18} />
              </>
            )}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
