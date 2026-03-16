import React, { useState, useMemo } from 'react';

const Prayers: React.FC<any> = ({ prayers = [], toggleFavorite, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Categorias mapeadas para bater com o campo 'categoria' do seu Firebase
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
    
    return prayers.filter((p: any) => {
      const pCat = String(p.category || p.categoria || '').trim().toLowerCase();
      const target = String(config?.match || '').trim().toLowerCase();
      const content = String(p.description || p.texto || '').toLowerCase();
      return pCat === target && content.includes(searchTerm.toLowerCase());
    });
  }, [prayers, searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col gap-6 pb-24 pt-4 animate-fadeIn px-1">
      {/* HEADER COM ACESSO AO DIÁRIO */}
      <div className="flex justify-between items-center px-2">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pastas de Clamor</h3>
        <button 
          onClick={() => onNavigate('memorial')}
          className="text-[10px] font-black text-brand-rose uppercase flex items-center gap-2 bg-brand-rose/5 px-3 py-2 rounded-full"
        >
          <i className="fa-solid fa-book-open"></i> Meu Diário
        </button>
      </div>

      {/* BUSCA */}
      <div className="relative mx-1">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
        <input 
          type="text" 
          placeholder="Buscar nos temas..."
          className="w-full bg-white border-2 border-gray-50 rounded-2xl py-4 pl-12 shadow-sm outline-none text-sm"
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* GRID DE PASTAS */}
      <div className="grid grid-cols-3 gap-2">
        {categories.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-[2rem] border-2 transition-all ${
              selectedCategory === cat.id ? 'bg-white shadow-md border-brand-rose' : 'bg-transparent border-transparent'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base mb-2 ${selectedCategory === cat.id ? 'bg-brand-rose text-white' : 'bg-gray-100 text-gray-400'}`}>
              <i className={`fa-solid ${cat.icon}`}></i>
            </div>
            <span className="text-[8px] font-black uppercase text-center leading-tight text-gray-500">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* LISTA DE PEDIDOS DOS FILHOS (GERAL) */}
      <div className="mt-4 px-2">
         <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Pedidos de Oração dos Filhos</h3>
         <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50 italic text-sm text-gray-500 text-center">
            <i className="fa-solid fa-children text-2xl mb-2 block opacity-20"></i>
            Em breve: Lista unificada de todos os pedidos dos seus filhos aqui.
         </div>
      </div>

      {/* MODAL/LISTA AO SELECIONAR CATEGORIA */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white w-full max-h-[80vh] rounded-t-[3rem] p-6 overflow-y-auto animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h2 className="serif-font text-xl font-bold text-[#2D1B4D]">
                {categories.find(c => c.id === selectedCategory)?.label}
              </h2>
              <button onClick={() => setSelectedCategory(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              {filteredPrayers.map((p: any) => (
                <div key={p.id} className="bg-gray-50 rounded-3xl p-5 border border-gray-100">
                  <p className="text-sm text-[#2D1B4D] leading-relaxed mb-3">"{p.description || p.texto}"</p>
                  {p.verse && (
                    <span className="text-[9px] font-black text-brand-rose uppercase">
                      <i className="fa-solid fa-book-open mr-1"></i> {p.verse}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prayers;