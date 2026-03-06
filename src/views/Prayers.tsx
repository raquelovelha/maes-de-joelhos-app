import React, { useState, useMemo } from 'react';
import { PrayerRequest } from '../types';

interface PrayersProps {
  prayers: PrayerRequest[];
  toggleFavorite: (id: number) => void;
  togglePrayed: (id: number) => void;
}

const Prayers: React.FC<PrayersProps> = ({ prayers, toggleFavorite, togglePrayed }) => {
  const [activeTab, setActiveTab] = useState<'atuais' | 'intercedidos'>('atuais');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');

  const categorias = ['TODOS', 'SALVAÇÃO', 'PROTEÇÃO', 'CRESCIMENTO', 'SAÚDE', 'ESTUDOS', 'AMIGOS'];

  const filteredPrayers = useMemo(() => {
    return prayers.filter(p => {
      // Filtro de Aba
      const matchesTab = activeTab === 'atuais' ? !p.isPrayed : p.isPrayed;
      if (!matchesTab) return false;

      // Filtro de Categoria com De-seleção
      if (selectedCategory !== 'TODOS') {
        if (p.categoria.toUpperCase() !== selectedCategory.toUpperCase()) return false;
      }
      return true;
    });
  }, [prayers, activeTab, selectedCategory]);

  return (
    <div className="pb-44 px-4 space-y-6 bg-[#FFF5F1] min-h-screen">
      <div className="pt-6">
        <h2 className="serif-font text-3xl font-bold text-[#2D1B4D]">Motivos de Oração</h2>
        <p className="text-[10px] font-black text-[#FF4D8C] uppercase tracking-[0.2em]">Mães de joelhos, filhos de pé</p>
      </div>

      {/* SELETOR DE ABAS */}
      <div className="flex bg-white/60 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
        <button 
          onClick={() => setActiveTab('atuais')}
          className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${
            activeTab === 'atuais' ? 'bg-white text-[#FF4D8C] shadow-md' : 'text-gray-400'
          }`}
        >
          Motivos
        </button>
        <button 
          onClick={() => setActiveTab('intercedidos')}
          className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${
            activeTab === 'intercedidos' ? 'bg-white text-[#FF4D8C] shadow-md' : 'text-gray-400'
          }`}
        >
          Intercedidos
        </button>
      </div>

      {/* CATEGORIAS */}
      <div className="flex flex-wrap gap-2">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(prev => prev === cat ? 'TODOS' : cat)}
            className={`px-4 py-2 rounded-full text-[10px] font-black transition-all border ${
              selectedCategory === cat ? 'bg-[#FF5722] text-white border-[#FF5722]' : 'bg-white text-gray-400 border-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LISTAGEM */}
      <div className="space-y-6">
        {filteredPrayers.length > 0 ? (
          filteredPrayers.map((prayer) => (
            <div 
              key={`card-${activeTab}-${prayer.id}`} 
              className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-50 space-y-5 animate-slideUp"
            >
              <div className="flex justify-between items-center">
                <span className="bg-[#FFF7ED] text-[#FF5722] text-[9px] font-black px-4 py-1.5 rounded-full uppercase">
                  {prayer.categoria}
                </span>
                <button onClick={() => toggleFavorite(prayer.id)}>
                  <i className={`fa-${prayer.isFavorite ? 'solid' : 'regular'} fa-star text-lg ${prayer.isFavorite ? 'text-[#FF4D8C]' : 'text-gray-200'}`}></i>
                </button>
              </div>

              <p className="text-[#2D1B4D] text-lg font-medium leading-relaxed">{prayer.texto}</p>

              <button 
                onClick={() => togglePrayed(prayer.id)}
                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                  prayer.isPrayed ? 'bg-green-500 text-white' : 'bg-[#FF5722] text-white shadow-lg'
                }`}
              >
                <i className={`fa-solid ${prayer.isPrayed ? 'fa-check-circle' : 'fa-hands-praying'}`}></i>
                {prayer.isPrayed ? 'REMOVER DOS INTERCEDIDOS' : 'CONFIRMAR ORAÇÃO'}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-300 italic text-sm">Nenhum pedido encontrado.</div>
        )}
      </div>
    </div>
  );
};

export default Prayers;