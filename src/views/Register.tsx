import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; 

const RegisterView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [nomesFilhos, setNomesFilhos] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o recarregamento da página

    if (!email || !password || !nomeMae) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    const auth = getAuth();
    
    try {
      // 1. Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Salva os dados na coleção 'usuarios'
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        nome: nomeMae,
        email: email,
        filhos: nomesFilhos.split(',').map(n => n.trim()).filter(n => n !== ""), 
        dataCadastro: new Date().toISOString(),
      });

      alert("Bem-vinda! Cadastro realizado com sucesso.");
      // O App.tsx detectará o login automaticamente via onAuthStateChanged
    } catch (error: any) {
      console.error(error);
      alert("Erro no cadastro: Verifique os dados ou se o e-mail já existe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-soft flex flex-col items-center justify-center p-6 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-xl border border-brand-border">
        <div className="text-center mb-8">
          <h1 className="serif-font text-3xl font-bold text-brand-primary mb-2">Mães de Joelhos</h1>
          <p className="text-sm text-gray-500 font-medium italic">
            Crie sua conta para iniciar a jornada de 101 dias
          </p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-brand-rose uppercase tracking-widest ml-4">Seu Nome</label>
            <input 
              type="text"
              placeholder="Ex: Maria Silva" 
              className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-primary/20"
              value={nomeMae}
              onChange={(e) => setNomeMae(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-brand-rose uppercase tracking-widest ml-4">E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-primary/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-brand-rose uppercase tracking-widest ml-4">Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-primary/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-brand-rose uppercase tracking-widest ml-4">Nomes dos filhos</label>
            <input 
              type="text" 
              placeholder="João, Maria (separados por vírgula)" 
              className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-primary/20"
              value={nomesFilhos}
              onChange={(e) => setNomesFilhos(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-brand-primary text-white font-black py-4 rounded-full mt-6 shadow-lg shadow-brand-primary/20 transition-all active:scale-95 ${loading ? 'opacity-50' : 'hover:bg-brand-dark'}`}
          >
            {loading ? 'CADASTRANDO...' : 'CADASTRAR AGORA'}
          </button>
        </form>

        <p className="text-center mt-8 text-[11px] text-gray-400 font-medium">
          Ao se cadastrar, você concorda em iniciar sua <br/> jornada de intercessão diária.
        </p>
      </div>
    </div>
  );
};

export default RegisterView;