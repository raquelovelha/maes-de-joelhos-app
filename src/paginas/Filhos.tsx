import React from 'react';

// Mudamos o nome para FilhosFinal para forçar o Vercel a reconhecer algo novo
const FilhosFinal: React.FC<any> = ({ filhos = [], onNavigate }) => {
  const lista = Array.isArray(filhos) ? filhos : [];
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Aba Filhos Restaurada</h1>
      <ul className="mt-4">
        {lista.map((f: any, i: number) => (
          <li key={i} className="border-b py-2">
            {/* USANDO COLCHETES PARA FUGIR DO CHARAT */}
            <span className="font-bold">[{f?.nome ? f.nome[0] : '?'}]</span> {f?.nome || "Sem nome"}
          </li>
        ))}
      </ul>
      <button onClick={() => onNavigate('home')} className="mt-4 p-2 bg-gray-100 rounded">Voltar</button>
    </div>
  );
};

export default FilhosFinal;