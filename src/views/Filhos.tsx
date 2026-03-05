import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

interface Pedido {
  id: string;
  texto: string;
  resposta?: string;
  data: string;
  concluido: boolean;
}

interface Filho {
  id: string;
  nome: string;
  pedidos: Pedido[];
}

const FilhosView: React.FC = () => {
  // Estado inicial com Lara e Liz (isso idealmente viria do Firebase)
  const [filhos, setFilhos] = useState<Filho[]>([
    { id: '1', nome: 'Lara', pedidos: [] },
    { id: '2', nome: 'Liz', pedidos: [] }
  ]);

  const [novoPedido, setNovoPedido] = useState('');
  const [filhoSelecionado, setFilhoSelecionado] = useState<string | null>(null);

  // Função para adicionar novo pedido
  const adicionarPedido = async (filhoId: string) => {
    if (!novoPedido.trim()) return;

    const pedidoObj: Pedido = {
      id: Date.now().toString(),
      texto: novoPedido,
      data: new Date().toLocaleDateString('pt-BR'),
      concluido: false
    };

    // Atualiza localmente
    setFilhos(prev => prev.map(f => 
      f.id === filhoId ? { ...f, pedidos: [pedidoObj, ...f.pedidos] } : f
    ));

    // Salva no Firebase (ajuste conforme sua estrutura de coleção)
    if (auth.currentUser) {
      try {
        const userRef = doc(db, "usuarios", auth.currentUser.uid);
        await updateDoc(userRef, {
          [`pedidos_filhos.${filhoId}`]: arrayUnion(pedidoObj)
        });
      } catch (e) { console.error(e); }
    }

    setNovoPedido('');
    setFilhoSelecionado(null);
  };

  // Função para registrar a Resposta de Oração
  const registrarResposta = (filhoId: string, pedidoId: string, resposta: string) => {
    setFilhos(prev => prev.map(f => {
      if (f.id === filhoId) {
        return {
          ...f,
          pedidos: f.pedidos.map(p => 
            p.id === pedidoId ? { ...p, resposta, concluido: true } : p
          )
        };
      }
      return f;
    }));
    // Aqui você também adicionaria o updateDoc para salvar a resposta no Firebase
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-24 px-2">
      <div className="flex flex-col gap-1">
        <h2 className="serif-font text-3xl font-bold text-brand-dark">Meus Filhos</h2>
        <p className="text-[10px] text-brand-rose font-black uppercase tracking-[0.2em]">Intercedendo por nome</p>
      </div>

      {filhos.map(filho => (
        <div key={filho.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-orange-50 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-[#FF4500] font-black">
                {filho.nome[0]}
              </div>
              <h3 className="serif-font text-xl font-bold text-brand-dark">{filho.nome}</h3>
            </div>
            <button 
              onClick={() => setFilhoSelecionado(filho.id)}
              className="text-[#FF4500] text-[10px] font-black uppercase tracking-widest bg-orange-50 px-4 py-2 rounded-full"
            >
              + Novo Pedido
            </button>
          </div>

          {/* Modal/Campo rápido para novo pedido */}
          {filhoSelecionado === filho.id && (
            <div className="flex gap-2 animate-slideDown">
              <input 
                type="text"
                placeholder={`O que pedir por ${filho.nome}?`}
                className="flex-1 bg-brand-soft border border-orange-100 rounded-full px-4 py-2 text-sm outline-none"
                value={novoPedido}
                onChange={(e) => setNovoPedido(e.target.value)}
              />
              <button onClick={() => adicionarPedido(filho.id)} className="bg-[#FF4500] text-white px-4 rounded-full text-xs font-bold">Salvar</button>
            </div>
          )}

          {/* Lista de Pedidos */}
          <div className="space-y-4">
            {filho.pedidos.length === 0 && (
              <p className="text-center text-gray-300 text-[10px] uppercase font-bold py-4">Nenhum pedido registrado</p>
            )}
            {filho.pedidos.map(p => (
              <div key={p.id} className="bg-brand-soft/50 rounded-3xl p-5 border border-white space-y-3">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-brand-dark font-medium leading-relaxed">{p.texto}</p>
                  <span className="text-[8px] font-bold text-gray-400">{p.data}</span>
                </div>

                {/* Campo de Resposta de Oração */}
                {p.resposta ? (
                  <div className="bg-green-50 p-3 rounded-2xl border border-green-100 mt-2">
                    <p className="text-[9px] font-black text-green-600 uppercase mb-1">🙌 Resposta de Deus:</p>
                    <p className="text-xs text-green-700 italic">"{p.resposta}"</p>
                  </div>
                ) : (
                  <div className="pt-2">
                    <input 
                      type="text"
                      placeholder="Deus respondeu? Registre o testemunho aqui..."
                      className="w-full bg-white/50 border border-gray-100 rounded-xl px-3 py-2 text-[10px] outline-none italic"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') registrarResposta(filho.id, p.id, e.currentTarget.value);
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilhosView;