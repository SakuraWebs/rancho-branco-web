import { useState, useEffect } from 'react';
import { Share2, X, Facebook, Twitter, Link as LinkIcon, MessageCircle, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SEO from '../components/SEO';
import { db, collection, onSnapshot, query, orderBy, OperationType, handleFirestoreError } from '../firebase';

export default function Galeria() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentShareItem, setCurrentShareItem] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [activeTab, setActiveTab] = useState<'todos' | 'fotos' | 'videos'>('todos');
  const [dynamicItems, setDynamicItems] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDynamicItems(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'gallery');
    });

    return () => unsubscribe();
  }, []);

  const handleShareClick = (url: string, type: 'image' | 'video') => {
    setCurrentShareItem({ url, type });
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setCurrentShareItem(null);
  };

  const copyToClipboard = () => {
    if (currentShareItem) {
      const shareUrl = currentShareItem.type === 'video' 
        ? `https://www.youtube.com/watch?v=${currentShareItem.url}` 
        : window.location.origin + currentShareItem.url;
      navigator.clipboard.writeText(shareUrl);
      alert('Link copiado para a área de transferência!');
    }
  };

  const staticPhotos = [
    { url: "/casamento-nara-leco-1.jpg", alt: "Decoração de cerimônia de casamento ao ar livre com altar de madeira sob árvores centenárias", category: "casamentos" },
    { url: "/casamento-nara-leco-2.jpg", alt: "Noivos Nara e Leco celebrando após a cerimônia no gramado do Rancho Branco", category: "casamentos" },
    { url: "/casamento-nara-leco-3.jpg", alt: "Detalhe da mesa de doces em casamento rústico-chique", category: "casamentos" },
    { url: "/casamento-nara-leco-4.jpg", alt: "Vista panorâmica da recepção de casamento ao entardecer", category: "casamentos" },
    { url: "/casamento-nara-leco-5.jpg", alt: "Noivos Nara e Leco em momento romântico nos jardins do Rancho", category: "casamentos" },
    { url: "/casamento-yuri-eduarda-1.png", alt: "Cerimônia de casamento de Yuri e Eduarda com vista para o campo", category: "casamentos" },
    { url: "/casamento-yuri-eduarda-2.png", alt: "Decoração elegante de recepção de casamento em salão clássico", category: "casamentos" },
    { url: "/casamento-yuri-eduarda-3.jpeg", alt: "Noivos Yuri e Eduarda brindando com convidados", category: "casamentos" },
    { url: "/casamento-yuri-eduarda-4.jpeg", alt: "Detalhes da decoração floral em tons pastéis", category: "casamentos" },
    { url: "/eventos-carlos-eduardo-4.jpeg", alt: "Configuração de mesas para evento corporativo no Rancho Branco", category: "eventos" },
    { url: "/eventos-carlos-eduardo-5.jpeg", alt: "Área de lazer com piscina iluminada durante evento noturno", category: "eventos" },
    { url: "/eventos-carlos-eduardo-6.jpeg", alt: "Buffet sofisticado servido em evento social", category: "eventos" },
    { url: "/deck-celebracao-rancho-branco.webp", alt: "Deck de madeira para celebrações com vista para a natureza exuberante", category: "espacos" },
    { url: "/gramado-eventos-campo-livramento.webp", alt: "Amplo gramado verde ideal para eventos ao ar livre em Santana do Livramento", category: "espacos" },
    { url: "/1.1.jpeg", alt: "Caminho de pedras iluminado levando à entrada principal do Rancho", category: "espacos" },
    { url: "/1.2.jpeg", alt: "Pórtico de entrada rústico com telhado de palha e cercas brancas", category: "espacos" }
  ];

  const staticVideos = [
    { url: "6Lk3T2rLJVg", category: "casamentos" },
    { url: "CgMj1qNJj0c", category: "casamentos" },
    { url: "-oD4xZhbkOI", category: "eventos" },
    { url: "yk2yy3tAV0o", category: "eventos" },
    { url: "DLQI6kOOyac", category: "espacos" },
    { url: "gLvJN3JXyDU", category: "espacos" }
  ];

  // Merge static and dynamic items
  const allPhotos = [
    ...dynamicItems
      .filter(item => item.type === 'foto')
      .map(item => ({ 
        id: item.id, 
        url: typeof item.url === 'string' ? item.url : '', 
        alt: `Galeria ${item.category}`, 
        category: item.category 
      })),
    ...staticPhotos.map((p, i) => ({ ...p, id: `static-photo-${i}` }))
  ];

  const allVideos = [
    ...dynamicItems
      .filter(item => item.type === 'video')
      .map(item => ({ 
        id: item.id, 
        url: typeof item.url === 'string' ? item.url : '', 
        category: item.category 
      })),
    ...staticVideos.map((v, i) => ({ ...v, id: `static-video-${i}` }))
  ];

  const filteredPhotos = activeTab === 'videos' ? [] : allPhotos;
  const filteredVideos = activeTab === 'fotos' ? [] : allVideos;

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const combinedItems = [
    ...filteredPhotos.map(p => ({ ...p, type: 'foto' })),
    ...filteredVideos.map(v => ({ ...v, type: 'video' }))
  ];

  const totalPages = Math.ceil(combinedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = combinedItems.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return (
    <>
      <SEO 
        title="Fotos de Casamento em Santana do Livramento e Vídeos de Eventos | Rancho Branco" 
        description="Confira nossa galeria de espaços para eventos. Veja fotos de casamento em Santana do Livramento e vídeos de eventos no Rancho Branco, capturando momentos únicos."
        canonical="https://ranchobranco.com.br/galeria"
      />
      
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6">Galeria Completa</h1>
            <p className="text-lg text-on-surface-variant font-light max-w-2xl mx-auto">
              Cada detalhe, cada sorriso e cada celebração capturados em nosso refúgio.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'fotos', label: 'Fotos' },
              { id: 'videos', label: 'Vídeos' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-surface-container-high text-primary/70 hover:bg-surface-container-highest'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 lg:gap-8">
            {paginatedItems.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                key={item.id} 
                className="relative group overflow-hidden rounded-2xl break-inside-avoid-column mb-4 md:mb-6 lg:mb-8 bg-surface-container-lowest shadow-ambient transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
              >
                {item.type === 'foto' ? (
                  <>
                    <img
                      src={item.url}
                      alt={(item as any).alt}
                      className="w-full h-auto object-contain block transition-transform duration-700 group-hover:scale-105 bg-surface-container-high"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <button 
                      onClick={() => handleShareClick(item.url, 'image')}
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white backdrop-blur-md p-3 rounded-full text-primary shadow-lg opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 hover:scale-110 transition-all duration-300 z-10"
                      aria-label="Compartilhar imagem"
                    >
                      <Share2 size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="aspect-video">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${item.url}`}
                        title={`Rancho Branco Video ${item.id}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                    </div>
                    <div className="absolute top-4 right-4 z-10">
                      <button 
                        onClick={() => handleShareClick(item.url, 'video')}
                        className="bg-white/90 hover:bg-white backdrop-blur-md p-3 rounded-full text-primary shadow-lg opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 hover:scale-110 transition-all duration-300"
                        aria-label="Compartilhar vídeo"
                      >
                        <Share2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-6 py-2 rounded-full text-sm font-bold bg-surface-container-high text-primary/70 hover:bg-surface-container-highest disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Anterior
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                      currentPage === page 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-surface-container-high text-primary/70 hover:bg-surface-container-highest'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-6 py-2 rounded-full text-sm font-bold bg-surface-container-high text-primary/70 hover:bg-surface-container-highest disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                {currentShareItem && (
                  <div className="mb-6 rounded-xl overflow-hidden aspect-video relative bg-black">
                    {currentShareItem.type === 'image' ? (
                      <img src={currentShareItem.url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-12 h-12 text-white/50" />
                        <img 
                          src={`https://img.youtube.com/vi/${currentShareItem.url}/mqdefault.jpg`} 
                          alt="Video Preview" 
                          className="absolute inset-0 w-full h-full object-cover opacity-50"
                        />
                      </div>
                    )}
                  </div>
                )}
                
                <div className="grid grid-cols-4 gap-4">
                  <a 
                    href={`https://api.whatsapp.com/send?text=Confira%20este%20momento%20no%20Rancho%20Branco:%20${encodeURIComponent(currentShareItem?.type === 'video' ? `https://youtu.be/${currentShareItem.url}` : window.location.origin + (currentShareItem?.url || ''))}`}
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
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentShareItem?.type === 'video' ? `https://youtu.be/${currentShareItem.url}` : window.location.origin + (currentShareItem?.url || ''))}`}
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
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentShareItem?.type === 'video' ? `https://youtu.be/${currentShareItem.url}` : window.location.origin + (currentShareItem?.url || ''))}&text=Veja%20isso%20no%20Rancho%20Branco!`}
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
