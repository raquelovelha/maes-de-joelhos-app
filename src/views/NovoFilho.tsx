import React, { useState } from 'react';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

const NovoFilho: React.FC<any> = ({ onNavigate }) => {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('Biológico');
  const [pedidoFixo, setPedidoFixo] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !userId) return;

    setLoading(true);
    try {
      const userRef = doc(db, "usuarios", userId);
      await updateDoc(userRef, {
        filhos: arrayUnion({
          nome: nome.trim(),
          tipo: tipo,
          pedidoFixo: pedidoFixo.trim(),
          observacoes: observacoes.trim(),
          createdAt: new Date().toISOString()
        })
      });
      // Ajustado para voltar para a aba de filhos
      onNavigate('filhos');
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar filho. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-24 pt-4 px-6 min-h-screen bg-[#FDFCFE]">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('filhos')} 
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2D1B4D]"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2 className="text-xl font-bold text-[#2D1B4D]">Cadastrar Filho</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nome</label>
          <input 
            type="text" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            className="p-4 rounded-2xl bg-white border border-gray-100 outline-none shadow-sm" 
            placeholder="Nome do filho" 
            required 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Tipo de Filiação</label>
          <select 
            value={tipo} 
            onChange={(e) => setTipo(e.target.value)} 
            className="p-4 rounded-2xl bg-white border border-gray-100 outline-none text-sm shadow-sm"
          >
            <option value="Biológico">Biológico</option>
            <option value="Adotivo">Adotivo</option>
            <option value="Espiritual">Espiritual / Afilhado</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Clamor Fixo (O que ele mais precisa?)</label>
          <textarea 
            value={pedidoFixo} 
            onChange={(e) => setPedidoFixo(e.target.value)} 
            className="p-4 rounded-2xl bg-white border border-gray-100 outline-none resize-none shadow-sm" 
            rows={3} 
            placeholder="Ex: Salvação, libertação, saúde..." 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Observações / Data de Niver</label>
          <input 
            type="text" 
            value={observacoes} 
            onChange={(e) => setObservacoes(e.target.value)} 
            className="p-4 rounded-2xl bg-white border border-gray-100 outline-none shadow-sm" 
            placeholder="Ex: Faz aniversário dia 10/05" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="mt-4 p-5 rounded-[2rem] bg-blue-600 text-white font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Finalizar Cadastro'}
        </button>
      </form>
    </div>
  );
};

export default NovoFilho;