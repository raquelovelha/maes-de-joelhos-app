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
  toggleFavorite = () => {}, 
  togglePrayed = () => {}, 
  updateNote = () => {} 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [activeTab, setActiveTab] = useState<'motivos' | 'intercedidos'>('motivos');

  const categories = ['Todos', 'SALVAÇÃO', 'PROTEÇÃO', 'CRESCIMENTO', 'SAÚDE', 'ESTUDOS', 'AMIGOS'];

  const filteredPrayers = useMemo(() => {
    const list = Array.isArray(prayers) ? prayers : [];
    return list.filter(p => {
      if (!p) return false;
      
      // Filtro de Abas: Motivos mostra isPrayed false, Intercedidos mostra true
      const matchesTab = activeTab === 'motivos' ? !p.isPrayed : p.isPrayed;
      if (!matchesTab) return false;

      const pCat = p.category ? String(p.category).toUpperCase() : 'GERAL';
      const matchesCategory = selectedCategory === 'Todos' || pCat === selectedCategory.toUpperCase();
      
      const title = (p.title || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return matchesCategory && (title.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase()));
    });
  }, [prayers, activeTab, selectedCategory, searchTerm]);

  return (
    <div className="space-y-6 pb-24 px-4 animate-fadeIn">
      <div className="pt-6 space-y-5">
        <h2 className="serif-font text-3xl font-bold text-[#2D1B4D]">Pedidos de Oração</h2>

        {/* ABAS - Layout Imagem 8 */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
          <button 
            onClick={() => setActiveTab('motivos')}
            className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${
              activeTab === 'motivos' ? 'bg-white shadow-md text-[#FF4D8C]' : 'text-gray-400'
            }`}
          >
            MOTIVOS
          </button>
          <button 
            onClick={() => setActiveTab('intercedidos')}
            className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${
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

      <div className="space-y-6">
        {filteredPrayers.length > 0 ? (
          filteredPrayers.map(p => (
            <div key={`${p.id}-${p.isPrayed}`} className="bg-white rounded-[2.5rem] p-7 border border-gray-100 shadow-sm animate-slideUp">
              
              {/* Cabeçalho do Card */}
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-black text-[#FF5722] uppercase bg-[#FFF7ED] px-4 py-1.5 rounded-full">
                  {p.category}
                </span>
                <button onClick={() => toggleFavorite(p.id)}>
                  <i className={`fa-${p.isFavorite ? 'solid' : 'regular'} fa-star text-xl ${p.isFavorite ? 'text-[#FF4D8C]' : 'text-gray-200'}`}></i>
                </button>
              </div>

              {/* Conteúdo do Pedido */}
              <h3 className="font-bold text-[#2D1B4D] text-xl mb-3">{p.title}</h3>
              <div className="bg-[#FFF5F2] p-5 rounded-3xl mb-5 text-base italic border-l-4 border-[#FF5722]">
                "{p.description}"
              </div>

              {/* Botão de Ação */}
              <button 
                onClick={() => togglePrayed(p.id)}
                className={`w-full py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                  p.isPrayed 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : 'bg-[#FF5722] text-white shadow-lg'
                }`}
              >
                <i className={`fa-solid ${p.isPrayed ? 'fa-check-circle' : 'fa-hand-holding-heart'}`}></i>
                {p.isPrayed ? 'INTERCEDIDO' : 'INTERCEDER'}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 italic">
            Nenhum pedido encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default Prayers;