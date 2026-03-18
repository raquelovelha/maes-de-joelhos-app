import React from 'react';

// Recebemos o 'memorial' (que vem do usePrayers) e o 'loading'
const Memorial: React.FC<any> = ({ memorial = [], loading, onNavigate }) => {
  
  return (
    <div className="flex flex-col gap-6 pb-24 pt-4 px-4 min-h-screen bg-[#FDFCFE]">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('prayers')} 
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2D1B4D]"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2 className="text-2xl font-bold text-[#2D1B4D]">Meu Diário</h2>
      </div>

      {loading ? (
        /* Tela de Carregamento */
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#FF4DAD]/20 border-t-[#FF4DAD] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 animate-pulse">Carregando memórias...</p>
        </div>
      ) : memorial.length > 0 ? (
        /* Lista de Memórias */
        <div className="flex flex-col gap-4 animate-fadeIn">
          {memorial.map((item: any) => (
            <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-black text-[#FF4DAD] uppercase tracking-widest">
                  {item.data || 'Registro'}
                </span>
                <i className="fa-solid fa-quote-right text-gray-100 text-xl"></i>
              </div>
              <p className="text-[#2D1B4D] leading-relaxed italic">
                "{item.texto || item.clamor || item.content}"
              </p>
              {item.tag && (
                <div className="mt-4 flex gap-2">
                  <span className="text-[9px] bg-gray-50 px-3 py-1 rounded-full text-gray-400 font-bold uppercase">
                    #{item.tag}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Tela de Diário Vazio */
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-10">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <i className="fa-solid fa-pen-nib text-gray-200 text-3xl"></i>
          </div>
          <h3 className="text-lg font-bold text-[#2D1B4D] mb-2">Seu diário está pronto</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Aqui aparecerão as orações que você salvar no seu memorial pessoal.
          </p>
          <button 
            onClick={() => onNavigate('prayers')}
            className="mt-8 bg-[#FF4DAD] text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-[#FF4DAD]/20 active:scale-95 transition-transform"
          >
            Começar a Orar
          </button>
        </div>
      )}
    </div>
  );
};

export default Memorial;