import React from 'react';

const Filhos: React.FC<any> = ({ filhos = [], gcFilhos = [], onNavigate }) => {
  // Garante que a lista de filhos sempre exista para não travar a tela
  const listaSegura = Array.isArray(filhos) ? filhos : [];

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
          <p className="text-purple-100 text-[11px] opacity-80 leading-relaxed">
            Adotando em oração a próxima geração.
          </p>
        </div>
      </div>

      {/* Seção: Meus Filhos */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Meus Filhos</h3>
          <button 
            onClick={() => onNavigate('novo-filho')}
            className="text-[10px] font-black text-[#FF4DAD] uppercase bg-rose-50 px-3 py-1 rounded-full border border-rose-100"
          >
            + Cadastrar Novo
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {listaSegura.length > 0 ? listaSegura.map((f: any, i: number) => (
            <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold">
                {f.nome ? f.nome.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="flex-1">
                <span className="font-bold text-[#2D1B4D] text-sm">{f.nome}</span>
                <p className="text-[10px] text-gray-400 uppercase font-medium">{f.tipo || 'Biológico'}</p>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-200 text-xs"></i>
            </div>
          )) : (
            <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/30">
              <p className="text-xs text-gray-400 px-10">Toque em cadastrar para incluir seus filhos de oração.</p>
            </div>
          )}
        </div>
      </div>

      {/* Espaço para Filhos GC (Banco Externo) */}
      <div className="mt-2 opacity-60">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-4">Filhos Adotados (GC)</h3>
        <div className="p-6 border-2 border-dashed border-purple-100 rounded-[2rem] text-center">
           <p className="text-[10px] text-purple-300 italic">Os filhos da Geração Compromisso aparecerão aqui automaticamente via banco de dados.</p>
        </div>
      </div>
    </div>
  );
};

export default Filhos;