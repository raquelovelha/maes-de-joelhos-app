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

  // Lógica de Filtro Reforçada
  const filteredPrayers = useMemo(() => {
    return prayers.filter(p => {
      // 1. Filtro de Aba (Essencial para não misturar)
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
        const versMatch = (p.versiculo || "").toLowerCase().includes(term);
        if (!textMatch && !catMatch && !versMatch) return false;
      }

      return true;
    });
  }, [prayers, activeTab, searchTerm, selectedCategory]);

  return (
    <div className="pb-44 px-4 space-y-6 bg-[#FFF5F1] min-h-screen">
      
      {/* CABEÇALHO */}
      <div className="pt-6 space-y-1">
        <h2 className="serif-font text-3xl font-bold text-[#2D1B4D]">Motivos de Oração</h2>
        <p className="text-[10px] font-black text-[#FF4D8C] uppercase tracking-[0.2em]">Mães de joelhos, filhos de pé</p>
      </div>

      {/* ABAS (Layout Pílula) */}
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
          onClick={() => setActiveTab('realizadas')}
          className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${
            activeTab === 'realizadas' ? 'bg-white text-[#FF4D8C] shadow-md' : 'text-gray-400'
          }`}
        >
          Orados
        </button>
      </div>

      {/* BUSCA */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
        <input 
          type="text"
          placeholder="Busque por escola, saúde, tema..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm outline-none text-sm focus:ring-2 focus:ring-[#FF4D8C]/20"
        />
      </div>

      {/* CATEGORIAS (Com Wrap/Quebra de linha) */}
      <div className="flex flex-wrap gap-2">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all border ${
              selectedCategory === cat 
              ? 'bg-[#FF5722] text-white border-[#FF5722] shadow-lg' 
              : 'bg-white text-gray-400 border-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LISTAGEM DE CARDS */}
      <div className="space-y-6">
        {filteredPrayers.length > 0 ? (
          filteredPrayers.map((prayer) => {
            // CHAVE ÚNICA PARA EVITAR O BUG DE PULAR TEXTO
            const cardKey = `prayer-${prayer.id}-${prayer.texto.substring(0, 15)}`;

            return (
              <div 
                key={cardKey} 
                className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-50 space-y-5 animate-slideUp"
              >
                <div className="flex justify-between items-center">
                  <span className="bg-[#FFF7ED] text-[#FF5722] text-[9px] font-black px-4 py-1.5 rounded-full uppercase">
                    TEMA: {prayer.categoria}
                  </span>
                  <button onClick={() => toggleFavorite(prayer.id)}>
                    <i className={`fa-${prayer.isFavorite ? 'solid' : 'regular'} fa-star text-lg ${
                      prayer.isFavorite ? 'text-[#FF4D8C]' : 'text-gray-200'
                    }`}></i>
                  </button>
                </div>

                <p className="text-[#2D1B4D] text-lg font-medium leading-relaxed">
                  {prayer.texto}
                </p>

                {/* BOTÃO DE STATUS (Laranja/Verde) */}
                <button 
                  onClick={() => togglePrayed(prayer.id)}
                  className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${
                    prayer.isPrayed 
                    ? 'bg-[#4CAF50] text-white' // Verde
                    : 'bg-[#FF5722] text-white shadow-lg' // Laranja
                  }`}
                >
                  <i className={`fa-solid ${prayer.isPrayed ? 'fa-check-circle' : 'fa-hands-praying'}`}></i>
                  {prayer.isPrayed ? 'PEDIDO INTERCEDIDO' : 'CONFIRMAR ORAÇÃO'}
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 text-gray-400 italic text-sm">
            Nenhum pedido encontrado nesta seleção.
          </div>
        )}
      </div>
    </div>
  );
};

export default Prayers;