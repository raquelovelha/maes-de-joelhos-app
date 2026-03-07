import React from 'react';
import { UserProfile, UserStats } from '../types';

interface ProfileProps {
  profile: UserProfile;
  stats: UserStats;
  setProfile: (profile: UserProfile) => void;
  onNavigate: (tab: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, stats, onNavigate }) => {
  return (
    <div className="flex flex-col gap-8 pb-24 animate-fadeIn">
      {/* Header Perfil */}
      <div className="flex flex-col items-center gap-4 mt-4">
        <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-brand-rose to-purple-600 p-1 shadow-lg">
          <div className="w-full h-full rounded-[2.3rem] bg-white flex items-center justify-center text-3xl text-brand-rose font-black italic">
            {profile.name.charAt(0)}
          </div>
        </div>
        <div className="text-center">
          <h2 className="serif-font text-2xl font-bold text-[#2D1B4D]">{profile.name}</h2>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{profile.participationTime}</span>
        </div>
      </div>

      {/* Cards de Stats Rápidos */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[2rem] border border-purple-50 shadow-sm text-center">
          <span className="block text-2xl font-black text-brand-rose">{stats.streak}</span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Dias Seguidores</span>
        </div>
        <div className="bg-white p-5 rounded-[2rem] border border-purple-50 shadow-sm text-center">
          <span className="block text-2xl font-black text-[#5c00b8]">{stats.totalMinutes}</span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Minutos de Fé</span>
        </div>
      </div>

      {/* Opções de Menu */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Sua Jornada</h3>
        
        {/* BOTÃO MEMORIAL DE VITÓRIAS */}
        <button 
          onClick={() => onNavigate('memorial')}
          className="w-full bg-white border border-brand-rose/10 p-5 rounded-[2rem] flex items-center gap-4 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-rose/5 flex items-center justify-center text-brand-rose text-xl group-hover:bg-brand-rose group-hover:text-white transition-all">
            <i className="fa-solid fa-book-open"></i>
          </div>
          <div className="text-left flex-1">
            <h4 className="font-bold text-[#2D1B4D] text-sm">Memorial de Vitórias</h4>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Meu Diário de Clamor</p>
          </div>
          <i className="fa-solid fa-chevron-right text-gray-200 group-hover:text-brand-rose transition-colors"></i>
        </button>

        {/* Outras Opções */}
        <div className="bg-white rounded-[2rem] border border-gray-50 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-gray-50 flex items-center gap-4">
            <i className="fa-solid fa-church text-gray-300 w-5"></i>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Igreja</span>
              <span className="text-sm font-bold text-[#2D1B4D]">{profile.church || 'Não informada'}</span>
            </div>
          </div>
          <div className="p-5 flex items-center gap-4">
            <i className="fa-solid fa-users-line text-gray-300 w-5"></i>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Grupo</span>
              <span className="text-sm font-bold text-[#2D1B4D]">{profile.groupName || 'Sem grupo'}</span>
            </div>
          </div>
        </div>
      </div>

      <button className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-red-400 transition-colors py-4">
        Sair da conta
      </button>
    </div>
  );
};

export default Profile;