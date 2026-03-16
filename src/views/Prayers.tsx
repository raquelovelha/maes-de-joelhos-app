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
      return pCat === target;
    });
  }, [prayers, selectedCategory]);

  return (
    <div className="flex flex-col gap-6 pb-24 pt-4 px-1">
      {/* Botões Superiores */}
      <div className="flex justify-between items-center px-2 gap-3">
        <button onClick={() => onNavigate('memorial')} className="flex-1 text-[10px] font-black text-[#FF4DAD] uppercase flex items-center justify-center gap-2 bg-[#FF4DAD]/5 py-3 rounded-2xl border border-[#FF4DAD]/10 shadow-sm">
          <i className="fa-solid fa-book-open"></i> Diário
        </button>
        <button onClick={() => setShowFilhosModal(true)} className="flex-1 text-[10px] font-black text-blue-600 uppercase flex items-center justify-center gap-2 bg-blue-50 py-3 rounded-2xl border border-blue-100 shadow-sm">
          <i className="fa-solid fa-children"></i> Filhos
        </button>
      </div>

      {/* Grid de Pastas */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Pastas de Clamor</h3>
        <div className="grid grid-cols-3 gap-2 px-1">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="flex flex-col items-center justify-center p-3 rounded-[2rem] bg-white shadow-sm border border-gray-50 active:scale-95 transition-transform">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 bg-gray-50 mb-2">
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <span className="text-[8px] font-black uppercase text-gray-500 leading-tight text-center">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MODAL DE FILHOS */}
      {showFilhosModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowFilhosModal(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-popIn flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#2D1B4D]">Pedidos dos Filhos</h2>
              <button onClick={() => setShowFilhosModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2">
              {filhos.length > 0 ? filhos.map((f: any, i: number) => (
                <div key={i} className="bg-blue-50 p-5 rounded-3xl border border-blue-100">
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-2 tracking-widest">{f.nome}</p>
                  <p className="text-sm text-[#2D1B4D] italic leading-relaxed">"{f.pedido || f.clamor || 'Sem pedido registrado'}"</p>
                </div>
              )) : <p className="text-center text-gray-400 text-sm py-10">Nenhum pedido encontrado.</p>}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CATEGORIAS */}
      {selectedCategory && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setSelectedCategory(null)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-popIn flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#2D1B4D]">{categories.find(c => c.id === selectedCategory)?.label}</h2>
              <button onClick={() => setSelectedCategory(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2">
              {filteredPrayers.length > 0 ? filteredPrayers.map((p: any) => (
                <div key={p.id} className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <p className="text-sm text-[#2D1B4D] italic mb-3 leading-relaxed">"{p.description || p.texto}"</p>
                  {p.verse && <span className="text-[10px] font-black text-[#FF4DAD] uppercase flex items-center gap-1"><i className="fa-solid fa-book-open"></i> {p.verse}</span>}
                </div>
              )) : <p className="text-center text-gray-400 text-sm py-10">Nenhum motivo encontrado nesta categoria.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prayers;