import React from 'react';

const Filhos: React.FC<any> = (props) => {
  // Garante que a lista exista, vindo como 'filhos' ou 'children'
  const lista = props.filhos || props.children || [];
  const onNavigate = props.onNavigate;

  return (
    <div className="flex flex-col gap-6 pb-24 pt-4 px-4 min-h-screen bg-[#FDFCFE] animate-fadeIn">
      
      {/* Card de Cabeçalho - Geração Compromisso */}
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
        {/* Detalhe estético de fundo */}
        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Meus Filhos</h3>
          <button 
            onClick={() => onNavigate && onNavigate('novo-filho')}
            className="text-[10px] font-black text-[#FF4DAD] uppercase bg-rose-50 px-4 py-2 rounded-full border border-rose-100 active:scale-95 transition-transform"
          >
            + Cadastrar
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {lista.length > 0 ? (
            lista.map((f: any, i: number) => {
              // Tratamento seguro para evitar o erro de charAt/undefined
              const nomeDisplay = f?.nome || f?.name || "Sem Nome";
              const inicial = nomeDisplay[0].toUpperCase();

              return (
                <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 flex items-center gap-4 animate-slideUp">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-500 flex items-center justify-center font-bold text-lg shadow-sm">
                    {inicial}
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-[#2D1B4D] text-sm block">{nomeDisplay}</span>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight mt-0.5">
                      {f?.tipo || 'Biológico'}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    <i className="fa-solid fa-chevron-right text-gray-300 text-[10px]"></i>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-[3rem] bg-gray-50/30">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <i className="fa-solid fa-child-reaching text-gray-200 text-xl"></i>
              </div>
              <p className="text-[11px] text-gray-400 font-medium px-10 leading-relaxed">
                Nenhum filho cadastrado.<br/>Toque em cadastrar para iniciar.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filhos;