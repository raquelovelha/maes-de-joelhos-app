import React from 'react';

const Filhos: React.FC<any> = ({ filhos = [], onNavigate }) => {
  // Se não for array, vira array vazio.
  const listaSegura = Array.isArray(filhos) ? filhos : [];

  return (
    <div className="flex flex-col gap-6 pb-24 pt-4 px-4 min-h-screen bg-[#FDFCFE]">
      <div className="bg-[#2D1B4D] p-6 rounded-[2.5rem] shadow-xl text-white">
        <h2 className="font-bold text-lg">Geração Compromisso</h2>
        <p className="text-[10px] opacity-70 uppercase tracking-widest">Intercessão</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-gray-400 uppercase">Meus Filhos</h3>
          <button onClick={() => onNavigate('novo-filho')} className="text-[10px] font-black text-[#FF4DAD] bg-rose-50 px-3 py-1 rounded-full">+ Cadastrar</button>
        </div>

        <div className="flex flex-col gap-3">
          {listaSegura.map((f: any, i: number) => (
            <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold">
                {/* SOLUÇÃO DEFINITIVA: Sem charAt. Se não tiver nome, mostra '?' */}
                {f?.nome ? f.nome[0].toUpperCase() : '?'}
              </div>
              <div className="flex-1">
                <span className="font-bold text-[#2D1B4D] text-sm">{f?.nome || "Sem Nome"}</span>
                <p className="text-[10px] text-gray-400 uppercase">{f?.tipo || 'Biológico'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filhos;