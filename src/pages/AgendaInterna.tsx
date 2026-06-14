import React, { useState, useEffect, useRef } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isBefore, startOfToday, parseISO, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Save, Printer, Edit2, LogIn, X, Clock, User, Phone, Mail, DollarSign, FileText, Share2, Download, MessageCircle } from 'lucide-react';
import { db, collection, onSnapshot, query, orderBy, setDoc, doc, deleteDoc, serverTimestamp } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { auth, googleProvider, signInWithPopup } from '../firebase';
import SEO from '../components/SEO';
import { toPng } from 'html-to-image';
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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const printCardRef = useRef<HTMLDivElement>(null);
  const [previewData, setPreviewData] = useState<{ blobUrl: string, imgData: string, clientName: string, blob?: Blob } | null>(null);

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
    setPreviewData(null);
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

  const generatePDFBlobAndImage = async () => {
    if (!receiptRef.current) return null;
    setIsGeneratingImage(true);
    try {
      await new Promise(r => setTimeout(r, 100)); // small delay to ensure rendering
      
      const toPngPromise = toPng(receiptRef.current, {
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("html-to-image timeout")), 15000)
      );

      const imgData = await Promise.race([toPngPromise, timeoutPromise]);
      
      const rectWidth = receiptRef.current.offsetWidth;
      const rectHeight = receiptRef.current.offsetHeight;
      
      const pdfWidth = 210;
      const pdfHeight = (rectHeight * pdfWidth) / rectWidth;
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const blob = pdf.output("blob");
      return { blob, imgData };
    } catch (err: any) {
      console.error(err);
      alert("Erro ao gerar PDF: " + (err.message || err.toString()));
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handlePreviewBudget = async () => {
    const data = await generatePDFBlobAndImage();
    if (!data) return;
    const url = URL.createObjectURL(data.blob);
    setPreviewData({
      blobUrl: url,
      imgData: data.imgData,
      blob: data.blob,
      clientName: formData?.clientName || 'Cliente'
    });
  };

  const handlePrintPDF = async () => {
    let blob = previewData?.blob;
    if (!blob) {
      const data = await generatePDFBlobAndImage();
      if (!data) return;
      blob = data.blob;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rancho-branco-reserva-${formData?.dateString || 'agenda'}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCardPDF = async () => {
    if (!printCardRef.current) return;
    setIsGeneratingPdf(true);
    try {
      await new Promise(r => setTimeout(r, 100));
      
      const el = printCardRef.current;
      const rectWidth = el.scrollWidth;
      const rectHeight = el.scrollHeight;
      
      const toPngPromise = toPng(el, {
        pixelRatio: 2,
        backgroundColor: '#FCF3EA',
        width: rectWidth,
        height: rectHeight,
        style: {
          maxHeight: 'none',
          height: `${rectHeight}px`,
          width: `${rectWidth}px`,
          transform: 'none',
          position: 'static',
          margin: '0',
          padding: '4rem'
        }
      });
      
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("html-to-image timeout")), 25000)
      );

      const imgData = await Promise.race([toPngPromise, timeoutPromise]);
      
      const pdfWidth = 210;
      const pdfHeight = (rectHeight * pdfWidth) / rectWidth;
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const blob = pdf.output("blob");
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `datas-ocupadas-${format(new Date(), 'yyyy-MM')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      alert("Erro ao gerar PDF: " + (err.message || err.toString()));
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleWhatsAppShare = async () => {
    if (!formData || !selectedDate) return;
    
    // Attempt native share if available (great for sending actual files on mobile)
    if (navigator.share) {
       let blob = previewData?.blob;
       if (!blob) {
         const data = await generatePDFBlobAndImage();
         if (data) blob = data.blob;
       }
       
       if (blob) {
         const fileName = `reserva-${formData.dateString}.pdf`;
         const file = new File([blob], fileName, { type: 'application/pdf' });
         if (navigator.canShare && navigator.canShare({ files: [file] })) {
             try {
               await navigator.share({
                 // explicitly ONLY passing files. If 'text' is provided, WhatsApp on Android often drops the file and only sends the text.
                 files: [file]
               });
               return; // successfully shared
             } catch (err: any) {
               console.log("Share canceled or failed", err);
               // If the user simply cancelled the share sheet, do not fallback to text message
               if (err.name === 'AbortError' || err.message?.includes('canceled') || err.message?.includes('cancelled')) {
                   return;
               }
             }
         }
       }
    }
    
    // Fallback: standard link
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const textMsg = `Olá! Segue o resumo do evento:\nData: ${format(selectedDate, "dd/MM/yyyy")}\nEvento: ${formData.title}\nValor: R$ ${formData.agreedValue || 'A combinar'}`;
    const waUrl = isMobile 
      ? `whatsapp://send?text=${encodeURIComponent(textMsg)}` 
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(textMsg)}`;
      
    window.open(waUrl, '_blank');
  };

  const handleEmailShare = () => {
    if (!formData || !selectedDate) return;
    const subject = `Orçamento / Reserva - Rancho Branco`;
    const body = `Olá!\n\nSegue o resumo do evento:\nData: ${format(selectedDate, "dd/MM/yyyy")}\nEvento: ${formData.title}\nValor: R$ ${formData.agreedValue || 'A combinar'}\n\nPor favor, informe seu endereço de e-mail e nos envie uma confirmação quando puder. Estamos anexando o orçamento em breve.`;
    const mailtoUrl = `mailto:${formData?.clientEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  const today = startOfToday();
  const confirmedFutureEvents = Object.values(events).filter(e => {
    const eDate = parseISO(e.dateString);
    return e.status === 'confirmed' && !isBefore(eDate, today);
  }).sort((a, b) => a.dateString.localeCompare(b.dateString));

  const groupedEvents: { [key: string]: InternaEvent[] } = {};
  confirmedFutureEvents.forEach(e => {
    const eDate = parseISO(e.dateString);
    const monthYear = format(eDate, 'MMMM yyyy', { locale: ptBR }).toUpperCase();
    if (!groupedEvents[monthYear]) {
      groupedEvents[monthYear] = [];
    }
    groupedEvents[monthYear].push(e);
  });

  return (
    <>
      <SEO title="Agenda Interna | Rancho Branco" description="Gestão interna de datas" />
      
      <div className="pt-24 pb-24 px-4 min-h-screen bg-surface md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto hide-on-print">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div>
                <h1 className="text-3xl font-serif text-primary">Agenda Interna</h1>
                <p className="text-on-surface-variant font-medium">Toque em uma data para gerenciar.</p>
              </div>
              <button 
                onClick={handleDownloadCardPDF}
                disabled={isGeneratingPdf}
                className="bg-white border border-[#13214D] text-[#13214D] hover:bg-[#13214D] hover:text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest transition-colors flex items-center gap-2 shadow-sm"
              >
                <Download size={18} />
                {isGeneratingPdf ? 'Gerando...' : 'Ficha de Datas'}
              </button>
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
      {previewData && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm hide-on-print">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b bg-surface">
              <h2 className="text-xl font-serif text-primary flex items-center gap-2">
                <FileText size={20} /> Orçamento: {previewData.clientName}
              </h2>
              <button onClick={() => setPreviewData(null)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100 flex justify-center items-start">
               <img src={previewData.imgData} alt="Pré-visualização do Orçamento" className="max-w-full h-auto shadow-md border border-gray-200" />
            </div>
            <div className="p-4 border-t flex flex-wrap sm:flex-nowrap gap-3 bg-surface-container-lowest">
               <button 
                  onClick={handleWhatsAppShare} 
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl font-medium transition-colors"
               >
                  <MessageCircle size={18} /> WhatsApp
               </button>
               <button 
                  onClick={handleEmailShare} 
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl font-medium transition-colors"
               >
                  <Mail size={18} /> E-mail
               </button>
               <button 
                  onClick={handlePrintPDF} 
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-xl font-medium transition-colors"
               >
                  <Download size={18} /> Baixar PDF
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Slide-over for event editing */}
      {selectedDate && formData && !previewData && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm hide-on-print">
          <div 
             className="bg-white w-full sm:max-w-2xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-slide-up"
          >
              <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-serif text-primary">
                {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </h2>
              <div className="flex gap-2">
                  <button onClick={handlePreviewBudget} disabled={isGeneratingImage} className="p-2 text-primary hover:text-white hover:bg-primary/90 rounded-full transition-colors hidden sm:flex items-center gap-2 px-4 shadow-sm border border-primary/20 disabled:opacity-50" title="Ver Orçamento">
                      <FileText size={18} /> {isGeneratingImage ? 'Gerando...' : 'Ver Orçamento'}
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
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                    onClick={handlePreviewBudget} 
                    disabled={isGeneratingImage}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary p-3 px-6 rounded-xl font-medium transition disabled:opacity-50"
                >
                    <FileText size={18} /> {isGeneratingImage ? 'Gerando...' : 'Ver Orçamento / PDF'}
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
      <div 
        className="fixed top-0 pointer-events-none" 
        style={{ left: '-9999px', width: '800px', backgroundColor: 'white' }}
      >
        {selectedDate && formData && (
           <div ref={receiptRef} className="p-12 font-serif shadow-none" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
             <div className="text-center mb-10 border-b pb-8" style={{ borderColor: '#d1d5db' }}>
               <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase" style={{ fontFamily: '"Cinzel", serif', color: '#13214D' }}>Rancho Branco</h1>
               <p className="text-xl italic" style={{ fontFamily: '"Great Vibes", cursive', color: '#4b5563' }}>Casa de Eventos</p>
             </div>

             
             <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: '#13214D' }}>Resumo de Orçamento / Reserva</h2>
             
             <div className="space-y-6 text-lg">
               <div className="flex justify-between border-b pb-2" style={{ borderColor: '#e5e7eb' }}>
                 <span className="font-bold" style={{ color: '#4b5563' }}>Data do Evento:</span>
                 <span>{format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
               </div>
               
               {formData.title && (
                 <div className="flex justify-between border-b pb-2" style={{ borderColor: '#e5e7eb' }}>
                   <span className="font-bold" style={{ color: '#4b5563' }}>Evento:</span>
                   <span>{formData.title}</span>
                 </div>
               )}

               <div className="flex justify-between border-b pb-2" style={{ borderColor: '#e5e7eb' }}>
                 <span className="font-bold" style={{ color: '#4b5563' }}>Cliente:</span>
                 <span>{formData.clientName || 'Não informado'}</span>
               </div>

               <div className="flex justify-between border-b pb-2" style={{ borderColor: '#e5e7eb' }}>
                 <span className="font-bold" style={{ color: '#4b5563' }}>Telefone / WhatsApp:</span>
                 <span>{formData.clientPhone || 'Não informado'}</span>
               </div>

               <div className="flex justify-between border-b pb-2" style={{ borderColor: '#e5e7eb' }}>
                 <span className="font-bold" style={{ color: '#4b5563' }}>E-mail:</span>
                 <span>{formData.clientEmail || 'Não informado'}</span>
               </div>

               <div className="mt-12 pt-10 border-t-2" style={{ borderColor: '#13214D' }}>
                 <div className="flex justify-between text-2xl font-bold">
                   <span style={{ color: '#13214D' }}>Valor Combinado:</span>
                   <span style={{ color: '#13214D' }}>R$ {formData.agreedValue || 'A combinar'}</span>
                 </div>
               </div>

               {formData.observations && (
                 <div className="mt-10 pt-6">
                   <h3 className="font-bold mb-4 uppercase text-sm tracking-wider" style={{ color: '#13214D' }}>Observações / Detalhes:</h3>
                   <p className="whitespace-pre-wrap p-6 border rounded-lg" style={{ color: '#1f2937', backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>{formData.observations}</p>
                 </div>
               )}
             </div>

             <div className="mt-16 pt-8 text-center text-sm border-t" style={{ color: '#6b7280', borderColor: '#f3f4f6' }}>
               <p>Este documento é apenas um resumo de orçamento e não garante a reserva sem a assinatura do contrato.</p>
               <p className="mt-2 font-bold uppercase text-xs tracking-widest text-[#13214D]">Rancho Branco Eventos</p>
             </div>
           </div>
        )}
      </div>

      {/* Hidden Layout for Canvas Generation */}
      <div 
        className="absolute pointer-events-none" 
        style={{ left: '-9999px', top: 0, width: '600px', backgroundColor: '#FCF3EA' }}
      >
        <div 
          ref={printCardRef}
          className="p-16 shadow-none relative flex flex-col items-center border-[20px] border-white"
          style={{ backgroundColor: '#FCF3EA', color: '#13214D' }}
        >
          {/* Decorative borders for the PDF */}
          <div className="absolute inset-4 border-[2px] border-[#13214D] pointer-events-none" />
          <div className="absolute inset-5 border-[1px] border-[#13214D] pointer-events-none opacity-50" />
          <div className="absolute top-4 left-4 w-8 h-8 border-t-[3px] border-l-[3px] border-[#13214D]" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-[3px] border-r-[3px] border-[#13214D]" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-[3px] border-l-[3px] border-[#13214D]" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-[3px] border-r-[3px] border-[#13214D]" />

          <div className="relative z-10 w-full flex flex-col items-center mb-10 pt-4">
            <h2 className="text-6xl font-bold tracking-tight mb-0 leading-none text-center" style={{ fontFamily: '"Cinzel", serif', color: '#13214D' }}>
              RANCHO
            </h2>
            <h2 className="text-6xl font-bold tracking-tight leading-none mb-1 text-center" style={{ fontFamily: '"Cinzel", serif', color: '#13214D' }}>
              &nbsp;BRANCO
            </h2>
            <div className="flex items-center justify-center relative mt-3 w-full max-w-[320px]">
               <div className="h-[1.5px] bg-[#13214D] flex-grow" />
               <span className="font-light text-3xl mx-6" style={{ fontFamily: '"Great Vibes", cursive', color: '#13214D' }}>
                 Casa de Eventos
               </span>
               <div className="h-[1.5px] bg-[#13214D] flex-grow" />
            </div>
            
            <h3 className="text-6xl font-normal mt-16 text-[#BA8D49] text-center" style={{ fontFamily: '"Great Vibes", cursive' }}>
              Datas Ocupadas
            </h3>
          </div>

          <div className="w-full text-left space-y-8 mb-4">
            {Object.keys(groupedEvents).length === 0 ? (
              <p className="text-center text-xl opacity-70" style={{ fontFamily: '"Playfair Display", serif' }}>
                Nenhuma data registrada no momento.
              </p>
            ) : (
              Object.keys(groupedEvents).map(monthYearStr => (
                <div key={monthYearStr} className="w-full flex inset-0 flex-col pt-4">
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-[1px] bg-[#CAB28E] flex-grow max-w-[120px]" />
                    <h4 className="px-6 tracking-widest text-[#13214D] text-2xl font-bold" style={{ fontFamily: '"Cinzel", serif' }}>
                      {monthYearStr}
                    </h4>
                    <div className="h-[1px] bg-[#CAB28E] flex-grow max-w-[120px]" />
                  </div>
                  <ul className="space-y-4 w-full flex flex-col items-center">
                    {groupedEvents[monthYearStr].map(ev => {
                      const evDate = parseISO(ev.dateString);
                      return (
                        <li key={ev.id} className="flex items-center text-[#13214D] w-full max-w-[400px]">
                          <span className="text-[#BA8D49] text-3xl mr-4 flex-shrink-0">⚜</span>
                          <span className="font-bold text-2xl w-24 text-right flex-shrink-0" style={{ fontFamily: '"Playfair Display", serif' }}>
                            {format(evDate, 'dd/MM')}
                          </span>
                          <span className="mx-5 text-[#CAB28E] font-light flex-shrink-0">|</span>
                          <span className="font-medium text-2xl whitespace-normal flex-1" style={{ fontFamily: '"Playfair Display", serif' }}>
                            {ev.title}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

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
