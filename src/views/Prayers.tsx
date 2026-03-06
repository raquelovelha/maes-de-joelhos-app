import React, { useState, useMemo } from 'react';
import { PrayerRequest } from '../types';

interface PrayersProps {
  prayers: PrayerRequest[];
  toggleFavorite: (id: number) => void;
  togglePrayed: (id: number) => void;
  updateNote: (id: number, note: string) => void;
  nomesFilhos: string[];
}

const Prayers: React.FC<PrayersProps> = ({ prayers, toggleFavorite, togglePrayed, updateNote }) => {
  const [activeTab, setActiveTab] = useState<'atuais' | 'realizadas'>('atuais');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');

  const categorias = ['TODOS', 'SALVAÇÃO', 'PROTEÇÃO', 'CRESCIMENTO', 'SAÚDE', 'ESTUDOS', 'AMIGOS'];

  // FILTRO ULTRA-RIGOROSO
  const filteredPrayers = useMemo(() => {
    // Debug para ver se há IDs duplicados (olhe o console do navegador F12)
    console.log("IDs na lista:", prayers.map(p => p.id));

    return prayers.filter(p => {
      // 1. Filtro de Aba (Essencial)
      const matchesTab = activeTab === 'atuais' ? !p.isPrayed : p.isPrayed;
      if (!matchesTab) return false;

      // 2. Filtro de Categoria
      const pCat = (p.categoria || "").toUpperCase().trim();
      const sCat = selectedCategory.toUpperCase().trim();
      if (sCat !== 'TODOS' && pCat !== sCat) return false;

      // 3. Filtro de Busca
      const term = searchTerm.toLowerCase().trim();
      if (term !== "") {
        const textMatch = (p.texto || "").toLowerCase().includes(term);
        const catMatch = pCat.toLowerCase().includes(term);
        if (!textMatch && !catMatch) return false;
      }

      return true;
    });
  }, [prayers, activeTab, searchTerm, selectedCategory]);

  return (
    <div className="pb-40 px-4 space-y-6 bg-[#FFF5F1] min-h-screen">
      
      {/* HEADER */}
      <div className="pt-6">
        <h2 className="serif-font text-3xl font-bold text-[#2D1B4D]">Motivos de Oração</h2>
        <p className="text-[10px] font-black text-[#FF4D8C] uppercase tracking-[0.2em]">Sincronizado com o Céu</p>
      </div>

      {/* SELETOR DE ABAS */}
      <div className="flex bg-white/60 p-1 rounded-2xl border border-gray-100 shadow-inner">
        <button onClick={() => setActiveTab('atuais')} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'atuais' ? 'bg-white text-[#FF4D8C] shadow-md' : 'text-gray-400'}`}>
          MOTIVOS
        </button>
        <button onClick={() => setActiveTab('realizadas')} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'realizadas' ? 'bg-white text-[#FF4D8C] shadow-md' : 'text-gray-400'}`}>
          ORADOS
        </button>
      </div>

      {/* BUSCA */}
      <input 
        type="text"
        placeholder="Digite para buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 shadow-sm outline-none text-sm focus:ring-2 focus:ring-[#FF4D8C]/20"
      />

      {/* CATEGORIAS */}
      <div className="flex flex-wrap gap-2">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-[10px] font-black transition-all border ${
              selectedCategory === cat ? 'bg-[#FF5722] text-white border-[#FF5722]' : 'bg-white text-gray-400 border-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LISTAGEM - O segredo está na KEY única */}
      <div className="space-y-6">
        {filteredPrayers.length > 0 ? (
          filteredPrayers.map((prayer) => (
            <div 
              key={`prayer-card-${prayer.id}-${prayer.isPrayed}`} 
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
                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${
                  prayer.isPrayed ? 'bg-[#4CAF50] text-white' : 'bg-[#FF5722] text-white shadow-lg'
                }`}
              >
                <i className={`fa-solid ${prayer.isPrayed ? 'fa-check-circle' : 'fa-hands-praying'}`}></i>
                {prayer.isPrayed ? 'PEDIDO INTERCEDIDO' : 'CONFIRMAR ORAÇÃO'}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-300 italic text-sm">Nenhum pedido aqui.</div>
        )}
      </div>
    </div>
  );
};

export default Prayers;