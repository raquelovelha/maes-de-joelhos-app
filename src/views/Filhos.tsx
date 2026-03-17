import React from 'react';

const Filhos: React.FC<any> = ({ filhos = [], gcFilhos = [], onNavigate }) => {
  return (
    <div className="flex flex-col gap-6 pb-24 pt-4 px-4 min-h-screen bg-[#FDFCFE]">
      
      {/* Header Geração Compromisso */}
      <div className="bg-gradient-to-br from-[#2D1B4D] to-[#4A2B7E] p-6 rounded-[2.5rem] shadow-xl shadow-purple-100 relative overflow-hidden">
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-inner">
               <i className="fa-solid fa-hands-praying text-[#FF4DAD] text-xl"></i>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">Geração Compromisso</h2>
              <p className="text-purple-200 text-[10px] font-black uppercase tracking-widest">Intercessão Global</p>
            </div>
          </div>
        </div>
      </div>

      {/* Meus Filhos */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Meus Filhos</h3>
          <button 
            onClick={() => onNavigate('novo-filho')}
            className="text-[10px] font-black text-[#FF4DAD] uppercase bg-rose-50 px-3 py-1 rounded-full"
          >
            + Cadastrar
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {filhos && filhos.length > 0 ? filhos.map((f: any, i: number) => (
            <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold">
                {f.nome?.charAt(0)}
              </div>
              <div className="flex-1">
                <span className="font-bold text-[#2D1B4D] text-sm">{f.nome}</span>
                <p className="text-[10px] text-gray-400">{f.tipo || 'Filho'}</p>
              </div>
            </div>
          )) : (
            <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-[2rem]">
              <p className="text-xs text-gray-400 px-10">Nenhum filho cadastrado ainda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filhos;