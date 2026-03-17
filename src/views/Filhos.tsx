import React from 'react';

const Filhos: React.FC<any> = ({ filhos = [], gcFilhos = [], onNavigate }) => {
  // Trava de segurança: se por algum motivo 'filhos' vier nulo, ele vira um array vazio
  const listaFilhos = Array.isArray(filhos) ? filhos : [];

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