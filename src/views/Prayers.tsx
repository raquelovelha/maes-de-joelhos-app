import React, { useState, useMemo } from 'react';

const Prayers: React.FC<any> = ({ prayers = [], toggleFavorite, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Lista de categorias com o "match" EXATO do texto da sua planilha
  const categories = [
    { id: 'CARATER', label: 'Caráter', icon: 'fa-gem', color: '#64748B', match: 'Caráter, Valores e Emoções' },
    { id: 'FUTURO', label: 'Futuro', icon: 'fa-graduation-cap', color: '#8B5CF6', match: 'Educação, Futuro e Propósito' },
    { id: 'GRATIDAO', label: 'Gratidão', icon: 'fa-sun', color: '#FBBF24', match: 'Gratidão e Esperança' },
    { id: 'MISSOES', label: 'Missões', icon: 'fa-globe-americas', color: '#EF4444', match: 'Missões e Sociedade' },
    { id: 'PROTECAO', label: 'Proteção', icon: 'fa-shield-halved', color: '#F59E0B', match: 'Proteção, Livramentos e Batalha Espiritual' },
    { id: 'FAMILIA', label: 'Família', icon: 'fa-house-chimney-heart', color: '#EC4899', match: 'Relacionamentos e Família' },
    { id: 'SALVACAO', label: 'Salvação', icon: 'fa-cross', color: '#3B82F6', match: 'Salvação e Crescimento Espiritual' },
    { id: 'SAUDE', label: 'Saúde', icon: 'fa-heart-pulse', color: '#10B981', match: 'Saúde e Necessidades Humanas' },
    { id: 'MINISTERIO', label: 'Ministério', icon: 'fa-fire-alt', color: '#6366F1', match: 'Vida Espiritual e Ministério' },
  ];

  const filteredPrayers = useMemo(() => {
    if (!selectedCategory) return [];
    
    const config = categories.find(c => c.id === selectedCategory);
    if (!config) return [];

    return prayers.filter((p: any) => {
      // Normalização rigorosa para garantir que o clique funcione
      const pCat = String(p.tema || p.categoria || '').trim().toLowerCase();
      const target = String(config.match).trim().toLowerCase();
      
      const content = String((p.texto || p.pedido || '') + (p.versiculo || p.referencia || '')).toLowerCase();
      const matchesSearch = content.includes(searchTerm.toLowerCase());

      // Retorna verdadeiro apenas se a categoria do banco for idêntica ao tema da planilha
      return pCat === target && matchesSearch;
    }).sort((a, b) => (Number(a.dia) || 0) - (Number(b.dia) || 0));
  }, [prayers, searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col gap-6 pb-24 pt-4 animate-fadeIn px-1">
      {/* BUSCA */}
      <div className="relative mx-1">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
        <input 
          type="text" 
          placeholder="Buscar nos pedidos..."
          className="w-full bg-white border-2 border-gray-50 rounded-2xl py-4 pl-12 shadow-sm outline-none focus:border-brand-rose/20 text-sm"
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* GRADE DE TEMAS */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Pastas de Clamor</h3>
        <div className="grid grid-cols-3 gap-2">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-[2rem] border-2 transition-all active:scale-95 ${
                selectedCategory === cat.id ? 'bg-white shadow-md' : 'bg-transparent border-transparent'
              }`}
              style={{ borderColor: selectedCategory === cat.id ? cat.color : 'transparent' }}
            >
              <div style={{ backgroundColor: selectedCategory === cat.id ? cat.color : '#F3F4F6' }}
                   className={`w-10 h-10 rounded-xl flex items-center justify-center text-base mb-2 ${selectedCategory === cat.id ? 'text-white' : 'text-gray-400'}`}>
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <span className="text-[8px] font-black uppercase text-center leading-tight text-gray-500">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DIÁRIO */}
      {!selectedCategory && (
        <button 
          onClick={() => onNavigate('memorial')}
          className="bg-white border-2 border-brand-rose/10 p-5 rounded-[2rem] flex items-center gap-4 mx-1 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-rose/10 flex items-center justify-center text-brand-rose">
            <i className="fa-solid fa-book-open"></i>
          </div>
          <div className="text-left flex-1">
            <h4 className="font-bold text-[#2D1B4D] text-xs">Memorial de Vitórias</h4>
            <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Ver Diário</p>
          </div>
        </button>
      )}

      {/* LISTA FILTRADA */}
      {selectedCategory && (
        <div className="flex flex-col gap-4 mt-2 animate-slideUp mx-1">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-100">
                <h3 className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                  {categories.find(c => c.id === selectedCategory)?.label} ({filteredPrayers.length})
                </h3>
                <button onClick={() => setSelectedCategory(null)} className="text-[10px] text-brand-rose font-black uppercase">Fechar</button>
            </div>
            
            {filteredPrayers.length === 0 && (
              <div className="text-center py-12">
                <i className="fa-solid fa-folder-open text-gray-200 text-3xl mb-3"></i>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest px-4">
                  Nenhum pedido encontrado nesta categoria.
                </p>
              </div>
            )}

            {filteredPrayers.map((p: any) => (
                <div key={p.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50 flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: categories.find(c => c.id === selectedCategory)?.color }}></div>
                    <div className="flex justify-between items-start">
                        <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Alvo #{p.dia || p.ordem || p.id}</span>
                        <button onClick={() => toggleFavorite(p.id)}>
                            <i className={`fa-${p.isFavorite ? 'solid' : 'regular'} fa-star ${p.isFavorite ? 'text-yellow-400' : 'text-gray-200'}`}></i>
                        </button>
                    </div>
                    <p className="text-[#2D1B4D] text-sm leading-relaxed font-medium">"{p.texto || p.pedido}"</p>
                    {(p.versiculo || p.referencia) && (
                      <div className="bg-gray-50/50 rounded-2xl p-3 border border-gray-100">
                        <span className="text-[9px] font-black text-brand-rose uppercase block mb-1">
                          <i className="fa-solid fa-book-open mr-1"></i> {p.versiculo || p.referencia}
                        </span>
                        {p.texto_biblico && <p className="text-[11px] text-gray-500 leading-tight italic">"{p.texto_biblico}"</p>}
                      </div>
                    )}
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Prayers;