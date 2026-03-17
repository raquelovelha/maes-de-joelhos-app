import React, { useState, useMemo } from 'react';

const Prayers: React.FC<any> = ({ prayers = [], filhos = [], onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Categorias atualizadas com os novos nomes do seu Firebase
  const categories = [
    { id: 'SALVACAO', label: 'Salvação e Crescimento Espiritual', icon: 'fa-cross', color: 'bg-rose-50', text: 'text-rose-500' },
    { id: 'PROTECAO', label: 'Proteção e Batalha Espiritual', icon: 'fa-shield-halved', color: 'bg-blue-50', text: 'text-blue-500' },
    { id: 'IDENTIDADE', label: 'Identidade em Cristo', icon: 'fa-id-card', color: 'bg-cyan-50', text: 'text-cyan-600' },
    { id: 'CARATER', label: 'Caráter e Valores', icon: 'fa-gem', color: 'bg-purple-50', text: 'text-purple-500' },
    { id: 'SAUDE', label: 'Saúde e Emoções', icon: 'fa-heart-pulse', color: 'bg-emerald-50', text: 'text-emerald-500' },
    { id: 'FUTURO', label: 'Educação, Futuro e Propósito', icon: 'fa-graduation-cap', color: 'bg-indigo-50', text: 'text-indigo-500' },
    { id: 'RELACIONAMENTOS', label: 'Relacionamentos', icon: 'fa-house-chimney-heart', color: 'bg-pink-50', text: 'text-pink-500' },
    { id: 'MISSOES', label: 'Missões e Sociedade', icon: 'fa-globe-americas', color: 'bg-amber-50', text: 'text-amber-600' },
  ];

  const filteredPrayers = useMemo(() => {
    if (!selectedCategory) return [];
    const config = categories.find(c => c.id === selectedCategory);
    if (!config) return [];

    return prayers.filter((p: any) => {
      const temaBanco = String(p.category || '').trim();
      // Filtro por nome exato para aproveitar sua organização
      return temaBanco === config.label;
    });
  }, [prayers, selectedCategory]);

  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <div className="flex flex-col gap-6 pb-24 pt-4 px-2">
      {/* Botões de Diário e Filhos */}
      <div className="flex gap-2">
        <button onClick={() => onNavigate('memorial')} className="flex-1 bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center gap-1 active:scale-95 transition-all">
          <i className="fa-solid fa-book-open text-brand-rose"></i>
          <span className="text-[10px] font-black uppercase text-gray-400">Meu Diário</span>
        </button>
        <button onClick={() => setSelectedCategory('FILHOS')} className="flex-1 bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center gap-1 active:scale-95 transition-all">
          <i className="fa-solid fa-children text-blue-500"></i>
          <span className="text-[10px] font-black uppercase text-gray-400">Filhos</span>
        </button>
      </div>

      {!selectedCategory ? (
        <div className="flex flex-col gap-3 animate-fadeIn">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-1">Temas de Oração</h3>
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)} 
              className="flex items-center gap-4 bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 active:bg-gray-50 transition-all text-left"
            >
              <div className={`w-12 h-12 flex-shrink-0 rounded-2xl ${cat.color} ${cat.text} flex items-center justify-center text-xl`}>
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-bold text-[#2D1B4D] leading-tight text-sm">{cat.label}</span>
                <span className={`text-[9px] font-black uppercase mt-1 ${cat.text}`}>Explorar motivos</span>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-200 text-xs"></i>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedCategory(null)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2D1B4D]">
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h3 className="font-bold text-lg text-[#2D1B4D] leading-tight">
              {selectedCategory === 'FILHOS' ? 'Pedidos dos Filhos' : currentCategory?.label}
            </h3>
          </div>

          <div className="space-y-3">
            {selectedCategory === 'FILHOS' ? (
              filhos.length > 0 ? filhos.map((f: any, i: number) => (
                <div key={i} className="bg-blue-50/50 p-6 rounded-[2.5rem] border border-blue-100">
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-1">{f.nome}</p>
                  <p className="text-sm text-[#2D1B4D] italic">"{f.pedido || f.clamor}"</p>
                </div>
              )) : <p className="text-center py-20 text-gray-400">Nenhum filho cadastrado.</p>
            ) : (
              filteredPrayers.length > 0 ? filteredPrayers.map((p: any, i: number) => (
                <div key={i} className={`bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 border-l-4 ${currentCategory?.text.replace('text', 'border')}`}>
                  <p className="text-sm text-[#2D1B4D] leading-relaxed mb-3">"{p.description}"</p>
                  {p.verse && (
                    <span className={`text-[9px] font-black uppercase flex items-center gap-1 ${currentCategory?.text}`}>
                      <i className="fa-solid fa-book-open"></i> {p.verse}
                    </span>
                  )}
                </div>
              )) : <p className="text-center py-20 text-gray-400">Nenhum pedido nesta pasta.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Prayers;