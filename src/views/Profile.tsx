import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

interface ProfileProps {
  profile: any;
  stats: any;
  setProfile: (profile: any) => void;
}

const ProfileView: React.FC<ProfileProps> = ({ profile, stats, setProfile }) => {
  const [saving, setSaving] = useState(false);

  // Função para gerar as iniciais dinâmicas (ex: Raquel Guerreiro -> RG)
  const getInitials = (name: string) => {
    if (!name || name === 'Missionária') return 'M';
    const names = name.trim().split(' ');
    return names.length > 1 
      ? (names[0][0] + names[names.length - 1][0]).toUpperCase() 
      : names[0][0].toUpperCase();
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      const userRef = doc(db, "usuarios", auth.currentUser.uid);
      await updateDoc(userRef, {
        nome: profile.nome,
        cidade: profile.cidade,
        estado: profile.estado,
        igreja: profile.igreja,
        grupoDeboras: profile.grupoDeboras,
        dataNascimento: profile.dataNascimento,
        filhosAdotados: profile.filhosAdotados
      });
      alert("Perfil atualizado com sucesso! 🙏");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar perfil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24 px-2">
      {/* CABEÇALHO DO PERFIL COM AVATAR DE INICIAIS */}
      <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-brand-border flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-orange-100/30 to-pink-100/30"></div>
        
        <div className="relative mt-4">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-gradient-to-br from-[#FF4500] to-[#FF8C00]">
            {profile.fotoUrl ? (
              <img src={profile.fotoUrl} alt="Perfil" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-4xl font-black text-white tracking-tighter shadow-sm">
                {getInitials(profile.nome)}
              </span>
            )}
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm border border-orange-100 whitespace-nowrap">
            <p className="text-[8px] font-black text-[#FF4500] uppercase tracking-widest">Intercessora</p>
          </div>
        </div>

        <h2 className="serif-font text-2xl font-bold text-brand-dark mt-6">{profile.nome || 'Missionária'}</h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{profile.grupoDeboras || 'Déboras Online'}</p>

        {/* ESTATÍSTICAS ATUALIZADAS */}
        <div className="grid grid-cols-2 gap-4 w-full mt-8">
          <div className="bg-orange-50/50 p-4 rounded-3xl border border-orange-100">
            <p className="text-[9px] font-black text-[#FF4500] uppercase">Pedidos Orados</p>
            <p className="text-2xl font-black text-[#FF4500]">
              {profile.pedidosConcluidos || 0} 🙏
            </p>
          </div>
          <div className="bg-pink-50/50 p-4 rounded-3xl border border-pink-100">
            <p className="text-[9px] font-black text-brand-rose uppercase">Minutos Totais</p>
            <p className="text-2xl font-black text-brand-rose">
              {profile.minutosIntercedidos || 0}
            </p>
          </div>
        </div>
      </div>

      {/* FORMULÁRIO DE DADOS */}
      <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-brand-border space-y-5">
        <h3 className="serif-font text-xl font-bold text-brand-dark mb-4">Meus Dados</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-brand-rose uppercase ml-4">Nascimento</label>
            <input 
              type="date" 
              className="w-full bg-brand-soft border border-brand-border rounded-full px-5 py-3 text-xs font-bold outline-none"
              value={profile.dataNascimento || ''}
              onChange={(e) => setProfile({...profile, dataNascimento: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-brand-rose uppercase ml-4">Filhos Adotados</label>
            <input 
              type="number" 
              className="w-full bg-brand-soft border border-brand-border rounded-full px-5 py-3 text-xs font-bold outline-none"
              value={profile.filhosAdotados || 0}
              onChange={(e) => setProfile({...profile, filhosAdotados: parseInt(e.target.value) || 0})}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-brand-rose uppercase ml-4">Igreja</label>
          <input 
            type="text" 
            placeholder="Sua igreja local"
            className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm outline-none"
            value={profile.igreja || ''}
            onChange={(e) => setProfile({...profile, igreja: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-brand-rose uppercase ml-4">Cidade</label>
            <input 
              type="text" 
              className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm outline-none"
              value={profile.cidade || ''}
              onChange={(e) => setProfile({...profile, cidade: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-brand-rose uppercase ml-4">UF</label>
            <input 
              type="text" 
              maxLength={2}
              className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm outline-none text-center font-bold"
              value={profile.estado || ''}
              onChange={(e) => setProfile({...profile, estado: e.target.value.toUpperCase()})}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-brand-rose uppercase ml-4">Grupo de Déboras</label>
          <input 
            type="text" 
            placeholder="Nome do grupo"
            className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm outline-none"
            value={profile.grupoDeboras || ''}
            onChange={(e) => setProfile({...profile, grupoDeboras: e.target.value})}
          />
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#FF4500] text-white font-black py-4 rounded-full shadow-lg active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50 mt-4"
        >
          {saving ? 'SALVANDO...' : 'ATUALIZAR PERFIL'}
        </button>
      </div>
    </div>
  );
};

export default ProfileView;