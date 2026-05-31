import React, { useState, useEffect, useRef } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isBefore, startOfToday, parseISO, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Save, Printer, Edit2, LogIn, X, Clock, User, Phone, Mail, DollarSign, FileText, Share2, Download, MessageCircle } from 'lucide-react';
import { db, collection, onSnapshot, query, orderBy, setDoc, doc, deleteDoc, serverTimestamp } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { auth, googleProvider, signInWithPopup } from '../firebase';
import SEO from '../components/SEO';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface InternaEvent {
  id: string; // usually same as date string
  dateString: string; // YYYY-MM-DD
  status: 'confirmed' | 'reserved' | 'free';
  title: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  agreedValue: string;
  observations: string;
  createdAt?: any;
  updatedAt?: any;
}

export default function AgendaInterna() {
  const { user, isAdmin, loading } = useAuth();
  
  const [currentDate, setCurrentDate] = useState(startOfToday());
  const [events, setEvents] = useState<Record<string, InternaEvent>>({});
  
  // Modal state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState<InternaEvent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'agenda'), orderBy('dateString', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Record<string, InternaEvent> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as InternaEvent;
        // fallback to map old 'agenda' data structure just in case, but agenda_interna is separate
        items[data.dateString] = { id: docSnap.id, ...data };
      });
      setEvents(items);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      alert('Erro ao fazer login: ' + (error.message || 'Erro desconhecido'));
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <SEO title="Acesso Restrito - Agenda Interna" description="" />
        <div className="bg-white p-8 rounded-3xl shadow-ambient max-w-md w-full text-center">
          <h1 className="text-3xl font-serif text-primary mb-2">Agenda Interna</h1>
          <p className="text-on-surface-variant mb-8">Acesso restrito para equipe.</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2"
          >
            <LogIn size={20} /> Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Calendar setup
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - getDay(monthStart));
  
  const endDate = new Date(monthEnd);
  if (getDay(monthEnd) !== 6) {
    endDate.setDate(endDate.getDate() + (6 - getDay(monthEnd)));
  }

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingDate = events[dateStr];
    
    setSelectedDate(date);
    
    if (existingDate) {
      setFormData(existingDate);
    } else {
      setFormData({
        id: dateStr,
        dateString: dateStr,
        status: 'free',
        title: '',
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        agreedValue: '',
        observations: ''
      });
    }
  };

  const closeModal = () => {
    setSelectedDate(null);
    setFormData(null);
  };

  const handleSave = async () => {
    if (!formData || !selectedDate) return;
    
    setIsSaving(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      const docIdToUse = formData.id || dateStr;
      const docRef = doc(db, 'agenda', docIdToUse);
      
      // Clean up undefined values
      const cleanData: any = {};
      Object.keys(formData).forEach(k => {
          const key = k as keyof typeof formData;
          if (formData[key] !== undefined) cleanData[key] = formData[key];
      });
      cleanData.dateString = dateStr; // Ensure date string is correct
      cleanData.updatedAt = serverTimestamp();
      
      if (formData.status === 'free') {
        // If they marked it free and there's not much other info, we might just delete it
        if (!formData.clientName && !formData.agreedValue && !formData.observations) {
            await deleteDoc(docRef);
        } else {
            await setDoc(docRef, cleanData, { merge: true });
        }
      } else {
        cleanData.title = formData.title || (formData.clientName ? `Reserva: ${formData.clientName}` : 'Nova Reserva');
        await setDoc(docRef, cleanData, { merge: true });
      }
      closeModal();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar');
    } finally {
      setIsSaving(false);
    }
  };

  const generatePDFBlob = async () => {
    if (!receiptRef.current) return null;
    setIsGeneratingImage(true);
    try {
      await new Promise(r => setTimeout(r, 100)); // small delay to ensure rendering
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // If height is greater than A4 page height (approx 297mm), we can scale it down or let it overflow (usually fits)
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      return pdf.output("blob");
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handlePrintPDF = async () => {
    const blob = await generatePDFBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rancho-branco-reserva-${formData?.dateString || 'agenda'}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleWhatsAppShare = async () => {
    if (!formData || !selectedDate) return;
    
    const blob = await generatePDFBlob();
    if (!blob) return;
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const fileName = `reserva-${formData.dateString}.pdf`;
    const file = new File([blob], fileName, { type: 'application/pdf' });
    
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
         await navigator.share({
           title: 'Reserva Rancho Branco',
           text: `Aqui está o orçamento/reserva para o evento especial em ${format(selectedDate, "dd/MM/yyyy")}.`,
           files: [file]
         });
      } else {
         // Fallback: download the file and prompt text
         handlePrintPDF(); // Trigger download
         
         const textMsg = `Olá! Segue o resumo do evento:\nData: ${format(selectedDate, "dd/MM/yyyy")}\nEvento: ${formData.title}\nValor: R$ ${formData.agreedValue || 'A combinar'}`;
         const waUrl = isMobile 
           ? `whatsapp://send?text=${encodeURIComponent(textMsg)}` 
           : `https://web.whatsapp.com/send?text=${encodeURIComponent(textMsg)}`;
           
         if (!isMobile) {
            // timeout to allow download dialogue
            setTimeout(() => {
                alert("O PDF foi baixado. Você pode anexá-lo agora no WhatsApp Web.");
                window.open(waUrl, '_blank');
            }, 500);
         } else {
             window.open(waUrl, '_blank');
         }
      }
    } catch (shareErr) {
      console.error("Erro ao compartilhar", shareErr);
    }
  };

  return (
    <>
      <SEO title="Agenda Interna | Rancho Branco" description="Gestão interna de datas" />
      
      <div className="pt-24 pb-24 px-4 min-h-screen bg-surface md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto hide-on-print">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-serif text-primary">Agenda Interna</h1>
              <p className="text-on-surface-variant font-medium">Toque em uma data para gerenciar.</p>
            </div>
            {/* Quick stats could go here */}
          </div>

          <div className="bg-white rounded-3xl p-4 md:p-8 shadow-ambient border border-outline-variant/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif text-primary capitalize">
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </h2>
              <div className="flex gap-1 bg-surface-container rounded-full p-1 border border-outline-variant/20">
                <button onClick={prevMonth} className="p-2 rounded-full hover:bg-white transition-colors text-primary shadow-sm hover:shadow-md">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextMonth} className="p-2 rounded-full hover:bg-white transition-colors text-primary shadow-sm hover:shadow-md">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="text-center font-bold text-on-surface-variant text-[10px] md:text-sm py-1 md:py-2 truncate">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {calendarDays.map((day, i) => {
                const isCurrentMonth = isSameMonth(day, currentDate);
                const dateStr = format(day, 'yyyy-MM-dd');
                const event = events[dateStr];
                const isPast = isBefore(day, startOfToday()) && !isSameDay(day, startOfToday());
                
                let bgClass = "bg-white border border-[#13214D]/20 text-[#13214D]";
                
                if (event) {
                    if (event.status === 'confirmed') {
                        bgClass = "bg-[#1A2D6C] text-white border-[#1A2D6C]";
                    } else if (event.status === 'reserved') {
                        bgClass = "bg-orange-100 text-orange-800 border-orange-300";
                    }
                }

                if (isPast && (!event || event.status !== 'confirmed')) {
                    bgClass = "opacity-30 cursor-not-allowed bg-transparent border-gray-200 text-gray-400";
                }

                const isClickable = !isPast || (event && event.status === 'confirmed');

                return (
                  <button 
                    key={i}
                    onClick={() => isClickable ? handleDateClick(day) : undefined}
                    className={`
                      aspect-square rounded-xl flex flex-col items-center justify-center p-1 md:p-2 relative
                      transition-all ${isClickable ? 'hover:ring-2 hover:ring-primary/40' : ''}
                      ${!isCurrentMonth ? 'opacity-30' : ''}
                      ${bgClass}
                    `}
                  >
                    <span className="font-bold text-sm md:text-xl">{format(day, 'd')}</span>
                    {event && event.clientName && (
                        <span className="text-[8px] md:text-xs leading-tight truncate w-full text-center mt-1 hidden md:block px-1 opacity-90">
                           {event.clientName.split(' ')[0]}
                        </span>
                    )}
                    {event && event.status !== 'free' && (
                        <span className="block md:hidden w-1.5 h-1.5 rounded-full bg-current absolute bottom-1.5 shadow-sm"></span>
                    )}
                  </button>
                )
              })}
            </div>
            
            <div className="mt-6 flex flex-wrap gap-4 items-center justify-center text-xs md:text-sm border-t border-outline-variant/10 pt-4">
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 border border-[#13214D]/40 rounded-sm"></div> Livre</div>
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded-sm"></div> Em Negociação</div>
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-[#1A2D6C] border border-[#1A2D6C] rounded-sm"></div> Ocupada</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal / Slide-over for event editing */}
      {selectedDate && formData && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm hide-on-print">
          <div 
             className="bg-white w-full sm:max-w-2xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-slide-up"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-serif text-primary">
                {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </h2>
              <div className="flex gap-2">
                  <button onClick={handleWhatsAppShare} disabled={isGeneratingImage} className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors hidden sm:block disabled:opacity-50" title="Compartilhar WhatsApp">
                      <MessageCircle size={20} />
                  </button>
                  <button onClick={handlePrintPDF} className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors hidden sm:block" title="Imprimir Orçamento">
                      <Printer size={20} />
                  </button>
                  <button onClick={closeModal} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} />
                  </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 print-content">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status Selection */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status da Data</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button 
                            onClick={() => setFormData({...formData, status: 'free'})}
                            className={`py-3 px-2 rounded-xl text-sm font-medium border transition-colors ${formData.status === 'free' ? 'bg-gray-100 border-gray-400 text-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            Livre
                        </button>
                        <button 
                            onClick={() => setFormData({...formData, status: 'reserved'})}
                            className={`py-3 px-2 rounded-xl text-sm font-medium border transition-colors ${formData.status === 'reserved' ? 'bg-orange-100 border-orange-400 text-orange-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            Negociação
                        </button>
                        <button 
                            onClick={() => setFormData({...formData, status: 'confirmed'})}
                            className={`py-3 px-2 rounded-xl text-sm font-medium border transition-colors flex items-center justify-center gap-1 ${formData.status === 'confirmed' ? 'bg-[#1A2D6C] border-[#1A2D6C] text-white shadow-md' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Save size={14} className={formData.status === 'confirmed' ? '' : 'hidden'} /> Ocupada
                        </button>
                    </div>
                  </div>

                  {/* Title (Optional) */}
                  <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Edit2 size={12}/> Resumo/Título do Evento</label>
                      <input 
                         type="text" 
                         value={formData.title} 
                         onChange={e => setFormData({...formData, title: e.target.value})}
                         placeholder="Ex: Casamento João e Maria"
                         className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                  </div>

                  <div className="md:col-span-2 mt-4 border-t pt-4">
                      <h4 className="text-sm font-bold text-primary mb-4">Dados do Cliente e Orçamento</h4>
                  </div>

                  {/* Client Name */}
                  <div className="md:col-span-2">
                       <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><User size={12}/> Nome Completo</label>
                       <input 
                         type="text" 
                         value={formData.clientName} 
                         onChange={e => setFormData({...formData, clientName: e.target.value})}
                         placeholder="Ex: Maria Antonieta"
                         className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                  </div>

                  {/* Phone */}
                  <div>
                       <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Phone size={12}/> WhatsApp / Telefone</label>
                       <input 
                         type="text" 
                         value={formData.clientPhone} 
                         onChange={e => setFormData({...formData, clientPhone: e.target.value})}
                         placeholder="(  ) _____"
                         className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                  </div>

                  {/* Email */}
                  <div>
                       <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Mail size={12}/> E-mail</label>
                       <input 
                         type="email" 
                         value={formData.clientEmail} 
                         onChange={e => setFormData({...formData, clientEmail: e.target.value})}
                         placeholder="email@exemplo.com"
                         className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                  </div>

                  {/* Value */}
                  <div>
                       <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><DollarSign size={12}/> Valor Combinado (R$)</label>
                       <input 
                         type="text" 
                         value={formData.agreedValue} 
                         onChange={e => setFormData({...formData, agreedValue: e.target.value})}
                         placeholder="Ex: 5.500,00"
                         className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                  </div>
                  
                  <div className="hidden md:block"></div> {/* Spacer */}

                  {/* Observations */}
                  <div className="md:col-span-2">
                       <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><FileText size={12}/> Observações / Detalhes</label>
                       <textarea 
                         value={formData.observations} 
                         onChange={e => setFormData({...formData, observations: e.target.value})}
                         placeholder="Detalhes do contrato, necessidades especiais, forma de pagamento..."
                         className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px] resize-y"
                      />
                  </div>
              </div>

            </div>

            <div className="p-4 border-t flex flex-col sm:flex-row gap-3 bg-surface-container-lowest sm:items-center">
              <div className="flex gap-2 sm:hidden w-full">
                <button 
                    onClick={handleWhatsAppShare} 
                    disabled={isGeneratingImage}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl font-medium disabled:opacity-50"
                >
                    <MessageCircle size={18} /> {isGeneratingImage ? 'Gerando...' : 'WhatsApp'}
                </button>
                <button 
                    onClick={handlePrintPDF} 
                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 p-3 rounded-xl font-medium"
                >
                    <Printer size={18} /> Imprimir
                </button>
              </div>
              
              <div className="flex-1 hidden sm:block">
                  {/* Space for layout */}
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                     onClick={closeModal} 
                     className="flex-1 sm:flex-none border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                     Cancelar
                  </button>
                  <button 
                     onClick={handleSave}
                     disabled={isSaving}
                     className="flex-1 sm:flex-none bg-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2"
                  >
                     {isSaving ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printer Layout (Only visible when printing) */}
      {selectedDate && formData && (
         <div className="hidden print:block print:absolute print:left-0 print:top-0 print:w-full print:bg-white print:z-[9999] p-8 text-black font-serif">
           <div className="text-center mb-12 border-b pb-8">
             <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase" style={{ fontFamily: '"Cinzel", serif' }}>Rancho Branco</h1>
             <p className="text-xl italic text-gray-600" style={{ fontFamily: '"Great Vibes", cursive' }}>Casa de Eventos</p>
           </div>
           
           <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Orçamento Adicional / Reserva</h2>
           
           <div className="space-y-6 text-lg">
             <div className="flex justify-between border-b border-gray-200 pb-2">
               <span className="font-bold text-gray-600">Data do Evento:</span>
               <span>{format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
             </div>
             
             {formData.title && (
               <div className="flex justify-between border-b border-gray-200 pb-2">
                 <span className="font-bold text-gray-600">Evento:</span>
                 <span>{formData.title}</span>
               </div>
             )}

             <div className="flex justify-between border-b border-gray-200 pb-2">
               <span className="font-bold text-gray-600">Cliente:</span>
               <span>{formData.clientName || 'Não informado'}</span>
             </div>

             <div className="flex justify-between border-b border-gray-200 pb-2">
               <span className="font-bold text-gray-600">Telefone / WhatsApp:</span>
               <span>{formData.clientPhone || 'Não informado'}</span>
             </div>

             <div className="flex justify-between border-b border-gray-200 pb-2">
               <span className="font-bold text-gray-600">E-mail:</span>
               <span>{formData.clientEmail || 'Não informado'}</span>
             </div>

             <div className="mt-12 pt-12 border-t-2 border-gray-800">
               <div className="flex justify-between text-2xl font-bold">
                 <span>Valor Combinado:</span>
                 <span>R$ {formData.agreedValue || '0,00'}</span>
               </div>
             </div>

             {formData.observations && (
               <div className="mt-12 pt-8">
                 <h3 className="font-bold text-gray-600 mb-4 uppercase text-sm tracking-wider">Observações / Detalhes do Acordo:</h3>
                 <p className="whitespace-pre-wrap text-gray-800 bg-gray-50 p-6 border border-gray-200 rounded-lg">{formData.observations}</p>
               </div>
             )}
           </div>

           <div className="mt-24 pt-8 text-center text-sm text-gray-500">
             <p>Este documento é apenas um resumo de orçamento e não garante a reserva sem a assinatura do contrato.</p>
             <p className="mt-2">Rancho Branco Eventos</p>
           </div>
         </div>
      )}

      {/* Hidden Receipt Layout for Canvas Generation */}
      {selectedDate && formData && (
         <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '800px' }}>
           <div ref={receiptRef} className="bg-white p-12 text-black font-serif border border-gray-200 shadow-md">
             <div className="text-center mb-10 border-b pb-8">
               <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase" style={{ fontFamily: '"Cinzel", serif', color: '#13214D' }}>Rancho Branco</h1>
               <p className="text-xl italic text-gray-600" style={{ fontFamily: '"Great Vibes", cursive' }}>Casa de Eventos</p>
             </div>
             
             <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: '#13214D' }}>Resumo de Orçamento / Reserva</h2>
             
             <div className="space-y-6 text-lg">
               <div className="flex justify-between border-b border-gray-200 pb-2">
                 <span className="font-bold text-gray-600">Data do Evento:</span>
                 <span>{format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
               </div>
               
               {formData.title && (
                 <div className="flex justify-between border-b border-gray-200 pb-2">
                   <span className="font-bold text-gray-600">Evento:</span>
                   <span>{formData.title}</span>
                 </div>
               )}

               <div className="flex justify-between border-b border-gray-200 pb-2">
                 <span className="font-bold text-gray-600">Cliente:</span>
                 <span>{formData.clientName || 'Não informado'}</span>
               </div>

               <div className="flex justify-between border-b border-gray-200 pb-2">
                 <span className="font-bold text-gray-600">Telefone / WhatsApp:</span>
                 <span>{formData.clientPhone || 'Não informado'}</span>
               </div>

               <div className="flex justify-between border-b border-gray-200 pb-2">
                 <span className="font-bold text-gray-600">E-mail:</span>
                 <span>{formData.clientEmail || 'Não informado'}</span>
               </div>

               <div className="mt-12 pt-10 border-t-2 border-[#13214D]">
                 <div className="flex justify-between text-2xl font-bold">
                   <span style={{ color: '#13214D' }}>Valor Combinado:</span>
                   <span style={{ color: '#13214D' }}>R$ {formData.agreedValue || 'A combinar'}</span>
                 </div>
               </div>

               {formData.observations && (
                 <div className="mt-10 pt-6">
                   <h3 className="font-bold text-[#13214D] mb-4 uppercase text-sm tracking-wider">Observações / Detalhes:</h3>
                   <p className="whitespace-pre-wrap text-gray-800 bg-gray-50 p-6 border border-gray-200 rounded-lg">{formData.observations}</p>
                 </div>
               )}
             </div>

             <div className="mt-16 pt-8 text-center text-sm text-gray-500 border-t border-gray-100">
               <p>Este documento é apenas um resumo de orçamento e não garante a reserva sem a assinatura do contrato.</p>
               <p className="mt-2 font-bold uppercase text-xs tracking-widest text-[#13214D]">Rancho Branco Eventos</p>
             </div>
           </div>
         </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact;
          }
          body * {
            visibility: hidden;
          }
          .hide-on-print {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 auto;
            padding: 20mm !important;
          }
          .print\\:absolute {
            position: absolute !important;
          }
          .print\\:left-0 {
            left: 0 !important;
          }
          .print\\:top-0 {
            top: 0 !important;
          }
          .print\\:w-full {
            width: 100% !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          .print\\:z-\\[9999\\] {
            z-index: 9999 !important;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
        }
        @keyframes slide-up {
           from { transform: translateY(100%); opacity: 0; }
           to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
           animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </>
  );
}
