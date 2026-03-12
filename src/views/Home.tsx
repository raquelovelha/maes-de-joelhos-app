import React from 'react';
import { UserProfile } from '../types';

interface HomeProps {
  profile: UserProfile;
  onNavigate: (tab: string) => void;
}

const HomeView: React.FC<HomeProps> = ({ profile, onNavigate }) => {
  // Saudação baseada no horário
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header de Boas-vindas */}
      <section>
        <h1 className="text-3xl serif-font font-bold text-brand-dark">
          {getGreeting()}, <span className="text-brand-rose">{profile.name.split(' ')[0]}</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">O Senhor tem ouvido o seu clamor.</p>
      </section>

      {/* BLOCO DE INTELIGÊNCIA: Resumo da última oração */}
      {profile.ultimoResumo && (
        <section className="bg-gradient-to-br from-white to-brand-rose/5 border border-brand-rose/10 rounded-[2rem] p-6 shadow-sm relative overflow-hidden">
          {/* Decoração sutil */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-brand-rose/5 rounded-full blur-xl"></div>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-brand-rose/10 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-sparkles text-brand-rose text-[10px]"></i>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-brand-rose">
              Sua última intercessão
            </span>
          </div>
          
          <p className="text-[#2D1B4D] text-sm leading-relaxed italic opacity-90 relative z-10">
            "{profile.ultimoResumo}"
          </p>
          
          <button 
            onClick={() => onNavigate('memorial')}
            className="mt-4 text-[9px] font-black uppercase tracking-widest text-brand-rose/60 hover:text-brand-rose flex items-center gap-1"
          >
            Ver diário completo <i className="fa-solid fa-chevron-right text-[7px]"></i>
          </button>
        </section>
      )}

      {/* Card Principal de Ação */}
      <section 
        onClick={() => onNavigate('timer')}
        className="bg-[#2D1B4D] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-purple-900/20 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
      >
        <div className="relative z-10">
          <span className="bg-brand-rose px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            Disponível agora
          </span>
          <h2 className="serif-font text-2xl font-bold mt-4 mb-2">15 Minutos de Clamor</h2>
          <p className="text-white/60 text-xs leading-relaxed max-w-[200px]">
            Inicie sua jornada diária de intercessão pelos seus filhos.
          </p>
          
          <div className="mt-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
              <i className="fa-solid fa-play text-xs ml-0.5"></i>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest">Começar agora</span>
          </div>
        </div>

        {/* Ícone de fundo decorativo */}
        <i className="fa-solid fa-hands-praying absolute -right-6 -bottom-6 text-9xl opacity-5 group-hover:scale-110 transition-transform duration-700"></i>
      </section>

      {/* Grid de Atalhos Rápidos */}
      <section className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => onNavigate('prayers')}
          className="bg-white p-5 rounded-[2rem] border border-purple-50 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
            <i className="fa-solid fa-book-bible"></i>
          </div>
          <h3 className="font-bold text-[#2D1B4D] text-sm">Temas</h3>
          <p className="text-[10px] text-gray-400 mt-1">Alvos de oração</p>
        </div>

        <div 
          onClick={() => onNavigate('filhos')}
          className="bg-white p-5 rounded-[2rem] border border-purple-50 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-4">
            <i className="fa-solid fa-child-reaching"></i>
          </div>
          <h3 className="font-bold text-[#2D1B4D] text-sm">Meus Filhos</h3>
          <p className="text-[10px] text-gray-400 mt-1">Gerenciar lista</p>
        </div>
      </section>

      {/* Card de Comunidade (Estilo Banner) */}
      <section 
        onClick={() => onNavigate('community')}
        className="bg-gradient-to-r from-brand-lavender to-white p-6 rounded-[2rem] border border-brand-rose/10 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand-rose">
            <i className="fa-solid fa-users text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-[#2D1B4D] text-sm">Mães Unidas</h3>
            <p className="text-[10px] text-gray-500">Veja quem está orando agora</p>
          </div>
        </div>
        <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
      </section>
    </div>
  );
};

export default HomeView;