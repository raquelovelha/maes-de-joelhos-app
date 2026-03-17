import React from 'react';

const Filhos: React.FC<any> = ({ filhos = [], gcFilhos = [], onNavigate }) => {
  // Se 'filhos' vier com erro, ele vira uma lista vazia e não trava a tela
  const listaSegura = Array.isArray(filhos) ? filhos : [];

  return (
    <div className="flex flex-col gap-6 pb-24 pt-4 px-4 min-h-screen bg-[#FDFCFE]">
      {/* ... (todo o resto do código que te mandei antes) ... */}
      
      {/* Onde tem o map, use 'listaFilhos' */}
      {listaFilhos.length > 0 ? listaFilhos.map((f: any, i: number) => (
         // ... render do card ...
      )) : (
         <p>Nenhum filho cadastrado.</p>
      )}
    </div>
  );
};

export default Filhos;