import React from 'react';

const Filhos: React.FC<any> = ({ filhos = [], gcFilhos = [], onNavigate }) => {
  return (
    <div className="flex flex-col gap-6 pb-24 pt-4 px-4 min-h-screen bg-[#FDFCFE]">
      
      {/* Header com Destaque Geração Compromisso */}
      <div className="bg-gradient-to-br from-[#2D1B4D] to-[#4A2B7E] p-6 rounded-[2.5rem] shadow-xl shadow-purple-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
             {/* Aqui você pode trocar o ícone pela URL da logo oficial */}
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-inner">
               <i className="fa-solid fa- hands-praying text-[#FF4DAD] text-xl"></i>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight tracking-tight">Geração Compromisso</h2>
              <p className="text-purple-200 text-[10px] font-black uppercase tracking-widest">Intercessão Global</p>
            </div>
          </div>
          <p className="text-purple-100 text-xs leading-relaxed opacity-80">
            Adotando em oração a próxima geração. Filhos de joelhos, mães de pé!
          </p>
        </div>
      </div>

      {/* Seção: Meus Filhos */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Meus Filhos de Oração</h3>
          <button 
            onClick={() => onNavigate('novo-filho')}
            className="text-[10px] font-black text-[#FF4DAD] uppercase flex items-center gap-1 bg-rose-50 px-3 py-1 rounded-full"
          >
            <i className="fa-solid fa-plus text-[8px]"></i> Cadastrar
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filhos.length > 0 ? filhos.map((f: any, i: number) => (
            <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-lg">
                {f.nome.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#2D1B4D]">{f.nome}</span>
                  <span className="text-[8px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-400 font-bold uppercase">{f.tipo}</span>
                </div>
                <p className="text-[11px] text-gray-400 line-clamp-1">{f.pedidoFixo || 'Clamor diário...'}</p>
              </div>
              <button className="text-gray-200"><i className="fa-solid fa-chevron-right"></i></button>
            </div>
          )) : (
            <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-[2rem]">
              <p className="text-xs text-gray-400">Toque em cadastrar para incluir seus filhos.</p>
            </div>
          )}
        </div>
      </div>

      {/* Seção: Geração Compromisso (Banco Externo) */}
      <div className="flex flex-col gap-4 mt-2">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Filhos Adotados (GC)</h3>
        
        {gcFilhos.length > 0 ? gcFilhos.map((f: any, i: number) => (
          <div key={i} className="bg-[#F8F7FF] p-5 rounded-[2rem] border border-purple-50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <i className="fa-solid fa-user-graduate"></i>
            </div>
            <div className="flex-1">
              <span className="font-bold text-[#2D1B4D]">{f.nome}</span>
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-tighter">Campus: {f.campus || 'Global'}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#FF4DAD] shadow-sm">
              <i className="fa-solid fa-heart text-xs"></i>
            </div>
          </div>
        )) : (
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 text-center flex flex-col items-center gap-3">
            <i className="fa-solid fa-globe text-gray-100 text-3xl"></i>
            <p className="text-xs text-gray-400 px-6 italic">
              Em breve você poderá adotar um jovem da Geração Compromisso para interceder.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filhos;