import React, { useState, useMemo } from 'react';
import { PrayerRequest } from '../types';

interface PrayersProps {
  prayers: PrayerRequest[];
  toggleFavorite: (id: number) => void;
  togglePrayed: (id: number) => void;
  updateNote: (id: number, note: string) => void;
}

const Prayers: React.FC<PrayersProps> = ({ prayers = [], toggleFavorite, togglePrayed }) => {
  const [viewMode, setViewMode] = useState<'missao' | 'categorias'>('missao');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['SALVAÇÃO', 'PROTEÇÃO', 'CRESCIMENTO', 'SAÚDE', 'ESTUDOS', 'AMIGOS', 'FAMÍLIA', 'IGREJA'];

  // LÓGICA 1: Selecionar 5 pedidos fixos para o dia (baseado na data atual)
  const missaoDoDia = useMemo(() => {
    const seed = new Date().getDate() + new Date().getMonth(); // Muda todo dia
    const shuffled = [...prayers].sort(() => 0.5 - Math.random() * seed);
    return shuffled.slice(0, 5);
  }, [prayers.length]); // Só recalcula se a base de dados mudar

  // LÓGICA 2: Filtrar por categoria quando ela quiser explorar mais
  const pedidosPorCategoria = useMemo(() => {
    if (!selectedCategory) return [];
    return prayers.filter(p => p.category?.toUpperCase() === selectedCategory);
  }, [prayers, selectedCategory]);

  return (
    <div className="space-y-8 pb-32 px-4 pt-6 animate-fadeIn">
      <header className="px-2">
        <h2 className="serif-font text-3xl font-bold text-[#2D1B4D]">Momento de Intercessão</h2>
        <p className="text-[#FF4D8C] text-[10px] font-black uppercase tracking-[0.2em] mt-1">15 Minutos com o Senhor</p>
      </header>

      {viewMode === 'missao' ? (
        <>
          {/* SEÇÃO: MISSÃO DO DIA */}
          <div className="bg-gradient-to-br from-[#5c00b8] to-[#8227e3] rounded-[2.5rem] p-6 text-white shadow-xl shadow-purple-100">
            <h3 className="font-bold text-lg mb-1">Sua Missão de Hoje</h3>
            <p className="text-white/70 text-xs mb-6 italic">Selecionamos 5 alvos especiais para suas orações agora.</p>
            
            <div className="space-y-4">
              {missaoDoDia.map((p, index) => (
                <div key={p.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm leading-tight">{p.title}</p>
                    <p className="text-[10px] text-white/60 uppercase font-black">{p.category}</p>
                  </div>
                  <button onClick={() => togglePrayed(p.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${p.isPrayed ? 'bg-green-400 text-white' : 'bg-white/20 text-white/40'}`}>
                    <i className="fa-solid fa-check text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* BOTÃO PARA EXPLORAR MAIS */}
          <div className="pt-4 px-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Deseja interceder por mais?</p>
            <button 
              onClick={() => setViewMode('categorias')}
              className="w-full py-5 border-2 border-dashed border-purple-200 rounded-[2rem] text-purple-600 text-[10px] font-black uppercase tracking-widest hover:bg-purple-50 transition-all"
            >
              <i className="fa-solid fa-magnifying-glass mr-2"></i>
              Explorar pedidos por categoria
            </button>
          </div>
        </>
      ) : (
        /* VISÃO POR CATEGORIAS */
        <div className="space-y-6 animate-fadeIn">
          <button 
            onClick={() => { setViewMode('missao'); setSelectedCategory(null); }}
            className="text-[10px] font-black text-purple-600 uppercase flex items-center gap-2 mb-2"
          >
            <i className="fa-solid fa-arrow-left"></i> Voltar para Missão do Dia
          </button>

          <div className="grid grid-cols-2 gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`p-4 rounded-3xl border-2 text-[10px] font-black transition-all ${selectedCategory === cat ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-100 bg-white text-gray-400'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {selectedCategory && (
            <div className="space-y-4 pt-4 animate-slideUp">
              <h4 className="font-black text-[10px] text-orange-500 uppercase tracking-widest px-2 italic">Pedidos de {selectedCategory}:</h4>
              {pedidosPorCategoria.map(p => (
                <div key={p.id} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                   <h3 className="font-bold text-[#2D1B4D] mb-2">{p.title}</h3>
                   <p className="text-gray-500 text-sm italic mb-4">"{p.description}"</p>
                   <button 
                    onClick={() => togglePrayed(p.id)}
                    className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${p.isPrayed ? 'bg-green-500 text-white' : 'bg-[#FF5722] text-white'}`}
                   >
                     {p.isPrayed ? 'CONCLUÍDO' : 'INTERCEDER'}
                   </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Prayers;