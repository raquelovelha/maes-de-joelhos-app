import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ActionButton } from '../components/UI';

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
      alert("Erro ao salvar perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-[#FF4500] font-bold">Carregando...</div>;

  return (
    <div className="space-y-6 animate-fadeIn pb-24 px-2">
      {/* CABEÇALHO DO PERFIL COM FOTO */}
      <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-brand-border flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-orange-100 to-pink-100 opacity-50"></div>
        
        <div className="relative mt-4">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-brand-soft flex items-center justify-center">
            {profile.fotoUrl ? (
              <img src={profile.fotoUrl} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
              <i className="fa-solid fa-user text-4xl text-brand-primary/20"></i>
            )}
          </div>
          <button className="absolute bottom-1 right-1 bg-[#FF4500] text-white w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-md">
            <i className="fa-solid fa-camera text-xs"></i>
          </button>
        </div>

        <h2 className="serif-font text-2xl font-bold text-brand-dark mt-4">{profile.nome || 'Missionária'}</h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{profile.grupoDeboras || 'Débora de Oração'}</p>

        {/* STATS CUSTOMIZADOS */}
        <div className="grid grid-cols-2 gap-4 w-full mt-8">
          <div className="bg-orange-50 p-4 rounded-3xl border border-orange-100">
            <p className="text-[10px] font-black text-[#FF4500] uppercase">Dias Seguidos</p>
            <p className="text-2xl font-black text-[#FF4500]">{profile.diasConsecutivos} 🔥</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-3xl border border-pink-100">
            <p className="text-[10px] font-black text-brand-rose uppercase">Minutos Oração</p>
            <p className="text-2xl font-black text-brand-rose">{profile.minutosIntercedidos}</p>
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
          <label className="text-[9px] font-black text-brand-rose uppercase ml-4">Igreja que frequenta</label>
          <input 
            type="text" 
            placeholder="Ex: Igreja Batista Central"
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
              placeholder="Ex: MG"
              className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm outline-none text-center font-bold"
              value={profile.estado}
              onChange={(e) => setProfile({...profile, estado: e.target.value.toUpperCase()})}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-brand-rose uppercase ml-4">Grupo de Déboras (Opcional)</label>
          <input 
            type="text" 
            placeholder="Nome do seu grupo de intercessão"
            className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm outline-none"
            value={profile.grupoDeboras}
            onChange={(e) => setProfile({...profile, grupoDeboras: e.target.value})}
          />
        </div>

        <div className="pt-4">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#FF4500] text-white font-black py-4 rounded-full shadow-lg active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50"
          >
            {saving ? 'SALVANDO...' : 'ATUALIZAR PERFIL'}
          </button>
        </div>
      </div>

      <button 
        onClick={() => auth.signOut()}
        className="w-full text-gray-400 font-bold text-xs uppercase tracking-widest py-4"
      >
        <i className="fa-solid fa-right-from-bracket mr-2"></i> Sair do Aplicativo
      </button>
    </div>
  );
};

export default ProfileView;