import React, { useState, useMemo } from 'react';
import { PrayerRequest } from '../types';

interface PrayersProps {
  prayers: PrayerRequest[];
  toggleFavorite: (id: number) => void;
  togglePrayed: (id: number) => void;
  updateNote: (id: number, note: string) => void;
}

const Prayers: React.FC<PrayersProps> = ({ prayers, toggleFavorite, togglePrayed, updateNote }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [activeTab, setActiveTab] = useState<'motivos' | 'intercedidos'>('motivos');

  // Categorias baseadas no seu banco de dados
  const categories = ['Todos', 'SALVAÇÃO', 'PROTEÇÃO', 'CRESCIMENTO', 'SAÚDE', 'ESTUDOS', 'AMIGOS'];

  const filteredPrayers = useMemo(() => {
    return prayers.filter(p => {
      // 1. Lógica de Abas (Move o item de uma lista para outra)
      const isDone = p.isPrayed === true;
      const matchesTab = activeTab === 'motivos' ? !isDone : isDone;
      if (!matchesTab) return false;

      // 2. Filtro de Categoria (Flexível para maiúsculas/minúsculas)
      const matchesCategory = selectedCategory === 'Todos' || 
        (p.category && p.category.toUpperCase() === selectedCategory.toUpperCase());
      
      // 3. Filtro de Busca (Título ou Descrição)
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [prayers, activeTab, selectedCategory, searchTerm]);

  const handleShare = (p: PrayerRequest) => {
    const text = `Motivo de Oração:\n\n*${p.title}*\n${p.description}\n\n📖 _${p.verse}_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24 px-4">
      <div className="flex flex-col gap-4 pt-4">
        <h2 className="serif-font text-3xl font-bold text-brand-dark">Pedidos de Oração</h2>

        {/* SELETOR DE ABAS */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl shadow-inner border border-gray-200">
          <button 
            onClick={() => setActiveTab('motivos')}
            className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${
              activeTab === 'motivos' ? 'bg-white shadow-md text-brand-primary' : 'text-gray-400'
            }`}
          >
            MOTIVOS
          </button>
          <button 
            onClick={() => setActiveTab('intercedidos')}
            className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${
              activeTab === 'intercedidos' ? 'bg-white shadow-md text-brand-primary' : 'text-gray-400'
            }`}
          >
            INTERCEDIDOS
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="relative">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
            <input 
              type="text" 
              placeholder="Buscar pedido..." 
              className="w-full bg-white border border-brand-border rounded-full py-3 px-11 text-sm focus:outline-none shadow-sm focus:ring-2 focus:ring-brand-primary/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* CATEGORIAS COM DE-SELEÇÃO */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(prev => prev === cat ? 'Todos' : cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
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
      </div>

      {/* LISTAGEM DE CARDS */}
      <div className="space-y-5">
        {filteredPrayers.length > 0 ? (
          filteredPrayers.map(p => (
            <div 
              key={`${p.id}-${activeTab}`} // Força refresh visual ao trocar de aba
              className="bg-white rounded-[2rem] p-6 border border-brand-border shadow-sm animate-slideUp"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-[10px] font-black text-brand-primary uppercase bg-brand-soft px-3 py-1 rounded-full">
                  {p.category}
                </span>
                <div className="flex gap-3">
                  <button onClick={() => toggleFavorite(p.id)} className={p.isFavorite ? 'text-brand-primary' : 'text-gray-200'}>
                    <i className={`fa-${p.isFavorite ? 'solid' : 'regular'} fa-star text-lg`}></i>
                  </button>
                  <button onClick={() => handleShare(p)} className="text-gray-300">
                    <i className="fa-solid fa-share-nodes"></i>
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-brand-dark text-xl mb-2">{p.title}</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{p.description}</p>
              
              <div className="bg-brand-soft border-l-4 border-brand-primary p-4 rounded-r-xl mb-4 italic text-sm text-brand-dark">
                "{p.verse}"
              </div>

              <textarea 
                placeholder="Sua oração pessoal..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs mb-4 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary/5 shadow-inner"
                value={p.personalNotes || ''}
                onChange={(e) => updateNote(p.id, e.target.value)}
              />

              <button 
                onClick={() => togglePrayed(p.id)}
                className={`w-full py-4 rounded-full text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  p.isPrayed 
                    ? 'bg-green-500 text-white shadow-inner' 
                    : 'bg-brand-primary text-white shadow-lg'
                }`}
              >
                <i className={`fa-solid ${p.isPrayed ? 'fa-check-circle' : 'fa-circle-check'}`}></i>
                {p.isPrayed ? 'Remover dos Intercedidos' : 'Marcar como Orado'}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
             <i className="fa-solid fa-feather-pointed text-3xl text-gray-200 mb-2"></i>
             <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Nenhum pedido aqui</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prayers;