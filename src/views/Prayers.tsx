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
  const [activeView, setActiveView] = useState<'atuais' | 'realizadas'>('atuais');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');

  const categorias = ['TODOS', 'SALVAÇÃO', 'PROTEÇÃO', 'CRESCIMENTO', 'SAÚDE', 'ESTUDOS', 'AMIGOS'];

  // Filtro de Busca e Categoria Robusto
  const filteredPrayers = useMemo(() => {
    return prayers.filter(p => {
      // 1. Filtro por Aba (Atuais vs Realizadas)
      if (activeView === 'atuais' && p.isPrayed) return false;
      if (activeView === 'realizadas' && !p.isPrayed) return false;

      // 2. Filtro por Busca
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = term === '' || 
        (p.texto?.toLowerCase().includes(term)) || 
        (p.categoria?.toLowerCase().includes(term)) ||
        (p.versiculo?.toLowerCase().includes(term));

      // 3. Filtro por Categoria
      const matchesCategory = selectedCategory === 'TODOS' || p.categoria.toUpperCase() === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [prayers, activeView, searchTerm, selectedCategory]);

  return (
    <div className="pb-40 px-4 space-y-6 animate-fadeIn bg-[#FFF5F1] min-h-screen">
      <div className="pt-4 space-y-1">
        <h2 className="serif-font text-3xl font-bold text-[#2D1B4D]">Motivos de Oração</h2>
        <p className="text-[10px] font-black text-[#FF4D8C] uppercase tracking-[0.2em]">Mães de joelhos, filhos de pé</p>
      </div>

      {/* ALTERNADOR DE ABAS (CORRIGIDO) */}
      <div className="flex bg-white/50 p-1 rounded-2xl border border-gray-100">
        <button 
          onClick={() => setActiveView('atuais')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeView === 'atuais' ? 'bg-white text-[#FF4D8C] shadow-sm' : 'text-gray-400'}`}
        >
          MOTIVOS ATUAIS
        </button>
        <button 
          onClick={() => setActiveView('realizadas')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeView === 'realizadas' ? 'bg-white text-[#FF4D8C] shadow-sm' : 'text-gray-400'}`}
        >
          ORAÇÕES REALIZADAS
        </button>
      </div>

      {/* BUSCA */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
        <input 
          type="text"
          placeholder="Buscar (ex: escola, saúde, proteção)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm outline-none text-sm"
        />
      </div>

      {/* CATEGORIAS (SCROLL LATERAL SEM QUEBRA) */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-[10px] font-black tracking-widest transition-all shrink-0 ${
              selectedCategory === cat ? 'bg-[#FF5722] text-white' : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LISTA DE CARDS */}
      <div className="space-y-6">
        {filteredPrayers.map((prayer) => (
          <div key={prayer.id} className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-50 space-y-5 relative">
            <div className="flex justify-between items-center">
              <span className="bg-[#FFF7ED] text-[#FF5722] text-[9px] font-black px-4 py-1.5 rounded-full uppercase">
                TEMA: {prayer.categoria}
              </span>
              <div className="flex gap-3 text-gray-300">
                <button onClick={() => toggleFavorite(prayer.id)} className={prayer.isFavorite ? 'text-[#FF4D8C]' : ''}>
                  <i className={`fa-${prayer.isFavorite ? 'solid' : 'regular'} fa-star text-lg`}></i>
                </button>
                <i className="fa-solid fa-share-nodes text-lg"></i>
              </div>
            </div>

            <p className="text-[#2D1B4D] text-lg font-medium leading-relaxed">{prayer.texto}</p>

            <div className="bg-[#FFF7ED] rounded-2xl p-4 border-l-4 border-[#FF5722]">
              <p className="text-[9px] font-black text-[#FF5722] uppercase mb-1 flex items-center gap-2">
                <i className="fa-solid fa-book-open"></i> A PALAVRA DE DEUS
              </p>
              <p className="text-sm italic text-gray-600">"{prayer.versiculo}"</p>
            </div>

            <textarea 
              placeholder="Anote o que Deus falar ao seu coração..."
              value={prayer.personalNotes || ''}
              onChange={(e) => updateNote(prayer.id, e.target.value)}
              className="w-full bg-transparent border-b border-gray-50 py-2 text-sm outline-none resize-none min-h-[40px] italic text-gray-400"
            />

            <button 
              onClick={() => togglePrayed(prayer.id)}
              className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                prayer.isPrayed ? 'bg-[#4CAF50] text-white' : 'bg-[#FF5722] text-white shadow-lg shadow-orange-200'
              }`}
            >
              <i className={`fa-solid ${prayer.isPrayed ? 'fa-check-circle' : 'fa-hands-praying'}`}></i>
              {prayer.isPrayed ? 'ORAÇÃO REALIZADA' : 'CONFIRMAR ORAÇÃO'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Prayers;