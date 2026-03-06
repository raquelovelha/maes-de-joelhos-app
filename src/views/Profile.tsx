import React from 'react';
import { auth } from '../firebase';

interface ProfileProps {
  profile?: any;
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  const totalPedidos = profile?.pedidosTotalHistorico || 0;
  const totalMinutos = profile?.minutosTotalHistorico || 0;

  return (
    <div className="space-y-8 animate-fadeIn pb-24 px-4">
      {/* HEADER DO PERFIL */}
      <div className="flex flex-col items-center text-center py-6">
        <div className="w-24 h-24 bg-gradient-to-tr from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4 ring-4 ring-white">
          {profile?.nome?.[0] || 'D'}
        </div>
        <h2 className="serif-font text-2xl font-bold text-brand-dark">{profile?.nome || 'Débora'}</h2>
        <p className="text-xs text-gray-400 font-black uppercase tracking-widest mt-1">Intercessora fiel</p>
      </div>

      {/* CARD DE HISTÓRICO TOTAL */}
      <div className="bg-brand-dark text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <i className="fa-solid fa-hands-praying text-6xl"></i>
        </div>
        
        <h4 className="serif-font text-xl mb-8 opacity-90">Minha Jornada Total</h4>
        
        <div className="grid grid-cols-2 gap-8 relative z-10">
          <div className="space-y-2">
            <p className="text-[10px] opacity-50 uppercase font-black tracking-[0.2em]">Orações</p>
            <p className="text-4xl font-black text-orange-400">{totalPedidos}</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] opacity-50 uppercase font-black tracking-[0.2em]">Tempo</p>
            <p className="text-4xl font-black text-pink-400">{totalMinutos}m</p>
          </div>
        </div>
      </div>

      {/* BOTÃO SAIR */}
      <button 
        onClick={() => auth.signOut()}
        className="w-full py-5 bg-gray-50 text-gray-400 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100 mt-12"
      >
        Sair do Aplicativo
      </button>
    </div>
  );
};

export default Profile;