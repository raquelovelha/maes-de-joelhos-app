import React, { useState, useMemo } from 'react';

const Prayers: React.FC<any> = ({ prayers = [], filhos = [], onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Mapeamento de Pastas -> Subtemas do seu Firebase
  const categories = [
    { id: 'SALVACAO', label: 'Salvação', icon: 'fa-cross', matches: ['Salvação e Crescimento Espiritual', 'Vida de Santidade', 'Vida de Oração', 'Identidade em Cristo'] },
    { id: 'PROTECAO', label: 'Proteção', icon: 'fa-shield-halved', matches: ['Proteção, Livramentos e Batalha Espiritual', 'Proteção e Batalha Espiritual', 'Proteção e Livramentos'] },
    { id: 'MINISTERIO', label: 'Ministério', icon: 'fa-fire-alt', matches: ['Vida Espiritual e Ministério'] },
    { id: 'CARATER', label: 'Caráter', icon: 'fa-gem', matches: ['Caráter, Valores e Emoções', 'Caráter e Valores'] },
    { id: 'SAUDE', label: 'Saúde', icon: 'fa-heart-pulse', matches: ['Saúde e Necessidades Humanas', 'Saúde e Emoções'] },
    { id: 'FUTURO', label: 'Futuro', icon: 'fa-graduation-cap', matches: ['Educação, Futuro e Propósito', 'Futuro e Carreira', 'Vida Escolar e Acadêmica'] },
    { id: 'FAMILIA', label: 'Família', icon: 'fa-house-chimney-heart', matches: ['Relacionamentos e Família', 'Relacionamentos', 'Vida Familiar'] },
    { id: 'MISSOES', label: 'Missões', icon: 'fa-globe-americas', matches: ['Missões e Sociedade'] },
    { id: 'GRATIDAO', label: 'Gratidão', icon: 'fa-sun', matches: ['Gratidão e Esperança', 'GERAL'] }, // Incluímos GERAL aqui para não perder os 105 pedidos
  ];

  const filteredPrayers = useMemo(() => {
    if (!selectedCategory) return [];
    const config = categories.find(c => c.id === selectedCategory);
    if (!config) return [];
    
    return prayers.filter((p: any) => {
      const pTema = String(p.tema || p.category || '').trim();
      return config.matches.includes(pTema);
    });
  }, [prayers, selectedCategory]);

  return (
    <div className="flex flex-col gap-6 pb-24 pt-4 px-2">
      <div className="flex gap-2">
        <button onClick={() => onNavigate('memorial')} className="flex-1 bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center gap-1">
          <i className="fa-solid fa-book-open text-brand-rose"></i>
          <span className="text-[10px] font-black uppercase text-gray-400">Meu Diário</span>
        </button>
        <button onClick={() => setSelectedCategory('FILHOS')} className="flex-1 bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center gap-1">
          <i className="fa-solid fa-children text-blue-500"></i>
          <span className="text-[10px] font-black uppercase text-gray-400">Filhos</span>
        </button>
      </div>

      {!selectedCategory ? (
        <div className="flex flex-col gap-3 animate-fadeIn">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Pastas de Clamor</h3>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="flex items-center gap-4 bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 active:bg-gray-50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 text-xl">
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <div className="text-left">
                <p className="font-bold text-[#2D1B4D]">{cat.label}</p>
                <p className="text-[9px] font-black text-brand-rose uppercase">Explorar motivos</p>
              </div>
              <i className="fa-solid fa-chevron-right ml-auto text-gray-200"></i>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedCategory(null)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2D1B4D]"><i className="fa-solid fa-arrow-left"></i></button>
            <h3 className="font-bold text-xl text-[#2D1B4D]">
              {selectedCategory === 'FILHOS' ? 'Pedidos dos Filhos' : categories.find(c => c.id === selectedCategory)?.label}
            </h3>
          </div>

          <div className="space-y-3">
            {selectedCategory === 'FILHOS' ? (
              filhos.map((f: any, i: number) => (
                <div key={i} className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100">
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-2">{f.nome}</p>
                  <p className="text-sm text-[#2D1B4D] italic">"{f.pedido || f.clamor}"</p>
                </div>
              ))
            ) : (
              filteredPrayers.length > 0 ? filteredPrayers.map((p: any) => (
                <div key={p.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[8px] font-black bg-gray-50 px-2 py-1 rounded-md text-gray-400 uppercase">{p.tema || p.category}</span>
                    <span className="text-[8px] font-bold text-gray-300">Dia {p.dia}</span>
                  </div>
                  <p className="text-sm text-[#2D1B4D] italic leading-relaxed mb-3">"{p.texto || p.description}"</p>
                  {(p.versiculo || p.verse) && <span className="text-[9px] font-black text-brand-rose uppercase flex items-center gap-1"><i className="fa-solid fa-book-open"></i> {p.versiculo || p.verse}</span>}
                </div>
              )) : <p className="text-center py-20 text-gray-400">Nenhum motivo nesta categoria.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Prayers;