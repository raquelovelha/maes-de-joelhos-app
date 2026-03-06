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
  const [activeTab, setActiveTab] = useState<'atuais' | 'intercedidos'>('atuais');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');

  // FILTRAGEM ULTRA-ESTÁVEL
  const filteredPrayers = useMemo(() => {
    return prayers.filter(p => {
      // 1. ABA: Se for 'atuais', isPrayed deve ser falso. Se for 'intercedidos', deve ser verdadeiro.
      const isDone = p.isPrayed === true;
      const matchesTab = activeTab === 'atuais' ? !isDone : isDone;
      if (!matchesTab) return false;

      // 2. CATEGORIA: De-seleção funciona voltando para TODOS
      if (selectedCategory !== 'TODOS') {
        const pCat = (p.categoria || "").toUpperCase().trim();
        const sCat = selectedCategory.toUpperCase().trim();
        if (pCat !== sCat) return false;
      }

      // 3. BUSCA
      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        if (!(p.texto || "").toLowerCase().includes(term)) return false;
      }

      return true;
    });
  }, [prayers, activeTab, searchTerm, selectedCategory]);

  return (
    <div className="pb-44 px-4 space-y-6 bg-[#FFF5F1] min-h-screen">
      
      <div className="pt-6">
        <h2 className="serif-font text-3xl font-bold text-[#2D1B4D]">Motivos de Oração</h2>
        <p className="text-[10px] font-black text-[#FF4D8C] uppercase tracking-[0.2em]">Mães de joelhos, filhos de pé</p>
      </div>

      {/* ABAS */}
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

      {/* CATEGORIAS (Lógica de Selecionar/Desmarcar) */}
      <div className="flex flex-wrap gap-2">
        {['TODOS', 'SALVAÇÃO', 'PROTEÇÃO', 'CRESCIMENTO', 'SAÚDE', 'ESTUDOS', 'AMIGOS'].map(cat => (
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

      {/* LISTAGEM DE CARDS */}
      <div className="space-y-6">
        {filteredPrayers.length > 0 ? (
          filteredPrayers.map((prayer) => (
            <div 
              key={`prayer-card-${prayer.id}-${prayer.texto.substring(0,10)}`} 
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

              {/* BOTÃO QUE ALTERNA (Muda de cor e texto na hora) */}
              <button 
                onClick={() => togglePrayed(prayer.id)}
                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${
                  prayer.isPrayed 
                  ? 'bg-green-500 text-white' 
                  : 'bg-[#FF5722] text-white shadow-lg'
                }`}
              >
                <i className={`fa-solid ${prayer.isPrayed ? 'fa-check-circle' : 'fa-hands-praying'}`}></i>
                {prayer.isPrayed ? 'REMOVER DOS INTERCEDIDOS' : 'CONFIRMAR ORAÇÃO'}
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