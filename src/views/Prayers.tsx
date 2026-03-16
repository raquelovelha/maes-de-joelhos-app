import React, { useState, useMemo } from 'react';

// Recebemos 'filhos' que agora vem do seu hook usePrayers
const Prayers: React.FC<any> = ({ prayers = [], filhos = [], toggleFavorite, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilhosModal, setShowFilhosModal] = useState(false);

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
      
      {/* HEADER COM DOIS BOTÕES SEPARADOS */}
      <div className="flex justify-between items-center px-2 gap-3">
        <button 
          onClick={() => onNavigate('memorial')}
          className="flex-1 text-[10px] font-black text-brand-rose uppercase flex items-center justify-center gap-2 bg-brand-rose/5 py-3 rounded-2xl border border-brand-rose/10 shadow-sm"
        >
          <i className="fa-solid fa-book-open"></i> Meu Diário
        </button>

        <button 
          onClick={() => setShowFilhosModal(true)}
          className="flex-1 text-[10px] font-black text-blue-600 uppercase flex items-center justify-center gap-2 bg-blue-50 py-3 rounded-2xl border border-blue-100 shadow-sm"
        >
          <i className="fa-solid fa-children"></i> Pedidos dos Filhos
        </button>
      </div>

      {/* BUSCA */}
      <div className="relative mx-1">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
        <input 
          type="text" 
          placeholder="Buscar nos temas..."
          className="w-full bg-white border-2 border-gray-50 rounded-2xl py-4 pl-12 shadow-sm outline-none text-sm focus:border-brand-rose/20 transition-all"
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* GRID DE PASTAS */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Pastas de Clamor</h3>
        <div className="grid grid-cols-3 gap-2">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-[2rem] border-2 transition-all active:scale-95 ${
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
      </div>

      {/* MODAL DE PEDIDOS DOS FILHOS */}
      {showFilhosModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end">
          <div className="bg-white w-full max-h-[85vh] rounded-t-[3rem] p-8 overflow-y-auto animate-slideUp shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="serif-font text-2xl font-bold text-[#2D1B4D]">Pedidos dos Filhos</h2>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Intercessão de Mãe</p>
              </div>
              <button onClick={() => setShowFilhosModal(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {filhos.length > 0 ? filhos.map((filho: any, idx: number) => (
                <div key={idx} className="bg-blue-50/50 rounded-[2rem] p-6 border border-blue-100 relative overflow-hidden">
                  <h4 className="font-black text-blue-600 text-[10px] uppercase mb-2 tracking-widest">{filho.nome || filho.name}</h4>
                  <p className="text-sm text-[#2D1B4D] leading-relaxed italic">
                    {filho.pedido || filho.prayer || "Nenhum pedido específico cadastrado para este filho."}
                  </p>
                </div>
              )) : (
                <div className="text-center py-10">
                  <i className="fa-solid fa-heart-pulse text-3xl text-gray-100 mb-3 block"></i>
                  <p className="text-gray-400 text-xs font-bold uppercase">Nenhum pedido encontrado.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CATEGORIAS (MOTIVOS DE ORAÇÃO) */}
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