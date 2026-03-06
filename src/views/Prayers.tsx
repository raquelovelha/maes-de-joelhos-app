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
  togglePrayed 
}) => {
  const [activeTab, setActiveTab] = useState<'motivos' | 'intercedidos'>('motivos');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Categorias completas conforme solicitado
  const categories = ['Todos', 'SALVAÇÃO', 'PROTEÇÃO', 'CRESCIMENTO', 'SAÚDE', 'ESTUDOS', 'AMIGOS', 'FAMÍLIA', 'IGREJA'];

  const filteredPrayers = useMemo(() => {
    return prayers.filter(p => {
      // 1. Filtro de Aba (Força a separação real)
      const matchesTab = activeTab === 'motivos' ? !p.isPrayed : p.isPrayed;
      if (!matchesTab) return false;

      // 2. Filtro de Categoria
      if (selectedCategory === 'Todos') return true;
      return p.category?.toUpperCase() === selectedCategory.toUpperCase();
    });
  }, [prayers, activeTab, selectedCategory]);

  return (
    <div className="space-y-6 pb-24 px-4 pt-4 animate-fadeIn">
      <header>
        <h2 className="serif-font text-3xl font-bold text-[#2D1B4D]">Alvos de Oração</h2>
        <p className="text-[#FF4D8C] text-[10px] font-black uppercase tracking-widest">Desperta Débora</p>
      </header>

      {/* SELETOR DE ABAS - Reforçado para evitar travamento */}
      <div className="flex bg-gray-200 p-1 rounded-2xl shadow-inner">
        <button 
          onClick={() => setActiveTab('motivos')}
          className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${
            activeTab === 'motivos' ? 'bg-white text-[#FF4D8C] shadow-sm' : 'text-gray-500'
          }`}
        >
          MOTIVOS PENDENTES
        </button>
        <button 
          onClick={() => setActiveTab('intercedidos')}
          className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${
            activeTab === 'intercedidos' ? 'bg-white text-[#FF4D8C] shadow-sm' : 'text-gray-500'
          }`}
        >
          INTERCEDIDOS
        </button>
      </div>

      {/* CATEGORIAS - Com rolagem lateral garantida */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-[10px] font-black whitespace-nowrap border transition-all ${
              selectedCategory === cat ? 'bg-[#FF5722] text-white' : 'bg-white text-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LISTA DE CARDS */}
      <div className="space-y-4">
        {filteredPrayers.length > 0 ? (
          filteredPrayers.map(p => (
            <div key={`${p.id}-${p.isPrayed}`} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 animate-slideUp">
              <div className="flex justify-between mb-4">
                <span className="text-[9px] font-black text-[#FF5722] bg-orange-50 px-3 py-1 rounded-full uppercase italic">
                  {p.category}
                </span>
                <button onClick={() => toggleFavorite(p.id)}>
                  <i className={`fa-${p.isFavorite ? 'solid' : 'regular'} fa-star ${p.isFavorite ? 'text-pink-500' : 'text-gray-200'}`}></i>
                </button>
              </div>

              <h3 className="font-bold text-[#2D1B4D] text-lg mb-2">{p.title}</h3>
              <p className="text-gray-500 text-sm italic mb-6">"{p.description}"</p>

              <div className="flex gap-2">
                <button 
                  onClick={() => togglePrayed(p.id)}
                  className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    p.isPrayed ? 'bg-green-100 text-green-600' : 'bg-[#FF5722] text-white shadow-lg'
                  }`}
                >
                  <i className={`fa-solid ${p.isPrayed ? 'fa-rotate-left' : 'fa-hand-holding-heart'} mr-2`}></i>
                  {p.isPrayed ? 'VOLTAR PARA MOTIVOS' : 'INTERCEDER'}
                </button>

                {p.isPrayed && (
                  <button 
                    onClick={() => {
                      const text = encodeURIComponent(`🙏 Glória a Deus! Intercedi hoje por: "${p.title}" no App do Desperta Débora. 🌸`);
                      window.open(`https://wa.me/?text=${text}`, '_blank');
                    }}
                    className="bg-green-500 text-white p-4 rounded-2xl shadow-lg"
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-400 italic text-sm">
            Nenhum alvo encontrado aqui.
          </div>
        )}
      </div>
    </div>
  );
};

export default Prayers;