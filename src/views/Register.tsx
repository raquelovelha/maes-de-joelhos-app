import React, { useState } from 'react';
import { auth, db } from '../firebase'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [nomesFilhos, setNomesFilhos] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return alert("Erro ao carregar sistema.");
    
    if (!email || !password) return alert("Preencha e-mail e senha.");

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Bem-vinda de volta!");
      } else {
        if (!nomeMae) {
            setLoading(false);
            return alert("Por favor, informe seu nome.");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "usuarios", user.uid), {
          uid: user.uid,
          nome: nomeMae,
          email: email,
          filhos: nomesFilhos.split(',').map(n => n.trim()).filter(n => n !== ""),
          dataCadastro: new Date().toISOString(),
        });
        alert("Conta criada com sucesso!");
      }
    } catch (error: any) {
      console.error(error);
      alert(isLogin ? "E-mail ou senha incorretos." : "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      return alert("Digite seu e-mail no campo acima para redefinir a senha.");
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("E-mail de redefinição enviado!");
    } catch (error: any) {
      alert("Erro ao enviar e-mail.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F1] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-[3rem] p-8 shadow-2xl border border-orange-50 flex flex-col items-center text-center">
        
        <div className="mb-4">
          <img 
            src="https://despertadebora.com.br/wp-content/uploads/2023/05/logo-desperta-debora.png" 
            alt="Desperta Débora" 
            className="h-20 w-auto object-contain"
          />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#FF4500] leading-none mb-1">Mães de Joelhos</h1>
          <p className="text-[#FF4500] font-bold italic text-sm">filhos de pé</p>
        </div>
        
        <form onSubmit={handleAuth} className="w-full space-y-3">
          {!isLogin && (
            <div className="text-left">
              <label className="text-[9px] font-black text-pink-400 uppercase ml-4 mb-1 block tracking-widest">Seu Nome</label>
              <input 
                type="text"
                placeholder="Ex: Raquel Guerreiro" 
                className="w-full bg-[#FFF5F1] border border-orange-100 rounded-full px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                onChange={(e) => setNomeMae(e.target.value)}
              />
            </div>
          )}
          
          <div className="text-left">
            <label className="text-[9px] font-black text-pink-400 uppercase ml-4 mb-1 block tracking-widest">E-mail</label>
            <input 
              type="email" 
              placeholder="exemplo@gmail.com"
              className="w-full bg-[#FFF5F1] border border-orange-100 rounded-full px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="text-left">
            <label className="text-[9px] font-black text-pink-400 uppercase ml-4 mb-1 block tracking-widest">Senha</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-[#FFF5F1] border border-orange-100 rounded-full px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-200"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isLogin && (
            <div className="text-right pr-4">
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="text-[10px] text-gray-400 font-bold hover:text-[#FF4500]"
              >
                Esqueceu a senha?
              </button>
            </div>
          )}

          {!isLogin && (
            <div className="text-left">
              <label className="text-[9px] font-black text-pink-400 uppercase ml-4 mb-1 block tracking-widest">Nomes dos filhos</label>
              <input 
                type="text" 
                placeholder="Lara, Liz..."
                className="w-full bg-[#FFF5F1] border border-orange-100 rounded-full px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                onChange={(e) => setNomesFilhos(e.target.value)}
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF4500] text-white font-black py-3.5 rounded-full mt-4 shadow-lg active:scale-95 disabled:opacity-50 text-sm tracking-widest"
          >
            {loading ? 'PROCESSANDO...' : isLogin ? 'ENTRAR' : 'CADASTRAR AGORA'}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-[11px] text-[#FF4500] font-bold hover:underline"
        >
          {isLogin ? 'Não tem conta? Cadastre-se aqui' : 'Já tem uma conta? Faça Login'}
        </button>

        <div className="mt-8">
          <img 
            src="https://www.call2allbrasil.com.br/wp-content/uploads/2025/12/mpc-1.webp" 
            alt="MPC Brasil" 
            className="h-10 w-auto opacity-70"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthView;