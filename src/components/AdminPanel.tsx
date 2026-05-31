import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup, signOut } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, LogOut, Shield, Plus, Trash2, Image as ImageIcon, Video, X, LayoutGrid, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, OperationType, handleFirestoreError, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminPanel() {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'galeria' | 'agenda'>('agenda');
  
  // Gallery state
  const [isUploading, setIsUploading] = useState(false);
  const [newItem, setNewItem] = useState({ type: 'foto', url: '', category: 'casamentos' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  
  // Agenda state
  const [newAgendaItem, setNewAgendaItem] = useState({ dateString: '', title: '', status: 'confirmed' });
  const [agendaItems, setAgendaItems] = useState<any[]>([]);
  const [isAddingAgenda, setIsAddingAgenda] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  React.useEffect(() => {
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone);
  }, []);

  // Global state
  const [showPanel, setShowPanel] = useState(false);
  const [showLoginTrigger, setShowLoginTrigger] = useState(false);

  React.useEffect(() => {
    // Check for admin=true in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setShowLoginTrigger(true);
    }

    // Keyboard shortcut: Ctrl + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowLoginTrigger(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  React.useEffect(() => {
    if (!isAdmin) return;

    // Fetch Gallery
    const qGallery = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribeGallery = onSnapshot(qGallery, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGalleryItems(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'gallery');
    });

    // Fetch Agenda
    const qAgenda = query(collection(db, 'agenda'), orderBy('dateString', 'asc'));
    const unsubscribeAgenda = onSnapshot(qAgenda, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAgendaItems(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'agenda');
    });

    return () => {
      unsubscribeGallery();
      unsubscribeAgenda();
    };
  }, [isAdmin]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Login failed', error);
      if (error.code === 'auth/unauthorized-domain') {
        alert('O domínio atual não está autorizado no Firebase. Por favor, acesse o painel do Firebase > Authentication > Settings > Authorized domains e adicione este domínio: ' + window.location.hostname);
      } else {
        alert('Erro ao tentar fazer login: ' + (error.message || error.code || 'Erro desconhecido'));
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newItem.type === 'foto' && !selectedFile) {
      alert('Por favor, selecione uma imagem para carregar.');
      return;
    }
    if (newItem.type === 'video' && !newItem.url) {
      alert('Por favor, insira o ID do vídeo do YouTube.');
      return;
    }

    setIsUploading(true);
    try {
      let finalUrl = newItem.url;

      if (newItem.type === 'foto' && selectedFile) {
        const fileRef = ref(storage, `gallery/${Date.now()}_${selectedFile.name}`);
        const uploadResult = await uploadBytes(fileRef, selectedFile);
        finalUrl = await getDownloadURL(uploadResult.ref);
      }

      await addDoc(collection(db, 'gallery'), {
        type: newItem.type,
        url: finalUrl,
        category: newItem.category,
        createdAt: serverTimestamp(),
        createdBy: user?.uid
      });

      setNewItem({ ...newItem, url: '' });
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'gallery');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item da galeria?')) return;
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `gallery/${id}`);
    }
  };

  const handleAddAgenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgendaItem.dateString || !newAgendaItem.title) {
      alert('Por favor preencha a data e o título.');
      return;
    }

    setIsAddingAgenda(true);
    try {
      await addDoc(collection(db, 'agenda'), {
        dateString: newAgendaItem.dateString,
        title: newAgendaItem.title,
        status: newAgendaItem.status,
        createdAt: serverTimestamp(),
        createdBy: user?.uid
      });
      setNewAgendaItem({ dateString: '', title: '', status: 'confirmed' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'agenda');
    } finally {
      setIsAddingAgenda(false);
    }
  };

  const handleDeleteAgenda = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta data?')) return;
    try {
      await deleteDoc(doc(db, 'agenda', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `agenda/${id}`);
    }
  };

  if (loading) return null;

  if (!user) {
    if (!showLoginTrigger) return null;
    return (
      <div className="fixed bottom-4 right-4 z-[100]">
        <button 
          onClick={handleLogin}
          className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          title="Login Admin"
        >
          <LogIn size={20} />
          <span className="text-sm font-medium pr-1">Admin</span>
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    if (!showLoginTrigger) return null;
    return (
      <div className="fixed bottom-4 right-4 z-[100]">
        <div className="bg-white p-4 rounded-xl shadow-xl border border-red-100 flex flex-col items-center gap-3">
          <p className="text-xs text-red-600 font-medium">Acesso Restrito</p>
          <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <LogOut size={14} /> Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[100]">
        <button 
          onClick={() => setShowPanel(!showPanel)}
          className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          {showPanel ? <X size={20} /> : <Shield size={20} />}
          <span className="text-sm font-medium pr-1">Painel Admin</span>
        </button>
      </div>

      <AnimatePresence>
        {showPanel && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b flex items-center justify-between bg-surface-container-lowest">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl text-primary">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-primary">Gerenciamento</h2>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors">
                    <LogOut size={16} /> Sair
                  </button>
                  <button onClick={() => setShowPanel(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('agenda')}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-colors ${activeTab === 'agenda' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                  <CalendarDays size={18} /> Agenda
                </button>
                <button
                  onClick={() => setActiveTab('galeria')}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-colors ${activeTab === 'galeria' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                  <ImageIcon size={18} /> Galeria
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {activeTab === 'galeria' ? (
                  <>
                    {/* Upload Form (Gallery) */}
                    <section className="bg-surface-container-low p-6 rounded-2xl border border-surface-container-high">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                        <Plus size={16} /> Novo Item na Galeria
                      </h3>
                      <form onSubmit={handleUploadGallery} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-1">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
                          <select 
                            value={newItem.type}
                            onChange={e => setNewItem({...newItem, type: e.target.value})}
                            className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          >
                            <option value="foto">Foto</option>
                            <option value="video">Vídeo (YouTube ID)</option>
                          </select>
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Categoria</label>
                          <select 
                            value={newItem.category}
                            onChange={e => setNewItem({...newItem, category: e.target.value})}
                            className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          >
                            <option value="casamentos">Casamentos</option>
                            <option value="eventos">Eventos Sociais</option>
                            <option value="espacos">Nossos Espaços</option>
                          </select>
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            {newItem.type === 'foto' ? 'Arquivo de Imagem' : 'ID do Vídeo YouTube'}
                          </label>
                          {newItem.type === 'foto' ? (
                            <input 
                              id="file-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="w-full p-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                          ) : (
                            <input 
                              type="text"
                              placeholder="Ex: dQw4w9WgXcQ"
                              value={newItem.url}
                              onChange={e => setNewItem({...newItem, url: e.target.value})}
                              className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                          )}
                        </div>
                        <div className="flex items-end">
                          <button 
                            disabled={isUploading || (newItem.type === 'foto' ? !selectedFile : !newItem.url)}
                            className="w-full bg-primary text-white p-2.5 rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                          >
                            {isUploading ? 'Enviando...' : 'Adicionar'}
                          </button>
                        </div>
                      </form>
                    </section>

                    {/* Items List (Gallery) */}
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                        <LayoutGrid size={16} /> Itens Atuais ({galleryItems.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {galleryItems.map((item) => (
                          <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                            {item.type === 'foto' ? (
                              <img src={item.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full bg-black flex items-center justify-center text-white">
                                <Video size={32} className="opacity-50" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                              <span className="text-[10px] text-white/80 uppercase font-bold">{item.category}</span>
                              <button 
                                onClick={() => handleDeleteGallery(item.id)}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <div className="absolute top-2 left-2">
                              {item.type === 'foto' ? (
                                <div className="bg-blue-500 text-white p-1 rounded-md"><ImageIcon size={12} /></div>
                              ) : (
                                <div className="bg-red-600 text-white p-1 rounded-md"><Video size={12} /></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {galleryItems.length === 0 && (
                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                          Nenhum item carregado ainda.
                        </div>
                      )}
                    </section>
                  </>
                ) : (
                  <>
                    {/* Instalação do PWA (Instalar no Celular) banner */}
                    {!isStandalone && (
                      <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-2.5 w-full sm:w-auto">
                          <span className="text-xl">📱</span>
                          <div className="text-left">
                            <h4 className="font-bold text-amber-950 text-xs">Instalar Aplicativo no Celular</h4>
                            <p className="text-[10px] text-amber-700">Adicione o Rancho Branco à tela inicial do seu celular para testar como um aplicativo nativo.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
                            if (/iPad|iPhone|iPod/.test(userAgent) && !(window?.navigator as any)?.standalone) {
                              alert("No seu iPhone (iOS Safari):\n1. Toque no botão 'Compartilhar' (ícone de quadrado com seta para cima na barra inferior).\n2. Role para baixo e selecione 'Adicionar à Tela de Início'.\n3. Pronto! O app será instalado.");
                            } else {
                              alert("No seu Android ou Chrome:\n1. Clique nos três pontinhos no canto superior do navegador.\n2. Selecione 'Instalar aplicativo' ou 'Adicionar à tela inicial'.");
                            }
                          }}
                          className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm shrink-0"
                        >
                          Ver Como Instalar
                        </button>
                      </div>
                    )}

                    {/* Access Advanced Internal Agenda Banner */}
                    <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                          <CalendarDays size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm text-left">Painel Completo de Orçamentos & Contratos</h4>
                          <p className="text-xs text-gray-600 text-left">Acesse o painel avançado para preencher dados do cliente, gerar comprovantes e imprimir o PDF.</p>
                        </div>
                      </div>
                      <Link 
                        to="/agenda-interna"
                        onClick={() => setShowPanel(false)}
                        className="w-full md:w-auto whitespace-nowrap inline-flex items-center justify-center gap-2 bg-primary text-white py-2.5 px-5 rounded-xl font-medium hover:bg-primary/90 transition-all text-xs shadow-sm hover:shadow-md"
                      >
                        Acessar Nova Agenda Interna
                      </Link>
                    </div>

                    {/* Original Quick Block Form (Agenda) */}
                    <section className="bg-surface-container-low p-6 rounded-2xl border border-surface-container-high">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                        <Plus size={16} /> Bloquear Nova Data (Rápido)
                      </h3>
                      <form onSubmit={handleAddAgenda} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-1">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Data</label>
                          <input 
                            type="date"
                            value={newAgendaItem.dateString}
                            onChange={e => setNewAgendaItem({...newAgendaItem, dateString: e.target.value})}
                            className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                          <select 
                            value={newAgendaItem.status}
                            onChange={e => setNewAgendaItem({...newAgendaItem, status: e.target.value})}
                            className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          >
                            <option value="confirmed">Ocupada / Confirmada</option>
                            <option value="reserved">Reservada (Sem Confirmação)</option>
                          </select>
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Título/Nome</label>
                          <input 
                            type="text"
                            placeholder="Ex: Casamento João e Maria"
                            value={newAgendaItem.title}
                            onChange={e => setNewAgendaItem({...newAgendaItem, title: e.target.value})}
                            className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          />
                        </div>
                        <div className="flex items-end">
                          <button 
                            type="submit"
                            disabled={isAddingAgenda || !newAgendaItem.dateString || !newAgendaItem.title}
                            className="w-full bg-primary text-white p-2.5 rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                          >
                            {isAddingAgenda ? 'Enviando...' : 'Adicionar Data'}
                          </button>
                        </div>
                      </form>
                    </section>

                    {/* Items List (Agenda) - Displayed in the authentic "Datas Ocupadas" beige vintage card layout */}
                    <section className="mt-8">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                        <LayoutGrid size={16} /> Painel de Datas Atuais ({agendaItems.length})
                      </h3>
                      
                      <div className="flex flex-col items-center">
                        <div 
                          className="w-full max-w-2xl rounded-3xl overflow-hidden p-6 sm:p-10 shadow-lg relative flex flex-col items-center"
                          style={{ backgroundColor: '#FCF3EA', color: '#13214D' }}
                        >
                          {/* Decorative borders */}
                          <div className="absolute inset-2 border-[2px] border-[#13214D] rounded-2xl pointer-events-none" />
                          <div className="absolute inset-3 border-[1px] border-[#13214D] rounded-2xl pointer-events-none opacity-50" />
                          
                          {/* Vintage Corner Accents */}
                          <div className="absolute top-2 left-2 w-8 h-8 border-t-[3px] border-l-[3px] border-[#13214D] rounded-tl-md" />
                          <div className="absolute top-2 right-2 w-8 h-8 border-t-[3px] border-r-[3px] border-[#13214D] rounded-tr-md" />
                          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-[3px] border-l-[3px] border-[#13214D] rounded-bl-md" />
                          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-[3px] border-r-[3px] border-[#13214D] rounded-br-md" />

                          <div className="relative z-10 w-full flex flex-col items-center">
                            <div className="mb-6 text-center pt-2">
                              <h2 className="text-3xl font-bold tracking-tight mb-0 leading-none" style={{ fontFamily: '"Cinzel", serif' }}>
                                RANCHO BRANCO
                              </h2>
                              <div className="flex items-center justify-center relative mt-1.5">
                                 <div className="h-[1px] w-8 bg-[#13214D] absolute left-0" />
                                 <span className="font-light text-xl mx-8 px-2" style={{ fontFamily: '"Great Vibes", cursive' }}>
                                   Casa de Eventos
                                 </span>
                                 <div className="h-[1px] w-8 bg-[#13214D] absolute right-0" />
                              </div>
                            </div>
                            
                            <h3 className="text-3xl font-normal mb-6 text-[#BA8D49] text-center" style={{ fontFamily: '"Great Vibes", cursive' }}>
                              Datas Ocupadas
                            </h3>

                            <div className="w-full text-left space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                              {agendaItems.length === 0 ? (
                                <p className="text-center text-sm opacity-70 py-6" style={{ fontFamily: '"Playfair Display", serif' }}>
                                  Nenhuma data registrada no momento.
                                </p>
                              ) : (
                                (() => {
                                  // Group events by month for the card listing in admin
                                  const grouped: Record<string, any[]> = {};
                                  [...agendaItems].sort((a, b) => a.dateString.localeCompare(b.dateString)).forEach(item => {
                                    const dateObj = new Date(item.dateString + 'T00:00:00');
                                    const monthYear = !isNaN(dateObj.getTime())
                                      ? format(dateObj, 'MMMM yyyy', { locale: ptBR }).toUpperCase()
                                      : 'OUTRAS DATAS';
                                    if (!grouped[monthYear]) {
                                      grouped[monthYear] = [];
                                    }
                                    grouped[monthYear].push(item);
                                  });

                                  return Object.keys(grouped).map(monthYearStr => (
                                    <div key={monthYearStr} className="w-full flex flex-col py-1 text-center items-center">
                                      <div className="flex items-center justify-center w-full mb-2">
                                        <div className="h-[1px] bg-[#CAB28E] flex-grow" />
                                        <h4 className="px-3 tracking-widest text-[#13214D] text-xs font-bold" style={{ fontFamily: '"Cinzel", serif' }}>
                                          {monthYearStr}
                                        </h4>
                                        <div className="h-[1px] bg-[#CAB28E] flex-grow" />
                                      </div>
                                      <ul className="space-y-2 w-full flex flex-col items-center">
                                        {grouped[monthYearStr].map(item => {
                                          const dateObj = new Date(item.dateString + 'T00:00:00');
                                          const formattedDay = !isNaN(dateObj.getTime()) ? format(dateObj, 'dd/MM') : item.dateString;
                                          return (
                                            <li key={item.id} className="flex items-center justify-between text-[#13214D] w-full max-w-[400px] bg-[#13214D]/5 px-3 py-1.5 rounded-xl border border-[#13214D]/10">
                                              <div className="flex items-center min-w-0 pr-2">
                                                <span className="text-[#BA8D49] text-base mr-1.5 leading-none">⚜</span>
                                                <span className="font-bold text-base w-12 text-right shrink-0" style={{ fontFamily: '"Playfair Display", serif' }}>
                                                  {formattedDay}
                                                </span>
                                                <span className="mx-2 text-[#CAB28E] font-light">|</span>
                                                <span className="font-medium text-xs truncate" style={{ fontFamily: '"Playfair Display", serif' }} title={item.title}>
                                                  {item.title}
                                                </span>
                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ml-2 shrink-0 ${item.status === 'confirmed' ? 'bg-[#1A2D6C]/10 text-[#1A2D6C]' : 'bg-orange-100 text-orange-700'}`}>
                                                  {item.status === 'confirmed' ? 'Ocupada' : 'Reserva'}
                                                </span>
                                              </div>
                                              <button 
                                                onClick={() => handleDeleteAgenda(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1 shrink-0"
                                                title="Excluir data"
                                              >
                                                <Trash2 size={16} />
                                              </button>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    </div>
                                  ));
                                })()
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
