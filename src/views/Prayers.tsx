import React, { useState, useMemo } from 'react';
import { PrayerRequest } from '../types';

interface PrayersProps {
  prayers: PrayerRequest[];
  toggleFavorite: (id: number) => void;
  togglePrayed: (id: number) => void;
  updateNote: (id: number, note: string) => void;
  nomesFilhos: string[];
}

const Prayers: React.FC<PrayersProps> = ({ prayers = [], toggleFavorite, togglePrayed, updateNote }) => {
  const [activeTab, setActiveTab] = useState<'atuais' | 'realizadas' | 'favoritos'>('atuais');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');

  const categorias = ['TODOS', 'SALVAÇÃO', 'PROTEÇÃO', 'CRESCIMENTO', 'SAÚDE', 'ESTUDOS', 'AMIGOS'];

  // FILTRO CORRIGIDO: Agora com tratamento de erros para strings nulas
  const filteredPrayers = useMemo(() => {
    return prayers.filter(p => {
      // 1. Filtro por ABA (Fundamental)
      const matchesTab = 
        activeTab === 'atuais' ? !p.isPrayed :
        activeTab === 'realizadas' ? p.isPrayed :
        p.isFavorite; // aba favoritos

      if (!matchesTab) return false;

      // 2. Filtro por CATEGORIA (Comparação segura)
      const pCat = (p.categoria || "").toUpperCase().trim();
      const sCat = selectedCategory.toUpperCase().trim();
      const matchesCategory = sCat === 'TODOS' || pCat === sCat;

      if (!matchesCategory) return false;

      // 3. Filtro por BUSCA (Verifica texto, tema e versículo)
      const term = searchTerm.toLowerCase().trim();
      if (term === '') return true;

      const pTexto = (p.texto || "").toLowerCase();
      const pVersiculo = (p.versiculo || "").toLowerCase();
      
      return pTexto.includes(term) || pCat.toLowerCase().includes(term) || pVersiculo.includes(term);
    });
  }, [prayers, activeTab, searchTerm, selectedCategory]);

  return (
    <div className="pb-44 px-4 space-y-6 animate-fadeIn bg-[#FFF5F1] min-h-screen">
      
      <div className="pt-6 space-y-1">
        <h2 className="serif-font text-3xl font-bold text-[#2D1B4D]">Motivos de Oração</h2>
        <p className="text-[10px] font-black text-[#FF4D8C] uppercase tracking-[0.2em]">Mães de joelhos, filhos de pé</p>
      </div>

      {/* ABAS: Trocando estado visual */}
      <div className="flex bg-white/60 p-1 rounded-2xl border border-gray-100 shadow-inner">
        {(['atuais', 'realizadas', 'favoritos'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchTerm(''); // Limpa busca ao trocar aba para evitar confusão
            }}
            className={`flex-1 py-3 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all ${
              activeTab === tab ? 'bg-white text-[#FF4D8C] shadow-md' : 'text-gray-400'
            }`}
          >
            {tab === 'atuais' ? 'Motivos' : tab === 'realizadas' ? 'Orados' : 'Favoritos'}
          </button>
        ))}
      </div>

      {/* BUSCA: Input controlado */}
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

      {/* CATEGORIAS: Flex Wrap para aparecerem todas */}
      <div className="flex flex-wrap gap-2">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all border ${
              selectedCategory === cat 
              ? 'bg-[#FF5722] text-white border-[#FF5722] shadow-lg scale-105' 
              : 'bg-white text-gray-400 border-gray-100'
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
              key={`${prayer.id}-${prayer.isPrayed}-${prayer.isFavorite}`} 
              className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-50 space-y-5 relative animate-slideUp"
            >
              <div className="flex justify-between items-center">
                <span className="bg-[#FFF7ED] text-[#FF5722] text-[9px] font-black px-4 py-1.5 rounded-full uppercase">
                  TEMA: {prayer.categoria}
                </span>
                <div className="flex gap-4">
                  <button onClick={() => toggleFavorite(prayer.id)} className="active:scale-125 transition-transform">
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
                placeholder="Anote o que Deus falar..."
                value={prayer.personalNotes || ''}
                onChange={(e) => updateNote(prayer.id, e.target.value)}
                className="w-full bg-transparent border-b border-gray-50 py-2 text-sm outline-none resize-none italic text-gray-400"
              />

              <button 
                onClick={() => togglePrayed(prayer.id)}
                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${
                  prayer.isPrayed ? 'bg-[#4CAF50] text-white shadow-inner' : 'bg-[#FF5722] text-white shadow-lg'
                }`}
              >
                <i className={`fa-solid ${prayer.isPrayed ? 'fa-check-circle' : 'fa-hands-praying'}`}></i>
                {prayer.isPrayed ? 'ORAÇÃO REALIZADA' : 'CONFIRMAR ORAÇÃO'}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-24 flex flex-col items-center gap-4 opacity-50">
            <i className="fa-solid fa-magnifying-glass text-4xl text-gray-200"></i>
            <p className="text-gray-400 text-sm italic">Nenhum pedido encontrado nesta seleção.</p>
            {(searchTerm || selectedCategory !== 'TODOS') && (
              <button onClick={() => {setSearchTerm(''); setSelectedCategory('TODOS');}} className="text-[#FF4D8C] text-[10px] font-black underline">LIMPAR FILTROS</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Prayers;