import React from 'react';

const Filhos: React.FC<any> = ({ filhos = [], onNavigate }) => {
  const listaSegura = Array.isArray(filhos) ? filhos : [];

  return (
    <div className="flex flex-col gap-6 pb-24 pt-4 px-4 min-h-screen bg-[#FDFCFE]">
      <div className="bg-gradient-to-br from-[#2D1B4D] to-[#4A2B7E] p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden">
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

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Meus Filhos</h3>
          <button onClick={() => onNavigate('novo-filho')} className="text-[10px] font-black text-[#FF4DAD] uppercase bg-rose-50 px-3 py-1 rounded-full">+ Cadastrar</button>
        </div>

        <div className="flex flex-col gap-3">
          {listaSegura.map((f: any, i: number) => {
            // AQUI ESTÁ A CURA: Verificamos se f e f.nome existem ANTES de usar o charAt
            const nomeValido = f?.nome || "Sem Nome";
            const inicial = nomeValido.charAt(0).toUpperCase();

            return (
              <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold">
                  {inicial}
                </div>
                <div className="flex-1">
                  <span className="font-bold text-[#2D1B4D] text-sm">{nomeValido}</span>
                  <p className="text-[10px] text-gray-400 uppercase font-medium">{f?.tipo || 'Biológico'}</p>
                </div>
              </div>
            );
          })}
          {listaSegura.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-[2rem]">
              <p className="text-xs text-gray-400 px-10">Nenhum filho encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filhos;