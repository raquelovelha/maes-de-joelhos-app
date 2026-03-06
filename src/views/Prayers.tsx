import React, { useState, useMemo } from 'react';

const Prayers: React.FC<any> = ({ prayers = [], toggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Definição das categorias com ícones para os blocos
  const categories = [
    { id: 'Todos', label: 'Todos', icon: 'fa- layer-group', color: 'bg-gray-500' },
    { id: 'SALVAÇÃO', label: 'Salvação', icon: 'fa-cross', color: 'bg-blue-500' },
    { id: 'PROTEÇÃO', label: 'Proteção', icon: 'fa-shield-halved', color: 'bg-red-500' },
    { id: 'SAÚDE', label: 'Saúde', icon: 'fa-heart-pulse', color: 'bg-green-500' },
    { id: 'ESTUDOS', label: 'Estudos', icon: 'fa-graduation-cap', color: 'bg-orange-500' },
    { id: 'FAMÍLIA', label: 'Família', icon: 'fa-house-chimney-heart', color: 'bg-purple-500' },
  ];

  const filteredPrayers = useMemo(() => {
    return prayers.filter((p: any) => {
      const content = ((p.title || p.titulo || '') + (p.description || p.descricao || '')).toLowerCase();
      const matchesSearch = content.includes(searchTerm.toLowerCase());
      const pCat = (p.category || p.categoria || '').toUpperCase();
      const matchesCat = selectedCategory === 'Todos' || pCat === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [prayers, searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col gap-8 pb-24 pt-2">
      
      {/* 1. BUSCA */}
      <div className="relative group">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
        <input 
          type="text" 
          placeholder="O que você busca hoje?"
          className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 shadow-sm outline-none focus:ring-2 focus:ring-brand-rose/20 text-sm"
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 2. BLOCOS DE CATEGORIA (O GRID QUE VOCÊ PEDIU) */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Categorias de Clamor</h3>
        <div className="grid grid-cols-3 gap-3">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-[2rem] border-2 transition-all gap-2 ${
                selectedCategory === cat.id 
                ? 'border-brand-rose bg-brand-rose/5 shadow-inner' 
                : 'border-white bg-white shadow-sm hover:border-gray-100'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs ${
                selectedCategory === cat.id ? 'bg-brand-rose' : 'bg-gray-100 text-gray-400'
              }`}>
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-tighter ${
                selectedCategory === cat.id ? 'text-brand-rose' : 'text-gray-400'
              }`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. LISTA DE PEDIDOS FILTRADOS */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                {selectedCategory === 'Todos' ? 'Todos os pedidos' : `Pedidos: ${selectedCategory}`}
            </h3>
            <span className="text-[10px] font-bold text-brand-rose">{filteredPrayers.length}</span>
        </div>

        <div className="grid gap-4">
          {filteredPrayers.map((p: any) => (
            <div key={p.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-brand-rose bg-brand-rose/5 px-2.5 py-1 rounded-lg uppercase self-start tracking-wider">
                    {p.category || p.categoria || 'Geral'}
                  </span>
                  <h4 className="font-bold text-brand-dark text-lg leading-tight mt-1">Oração do Dia</h4>
                </div>
                <button onClick={() => toggleFavorite(p.id)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50">
                  <i className={`fa-${p.isFavorite ? 'solid' : 'regular'} fa-star ${p.isFavorite ? 'text-brand-rose' : 'text-gray-200'}`}></i>
                </button>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed italic border-l-2 border-brand-rose/10 pl-4">
                "{p.description || p.descricao}"
              </p>

              {(p.biblicalReference || p.referencia) && (
                <div className="flex items-center gap-2 text-brand-dark/70 font-bold text-[10px] bg-brand-lavender/40 px-3 py-1.5 rounded-lg self-start">
                  <i className="fa-solid fa-book-bible text-brand-rose"></i>
                  <span>{p.biblicalReference || p.referencia}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Prayers;