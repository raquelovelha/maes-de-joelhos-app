import React from 'react';

const FilhosViewFinal: React.FC<any> = ({ filhos, onNavigate }) => {
  // Se o App mandar vazio, ele cria uma lista vazia automática
  const listaSegura = Array.isArray(filhos) ? filhos : [];

  return (
    <div className="flex flex-col gap-6 pb-24 pt-4 px-4 min-h-screen bg-[#FDFCFE]">
      
      {/* CARD ROXO - GERAÇÃO COMPROMISSO (O teste real) */}
      <div className="bg-[#2D1B4D] p-6 rounded-[2.5rem] shadow-xl text-white relative">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
             <i className="fa-solid fa-hands-praying text-[#FF4DAD] text-xl"></i>
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Geração Compromisso</h2>
            <p className="text-[10px] opacity-60 uppercase font-black">Intercessão pelos Filhos</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black text-gray-400 uppercase">Meus Filhos</h3>
        <button 
          onClick={() => onNavigate('home')} 
          className="text-[10px] font-black text-[#FF4DAD] bg-rose-50 px-4 py-2 rounded-full border border-rose-100"
        >
          VOLTAR
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {listaSegura.length > 0 ? (
          listaSegura.map((item: any, index: number) => (
            <div key={index} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                {(item?.nome || item?.name || "F")[0].toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#2D1B4D] text-sm">{item?.nome || item?.name || "Filho"}</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold">{item?.tipo || "Oração"}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <p className="text-[11px] text-gray-400 font-medium">Nenhum filho encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilhosViewFinal;