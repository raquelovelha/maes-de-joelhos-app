import React, { useState, useMemo } from 'react';
import { PrayerRequest } from '../types';

interface PrayersProps {
  prayers: PrayerRequest[];
  toggleFavorite: (id: number) => void;
  togglePrayed: (id: number) => void; // Esta função vem do App.tsx
  updateNote: (id: number, note: string) => void;
  nomesFilhos: string[];
}

const Prayers: React.FC<PrayersProps> = ({ prayers, toggleFavorite, togglePrayed, updateNote }) => {
  const [activeTab, setActiveTab] = useState<'atuais' | 'realizadas'>('atuais');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');

  const categorias = ['TODOS', 'SALVAÇÃO', 'PROTEÇÃO', 'CRESCIMENTO', 'SAÚDE', 'ESTUDOS', 'AMIGOS'];

  // FILTRO DE BUSCA E ABAS
  const filteredPrayers = useMemo(() => {
    return prayers.filter(p => {
      // 1. Filtro de Aba
      if (activeTab === 'atuais' && p.isPrayed) return false;
      if (activeTab === 'realizadas' && !p.isPrayed) return false;

      // 2. Filtro de Busca
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = term === '' || 
        (p.texto || "").toLowerCase().includes(term) || 
        (p.categoria || "").toLowerCase().includes(term);

      // 3. Filtro de Categoria
      const matchesCategory = selectedCategory === 'TODOS' || 
        (p.categoria || "").toUpperCase() === selectedCategory.toUpperCase();

      return matchesSearch && matchesCategory;
    });
  }, [prayers, activeTab, searchTerm, selectedCategory]);

  return (
    <div className="pb-40 px-4 space-y-6 bg-[#FFF5F1] min-h-screen animate-fadeIn">
      
      {/* CABEÇALHO */}
      <div className="pt-6 space-y-1">
        <h2 className="serif-font text-3xl font-bold text-[#2D1B4D]">Motivos de Oração</h2>
        <p className="text-[10px] font-black text-[#FF4D8C] uppercase tracking-[0.2em]">Mães de joelhos, filhos de pé</p>
      </div>

      {/* SELETOR DE ABAS */}
      <div className="flex bg-white/50 p-1 rounded-2xl border border-gray-100">
        <button 
          onClick={() => setActiveTab('atuais')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'atuais' ? 'bg-white text-[#FF4D8C] shadow-sm' : 'text-gray-400'}`}
        >
          MOTIVOS ATUAIS
        </button>
        <button 
          onClick={() => setActiveTab('realizadas')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'realizadas' ? 'bg-white text-[#FF4D8C] shadow-sm' : 'text-gray-400'}`}
        >
          ORAÇÕES REALIZADAS
        </button>
      </div>

      {/* CAMPO DE BUSCA */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
        <input 
          type="text"
          placeholder="Buscar oração..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm outline-none text-sm"
        />
      </div>

      {/* CATEGORIAS */}
      <div className="flex flex-wrap gap-2">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all border ${
              selectedCategory === cat ? 'bg-[#FF5722] text-white border-[#FF5722]' : 'bg-white text-gray-400 border-gray-100'
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
              key={`${prayer.id}-${prayer.isPrayed}`} 
              className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-50 space-y-5 relative animate-slideUp"
            >
              <div className="flex justify-between items-center">
                <span className="bg-[#FFF7ED] text-[#FF5722] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                  TEMA: {prayer.categoria}
                </span>
                <button 
                  onClick={() => toggleFavorite(prayer.id)} 
                  className="transition-transform active:scale-125 p-1"
                >
                  <i className={`fa-${prayer.isFavorite ? 'solid' : 'regular'} fa-star text-lg ${prayer.isFavorite ? 'text-[#FF4D8C]' : 'text-gray-200'}`}></i>
                </button>
              </div>

              <p className="text-[#2D1B4D] text-lg font-medium leading-relaxed">
                {prayer.texto}
              </p>

              {/* BOTÃO COM LÓGICA DE CLIQUE REFORÇADA */}
              <button 
                onClick={async () => {
                  console.log("Clicou no ID:", prayer.id); // Para você ver no console se o clique funciona
                  await togglePrayed(prayer.id);
                }}
                className={`w-full py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-md ${
                  prayer.isPrayed 
                  ? 'bg-[#4CAF50] text-white' // VERDE
                  : 'bg-[#FF5722] text-white shadow-orange-100' // LARANJA
                }`}
              >
                <i className={`fa-solid ${prayer.isPrayed ? 'fa-check-circle' : 'fa-hands-praying'}`}></i>
                {prayer.isPrayed ? 'PEDIDO INTERCEDIDO' : 'CONFIRMAR ORAÇÃO'}
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