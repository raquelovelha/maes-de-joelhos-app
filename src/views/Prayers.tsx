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

  const filteredPrayers = useMemo(() => {
    return prayers.filter(p => {
      if (!p) return false;
      const matchesTab = activeTab === 'motivos' ? !p.isPrayed : p.isPrayed;
      if (!matchesTab) return false;

      const pCat = p.category ? String(p.category).toUpperCase() : 'GERAL';
      const matchesCategory = selectedCategory === 'Todos' || pCat === selectedCategory.toUpperCase();
      
      const matchesSearch = (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [prayers, activeTab, selectedCategory, searchTerm]);

  return (
    <div className="space-y-6 pb-24 px-4 animate-fadeIn">
      <div className="pt-4 space-y-4">
        <h2 className="serif-font text-3xl font-bold text-brand-dark">Pedidos de Oração</h2>

        {/* ABAS - Layout Imagem 8 */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
          <button 
            onClick={() => setActiveTab('motivos')}
            className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase ${
              activeTab === 'motivos' ? 'bg-white shadow-md text-brand-primary' : 'text-gray-400'
            }`}
          >
            MOTIVOS
          </button>
          <button 
            onClick={() => setActiveTab('intercedidos')}
            className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase ${
              activeTab === 'intercedidos' ? 'bg-white shadow-md text-brand-primary' : 'text-gray-400'
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
            className="w-full bg-white border border-brand-border rounded-full py-3 px-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/10 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* CATEGORIAS - Layout Corrigido */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(prev => prev === cat ? 'Todos' : cat)}
              className={`px-5 py-2 rounded-full text-[10px] font-black border transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-brand-primary text-white border-brand-primary shadow-md' 
                  : 'bg-white text-brand-primary border-brand-border'
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
            <div key={`${p.id}-${activeTab}`} className="bg-white rounded-[2.5rem] p-7 border border-brand-border shadow-sm animate-slideUp">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-brand-primary uppercase bg-brand-soft px-3 py-1 rounded-full">
                  {p.category}
                </span>
                <div className="flex gap-3 text-gray-200">
                  <button onClick={() => toggleFavorite(p.id)} className={p.isFavorite ? 'text-brand-primary' : ''}>
                    <i className={`fa-${p.isFavorite ? 'solid' : 'regular'} fa-star text-lg`}></i>
                  </button>
                  <i className="fa-solid fa-share-nodes text-lg hover:text-brand-primary cursor-pointer"></i>
                </div>
              </div>

              <h3 className="font-bold text-brand-dark text-xl mb-3">{p.title}</h3>
              
              {/* Box de Conteúdo da Oração */}
              <div className="bg-[#FFF5F2] p-5 rounded-2xl mb-4 text-sm text-brand-dark leading-relaxed italic border-l-4 border-brand-primary">
                "{p.description}"
                {p.verse && <p className="mt-3 font-bold not-italic">— {p.verse}</p>}
              </div>

              <textarea 
                placeholder="Sua oração pessoal..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs mb-4 h-24 resize-none focus:outline-none focus:ring-1 focus:ring-brand-primary/20"
                value={p.personalNotes || ''}
                onChange={(e) => updateNote(p.id, e.target.value)}
              />

              {/* Botão com lógica de cor e texto solicitado */}
              <button 
                onClick={() => togglePrayed(p.id)}
                className={`w-full py-4 rounded-full text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${
                  p.isPrayed 
                    ? 'bg-green-500 text-white shadow-green-100' 
                    : 'bg-brand-primary text-white'
                }`}
              >
                <i className={`fa-solid ${p.isPrayed ? 'fa-check-circle' : 'fa-hand-holding-heart'}`}></i>
                {p.isPrayed ? 'INTERCEDIDO' : 'INTERCEDER'}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-300 italic font-serif">
             Nenhum pedido encontrado nesta categoria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Prayers;