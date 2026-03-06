import React, { useState, useMemo } from 'react';
import { PrayerRequest } from '../types';

interface PrayersProps {
  prayers: PrayerRequest[];
  toggleFavorite: (id: number) => void;
  togglePrayed: (id: number) => void;
  updateNote: (id: number, note: string) => void;
}

const Prayers: React.FC<PrayersProps> = ({ prayers = [], toggleFavorite, togglePrayed, updateNote }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [activeTab, setActiveTab] = useState<'motivos' | 'intercedidos'>('motivos');

  const categories = ['Todos', 'SALVAÇÃO', 'PROTEÇÃO', 'CRESCIMENTO', 'SAÚDE', 'ESTUDOS', 'AMIGOS'];

  // Lógica de filtragem reativa
  const filteredPrayers = useMemo(() => {
    return prayers.filter(p => {
      if (!p) return false;

      // 1. Separação por Abas (Motivos = Não Orados | Intercedidos = Orados)
      const matchesTab = activeTab === 'motivos' ? !p.isPrayed : p.isPrayed;
      if (!matchesTab) return false;

      // 2. Filtro de Categoria com De-seleção
      const pCat = p.category ? String(p.category).toUpperCase() : 'GERAL';
      const matchesCategory = selectedCategory === 'Todos' || pCat === selectedCategory.toUpperCase();
      
      // 3. Filtro de Busca
      const title = (p.title || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const matchesSearch = title.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [prayers, activeTab, selectedCategory, searchTerm]);

  return (
    <div className="space-y-6 pb-24 px-4 animate-fadeIn bg-[#FFFBF9] min-h-screen">
      <div className="pt-6 space-y-5">
        <div className="flex flex-col gap-1">
          <h2 className="serif-font text-3xl font-bold text-[#2D1B4D]">Motivos de Oração</h2>
          <p className="text-[10px] font-black text-[#FF4D8C] uppercase tracking-[0.2em]">Mães de joelhos, filhos de pé</p>
        </div>

        {/* SELETOR DE ABAS (Layout Imagem 8) */}
        <div className="flex bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
          <button 
            onClick={() => setActiveTab('motivos')}
            className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-wider ${
              activeTab === 'motivos' ? 'bg-white shadow-md text-[#FF4D8C]' : 'text-gray-400'
            }`}
          >
            MOTIVOS
          </button>
          <button 
            onClick={() => setActiveTab('intercedidos')}
            className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-wider ${
              activeTab === 'intercedidos' ? 'bg-white shadow-md text-[#FF4D8C]' : 'text-gray-400'
            }`}
          >
            INTERCEDIDOS
          </button>
        </div>

        {/* BUSCA */}
        <div className="relative">
          <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
          <input 
            type="text" 
            placeholder="Buscar por tema ou palavra..." 
            className="w-full bg-white border border-gray-100 rounded-full py-3.5 px-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D8C]/10 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* CATEGORIAS (Chips com scroll horizontal) */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(prev => prev === cat ? 'Todos' : cat)}
              className={`px-5 py-2 rounded-full text-[10px] font-black border transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-[#FF5722] text-white border-[#FF5722] shadow-md' 
                  : 'bg-white text-gray-400 border-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* LISTAGEM DE CARDS */}
      <div className="space-y-6">
        {filteredPrayers.length > 0 ? (
          filteredPrayers.map(p => (
            <div 
              key={`${p.id}-${p.isPrayed}`} // Key dinâmica para forçar re-render do botão
              className="bg-white rounded-[2.5rem] p-7 border border-gray-50 shadow-sm animate-slideUp relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-black text-[#FF5722] uppercase bg-[#FFF7ED] px-4 py-1.5 rounded-full">
                  {p.category || 'Geral'}
                </span>
                <div className="flex gap-4">
                  <button onClick={() => toggleFavorite(p.id)} className="transition-transform active:scale-125">
                    <i className={`fa-${p.isFavorite ? 'solid' : 'regular'} fa-star text-xl ${p.isFavorite ? 'text-[#FF4D8C]' : 'text-gray-200'}`}></i>
                  </button>
                  <button className="text-gray-200 hover:text-[#FF4D8C]">
                    <i className="fa-solid fa-share-nodes text-xl"></i>
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-[#2D1B4D] text-xl mb-3 leading-tight">{p.title}</h3>
              
              <div className="bg-[#FFF5F2] p-5 rounded-3xl mb-5 text-base text-[#2D1B4D] leading-relaxed italic border-l-4 border-[#FF5722]/30">
                "{p.description}"
                {p.verse && (
                  <p className="mt-4 text-xs font-bold not-italic text-[#FF5722] flex items-center gap-2">
                    <i className="fa-solid fa-book-open"></i> {p.verse}
                  </p>
                )}
              </div>

              <textarea 
                placeholder="Escreva sua oração ou anotação aqui..."
                className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.5rem] p-4 text-xs mb-5 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF4D8C]/5 transition-all"
                value={p.personalNotes || ''}
                onChange={(e) => updateNote(p.id, e.target.value)}
              />

              {/* BOTÃO INTERCEDER / INTERCEDIDO */}
              <button 
                onClick={() => togglePrayed(p.id)}
                className={`w-full py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg ${
                  p.isPrayed 
                    ? 'bg-green-500 text-white shadow-green-100' // VERDE
                    : 'bg-[#FF5722] text-white shadow-[#FF5722]/20' // LARANJA
                }`}
              >
                <i className={`fa-solid ${p.isPrayed ? 'fa-check-circle' : 'fa-hand-holding-heart'} text-sm`}></i>
                {p.isPrayed ? 'INTERCEDIDO' : 'INTERCEDER'}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-24 px-10">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-feather-pointed text-2xl text-gray-200"></i>
             </div>
             <p className="text-gray-400 text-sm italic font-serif">Nenhum pedido encontrado nesta lista.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prayers;
