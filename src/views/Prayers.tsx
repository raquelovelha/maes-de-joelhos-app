import React, { useState, useMemo } from 'react';

const Prayers: React.FC<any> = ({ prayers = [], toggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState('');
  // Começa como null para não mostrar a lista até que uma categoria seja clicada
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 6 Categorias com "Geral" para capturar pedidos sem classificação
  const categories = [
    { id: 'SALVAÇÃO', label: 'Salvação', icon: 'fa-cross', color: '#4A90E2' },
    { id: 'PROTEÇÃO', label: 'Proteção', icon: 'fa-shield-halved', color: '#FF5722' },
    { id: 'SAÚDE', label: 'Saúde', icon: 'fa-heart-pulse', color: '#4CAF50' },
    { id: 'ESTUDOS', label: 'Estudos', icon: 'fa-graduation-cap', color: '#FFB300' },
    { id: 'FAMÍLIA', label: 'Família', icon: 'fa-house-chimney-heart', color: '#E91E63' },
    { id: 'GERAL', label: 'Geral', icon: 'fa-hands-praying', color: '#9CA3AF' },
  ];

  const filteredPrayers = useMemo(() => {
    if (!selectedCategory) return [];
    
    return prayers.filter((p: any) => {
      const pCat = (p.category || p.categoria || '').toUpperCase();
      const content = ((p.title || p.titulo || '') + (p.description || p.descricao || '')).toLowerCase();
      const matchesSearch = content.includes(searchTerm.toLowerCase());

      // Lógica para a categoria GERAL
      if (selectedCategory === 'GERAL') {
        const mainCats = ['SALVAÇÃO', 'PROTEÇÃO', 'SAÚDE', 'ESTUDOS', 'FAMÍLIA'];
        const isOther = !pCat || !mainCats.includes(pCat);
        return isOther && matchesSearch;
      }

      // Lógica para as categorias específicas
      return pCat === selectedCategory && matchesSearch;
    });
  }, [prayers, searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col gap-6 pb-24 pt-4 animate-fadeIn">
      
      {/* BUSCA */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
        <input 
          type="text" 
          placeholder="Buscar nestes pedidos..."
          className="w-full bg-white border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 shadow-sm outline-none focus:border-brand-rose/30 transition-all text-sm"
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* GRADE DE CATEGORIAS EM BLOCOS */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
          Selecione um Alvo para Orar
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)}
              style={{ 
                borderColor: selectedCategory === cat.id ? cat.color : '#F9FAFB',
                backgroundColor: selectedCategory === cat.id ? `${cat.color}10` : '#FFFFFF'
              }}
              className="flex flex-col items-center justify-center p-5 rounded-[2.5rem] border-4 shadow-sm transition-all active:scale-95 group"
            >
              <div 
                style={{ backgroundColor: selectedCategory === cat.id ? cat.color : '#F3F4F6' }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-md transition-all ${
                    selectedCategory === cat.id ? 'text-white' : 'text-gray-400'
                }`}
              >
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <span 
                style={{ color: selectedCategory === cat.id ? cat.color : '#9CA3AF' }}
                className="text-[10px] font-black uppercase mt-3 tracking-tighter"
              >
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* LISTA DE PEDIDOS (APARECE APÓS SELEÇÃO) */}
      {selectedCategory ? (
        <div className="flex flex-col gap-4 mt-2 animate-slideUp">
          <div className="flex items-center justify-between px-2 border-b border-gray-100 pb-2">
            <h3 className="text-[11px] font-black text-gray-700 uppercase tracking-widest">
              Motivos: {selectedCategory.toLowerCase()}
            </h3>
            <button 
              onClick={() => setSelectedCategory(null)} 
              className="text-[10px] text-brand-rose font-bold uppercase hover:opacity-70 transition-opacity"
            >
              <i className="fa-solid fa-circle-xmark mr-1"></i> Fechar
            </button>
          </div>

          {filteredPrayers.length > 0 ? (
            <div className="grid gap-4">
              {filteredPrayers.map((p: any) => (
                <div key={p.id} className="bg-white rounded-[2rem] p-6 shadow-md border border-gray-50 flex flex-col gap-4 relative overflow-hidden">
                  {/* Fita lateral colorida de acordo com a categoria */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1.5" 
                    style={{ backgroundColor: categories.find(c => c.id === selectedCategory)?.color }}
                  ></div>
                  
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-brand-dark text-base">Oração do Dia</h4>
                    <button onClick={() => toggleFavorite(p.id)} className="text-xl">
                      <i className={`fa-${p.isFavorite ? 'solid' : 'regular'} fa-star ${p.isFavorite ? 'text-yellow-400' : 'text-gray-200'}`}></i>
                    </button>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed italic border-l-2 border-gray-50 pl-4 py-1">
                    "{p.description || p.descricao}"
                  </p>

                  {(p.biblicalReference || p.referencia) && (
                    <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] bg-gray-50 px-3 py-1.5 rounded-lg self-start">
                      <i className="fa-solid fa-book-bible text-brand-rose"></i>
                      <span>{p.biblicalReference || p.referencia}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6">
                <p className="text-gray-400 italic text-sm">Ainda não há pedidos nesta categoria.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 opacity-40">
          <i className="fa-solid fa-hand-pointer text-2xl mb-2 animate-bounce"></i>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-center">
            Toque em uma pasta para <br/> ver os pedidos específicos
          </p>
        </div>
      )}
    </div>
  );
};

export default Prayers;