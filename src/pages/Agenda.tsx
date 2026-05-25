import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isBefore, startOfToday, parseISO, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';
import { db, collection, onSnapshot, query, orderBy } from '../firebase';

interface AgendaEvent {
  id: string;
  dateString: string; // YYYY-MM-DD
  status: 'confirmed' | 'reserved';
  title: string;
}

export default function Agenda() {
  const [currentDate, setCurrentDate] = useState(startOfToday());
  const [events, setEvents] = useState<AgendaEvent[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'agenda'), orderBy('dateString', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: AgendaEvent[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as AgendaEvent);
      });
      setEvents(items);
    });

    return () => unsubscribe();
  }, []);

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

  const getEventForDay = (date: Date) => {
    return events.find(e => {
      const eDate = parseISO(e.dateString);
      return isSameDay(eDate, date);
    });
  };

  const handleDateClick = (date: Date) => {
    const event = getEventForDay(date);
    if (!event || event.status === 'reserved') {
      const dateStr = format(date, "dd/MM/yyyy");
      const message = `Olá, gostaria de reservar a data ${dateStr} no Rancho Branco.`;
      window.open(`https://wa.me/5555981727725?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const today = startOfToday();
  const confirmedFutureEvents = events.filter(e => {
    const eDate = parseISO(e.dateString);
    return e.status === 'confirmed' && !isBefore(eDate, today);
  });

  // Group events by month for the sidebar
  const groupedEvents: { [key: string]: AgendaEvent[] } = {};
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
      <SEO 
        title="Agenda e Reservas | Espaço para Casamentos e Eventos | Rancho Branco" 
        description="Verifique nosso calendário de reservas. Confira as datas disponíveis e programe seu casamento ou evento social no Rancho Branco. Faça sua reserva!"
        canonical="https://ranchobranco.com.br/agenda"
      />
      
      <div className="pt-40 md:pt-48 pb-24 px-4 md:px-12 lg:px-24 bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 relative">
            <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6">Agenda de Eventos e Reservas</h1>
            <p className="text-lg text-on-surface-variant font-light max-w-2xl mx-auto">
              Verifique nosso calendário atualizado e garanta a data para o seu casamento ou evento no Rancho Branco. As reservas para 2026 e 2027 já estão ativas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Aesthetic Sidebar (Datas Ocupadas based on image reference) */}
            <div className="lg:col-span-5 md:block">
              <div 
                className="rounded-xl overflow-hidden p-8 sm:p-12 shadow-ambient relative flex flex-col items-center"
                style={{ backgroundColor: '#FCF3EA', color: '#13214D' }}
              >
                {/* Decorative border approximations since we don't have SVGs yet */}
                <div className="absolute inset-2 border-[2px] border-[#13214D] rounded-sm pointer-events-none" />
                <div className="absolute inset-3 border-[1px] border-[#13214D] rounded-sm pointer-events-none opacity-50" />
                
                {/* Vintage Corner Accents (Approximation via CSS) */}
                <div className="absolute top-2 left-2 w-8 h-8 border-t-[3px] border-l-[3px] border-[#13214D] rounded-tl-lg" />
                <div className="absolute top-2 right-2 w-8 h-8 border-t-[3px] border-r-[3px] border-[#13214D] rounded-tr-lg" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-[3px] border-l-[3px] border-[#13214D] rounded-bl-lg" />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-[3px] border-r-[3px] border-[#13214D] rounded-br-lg" />

                <div className="relative z-10 w-full flex flex-col items-center">
                  <div className="mb-8 text-center pt-4">
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-0 leading-none" style={{ fontFamily: '"Cinzel", serif', textShadow: '2px 2px 4px rgba(0,0,0,0.05)' }}>
                      RANCHO
                    </h2>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-none mb-1 text-center" style={{ fontFamily: '"Cinzel", serif', textShadow: '2px 2px 4px rgba(0,0,0,0.05)' }}>
                      &nbsp;BRANCO
                    </h2>
                    <div className="flex items-center justify-center relative mt-2">
                       <div className="h-[1px] w-12 bg-[#13214D] absolute left-0" />
                       <span className="font-light text-2xl mx-8 px-2" style={{ fontFamily: '"Great Vibes", cursive', transform: 'rotate(-2deg)' }}>
                         Casa de Eventos
                       </span>
                       <div className="h-[1px] w-12 bg-[#13214D] absolute right-0" />
                    </div>
                  </div>
                  
                  <h3 className="text-4xl sm:text-5xl font-normal mb-8 text-[#BA8D49] drop-shadow-sm text-center" style={{ fontFamily: '"Great Vibes", cursive' }}>
                    Datas Ocupadas
                  </h3>

                  <div className="w-full text-left space-y-6 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.keys(groupedEvents).length === 0 ? (
                      <p className="text-center text-sm opacity-70" style={{ fontFamily: '"Playfair Display", serif' }}>
                        Nenhuma data registrada no momento.
                      </p>
                    ) : (
                      Object.keys(groupedEvents).map(monthYearStr => (
                        <div key={monthYearStr} className="w-full flex inset-0 flex-col py-1">
                          <div className="flex items-center justify-center mb-1">
                            <div className="h-[1px] bg-[#CAB28E] flex-grow" />
                            <h4 className="px-4 tracking-widest text-[#13214D] text-sm sm:text-base md:text-lg font-bold" style={{ fontFamily: '"Cinzel", serif' }}>
                              {monthYearStr}
                            </h4>
                            <div className="h-[1px] bg-[#CAB28E] flex-grow" />
                          </div>
                          <ul className="space-y-1 w-full flex flex-col items-center">
                            {groupedEvents[monthYearStr].map(ev => {
                              const evDate = parseISO(ev.dateString);
                              return (
                                <li key={ev.id} className="flex items-center text-[#13214D] w-full max-w-[280px]">
                                  <span className="text-[#BA8D49] text-xl mr-2">⚜</span>
                                  <span className="font-bold text-lg sm:text-xl w-16 text-right" style={{ fontFamily: '"Playfair Display", serif' }}>
                                    {format(evDate, 'dd/MM')}
                                  </span>
                                  <span className="mx-3 text-[#CAB28E] font-light">|</span>
                                  <span className="font-medium text-sm sm:text-[17px] truncate" style={{ fontFamily: '"Playfair Display", serif' }} title={ev.title}>
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
            </div>

            {/* Calendar Widget */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 md:p-10 shadow-ambient border border-outline-variant/10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-serif text-primary capitalize">
                    {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                  </h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={prevMonth}
                      className="p-3 rounded-full hover:bg-surface-container transition-colors text-primary"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={nextMonth}
                      className="p-3 rounded-full hover:bg-surface-container transition-colors text-primary"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="text-center font-bold text-on-surface-variant text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 md:gap-2">
                  {calendarDays.map((day, i) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const event = getEventForDay(day);
                    const isPast = isBefore(day, today) && !isSameDay(day, today);
                    
                    let bgClass = "hover:bg-surface-container-high transition-colors cursor-pointer group";
                    let title = "Data Livre";
                    let hasGradient = false;
                    let borderClass = "border border-[#13214D]/40"; // Subtle border in logo color for available days

                    // Apply status styles
                    if (event) {
                      if (event.status === 'confirmed') {
                        bgClass = "bg-[#1A2D6C]/50 text-white cursor-not-allowed";
                        borderClass = "border border-outline-variant/10"; // Remove special border for occupied
                        title = "Data Ocupada";
                      } else if (event.status === 'reserved') {
                        hasGradient = true;
                        title = "Reservada (Não confirmada)";
                      }
                    }

                    // Soften past days
                    if (isPast && (!event || event.status !== 'confirmed')) {
                        bgClass = "opacity-30 cursor-not-allowed bg-transparent";
                        borderClass = "border border-outline-variant/10"; // Remove special border for past days
                        title = "Data passada";
                    }

                    // Hide click styles for past dates
                    const isClickable = !isPast && (!event || event.status !== 'confirmed');

                    return (
                      <div 
                        key={i} 
                        className={`aspect-square relative rounded-xl ${borderClass} overflow-hidden flex items-center justify-center ${!isCurrentMonth ? 'opacity-30' : ''} ${bgClass}`}
                        onClick={() => isClickable ? handleDateClick(day) : undefined}
                        title={title}
                      >
                        {hasGradient && (
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1A2D6C]/50 pointer-events-none" />
                        )}
                        <span className="relative z-10 font-medium text-lg">
                          {format(day, 'd')}
                        </span>
                        
                        {isClickable && (
                          <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-xl pointer-events-none transition-all"></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-wrap gap-4 items-center justify-center text-sm md:text-base border-t border-outline-variant/10 pt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md border border-[#13214D]/40"></div>
                    <span className="text-on-surface-variant font-medium">Livre</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#1A2D6C]/50 border border-outline-variant/10"></div>
                    <span className="text-on-surface-variant font-medium">Ocupada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-r from-transparent to-[#1A2D6C]/50 border border-[#13214D]/40"></div>
                    <span className="text-on-surface-variant font-medium">Reservada (Não confirmada)</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
