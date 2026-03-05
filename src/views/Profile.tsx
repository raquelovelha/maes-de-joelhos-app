import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ProfileView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    nome: '',
    email: '',
    fotoUrl: '',
    cidade: '',
    estado: '',
    dataNascimento: '',
    igreja: '',
    grupoDeboras: '',
    filhosAdotados: 0,
    minutosIntercedidos: 0,
    diasConsecutivos: 0
  });

  // Função veloz para pegar iniciais (Ex: "Lara Liz" -> "LL")
  const getInitials = (name: string) => {
    if (!name) return 'M';
    const names = name.trim().split(' ');
    return names.length > 1 
      ? (names[0][0] + names[names.length - 1][0]).toUpperCase() 
      : names[0][0].toUpperCase();
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "usuarios", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(prev => ({ ...prev, ...docSnap.data() }));
        }
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      const userRef = doc(db, "usuarios", auth.currentUser.uid);
      await updateDoc(userRef, profile);
      alert("Perfil atualizado com sucesso! 🙏");
    } catch (error) {
      alert("Erro ao salvar. Verifique sua conexão.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5F1]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4500]"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-28 px-4 bg-[#FFF5F1] min-h-screen pt-4">
      
      {/* CARD DE CABEÇALHO COM AVATAR */}
      <div className="bg-white rounded-[3.5rem] p-8 shadow-sm border border-orange-50 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-orange-100/40 to-transparent"></div>
        
        <div className="relative mt-4">
          {/* Avatar com Gradiente e Iniciais */}
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#FF4500] to-[#FF8C00]">
            {profile.fotoUrl ? (
              <img src={profile.fotoUrl} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-black text-white tracking-tighter">
                {getInitials(profile.nome)}
              </span>
            )}
          </div>
          
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-md border border-orange-100">
            <p className="text-[9px] font-black text-[#FF4500] uppercase tracking-widest">Intercessora</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="serif-font text-2xl font-bold text-brand-dark">{profile.nome || 'Mãe de Oração'}</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
            {profile.grupoDeboras || 'Geração de Joelhos'}
          </p>
        </div>

        {/* STATS RÁPIDOS */}
        <div className="grid grid-cols-2 gap-4 w-full mt-8">
          <div className="bg-orange-50/50 p-4 rounded-3xl border border-orange-100">
            <p className="text-[9px] font-black text-gray-400 uppercase">Dias Seguidos</p>
            <p className="text-2xl font-black text-[#FF4500]">{profile.diasConsecutivos} 🔥</p>
          </div>
          <div className="bg-pink-50/50 p-4 rounded-3xl border border-pink-100">
            <p className="text-[9px] font-black text-gray-400 uppercase">Minutos Totais</p>
            <p className="text-2xl font-black text-brand-rose">{profile.minutosIntercedidos}</p>
          </div>
        </div>
      </div>

      {/* FORMULÁRIO DE DADOS */}
      <div className="bg-white rounded-[3.5rem] p-8 shadow-sm border border-orange-50 space-y-5">
        <h3 className="serif-font text-xl font-bold text-brand-dark mb-2">Meus Dados</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-brand-rose uppercase ml-4">Nascimento</label>
            <input 
              type="date" 
              className="w-full bg-brand-soft border border-brand-border rounded-full px-5 py-3 text-xs font-bold outline-none"
              value={profile.dataNascimento}
              onChange={(e) => setProfile({...profile, dataNascimento: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-brand-rose uppercase ml-4">Filhos Adotados</label>
            <input 
              type="number" 
              className="w-full bg-brand-soft border border-brand-border rounded-full px-5 py-3 text-xs font-bold outline-none"
              value={profile.filhosAdotados}
              onChange={(e) => setProfile({...profile, filhosAdotados: parseInt(e.target.value) || 0})}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-brand-rose uppercase ml-4">Igreja</label>
          <input 
            type="text" 
            placeholder="Nome da congregação"
            className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm outline-none"
            value={profile.igreja}
            onChange={(e) => setProfile({...profile, igreja: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-brand-rose uppercase ml-4">Cidade</label>
            <input 
              type="text" 
              className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm outline-none"
              value={profile.cidade}
              onChange={(e) => setProfile({...profile, cidade: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-brand-rose uppercase ml-4">Estado (UF)</label>
            <input 
              type="text" 
              maxLength={2}
              className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm outline-none text-center font-bold"
              value={profile.estado}
              onChange={(e) => setProfile({...profile, estado: e.target.value.toUpperCase()})}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-brand-rose uppercase ml-4">Grupo de Déboras</label>
          <input 
            type="text" 
            placeholder="Nome do seu grupo"
            className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm outline-none"
            value={profile.grupoDeboras}
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

      <button 
        onClick={() => auth.signOut()}
        className="w-full text-gray-300 font-bold text-[10px] uppercase tracking-widest py-4 mb-10"
      >
        <i className="fa-solid fa-right-from-bracket mr-2"></i> Sair do Aplicativo
      </button>
    </div>
  );
};

export default ProfileView;
