import React, { useState, useMemo } from 'react';
import { PrayerRequest } from '../types';

interface PrayersProps {
  prayers: PrayerRequest[];
  toggleFavorite: (id: number) => void;
  togglePrayed: (id: number) => void;
  updateNote: (id: number, note: string) => void;
  nomesFilhos?: string[];
}

const PrayersView: React.FC<PrayersProps> = ({ 
  prayers, 
  toggleFavorite, 
  togglePrayed, 
  updateNote, 
  nomesFilhos = [] 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Proteção contra duplicação e ordenação por ID
  const uniquePrayers = useMemo(() => {
    const seen = new Set();
    return prayers.filter(p => {
      const duplicate = seen.has(p.id);
      seen.add(p.id);
      return !duplicate;
    }).sort((a, b) => a.id - b.id);
  }, [prayers]);

  const categories = ['Todos', ...Array.from(new Set(uniquePrayers.map(p => p.categoria)))];

  const filteredPrayers = uniquePrayers.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      p.texto.toLowerCase().includes(searchLower) || 
      p.categoria.toLowerCase().includes(searchLower);
    
    const matchesCategory = selectedCategory === 'Todos' || p.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleShare = (p: PrayerRequest) => {
    const text = `*Desperta Débora - Motivo de Oração*\n\n*Tema:* ${p.categoria}\n\n*Oração:* ${p.texto}\n\n📖 _${p.versiculo}_`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24 px-2">
      {/* HEADER AJUSTADO - REMOVIDO "101 DIAS" */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="serif-font text-3xl font-bold text-brand-dark">Motivos de Oração</h2>
          <p className="text-[10px] text-[#FF4500] font-black uppercase tracking-[0.2em] mt-1">Mães de joelhos, filhos de pé</p>
        </div>
        
        <div className="space-y-3">
          <div className="relative group">
            <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-orange-300"></i>
            <input 
              type="text" 
              placeholder="Buscar por tema (ex: Salvação)..." 
              className="w-full bg-white border border-orange-100 rounded-[2rem] py-4 pl-12 pr-6 text-sm focus:outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  selectedCategory === cat 
                  ? 'bg-[#FF4500] text-white border-[#FF4500]' 
                  : 'bg-white text-gray-400 border-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LISTA DE MOTIVOS */}
      <div className="space-y-6">
        {filteredPrayers.length > 0 ? (
          filteredPrayers.map(p => (
            <div key={p.id} className={`bg-white rounded-[2.5rem] p-6 border shadow-sm transition-all relative overflow-hidden ${p.isPrayed ? 'bg-gray-50/40 opacity-90' : 'border-orange-50'}`}>
              
              {/* TAG DE TEMA - REMOVIDO "DIA XX" */}
              <div className="flex items-start justify-between mb-5">
                <div className="bg-orange-50 px-4 py-1.5 rounded-full border border-orange-100">
                   <span className="text-[10px] font-black text-[#FF4500] uppercase tracking-tighter">
                     Tema: {p.categoria}
                   </span>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => toggleFavorite(p.id)} className={`transition-all ${p.isFavorite ? 'text-yellow-400' : 'text-gray-200'}`}>
                    <i className={`fa-${p.isFavorite ? 'solid' : 'regular'} fa-star text-xl`}></i>
                  </button>
                  <button onClick={() => handleShare(p)} className="text-gray-200 hover:text-green-500">
                    <i className="fa-solid fa-share-nodes text-xl"></i>
                  </button>
                </div>
              </div>

              {/* TEXTO DA ORAÇÃO */}
              <div className="relative mb-6">
                <i className="fa-solid fa-quote-left absolute -top-2 -left-2 text-orange-100 text-3xl -z-10"></i>
                <p className="text-base text-brand-dark font-medium leading-relaxed pl-2">
                  {p.texto}
                </p>
              </div>
              
              {/* VERSÍCULO BÍBLICO */}
              <div className="bg-gradient-to-r from-orange-50 to-white border-l-4 border-[#FF4500] p-5 rounded-r-3xl mb-6 shadow-inner">
                <div className="flex items-center gap-2 mb-1 text-[#FF4500]">
                  <i className="fa-solid fa-book-bible text-[10px]"></i>
                  <span className="text-[9px] font-black uppercase tracking-widest">A Palavra de Deus</span>
                </div>
                <p className="text-sm text-brand-dark italic font-serif">
                  "{p.versiculo}"
                </p>
              </div>

              {/* ANOTAÇÕES E BOTÃO CONCLUIR */}
              <div className="space-y-4 pt-4 border-t border-gray-50">
                <textarea 
                  placeholder="Minhas anotações..."
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.5rem] p-4 text-xs h-20 resize-none"
                  value={p.personalNotes || ''}
                  onChange={(e) => updateNote(p.id, e.target.value)}
                />

                <button 
                  onClick={() => togglePrayed(p.id)}
                  className={`w-full py-4.5 rounded-full text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
                    p.isPrayed 
                    ? 'bg-green-100 text-green-600 border border-green-200' 
                    : 'bg-[#FF4500] text-white shadow-lg shadow-orange-200'
                  }`}
                >
                  <i className={`fa-solid ${p.isPrayed ? 'fa-check-circle' : 'fa-pray'}`}></i>
                  {p.isPrayed ? 'CONCLUÍDO HOJE' : 'MARCAR COMO ORADO'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-orange-100 text-gray-400">
            <p className="text-sm font-black uppercase tracking-widest">Nenhum motivo encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayersView;