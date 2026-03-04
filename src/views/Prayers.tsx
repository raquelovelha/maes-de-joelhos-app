
// Responsabilidade: Lista de orações institucionais e ciclo de 105.
import React, { useState } from 'react';
import { PrayerRequest } from '../types';

interface PrayersProps {
  prayers: PrayerRequest[];
  toggleFavorite: (id: number) => void;
  togglePrayed: (id: number) => void;
  updateNote: (id: number, note: string) => void;
}

const PrayersView: React.FC<PrayersProps> = ({ prayers, toggleFavorite, togglePrayed, updateNote }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', ...Array.from(new Set(prayers.map(p => p.category)))];

  const filteredPrayers = prayers.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleShare = (p: PrayerRequest) => {
    const text = `Motivo de Oração Despertar de Débora:\n\n*${p.title}*\n${p.description}\n\n📖 _${p.verse}_`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-4">
        <h2 className="serif-font text-2xl font-bold text-brand-dark">Pedidos de Oração</h2>
        
        <div className="space-y-3">
          <div className="relative">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Buscar pedido..." 
              className="w-full bg-white border border-brand-border rounded-full py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-shadow shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-brand-primary text-white shadow-md' : 'bg-white text-brand-primary border border-brand-border'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-10">
        {filteredPrayers.length > 0 ? (
          filteredPrayers.map(p => (
            <div key={p.id} className={`bg-white rounded-2xl p-5 border shadow-sm transition-all ${p.isPrayed ? 'opacity-70 grayscale-[0.5]' : 'border-brand-border'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-brand-primary uppercase bg-brand-soft px-3 py-1 rounded-full">{p.category}</span>
                  <h3 className="font-bold text-brand-dark text-lg">{p.title}</h3>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => toggleFavorite(p.id)} className={`transition-colors ${p.isFavorite ? 'text-brand-primary' : 'text-gray-300'}`}>
                    <i className={`fa-${p.isFavorite ? 'solid' : 'regular'} fa-star text-lg`}></i>
                  </button>
                  <button onClick={() => handleShare(p)} className="text-gray-300 hover:text-brand-primary">
                    <i className="fa-solid fa-share-nodes text-lg"></i>
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{p.description}</p>
              
              <div className="bg-brand-soft border-l-4 border-brand-primary p-4 rounded-r-xl mb-4 italic text-sm text-brand-dark font-medium shadow-inner">
                <i className="fa-solid fa-book-bible mr-2 text-brand-primary/50"></i>
                "{p.verse}"
              </div>

              <div className="space-y-4">
                <textarea 
                  placeholder="Sua oração pessoal pelos filhos..."
                  className="w-full bg-brand-cream/50 border border-brand-border rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary/30 h-20 resize-none shadow-inner"
                  value={p.personalNotes || ''}
                  onChange={(e) => updateNote(p.id, e.target.value)}
                />

                <button 
                  onClick={() => togglePrayed(p.id)}
                  className={`w-full py-4 rounded-full text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${p.isPrayed ? 'bg-gray-100 text-gray-400' : 'gradient-brand text-white shadow-lg active:scale-[0.98]'}`}
                >
                  <i className={`fa-solid ${p.isPrayed ? 'fa-check-circle' : 'fa-circle-check'}`}></i>
                  {p.isPrayed ? 'Orado' : 'Marcar como Orado'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-400 bg-white/50 rounded-3xl border-2 border-dashed border-brand-border">
            <i className="fa-solid fa-feather-pointed text-4xl mb-4 opacity-20"></i>
            <p className="text-sm font-bold uppercase tracking-widest">Nenhum pedido encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayersView;
