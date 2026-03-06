import React, { useState, useMemo } from 'react';

const Prayers: React.FC<any> = ({ prayers = [], toggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Categorias baseadas no seu banco de dados
  const categories = ['Todos', 'SALVAÇÃO', 'PROTEÇÃO', 'SAÚDE', 'ESTUDOS', 'AMIGOS', 'FAMÍLIA'];

  // Lógica de Filtragem (Pesquisa + Categoria)
  const filteredPrayers = useMemo(() => {
    return prayers.filter((p: any) => {
      const title = p.title || p.titulo || '';
      const description = p.description || p.descricao || '';
      const content = (title + description).toLowerCase();
      
      const matchesSearch = content.includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'Todos' || 
                         p.category?.toUpperCase() === selectedCategory || 
                         p.categoria?.toUpperCase() === selectedCategory;
      
      return matchesSearch && matchesCat;
    });
  }, [prayers, searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col gap-6 pb-24 pt-2">
      {/* 1. BARRA DE PESQUISA (NO TOPO) */}
      <div className="relative group">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-rose transition-colors"></i>
        <input 
          type="text" 
          placeholder="Buscar por palavra-chave ou nome..."
          className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-brand-rose/10 focus:border-brand-rose/20 transition-all text-sm"
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>

      {/* 2. CATEGORIAS (ABAIXO DA PESQUISA) */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categorias</span>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black border transition-all whitespace-nowrap ${
                selectedCategory === cat 
                ? 'bg-brand-rose text-white border-brand-rose shadow-md shadow-brand-rose/20' 
                : 'bg-white text-gray-400 border-gray-100 hover:border-brand-rose/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. LISTA DE PEDIDOS COMPLETOS */}
      <div className="grid gap-4 mt-2">
        {filteredPrayers.length > 0 ? (
          filteredPrayers.map((p: any) => (
            <div key={p.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50 flex flex-col gap-4 hover:shadow-md transition-shadow">
              
              {/* Header do Card: Categoria e Favorito */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-brand-rose bg-brand-rose/5 self-start px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    {p.category || p.categoria || 'Geral'}
                  </span>
                  <h4 className="font-bold text-brand-dark text-lg leading-tight mt-1">
                    {p.title || p.titulo}
                  </h4>
                </div>
                <button 
                  onClick={() => toggleFavorite(p.id)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-brand-rose/5 transition-colors group"
                >
                  <i className={`fa-${p.isFavorite ? 'solid' : 'regular'} fa-star ${p.isFavorite ? 'text-brand-rose' : 'text-gray-200 group-hover:text-gray-300'}`}></i>
                </button>
              </div>

              {/* Texto do Pedido */}
              <p className="text-gray-500 text-sm leading-relaxed italic border-l-2 border-brand-rose/10 pl-4 py-1">
                "{p.description || p.descricao}"
              </p>

              {/* Referência Bíblica (Se existir) */}
              {(p.biblicalReference || p.referencia) && (
                <div className="flex items-center gap-2 text-brand-dark/70 font-bold text-[10px] bg-brand-lavender/40 self-start px-3 py-1.5 rounded-lg border border-brand-rose/5">
                  <i className="fa-solid fa-book-bible text-brand-rose"></i>
                  <span>{p.biblicalReference || p.referencia}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300 gap-3">
            <i className="fa-solid fa- magnifying-glass text-4xl opacity-20"></i>
            <p className="text-sm italic font-medium text-gray-400">Nenhum alvo encontrado para esta busca.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prayers;