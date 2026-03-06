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

  // Lógica de Filtro para Separar Atuais de Orados
  const filteredPrayers = useMemo(() => {
    return prayers.filter(p => {
      if (activeTab === 'atuais') return !p.isPrayed; // Só mostra o que NÃO foi orado
      if (activeTab === 'realizadas') return p.isPrayed; // Só mostra o que JÁ foi orado
      if (activeTab === 'favoritos') return p.isFavorite; // Mostra favoritos (independente de orado)
      return true;
    });
  }, [prayers, activeTab]);

  return (
    <div className="pb-40 px-4 space-y-6 bg-[#FFF5F1] min-h-screen">
      
      {/* SELETOR DE ABAS */}
      <div className="flex bg-white/60 p-1 rounded-2xl border border-gray-100 mt-6">
        <button 
          onClick={() => setActiveTab('atuais')}
          className={`flex-1 py-3 rounded-xl text-[9px] font-bold uppercase transition-all ${activeTab === 'atuais' ? 'bg-white text-[#FF4D8C] shadow-sm' : 'text-gray-400'}`}
        >
          Motivos
        </button>
        <button 
          onClick={() => setActiveTab('realizadas')}
          className={`flex-1 py-3 rounded-xl text-[9px] font-bold uppercase transition-all ${activeTab === 'realizadas' ? 'bg-white text-[#FF4D8C] shadow-sm' : 'text-gray-400'}`}
        >
          Orados
        </button>
        <button 
          onClick={() => setActiveTab('favoritos')}
          className={`flex-1 py-3 rounded-xl text-[9px] font-bold uppercase transition-all ${activeTab === 'favoritos' ? 'bg-white text-[#FF4D8C] shadow-sm' : 'text-gray-400'}`}
        >
          Favoritos
        </button>
      </div>

      {/* LISTAGEM */}
      <div className="space-y-6">
        {filteredPrayers.map((prayer) => (
          <div key={`${prayer.id}-${prayer.isPrayed}`} className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-50 space-y-5">
            
            <p className="text-[#2D1B4D] text-lg font-medium leading-relaxed">{prayer.texto}</p>

            {/* BOTÃO DE CONFIRMAÇÃO (CORRIGIDO) */}
            <button 
              onClick={() => togglePrayed(prayer.id)}
              className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-md ${
                prayer.isPrayed 
                ? 'bg-green-500 text-white' // Verde quando confirmado
                : 'bg-[#FF5722] text-white'  // Laranja quando pendente
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