import React, { useState, useMemo } from 'react';
import { PrayerRequest } from '../types';

interface PrayersProps {
  prayers: PrayerRequest[];
  toggleFavorite: (id: number) => void;
  togglePrayed: (id: number) => void;
  updateNote: (id: number, note: string) => void;
  nomesFilhos: string[];
}

const Prayers: React.FC<PrayersProps> = ({ prayers, toggleFavorite, togglePrayed, updateNote }) => {
  const [activeTab, setActiveTab] = useState<'atuais' | 'realizadas' | 'favoritos'>('atuais');

  // FILTRO FOCADO NA TRANSIÇÃO DE ABAS
  const filteredPrayers = useMemo(() => {
    return prayers.filter(p => {
      if (activeTab === 'atuais') return !p.isPrayed; // Só o que não foi orado
      if (activeTab === 'realizadas') return p.isPrayed; // Só o que já foi orado
      if (activeTab === 'favoritos') return p.isFavorite; // Favoritos
      return true;
    });
  }, [prayers, activeTab]);

  return (
    <div className="pb-44 px-4 space-y-6 bg-[#FFF5F1] min-h-screen">
      
      {/* TÍTULO E CABEÇALHO */}
      <div className="pt-6 space-y-1">
        <h2 className="serif-font text-3xl font-bold text-[#2D1B4D]">Motivos de Oração</h2>
        <p className="text-[10px] font-black text-[#FF4D8C] uppercase tracking-[0.2em]">Mães de joelhos, filhos de pé</p>
      </div>

      {/* SELETOR DE ABAS (Estilo Pílula) */}
      <div className="flex bg-white/60 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
        {(['atuais', 'realizadas', 'favoritos'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-xl text-[9px] font-bold uppercase transition-all ${
              activeTab === tab ? 'bg-white text-[#FF4D8C] shadow-md' : 'text-gray-400'
            }`}
          >
            {tab === 'atuais' ? 'Motivos' : tab === 'realizadas' ? 'Orados' : 'Favoritos'}
          </button>
        ))}
      </div>

      {/* LISTAGEM DE CARDS COM LAYOUT RESTAURADO */}
      <div className="space-y-6">
        {filteredPrayers.map((prayer) => (
          <div 
            key={`${prayer.id}-${prayer.isPrayed}`} 
            className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-50 space-y-5"
          >
            {/* TAG E FAVORITO */}
            <div className="flex justify-between items-center">
              <span className="bg-[#FFF7ED] text-[#FF5722] text-[9px] font-black px-4 py-1.5 rounded-full uppercase">
                TEMA: {prayer.categoria}
              </span>
              <button onClick={() => toggleFavorite(prayer.id)}>
                <i className={`fa-${prayer.isFavorite ? 'solid' : 'regular'} fa-star text-lg ${prayer.isFavorite ? 'text-[#FF4D8C]' : 'text-gray-200'}`}></i>
              </button>
            </div>

            <p className="text-[#2D1B4D] text-lg font-medium leading-relaxed">{prayer.texto}</p>

            {/* AÇÃO: BOTÃO VERDE AO CONFIRMAR */}
            <button 
              onClick={() => togglePrayed(prayer.id)}
              className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${
                prayer.isPrayed 
                ? 'bg-[#4CAF50] text-white' // VERDE (Oração Realizada)
                : 'bg-[#FF5722] text-white'  // LARANJA (Confirmar Oração)
              }`}
            >
              <i className={`fa-solid ${prayer.isPrayed ? 'fa-check-circle' : 'fa-hands-praying'}`}></i>
              {prayer.isPrayed ? 'PEDIDO INTERCEDIDO' : 'CONFIRMAR ORAÇÃO'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Prayers;