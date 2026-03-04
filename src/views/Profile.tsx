
// Responsabilidade: Perfil do usuário e validação de selo "Débora Cadastrada"
// Inputs: profile, stats, setProfile | Outputs: JSX

import React, { useState } from 'react';
import { UserProfile, UserStats } from '../types';
import { ActionButton, ProgressBar, InstitutionalFooter } from '../components/UI';
import { formatCPF } from '../utils/helpers';

interface ProfileProps {
  profile: UserProfile;
  stats: UserStats;
  setProfile?: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const ProfileView: React.FC<ProfileProps> = ({ profile, stats, setProfile }) => {
  const [cpfInput, setCpfInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const isVerified = profile.name === "Ricardo Oliveira";

  const handleConsultar = () => {
    if (cpfInput === '123.456.789-00') {
      setProfile?.({
        name: "Ricardo Oliveira",
        photo: "https://picsum.photos/seed/ricardo/400",
        birthDate: "1980-01-15",
        church: "Ministério de Finanças Cristãs",
        participationTime: "5 anos",
        groupName: "Homens de Fé - Finanças"
      });
      setErrorMsg('');
    } else {
      setErrorMsg("Cadastro não encontrado.");
    }
  };

  return (
    <div className="space-y-8 pb-24 animate-fadeIn">
      <div className="bg-white p-6 rounded-[2.5rem] border border-brand-border shadow-sm space-y-4">
        <label className="text-[10px] font-black text-brand-rose uppercase tracking-widest block ml-4">Validação Oficial (CPF)</label>
        <div className="flex gap-2">
          <input 
            type="tel" 
            placeholder="000.000.000-00" 
            value={cpfInput} 
            onChange={(e) => setCpfInput(formatCPF(e.target.value))}
            className="flex-1 bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-rose/20 outline-none"
          />
          <button onClick={handleConsultar} className="bg-brand-rose text-white px-6 rounded-full text-[10px] font-black uppercase">Validar</button>
        </div>
        {errorMsg && <p className="text-[9px] text-red-500 font-bold ml-4">{errorMsg} <a href="https://mpc.transforme.tech/captura/voluntario/cadastrodeboras" target="_blank" className="underline ml-1">Cadastrar</a></p>}
      </div>

      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-24 h-24 rounded-full border-4 border-brand-primary p-1 shadow-lg">
          <img src={profile.photo || "https://picsum.photos/seed/profile/400"} className="w-full h-full object-cover rounded-full" alt="User" />
        </div>
        <div>
          <h2 className="serif-font text-2xl font-bold text-brand-dark">{profile.name}</h2>
          {isVerified && (
            <span className="bg-green-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest inline-flex items-center gap-2 mt-2 shadow-sm animate-fadeIn">
              <i className="fa-solid fa-circle-check"></i> Débora Cadastrada
            </span>
          )}
        </div>
      </div>

      <div className="bg-brand-soft rounded-[2.5rem] p-8 border border-brand-border space-y-6">
        <ProgressBar label="Dias Consecutivos" value={stats.streak} max={30} color="bg-orange-500" />
        <ProgressBar label="Minutos Intercedidos" value={stats.totalMinutes} max={1000} color="bg-brand-primary" />
      </div>

      <div className="space-y-2">
        <ActionButton label="Privacidade" onClick={() => {}} variant="outline" fullWidth icon="fa-shield-halved" />
        <ActionButton label="Sair da Conta" onClick={() => {}} variant="outline" fullWidth icon="fa-right-from-bracket" className="text-red-400 border-red-100" />
      </div>

      <InstitutionalFooter />
    </div>
  );
};

export default ProfileView;
