import React, { useState, useMemo } from 'react';

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
      <div className="flex justify-between items-center px-2 gap-3">
        <button onClick={() => onNavigate('memorial')} className="flex-1 text-[10px] font-black text-[#FF4DAD] uppercase flex items-center justify-center gap-2 bg-[#FF4DAD]/5 py-3 rounded-2xl border border-[#FF4DAD]/10">
          <i className="fa-solid fa-book-open"></i> Meu Diário
        </button>
        <button onClick={() => setShowFilhosModal(true)} className="flex-1 text-[10px] font-black text-blue-600 uppercase flex items-center justify-center gap-2 bg-blue-50 py-3 rounded-2xl border border-blue-100">
          <i className="fa-solid fa-children"></i> Pedidos dos Filhos
        </button>
      </div>

      <div className="relative mx-1">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
        <input type="text" placeholder="Buscar nos temas..." className="w-full bg-white border-2 border-gray-50 rounded-2xl py-4 pl-12 shadow-sm outline-none text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex flex-col items-center justify-center p-3 rounded-[2rem] border-2 transition-all ${selectedCategory === cat.id ? 'bg-white shadow-md border-[#FF4DAD]' : 'bg-transparent border-transparent'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base mb-2 ${selectedCategory === cat.id ? 'bg-[#FF4DAD] text-white' : 'bg-gray-100 text-gray-400'}`}>
              <i className={`fa-solid ${cat.icon}`}></i>
            </div>
            <span className="text-[8px] font-black uppercase text-center leading-tight text-gray-500">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* MODAL FILHOS */}
      {showFilhosModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end justify-center">
          <div className="bg-white w-full max-w-md max-h-[85vh] rounded-t-[3rem] p-8 overflow-y-auto animate-slideUp shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="serif-font text-2xl font-bold text-[#2D1B4D]">Pedidos dos Filhos</h2>
              <button onClick={() => setShowFilhosModal(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><i className="fa-solid fa-xmark text-gray-500"></i></button>
            </div>
            <div className="flex flex-col gap-4">
              {filhos.map((f: any, i: number) => (
                <div key={i} className="bg-blue-50 rounded-[2rem] p-5 border border-blue-100">
                  <h4 className="font-black text-blue-600 text-[10px] uppercase mb-1">{f.nome}</h4>
                  <p className="text-sm text-[#2D1B4D] italic">"{f.pedido || f.clamor || 'Sem pedido'}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CATEGORIAS */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end justify-center">
          <div className="bg-white w-full max-w-md max-h-[85vh] rounded-t-[3rem] p-8 overflow-y-auto animate-slideUp shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="serif-font text-2xl font-bold text-[#2D1B4D]">{categories.find(c => c.id === selectedCategory)?.label}</h2>
              <button onClick={() => setSelectedCategory(null)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><i className="fa-solid fa-xmark text-gray-500"></i></button>
            </div>
            <div className="flex flex-col gap-4">
              {filteredPrayers.map((p: any) => (
                <div key={p.id} className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                  <p className="text-sm text-[#2D1B4D] italic mb-2">"{p.description || p.texto}"</p>
                  {p.verse && <span className="text-[9px] font-black text-[#FF4DAD] uppercase"><i className="fa-solid fa-book-open mr-1"></i> {p.verse}</span>}
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