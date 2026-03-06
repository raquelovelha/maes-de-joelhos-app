import React, { useState, useMemo } from 'react';

const Prayers: React.FC<any> = ({ prayers = [], toggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', 'SALVAÇÃO', 'PROTEÇÃO', 'SAÚDE', 'ESTUDOS', 'AMIGOS', 'FAMÍLIA'];

  const filteredPrayers = useMemo(() => {
    return prayers.filter(p => {
      const matchesSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCat = selectedCategory === 'Todos' || p.category?.toUpperCase() === selectedCategory;
      
      return matchesSearch && matchesCat;
    });
  }, [prayers, searchTerm, selectedCategory]);

  return (
    <div className="space-y-6 pb-20 pt-4">
      <header>
        <h2 className="serif-font text-2xl font-bold text-[#2D1B4D]">Explorar Pedidos</h2>
      </header>

      {/* BARRA DE BUSCA */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
        <input 
          type="text"
          placeholder="Buscar por palavra-chave (ex: saúde, nome...)"
          className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-100 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* CATEGORIAS */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full text-[10px] font-black transition-all whitespace-nowrap border ${
              selectedCategory === cat ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-400 border-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LISTA DE PEDIDOS */}
      <div className="grid gap-4">
        {filteredPrayers.map(p => (
          <div key={p.id} className="bg-white rounded-3xl p-5 border border-gray-50 shadow-sm flex items-center justify-between group active:scale-95 transition-all">
            <div className="flex-1 pr-4">
              <span className="text-[8px] font-black text-orange-400 uppercase tracking-widest">{p.category}</span>
              <h4 className="font-bold text-[#2D1B4D] text-sm mt-1">{p.title}</h4>
              <p className="text-gray-400 text-[11px] line-clamp-1 italic mt-1">{p.description}</p>
            </div>
            <button onClick={() => toggleFavorite(p.id)} className="p-2">
              <i className={`fa-${p.isFavorite ? 'solid' : 'regular'} fa-star ${p.isFavorite ? 'text-pink-500' : 'text-gray-200'}`}></i>
            </button>
          </div>
        ))}
        {filteredPrayers.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10 italic">Nenhum alvo encontrado com essa palavra.</p>
        )}
      </div>
    </div>
  );
};

export default Prayers;