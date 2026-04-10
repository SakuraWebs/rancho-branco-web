import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup, signOut } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, LogOut, Shield, Plus, Trash2, Image as ImageIcon, Video, X, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, OperationType, handleFirestoreError, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminPanel() {
  const { user, isAdmin, loading } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [newItem, setNewItem] = useState({ type: 'foto', url: '', category: 'casamentos' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
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

    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGalleryItems(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'gallery');
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed', error);
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

  const handleUpload = async (e: React.FormEvent) => {
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

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `gallery/${id}`);
    }
  };

  if (loading) return null;

  if (!user) {
    if (!showLoginTrigger) return null;
    return (
      <div className="fixed bottom-4 right-4 z-50">
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
      <div className="fixed bottom-4 right-4 z-50">
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
      <div className="fixed bottom-4 right-4 z-50">
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
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b flex items-center justify-between bg-surface-container-lowest">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl text-primary">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-primary">Administração da Galeria</h2>
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

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Upload Form */}
                <section className="bg-surface-container-low p-6 rounded-2xl border border-surface-container-high">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                    <Plus size={16} /> Novo Item
                  </h3>
                  <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                {/* Items List */}
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
                            onClick={() => handleDelete(item.id)}
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
