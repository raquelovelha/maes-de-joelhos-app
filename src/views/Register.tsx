import React, { useState } from 'react';
import { auth, db } from '../firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const RegisterView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [nomesFilhos, setNomesFilhos] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth) {
      alert("Erro técnico: O sistema de autenticação ainda não carregou. Tente atualizar a página.");
      return;
    }

    if (!email || !password || !nomeMae) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        nome: nomeMae,
        email: email,
        filhos: nomesFilhos.split(',').map(n => n.trim()).filter(n => n !== ""),
        dataCadastro: new Date().toISOString(),
      });

      alert("Bem-vinda! Cadastro realizado com sucesso.");
    } catch (error: any) {
      console.error(error);
      alert("Erro no cadastro: Verifique os dados ou se o e-mail já existe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F1] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-[3rem] p-8 shadow-2xl border border-orange-50 flex flex-col items-center text-center">
        
        {/* Logo Desperta Débora - Tamanho Ajustado */}
        <div className="mb-4">
          <img 
            src="https://despertadebora.com.br/wp-content/uploads/2023/05/logo-desperta-debora.png" 
            alt="Desperta Débora" 
            className="h-20 w-auto object-contain"
          />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#FF4500] leading-none mb-1">Mães de Joelhos</h1>
          <p className="text-[#FF4500] font-bold italic text-sm mb-4">filhos de pé</p>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest px-2">
            Crie sua conta para se tornar uma Débora e mãe de oração
          </p>
        </div>
        
        <form onSubmit={handleRegister} className="w-full space-y-3">
          <div className="text-left">
            <label className="text-[9px] font-black text-pink-400 uppercase ml-4 mb-1 block tracking-widest">Seu Nome</label>
            <input 
              type="text"
              placeholder="Ex: Raquel Guerreiro" 
              className="w-full bg-[#FFF5F1] border border-orange-100 rounded-full px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-200 transition-all shadow-sm"
              onChange={(e) => setNomeMae(e.target.value)}
            />
          </div>
          
          <div className="text-left">
            <label className="text-[9px] font-black text-pink-400 uppercase ml-4 mb-1 block tracking-widest">E-mail</label>
            <input 
              type="email" 
              placeholder="exemplo@gmail.com"
              className