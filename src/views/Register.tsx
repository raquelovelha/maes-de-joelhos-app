import React, { useState } from 'react';
import { auth, db } from '../firebase'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [nomesFilhos, setNomesFilhos] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Verifica se o usuário já existe no Firestore
      const userDoc = await getDoc(doc(db, "usuarios", user.uid));
      
      if (!userDoc.exists()) {
        // Se for novo, cria o perfil básico
        await setDoc(doc(db, "usuarios", user.uid), {
          uid: user.uid,
          nome: user.displayName || "Mãe de Oração",
          email: user.email,
          filhos: [],
          dataCadastro: new Date().toISOString(),
        });
        alert("Bem-vinda! Complete seu cadastro com os nomes dos filhos no perfil.");
      } else {
        alert("Bem-vinda de volta!");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao entrar com Google.");
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "usuarios", userCredential.user.uid), {
          uid: userCredential.user.uid,
          nome: nomeMae,
          email: email,
          filhos: nomesFilhos.split(',').map(n => n.trim()).filter(n => n !== ""),
          dataCadastro: new Date().toISOString(),
        });
      }
    } catch (error: any) {
      alert("Erro na autenticação. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F1] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-[3rem] p-8 shadow-2xl border border-orange-50 flex flex-col items-center text-center">
        
        <img 
          src="https://despertadebora.com.br/wp-content/uploads/2023/05/logo-desperta-debora.png" 
          alt="Desperta Débora" 
          className="h-20 w-auto object-contain mb-4"
        />

        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#FF4500] leading-none mb-1">Mães de Joelhos</h1>
          <p className="text-[#FF4500] font-bold italic text-sm">filhos de pé</p>
        </div>
        
        <form onSubmit={handleAuth} className="w-full space-y-3">
          {!isLogin && (
            <input 
              type="text"
              placeholder="Seu Nome" 
              className="w-full bg-[#FFF5F1] border border-orange-100 rounded-full px-5 py-2.5 text-sm outline-none"
              onChange={(e) => setNomeMae(e.target.value)}
            />
          )}
          
          <input 
            type="email" 
            placeholder="E-mail"
            className="w-full bg-[#FFF5F1] border border-orange-100 rounded-full px-5 py-2.5 text-sm outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <input 
            type="password" 
            placeholder="Senha"
            className="w-full bg-[#FFF5F1] border border-orange-100 rounded-full px-5 py-2.5 text-sm outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isLogin && (
            <input 
              type="text" 
              placeholder="Filhos (Lara, Liz...)"
              className="w-full bg-[#FFF5F1] border border-orange-100 rounded-full px-5 py-2.5 text-sm outline-none"
              onChange={(e) => setNomesFilhos(e.target.value)}
            />
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF4500] text-white font-black py-3.5 rounded-full shadow-lg active:scale-95 disabled:opacity-50 text-sm tracking-widest"
          >
            {loading ? 'PROCESSANDO...' : isLogin ? 'ENTRAR' : 'CADASTRAR'}
          </button>
        </form>

        {/* Botão Google */}
        <div className="w-full flex items-center my-4">
          <div className="flex-1 border-t border-gray-100"></div>
          <span className="px-3 text-[10px] text-gray-300 font-bold">OU</span>
          <div className="flex-1 border-t border-gray-100"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="w-full bg-white border border-gray-200 text-gray-600 font-bold py-3 rounded-full flex items-center justify-center gap-3 text-sm hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
          Entrar com Google
        </button>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-[11px] text-[#FF4500] font-bold hover:underline"
        >
          {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Login'}
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