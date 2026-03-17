import React from 'react';

const Filhos: React.FC<any> = ({ filhos = [], onNavigate }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Página de Filhos</h2>
      <button onClick={() => onNavigate('home')} className="bg-gray-200 p-2 rounded mb-4">Voltar Home</button>
      
      <div className="space-y-2">
        {Array.isArray(filhos) && filhos.map((f: any, i: number) => (
          <div key={i} className="p-4 border rounded bg-white">
            {f?.nome || f?.name || "Sem Nome"}
          </div>
        ))}
        {(!filhos || filhos.length === 0) && <p>Nenhum dado encontrado.</p>}
      </div>
    </div>
  );
};

export default Filhos;