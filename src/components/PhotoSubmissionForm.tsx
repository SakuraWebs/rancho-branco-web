import React, { useState, useRef } from 'react';
import { Upload, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function PhotoSubmissionForm({ source = "Site" }: { source?: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('success=true')) {
      setStatus('success');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 10MB');
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formRef.current) {
      alert('Por favor, selecione uma foto.');
      return;
    }

    setStatus('loading');

    try {
      // 1. Upload da imagem para o Firebase Storage
      const fileExtension = file.name.split('.').pop();
      const fileName = `submissions/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const storageRef = ref(storage, fileName);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // 2. Coletar os dados do formulário
      const formData = new FormData(formRef.current);
      
      // Atualizar o assunto do email com a origem
      formData.set('_subject', `Nova Foto Enviada (${source}) - Rancho Branco`);
      
      // 3. Adicionar o link da imagem aos dados que vão para o email
      formData.append('Link da Foto (Clique para abrir)', downloadURL);
      
      // Remover o arquivo físico do envio do email para evitar bloqueios do FormSubmit
      formData.delete('attachment');

      // 4. Enviar para o FormSubmit via AJAX
      const response = await fetch("https://formsubmit.co/ajax/enrique.rfm@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Falha no envio do email');
      }

      setStatus('success');
      setFile(null);
      setPreview(null);
      formRef.current.reset();
    } catch (error: any) {
      console.error("Erro no processo de envio:", error);
      setStatus('error');
      
      if (error.code && error.code.includes('storage/unauthorized')) {
        alert('Erro de permissão no servidor de imagens. Por favor, contate o administrador para liberar o envio de arquivos.');
      } else {
        alert('Ocorreu um erro ao enviar a foto. Por favor, tente novamente mais tarde.');
      }
      setStatus('idle');
    }
  };

  return (
    <section className="py-24 bg-surface-container-low px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Compartilhe sua Memória</h2>
          <p className="text-on-surface-variant font-light">
            Sua foto no Rancho Branco pode fazer parte da nossa galeria oficial. 
            Envie sua imagem e, após nossa curadoria, ela será publicada.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 border border-green-200 p-8 rounded-2xl text-center"
            >
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-serif text-green-900 mb-2">Recebemos sua foto!</h3>
              <p className="text-green-800 mb-6">Obrigado por compartilhar esse momento conosco. Analisaremos a imagem e em breve ela poderá aparecer em nosso site.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="text-green-700 font-bold hover:underline"
              >
                Enviar outra foto
              </button>
            </motion.div>
          ) : (
            <motion.form 
              ref={formRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-6 bg-surface p-8 md:p-10 rounded-3xl shadow-ambient border border-outline-variant/20"
            >
              <input type="hidden" name="_subject" value={`Nova Foto Enviada (${source}) - Rancho Branco`} />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Seu Nome</label>
                  <input
                    required
                    type="text"
                    name="Nome"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Ex: Maria Silva"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Seu E-mail</label>
                  <input
                    required
                    type="email"
                    name="Email"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Ex: maria@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Data do Evento</label>
                  <input
                    required
                    type="date"
                    name="Data do Evento"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Responsável/Fotógrafo</label>
                  <input
                    required
                    type="text"
                    name="Responsável/Fotógrafo"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Nome de quem tirou a foto"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Descrição/Legenda</label>
                <textarea
                  name="Descrição"
                  rows={3}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Conte um pouco sobre esse momento..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-primary uppercase tracking-wider block">A Foto</label>
                <div className="relative">
                  <input
                    type="file"
                    name="attachment"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label 
                    htmlFor="photo-upload"
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${preview ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary hover:bg-primary/5'}`}
                  >
                    {preview ? (
                      <div className="relative w-full h-full p-4">
                        <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20 rounded-xl">
                          <p className="text-white font-bold">Trocar Imagem</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-12 h-12 text-primary/40 mb-4" />
                        <p className="mb-2 text-sm text-on-surface-variant">
                          <span className="font-bold text-primary">Clique para enviar</span> ou arraste e solte
                        </p>
                        <p className="text-xs text-on-surface-variant/60">PNG, JPG ou WEBP (Max. 10MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-on-surface-variant/70 bg-surface-container-highest/30 p-4 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 text-primary" />
                <p>Ao enviar esta foto, você declara possuir os direitos autorais ou autorização para publicação e concede ao Rancho Branco o direito de exibi-la em seus canais oficiais.</p>
              </div>

              <button
                disabled={status === 'loading'}
                type="submit"
                className="w-full bg-primary text-on-primary py-5 rounded-full font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    Enviar para Aprovação
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
