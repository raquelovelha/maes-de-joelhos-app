import React from 'react';
import { UserProfile } from '../types';
import { INSTITUTIONAL } from '../constants';

interface HomeProps {
  profile: UserProfile;
  onNavigate: (tab: string) => void;
}

const HomeView: React.FC<HomeProps> = ({ profile, onNavigate }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Header de Boas-vindas */}
      <section>
        <h1 className="text-3xl serif-font font-bold text-brand-dark">
          {getGreeting()}, <span className="text-brand-rose">{profile.name.split(' ')[0]}</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">O Senhor tem ouvido o seu clamor.</p>
      </section>

      {/* Versículo do Dia */}
      <section className="bg-white border border-brand-lavender rounded-[2rem] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <i className="fa-solid fa-quote-left text-brand-rose opacity-30 text-xl"></i>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Versículo do Dia</span>
        </div>
        <p className="serif-font text-[#2D1B4D] text-lg font-medium leading-relaxed italic">
          "A oração de um justo é poderosa e eficaz."
        </p>
        <span className="text-brand-rose font-bold text-[10px] mt-3 block uppercase tracking-tighter">Tiago 5:16</span>
      </section>

      {/* BLOCO DE INTELIGÊNCIA: Resumo da última oração */}
      {profile.ultimoResumo && (
        <section className="bg-gradient-to-br from-brand-lavender/20 to-white border border-brand-rose/10 rounded-[2rem] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <i className="fa-solid fa-sparkles text-brand-rose text-[10px]"></i>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-brand-rose">Sua última intercessão</span>
          </div>
          <p className="text-[#2D1B4D] text-sm leading-relaxed italic opacity-90">
            "{profile.ultimoResumo}"
          </p>
        </section>
      )}

      {/* Card Principal: 15 Minutos de Clamor */}
      <section 
        onClick={() => onNavigate('timer')}
        className="bg-[#2D1B4D] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
      >
        <div className="relative z-10">
          <span className="bg-brand-rose px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Disponível agora</span>
          <h2 className="serif-font text-2xl font-bold mt-4 mb-2">15 Minutos de Clamor</h2>
          <p className="text-white/60 text-xs leading-relaxed max-w-[200px]">Inicie sua jornada diária de intercessão pelos seus filhos.</p>
          <div className="mt-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
              <i className="fa-solid fa-play text-xs ml-0.5"></i>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest">Começar agora</span>
          </div>
        </div>
        <i className="fa-solid fa-hands-praying absolute -right-6 -bottom-6 text-9xl opacity-5"></i>
      </section>

      {/* Atalhos Rápidos */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => onNavigate('prayers')} className="bg-white p-5 rounded-[2rem] border border-purple-50 shadow-sm flex flex-col items-start">
          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4"><i className="fa-solid fa-book-bible"></i></div>
          <h3 className="font-bold text-[#2D1B4D] text-sm">Temas</h3>
          <p className="text-[10px] text-gray-400 mt-1">Alvos de oração</p>
        </button>
        <button onClick={() => onNavigate('filhos')} className="bg-white p-5 rounded-[2rem] border border-purple-50 shadow-sm flex flex-col items-start">
          <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-4"><i className="fa-solid fa-child-reaching"></i></div>
          <h3 className="font-bold text-[#2D1B4D] text-sm">Meus Filhos</h3>
          <p className="text-[10px] text-gray-400 mt-1">Gerenciar lista</p>
        </button>
      </div>

      {/* RODAPÉ INSTITUCIONAL */}
      <footer className="mt-8 pt-8 border-t border-brand-lavender flex flex-col items-center gap-6">
        <div className="flex items-center justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
          {/* Logo Desperta Débora */}
          <img src={INSTITUTIONAL.logoUrl} alt="Desperta Débora" className="h-8 w-auto object-contain" />
          {/* Logo Geração Compromisso - Aqui você pode usar a URL da logo se tiver no constants */}
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-[#2D1B4D] tracking-tighter uppercase">Geração</span>
            <span className="text-[8px] font-black text-brand-rose tracking-tighter uppercase mt-[-4px]">Compromisso</span>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
            Um movimento da
          </p>
          <p className="text-[10px] font-black text-[#2D1B4D] uppercase tracking-widest">
            Mocidade para Cristo do Brasil
          </p>
        </div>
        
        <p className="text-[8px] text-gray-400 font-medium">© 2026 {INSTITUTIONAL.ministryName}</p>
      </footer>
    </div>
  );
};

export default HomeView;