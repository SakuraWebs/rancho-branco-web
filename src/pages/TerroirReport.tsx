import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { db, collection, query, orderBy, onSnapshot } from '../firebase';
import SEO from '../components/SEO';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Star, MessageSquare, ThumbsUp, Heart, Users } from 'lucide-react';


interface FeedbackItem {
  id: string;
  rating: number;
  favorite: string;
  comments: string;
  name: string;
  recommend: boolean | null;
  createdAt: any;
}

export default function TerroirReport() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'terroir_feedback'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeedbackItem));
      setFeedback(items);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching feedback:", err);
      setError("Não foi possível carregar os dados. Verifique as permissões ou a conexão.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCF3EA] flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FCF3EA] flex items-center justify-center pt-24 px-4 text-center">
        <p className="text-red-500 font-bold">{error}</p>
      </div>
    );
  }

  // Calculate metrics
  const totalResponses = feedback.length;
  const averageRating = totalResponses > 0 
    ? (feedback.reduce((acc, curr) => acc + curr.rating, 0) / totalResponses).toFixed(1)
    : "0.0";
    
  const recommendCount = feedback.filter(f => f.recommend === true).length;
  const recommendPercentage = totalResponses > 0 
    ? Math.round((recommendCount / feedback.filter(f => f.recommend !== null).length) * 100) || 0
    : 0;

  // Rating Distribution
  const ratingCounts = [1, 2, 3, 4, 5].map(star => ({
    name: `${star} Estrelas`,
    quantidade: feedback.filter(f => f.rating === star).length
  }));

  // Recommend Data for Pie Chart
  const notRecommendCount = feedback.filter(f => f.recommend === false).length;
  const recommendData = [
    { name: 'Sim', value: recommendCount },
    { name: 'Não', value: notRecommendCount }
  ];
  const COLORS = ['#13214D', '#E5E7EB'];

  return (
    <div className="min-h-screen bg-[#FCF3EA] text-[#13214D] font-sans pt-32 md:pt-48 pb-12 px-4 sm:px-6">
      <SEO 
        title="Relatório de Feedback - 1º Terroir & Tradição" 
        description="Relatório de resultados e satisfação do evento."
      />
      
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Relatório de Resultados</h1>
          <p className="text-lg text-primary/70">1º Terroir & Tradição - Rancho Branco</p>
        </motion.div>

          {totalResponses === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl shadow-sm">
              <p className="text-primary/60">Ainda não há avaliações registradas.</p>
            </div>
          ) : (
            <>
              {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center">
                <Users className="w-8 h-8 text-primary/40 mb-3" />
                <p className="text-sm font-bold uppercase tracking-wider text-primary/60 mb-1">Total de Avaliações</p>
                <p className="text-4xl font-serif text-primary">{totalResponses}</p>
              </div>
              
              <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center">
                <Star className="w-8 h-8 text-yellow-500 mb-3" fill="currentColor" />
                <p className="text-sm font-bold uppercase tracking-wider text-primary/60 mb-1">Nota Média</p>
                <p className="text-4xl font-serif text-primary">{averageRating} <span className="text-lg text-primary/40">/ 5.0</span></p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center">
                <ThumbsUp className="w-8 h-8 text-primary/40 mb-3" />
                <p className="text-sm font-bold uppercase tracking-wider text-primary/60 mb-1">Recomendariam</p>
                <p className="text-4xl font-serif text-primary">{recommendPercentage}%</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-3xl shadow-sm">
                <h3 className="text-xl font-serif text-primary mb-6 text-center">Distribuição de Notas</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ratingCounts} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                      <Tooltip 
                        cursor={{fill: '#f3f4f6'}}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="quantidade" fill="#13214D" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm">
                <h3 className="text-xl font-serif text-primary mb-6 text-center">Recomendaria o evento?</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={recommendData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {recommendData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#13214D]"></div>
                    <span className="text-sm font-medium">Sim ({recommendCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#E5E7EB]"></div>
                    <span className="text-sm font-medium">Não ({notRecommendCount})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Feedback List */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm">
              <h3 className="text-2xl font-serif text-primary mb-8">Avaliações Detalhadas</h3>
              <div className="space-y-6">
                {feedback.map((item) => (
                  <div key={item.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{item.name}</span>
                        <span className="text-sm text-gray-400">
                          {item.createdAt?.toDate().toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < item.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    {item.favorite && (
                      <div className="mb-3">
                        <p className="text-xs font-bold uppercase text-primary/50 mb-1 flex items-center gap-1">
                          <Heart className="w-3 h-3" /> Aspecto Favorito
                        </p>
                        <p className="text-gray-700">{item.favorite}</p>
                      </div>
                    )}
                    
                    {item.comments && (
                      <div>
                        <p className="text-xs font-bold uppercase text-primary/50 mb-1 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Comentários
                        </p>
                        <p className="text-gray-700 italic">"{item.comments}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
