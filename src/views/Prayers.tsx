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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');

  // Categorias principais para o filtro (Agora com rolagem lateral)
  const categorias = ['TODOS', 'SALVAÇÃO', 'PROTEÇÃO', 'CRESCIMENTO', 'SAÚDE', 'ESTUDOS', 'AMIGOS'];

  // Lógica de Filtro e Busca Corrigida
  const filteredPrayers = useMemo(() => {
    return prayers.filter(p => {
      const pTexto = p.texto?.toLowerCase() || "";
      const pCat = p.categoria?.toLowerCase() || "";
      const pVer = p.versiculo?.toLowerCase() || "";
      const term = searchTerm.toLowerCase();

      const matchesSearch = pTexto.includes(term) || pCat.includes(term) || pVer.includes(term);
      const matchesCategory = selectedCategory === 'TODOS' || p.categoria.toUpperCase() === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [prayers, searchTerm, selectedCategory]);

  return (
    <div className="pb-40 px-4 space-y-6 animate-fadeIn">
      {/* CABEÇALHO */}
      <div className="space-y-2">
        <h2 className="serif-font text-3xl font-bold text-brand-dark">Motivos de Oração</h2>
        <p className="text-[10px] font-black text-brand-rose uppercase tracking-[0.2em]">Mães de joelhos, filhos de pé</p>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-brand-rose/40"></i>
        <input 
          type="text"
          placeholder="Buscar (ex: escola, saúde, proteção)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-brand-rose/20 outline-none transition-all text-sm"
        />
      </div>

      {/* CATEGORIAS COM SCROLL LATERAL - CORREÇÃO DE QUEBRA */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 scroll-smooth">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all shrink-0 ${
              selectedCategory === cat 
              ? 'bg-brand-orange text-white shadow-lg shadow-orange-200' 
              : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LISTA DE PEDIDOS */}
      <div className="space-y-6">
        {filteredPrayers.length > 0 ? (
          filteredPrayers.map((prayer) => (
            <div key={prayer.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 space-y-6 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="bg-orange-50 text-orange-600 text-[9px] font-black px-4 py-1.5 rounded-full tracking-tighter uppercase">
                  TEMA: {prayer.categoria}
                </span>
                <div className="flex gap-4">
                  <button onClick={() => toggleFavorite(prayer.id)} className={prayer.isFavorite ? 'text-brand-rose' : 'text-gray-200'}>
                    <i className={`fa-${prayer.isFavorite ? 'solid' : 'regular'} fa-star`}></i>
                  </button>
                  <button className="text-gray-200">
                    <i className="fa-solid fa-share-nodes"></i>
                  </button>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed font-medium">
                {prayer.texto}
              </p>

              {/* A PALAVRA DE DEUS */}
              <div className="bg-[#FFF7ED] rounded-2xl p-5 border-l-4 border-brand-orange">
                <p className="text-[10px] font-black text-brand-orange uppercase mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-book-open"></i> A PALAVRA DE DEUS
                </p>
                <p className="text-sm italic text-gray-600 leading-relaxed">
                  "{prayer.versiculo}"
                </p>
              </div>

              {/* NOTAS PESSOAIS */}
              <div className="pt-2">
                <textarea 
                  placeholder="Anote o que Deus falar ao seu coração..."
                  value={prayer.personalNotes || ''}
                  onChange={(e) => updateNote(prayer.id, e.target.value)}
                  className="w-full bg-transparent border-b border-gray-100 py-2 text-sm focus:border-brand-rose outline-none resize-none min-h-[40px] italic text-gray-400"
                />
              </div>

              {/* BOTÃO DE CONFIRMAÇÃO */}
              <button 
                onClick={() => togglePrayed(prayer.id)}
                className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.97] ${
                  prayer.isPrayed 
                  ? 'bg-green-500 text-white shadow-lg shadow-green-100' 
                  : 'bg-brand-orange text-white shadow-lg shadow-orange-200'
                }`}
              >
                <i className={`fa-solid ${prayer.isPrayed ? 'fa-check-circle' : 'fa-hands-praying'}`}></i>
                {prayer.isPrayed ? 'ORAÇÃO REALIZADA' : 'CONFIRMAR ORAÇÃO'}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <i className="fa-solid fa-magnifying-glass text-gray-200 text-2xl"></i>
            </div>
            <p className="text-gray-400 text-sm font-medium italic">Nenhum pedido encontrado para "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prayers;