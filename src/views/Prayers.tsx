import React, { useState, useMemo } from 'react';
import { PrayerRequest } from '../types';

interface PrayersProps {
  prayers: PrayerRequest[];
  toggleFavorite: (id: number) => void;
  togglePrayed: (id: number) => void;
  updateNote: (id: number, note: string) => void;
}

const Prayers: React.FC<PrayersProps> = ({ 
  prayers = [], 
  toggleFavorite, 
  togglePrayed, 
  updateNote 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [activeTab, setActiveTab] = useState<'motivos' | 'intercedidos'>('motivos');

  const categories = ['Todos', 'SALVAÇÃO', 'PROTEÇÃO', 'CRESCIMENTO', 'SAÚDE', 'ESTUDOS', 'AMIGOS'];

  // FILTRO: Garante que o item mude de aba imediatamente ao clicar no botão
  const filteredPrayers = useMemo(() => {
    const list = Array.isArray(prayers) ? prayers : [];
    return list.filter(p => {
      if (!p) return false;

      // Lógica de Abas
      const matchesTab = activeTab === 'motivos' ? !p.isPrayed : p.isPrayed;
      if (!matchesTab) return false;

      // Lógica de Categorias
      const pCat = p.category ? String(p.category).toUpperCase() : 'GERAL';
      const matchesCategory = selectedCategory === 'Todos' || pCat === selectedCategory.toUpperCase();
      
      // Lógica de Busca
      const title = (p.title || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return matchesCategory && (title.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase()));
    });
  }, [prayers, activeTab, selectedCategory, searchTerm]);

  return (
    <div className="space-y-6 pb-24 px-4 animate-fadeIn">
      <div className="pt-6 space-y-5">
        <div>
          <h2 className="serif-font text-3xl font-bold text-[#2D1B4D] leading-tight">
            Alvos de Oração
          </h2>
          <p className="text-[#FF4D8C] text-[10px] font-black uppercase tracking-[0.15em] mt-1">
            Desperta Débora
          </p>
        </div>

        {/* SELETOR DE ABAS */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
          <button 
            onClick={() => setActiveTab('motivos')}
            className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase ${
              activeTab === 'motivos' ? 'bg-white shadow-md text-[#FF4D8C]' : 'text-gray-400'
            }`}
          >
            MOTIVOS
          </button>
          <button 
            onClick={() => setActiveTab('intercedidos')}
            className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase ${
              activeTab === 'intercedidos' ? 'bg-white shadow-md text-[#FF4D8C]' : 'text-gray-400'
            }`}
          >
            INTERCEDIDOS
          </button>
        </div>

        {/* CATEGORIAS */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
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

      <div className="space-y-6">
        {filteredPrayers.length > 0 ? (
          filteredPrayers.map(p => (
            <div key={`${p.id}-${p.isPrayed}`} className="bg-white rounded-[2.5rem] p-7 border border-gray-100 shadow-sm animate-slideUp">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-black text-[#FF5722] uppercase bg-[#FFF7ED] px-4 py-1.5 rounded-full">
                  {p.category}
                </span>
                <button onClick={() => toggleFavorite(p.id)}>
                  <i className={`fa-${p.isFavorite ? 'solid' : 'regular'} fa-star text-xl ${p.isFavorite ? 'text-[#FF4D8C]' : 'text-gray-200'}`}></i>
                </button>
              </div>

              <h3 className="font-bold text-[#2D1B4D] text-xl mb-3">{p.title}</h3>
              <div className="bg-[#FFF5F2] p-5 rounded-3xl mb-5 text-base italic border-l-4 border-[#FF5722]">
                "{p.description}"
              </div>

              <button 
                onClick={() => togglePrayed(p.id)}
                className={`w-full py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 ${
                  p.isPrayed 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-100' 
                    : 'bg-[#FF5722] text-white shadow-lg shadow-orange-100'
                }`}
              >
                <i className={`fa-solid ${p.isPrayed ? 'fa-circle-check animate-bounce' : 'fa-hand-holding-heart'}`}></i>
                {p.isPrayed ? 'CONCLUÍDO (Toque para voltar)' : 'INTERCEDER'}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100 mx-2">
            <p className="text-gray-400 italic text-sm px-6">
              {activeTab === 'motivos' 
                ? 'Glória a Deus! Todos os alvos foram intercedidos hoje.' 
                : 'Sua lista de intercessões concluídas aparecerá aqui.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prayers;