import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';

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

const Filhos: React.FC = () => {
  const [filhos, setFilhos] = useState<Filho[]>([
    { id: 'lara', nome: 'Lara', pedidos: [] },
    { id: 'liz', nome: 'Liz', pedidos: [] }
  ]);
  const [novoPedido, setNovoPedido] = useState('');
  const [filhoSelecionado, setFilhoSelecionado] = useState<string | null>(null);

  // --- 1. BUSCA DADOS EM TEMPO REAL (Garante que não sumam) ---
  useEffect(() => {
    if (!auth.currentUser) return;

    const userRef = doc(db, "usuarios", auth.currentUser.uid);
    
    // O onSnapshot "escuta" o banco. Se mudar lá, atualiza aqui na hora.
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.pedidos_filhos) {
          setFilhos(prev => prev.map(f => ({
            ...f,
            pedidos: data.pedidos_filhos[f.id] || []
          })));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // --- 2. ADICIONAR PEDIDO ---
  const adicionarPedido = async (filhoId: string) => {
    if (!novoPedido.trim() || !auth.currentUser) return;

    const pedidoObj: Pedido = {
      id: Date.now().toString(),
      texto: novoPedido,
      data: new Date().toLocaleDateString('pt-BR'),
      concluido: false
    };

    try {
      const userRef = doc(db, "usuarios", auth.currentUser.uid);
      await updateDoc(userRef, {
        [`pedidos_filhos.${filhoId}`]: arrayUnion(pedidoObj)
      });
      setNovoPedido('');
      setFilhoSelecionado(null);
    } catch (e) {
      console.error("Erro ao salvar pedido:", e);
    }
  };

  // --- 3. REGISTRAR RESPOSTA (TESTEMUNHO) ---
  const registrarResposta = async (filhoId: string, pedidoId: string, resposta: string) => {
    if (!auth.currentUser) return;

    const filhoAlvo = filhos.find(f => f.id === filhoId);
    if (!filhoAlvo) return;

    // Criamos a nova lista com o pedido atualizado
    const novosPedidos = filhoAlvo.pedidos.map(p => 
      p.id === pedidoId ? { ...p, resposta, concluido: true } : p
    );

    try {
      const userRef = doc(db, "usuarios", auth.currentUser.uid);
      await updateDoc(userRef, {
        [`pedidos_filhos.${filhoId}`]: novosPedidos
      });
    } catch (e) {
      console.error("Erro ao salvar resposta:", e);
    }
  };

  // --- 4. EXCLUIR PEDIDO (A pedido do usuário) ---
  const excluirPedido = async (filhoId: string, pedidoId: string) => {
    if (!window.confirm("Deseja excluir este pedido?") || !auth.currentUser) return;

    const filhoAlvo = filhos.find(f => f.id === filhoId);
    if (!filhoAlvo) return;

    const pedidosRestantes = filhoAlvo.pedidos.filter(p => p.id !== pedidoId);

    try {
      const userRef = doc(db, "usuarios", auth.currentUser.uid);
      await updateDoc(userRef, {
        [`pedidos_filhos.${filhoId}`]: pedidosRestantes
      });
    } catch (e) {
      console.error("Erro ao excluir:", e);
    }
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
              + NOVO PEDIDO
            </button>
          </div>

          {filhoSelecionado === filho.id && (
            <div className="flex gap-2 animate-slideDown">
              <input 
                type="text"
                placeholder={`O que pedir por ${filho.nome}?`}
                className="flex-1 bg-brand-soft border border-orange-100 rounded-full px-4 py-2 text-sm outline-none"
                value={novoPedido}
                onChange={(e) => setNovoPedido(e.target.value)}
              />
              <button onClick={() => adicionarPedido(filho.id)} className="bg-[#FF4500] text-white px-4 rounded-full text-xs font-bold">SALVAR</button>
            </div>
          )}

          <div className="space-y-4">
            {filho.pedidos.map(p => (
              <div key={p.id} className="bg-brand-soft/50 rounded-3xl p-5 border border-white space-y-3 relative group">
                <button 
                  onClick={() => excluirPedido(filho.id, p.id)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <i className="fa-solid fa-trash-can text-xs"></i>
                </button>

                <div className="pr-8">
                  <p className="text-sm text-brand-dark font-medium leading-relaxed">{p.texto}</p>
                  <span className="text-[8px] font-bold text-gray-400">{p.data}</span>
                </div>

                {p.resposta ? (
                  <div className="bg-green-50 p-3 rounded-2xl border border-green-100 mt-2">
                    <p className="text-[9px] font-black text-green-600 uppercase mb-1">🙌 RESPOSTA DE DEUS:</p>
                    <p className="text-xs text-green-700 italic">"{p.resposta}"</p>
                  </div>
                ) : (
                  <input 
                    type="text"
                    placeholder="Deus respondeu? Registre aqui..."
                    className="w-full bg-white/50 border border-gray-100 rounded-xl px-3 py-2 text-[10px] outline-none italic"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') registrarResposta(filho.id, p.id, e.currentTarget.value);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Filhos;