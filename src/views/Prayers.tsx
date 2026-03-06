import React, { useState, useMemo, useEffect } from 'react';
import { PrayerRequest } from '../types';

interface PrayersProps {
  prayers: PrayerRequest[];
  toggleFavorite: (id: number) => void;
  togglePrayed: (id: number) => void;
  updateNote: (id: number, note: string) => void;
  nomesFilhos: string[];
}

const Prayers: React.FC<PrayersProps> = ({ prayers, toggleFavorite, togglePrayed, updateNote }) => {
  // Estados de interface
  const [activeTab, setActiveTab] = useState<'atuais' | 'realizadas' | 'favoritos'>('atuais');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');

  // Categorias fixas conforme solicitado
  const categorias = ['TODOS', 'SALVAÇÃO', 'PROTEÇÃO', 'CRESCIMENTO', 'SAÚDE', 'ESTUDOS', 'AMIGOS'];

  // LÓGICA DE FILTRAGEM RECONSTRUÍDA
  const filteredPrayers = useMemo(() => {
    // Primeiro, filtramos por Aba (Estado de oração e favoritos)
    let list = prayers.filter(p => {
      if (activeTab === 'atuais') return !p.isPrayed; // Só o que NÃO foi orado
      if (activeTab === 'realizadas') return p.isPrayed; // Só o que JÁ foi orado
      if (activeTab === 'favoritos') return p.isFavorite; // Independente de ser orado ou não
      return true;
    });

    // Segundo, aplicamos o filtro de Categoria
    if (selectedCategory !== 'TODOS') {
      list = list.filter(p => 
        p.categoria?.toUpperCase().trim() === selectedCategory.toUpperCase().trim()
      );
    }

    // Terceiro, aplicamos a busca por texto (Case Insensitive)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(p => 
        (p.texto?.toLowerCase().includes(term)) || 
        (p.categoria?.toLowerCase().includes(term)) ||
        (p.versiculo?.toLowerCase().includes(term))
      );
    }

    return list;
  }, [prayers, activeTab, searchTerm, selectedCategory]);

  // Função para lidar com o clique e dar feedback visual imediato
  const handleTogglePrayed = (id: number) => {
    togglePrayed(id);
    // Se estivermos na aba "atuais", o card deve sumir após o clique
    // pois ele passará a ser uma "oração realizada"
  };

  return (
    <div className="pb-44 px-4 space-y-6 animate-fadeIn bg-[#FFF5F1] min-h-screen">
      
      <div className="pt-6 space-y-1">
        <h2 className="serif-font text-3xl font-bold text-[#2D1B4D]">Motivos de Oração</h2>
        <p className="text-[10px] font-black text-[#FF4D8C] uppercase tracking-[0.2em]">Mães de joelhos, filhos de pé</p>
      </div>

      {/* ABAS COM IDENTIFICAÇÃO CLARA */}
      <div className="flex bg-white/60 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
        <button onClick={() => setActiveTab('atuais')} className={`flex-1 py-3 rounded-xl text-[9px] font-bold tracking-widest uppercase transition-all ${activeTab === 'atuais' ? 'bg-white text-[#FF4D8C] shadow-md' : 'text-gray-400'}`}>
          Motivos
        </button>
        <button onClick={() => setActiveTab('realizadas')} className={`flex-1 py-3 rounded-xl text-[9px] font-bold tracking-widest uppercase transition-all ${activeTab === 'realizadas' ? 'bg-white text-[#FF4D8C] shadow-md' : 'text-gray-400'}`}>
          Orados
        </button>
        <button onClick={() => setActiveTab('favoritos')} className={`flex-1 py-3 rounded-xl text-[9px] font-bold tracking-widest uppercase transition-all ${activeTab === 'favoritos' ? 'bg-white text-[#FF4D8C] shadow-md' : 'text-gray-400'}`}>
          Favoritos
        </button>
      </div>

      {/* INPUT DE BUSCA CORRIGIDO */}
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

      {/* CATEGORIAS COM WRAP */}
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
          filteredPrayers.map((prayer) => (
            <div key={`${prayer.id}-${prayer.isPrayed}`} className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-50 space-y-5 relative">
              
              <div className="flex justify-between items-center">
                <span className="bg-[#FFF7ED] text-[#FF5722] text-[9px] font-black px-4 py-1.5 rounded-full uppercase">
                  TEMA: {prayer.categoria}
                </span>
                <div className="flex gap-4">
                  <button onClick={() => toggleFavorite(prayer.id)}>
                    <i className={`fa-${prayer.isFavorite ? 'solid' : 'regular'} fa-star text-lg ${prayer.isFavorite ? 'text-[#FF4D8C]' : 'text-gray-200'}`}></i>
                  </button>
                  <i className="fa-solid fa-share-nodes text-lg text-gray-200"></i>
                </div>
              </div>

              <p className="text-[#2D1B4D] text-lg font-medium leading-relaxed">{prayer.texto}</p>

              <div className="bg-[#FFF7ED] rounded-2xl p-4 border-l-4 border-[#FF5722]">
                <p className="text-[9px] font-black text-[#FF5722] uppercase mb-1">A PALAVRA DE DEUS</p>
                <p className="text-sm italic text-gray-600">"{prayer.versiculo}"</p>
              </div>

              <textarea 
                placeholder="Anote o que Deus falar ao seu coração..."
                value={prayer.personalNotes || ''}
                onChange={(e) => updateNote(prayer.id, e.target.value)}
                className="w-full bg-transparent border-b border-gray-50 py-2 text-sm outline-none resize-none italic text-gray-400"
              />

              {/* BOTÃO COM LÓGICA DE ESTADO */}
              <button 
                onClick={() => handleTogglePrayed(prayer.id)}
                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                  prayer.isPrayed ? 'bg-[#4CAF50] text-white' : 'bg-[#FF5722] text-white'
                }`}
              >
                <i className={`fa-solid ${prayer.isPrayed ? 'fa-check-circle' : 'fa-hands-praying'}`}></i>
                {prayer.isPrayed ? 'ORAÇÃO REALIZADA' : 'CONFIRMAR ORAÇÃO'}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-400 italic text-sm">
            Nenhum pedido encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default Prayers;