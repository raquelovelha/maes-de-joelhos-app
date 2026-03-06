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
  // Estados de Controle
  const [activeTab, setActiveTab] = useState<'atuais' | 'realizadas' | 'favoritos'>('atuais');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');

  // Categorias para os botões de filtro
  const categorias = ['TODOS', 'SALVAÇÃO', 'PROTEÇÃO', 'CRESCIMENTO', 'SAÚDE', 'ESTUDOS', 'AMIGOS'];

  // LÓGICA DE FILTRAGEM (Aba + Categoria + Busca)
  const filteredPrayers = useMemo(() => {
    return prayers.filter(p => {
      // 1. Filtro de Aba (Essencial para não misturar orações feitas com pendentes)
      if (activeTab === 'atuais' && p.isPrayed) return false;
      if (activeTab === 'realizadas' && !p.isPrayed) return false;
      if (activeTab === 'favoritos' && !p.isFavorite) return false;

      // 2. Filtro de Categorias (Comparação robusta)
      if (selectedCategory !== 'TODOS') {
        const pCat = p.categoria?.toUpperCase().trim() || "";
        const sCat = selectedCategory.toUpperCase().trim();
        if (pCat !== sCat) return false;
      }

      // 3. Filtro de Busca (Texto, Categoria ou Versículo)
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = term === '' || 
        (p.texto?.toLowerCase().includes(term)) || 
        (p.categoria?.toLowerCase().includes(term)) ||
        (p.versiculo?.toLowerCase().includes(term));

      return matchesSearch;
    });
  }, [prayers, activeTab, searchTerm, selectedCategory]);

  return (
    <div className="pb-40 px-4 space-y-6 animate-fadeIn bg-[#FFF5F1] min-h-screen">
      
      {/* TÍTULO */}
      <div className="pt-6 space-y-1">
        <h2 className="serif-font text-3xl font-bold text-[#2D1B4D]">Motivos de Oração</h2>
        <p className="text-[10px] font-black text-[#FF4D8C] uppercase tracking-[0.2em]">Mães de joelhos, filhos de pé</p>
      </div>

      {/* SELETOR DE ABAS (CORRIGIDO) */}
      <div className="flex bg-white/60 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
        {(['atuais', 'realizadas', 'favoritos'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-xl text-[9px] font-bold tracking-widest transition-all uppercase ${
              activeTab === tab 
              ? 'bg-white text-[#FF4D8C] shadow-md scale-[1.02]' 
              : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab === 'atuais' ? 'Motivos' : tab === 'realizadas' ? 'Orados' : 'Favoritos'}
          </button>
        ))}
      </div>

      {/* BARRA DE BUSCA (FUNCIONAL) */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
        <input 
          type="text"
          placeholder="Busque por escola, saúde, tema..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm outline-none text-sm focus:ring-2 focus:ring-[#FF4D8C]/20 transition-shadow"
        />
      </div>

      {/* CATEGORIAS COM QUEBRA DE LINHA (FLEX-WRAP) */}
      <div className="flex flex-wrap gap-2 justify-start">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all border active:scale-90 ${
              selectedCategory === cat 
              ? 'bg-[#FF5722] text-white border-[#FF5722] shadow-lg shadow-orange-100' 
              : 'bg-white text-gray-400 border-gray-100 hover:border-orange-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LISTA DE CARDS */}
      <div className="space-y-6">
        {filteredPrayers.length > 0 ? (
          filteredPrayers.map((prayer) => (
            <div 
              key={prayer.id} 
              className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-50 space-y-5 relative transition-all"
            >
              {/* HEADER DO CARD */}
              <div className="flex justify-between items-center">
                <span className="bg-[#FFF7ED] text-[#FF5722] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter">
                  TEMA: {prayer.categoria}
                </span>
                <div className="flex gap-4">
                  <button 
                    onClick={() => toggleFavorite(prayer.id)} 
                    className={`transition-transform active:scale-125 ${prayer.isFavorite ? 'text-[#FF4D8C]' : 'text-gray-200'}`}
                  >
                    <i className={`fa-${prayer.isFavorite ? 'solid' : 'regular'} fa-star text-lg`}></i>
                  </button>
                  <i className="fa-solid fa-share-nodes text-lg text-gray-200 cursor-pointer"></i>
                </div>
              </div>

              {/* TEXTO DO MOTIVO */}
              <p className="text-[#2D1B4D] text-lg font-medium leading-relaxed">
                {prayer.texto}
              </p>

              {/* VERSÍCULO (COR LARANJA) */}
              <div className="bg-[#FFF7ED] rounded-2xl p-4 border-l-4 border-[#FF5722]">
                <p className="text-[9px] font-black text-[#FF5722] uppercase mb-1 flex items-center gap-2">
                  <i className="fa-solid fa-book-open"></i> A PALAVRA DE DEUS
                </p>
                <p className="text-sm italic text-gray-600 leading-relaxed italic">
                  "{prayer.versiculo}"
                </p>
              </div>

              {/* NOTAS PESSOAIS */}
              <textarea 
                placeholder="Anote o que Deus falar ao seu coração..."
                value={prayer.personalNotes || ''}
                onChange={(e) => updateNote(prayer.id, e.target.value)}
                className="w-full bg-transparent border-b border-gray-50 py-2 text-sm outline-none resize-none italic text-gray-400 focus:border-pink-200 transition-colors"
              />

              {/* BOTÃO DE CONFIRMAÇÃO DE ORAÇÃO */}
              <button 
                onClick={() => togglePrayed(prayer.id)}
                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-md ${
                  prayer.isPrayed 
                  ? 'bg-[#4CAF50] text-white' 
                  : 'bg-[#FF5722] text-white hover:bg-[#E64A19]'
                }`}
              >
                <i className={`fa-solid ${prayer.isPrayed ? 'fa-check-circle' : 'fa-hands-praying'}`}></i>
                {prayer.isPrayed ? 'ORAÇÃO REALIZADA' : 'CONFIRMAR ORAÇÃO'}
              </button>
            </div>
          ))
        ) : (
          /* ESTADO VAZIO */
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mb-2">
               <i className="fa-solid fa-magnifying-glass text-gray-200 text-3xl"></i>
            </div>
            <p className="text-gray-400 text-sm italic font-medium">
              Nenhum motivo encontrado nesta seleção.
            </p>
            {(searchTerm || selectedCategory !== 'TODOS') && (
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('TODOS'); }}
                className="text-[#FF4D8C] text-[10px] font-black uppercase underline tracking-widest mt-2"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Prayers;