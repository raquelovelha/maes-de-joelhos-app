import React, { useState, useMemo } from 'react';

const Prayers: React.FC<any> = ({ prayers = [], filhos = [], onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Lista com os nomes exatos propostos por você
  const categories = [
    { id: 'SALVACAO', label: 'Salvação', icon: 'fa-cross', firebase: 'Salvação e Crescimento Espiritual' },
    { id: 'PROTECAO', label: 'Proteção', icon: 'fa-shield-halved', firebase: 'Proteção, Livramentos e Batalha Espiritual' },
    { id: 'MINISTERIO', label: 'Ministério', icon: 'fa-fire-alt', firebase: 'Vida Espiritual e Ministério' },
    { id: 'CARATER', label: 'Caráter', icon: 'fa-gem', firebase: 'Caráter, Valores e Emoções' },
    { id: 'SAUDE', label: 'Saúde', icon: 'fa-heart-pulse', firebase: 'Saúde e Necessidades Humanas' },
    { id: 'FUTURO', label: 'Futuro', icon: 'fa-graduation-cap', firebase: 'Educação, Futuro e Propósito' },
    { id: 'FAMILIA', label: 'Família', icon: 'fa-house-chimney-heart', firebase: 'Relacionamentos e Família' },
    { id: 'MISSOES', label: 'Missões', icon: 'fa-globe-americas', firebase: 'Missões e Sociedade' },
    { id: 'GRATIDAO', label: 'Gratidão', icon: 'fa-sun', firebase: 'Gratidão e Esperança' },
  ];

  const filteredPrayers = useMemo(() => {
    if (!selectedCategory) return [];
    const config = categories.find(c => c.id === selectedCategory);
    if (!config) return [];

    return prayers.filter((p: any) => {
      const temaBanco = String(p.category || '').trim();
      
      // Se for "GERAL", ignoramos para evitar lixo na tela
      if (temaBanco.toUpperCase() === "GERAL") return false;

      // COMPARAÇÃO INTELIGENTE:
      // 1. Verifica se é exatamente o nome longo
      // 2. Ou se contém a palavra principal (ex: se tiver "Proteção", entra na pasta Proteção)
      return (
        temaBanco === config.firebase || 
        temaBanco.toLowerCase().includes(config.label.toLowerCase())
      );
    });
  }, [prayers, selectedCategory]);

  return (
    <div className="flex flex-col gap-6 pb-24 pt-4 px-2">
      {/* Cabeçalho de Navegação */}
      <div className="flex gap-2">
        <button 
          onClick={() => onNavigate('memorial')} 
          className="flex-1 bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center gap-1 active:scale-95 transition-transform"
        >
          <i className="fa-solid fa-book-open text-[#FF4DAD] text-lg"></i>
          <span className="text-[10px] font-black uppercase text-gray-400">Meu Diário</span>
        </button>
        <button 
          onClick={() => setSelectedCategory('FILHOS')} 
          className="flex-1 bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center gap-1 active:scale-95 transition-transform"
        >
          <i className="fa-solid fa-children text-blue-500 text-lg"></i>
          <span className="text-[10px] font-black uppercase text-gray-400">Filhos</span>
        </button>
      </div>

      {!selectedCategory ? (
        /* Grid Principal de Pastas */
        <div className="grid grid-cols-1 gap-3 animate-fadeIn">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Pastas de Clamor</h3>
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)} 
              className="flex items-center gap-4 bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 active:bg-gray-50"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 text-xl">
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-[#2D1B4D]">{cat.label}</span>
                <span className="text-[9px] font-black text-[#FF4DAD] uppercase tracking-tighter">Ver motivos</span>
              </div>
              <i className="fa-solid fa-chevron-right ml-auto text-gray-200"></i>
            </button>
          ))}
        </div>
      ) : (
        /* Lista de Orações dentro da Pasta */
        <div className="flex flex-col gap-4 animate-fadeIn">
          <div className="flex items-center gap-3 mb-2">
            <button 
              onClick={() => setSelectedCategory(null)} 
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2D1B4D]"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h3 className="font-bold text-xl text-[#2D1B4D]">
              {selectedCategory === 'FILHOS' ? 'Pedidos dos Filhos' : categories.find(c => c.id === selectedCategory)?.label}
            </h3>
          </div>

          <div className="space-y-3">
            {selectedCategory === 'FILHOS' ? (
              filhos.length > 0 ? filhos.map((f: any, i: number) => (
                <div key={i} className="bg-blue-50/50 p-6 rounded-[2.5rem] border border-blue-100">
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-2 tracking-widest">{f.nome}</p>
                  <p className="text-sm text-[#2D1B4D] italic leading-relaxed">"{f.pedido || f.clamor}"</p>
                </div>
              )) : <p className="text-center py-20 text-gray-400 text-sm">Nenhum pedido de filho encontrado.</p>
            ) : (
              filteredPrayers.length > 0 ? filteredPrayers.map((p: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50">
                   <div className="flex justify-between items-start mb-2">
                    <span className="text-[8px] font-black bg-gray-50 px-2 py-1 rounded-md text-gray-400 uppercase">{p.category}</span>
                  </div>
                  <p className="text-sm text-[#2D1B4D] leading-relaxed mb-3">"{p.description}"</p>
                  {p.verse && (
                    <span className="text-[9px] font-black text-[#FF4DAD] uppercase flex items-center gap-1">
                      <i className="fa-solid fa-book-open"></i> {p.verse}
                    </span>
                  )}
                </div>
              )) : (
                <div className="text-center py-20">
                  <i className="fa-solid fa-folder-open text-gray-100 text-5xl mb-4"></i>
                  <p className="text-gray-400 text-sm">Ainda não há pedidos organizados para esta pasta.</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Prayers;