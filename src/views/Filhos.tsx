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
  // Ajustamos os IDs para "1" e "2" para bater com a sua imagem do Firebase
  const [filhos, setFilhos] = useState<Filho[]>([
    { id: '1', nome: 'Lara', pedidos: [] },
    { id: '2', nome: 'Liz', pedidos: [] }
  ]);
  const [novoPedido, setNovoPedido] = useState('');
  const [filhoSelecionado, setFilhoSelecionado] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const userRef = doc(db, "usuarios", auth.currentUser.uid);
    
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Aqui está a correção: lemos os campos "1" e "2" diretamente, como na imagem
        setFilhos(prev => prev.map(f => ({
          ...f,
          pedidos: data[f.id] || [] 
        })));
      }
    }, (error) => {
      console.error("Erro ao carregar pedidos:", error);
    });

    return () => unsubscribe();
  }, []);

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
      // Salva no campo "1" ou "2" conforme a estrutura atual do seu banco
      await updateDoc(userRef, {
        [filhoId]: arrayUnion(pedidoObj)
      });
      setNovoPedido('');
      setFilhoSelecionado(null);
    } catch (e) {
      console.error("Erro ao salvar:", e);
    }
  };

  const excluirPedido = async (filhoId: string, pedidoId: string) => {
    if (!window.confirm("Deseja excluir este pedido?") || !auth.currentUser) return;
    const filhoAlvo = filhos.find(f => f.id === filhoId);
    if (!filhoAlvo) return;
    const pedidosRestantes = filhoAlvo.pedidos.filter(p => p.id !== pedidoId);
    try {
      const userRef = doc(db, "usuarios", auth.currentUser.uid);
      await updateDoc(userRef, { [filhoId]: pedidosRestantes });
    } catch (e) { console.error(e); }
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
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-[#FF4500] font-black shadow-sm">
                {filho.nome[0]}
              </div>
              <h3 className="serif-font text-xl font-bold text-brand-dark">{filho.nome}</h3>
            </div>
            <button 
              onClick={() => setFilhoSelecionado(filho.id)}
              className="text-[#FF4500] text-[10px] font-black uppercase tracking-widest bg-orange-50 px-4 py-2 rounded-full hover:bg-orange-100 transition-colors"
            >
              + NOVO PEDIDO
            </button>
          </div>

          {filhoSelecionado === filho.id && (
            <div className="flex gap-2 animate-slideDown">
              <input 
                type="text"
                placeholder={`O que pedir por ${filho.nome}?`}
                className="flex-1 bg-brand-soft border border-orange-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                value={novoPedido}
                onChange={(e) => setNovoPedido(e.target.value)}
              />
              <button onClick={() => adicionarPedido(filho.id)} className="bg-[#FF4500] text-white px-4 rounded-full text-xs font-bold shadow-md active:scale-95">SALVAR</button>
            </div>
          )}

          <div className="space-y-4">
            {filho.pedidos.length === 0 && (
              <p className="text-center text-gray-300 text-[10px] uppercase font-bold py-4">Nenhum pedido registrado</p>
            )}
            {filho.pedidos.map(p => (
              <div key={p.id} className="bg-brand-soft/50 rounded-3xl p-5 border border-white space-y-3 relative group shadow-sm">
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
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Filhos;