import React from 'react';

const Filhos: React.FC<any> = ({ filhos = [], onNavigate }) => {
  // Se não houver filhos, garante que seja uma lista vazia
  const lista = Array.isArray(filhos) ? filhos : [];

  return (
    <div className="flex flex-col gap-6 pb-24 pt-4 px-4 min-h-screen bg-[#FDFCFE]">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold text-[#2D1B4D]">Filhos</h2>
        <button 
          onClick={() => onNavigate('novo-filho')}
          className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md"
        >
          + CADASTRAR
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {lista.length > 0 ? (
          lista.map((f: any, i: number) => (
            <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg">
                {/* Usando colchetes para pegar a letra, que não dá erro se o nome sumir */}
                {f?.nome ? f.nome[0].toUpperCase() : "?"}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#2D1B4D]">{f?.nome || "Sem Nome"}</span>
                <span className="text-xs text-gray-400 uppercase tracking-tighter">{f?.tipo || "Filho"}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 opacity-40">
            <p className="text-sm">Nenhum filho cadastrado ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filhos;